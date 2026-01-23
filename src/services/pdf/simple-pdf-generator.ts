/**
 * Simple PDF generator that embeds images directly
 * Avoids Playwright/Chromium complexity
 * Each page image becomes a PDF page
 */

import { PDFDocument, rgb } from "pdf-lib";
import sharp from "sharp";

interface PageData {
  pageNumber: number;
  text: string;
  imageUrl: string;
}

interface PdfOptions {
  // Page size in points (72 points = 1 inch)
  widthPoints?: number;
  heightPoints?: number;
  // Book info
  title?: string;
  author?: string;
}

const DEFAULT_OPTIONS: Required<PdfOptions> = {
  widthPoints: 576, // 8 inches
  heightPoints: 720, // 10 inches
  title: "MagicBook",
  author: "MagicBook.uz",
};

/**
 * Download image from URL and convert to PNG buffer
 */
async function downloadImage(url: string): Promise<Buffer> {
  console.log(`[PDF] Downloading image: ${url.substring(0, 80)}...`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Convert to PNG using sharp (handles any format)
  const pngBuffer = await sharp(buffer)
    .png()
    .toBuffer();

  console.log(`[PDF] Downloaded and converted: ${pngBuffer.length} bytes`);
  return pngBuffer;
}

/**
 * Generate PDF from page images
 * Each page image is embedded as a full-page image
 */
export async function generateSimplePDF(
  pages: PageData[],
  options: PdfOptions = {}
): Promise<Buffer> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  console.log(`[PDF] Generating PDF with ${pages.length} pages`);
  console.log(`[PDF] Page size: ${opts.widthPoints}x${opts.heightPoints} points`);

  // Create PDF document
  const pdfDoc = await PDFDocument.create();

  // Set metadata
  pdfDoc.setTitle(opts.title);
  pdfDoc.setAuthor(opts.author);
  pdfDoc.setCreator("MagicBook.uz PDF Generator");
  pdfDoc.setProducer("MagicBook Job Worker");
  pdfDoc.setCreationDate(new Date());

  // Sort pages by page number
  const sortedPages = [...pages].sort((a, b) => a.pageNumber - b.pageNumber);

  // Process each page
  for (const page of sortedPages) {
    console.log(`[PDF] Processing page ${page.pageNumber}...`);

    try {
      // Download and convert image
      const imageBuffer = await downloadImage(page.imageUrl);

      // Embed image in PDF
      const image = await pdfDoc.embedPng(imageBuffer);

      // Create page with image dimensions or default size
      const pageWidth = opts.widthPoints;
      const pageHeight = opts.heightPoints;

      const pdfPage = pdfDoc.addPage([pageWidth, pageHeight]);

      // Calculate scale to fit image while maintaining aspect ratio
      const imageAspect = image.width / image.height;
      const pageAspect = pageWidth / pageHeight;

      let drawWidth: number;
      let drawHeight: number;
      let x: number;
      let y: number;

      if (imageAspect > pageAspect) {
        // Image is wider - fit to width
        drawWidth = pageWidth;
        drawHeight = pageWidth / imageAspect;
        x = 0;
        y = (pageHeight - drawHeight) / 2;
      } else {
        // Image is taller - fit to height
        drawHeight = pageHeight;
        drawWidth = pageHeight * imageAspect;
        x = (pageWidth - drawWidth) / 2;
        y = 0;
      }

      // Draw image centered on page
      pdfPage.drawImage(image, {
        x,
        y,
        width: drawWidth,
        height: drawHeight,
      });

      // Add text overlay if present and not cover page
      if (page.text && page.pageNumber > 0) {
        // Simple text at bottom of page
        const fontSize = 12;
        const textY = 30;
        const textX = 40;
        const maxWidth = pageWidth - 80;

        // Word wrap text
        const words = page.text.split(" ");
        let lines: string[] = [];
        let currentLine = "";

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          // Approximate character width
          if (testLine.length * fontSize * 0.5 > maxWidth) {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) lines.push(currentLine);

        // Draw text lines from bottom
        lines.reverse();
        for (let i = 0; i < Math.min(lines.length, 4); i++) {
          pdfPage.drawText(lines[i] || "", {
            x: textX,
            y: textY + i * (fontSize + 4),
            size: fontSize,
            color: rgb(0.2, 0.2, 0.2),
          });
        }
      }

      console.log(`[PDF] Added page ${page.pageNumber} to PDF`);
    } catch (error) {
      console.error(`[PDF] Error processing page ${page.pageNumber}:`, error);
      throw error;
    }
  }

  // Save PDF
  const pdfBytes = await pdfDoc.save();
  console.log(`[PDF] Generated PDF: ${pdfBytes.length} bytes, ${pdfDoc.getPageCount()} pages`);

  return Buffer.from(pdfBytes);
}
