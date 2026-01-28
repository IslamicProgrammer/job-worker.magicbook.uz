/**
 * Simple Database-Based Job Queue Worker
 *
 * Polls PostgreSQL for PENDING jobs and processes ONE at a time.
 * No Redis, no BullMQ, no external services.
 */

import { PrismaClient } from "../generated/prisma/index.js";
import {
  generateCharacterReference,
  generateIllustration,
} from "./services/illustration-generator.js";
import { uploadPDF } from "./lib/r2-upload.js";
import { generateSimplePDF } from "./services/pdf/simple-pdf-generator.js";
import { generateStory, createPageRecords } from "./services/story-generator.js";

const prisma = new PrismaClient();

// Configuration
const POLL_INTERVAL_MS = 5000; // Check for new jobs every 5 seconds
const MAX_RETRIES = 3;
const STUCK_JOB_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes - jobs older than this are considered stuck

let isProcessing = false;
let shouldStop = false;

/**
 * Recover stuck jobs on startup
 * Jobs that were left in intermediate states (GENERATING_STORY, GENERATING_IMAGES, ASSEMBLING_PDF)
 * from a previous crash are reset to PENDING for retry
 */
async function recoverStuckJobs(): Promise<void> {
  const stuckTimeout = new Date(Date.now() - STUCK_JOB_TIMEOUT_MS);

  // Find jobs stuck in intermediate states
  const stuckJobs = await prisma.generationJob.findMany({
    where: {
      status: {
        in: ["GENERATING_STORY", "GENERATING_IMAGES", "ASSEMBLING_PDF"],
      },
      updatedAt: {
        lt: stuckTimeout, // Only reset jobs that have been stuck for a while
      },
    },
  });

  if (stuckJobs.length === 0) {
    console.log("[Worker] No stuck jobs found");
    return;
  }

  console.log(`[Worker] Found ${stuckJobs.length} stuck job(s), recovering...`);

  for (const job of stuckJobs) {
    const newRetryCount = job.retryCount + 1;

    if (newRetryCount < MAX_RETRIES) {
      // Reset to PENDING for retry
      await prisma.generationJob.update({
        where: { id: job.id },
        data: {
          status: "PENDING",
          retryCount: newRetryCount,
          errorMessage: `Recovered from stuck state (${job.status}). Retry ${newRetryCount}/${MAX_RETRIES}`,
        },
      });
      console.log(`[Worker] Recovered job ${job.id} (retry ${newRetryCount}/${MAX_RETRIES})`);
    } else {
      // Max retries exceeded, mark as failed
      await prisma.generationJob.update({
        where: { id: job.id },
        data: {
          status: "FAILED",
          retryCount: newRetryCount,
          errorMessage: `Job stuck in ${job.status} state, max retries exceeded`,
        },
      });
      await prisma.book.update({
        where: { id: job.bookId },
        data: { status: "FAILED" },
      });
      console.log(`[Worker] Job ${job.id} marked as FAILED (max retries exceeded)`);
    }
  }
}

/**
 * Main worker loop - polls DB for pending jobs
 */
export async function startWorker(): Promise<void> {
  console.log(`
╔═══════════════════════════════════════════════════╗
║     Job Queue Worker Started                      ║
║     Polling every ${POLL_INTERVAL_MS / 1000}s for pending jobs            ║
╚═══════════════════════════════════════════════════╝
  `);

  // Recover any stuck jobs from previous crashes
  await recoverStuckJobs();

  let lastRecoveryCheck = Date.now();
  const RECOVERY_CHECK_INTERVAL_MS = 5 * 60 * 1000; // Check for stuck jobs every 5 minutes

  while (!shouldStop) {
    try {
      if (!isProcessing) {
        await processNextJob();
      }

      // Periodically check for stuck jobs (every 5 minutes)
      if (Date.now() - lastRecoveryCheck > RECOVERY_CHECK_INTERVAL_MS) {
        await recoverStuckJobs();
        lastRecoveryCheck = Date.now();
      }
    } catch (error) {
      console.error("[Worker] Polling error:", error);
    }

    await sleep(POLL_INTERVAL_MS);
  }

  console.log("[Worker] Stopped");
}

