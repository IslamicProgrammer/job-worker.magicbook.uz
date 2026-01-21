import { Router, Request, Response } from "express";
import { z } from "zod";
import { env } from "../lib/env.js";
import {
  generateCharacterReference,
  generateIllustration,
  type IllustrationInput,
  type CharacterReferenceInput,
} from "../services/illustration-generator.js";

const router = Router();

// Middleware to verify API secret
const verifySecret = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace("Bearer ", "");

  if (!token || token !== env.JOB_WORKER_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
};

router.use(verifySecret);

// Schema for character reference job
const characterReferenceSchema = z.object({
  bookId: z.string(),
  childPhotoUrl: z.string().url(),
  childName: z.string(),
  childGender: z.string().nullable().optional(),
  callbackUrl: z.string().url().optional(),
});

// Schema for illustration job
const illustrationSchema = z.object({
  bookId: z.string(),
  pageNumber: z.number(),
  sceneDescription: z.string(),
  storyText: z.string(),
  childPhotoUrl: z.string().url(),
  childName: z.string(),
  childGender: z.string().nullable().optional(),
  characterReferenceUrl: z.string().url().optional(),
  previousPageUrl: z.string().url().optional(),
  style: z.string().optional(),
  pageType: z.enum(["cover", "story-character", "story-background"]).optional(),
  callbackUrl: z.string().url().optional(),
});

// Schema for batch job (multiple pages)
const batchJobSchema = z.object({
  bookId: z.string(),
  childPhotoUrl: z.string().url(),
  childName: z.string(),
  childGender: z.string().nullable().optional(),
  style: z.string().optional(),
  pages: z.array(z.object({
    pageNumber: z.number(),
    sceneDescription: z.string(),
    storyText: z.string(),
    pageType: z.enum(["cover", "story-character", "story-background"]),
  })),
  callbackUrl: z.string().url(),
});

/**
 * POST /jobs/character-reference
 * Generate character reference image
 */
