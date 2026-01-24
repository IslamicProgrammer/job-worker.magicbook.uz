/**
 * Full-featured PDF generator using pdf-lib
 * Creates professional children's book PDF with:
 * - Cover page (image + title)
 * - Title page
 * - Story pages (image on left, text on right)
 * - Back cover with branding
 *
 * Works on Vercel without Playwright/Chromium
 */

import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

interface PageData {
  pageNumber: number;
  text: string;
  imageUrl: string;
}

// Page dimensions (8x10 inches at 72 points/inch)
const PAGE_WIDTH = 576;  // 8 inches
const PAGE_HEIGHT = 720; // 10 inches

// Colors
const PRIMARY_COLOR = rgb(0.4, 0.2, 0.6); // Purple
const TEXT_COLOR = rgb(0.2, 0.2, 0.2);
const LIGHT_GRAY = rgb(0.95, 0.95, 0.95);

/**
 * Download image and return as buffer
 */
async function downloadImage(url: string): Promise<Buffer> {
  console.log(`[PDF] Downloading: ${url.substring(0, 60)}...`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Detect image type from buffer
 */
function detectImageType(buffer: Buffer): "png" | "jpeg" {
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return "png";
  }
  return "jpeg";
}

/**
 * Embed image in PDF document
 */
async function embedImage(pdfDoc: PDFDocument, imageBuffer: Buffer) {
  const imageType = detectImageType(imageBuffer);
  if (imageType === "png") {
    return await pdfDoc.embedPng(imageBuffer);
  }
  return await pdfDoc.embedJpg(imageBuffer);
}

/**
 * Sanitize text for PDF rendering - remove/replace characters that can't be encoded
 */
function sanitizeText(text: string): string {
  return text
    .replace(/\r\n/g, ' ')  // Windows newlines
    .replace(/\n/g, ' ')     // Unix newlines
    .replace(/\r/g, ' ')     // Old Mac newlines
    .replace(/\t/g, ' ')     // Tabs
    .replace(/\s+/g, ' ')    // Multiple spaces to single
    .trim();
}

/**
 * Word wrap text to fit within maxWidth
 */
function wrapText(text: string, font: any, fontSize: number, maxWidth: number): string[] {
  // Sanitize text first to remove newlines and special characters
  const cleanText = sanitizeText(text);
  const words = cleanText.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if (!word) continue; // Skip empty words
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);

    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * Generate complete book PDF
 */
export async function generateSimplePDF(
  pages: PageData[],
  title: string,
  childName: string
): Promise<Buffer> {
  console.log(`[PDF] Generating full book PDF with ${pages.length} story pages`);

  const pdfDoc = await PDFDocument.create();

  // Register fontkit for custom fonts (if needed later)
  pdfDoc.registerFontkit(fontkit);

  // Set metadata
  pdfDoc.setTitle(title);
  pdfDoc.setAuthor(`${childName} - MagicBook.uz`);
  pdfDoc.setCreator("MagicBook.uz");
  pdfDoc.setProducer("MagicBook PDF Generator");
  pdfDoc.setCreationDate(new Date());

  // Embed standard fonts
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  // Sort pages by page number
  const sortedPages = [...pages].sort((a, b) => a.pageNumber - b.pageNumber);
  const coverPage = sortedPages.find(p => p.pageNumber === 0);
  const storyPages = sortedPages.filter(p => p.pageNumber > 0);

  // ============================================
  // 1. COVER PAGE - Full image with title overlay
  // ============================================
  if (coverPage) {
    console.log(`[PDF] Creating cover page...`);
    const cover = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

    try {
      const imageBuffer = await downloadImage(coverPage.imageUrl);
      const image = await embedImage(pdfDoc, imageBuffer);

      // Draw full-page image
      const scale = Math.max(PAGE_WIDTH / image.width, PAGE_HEIGHT / image.height);
      const drawWidth = image.width * scale;
      const drawHeight = image.height * scale;
      const x = (PAGE_WIDTH - drawWidth) / 2;
      const y = (PAGE_HEIGHT - drawHeight) / 2;

      cover.drawImage(image, { x, y, width: drawWidth, height: drawHeight });

      // Title text at bottom with background
      const titleFontSize = 28;
      const cleanTitle = sanitizeText(title);
      const titleWidth = helveticaBold.widthOfTextAtSize(cleanTitle, titleFontSize);

      // Semi-transparent background for title
      cover.drawRectangle({
        x: 0,
        y: 0,
        width: PAGE_WIDTH,
        height: 80,
        color: rgb(1, 1, 1),
        opacity: 0.85,
      });

      cover.drawText(cleanTitle, {
        x: (PAGE_WIDTH - titleWidth) / 2,
        y: 35,
        size: titleFontSize,
        font: helveticaBold,
        color: PRIMARY_COLOR,
      });
    } catch (error) {
      console.error(`[PDF] Cover page error:`, error);
    }
  }

  // ============================================
  // 2. TITLE PAGE - Clean typography
  // ============================================
  console.log(`[PDF] Creating title page...`);
  const titlePage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  // Background
  titlePage.drawRectangle({
    x: 0, y: 0,
    width: PAGE_WIDTH, height: PAGE_HEIGHT,
    color: rgb(1, 1, 1),
  });

  // Decorative line
  titlePage.drawRectangle({
    x: PAGE_WIDTH / 2 - 100,
    y: PAGE_HEIGHT / 2 + 80,
    width: 200,
    height: 3,
    color: PRIMARY_COLOR,
  });

  // Title
  const mainTitleSize = 32;
  const titleLines = wrapText(title, helveticaBold, mainTitleSize, PAGE_WIDTH - 100);
  let yPos = PAGE_HEIGHT / 2 + 40;
  for (const line of titleLines) {
    const lineWidth = helveticaBold.widthOfTextAtSize(line, mainTitleSize);
    titlePage.drawText(line, {
      x: (PAGE_WIDTH - lineWidth) / 2,
      y: yPos,
      size: mainTitleSize,
      font: helveticaBold,
      color: PRIMARY_COLOR,
    });
    yPos -= mainTitleSize + 10;
  }

  // Child name
  const childText = `${childName} uchun maxsus kitob`;
  const childTextWidth = timesItalic.widthOfTextAtSize(childText, 18);
  titlePage.drawText(childText, {
    x: (PAGE_WIDTH - childTextWidth) / 2,
    y: PAGE_HEIGHT / 2 - 60,
    size: 18,
    font: timesItalic,
    color: TEXT_COLOR,
  });

  // Decorative line
  titlePage.drawRectangle({
    x: PAGE_WIDTH / 2 - 100,
    y: PAGE_HEIGHT / 2 - 100,
    width: 200,
    height: 3,
    color: PRIMARY_COLOR,
  });

  // MagicBook.uz at bottom
  const brandText = "MagicBook.uz";
  const brandWidth = helvetica.widthOfTextAtSize(brandText, 14);
  titlePage.drawText(brandText, {
    x: (PAGE_WIDTH - brandWidth) / 2,
    y: 50,
    size: 14,
    font: helvetica,
    color: rgb(0.5, 0.5, 0.5),
  });

  // ============================================
  // 3. STORY PAGES - Image left, Text right (spreads)
  // ============================================
  for (let i = 0; i < storyPages.length; i++) {
    const page = storyPages[i]!;
    console.log(`[PDF] Creating story page ${page.pageNumber}...`);

    // LEFT PAGE - Full illustration (no text)
    const leftPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

    try {
      const imageBuffer = await downloadImage(page.imageUrl);
      const image = await embedImage(pdfDoc, imageBuffer);

      // Draw full-page image
      const scale = Math.max(PAGE_WIDTH / image.width, PAGE_HEIGHT / image.height);
      const drawWidth = image.width * scale;
      const drawHeight = image.height * scale;
      const x = (PAGE_WIDTH - drawWidth) / 2;
      const y = (PAGE_HEIGHT - drawHeight) / 2;

      leftPage.drawImage(image, { x, y, width: drawWidth, height: drawHeight });

      // Page number at bottom
      const pageNumText = `${(i + 1) * 2}`;
      const pageNumWidth = helvetica.widthOfTextAtSize(pageNumText, 10);
      leftPage.drawText(pageNumText, {
        x: (PAGE_WIDTH - pageNumWidth) / 2,
        y: 20,
        size: 10,
        font: helvetica,
        color: rgb(0.6, 0.6, 0.6),
      });
    } catch (error) {
      console.error(`[PDF] Story page ${page.pageNumber} image error:`, error);
    }

    // RIGHT PAGE - Text only (elegant)
    const rightPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

    // Cream/off-white background
    rightPage.drawRectangle({
      x: 0, y: 0,
      width: PAGE_WIDTH, height: PAGE_HEIGHT,
      color: rgb(0.99, 0.98, 0.96),
    });

    // Text content
    if (page.text) {
      const textFontSize = 16;
      const lineHeight = 28;
      const margin = 60;
      const maxTextWidth = PAGE_WIDTH - margin * 2;

      const lines = wrapText(page.text, timesRoman, textFontSize, maxTextWidth);

      // Center text vertically
      const totalTextHeight = lines.length * lineHeight;
      let textY = (PAGE_HEIGHT + totalTextHeight) / 2;

      for (const line of lines) {
        // Center each line
        const lineWidth = timesRoman.widthOfTextAtSize(line, textFontSize);
        rightPage.drawText(line, {
          x: (PAGE_WIDTH - lineWidth) / 2,
          y: textY,
          size: textFontSize,
          font: timesRoman,
          color: TEXT_COLOR,
        });
        textY -= lineHeight;
      }
    }

    // Page number at bottom
    const rightPageNum = `${(i + 1) * 2 + 1}`;
    const rightPageNumWidth = helvetica.widthOfTextAtSize(rightPageNum, 10);
    rightPage.drawText(rightPageNum, {
      x: (PAGE_WIDTH - rightPageNumWidth) / 2,
      y: 20,
      size: 10,
      font: helvetica,
      color: rgb(0.6, 0.6, 0.6),
    });
  }

  // ============================================
  // 4. BACK COVER - Branding
  // ============================================
  console.log(`[PDF] Creating back cover...`);
  const backCover = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  // Gradient-like background (solid purple)
  backCover.drawRectangle({
    x: 0, y: 0,
    width: PAGE_WIDTH, height: PAGE_HEIGHT,
    color: rgb(0.95, 0.93, 0.98),
  });

  // Logo text
  const logoText = "MagicBook.uz";
  const logoSize = 36;
  const logoWidth = helveticaBold.widthOfTextAtSize(logoText, logoSize);
  backCover.drawText(logoText, {
    x: (PAGE_WIDTH - logoWidth) / 2,
    y: PAGE_HEIGHT / 2 + 50,
    size: logoSize,
    font: helveticaBold,
    color: PRIMARY_COLOR,
  });

  // Tagline
  const tagline = "Bolalar uchun shaxsiylashtirilgan kitoblar";
  const taglineWidth = timesItalic.widthOfTextAtSize(tagline, 16);
  backCover.drawText(tagline, {
    x: (PAGE_WIDTH - taglineWidth) / 2,
    y: PAGE_HEIGHT / 2,
    size: 16,
    font: timesItalic,
    color: TEXT_COLOR,
  });

  // Decorative line
  backCover.drawRectangle({
    x: PAGE_WIDTH / 2 - 80,
    y: PAGE_HEIGHT / 2 - 30,
    width: 160,
    height: 2,
    color: PRIMARY_COLOR,
  });

  // Social info
  const socialText = "@magicbook.uz";
  const socialWidth = helvetica.widthOfTextAtSize(socialText, 14);
  backCover.drawText(socialText, {
    x: (PAGE_WIDTH - socialWidth) / 2,
    y: PAGE_HEIGHT / 2 - 60,
    size: 14,
    font: helvetica,
    color: rgb(0.5, 0.5, 0.5),
  });

  // Year
  const yearText = `© ${new Date().getFullYear()} MagicBook.uz`;
  const yearWidth = helvetica.widthOfTextAtSize(yearText, 12);
  backCover.drawText(yearText, {
    x: (PAGE_WIDTH - yearWidth) / 2,
    y: 40,
    size: 12,
    font: helvetica,
    color: rgb(0.6, 0.6, 0.6),
  });

  // Save PDF
  const pdfBytes = await pdfDoc.save();
  console.log(`[PDF] Generated complete book: ${pdfBytes.length} bytes, ${pdfDoc.getPageCount()} pages`);

  return Buffer.from(pdfBytes);
}
