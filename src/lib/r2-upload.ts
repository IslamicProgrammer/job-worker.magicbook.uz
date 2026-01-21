import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "./env.js";

// Initialize R2 client
const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

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

  await r2Client.send(
    new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
      Body: imageBuffer,
      ContentType: contentType,
    })
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

  await r2Client.send(
    new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
      Body: imageBuffer,
      ContentType: contentType,
    })
  );

  const url = `${env.R2_PUBLIC_URL}/${key}`;
  console.log(`[R2 Upload] Uploaded background: ${url}`);

  return { url, key };
}