router.post("/character-reference", async (req: Request, res: Response) => {
  try {
    const input = characterReferenceSchema.parse(req.body);

    console.log(`[Job] Starting character reference for book ${input.bookId}`);

    // Start generation in background
    const jobId = `char-${input.bookId}-${Date.now()}`;

    // Immediately return job ID
    res.json({
      jobId,
      status: "processing",
      message: "Character reference generation started",
    });

    // Process in background
    try {
      const result = await generateCharacterReference(
        {
          childPhotoUrl: input.childPhotoUrl,
          childName: input.childName,
          childGender: input.childGender,
        },
        input.bookId
      );

      // Send callback to main app
      if (input.callbackUrl) {
        await sendCallback(input.callbackUrl, {
          jobId,
          bookId: input.bookId,
          type: "character-reference",
          status: "completed",
          result: {
            imageUrl: result.imageUrl,
          },
        });
      }

      console.log(`[Job] Character reference completed: ${result.imageUrl}`);
    } catch (error) {
      console.error(`[Job] Character reference failed:`, error);

      if (input.callbackUrl) {
        await sendCallback(input.callbackUrl, {
          jobId,
          bookId: input.bookId,
          type: "character-reference",
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  } catch (error) {
    console.error("[Job] Invalid request:", error);
    res.status(400).json({
      error: "Invalid request",
      details: error instanceof z.ZodError ? error.errors : String(error),
    });
  }
});

/**
 * POST /jobs/illustration
 * Generate a single illustration
 */
router.post("/illustration", async (req: Request, res: Response) => {
  try {
    const input = illustrationSchema.parse(req.body);

    console.log(`[Job] Starting illustration for book ${input.bookId} page ${input.pageNumber}`);

    const jobId = `illust-${input.bookId}-${input.pageNumber}-${Date.now()}`;

    // Immediately return job ID
    res.json({
      jobId,
      status: "processing",
      message: "Illustration generation started",
    });

    // Process in background
    try {
      const result = await generateIllustration(
        {
          sceneDescription: input.sceneDescription,
          storyText: input.storyText,
          childPhotoUrl: input.childPhotoUrl,
          childName: input.childName,
          childGender: input.childGender,
          characterReferenceUrl: input.characterReferenceUrl,
          previousPageUrl: input.previousPageUrl,
          style: input.style,
          pageType: input.pageType,
        },
        input.bookId,
        input.pageNumber
      );

      if (input.callbackUrl) {
        await sendCallback(input.callbackUrl, {
          jobId,
          bookId: input.bookId,
          pageNumber: input.pageNumber,
          type: "illustration",
          status: "completed",
          result: {
            imageUrl: result.imageUrl,
          },
        });
      }

      console.log(`[Job] Illustration completed: ${result.imageUrl}`);
    } catch (error) {
      console.error(`[Job] Illustration failed:`, error);

      if (input.callbackUrl) {
        await sendCallback(input.callbackUrl, {
          jobId,
          bookId: input.bookId,
          pageNumber: input.pageNumber,
          type: "illustration",
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  } catch (error) {
    console.error("[Job] Invalid request:", error);
    res.status(400).json({
      error: "Invalid request",
      details: error instanceof z.ZodError ? error.errors : String(error),
    });
  }
});

/**
 * POST /jobs/batch
 * Generate full book (character reference + all pages)
 */
router.post("/batch", async (req: Request, res: Response) => {
  try {
    const input = batchJobSchema.parse(req.body);

    console.log(`[Job] Starting batch generation for book ${input.bookId} (${input.pages.length} pages)`);

    const jobId = `batch-${input.bookId}-${Date.now()}`;

    // Immediately return job ID
    res.json({
      jobId,
      status: "processing",
      message: `Batch generation started for ${input.pages.length} pages`,
      totalPages: input.pages.length,
    });

    // Process in background
    processBatchJob(jobId, input).catch(error => {
      console.error(`[Job] Batch job failed:`, error);
    });
  } catch (error) {
    console.error("[Job] Invalid request:", error);
    res.status(400).json({
      error: "Invalid request",
      details: error instanceof z.ZodError ? error.errors : String(error),
    });
  }
});

/**
 * Process batch job (all pages sequentially)
 */
async function processBatchJob(jobId: string, input: z.infer<typeof batchJobSchema>) {
  const results: Array<{
    pageNumber: number;
    imageUrl?: string;
    backgroundUrl?: string;
    error?: string;
  }> = [];

  let characterReferenceUrl: string | undefined;
  let previousPageUrl: string | undefined;

  try {
    // Step 1: Generate character reference
    console.log(`[Batch ${jobId}] Step 1: Generating character reference...`);

    await sendCallback(input.callbackUrl, {
      jobId,
      bookId: input.bookId,
      type: "batch-progress",
      status: "processing",
      step: "character-reference",
      progress: 0,
      message: "Generating character reference...",
    });

    const charRefResult = await generateCharacterReference(
      {
        childPhotoUrl: input.childPhotoUrl,
        childName: input.childName,
        childGender: input.childGender,
      },
      input.bookId
    );

    characterReferenceUrl = charRefResult.imageUrl;

    await sendCallback(input.callbackUrl, {
      jobId,
      bookId: input.bookId,
      type: "character-reference-complete",
      status: "completed",
      result: { imageUrl: characterReferenceUrl },
    });

    // Step 2: Generate each page
    for (let i = 0; i < input.pages.length; i++) {
      const page = input.pages[i]!;
      const progress = Math.round(((i + 1) / input.pages.length) * 100);

      console.log(`[Batch ${jobId}] Step ${i + 2}: Generating page ${page.pageNumber} (${page.pageType})...`);

      await sendCallback(input.callbackUrl, {
        jobId,
        bookId: input.bookId,
        type: "batch-progress",
        status: "processing",
        step: "illustration",
        pageNumber: page.pageNumber,
        progress,
        message: `Generating page ${page.pageNumber}...`,
      });

      try {
        const result = await generateIllustration(
          {
            sceneDescription: page.sceneDescription,
            storyText: page.storyText,
            childPhotoUrl: input.childPhotoUrl,
            childName: input.childName,
            childGender: input.childGender,
            characterReferenceUrl,
            previousPageUrl,
            style: input.style,
            pageType: page.pageType,
          },
          input.bookId,
          page.pageNumber
        );

        // Update previous page URL for next iteration (only for character pages)
        if (page.pageType === "story-character") {
          previousPageUrl = result.imageUrl;
        }

        results.push({
          pageNumber: page.pageNumber,
          imageUrl: page.pageType === "story-background" ? undefined : result.imageUrl,
          backgroundUrl: page.pageType === "story-background" ? result.imageUrl : undefined,
        });

        // Send individual page callback
        await sendCallback(input.callbackUrl, {
          jobId,
          bookId: input.bookId,
          type: "page-complete",
          status: "completed",
          pageNumber: page.pageNumber,
          pageType: page.pageType,
          result: {
            imageUrl: result.imageUrl,
          },
        });
      } catch (error) {
        console.error(`[Batch ${jobId}] Page ${page.pageNumber} failed:`, error);
        results.push({
          pageNumber: page.pageNumber,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // Step 3: Send final completion callback
    const failedPages = results.filter(r => r.error);

    await sendCallback(input.callbackUrl, {
      jobId,
      bookId: input.bookId,
      type: "batch-complete",
      status: failedPages.length === 0 ? "completed" : "partial",
      characterReferenceUrl,
      results,
      totalPages: input.pages.length,
      successfulPages: results.length - failedPages.length,
      failedPages: failedPages.length,
    });

    console.log(`[Batch ${jobId}] Completed: ${results.length - failedPages.length}/${input.pages.length} pages`);
  } catch (error) {
    console.error(`[Batch ${jobId}] Fatal error:`, error);

    await sendCallback(input.callbackUrl, {
      jobId,
      bookId: input.bookId,
      type: "batch-complete",
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error",
      results,
    });
  }
}

/**
 * Send callback to main app
 */
async function sendCallback(callbackUrl: string, data: Record<string, any>) {
  try {
    const response = await fetch(callbackUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.MAIN_APP_SECRET}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error(`[Callback] Failed to send callback: ${response.status}`);
    }
  } catch (error) {
    console.error(`[Callback] Error sending callback:`, error);
  }
}

/**
 * GET /jobs/health
 * Health check endpoint
 */
router.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

export default router;
