/**
 * Enhanced PDF generator using pdf-lib
 * Creates professional children's book PDF with:
 * - Cover page (image + title + child photo badge)
 * - Title page (elegant typography)
 * - Story pages (image on left, text on right)
 * - Back cover with branding
 *
 * Works without Playwright/Chromium - pure Node.js
 */

import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from "pdf-lib";

interface PageData {
  pageNumber: number;
  text: string;
  imageUrl: string;
}

// Page dimensions (8x10 inches at 72 points/inch)
const PAGE_WIDTH = 576;  // 8 inches
const PAGE_HEIGHT = 720; // 10 inches

// Retry configuration for network operations
const DOWNLOAD_MAX_RETRIES = 3;
const DOWNLOAD_INITIAL_DELAY_MS = 1000;

// Colors
const PRIMARY_COLOR = rgb(0.4, 0.2, 0.6); // Purple
const SECONDARY_COLOR = rgb(0.82, 0.41, 0.12); // Orange/brown
const TEXT_COLOR = rgb(0.18, 0.18, 0.18);
const LIGHT_TEXT = rgb(0.5, 0.5, 0.5);
const CREAM_BG = rgb(0.98, 0.97, 0.95);
const WARM_PEACH = rgb(1.0, 0.88, 0.7);

/**
 * Sleep helper
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Download image and return as buffer (with retry logic)
 */
async function downloadImage(url: string): Promise<Buffer> {
  console.log(`[PDF] Downloading: ${url.substring(0, 60)}...`);

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= DOWNLOAD_MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const errorMessage = lastError.message;

      // Check if error is retryable
      const isRetryable =
        errorMessage.includes("EPIPE") ||
        errorMessage.includes("ECONNRESET") ||
        errorMessage.includes("ETIMEDOUT") ||
        errorMessage.includes("ENOTFOUND") ||
        errorMessage.includes("EAI_AGAIN") ||
        errorMessage.includes("socket hang up") ||
        errorMessage.includes("network") ||
        errorMessage.includes("timeout") ||
        errorMessage.includes("fetch failed");

      if (!isRetryable || attempt === DOWNLOAD_MAX_RETRIES) {
        console.error(
          `[PDF] Image download failed after ${attempt} attempt(s):`,
          errorMessage
        );
        throw lastError;
      }

      const delay = DOWNLOAD_INITIAL_DELAY_MS * Math.pow(2, attempt - 1);
      console.warn(
        `[PDF] Download failed (attempt ${attempt}/${DOWNLOAD_MAX_RETRIES}): ${errorMessage}. Retrying in ${delay}ms...`
      );
      await sleep(delay);
    }
  }

  throw lastError!;
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
 * Sanitize text for PDF rendering
 */
