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

const prisma = new PrismaClient();

// Configuration
const POLL_INTERVAL_MS = 5000; // Check for new jobs every 5 seconds
const MAX_RETRIES = 3;

let isProcessing = false;
let shouldStop = false;

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

  while (!shouldStop) {
    try {
      if (!isProcessing) {
        await processNextJob();
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

  // Step 1: Generate character reference
  await updateProgress(job.id, "GENERATING_STORY", 5, "Generating character reference...");

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

  // Step 2: Generate illustrations for each page
  await updateProgress(job.id, "GENERATING_IMAGES", 10, "Generating illustrations...");

  let previousPageUrl: string | undefined;
  const totalPages = book.pages.length;

  for (let i = 0; i < book.pages.length; i++) {
    const page = book.pages[i]!;
    const progress = 10 + Math.round((i / totalPages) * 70); // 10-80%

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
