import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "./env.js";

// Initialize R2 client with retry configuration
const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
  // SDK-level retry configuration
  maxAttempts: 3,
});

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_DELAY_MS = 1000;

/**
 * Sleep helper
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry wrapper with exponential backoff for upload operations
 */
async function withRetry<T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const errorCode = (error as { code?: string })?.code || "";
      const errorMessage = lastError.message;

      // Check if error is retryable (network errors, timeouts, EPIPE)
      const isRetryable =
        errorCode === "EPIPE" ||
        errorCode === "ECONNRESET" ||
        errorCode === "ETIMEDOUT" ||
        errorCode === "ENOTFOUND" ||
        errorCode === "EAI_AGAIN" ||
        errorMessage.includes("EPIPE") ||
        errorMessage.includes("socket hang up") ||
        errorMessage.includes("network") ||
        errorMessage.includes("timeout");

      if (!isRetryable || attempt === MAX_RETRIES) {
        console.error(
          `[R2 Upload] ${operationName} failed after ${attempt} attempt(s):`,
          errorMessage
        );
        throw lastError;
      }

      const delay = INITIAL_DELAY_MS * Math.pow(2, attempt - 1);
      console.warn(
        `[R2 Upload] ${operationName} failed (attempt ${attempt}/${MAX_RETRIES}): ${errorMessage}. Retrying in ${delay}ms...`
      );
      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Upload page image to R2
 * @param imageBuffer - Image buffer to upload
 * @param bookId - Book ID for organizing files
 * @param pageNumber - Page number (-1 for character reference)
 * @param contentType - MIME type of the image
 * @returns Object with the public URL and key
 */
export async function uploadPageImage(
  imageBuffer: Buffer,
  bookId: string,
  pageNumber: number,
  contentType: string = "image/jpeg"
): Promise<{ url: string; key: string }> {
  const timestamp = Date.now();
  const pageLabel = pageNumber === -1 ? "character-ref" : `page-${pageNumber}`;
  const extension = contentType === "image/png" ? "png" : "jpg";
  const key = `books/${bookId}/${pageLabel}-${timestamp}.${extension}`;

  console.log(`[R2 Upload] Uploading ${key} (${imageBuffer.length} bytes)`);

  await withRetry(
    () =>
      r2Client.send(
        new PutObjectCommand({
          Bucket: env.R2_BUCKET_NAME,
          Key: key,
          Body: imageBuffer,
          ContentType: contentType,
        })
      ),
    `Page image ${pageLabel}`
  );

  const url = `${env.R2_PUBLIC_URL}/${key}`;
  console.log(`[R2 Upload] Uploaded: ${url}`);

  return { url, key };
}

/**
 * Upload background image to R2
 */
export async function uploadBackgroundImage(
  imageBuffer: Buffer,
  bookId: string,
  pageNumber: number,
  contentType: string = "image/jpeg"
): Promise<{ url: string; key: string }> {
  const timestamp = Date.now();
  const extension = contentType === "image/png" ? "png" : "jpg";
  const key = `books/${bookId}/bg-page-${pageNumber}-${timestamp}.${extension}`;

  console.log(`[R2 Upload] Uploading background ${key} (${imageBuffer.length} bytes)`);

  await withRetry(
    () =>
      r2Client.send(
        new PutObjectCommand({
          Bucket: env.R2_BUCKET_NAME,
          Key: key,
          Body: imageBuffer,
          ContentType: contentType,
        })
      ),
    `Background image page-${pageNumber}`
  );

  const url = `${env.R2_PUBLIC_URL}/${key}`;
  console.log(`[R2 Upload] Uploaded background: ${url}`);

  return { url, key };
}

/**
 * Upload PDF to R2
 */
export async function uploadPDF(
  pdfBuffer: Buffer,
  bookId: string,
  format: string = "RGB"
): Promise<{ url: string; key: string }> {
  const timestamp = Date.now();
  const key = `books/${bookId}/print-ready-${format.toLowerCase()}-${timestamp}.pdf`;

  console.log(`[R2 Upload] Uploading PDF ${key} (${pdfBuffer.length} bytes)`);

  await withRetry(
    () =>
      r2Client.send(
        new PutObjectCommand({
          Bucket: env.R2_BUCKET_NAME,
          Key: key,
          Body: pdfBuffer,
          ContentType: "application/pdf",
        })
      ),
    "PDF"
  );

  const url = `${env.R2_PUBLIC_URL}/${key}`;
  console.log(`[R2 Upload] Uploaded PDF: ${url}`);

  return { url, key };
}