function sanitizeText(text: string): string {
  return text
    .replace(/\r\n/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ')
    .replace(/\t/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Word wrap text to fit within maxWidth
 */
function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
  const cleanText = sanitizeText(text);
  const words = cleanText.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if (!word) continue;
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
 * Draw decorative circle/bubble
 */
function drawBubble(page: PDFPage, x: number, y: number, radius: number, color: { r: number; g: number; b: number }, opacity: number) {
  // Draw filled circle using multiple small rectangles (approximation)
  const steps = 36;
  for (let i = 0; i < steps; i++) {
    const angle1 = (i / steps) * 2 * Math.PI;
    const angle2 = ((i + 1) / steps) * 2 * Math.PI;

    // Draw pie slice as triangle approximation
    page.drawCircle({
      x,
      y,
      size: radius,
      color: rgb(color.r, color.g, color.b),
      opacity,
    });
  }
}

/**
 * Draw a star
 */
function drawStar(page: PDFPage, x: number, y: number, font: PDFFont, size: number, opacity: number) {
  page.drawText("★", {
    x: x - size / 2,
    y: y - size / 2,
    size,
    font,
    color: rgb(1, 0.84, 0),
    opacity,
  });
}

/**
 * Generate complete book PDF
 */
export async function generateSimplePDF(
  pages: PageData[],
  title: string,
  childName: string,
  childPhotoUrl?: string
): Promise<Buffer> {
  console.log(`[PDF] Generating enhanced book PDF with ${pages.length} story pages`);

  const pdfDoc = await PDFDocument.create();

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
  const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  // Sort pages by page number
  const sortedPages = [...pages].sort((a, b) => a.pageNumber - b.pageNumber);
  const coverPage = sortedPages.find(p => p.pageNumber === 0);
  const storyPages = sortedPages.filter(p => p.pageNumber > 0);

  // ============================================
  // 1. COVER PAGE - Full image with title overlay and child photo badge
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

      // Add child photo badge if available
      if (childPhotoUrl) {
        try {
          const photoBuffer = await downloadImage(childPhotoUrl);
          const photo = await embedImage(pdfDoc, photoBuffer);

          const badgeSize = 90;
          const badgeX = PAGE_WIDTH - badgeSize - 25;
          const badgeY = 25;

          // White border (draw larger white circle behind)
          cover.drawCircle({
            x: badgeX + badgeSize / 2,
            y: badgeY + badgeSize / 2,
            size: badgeSize / 2 + 4,
            color: rgb(1, 1, 1),
          });

          // Photo (clipped to circle - approximation with square)
          cover.drawImage(photo, {
            x: badgeX,
            y: badgeY,
            width: badgeSize,
            height: badgeSize,
          });
        } catch (error) {
          console.error(`[PDF] Child photo error:`, error);
        }
      }
    } catch (error) {
      console.error(`[PDF] Cover page error:`, error);
    }
  }

  // ============================================
  // 2. TITLE PAGE - Elegant typography with decorations
  // ============================================
  console.log(`[PDF] Creating title page...`);
  const titlePage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  // Warm gradient-like background (solid color approximation)
  titlePage.drawRectangle({
    x: 0, y: 0,
    width: PAGE_WIDTH, height: PAGE_HEIGHT,
    color: WARM_PEACH,
  });

  // Decorative circles
  titlePage.drawCircle({
    x: PAGE_WIDTH * 0.25,
    y: PAGE_HEIGHT * 0.75,
    size: 80,
    color: rgb(1, 1, 1),
    opacity: 0.3,
  });
  titlePage.drawCircle({
    x: PAGE_WIDTH * 0.75,
    y: PAGE_HEIGHT * 0.25,
    size: 60,
    color: rgb(1, 1, 1),
    opacity: 0.25,
  });

  // "Mo'jizaviy Hikoya" label
  const labelText = "MO'JIZAVIY HIKOYA";
  const labelWidth = helvetica.widthOfTextAtSize(labelText, 11);
  titlePage.drawText(labelText, {
    x: (PAGE_WIDTH - labelWidth) / 2,
    y: PAGE_HEIGHT / 2 + 120,
    size: 11,
    font: helvetica,
    color: rgb(0.55, 0.35, 0.12),
  });

  // Main title
  const mainTitleSize = 36;
  const cleanTitle = sanitizeText(title);
  const titleLines = wrapText(cleanTitle, timesBold, mainTitleSize, PAGE_WIDTH - 80);
  let yPos = PAGE_HEIGHT / 2 + 60;
  for (const line of titleLines) {
    const lineWidth = timesBold.widthOfTextAtSize(line, mainTitleSize);
    titlePage.drawText(line, {
      x: (PAGE_WIDTH - lineWidth) / 2,
      y: yPos,
      size: mainTitleSize,
      font: timesBold,
      color: SECONDARY_COLOR,
    });
    yPos -= mainTitleSize + 8;
  }

  // Decorative divider line
  const dividerWidth = 100;
  titlePage.drawRectangle({
    x: (PAGE_WIDTH - dividerWidth) / 2,
    y: PAGE_HEIGHT / 2 - 30,
    width: dividerWidth,
    height: 2,
    color: rgb(0.55, 0.35, 0.12),
    opacity: 0.4,
  });

  // "Qahramonimiz" label
  const heroLabel = "Qahramonimiz";
  const heroLabelWidth = timesItalic.widthOfTextAtSize(heroLabel, 14);
  titlePage.drawText(heroLabel, {
    x: (PAGE_WIDTH - heroLabelWidth) / 2,
    y: PAGE_HEIGHT / 2 - 70,
    size: 14,
    font: timesItalic,
    color: rgb(0.55, 0.35, 0.12),
  });

  // Child name
  const childNameSize = 30;
  const childNameWidth = timesBold.widthOfTextAtSize(childName, childNameSize);
  titlePage.drawText(childName, {
    x: (PAGE_WIDTH - childNameWidth) / 2,
    y: PAGE_HEIGHT / 2 - 110,
    size: childNameSize,
    font: timesBold,
    color: rgb(0.82, 0.41, 0.12),
  });

  // Subtitle
  const subtitle = "MagicBook tomonidan yaratilgan shaxsiy kitob";
  const subtitleWidth = timesItalic.widthOfTextAtSize(subtitle, 11);
  titlePage.drawText(subtitle, {
    x: (PAGE_WIDTH - subtitleWidth) / 2,
    y: PAGE_HEIGHT / 2 - 170,
    size: 11,
    font: timesItalic,
    color: rgb(0.55, 0.35, 0.12),
  });

  // ============================================
  // 3. STORY PAGES - Image left, Text right (spreads)
  // ============================================
  let pdfPageNum = 2; // Start after cover and title
  for (let i = 0; i < storyPages.length; i++) {
    const page = storyPages[i]!;
    console.log(`[PDF] Creating story page ${page.pageNumber}...`);

    // LEFT PAGE - Full illustration
    pdfPageNum++;
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

      // Page number at bottom left
      const pageNumText = `${pdfPageNum}`;
      leftPage.drawText(pageNumText, {
        x: 50,
        y: 30,
        size: 10,
        font: helvetica,
        color: LIGHT_TEXT,
      });
    } catch (error) {
      console.error(`[PDF] Story page ${page.pageNumber} image error:`, error);
    }

    // RIGHT PAGE - Text only with bubble decorations
    pdfPageNum++;
    const rightPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

    // Cream background
    rightPage.drawRectangle({
      x: 0, y: 0,
      width: PAGE_WIDTH, height: PAGE_HEIGHT,
      color: CREAM_BG,
    });

    // Decorative bubbles
    rightPage.drawCircle({
      x: -30,
      y: PAGE_HEIGHT + 30,
      size: 90,
      color: rgb(1, 0.96, 0.9),
    });
    rightPage.drawCircle({
      x: PAGE_WIDTH + 20,
      y: PAGE_HEIGHT * 0.7,
      size: 60,
      color: rgb(0.9, 0.94, 1),
    });
    rightPage.drawCircle({
      x: 40,
      y: 100,
      size: 50,
      color: rgb(1, 0.92, 0.96),
    });
    rightPage.drawCircle({
      x: PAGE_WIDTH - 50,
      y: 50,
      size: 70,
      color: rgb(0.94, 1, 0.94),
    });

    // Text content
    if (page.text) {
      const textFontSize = 15;
      const lineHeight = 26;
      const margin = 55;
      const maxTextWidth = PAGE_WIDTH - margin * 2;

      // Split into paragraphs
      const paragraphs = page.text
        .split(/\n\n+/)
        .map(p => p.replace(/\n/g, ' '))
        .filter(p => p.trim().length > 0);

      // Calculate total height for centering
      let totalLines = 0;
      const allLines: { text: string; indent: boolean }[] = [];
      for (let pIdx = 0; pIdx < paragraphs.length; pIdx++) {
        const para = paragraphs[pIdx]!;
        const lines = wrapText(para, timesRoman, textFontSize, maxTextWidth - 25);
        for (let lIdx = 0; lIdx < lines.length; lIdx++) {
          allLines.push({
            text: lines[lIdx]!,
            indent: lIdx === 0 && pIdx > 0 // Indent first line of non-first paragraphs
          });
          totalLines++;
        }
        // Add spacing between paragraphs
        if (pIdx < paragraphs.length - 1) {
          allLines.push({ text: '', indent: false });
          totalLines++;
        }
      }

      const totalTextHeight = totalLines * lineHeight;
      let textY = (PAGE_HEIGHT + totalTextHeight) / 2;

      for (const line of allLines) {
        if (line.text) {
          const xOffset = line.indent ? 25 : 0;
          rightPage.drawText(line.text, {
            x: margin + xOffset,
            y: textY,
            size: textFontSize,
            font: timesRoman,
            color: TEXT_COLOR,
          });
        }
        textY -= lineHeight;
      }
    }

    // Page number at bottom right
    const rightPageNum = `${pdfPageNum}`;
    const rightPageNumWidth = helvetica.widthOfTextAtSize(rightPageNum, 10);
    rightPage.drawText(rightPageNum, {
      x: PAGE_WIDTH - 50 - rightPageNumWidth,
      y: 30,
      size: 10,
      font: helvetica,
      color: LIGHT_TEXT,
    });
  }

  // ============================================
  // 4. BACK COVER - Branding
  // ============================================
  console.log(`[PDF] Creating back cover...`);
  const backCover = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  // Gradient-like background (using solid orange-teal blend approximation)
  backCover.drawRectangle({
    x: 0, y: PAGE_HEIGHT / 2,
    width: PAGE_WIDTH, height: PAGE_HEIGHT / 2,
    color: rgb(1, 0.44, 0.26), // Orange top
  });
  backCover.drawRectangle({
    x: 0, y: 0,
    width: PAGE_WIDTH, height: PAGE_HEIGHT / 2,
    color: rgb(0.3, 0.71, 0.67), // Teal bottom
  });

  // Decorative circles
  backCover.drawCircle({
    x: PAGE_WIDTH * 0.2,
    y: PAGE_HEIGHT * 0.7,
    size: 100,
    color: rgb(1, 1, 1),
    opacity: 0.1,
  });
  backCover.drawCircle({
    x: PAGE_WIDTH * 0.8,
    y: PAGE_HEIGHT * 0.3,
    size: 80,
    color: rgb(1, 1, 1),
    opacity: 0.08,
  });

  // Logo text "MagicBook"
  const logoText = "MagicBook";
  const logoSize = 42;
  const logoWidth = helveticaBold.widthOfTextAtSize(logoText, logoSize);
  backCover.drawText(logoText, {
    x: (PAGE_WIDTH - logoWidth) / 2,
    y: PAGE_HEIGHT / 2 + 100,
    size: logoSize,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });

  // Tagline
  const tagline1 = "Farzandingiz uchun";
  const tagline1Width = timesBold.widthOfTextAtSize(tagline1, 18);
  backCover.drawText(tagline1, {
    x: (PAGE_WIDTH - tagline1Width) / 2,
    y: PAGE_HEIGHT / 2 + 40,
    size: 18,
    font: timesBold,
    color: rgb(1, 1, 1),
  });

  const tagline2 = "sehrli hikoyalar yarating";
  const tagline2Width = timesBold.widthOfTextAtSize(tagline2, 18);
  backCover.drawText(tagline2, {
    x: (PAGE_WIDTH - tagline2Width) / 2,
    y: PAGE_HEIGHT / 2 + 15,
    size: 18,
    font: timesBold,
    color: rgb(1, 1, 1),
  });

  // Description
  const description = "Har bir bola o'z hikoyasining qahramoni bo'lishga loyiq";
  const descWidth = timesRoman.widthOfTextAtSize(description, 13);
  backCover.drawText(description, {
    x: (PAGE_WIDTH - descWidth) / 2,
    y: PAGE_HEIGHT / 2 - 30,
    size: 13,
    font: timesRoman,
    color: rgb(1, 1, 1),
    opacity: 0.95,
  });

  // Website
  const website = "magicbook.uz";
  const websiteWidth = helveticaBold.widthOfTextAtSize(website, 16);
  backCover.drawText(website, {
    x: (PAGE_WIDTH - websiteWidth) / 2,
    y: PAGE_HEIGHT / 2 - 80,
    size: 16,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });

  // Social handles
  const instagram = "@magicbook.uz";
  const telegram = "@magicbook_uz";
  const socialY = PAGE_HEIGHT / 2 - 130;

  const instaWidth = helvetica.widthOfTextAtSize(instagram, 12);
  const teleWidth = helvetica.widthOfTextAtSize(telegram, 12);
  const socialGap = 60;

  backCover.drawText(instagram, {
    x: PAGE_WIDTH / 2 - instaWidth - socialGap / 2,
    y: socialY,
    size: 12,
    font: helvetica,
    color: rgb(1, 1, 1),
    opacity: 0.9,
  });

  backCover.drawText(telegram, {
    x: PAGE_WIDTH / 2 + socialGap / 2,
    y: socialY,
    size: 12,
    font: helvetica,
    color: rgb(1, 1, 1),
    opacity: 0.9,
  });

  // Copyright
  const yearText = `© ${new Date().getFullYear()} MagicBook.uz`;
  const yearWidth = helvetica.widthOfTextAtSize(yearText, 10);
  backCover.drawText(yearText, {
    x: (PAGE_WIDTH - yearWidth) / 2,
    y: 35,
    size: 10,
    font: helvetica,
    color: rgb(1, 1, 1),
    opacity: 0.7,
  });

  // Save PDF
  const pdfBytes = await pdfDoc.save();
  console.log(`[PDF] Generated complete book: ${pdfBytes.length} bytes, ${pdfDoc.getPageCount()} pages`);

  return Buffer.from(pdfBytes);
}