/**
 * Gracefully stop the worker
 */
export function stopWorker(): void {
  console.log("[Worker] Stopping...");
  shouldStop = true;
}

/**
 * Process the next pending job (if any)
 */
async function processNextJob(): Promise<void> {
  // Atomically claim the oldest pending job
  // Using raw query for atomic UPDATE...RETURNING
  const jobs = await prisma.$queryRaw<Array<{ id: string }>>`
    UPDATE "GenerationJob"
    SET
      status = 'GENERATING_STORY',
      "updatedAt" = NOW()
    WHERE id = (
      SELECT id
      FROM "GenerationJob"
      WHERE status = 'PENDING'
      ORDER BY "createdAt" ASC
      LIMIT 1
      FOR UPDATE SKIP LOCKED
    )
    RETURNING id
  `;

  if (!jobs || jobs.length === 0) {
    return; // No pending jobs
  }

  const jobId = jobs[0]!.id;
  isProcessing = true;

  console.log(`[Worker] Processing job ${jobId}`);

  try {
    // Get full job details with book and pages
    const job = await prisma.generationJob.findUnique({
      where: { id: jobId },
      include: {
        book: {
          include: {
            childInput: true,
            genre: true,
            pages: {
              orderBy: { pageNumber: "asc" },
            },
          },
        },
      },
    });

    if (!job) {
      throw new Error("Job not found after claiming");
    }

    await processBookGeneration(job);

    // Mark as completed
    await prisma.generationJob.update({
      where: { id: jobId },
      data: {
        status: "COMPLETED",
        progress: 100,
        completedAt: new Date(),
      },
    });

    // Update book status
    await prisma.book.update({
      where: { id: job.bookId },
      data: { status: "COMPLETED" },
    });

    console.log(`[Worker] Job ${jobId} completed successfully`);
  } catch (error) {
    console.error(`[Worker] Job ${jobId} failed:`, error);

    // Update job with error
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    const updatedJob = await prisma.generationJob.update({
      where: { id: jobId },
      data: {
        status: "FAILED",
        errorMessage,
        retryCount: { increment: 1 },
      },
    });

    // Retry if under max retries
    if (updatedJob.retryCount < MAX_RETRIES) {
      console.log(`[Worker] Retrying job ${jobId} (attempt ${updatedJob.retryCount + 1}/${MAX_RETRIES})`);
      await prisma.generationJob.update({
        where: { id: jobId },
        data: { status: "PENDING" },
      });
    } else {
      // Mark book as failed
      await prisma.book.update({
        where: { id: updatedJob.bookId },
        data: { status: "FAILED" },
      });
    }
  } finally {
    isProcessing = false;
  }
}

/**
 * Process book generation: story -> illustrations -> PDF
 */
