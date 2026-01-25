/**
 * Playwright-based PDF generator for job-worker
 * Creates professional children's book PDF with:
 * - Cover page (full illustration with child photo badge)
 * - Title page (elegant entry page)
 * - Story pages (image on left, text on right)
 * - Back cover with branding
 *
 * Standalone version - all dependencies inline
 */

import { chromium, type Browser } from "playwright";
import { PDFDocument } from "pdf-lib";

interface PageData {
  pageNumber: number;
  text: string;
  imageUrl: string;
}

// Page dimensions (8x10 inches at 72 points/inch)
const PAGE_WIDTH = 576;  // 8 inches in points
const PAGE_HEIGHT = 720; // 10 inches in points

// Cache browser instance for reuse
let browserInstance: Browser | null = null;

/**
 * Get or create browser instance
 */
async function getBrowser(): Promise<Browser> {
  if (browserInstance?.isConnected()) {
    return browserInstance;
  }

  browserInstance = await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  return browserInstance;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char] ?? char);
}

/**
 * Generate cover page HTML
 */
function generateCoverPageHTML(
  imageUrl: string,
  title: string,
  childName: string,
  childPhotoUrl?: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            margin: 0;
            padding: 0;
            width: ${PAGE_WIDTH}pt;
            height: ${PAGE_HEIGHT}pt;
            overflow: hidden;
          }
          .cover-page {
            position: relative;
            width: 100%;
            height: 100%;
          }
          .cover-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .child-photo-badge {
            position: absolute;
            bottom: 30px;
            right: 30px;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            object-fit: cover;
            border: 5px solid #ffffff;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          }
        </style>
      </head>
      <body>
        <div class="cover-page">
          <img src="${imageUrl}" class="cover-image" alt="Cover">
          ${childPhotoUrl ? `<img src="${childPhotoUrl}" class="child-photo-badge" alt="${escapeHtml(childName)}">` : ""}
        </div>
      </body>
    </html>
  `;
}

/**
 * Generate title page HTML
 */
function generateTitlePageHTML(title: string, childName: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            margin: 0;
            padding: 0;
            width: ${PAGE_WIDTH}pt;
            height: ${PAGE_HEIGHT}pt;
            overflow: hidden;
            background: linear-gradient(135deg, #FFE0B2 0%, #FFCCBC 100%);
            position: relative;
          }
          .background-pattern {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.15;
            background-image:
              radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.6) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.4) 0%, transparent 50%);
          }
          .star {
            position: absolute;
            color: rgba(255, 215, 0, 0.4);
            font-size: 28pt;
          }
          .star-1 { top: 15%; left: 20%; }
          .star-2 { top: 25%; right: 25%; font-size: 22pt; }
          .star-3 { bottom: 30%; left: 15%; font-size: 32pt; }
          .star-4 { bottom: 20%; right: 20%; font-size: 26pt; }
          .title-page {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60pt 50pt;
            z-index: 10;
          }
          .content {
            text-align: center;
            max-width: 85%;
          }
          .label {
            font-family: 'Nunito', sans-serif;
            font-size: 12pt;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 3px;
            color: rgba(139, 69, 19, 0.6);
            margin-bottom: 35pt;
          }
          .story-title {
            font-family: 'Playfair Display', serif;
            font-size: 40pt;
            font-weight: 700;
            color: #8B4513;
            line-height: 1.3;
            margin-bottom: 40pt;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
          }
          .divider {
            width: 100pt;
            height: 2pt;
            background: linear-gradient(to right, transparent, rgba(139, 69, 19, 0.4), transparent);
            margin: 0 auto 40pt;
          }
          .by-line {
            font-family: 'Nunito', sans-serif;
            font-size: 14pt;
            font-weight: 500;
            color: rgba(139, 69, 19, 0.7);
            margin-bottom: 12pt;
          }
          .child-name {
            font-family: 'Playfair Display', serif;
            font-size: 32pt;
            font-weight: 600;
            color: #D2691E;
            text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
          }
          .subtitle {
            font-family: 'Nunito', sans-serif;
            font-size: 12pt;
            font-weight: 400;
            color: rgba(139, 69, 19, 0.6);
            margin-top: 45pt;
            font-style: italic;
          }
        </style>
      </head>
      <body>
        <div class="background-pattern"></div>
        <div class="star star-1">★</div>
        <div class="star star-2">★</div>
        <div class="star star-3">★</div>
        <div class="star star-4">★</div>
        <div class="title-page">
          <div class="content">
            <div class="label">Mo'jizaviy Hikoya</div>
            <div class="story-title">${escapeHtml(title)}</div>
            <div class="divider"></div>
            <div class="by-line">Qahramonimiz</div>
            <div class="child-name">${escapeHtml(childName)}</div>
            <div class="subtitle">MagicBook tomonidan yaratilgan shaxsiy kitob</div>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Generate illustration page HTML (left page - image only)
 */
function generateIllustrationPageHTML(imageUrl: string, pageNumber: number): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400&display=swap" rel="stylesheet">
        <style>
          body {
            margin: 0;
            padding: 0;
            width: ${PAGE_WIDTH}pt;
            height: ${PAGE_HEIGHT}pt;
            overflow: hidden;
          }
          .page {
            position: relative;
            width: 100%;
            height: 100%;
          }
          .page-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .page-number {
            position: absolute;
            bottom: 35px;
            left: 50px;
            font-family: 'Nunito', sans-serif;
            font-size: 10pt;
            font-weight: 400;
            color: rgba(85, 85, 85, 0.8);
            letter-spacing: 0.5px;
          }
        </style>
      </head>
      <body>
        <div class="page">
          <img src="${imageUrl}" class="page-image" alt="Story illustration">
          <div class="page-number">${pageNumber}</div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Generate text page HTML (right page - text only with bubbles)
 */
function generateTextPageHTML(text: string, pageNumber: number): string {
  // Convert paragraphs
  const paragraphs = text
    .split(/\n\n+/)
    .map((p) => p.replace(/\n/g, " "))
    .filter((p) => p.trim().length > 0);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600&family=Nunito:wght@400&display=swap" rel="stylesheet">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            margin: 0;
            padding: 0;
            width: ${PAGE_WIDTH}pt;
            height: ${PAGE_HEIGHT}pt;
            overflow: hidden;
            background: #f9f7f4;
            position: relative;
          }
          .bubble {
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
          }
          .bubble-1 {
            width: 160pt;
            height: 160pt;
            top: -35pt;
            left: -45pt;
            background: rgba(255, 245, 230, 0.6);
          }
          .bubble-2 {
            width: 110pt;
            height: 110pt;
            top: 70pt;
            right: -25pt;
            background: rgba(230, 240, 255, 0.5);
          }
          .bubble-3 {
            width: 80pt;
            height: 80pt;
            bottom: 90pt;
            left: 35pt;
            background: rgba(255, 235, 245, 0.5);
          }
          .bubble-4 {
            width: 130pt;
            height: 130pt;
            bottom: -25pt;
            right: 55pt;
            background: rgba(240, 255, 240, 0.5);
          }
          .text-page {
            position: relative;
            width: 100%;
            height: 100%;
            padding: 60px 50px 80px 50px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            z-index: 10;
          }
          .text-content {
            font-family: 'Baloo 2', cursive, sans-serif;
            font-size: 15pt;
            line-height: 26pt;
            color: #2d2d2d;
            text-align: justify;
            font-weight: 500;
          }
          .text-content p {
            margin-bottom: 18pt;
            text-indent: 28pt;
          }
          .text-content p:first-child {
            text-indent: 0;
          }
          .page-number {
            position: absolute;
            bottom: 35pt;
            right: 50pt;
            font-family: 'Nunito', sans-serif;
            font-size: 10pt;
            font-weight: 400;
            color: #555;
            letter-spacing: 0.5px;
          }
        </style>
      </head>
      <body>
        <div class="bubble bubble-1"></div>
        <div class="bubble bubble-2"></div>
        <div class="bubble bubble-3"></div>
        <div class="bubble bubble-4"></div>
        <div class="text-page">
          <div class="text-content">
            ${paragraphs.map((p) => `<p>${escapeHtml(p.trim())}</p>`).join("\n            ")}
          </div>
          <div class="page-number">${pageNumber}</div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Generate back cover HTML
 */
function generateBackCoverHTML(): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            margin: 0;
            padding: 0;
            width: ${PAGE_WIDTH}pt;
            height: ${PAGE_HEIGHT}pt;
            overflow: hidden;
            background: linear-gradient(135deg, #FF7043 0%, #4DB6AC 100%);
            position: relative;
          }
          .background-pattern {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.1;
            background-image:
              radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.15) 0%, transparent 50%);
          }
          .back-cover {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 70pt 50pt;
            z-index: 10;
          }
          .content {
            text-align: center;
            color: #ffffff;
          }
          .logo-text {
            font-family: 'Playfair Display', serif;
            font-size: 44pt;
            font-weight: 700;
            margin-bottom: 30pt;
            text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
          }
          .tagline {
            font-family: 'Playfair Display', serif;
            font-size: 20pt;
            font-weight: 600;
            margin-bottom: 18pt;
            line-height: 1.4;
            letter-spacing: 0.5px;
          }
          .description {
            font-family: 'Nunito', sans-serif;
            font-size: 13pt;
            font-weight: 400;
            line-height: 1.6;
            margin-bottom: 45pt;
            opacity: 0.95;
          }
          .website {
            font-family: 'Nunito', sans-serif;
            font-size: 16pt;
            font-weight: 700;
            margin-bottom: 35pt;
            letter-spacing: 0.5px;
          }
          .social-section {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 50pt;
          }
          .social-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8pt;
          }
          .social-icon {
            font-size: 32pt;
          }
          .social-handle {
            font-family: 'Nunito', sans-serif;
            font-size: 11pt;
            font-weight: 600;
            color: #ffffff;
            opacity: 0.95;
          }
          .copyright {
            position: absolute;
            bottom: 30pt;
            font-family: 'Nunito', sans-serif;
            font-size: 10pt;
            color: rgba(255, 255, 255, 0.7);
          }
        </style>
      </head>
      <body>
        <div class="background-pattern"></div>
        <div class="back-cover">
          <div class="content">
            <div class="logo-text">MagicBook</div>
            <div class="tagline">Farzandingiz uchun<br>sehrli hikoyalar yarating</div>
            <div class="description">Har bir bola o'z hikoyasining qahramoni bo'lishga loyiq</div>
            <div class="website">magicbook.uz</div>
            <div class="social-section">
              <div class="social-item">
                <div class="social-icon">📷</div>
                <div class="social-handle">@magicbook.uz</div>
              </div>
              <div class="social-item">
                <div class="social-icon">✈️</div>
                <div class="social-handle">@magicbook_uz</div>
              </div>
            </div>
          </div>
          <div class="copyright">© ${new Date().getFullYear()} MagicBook.uz</div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Render HTML to PDF using Playwright
 */
async function renderHTMLToPDF(html: string): Promise<Buffer> {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    // Set viewport for high quality
    await page.setViewportSize({
      width: Math.round(PAGE_WIDTH * 4), // 4x for high DPI
      height: Math.round(PAGE_HEIGHT * 4),
    });

    await page.setContent(html, { waitUntil: "networkidle" });

    // Convert points to inches (72 points = 1 inch)
    const widthInches = PAGE_WIDTH / 72;
    const heightInches = PAGE_HEIGHT / 72;

    const pdfBuffer = await page.pdf({
      width: `${widthInches}in`,
      height: `${heightInches}in`,
      printBackground: true,
      preferCSSPageSize: false,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await page.close();
  }
}

/**
 * Generate complete book PDF with Playwright
 * Matches the original frontend PDF output exactly
 */
export async function generatePlaywrightPDF(
  pages: PageData[],
  title: string,
  childName: string,
  childPhotoUrl?: string
): Promise<Buffer> {
  console.log(`[Playwright PDF] Generating book PDF with ${pages.length} story pages`);

  const pageBuffers: Buffer[] = [];

  // Sort pages by page number
  const sortedPages = [...pages].sort((a, b) => a.pageNumber - b.pageNumber);
  const coverPage = sortedPages.find((p) => p.pageNumber === 0);
  const storyPages = sortedPages.filter((p) => p.pageNumber > 0);

  // 1. COVER PAGE
  if (coverPage) {
    console.log("[Playwright PDF] Rendering cover page...");
    const coverHtml = generateCoverPageHTML(
      coverPage.imageUrl,
      title,
      childName,
      childPhotoUrl
    );
    const coverBuffer = await renderHTMLToPDF(coverHtml);
    pageBuffers.push(coverBuffer);
    console.log("[Playwright PDF] Cover page done");
  }

  // 2. TITLE PAGE
  console.log("[Playwright PDF] Rendering title page...");
  const titleHtml = generateTitlePageHTML(title, childName);
  const titleBuffer = await renderHTMLToPDF(titleHtml);
  pageBuffers.push(titleBuffer);
  console.log("[Playwright PDF] Title page done");

  // 3. STORY PAGES (paired: illustration left, text right)
  let pdfPageNumber = 2; // Start after cover and title page
  for (let i = 0; i < storyPages.length; i++) {
    const page = storyPages[i]!;
    console.log(`[Playwright PDF] Rendering story page ${page.pageNumber}...`);

    // LEFT PAGE - Full illustration
    pdfPageNumber++;
    const illustrationHtml = generateIllustrationPageHTML(page.imageUrl, pdfPageNumber);
    const illustrationBuffer = await renderHTMLToPDF(illustrationHtml);
    pageBuffers.push(illustrationBuffer);

    // RIGHT PAGE - Text only
    pdfPageNumber++;
    const textHtml = generateTextPageHTML(page.text, pdfPageNumber);
    const textBuffer = await renderHTMLToPDF(textHtml);
    pageBuffers.push(textBuffer);

    console.log(`[Playwright PDF] Story page ${page.pageNumber} done (PDF pages ${pdfPageNumber - 1}-${pdfPageNumber})`);
  }

  // 4. BACK COVER
  console.log("[Playwright PDF] Rendering back cover...");
  const backCoverHtml = generateBackCoverHTML();
  const backCoverBuffer = await renderHTMLToPDF(backCoverHtml);
  pageBuffers.push(backCoverBuffer);
  console.log("[Playwright PDF] Back cover done");

  // Merge all pages into single PDF
  console.log(`[Playwright PDF] Merging ${pageBuffers.length} pages...`);
  const mergedPdf = await PDFDocument.create();

  for (let i = 0; i < pageBuffers.length; i++) {
    const pagePdf = await PDFDocument.load(pageBuffers[i]!);
    const [copiedPage] = await mergedPdf.copyPages(pagePdf, [0]);
    mergedPdf.addPage(copiedPage);
  }

  // Set metadata
  mergedPdf.setTitle(title);
  mergedPdf.setAuthor(`${childName} - MagicBook.uz`);
  mergedPdf.setCreator("MagicBook.uz");
  mergedPdf.setProducer("MagicBook Playwright PDF Generator");
  mergedPdf.setCreationDate(new Date());

  const finalPdfBytes = await mergedPdf.save();
  console.log(`[Playwright PDF] Complete: ${finalPdfBytes.length} bytes, ${pageBuffers.length} pages`);

  return Buffer.from(finalPdfBytes);
}

/**
 * Cleanup browser instance
 */
export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}