async function processBookGeneration(job: Awaited<ReturnType<typeof getJobWithDetails>>): Promise<void> {
  if (!job) throw new Error("Job is null");

  const { book } = job;
  const childInput = book.childInput;
  const genre = book.genre;

  console.log(`[Worker] Generating book for ${childInput.name} (${genre.nameUz})`);

  // Step 1: Generate story if no pages exist
  let pages = book.pages;

  if (pages.length === 0) {
    console.log(`[Worker] No pages found - generating story...`);
    await updateProgress(job.id, "GENERATING_STORY", 5, "Generating story...");

    const story = await generateStory({
      childName: childInput.name,
      childAge: childInput.age,
      childGender: childInput.gender,
      genreName: genre.nameUz,
      genreDescription: genre.description,
      ageCategory: book.ageCategory,
      theme: book.theme,
      subject: book.subject,
      illustrationStyle: book.illustrationStyle ?? "ANIMATION_3D",
    });

    console.log(`[Worker] Story generated: "${story.title}" with ${story.pages.length} pages`);

    // Create page records in database
    const pageRecords = createPageRecords(book.id, story);
    await prisma.page.createMany({
      data: pageRecords,
    });

    console.log(`[Worker] Created ${pageRecords.length} page records`);

    // Fetch the newly created pages
    pages = await prisma.page.findMany({
      where: { bookId: book.id },
      orderBy: { pageNumber: "asc" },
    });
  }

  // Step 2: Generate character reference
  await updateProgress(job.id, "GENERATING_STORY", 15, "Generating character reference...");

  const charRef = await generateCharacterReference(
    {
      childPhotoUrl: childInput.photoUrl,
      childName: childInput.name,
      childGender: childInput.gender,
      style: book.illustrationStyle ?? "ANIMATION_3D",
    },
    book.id
  );

  console.log(`[Worker] Character reference: ${charRef.imageUrl}`);

  // Save character reference URL to book
  await prisma.book.update({
    where: { id: book.id },
    data: { characterReferenceUrl: charRef.imageUrl },
  });

  // Step 3: Generate illustrations for each page
  await updateProgress(job.id, "GENERATING_IMAGES", 20, "Generating illustrations...");

  let previousPageUrl: string | undefined;
  const totalPages = pages.length;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i]!;
    const progress = 20 + Math.round((i / totalPages) * 60); // 20-80%

    console.log(`[Worker] Generating page ${page.pageNumber} (${i + 1}/${totalPages})`);

    await updateProgress(
      job.id,
      "GENERATING_IMAGES",
      progress,
      `Generating page ${page.pageNumber}...`
    );

    const pageType = page.pageNumber === 0 ? "cover" : "story-character";

    const result = await generateIllustration(
      {
        sceneDescription: page.sceneDescription ?? page.text,
        storyText: page.text,
        childPhotoUrl: childInput.photoUrl,
        childName: childInput.name,
        childGender: childInput.gender,
        characterReferenceUrl: charRef.imageUrl,
        previousPageUrl,
        style: book.illustrationStyle ?? "ANIMATION_3D",
        pageType,
      },
      book.id,
      page.pageNumber
    );

    // Update page with image URL
    await prisma.page.update({
      where: { id: page.id },
      data: { imageUrl: result.imageUrl },
    });

    // Use this as reference for next page
    previousPageUrl = result.imageUrl;
  }

  // Step 3: Generate PDF
  await updateProgress(job.id, "ASSEMBLING_PDF", 85, "Generating PDF...");

  // Get updated pages with image URLs
  const updatedPages = await prisma.page.findMany({
    where: { bookId: book.id },
    orderBy: { pageNumber: "asc" },
  });

  const pdfPages = updatedPages.map((p) => ({
    pageNumber: p.pageNumber,
    text: p.text,
    imageUrl: p.imageUrl!,
  }));

  const bookTitle = updatedPages[0]?.text ?? `${childInput.name}ning Sarguzashti`;

  const pdfBuffer = await generateSimplePDF(
    pdfPages,
    bookTitle,
    childInput.name,
    childInput.photoUrl
  );

  // Upload PDF
  await updateProgress(job.id, "ASSEMBLING_PDF", 95, "Uploading PDF...");

  const { url: pdfUrl } = await uploadPDF(pdfBuffer, book.id, "RGB");

  // Update book with PDF URL
  await prisma.book.update({
    where: { id: book.id },
    data: { pdfUrl },
  });

  console.log(`[Worker] PDF uploaded: ${pdfUrl}`);
}

/**
 * Update job progress
 */
async function updateProgress(
  jobId: string,
  status: "GENERATING_STORY" | "GENERATING_IMAGES" | "ASSEMBLING_PDF",
  progress: number,
  message: string
): Promise<void> {
  await prisma.generationJob.update({
    where: { id: jobId },
    data: { status, progress },
  });
  console.log(`[Worker] Progress: ${progress}% - ${message}`);
}

/**
 * Helper to get job with all details
 */
async function getJobWithDetails(jobId: string) {
  return prisma.generationJob.findUnique({
    where: { id: jobId },
    include: {
      book: {
        include: {
          childInput: true,
          genre: true,
          pages: {
            orderBy: { pageNumber: "asc" },
          },
        },
      },
    },
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  stopWorker();
  prisma.$disconnect();
});

process.on("SIGTERM", () => {
  stopWorker();
  prisma.$disconnect();
});
