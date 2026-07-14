import sharp from "sharp";
import { env } from "../lib/env.js";
import { uploadPageImage, uploadBackgroundImage } from "../lib/r2-upload.js";

// Retry configuration for network operations
const FETCH_MAX_RETRIES = 3;
const FETCH_INITIAL_DELAY_MS = 1000;

/**
 * Fetch with retry for downloading images
 */
async function fetchWithRetry(url: string, operationName: string): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= FETCH_MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response;
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

      if (!isRetryable || attempt === FETCH_MAX_RETRIES) {
        console.error(
          `[Fetch Retry] ${operationName} failed after ${attempt} attempt(s):`,
          errorMessage
        );
        throw lastError;
      }

      const delay = FETCH_INITIAL_DELAY_MS * Math.pow(2, attempt - 1);
      console.warn(
        `[Fetch Retry] ${operationName} failed (attempt ${attempt}/${FETCH_MAX_RETRIES}): ${errorMessage}. Retrying in ${delay}ms...`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// Portrait page dimensions for children's book
// Single page = 8" wide × 10" tall at 300 DPI for print quality
const IMAGE_WIDTH = 2400;  // 8 inches × 300 DPI
const IMAGE_HEIGHT = 3000; // 10 inches × 300 DPI
// Aspect ratio: 4:5 (0.8:1) - standard portrait book page

// Image models, overridable via env so a gated/degraded model can be swapped
// without a code deploy. gemini-2.5-flash-image is two generations old and has
// widespread IMAGE_OTHER failures; gemini-3.1-flash-image (Nano Banana 2) is
// the current stable. The fallback model is tried on the last retry attempts
// when the primary keeps failing (e.g. a page whose content trips its filter).
// Both verified live against ListModels + generateContent for this API key.
const IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL ?? "gemini-3.1-flash-image";
const IMAGE_FALLBACK_MODEL =
  process.env.GEMINI_IMAGE_FALLBACK_MODEL ?? "gemini-3-pro-image";

/**
 * Format cover title to use SHORT, SIMPLE words that AI can spell correctly
 * Avoids long Uzbek words like "Sarguzashtlari" which get misspelled
 */
function formatCoverTitle(rawTitle: string, childName: string): string {
  // List of long/complex words that AI misspells - replace with shorter alternatives
  const wordReplacements: Record<string, string> = {
    'sarguzashtlari': 'Sayohati',
    'sarguzashti': 'Sayohati',
    'sarguzasht': 'Sayohat',
    'hikoyalari': 'Hikoyasi',
    'ertaklari': 'Ertagi',
    'dunyolari': 'Dunyosi',
    'sehrli': 'Sehr',
    "mo'jizaviy": "Mo'jiza",
  };

  let title = rawTitle.trim();

  // Replace long words with shorter alternatives (case-insensitive)
  for (const [longWord, shortWord] of Object.entries(wordReplacements)) {
    const regex = new RegExp(longWord, 'gi');
    title = title.replace(regex, shortWord);
  }

  // Split into words and limit
  const words = title.split(/\s+/).filter(w => w.length > 0);

  // Max 3 words, each word max 10 characters
  const shortWords = words
    .slice(0, 3)
    .map(word => word.length > 10 ? word.slice(0, 8) : word);

  if (shortWords.length === 0) {
    return `${childName} Sayohati`;
  }

  title = shortWords.join(' ');

  // If title is too short, add child name
  if (title.length < 5 && !title.toLowerCase().includes(childName.toLowerCase())) {
    title = `${childName} ${title}`;
  }

  console.log(`[Cover Title] Formatted: "${rawTitle}" -> "${title}"`);
  return title;
}

/**
 * Get title style instructions based on story theme/subject
 */
function getTitleStyleInstructions(sceneDescription: string): string {
  const desc = sceneDescription.toLowerCase();

  // Jungle/Forest themes
  if (desc.includes('jungle') || desc.includes('forest') || desc.includes('tree')) {
    return `- Use GREEN, EARTHY title colors (jungle green, leaf green, brown)
- Font style: Natural, organic, leafy appearance
- Add vine-like decorations or leaf motifs around letters`;
  }

  // Space/Cosmic themes
  if (desc.includes('space') || desc.includes('mars') || desc.includes('planet') || desc.includes('cosmic') || desc.includes('galaxy')) {
    return `- Use COSMIC title colors (deep blue, purple, silver, starlight white)
- Font style: Futuristic, sci-fi lettering
- Add stars, planets, or sparkle effects around text`;
  }

  // Ocean/Water themes
  if (desc.includes('ocean') || desc.includes('sea') || desc.includes('water') || desc.includes('underwater')) {
    return `- Use OCEAN title colors (deep blue, aqua, turquoise, coral)
- Font style: Flowing, wave-like letters
- Add water droplets, bubbles, or wave motifs`;
  }

  // Desert/Sand themes
  if (desc.includes('desert') || desc.includes('sand') || desc.includes('kyzylkum')) {
    return `- Use DESERT title colors (sandy gold, warm orange, sunset colors)
- Font style: Warm, sun-baked appearance
- Add sand texture or sun motifs`;
  }

  // Ice/Snow/Arctic themes
  if (desc.includes('ice') || desc.includes('snow') || desc.includes('arctic') || desc.includes('north pole') || desc.includes('frozen')) {
    return `- Use ICY title colors (ice blue, white, silver, frost)
- Font style: Crystalline, frozen appearance
- Add snowflakes or ice crystals around letters`;
  }

  // Medieval/Castle/Kingdom themes
  if (desc.includes('castle') || desc.includes('kingdom') || desc.includes('medieval') || desc.includes('knight') || desc.includes('middle ages')) {
    return `- Use ROYAL title colors (gold, deep purple, royal blue)
- Font style: Gothic, medieval, ornate lettering
- Add crown or shield decorations`;
  }

  // Candy/Sweet themes
  if (desc.includes('candy') || desc.includes('sweet') || desc.includes('cake') || desc.includes('dessert') || desc.includes('shirinlik')) {
    return `- Use SWEET title colors (pink, pastel rainbow, candy colors)
- Font style: Playful, bubbly, sweet lettering
- Add candy, lollipop, or sprinkle decorations`;
  }

  // Historical/Ancient themes (Egypt, Rome, Greece)
  if (desc.includes('egypt') || desc.includes('pyramid') || desc.includes('pharaoh') ||
      desc.includes('rome') || desc.includes('greece') || desc.includes('ancient')) {
    return `- Use ANCIENT title colors (gold, sandstone, aged bronze)
- Font style: Classical, hieroglyphic-inspired, or ancient script
- Add historical motifs (columns, hieroglyphs, ancient patterns)`;
  }

  // Uzbek cultural themes
  if (desc.includes('samarkand') || desc.includes('bukhara') || desc.includes('khiva') ||
      desc.includes('silk road') || desc.includes('uzbek') || desc.includes('navruz')) {
    return `- Use UZBEK CULTURAL colors (turquoise, gold, rich blue, ornate patterns)
- Font style: Elegant with traditional Uzbek ornamental motifs
- Add Islamic geometric patterns or traditional decorations`;
  }

  // Magic/Fairy themes
  if (desc.includes('magic') || desc.includes('fairy') || desc.includes('wizard') || desc.includes('enchant')) {
    return `- Use MAGICAL title colors (purple, sparkle gold, mystical pink)
- Font style: Whimsical, enchanted, magical lettering
- Add sparkles, stars, or magic wand effects`;
  }

  // Default: Colorful children's book style
  return `- Use VIBRANT, COLORFUL title colors appropriate for the story theme
- Font style: Bold, friendly, child-appropriate lettering
- Make title playful and engaging`;
}

export interface IllustrationInput {
  sceneDescription: string;
  storyText: string; // Cover: title rendered by AI (shortened); Story pages: PDF overlay only
  childPhotoUrl: string;
  childName: string;
  childGender?: string | null; // "boy" or "girl"
  characterReferenceUrl?: string; // Character reference image (generated first, ensures consistency)
  previousPageUrl?: string; // Previous page URL for sequential consistency
  style?: string;
  pageType?: "cover" | "story-character" | "story-background"; // cover: single cover page, story-character: odd pages with character, story-background: even pages background only
  seed?: number; // Fixed seed for style consistency across all pages
  coverImageUrl?: string; // DEPRECATED: use characterReferenceUrl instead
}

export interface IllustrationResult {
  imageUrl: string; // R2 URL of uploaded image
  status: "succeeded" | "failed";
}

export interface CharacterReferenceInput {
  childPhotoUrl: string;
  childName: string;
  childGender?: string | null; // "boy" or "girl"
  style?: string; // Illustration style (ANIMATION_3D, FANTASY_STORYBOOK, SEMI_REALISTIC, etc.)
}

/**
 * Clean JSON string by removing/escaping control characters
 * Control characters (0x00-0x1F) can break JSON parsing
 */
function cleanJsonString(str: string): string {
  return str.replace(/[\x00-\x1F\x7F]/g, (char) => {
    // Map common control characters to escaped versions
    const escapeMap: Record<string, string> = {
      '\n': '\\n',
      '\r': '\\r',
      '\t': '\\t',
      '\b': '\\b',
      '\f': '\\f',
    };
    return escapeMap[char] ?? ''; // Remove other control chars
  });
}

/**
 * Extract base64 image data from response using regex (fallback for malformed JSON)
 */
function extractImageFromResponse(rawText: string): string | null {
  // Try to extract base64 data directly using regex
  // Look for pattern: "data": "base64data..."
  const dataMatch = rawText.match(/"data"\s*:\s*"([A-Za-z0-9+/=]+)"/);
  if (dataMatch && dataMatch[1] && dataMatch[1].length > 1000) {
    return dataMatch[1];
  }

  // Alternative: look for inline_data pattern
  const inlineMatch = rawText.match(/"inline_data"\s*:\s*\{\s*"mime_type"\s*:\s*"[^"]+"\s*,\s*"data"\s*:\s*"([A-Za-z0-9+/=]+)"/);
  if (inlineMatch && inlineMatch[1] && inlineMatch[1].length > 1000) {
    return inlineMatch[1];
  }

  return null;
}

/**
 * Call Gemini API directly with manual JSON sanitization
 * Bypasses SDK's JSON parser to handle control character issues
 */
async function callGeminiDirectly(params: {
  model: string;
  contents: Array<{
    text?: string;
    inlineData?: { mimeType: string; data: string };
  }>;
  aspectRatio?: string; // Supported: "1:1", "3:4", "4:3", "9:16", "16:9", "4:5", "5:4", "2:3", "3:2", "21:9"
}): Promise<any> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${params.model}:generateContent?key=${env.GEMINI_API_KEY}`;

  // Build request body with generation config for image output
  // imageConfig must be INSIDE generationConfig (not at top level)
  // Reference: https://ai.google.dev/gemini-api/docs/image-generation
  const generationConfig: Record<string, unknown> = {
    responseModalities: ["IMAGE", "TEXT"],
    temperature: 1.0,
  };

  // Add imageConfig inside generationConfig for aspect ratio control
  if (params.aspectRatio) {
    generationConfig.imageConfig = {
      aspectRatio: params.aspectRatio,
    };
    console.log(`[Gemini Direct] Requesting aspect ratio: ${params.aspectRatio}`);
  }

  const requestBody = {
    contents: [
      {
        parts: params.contents.map(content => {
          if (content.text) {
            return { text: content.text };
          } else if (content.inlineData) {
            return { inline_data: content.inlineData };
          }
          return {};
        }),
      },
    ],
    generationConfig,
    // Disable safety blocking. Face-preservation (child photo -> stylized
    // character) sits in a gray area that Gemini's filter has been flagging as
    // IMAGE_OTHER; turning these off reduces spurious blocks.
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
    ],
  };

  console.log(`[Gemini Direct] Calling API: ${params.model}`);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  // Get raw response text
  const rawText = await response.text();

  // Try to parse JSON
  try {
    // First try: parse raw response directly (don't clean the outer JSON structure)
    return JSON.parse(rawText);
  } catch (firstError) {
    console.error('[Gemini Direct] First parse attempt failed:', firstError);

    // Second try: clean control characters and parse again
    const cleanedText = cleanJsonString(rawText);

    try {
      return JSON.parse(cleanedText);
    } catch (secondError) {
      console.error('[Gemini Direct] Second parse attempt also failed:', secondError);

      // Third attempt: try to extract image data directly using regex
      console.log('[Gemini Direct] Attempting regex extraction fallback...');
      const extractedData = extractImageFromResponse(rawText);

      if (extractedData) {
        console.log(`[Gemini Direct] Regex extraction succeeded (${extractedData.length} chars)`);
        // Return a minimal valid response structure
        return {
          candidates: [{
            content: {
              parts: [{
                inline_data: {
                  mime_type: 'image/png',
                  data: extractedData,
                },
              }],
            },
          }],
        };
      }

      console.error('[Gemini Direct] All parse attempts failed');
      console.error('[Gemini Direct] Response length:', rawText.length);
      console.error('[Gemini Direct] Response sample:', rawText.substring(0, 500));

      throw new Error(`Failed to parse Gemini response: ${secondError instanceof Error ? secondError.message : String(secondError)}`);
    }
  }
}

/**
 * Get art style instructions based on illustration style
 */
function getArtStyleInstructions(illustrationStyle?: string | null): string {
  if (!illustrationStyle) {
    return `3D CGI CARTOON style (Pixar/Disney quality)
- Professional 3D rendered children's book character
- High-quality CGI animation style
- Warm, pleasant colors with good contrast
- Clean, polished 3D rendering`;
  }

  switch (illustrationStyle) {
    case "ANIMATION_3D":
      return `★★★ 3D CGI PIXAR/DISNEY ANIMATION STYLE ★★★
MANDATORY: This MUST look like a Pixar/Disney 3D animated movie!
- Professional 3D CGI rendered character like Toy Story, Coco, Moana, Encanto
- Smooth, polished 3D surfaces with subsurface scattering on skin
- Realistic 3D lighting with soft shadows and ambient occlusion
- High-quality CGI textures - fabric, hair, skin all look 3D rendered
- Big expressive eyes with 3D reflections and catchlights
- 3D volumetric hair with individual strands visible
- Warm, vibrant Pixar color palette
- Professional animation studio quality rendering`;

    case "FANTASY_STORYBOOK":
      return `★★★ HAND-DRAWN FANTASY STORYBOOK ILLUSTRATION - NOT 3D! ★★★
CRITICAL: This MUST be 2D HAND-DRAWN illustration! ABSOLUTELY NO 3D CGI!

MANDATORY STYLE REQUIREMENTS:
- 2D HAND-DRAWN/PAINTED illustration like classic fairy tale books
- Style reference: Arthur Rackham, Edmund Dulac, Brian Froud, classic Disney 2D animation (Sleeping Beauty backgrounds)
- Visible BRUSH STROKES, pencil lines, or paint textures - this is hand-made art!
- Soft watercolor or gouache painting aesthetic with gentle color blending
- Delicate linework - you should see the artist's hand in every stroke
- Dreamy, magical atmosphere with soft glowing light effects
- Warm, muted color palette: soft golds, gentle greens, dusty pinks, warm browns
- Slightly stylized, whimsical character proportions (larger eyes, softer features)
- Rich, detailed backgrounds with nature elements, flowers, magical sparkles
- Paper or canvas texture visible in the artwork
- Classic fairy tale book aesthetic - think "The Secret Garden", "Peter Pan" illustrations

ABSOLUTELY FORBIDDEN:
- NO 3D CGI rendering whatsoever
- NO plastic/smooth 3D surfaces
- NO Pixar/Disney 3D movie style
- NO photorealistic rendering
- NO sharp, computer-generated edges

The final image should look like it was painted by hand with watercolors or gouache!`;

    case "SEMI_REALISTIC":
      return `★★★ SEMI-REALISTIC DIGITAL PORTRAIT ILLUSTRATION ★★★
STYLE: Detailed digital illustration maintaining realistic facial features

CORE STYLE DEFINITION:
- Digital painting style - smooth gradients, clean edges, polished finish
- Realistic facial proportions preserved from reference photo
- Style reference: Modern digital portrait art, Artstation portraits, premium children's book covers
- Natural skin tones with soft, airbrushed shading (NOT harsh shadows)
- Balanced lighting - soft diffused light, no dramatic shadows
- Clean, professional illustration quality

FACIAL FEATURES - CRITICAL:
- Face shape, bone structure MUST match reference photo EXACTLY
- Eyes: realistic size and shape (NOT enlarged), natural catchlights, same color as photo
- Nose: exact same shape and size as reference
- Mouth: natural shape, gentle expression
- Skin: smooth but natural texture, realistic skin tones from photo
- Hair: EXACT color, style, length, and texture from reference photo

COLOR AND LIGHTING:
- Warm, inviting color palette
- Soft, even lighting across the face
- Gentle color grading - slightly warm tones
- NO harsh contrasts or dramatic shadows
- Background: soft focus, complementary colors, NOT distracting

TECHNICAL REQUIREMENTS:
- Clean, artifact-free image
- NO white boxes, rectangles, or frames anywhere
- NO text, watermarks, signatures, or labels
- NO UI elements or borders
- Full bleed illustration - image fills entire frame
- Consistent style on EVERY page

ABSOLUTELY FORBIDDEN:
- NO white squares or rectangles on the image
- NO text overlays or captions
- NO watermarks or signatures
- NO anime/manga stylization
- NO 3D CGI plastic look
- NO photorealistic uncanny valley
- NO dramatic lighting or harsh shadows
- NO busy or cluttered compositions

The child should be INSTANTLY recognizable to parents!`;

    case "WATERCOLOR":
      return `SOFT WATERCOLOR illustration style
- Gentle, flowing watercolor painting technique
- Soft edges and artistic brushstrokes
- Delicate colors with transparency effects
- Traditional watercolor paper texture
- Dreamy, artistic children's book aesthetic`;

    case "PICTURE_BOOK":
      return `CLASSIC PICTURE BOOK illustration style
- Traditional children's book illustration
- Hand-drawn aesthetic with professional quality
- Rich colors and clear linework
- Timeless storybook feel
- Similar to classic published children's books`;

    case "GOUACHE":
      return `GOUACHE PAINTING style
- Thick, opaque paint texture
- Rich, vibrant colors with matte finish
- Bold brushstrokes and artistic layering
- Traditional children's book illustration technique
- Professional gouache painting aesthetic`;

    case "KAWAII":
      return `KAWAII CUTE style
- Adorable, chibi-style characters
- Large eyes and small features
- Pastel colors and soft palette
- Super cute and charming aesthetic
- Japanese kawaii illustration style`;

    case "COMIC_BOOK":
      return `COMIC BOOK illustration style
- Bold, clean linework with dynamic composition
- Vibrant colors and strong contrast
- Action-focused illustrations
- Comic book panel aesthetic
- Professional comic art style`;

    case "SOFT_ANIME":
      return `SOFT ANIME/MANGA style
- Anime-inspired illustration with gentle aesthetics
- Large expressive eyes and clean features
- Soft shading and delicate linework
- Pastel or vibrant colors depending on mood
- Professional manga/anime art style`;

    case "CLAY_ANIMATION":
      return `CLAY ANIMATION style
- Plasticine/clay texture and appearance
- Stop-motion animation aesthetic
- Handcrafted, tactile look
- Similar to Wallace & Gromit or Shaun the Sheep
- Charming claymation character design`;

    case "GEOMETRIC":
      return `GEOMETRIC ART style
- Simple geometric shapes and forms
- Modern, minimalist aesthetic
- Clean lines and bold colors
- Abstract, stylized character design
- Contemporary children's book illustration`;

    case "BLOCK_WORLD":
      return `BLOCK WORLD style (like Minecraft)
- Cubic, pixelated block aesthetic
- Voxel-based character and environment design
- Blocky, low-poly geometric style
- Minecraft-inspired illustration
- Playful blocky construction look`;

    case "COLLAGE":
      return `PAPER COLLAGE style
- Cut paper texture and layered artwork
- Mixed media collage aesthetic
- Visible paper edges and textures
- Artistic, handcrafted appearance
- Eric Carle-inspired children's book style`;

    case "STICKER_ART":
      return `STICKER ART style
- Flat, bold colors with clean outlines
- Sticker-like appearance with slight borders
- Playful, modern illustration style
- Crisp edges and simple shapes
- Fun, contemporary children's aesthetic`;

    default:
      // Default to 3D animation if unrecognized style
      return `3D CGI CARTOON style (Pixar/Disney quality)
- Professional 3D rendered children's book character
- High-quality CGI animation style
- Warm, pleasant colors with good contrast
- Clean, polished 3D rendering`;
  }
}

/**
 * Generate character reference image from child photo
 * This creates a consistent character in the specified art style that will be used across all pages
 * Phase 1 of character-first generation approach
 */
export async function generateCharacterReference(
  input: CharacterReferenceInput,
  bookId: string,
): Promise<IllustrationResult> {
  const { childPhotoUrl, childName, childGender, style } = input;

  const genderNote = childGender
    ? ` (${childGender === "boy" ? "boy" : childGender === "girl" ? "girl" : "child"})`
    : "";

  // Get style-specific art instructions
  const artStyleInstructions = getArtStyleInstructions(style);

  // Style-specific intro for character reference
  const styleIntro = style === "FANTASY_STORYBOOK"
    ? "Create a HAND-DRAWN 2D ILLUSTRATION character reference (NOT 3D!) for a fantasy storybook."
    : style === "SEMI_REALISTIC"
    ? "Create a SEMI-REALISTIC PORTRAIT ILLUSTRATION character reference for a children's book."
    : "Create a professional 3D CGI character reference for a children's book.";

  const prompt = `${styleIntro}

★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
★                    FACIAL IDENTITY PRESERVATION - #1 PRIORITY                    ★
★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★

CHARACTER: ${childName}${genderNote}

TASK: Transform this child's photo into ${style === "FANTASY_STORYBOOK" ? "a hand-drawn 2D illustration" : style === "SEMI_REALISTIC" ? "a semi-realistic digital portrait" : "a 3D Pixar/Disney style character"} while maintaining 100% IDENTICAL FACIAL FEATURES.

★★★ ABSOLUTE PRESERVATION RULES - DO NOT VIOLATE ★★★
1. DO NOT change the child's FACE in ANY way - preserve EXACT likeness
2. DO NOT change facial structure, bone geometry, or proportions
3. DO NOT change skin tone - match the EXACT color from photo
4. DO NOT change eye shape, eye color, eye spacing, or eye size
5. DO NOT change nose shape, nose size, or nostril shape
6. DO NOT change mouth shape, lip fullness, or mouth width
7. DO NOT change chin shape, jawline, or face width
8. DO NOT change forehead size or facial proportions
9. DO NOT change hair color, hair style, hair length, or hair texture
10. DO NOT create a "generic cute child" - this must be THIS SPECIFIC CHILD

★★★ WHAT YOU MUST PRESERVE (100% IDENTICAL) ★★★

FACE STRUCTURE (MOST CRITICAL):
□ Face shape: Is it round, oval, square, heart, or long? COPY EXACTLY!
□ Face width-to-height ratio: MEASURE and MATCH precisely
□ Chin: pointed, rounded, square, or soft? EXACT MATCH!
□ Jawline: sharp, soft, wide, or narrow? COPY EXACTLY!
□ Cheekbones: high, low, prominent, or subtle? MATCH!
□ Forehead: wide, narrow, high, or low? PRESERVE!

EYES (CRITICAL - WINDOWS TO IDENTITY):
□ Eye SHAPE: round, almond, hooded, upturned, downturned? EXACT!
□ Eye COLOR: the precise shade visible in photo
□ Eye SIZE: large, medium, small relative to face? MATCH!
□ Eye SPACING: wide-set, close-set, average? COPY!
□ Eyebrow shape, thickness, and arch: PRESERVE EXACTLY!
□ Eyelid crease type and visibility: MAINTAIN!

NOSE (CRITICAL - UNIQUE IDENTIFIER):
□ Nose SHAPE: button, straight, curved, wide, narrow? EXACT!
□ Nose SIZE relative to face: MATCH precisely
□ Nose bridge: high, low, wide, narrow? COPY!
□ Nostril shape and size: PRESERVE!
□ Nose tip: rounded, pointed, upturned? MAINTAIN!

MOUTH & LIPS (CRITICAL):
□ Lip SHAPE: full, thin, heart-shaped, wide? EXACT!
□ Lip COLOR: natural color from photo
□ Mouth WIDTH: wide, narrow, average? MATCH!
□ Lip proportions (upper vs lower): PRESERVE!

SKIN (CRITICAL):
□ Skin TONE: the EXACT shade - DO NOT lighten or darken!
□ Skin texture: smooth, freckled? MAINTAIN!
□ Any unique marks, dimples, or features: PRESERVE!

HAIR (CRITICAL - HIGHLY VISIBLE):
□ Hair COLOR: the EXACT shade - dark brown vs light brown vs black matters!
□ Hair TEXTURE: straight, wavy, curly? MATCH EXACTLY!
□ Hair LENGTH: Where does it fall? Ears/chin/shoulders/back? MEASURE!
□ Hair STYLE: parting, bangs, how it frames face? COPY!
□ Hair VOLUME: thick, thin, medium? PRESERVE!

★★★ ART STYLE APPLICATION ★★★
${artStyleInstructions}

IMPORTANT: Apply the art style to ENHANCE the illustration while PRESERVING all facial features.
The child's identity must be IMMEDIATELY recognizable even in stylized form.
Style changes ONLY clothing, pose, background, and rendering technique - NOT the face!

★★★ CHARACTER POSE ★★★
- Full body character view (head to toe visible)
- Standing in neutral, friendly pose
- Face turned slightly toward camera (3/4 view is acceptable)
- Pleasant, gentle expression with slight smile
- White or very light clean background
- Good lighting on face to show all features clearly

★★★ QUALITY REQUIREMENTS ★★★
- High detail on facial features - they must be CLEARLY visible
- Clean, professional illustration quality
- No distortion, artifacts, or blur on the face
- Face should be large enough to see all details clearly

★★★ NEGATIVE CONSTRAINTS - ABSOLUTELY FORBIDDEN ★★★
❌ DO NOT create a generic/idealized child face
❌ DO NOT make the child look older or younger
❌ DO NOT enlarge eyes beyond natural proportions (except for style-appropriate adjustments)
❌ DO NOT change the natural face shape to a "cuter" shape
❌ DO NOT lighten or darken skin tone
❌ DO NOT change hair color even slightly
❌ DO NOT shorten or lengthen hair
❌ DO NOT add or remove facial features
❌ DO NOT create an anime/manga face unless that specific style is requested
❌ DO NOT prioritize "cuteness" over ACCURACY

★★★ FINAL VERIFICATION CHECKLIST ★★★
Before finalizing, verify EACH of these is TRUE:
☐ Face shape matches photo EXACTLY
☐ Eye shape, color, and spacing match photo EXACTLY
☐ Nose shape and size match photo EXACTLY
☐ Mouth and lip shape match photo EXACTLY
☐ Skin tone matches photo EXACTLY (not lightened!)
☐ Hair color matches photo EXACTLY (not changed!)
☐ Hair length matches photo EXACTLY
☐ Hair style matches photo EXACTLY
☐ Parents would INSTANTLY recognize this as their child
☐ The child would recognize themselves in this illustration

If ANY checkbox is NO, STOP and regenerate with better accuracy!
This character will appear on EVERY page of the book - accuracy is CRITICAL!`;

  console.log(`[Character Reference] Generating character for ${childName}`);

  try {
    // Fetch child photo and convert to base64 (with retry)
    const photoResponse = await fetchWithRetry(childPhotoUrl, "Child photo for character reference");
    // Normalize the upload to JPEG so the declared MIME always matches the actual
    // bytes. A MIME/format mismatch (e.g. a WebP upload sent as image/jpeg because
    // the URL guess was wrong) is a confirmed trigger of Gemini's IMAGE_OTHER error.
    const rawPhotoBuffer = Buffer.from(await photoResponse.arrayBuffer());
    const photoBuffer = await sharp(rawPhotoBuffer).jpeg({ quality: 95 }).toBuffer();
    const photoBase64 = photoBuffer.toString("base64");
    const photoMimeType = "image/jpeg";

    console.log(`[Character Reference] Using photo as reference (${photoMimeType})`);

    // Generate character reference with Gemini (with retry logic + direct API)
    let response;
    let lastError: Error | null = null;
    const MAX_RETRIES = 5; // character ref is critical (used on every page) and IMAGE_OTHER is flaky

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        // Switch to the fallback model for the last two attempts if the
        // primary keeps failing (persistent IMAGE_OTHER is often model-specific)
        const model =
          attempt >= MAX_RETRIES - 2 ? IMAGE_FALLBACK_MODEL : IMAGE_MODEL;
        console.log(
          `[Character Reference] Gemini API attempt ${attempt + 1}/${MAX_RETRIES} (model: ${model})`,
        );

        // Use direct API call with JSON sanitization
        response = await callGeminiDirectly({
          model,
          contents: [
            {
              text: `★★★★★ CRITICAL: FACIAL IDENTITY PRESERVATION TASK ★★★★★

REFERENCE PHOTO: The image below shows the EXACT child whose face you must PRESERVE.

YOUR TASK: Create a stylized illustration of this child while maintaining 100% IDENTICAL facial features.

PRESERVATION DIRECTIVE (NON-NEGOTIABLE):
- DO NOT change the child's face, facial features, skin tone, or identity in ANY way
- Preserve the EXACT likeness, face shape, eye shape, nose shape, mouth shape
- Preserve the EXACT hair color, hair style, hair length, hair texture
- The child must be INSTANTLY recognizable - parents must say "That's my child!"

${prompt}

★★★ FINAL INSTRUCTION ★★★
Study the reference photo for at least 10 seconds before generating.
Every facial feature in your output MUST match the photo EXACTLY.
If you cannot preserve the exact likeness, DO NOT generate - this is a failure condition.
The success metric is: "Would the parents instantly recognize their child?"`,
            },
            {
              inlineData: {
                mimeType: photoMimeType,
                data: photoBase64,
              },
            },
          ],
          aspectRatio: "4:5", // Portrait book page (supported by Gemini)
        });

        // IMAGE_OTHER/OTHER come back as HTTP 200 with a bad finishReason and
        // are known transient Gemini image errors. Throw here so the retry loop
        // retries, instead of the post-loop check failing the whole job on the
        // first occurrence.
        const transientReason = response?.candidates?.[0]?.finishReason;
        if (transientReason === "IMAGE_OTHER" || transientReason === "OTHER") {
          throw new Error(`Transient image issue: ${transientReason}, retrying`);
        }

        // Success - break out of retry loop
        break;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(`[Character Reference] Gemini API attempt ${attempt + 1} failed:`, lastError.message);

        // If this is a JSON parsing error, log more details
        if (lastError.message.includes('parse') || lastError.message.includes('JSON')) {
          console.error(`[Character Reference] JSON parsing error detected`);
        }

        // If this is the last attempt, throw the error
        if (attempt === MAX_RETRIES - 1) {
          throw new Error(`Gemini API failed after ${MAX_RETRIES} attempts: ${lastError.message}`);
        }

        // Wait before retrying (exponential backoff, up to 30s to outlast
        // IMAGE_OTHER server-side bursts)
        const waitTime = Math.min(1000 * Math.pow(2, attempt), 30000);
        console.log(`[Character Reference] Retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    if (!response) {
      throw new Error(`Failed to get response from Gemini after ${MAX_RETRIES} attempts`);
    }

    // Extract image from response (direct API format)
    if (!response.candidates || response.candidates.length === 0) {
      // Check for prompt feedback (content blocked)
      if (response.promptFeedback) {
        console.error("[Character Reference] Prompt blocked:", JSON.stringify(response.promptFeedback));
        throw new Error(`Content blocked: ${response.promptFeedback.blockReason || "Unknown reason"}`);
      }
      console.error("[Character Reference] No candidates. Full response:", JSON.stringify(response).substring(0, 1000));
      throw new Error("No candidates in Gemini response");
    }

    const candidate = response.candidates[0];

    // Check if generation was blocked by safety filters
    if (candidate.finishReason && candidate.finishReason !== "STOP" && candidate.finishReason !== "MAX_TOKENS") {
      console.error("[Character Reference] Generation issue:", candidate.finishReason);
      if (candidate.safetyRatings) {
        console.error("[Character Reference] Safety ratings:", JSON.stringify(candidate.safetyRatings));
      }
      throw new Error(`Generation issue: ${candidate.finishReason}`);
    }

    if (!candidate?.content?.parts) {
      console.error("[Character Reference] No parts in candidate:", JSON.stringify(candidate).substring(0, 1000));
      throw new Error("No candidate data in Gemini response");
    }

    let imageBuffer: Buffer | null = null;

    // Direct API uses snake_case: inline_data instead of inlineData
    for (const part of candidate.content.parts) {
      const inlineData = part.inline_data || part.inlineData;
      if (inlineData?.data) {
        imageBuffer = Buffer.from(inlineData.data, "base64");
        console.log(`[Character Reference] Image generated (${imageBuffer.length} bytes)`);
        break;
      }
    }

    if (!imageBuffer) {
      // Log what parts we did receive
      console.error("[Character Reference] No image in parts:", JSON.stringify(candidate.content.parts.map((p: Record<string, unknown>) => Object.keys(p))));
      throw new Error("No image data in Gemini response");
    }

    // Resize to exact dimensions (8" × 10" portrait at 300 DPI)
    const CHAR_REF_WIDTH = 2400;
    const CHAR_REF_HEIGHT = 3000;
    console.log(`[Character Reference] Resizing to ${CHAR_REF_WIDTH}x${CHAR_REF_HEIGHT}...`);
    const resizedImageBuffer = await sharp(imageBuffer)
      .resize(CHAR_REF_WIDTH, CHAR_REF_HEIGHT, {
        fit: "contain", // Keep character proportions, add padding if needed
        position: "center",
        background: { r: 255, g: 255, b: 255, alpha: 1 }, // White background
      })
      .jpeg({ quality: 95 })
      .toBuffer();

    console.log(`[Character Reference] Image resized: ${resizedImageBuffer.length} bytes`);

    // Upload to R2 as "character-reference" (page -1)
    console.log(`[Character Reference] Uploading to R2...`);
    const { url: r2Url } = await uploadPageImage(
      resizedImageBuffer,
      bookId,
      -1, // Special page number for character reference
      "image/jpeg",
    );

    console.log(`[Character Reference] Character reference created: ${r2Url}`);

    return {
      imageUrl: r2Url,
      status: "succeeded",
    };
  } catch (error) {
    console.error("[Character Reference] Error:", error);

    if (error instanceof Error) {
      throw new Error(`Character reference generation failed: ${error.message}`);
    }

    throw new Error("Unknown error occurred while generating character reference");
  }
}

/**
 * Generate illustration using Gemini 2.5 Flash Image (FREE for testing!)
 * Synchronous generation - no webhooks/polling needed
 * Cover page: AI renders SHORT title (long words get misspelled)
 * Story pages: Illustration only (text overlaid in PDF)
 */
export async function generateIllustration(
  input: IllustrationInput,
  bookId: string,
  pageNumber: number,
): Promise<IllustrationResult> {
  const {
    sceneDescription,
    storyText,
    childName,
    childGender,
    characterReferenceUrl,
    previousPageUrl,
    pageType = "story-character",
    style,
  } = input;

  const genderNote = childGender ? ` (${childGender === "boy" ? "boy" : childGender === "girl" ? "girl" : "child"})` : "";

  // Individual portrait page layout based on page type
  // For cover, format title to use short simple words
  const coverTitle = pageType === "cover" ? formatCoverTitle(storyText, childName) : "";

  const textInstruction =
    pageType === "cover"
      ? `PROFESSIONAL BOOK COVER LAYOUT:
★ This is the COVER of a professional children's book ★

★★★ TITLE TEXT - MUST BE SPELLED EXACTLY ★★★
TITLE: "${coverTitle}"

SPELLING IS CRITICAL - COPY LETTER BY LETTER:
${coverTitle.split('').map((char, i) => `${i + 1}. "${char}"`).join('\n')}

TITLE REQUIREMENTS:
1. Write EXACTLY: "${coverTitle}" - copy each letter precisely!
2. Position title at TOP of cover, large and prominent
3. Add subtle shadow/outline so text is readable
4. Make it look like a real published book title

TITLE STYLING (based on story theme):
${getTitleStyleInstructions(sceneDescription)}

CHARACTER COMPOSITION:
- Main character positioned prominently in center/lower area
- Character looking happy, excited, and welcoming
- Character should be facing slightly toward viewer
- Full body or 3/4 view of character
- Character should be the STAR of the cover

BACKGROUND:
- Vibrant, engaging background that hints at the story theme
- Colors should be bright and eye-catching
- Professional published book quality
- Clean, not too cluttered
- Should appeal to children and parents

★★★ FULL BLEED - CRITICAL ★★★
- Cover illustration MUST fill the ENTIRE canvas from edge to edge
- NO white borders, NO margins, NO empty space at top/bottom/sides
- Background elements must extend to ALL FOUR EDGES

⚠️ ONLY write "${coverTitle}" - nothing else! No subtitles, no author names!`
      : pageType === "story-character"
      ? `CHARACTER PAGE LAYOUT (Page 1 - LEFT):
★★★ CLOSE-UP CHARACTER FOCUS ★★★
- Character should be LARGE and RECOGNIZABLE in the frame
- CLOSE framing - character should fill 60-70% of the image
- Character's FACE should be clearly visible and expressive
- Show character from waist-up or full body, but CLOSE enough to see facial features
- Character actively participating in the scene
- Professional children's book illustration with emphasis on character
- Background visible but character is the MAIN focus

★★★ CLEAN IMAGE - NO ARTIFACTS ★★★
- ABSOLUTELY NO text, words, letters, or writing anywhere on the image
- NO white boxes, rectangles, squares, or frames
- NO borders, UI elements, or overlays
- NO watermarks, signatures, or labels
- NO captions or title cards
- CLEAN, PROFESSIONAL illustration only

★★★ FULL BLEED - ABSOLUTELY CRITICAL ★★★
- Image MUST fill the ENTIRE 2400×3000 pixel canvas
- NO white space at TOP - sky/ceiling extends to top edge
- NO white space at BOTTOM - ground/floor extends to bottom edge
- NO white space at SIDES - scene extends to left and right edges
- NO margins, NO borders, NO frames of any kind
- The scene should appear to CONTINUE beyond the image edges
- If there's ANY white border visible, you have FAILED - regenerate!`
      : `BACKGROUND/ENVIRONMENT PAGE LAYOUT (Page 2 - RIGHT SIDE OF OPEN BOOK):
★★★ CRITICAL - SPATIAL CONTINUATION TO THE RIGHT ★★★

WHAT YOU'RE CREATING:
- Imagine standing in the scene and looking to the RIGHT →
- Left page: What you see looking STRAIGHT ahead (with character)
- Right page (THIS PAGE): What you see when you turn your head RIGHT →
- When book is open: ONE WIDE PANORAMIC VIEW spanning both pages

SPATIAL THINKING:
- If character is standing in a forest on left page:
  → Left: Shows trees in FRONT of character (left side of panorama)
  → Right (THIS PAGE): Shows MORE forest extending to the RIGHT (right side of panorama)
- If character is on a beach on left page:
  → Left: Beach scene with character (left portion)
  → Right (THIS PAGE): MORE beach/ocean continuing to the RIGHT
- The horizon line, sky, ground MUST align when pages are side-by-side

CRITICAL RULES:
1. SAME EXACT environment - just the RIGHT-SIDE VIEW
2. SAME sky, horizon line, ground level (must align horizontally)
3. SAME lighting, colors, weather, time of day
4. Elements that were visible on the LEFT edge of character page → continue on RIGHT edge of this page
5. NO character, NO people - just the environment extending rightward →
6. LARGE CLEAR SPACE in center for text (especially middle area)

VISUAL ALIGNMENT:
- Top of page: Sky/ceiling continues from left page - MUST touch TOP edge
- Middle: Main environment extends rightward
- Bottom: Ground/floor continues from left page - MUST touch BOTTOM edge
- Think: Camera panned RIGHT from character page

★★★ FULL BLEED - CRITICAL ★★★
- Image MUST fill the ENTIRE 2400×3000 canvas
- NO white borders at top, bottom, left, or right
- Sky/ceiling extends to TOP edge, ground/floor extends to BOTTOM edge
- Scene extends to LEFT and RIGHT edges
- NO margins or empty space anywhere

ABSOLUTELY NO text, words, letters, or writing - text will be overlaid in PDF`;

  const compositionRule =
    pageType === "cover"
      ? `COVER PAGE COMPOSITION:
- Image dimensions: 2400×3000 pixels (8" × 10" portrait at 300 DPI)
- Single portrait cover page
- Character prominently featured
- Title text at top (rendered by AI)
- Professional book cover design

★★★ FULL BLEED - CRITICAL ★★★
- The illustration MUST fill the ENTIRE canvas from edge to edge
- NO white borders, NO margins, NO empty space at top/bottom/sides
- Background/scene elements must extend to ALL FOUR EDGES
- NO built-in frames or borders around the image
- The artwork should "bleed" off all edges - as if continuing beyond the frame`
      : pageType === "story-character"
      ? `CHARACTER PAGE COMPOSITION:
- Image dimensions: 2400×3000 pixels (8" × 10" portrait at 300 DPI)
- Single PORTRAIT page for children's book
- CLOSE-UP CHARACTER SHOT: Character fills 60-70% of frame
- Character's face MUST be clearly visible and recognizable
- Camera positioned CLOSE to character (like a portrait)
- Character in action, showing emotion and personality
- Background provides context but doesn't dominate
- Professional children's book page quality
- NO text or words in illustration

★★★ FULL BLEED - CRITICAL ★★★
- The illustration MUST fill the ENTIRE canvas from edge to edge
- NO white borders, NO margins, NO empty space at top/bottom/sides
- Background/scene elements must extend to ALL FOUR EDGES
- NO built-in frames or borders around the image
- The artwork should "bleed" off all edges - as if continuing beyond the frame
- Sky/ceiling should touch TOP edge, ground/floor should touch BOTTOM edge`
      : `BACKGROUND PAGE COMPOSITION:
- Image dimensions: 2400×3000 pixels (8" × 10" portrait at 300 DPI)
- Single PORTRAIT page for children's book
- SAME SCENE as character page but empty
- Recreate the SAME environment/setting
- Leave clear space in middle for text overlay
- Think: character walked away, scene remains
- Professional children's book background

★★★ FULL BLEED - CRITICAL ★★★
- The illustration MUST fill the ENTIRE canvas from edge to edge
- NO white borders, NO margins, NO empty space at top/bottom/sides
- Background/scene elements must extend to ALL FOUR EDGES
- NO built-in frames or borders around the image
- The artwork should "bleed" off all edges - as if continuing beyond the frame
- Sky/ceiling should touch TOP edge, ground/floor should touch BOTTOM edge`;

  const characterInstructions =
    pageType === "story-background" && previousPageUrl
      ? `★★★ CRITICAL - PANORAMIC CONTINUATION (DO NOT COPY CHARACTER) ★★★

You have been provided with the CHARACTER PAGE image (LEFT side of open book).
YOUR TASK: Create the RIGHT side that CONTINUES this scene panoramically.

⚠️ THINK: SPLIT PANORAMA ⚠️
Imagine taking a WIDE PANORAMIC PHOTO and splitting it down the middle:
- LEFT HALF (provided image): Character in environment
- RIGHT HALF (YOUR TASK): SAME environment continuing, NO character

STEP-BY-STEP INSTRUCTIONS:
1. Study the CHARACTER PAGE carefully:
   - What environment is it? (forest, beach, room, street, etc.)
   - What's the lighting? (sunny, cloudy, indoor, time of day)
   - What's the color palette?
   - What's the artistic style?

2. Create the CONTINUATION:
   - Show MORE of that EXACT SAME environment extending to the right
   - SAME sky, SAME ground, SAME weather, SAME lighting
   - If there are trees on left → show MORE trees continuing right
   - If there's a building on left → show MORE of building/street right
   - If there's ocean on left → show MORE ocean continuing right
   - The scene MUST look CONNECTED when pages are side-by-side

3. REMOVE the character:
   - Show ONLY the environment/scenery/background
   - NO people, NO children, NO characters AT ALL
   - Like the character walked out of frame

4. Leave space for text:
   - Clear, uncluttered center area for text overlay

WHAT SUCCESS LOOKS LIKE:
When someone opens the book, they see ONE CONTINUOUS WIDE SCENE across both pages.
Left + Right = Seamless panoramic view of the same location.

FINAL OUTPUT:
- Environment continuation (right side of panorama)
- SAME location, SAME lighting, SAME style as left page
- NO character visible
- Professional children's book background illustration`
      : previousPageUrl
      ? `★★★ CRITICAL - USE PREVIOUS PAGE AS REFERENCE FOR CHARACTER ★★★
You have been provided with the PREVIOUS PAGE image showing the EXACT character to use.

ABSOLUTE REQUIREMENTS - DO NOT CHANGE:
- Study the character from the previous page VERY carefully
- Match EVERY detail from the previous page: face, hair, body, proportions, features
- The character MUST look IDENTICAL to how they appeared on the previous page

★★★ HAIR LENGTH - MOST IMPORTANT! ★★★
- MEASURE the hair length in the previous page image!
- If hair reaches SHOULDERS → it MUST reach SHOULDERS in your image!
- If hair reaches WAIST → it MUST reach WAIST in your image!
- If hair is SHORT (above ears) → it MUST be SHORT in your image!
- DO NOT make hair longer or shorter - EXACT SAME LENGTH!
- Hair length changing = FAILED illustration!

KEEP EXACTLY THE SAME:
- Face shape, chin, jawline
- Hair COLOR (exact shade - don't lighten or darken!)
- Hair STYLE (how it's parted, bangs, etc.)
- Hair LENGTH (where does it fall? - MEASURE IT!)
- Hair TEXTURE (straight, wavy, curly - don't change!)
- Eye shape and color
- Skin tone
- Body proportions

ONLY THESE CAN CHANGE:
- Pose and body position (to fit the new scene)
- Facial expression (to show emotion)
- Position in scene

This is the SAME character - maintain visual continuity!`
      : characterReferenceUrl
      ? `★★★★★ FACIAL IDENTITY PRESERVATION - ABSOLUTE PRIORITY ★★★★★

REFERENCE IMAGE: You have been provided with a CHARACTER REFERENCE showing the EXACT child.

PRESERVATION DIRECTIVE (NON-NEGOTIABLE):
DO NOT change the child's face, facial features, skin tone, hair, or identity in ANY way!
Preserve the EXACT likeness - this child must be INSTANTLY recognizable!

★★★ WHAT YOU MUST PRESERVE (100% IDENTICAL) ★★★

FACE (CRITICAL - DO NOT CHANGE):
□ Face SHAPE: round/oval/square/heart/long - COPY EXACTLY from reference!
□ Face PROPORTIONS: width-to-height ratio - MEASURE and MATCH!
□ Chin shape: pointed/rounded/square/soft - EXACT MATCH!
□ Jawline: sharp/soft/wide/narrow - PRESERVE EXACTLY!
□ Cheekbones: position and prominence - COPY!
□ Forehead: size and shape - MAINTAIN!

EYES (CRITICAL - DO NOT CHANGE):
□ Eye SHAPE: almond/round/hooded - EXACT from reference!
□ Eye COLOR: the precise shade - COPY!
□ Eye SIZE and SPACING: PRESERVE exactly!
□ Eyebrows: shape, thickness, arch - MAINTAIN!

NOSE (CRITICAL - DO NOT CHANGE):
□ Nose SHAPE and SIZE: EXACT from reference!
□ Nose bridge and tip: PRESERVE!

MOUTH (CRITICAL - DO NOT CHANGE):
□ Lip shape and fullness: EXACT from reference!
□ Mouth width: PRESERVE!

SKIN (CRITICAL - DO NOT CHANGE):
□ Skin TONE: EXACT shade - DO NOT lighten or darken!
□ Any unique features: freckles, dimples - PRESERVE!

HAIR (CRITICAL - DO NOT CHANGE):
□ Hair COLOR: EXACT shade - not lighter, not darker!
□ Hair LENGTH: Where does it fall? MEASURE and MATCH!
  → EARS = very short | CHIN = bob | SHOULDERS = medium | BACK = long
□ Hair TEXTURE: straight/wavy/curly - PRESERVE!
□ Hair STYLE: parting, bangs, how it frames face - COPY!

★★★ WHAT CAN CHANGE ★★★
✓ Pose and body position (to fit the scene)
✓ Facial EXPRESSION (smile, surprise, etc.) - but NOT facial STRUCTURE!
✓ Clothing (to fit the scene)
✓ Position in the scene

★★★ NEGATIVE CONSTRAINTS - ABSOLUTELY FORBIDDEN ★★★
❌ DO NOT change face shape or proportions
❌ DO NOT change eye shape, size, or color
❌ DO NOT change nose shape or size
❌ DO NOT change mouth or lip shape
❌ DO NOT lighten or darken skin tone
❌ DO NOT change hair color even slightly
❌ DO NOT shorten or lengthen hair
❌ DO NOT change hair texture (straight to curly or vice versa)
❌ DO NOT make the child look older or younger
❌ DO NOT create a "cuter" or "idealized" version

★★★ VERIFICATION - ASK YOURSELF ★★★
"Would the parents INSTANTLY recognize this as their child?"
"Is EVERY facial feature IDENTICAL to the reference?"
If NO to either question, STOP and regenerate with better accuracy!`
      : `★★★ CRITICAL - CHARACTER PHOTO MATCHING ★★★
Main character: ${childName}${genderNote}

YOU MUST MATCH THE REFERENCE PHOTO WITH 100% ACCURACY.
STUDY THE PHOTO CAREFULLY FOR AT LEAST 30 SECONDS BEFORE GENERATING!

★★★ FACE SHAPE - #1 PRIORITY ★★★
STEP 1: Analyze the photo's face shape carefully:
- Round, oval, square, heart-shaped, long, or triangular?
- Measure face width vs height ratio
- Study chin shape: pointed, rounded, square, soft?
- Study jawline: sharp, soft, wide, narrow?
- Study cheekbones: high, low, prominent, subtle?
- Study forehead: wide, narrow, high, low?

STEP 2: Match face shape EXACTLY:
- The character's face MUST have IDENTICAL proportions
- Chin shape MUST match EXACTLY
- Jawline MUST match EXACTLY
- Cheekbones MUST match EXACTLY
- Every parent MUST immediately say "That's my child's face!"

★★★ HAIR - #2 PRIORITY (LENGTH IS CRITICAL!) ★★★
STEP 1: Identify EXACT hair details from photo:
- EXACT color: black, dark brown, medium brown, light brown, blonde, red?
- EXACT shade (don't guess - LOOK at the photo!)
- EXACT texture: straight, wavy, curly, coily?
- ★ EXACT LENGTH - MEASURE CAREFULLY! ★
  → Where does it fall? EARS? CHIN? SHOULDERS? MID-BACK? WAIST?
  → This is CRITICAL - hair length changing = FAILED illustration!
- EXACT style: parted? bangs? how does it frame the face?
- EXACT volume: thick, thin, medium?
- EXACT hairline shape

STEP 2: Match hair EXACTLY:
- Color: EXACT SAME shade (DO NOT lighten or darken!)
- Texture: EXACT SAME (straight stays straight, curly stays curly!)
- ★ LENGTH: EXACT SAME - if shoulder-length, MUST be shoulder-length! ★
  → DO NOT make hair longer than in photo!
  → DO NOT make hair shorter than in photo!
  → Hair length must be IDENTICAL on EVERY page!
- Style: EXACT SAME (part, bangs, everything!)
- DO NOT "improve" or change ANYTHING about the hair!

FACIAL FEATURES (MUST MATCH EXACTLY):
- Eye shape, color, spacing: EXACT MATCH from photo
- Nose shape and size: EXACT MATCH from photo
- Mouth and lip shape: EXACT MATCH from photo
- Eyebrow shape and position: EXACT MATCH from photo
- Skin tone: EXACT MATCH from photo (DO NOT lighten or darken!)

CHARACTER CONSISTENCY:
- Character MUST look IDENTICAL on EVERY page
- Parents MUST immediately recognize their child
- DO NOT create a "generic cute child"
- Create THIS SPECIFIC CHILD from the photo

★★★ VERIFICATION CHECKLIST ★★★
Before generating, verify:
□ Face shape matches photo EXACTLY?
□ Chin and jawline match photo EXACTLY?
□ Hair color matches photo EXACTLY (same shade)?
□ Hair style matches photo EXACTLY?
□ Hair length matches photo EXACTLY?
□ Hair texture matches photo EXACTLY?
□ All facial features match photo EXACTLY?
□ Parents would recognize their child instantly?

If answer is NO to ANY question, STUDY THE PHOTO AGAIN and match more carefully!
This character MUST be INSTANTLY recognizable as the child in the photo.`;

  // Get style-specific rendering instruction
  const styleEnforcement = style === "FANTASY_STORYBOOK"
    ? `★★★ MANDATORY ART STYLE: HAND-DRAWN 2D ILLUSTRATION ★★★
THIS IS NOT NEGOTIABLE - THE IMAGE MUST BE 2D HAND-DRAWN/PAINTED!
- Must look like traditional watercolor or gouache painting
- Visible brush strokes, pencil textures, paint marks
- NO 3D CGI rendering! NO plastic smooth surfaces!
- If it looks like Pixar/Disney 3D, you have FAILED - redo it!`
    : style === "SEMI_REALISTIC"
    ? `★★★ MANDATORY ART STYLE: SEMI-REALISTIC DIGITAL PORTRAIT ★★★
THIS IS NOT NEGOTIABLE - CLEAN DIGITAL PORTRAIT ILLUSTRATION!
- Digital painting style with smooth gradients and polished finish
- Face MUST be realistic - parents should recognize their child instantly
- Natural proportions, realistic skin tones, soft even lighting
- NO anime eyes! NO cartoon stylization! NO 3D CGI plastic look!
- CLEAN IMAGE: NO white boxes, NO rectangles, NO frames, NO text, NO watermarks!
- Full bleed illustration - image must fill the ENTIRE frame with NO borders!`
    : `★★★ MANDATORY ART STYLE: 3D CGI PIXAR/DISNEY ★★★
THIS IS NOT NEGOTIABLE - THE IMAGE MUST BE 3D CGI ANIMATION STYLE!
- Professional 3D rendered like Pixar/Disney movies
- Smooth 3D surfaces, realistic lighting, polished render`;

  const enhancedPrompt = `${styleEnforcement}

Professional children's book ${pageType === "cover" ? "cover" : "page"} illustration. ${sceneDescription}

${characterInstructions}

PROFESSIONAL BOOK QUALITY - KEEP IT SIMPLE:
- Focus ONLY on the main character and essential scene elements
- NO random animals unless they are part of the story scene
- NO unnecessary creatures, objects, or clutter
- Clean, simple, uncluttered composition
- Professional like real published children's books (NOT busy or chaotic)
- Simple backgrounds that support the story

ART STYLE - MUST BE CONSISTENT ON EVERY PAGE:
${getArtStyleInstructions(style)}
- Same art style on EVERY single page
- Consistent visual style throughout the entire book
- Professional children's book quality

${compositionRule}

${textInstruction}

IMPORTANT: Portrait page format (4:5 aspect ratio, 2400×3000px). ${pageType === "cover" ? "Single portrait cover page" : "Single portrait page"}

★★★ FINAL REMINDER - FULL BLEED ★★★
The generated image MUST fill the ENTIRE 2400×3000 canvas with NO white space:
- Top edge: Sky/ceiling/background extends to very top
- Bottom edge: Ground/floor/background extends to very bottom
- Left/Right edges: Scene extends to both sides
- NO white borders, NO margins, NO empty space ANYWHERE
- If there is ANY white border visible in your output, START OVER!`;

  console.log(`[Illustration Generator] Generating ${pageType} with ${IMAGE_MODEL}`);
  console.log(`[Illustration Generator] Prompt: ${enhancedPrompt.substring(0, 200)}...`);

  try {
    // Fetch child photo for reference (with retry)
    const photoResponse = await fetchWithRetry(input.childPhotoUrl, "Child photo for illustration");
    // Normalize the upload to JPEG so the declared MIME matches the bytes
    // (a WebP/PNG mislabeled as JPEG is a confirmed cause of Gemini IMAGE_OTHER).
    const rawPhotoBuffer = Buffer.from(await photoResponse.arrayBuffer());
    const photoBuffer = await sharp(rawPhotoBuffer).jpeg({ quality: 95 }).toBuffer();
    const photoBase64 = photoBuffer.toString("base64");
    const photoMimeType = "image/jpeg";

    console.log(`[Illustration Generator] Using child photo as reference (${photoMimeType})`);

    // Prepare contents for Gemini
    const contents: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];

    // Build the prompt text based on what references we have
    let promptText: string;

    if (previousPageUrl && pageType === "story-background") {
      // BACKGROUND PAGE: Create panoramic continuation
      promptText = `★★★ CRITICAL: CREATE THE RIGHT-SIDE CONTINUATION OF THE PANORAMA ★★★

IMAGE 1: Shows the LEFT HALF of a wide panoramic scene (with character)
IMAGE 2: Child photo reference (DO NOT include character in your output)

${enhancedPrompt}

★★★ UNDERSTAND THIS CAREFULLY ★★★

You are creating a PANORAMIC BOOK SPREAD:
- When the book is OPEN: LEFT page + RIGHT page = ONE WIDE CONTINUOUS SCENE
- Image 1 = LEFT HALF of the panorama (already created)
- YOUR TASK = Create the RIGHT HALF (what continues to the right →)

THINK LIKE A CAMERA:
- Image 1: Camera pointing LEFT, capturing left side of scene
- YOUR IMAGE: Camera pointing RIGHT, capturing right side of SAME scene
- Together: 180° or wide-angle view of ONE location

NOT ALLOWED:
❌ DO NOT duplicate/copy Image 1
❌ DO NOT just "remove the character" from Image 1
❌ DO NOT create a different/new scene
❌ DO NOT add the character anywhere

WHAT TO DO:
✅ Show what's PHYSICALLY TO THE RIGHT → of Image 1's scene
✅ SAME environment extending rightward
✅ Horizon/sky/ground MUST align perfectly with Image 1
✅ NO characters, NO people - just scenery

OUTPUT SPECS:
- Dimensions: 2400×3000 pixels (8" × 10" portrait at 300 DPI)
- Style: 3D CGI CARTOON (Pixar/Disney) - EXACT SAME as Image 1
- This is the RIGHT HALF continuing from Image 1
- ★ FULL BLEED: Fill ENTIRE canvas - NO white borders/margins at top/bottom/sides!
- Sky must touch TOP edge, ground must touch BOTTOM edge

PRECISE INSTRUCTIONS:

STEP 1 - ANALYZE IMAGE 1 CAREFULLY:
□ What is the environment type? (forest/beach/city/room/space/etc.)
□ Where is the horizon line? (measure from bottom - must match exactly)
□ What's the sky like? (color, clouds, weather, time of day)
□ What's the ground like? (grass/sand/floor - color and texture)
□ What elements are visible? (trees/water/buildings/objects)
□ Where is the light coming from? (angle and color)
□ What are the dominant colors?
□ What's on the RIGHT EDGE of Image 1? (this continues on YOUR left edge)

STEP 2 - CREATE YOUR RIGHT CONTINUATION:
□ Place horizon at EXACT SAME height as Image 1
□ Sky: IDENTICAL color, clouds, lighting, weather
□ Ground: CONTINUES seamlessly (same texture/color as Image 1)
□ Elements: Show MORE of what's in Image 1 (more trees/more ocean/more buildings)
□ LEFT edge of YOUR image: Should connect to RIGHT edge of Image 1
□ RIGHT edge of YOUR image: Scene continues further right
□ Lighting: SAME angle and color as Image 1
□ Color palette: IDENTICAL to Image 1

STEP 3 - ALIGNMENT CHECKLIST:
□ Top 30%: Sky matches Image 1 exactly
□ Middle 40%: Environment extends right - KEEP SIMPLE/CLEAR for text overlay
□ Bottom 30%: Ground matches Image 1 exactly
□ NO people, NO characters, NO children anywhere
□ Just pure scenery/environment

STEP 4 - TEXT SPACE:
□ Center area: SIMPLE backgrounds (sky/water/ground) - text will overlay here
□ Avoid complex objects in the center
□ Details can be at edges

CONCRETE EXAMPLES:

Example 1 - FOREST:
- Image 1: Character standing among trees on left side
- YOUR IMAGE: MORE trees extending to the right, same forest, NO character

Example 2 - BEACH:
- Image 1: Character on beach with ocean on left
- YOUR IMAGE: MORE ocean/beach extending right, same water/sand, NO character

Example 3 - CITY:
- Image 1: Character on street with buildings on left
- YOUR IMAGE: MORE street/buildings extending right, same cityscape, NO character

Example 4 - ROOM:
- Image 1: Character in room with furniture on left
- YOUR IMAGE: MORE of the same room extending right, same walls/floor, NO character

ABSOLUTELY NO text, words, letters, or writing anywhere in the illustration.

FINAL REMINDER:
This is NOT "Image 1 without the character"
This IS "What you see when you look TO THE RIGHT → from Image 1's viewpoint"
Think: PANORAMIC PHOTOGRAPHY - one continuous wide scene split into two frames`;
    } else if (characterReferenceUrl && previousPageUrl) {
      // CHARACTER PAGE with BOTH references - most common case for pages 2+
      promptText = `★★★★★ FACIAL IDENTITY PRESERVATION TASK ★★★★★

THREE REFERENCE IMAGES PROVIDED:

IMAGE 1 (MASTER CHARACTER REFERENCE):
→ This shows the EXACT child character you must reproduce
→ DO NOT change this child's face, features, hair, or identity in ANY way
→ This is your PRIMARY and ONLY source for character appearance

IMAGE 2 (PREVIOUS PAGE):
→ Use ONLY for art style, lighting, and scene continuity
→ DO NOT use for character appearance - use IMAGE 1 instead!

IMAGE 3 (ORIGINAL PHOTO):
→ The child's real photo for final verification
→ Your character must be recognizable as THIS child

★★★ ABSOLUTE PRESERVATION DIRECTIVE ★★★
DO NOT change the child's face, facial features, skin tone, hair, or identity!
The child in your output must be 100% IDENTICAL to IMAGE 1.
Parents must INSTANTLY recognize their child in your illustration.

★★★ WHAT YOU MUST PRESERVE FROM IMAGE 1 (NON-NEGOTIABLE) ★★★

FACE STRUCTURE:
□ Face SHAPE (round/oval/square/heart) - EXACT from IMAGE 1
□ Face PROPORTIONS - MEASURE and MATCH
□ Chin shape - EXACT from IMAGE 1
□ Jawline - EXACT from IMAGE 1
□ Cheekbones - EXACT from IMAGE 1

EYES:
□ Eye SHAPE - EXACT from IMAGE 1
□ Eye COLOR - EXACT from IMAGE 1
□ Eye SIZE and SPACING - EXACT from IMAGE 1

NOSE:
□ Nose SHAPE and SIZE - EXACT from IMAGE 1

MOUTH:
□ Lip shape and mouth width - EXACT from IMAGE 1

SKIN:
□ Skin TONE - EXACT from IMAGE 1 (DO NOT lighten or darken!)

HAIR:
□ Hair COLOR - EXACT shade from IMAGE 1
□ Hair LENGTH - MEASURE where it falls in IMAGE 1 and MATCH EXACTLY!
  → EARS = very short | CHIN = bob | SHOULDERS = medium | BACK = long
□ Hair TEXTURE - straight/wavy/curly - EXACT from IMAGE 1
□ Hair STYLE - parting, bangs, framing - EXACT from IMAGE 1

AGE:
□ Character must be the SAME AGE as in IMAGE 1
□ Do NOT make the child look older or younger!

★★★ WHAT TO TAKE FROM IMAGE 2 ★★★
✓ Art style and rendering technique
✓ Color palette and lighting
✓ Scene atmosphere and mood
✓ Background style

★★★ WHAT CAN CHANGE ★★★
✓ Pose and body position (to fit the new scene)
✓ Facial EXPRESSION (but NOT facial STRUCTURE!)
✓ Position in the scene
✓ Clothing (if scene requires)

★★★ NEGATIVE CONSTRAINTS ★★★
❌ DO NOT change face shape or proportions
❌ DO NOT change any facial features
❌ DO NOT lighten or darken skin
❌ DO NOT change hair color, length, or texture
❌ DO NOT make child look older or younger
❌ DO NOT create a "cuter" or "idealized" version
❌ DO NOT use IMAGE 2 for character appearance!

${enhancedPrompt}

★★★ FULL BLEED REQUIREMENT ★★★
- Image MUST fill the ENTIRE 2400×3000 canvas with NO white borders
- Sky/ceiling must touch TOP edge, ground/floor must touch BOTTOM edge
- NO margins, NO white space at edges - scene extends to ALL FOUR EDGES

★★★ FINAL VERIFICATION ★★★
Ask yourself: "Is this the EXACT SAME child from IMAGE 1?"
If NO, STOP and regenerate with better accuracy!`;
    } else if (previousPageUrl) {
      // CHARACTER PAGE: Only previous page available (no character reference)
      promptText = `PREVIOUS PAGE REFERENCE: The first image shows the character from the previous page.
CHILD PHOTO: The second image is the original photo for additional reference.

★★★ CHARACTER AGE - NEVER CHANGES ★★★
- The character's AGE must stay EXACTLY the same as previous page
- Do NOT make the character look older or younger
- Same child, same age throughout the ENTIRE book

${enhancedPrompt}

CRITICAL REQUIREMENTS:
- Output dimensions: 2400×3000 pixels (8" × 10" portrait at 300 DPI)
- This is a SINGLE PORTRAIT PAGE for a children's book
- 3D CGI CARTOON style (Pixar/Disney quality) - SAME style as previous page
- Use the PREVIOUS PAGE as reference - character must look IDENTICAL
- Character must look the SAME as on the previous page (same face, hair, features, proportions)
- CHARACTER AGE must stay the SAME - do not age the character!
- Only change: pose, expression, position for this new scene
- SAME 3D art style on every page - consistent CGI look throughout
- Leave clear space in middle/center for text overlay
- Simple, clean, professional illustrations - NOT cluttered or busy
- NO random animals or creatures unless specifically mentioned in the scene

WHAT TO AVOID:
- Different art styles (2D flat, realistic, photographic) - ONLY 3D CGI
- Changing the character's appearance from the previous page
- Random animals, creatures, or objects not in the scene description
- Cluttered, busy compositions
- Text or words in the illustration
- ANY white borders or margins - image must be FULL BLEED!

★★★ FULL BLEED REQUIREMENT ★★★
- Image MUST fill the ENTIRE 2400×3000 canvas with NO white borders
- Sky/ceiling must touch TOP edge, ground/floor must touch BOTTOM edge
- NO margins, NO white space at edges - scene extends to ALL FOUR EDGES`;
    } else if (characterReferenceUrl) {
      promptText = `★★★★★ FACIAL IDENTITY PRESERVATION TASK ★★★★★

TWO REFERENCE IMAGES PROVIDED:

IMAGE 1 (MASTER CHARACTER REFERENCE):
→ This shows the EXACT child character you must reproduce
→ DO NOT change this child's face, features, hair, or identity in ANY way
→ Copy this character with 100% accuracy

IMAGE 2 (ORIGINAL PHOTO):
→ The child's real photo for verification
→ Your character must be recognizable as THIS child

★★★ ABSOLUTE PRESERVATION DIRECTIVE ★★★
DO NOT change the child's face, facial features, skin tone, hair, or identity!
Preserve EXACT likeness - parents must INSTANTLY recognize their child!

★★★ WHAT YOU MUST PRESERVE (100% IDENTICAL TO IMAGE 1) ★★★

FACE: Shape, proportions, chin, jawline, cheekbones - EXACT!
EYES: Shape, color, size, spacing, eyebrows - EXACT!
NOSE: Shape, size, bridge - EXACT!
MOUTH: Lip shape, mouth width - EXACT!
SKIN: Tone - EXACT (DO NOT lighten or darken!)
HAIR: Color, LENGTH, texture, style - ALL EXACT!
AGE: Same age - do NOT make older or younger!

★★★ HAIR LENGTH IS CRITICAL ★★★
MEASURE where hair falls in IMAGE 1:
→ EARS = very short | CHIN = bob | SHOULDERS = medium | BACK = long
Hair length MUST be IDENTICAL in your output!

★★★ WHAT CAN CHANGE ★★★
✓ Pose (to fit the scene)
✓ Facial expression (but NOT facial structure!)
✓ Position in scene
✓ Clothing

★★★ NEGATIVE CONSTRAINTS ★★★
❌ DO NOT change face shape or any facial features
❌ DO NOT lighten or darken skin
❌ DO NOT change hair color, length, or texture
❌ DO NOT make child look older or younger
❌ DO NOT create a "cuter" or "idealized" version

${enhancedPrompt}

TECHNICAL REQUIREMENTS:
- Output: 2400×3000 pixels (8" × 10" portrait at 300 DPI)
- Leave clear space for text overlay
- Simple, professional composition

★★★ FULL BLEED REQUIREMENT ★★★
- Image MUST fill the ENTIRE canvas with NO white borders
- Sky/ceiling to TOP edge, ground/floor to BOTTOM edge
- NO margins at edges - scene extends to ALL FOUR EDGES

★★★ FINAL VERIFICATION ★★★
"Is this the EXACT SAME child from IMAGE 1?"
If NO, regenerate with better accuracy!`;
    } else {
      promptText = `REFERENCE PHOTO: Study this child's appearance - recreate the EXACT same character on every page.

${enhancedPrompt}

CRITICAL REQUIREMENTS:
- Output dimensions: 2400×3000 pixels (8" × 10" portrait at 300 DPI)
- This is a SINGLE PORTRAIT PAGE for a children's book
- 3D CGI CARTOON style (Pixar/Disney quality) on EVERY page
- Character must look IDENTICAL on every page (same face, same hair, same everything)
- DO NOT change the character's hair style, hair color, or appearance between pages
- SAME 3D art style on every page - consistent CGI look throughout
- Leave clear space in middle/center for text overlay
- Simple, clean, professional illustrations - NOT cluttered or busy
- NO random animals or creatures unless specifically mentioned in the scene

WHAT TO AVOID:
- Different art styles (2D flat, realistic, photographic) - ONLY 3D CGI
- Changing the character's appearance, hair, or features between pages
- Random animals, creatures, or objects not in the scene description
- Cluttered, busy compositions
- Text or words in the illustration
- ANY white borders or margins - image must be FULL BLEED!

★★★ FULL BLEED REQUIREMENT ★★★
- Image MUST fill the ENTIRE 2400×3000 canvas with NO white borders
- Sky/ceiling must touch TOP edge, ground/floor must touch BOTTOM edge
- NO margins, NO white space at edges - scene extends to ALL FOUR EDGES`;
    }

    contents.push({ text: promptText });

    // CRITICAL FOR CONSISTENCY: Always include character reference as MASTER
    // For multi-page books, character drift happens if we only use previous page
    // Character reference = MASTER anchor for character appearance
    // Previous page = scene/style continuity only

    // ALWAYS add character reference first (master reference prevents drift)
    if (characterReferenceUrl) {
      console.log(`[Illustration Generator] Adding CHARACTER REFERENCE (master): ${characterReferenceUrl}`);
      const charRefResponse = await fetchWithRetry(characterReferenceUrl, "Character reference");
      const charRefBuffer = await charRefResponse.arrayBuffer();
      const charRefBase64 = Buffer.from(charRefBuffer).toString("base64");
      const charRefMimeType = characterReferenceUrl.toLowerCase().includes('.png')
        ? 'image/png'
        : 'image/jpeg';

      contents.push({
        inlineData: {
          mimeType: charRefMimeType,
          data: charRefBase64,
        },
      });
    }

    // ALSO add previous page for scene/style continuity (not for character)
    // Track its index so the retry loop can drop it as a degradation fallback:
    // heavier multi-image requests are more likely to trip Gemini's IMAGE_OTHER.
    let prevPageContentIndex: number | null = null;
    if (previousPageUrl) {
      console.log(`[Illustration Generator] Adding previous page (scene continuity): ${previousPageUrl}`);
      const prevPageResponse = await fetchWithRetry(previousPageUrl, "Previous page");
      const prevPageBuffer = await prevPageResponse.arrayBuffer();
      const prevPageBase64 = Buffer.from(prevPageBuffer).toString("base64");
      const prevPageMimeType = previousPageUrl.toLowerCase().includes('.png')
        ? 'image/png'
        : 'image/jpeg';

      prevPageContentIndex = contents.length;
      contents.push({
        inlineData: {
          mimeType: prevPageMimeType,
          data: prevPageBase64,
        },
      });
    }

    // Add child photo as final reference
    contents.push({
      inlineData: {
        mimeType: photoMimeType,
        data: photoBase64,
      },
    });

    // Generate with Gemini (with retry logic + direct API)
    let imageBuffer: Buffer | null = null;
    let lastError: Error | null = null;
    // IMAGE_OTHER comes in server-side bursts that can last minutes, so a few
    // quick retries aren't enough. 6 attempts with backoff up to 30s (~60s of
    // total waiting) rides out a typical burst.
    const MAX_RETRIES = 6;
    // From this attempt onward, drop the previous-page reference to lighten the
    // request (character ref remains the consistency anchor).
    const SIMPLIFY_AFTER_ATTEMPT = 3;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        // Switch to the fallback model for the last two attempts if the
        // primary keeps failing (persistent IMAGE_OTHER is often model-specific)
        const model =
          attempt >= MAX_RETRIES - 2 ? IMAGE_FALLBACK_MODEL : IMAGE_MODEL;
        console.log(
          `[Illustration Generator] Gemini API attempt ${attempt + 1}/${MAX_RETRIES} (model: ${model})`,
        );

        let attemptContents = contents;
        if (attempt >= SIMPLIFY_AFTER_ATTEMPT && prevPageContentIndex !== null) {
          console.log(
            `[Illustration Generator] Simplifying request: dropping previous-page reference (attempt ${attempt + 1})`,
          );
          attemptContents = contents.filter((_, i) => i !== prevPageContentIndex);
        }

        // Use direct API call with JSON sanitization
        // Request 4:5 portrait aspect ratio for book pages
        const response = await callGeminiDirectly({
          model,
          contents: attemptContents,
          aspectRatio: "4:5", // Portrait book page (supported by Gemini)
        });

        console.log(`[Illustration Generator] Gemini API call successful`);

        // Validate response - if invalid, throw to trigger retry
        if (!response.candidates || response.candidates.length === 0) {
          if (response.promptFeedback) {
            console.error("[Illustration Generator] Prompt blocked:", JSON.stringify(response.promptFeedback));
            throw new Error(`Content blocked: ${response.promptFeedback.blockReason || "Unknown reason"}`);
          }
          console.error("[Illustration Generator] No candidates. Full response:", JSON.stringify(response).substring(0, 1000));
          throw new Error("No candidates in Gemini response");
        }

        const candidate = response.candidates[0];

        // Check if generation was blocked or had issues - retry for "OTHER"
        if (candidate.finishReason && candidate.finishReason !== "STOP" && candidate.finishReason !== "MAX_TOKENS") {
          console.error("[Illustration Generator] Generation issue:", candidate.finishReason);
          if (candidate.safetyRatings) {
            console.error("[Illustration Generator] Safety ratings:", JSON.stringify(candidate.safetyRatings));
          }
          // "OTHER"/"IMAGE_OTHER" are often transient Gemini image errors - retry them
          if (
            candidate.finishReason === "OTHER" ||
            candidate.finishReason === "IMAGE_OTHER"
          ) {
            throw new Error(
              `Generation issue: ${candidate.finishReason} (transient, will retry)`,
            );
          }
          // Other issues like SAFETY are not retryable
          throw new Error(`Generation blocked: ${candidate.finishReason}`);
        }

        if (!candidate?.content?.parts) {
          console.error("[Illustration Generator] No parts in candidate:", JSON.stringify(candidate).substring(0, 1000));
          throw new Error("No candidate data in Gemini response");
        }

        // Extract image data
        for (const part of candidate.content.parts) {
          const inlineData = part.inline_data || part.inlineData;
          if (inlineData?.data) {
            imageBuffer = Buffer.from(inlineData.data, "base64");
            console.log(`[Illustration Generator] Image generated successfully (${imageBuffer.length} bytes)`);
            break;
          }
        }

        if (!imageBuffer) {
          console.error("[Illustration Generator] No image in parts:", JSON.stringify(candidate.content.parts.map((p: Record<string, unknown>) => Object.keys(p))));
          throw new Error("No image data in Gemini response");
        }

        // Success - break out of retry loop
        break;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(`[Illustration Generator] Gemini API attempt ${attempt + 1} failed:`, lastError.message);

        // Content blocked errors are not retryable
        if (lastError.message.includes('Content blocked') || lastError.message.includes('Generation blocked')) {
          throw lastError;
        }

        // If this is the last attempt, throw the error
        if (attempt === MAX_RETRIES - 1) {
          throw new Error(`Gemini API failed after ${MAX_RETRIES} attempts: ${lastError.message}`);
        }

        // Wait before retrying (exponential backoff, up to 30s to outlast
        // IMAGE_OTHER server-side bursts)
        const waitTime = Math.min(1000 * Math.pow(2, attempt), 30000);
        console.log(`[Illustration Generator] Retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    if (!imageBuffer) {
      throw new Error(`Failed to generate image after ${MAX_RETRIES} attempts`);
    }

    // Resize image to exact dimensions (2400x3000) WITHOUT cropping
    // Use "fill" to stretch to exact dimensions - better than cropping important content
    console.log(`[Illustration Generator] Resizing to ${IMAGE_WIDTH}x${IMAGE_HEIGHT}...`);

    // Get original image dimensions to decide resize strategy
    const metadata = await sharp(imageBuffer).metadata();
    const origWidth = metadata.width || 1;
    const origHeight = metadata.height || 1;
    const origAspect = origWidth / origHeight;
    const targetAspect = IMAGE_WIDTH / IMAGE_HEIGHT; // 0.8 for 4:5

    console.log(`[Illustration Generator] Original: ${origWidth}x${origHeight} (aspect: ${origAspect.toFixed(2)}), Target: ${IMAGE_WIDTH}x${IMAGE_HEIGHT} (aspect: ${targetAspect.toFixed(2)})`);

    let resizedImageBuffer: Buffer;

    // If aspect ratio is close enough (within 10%), use fill to stretch
    // Otherwise use contain + extend to avoid major distortion
    const aspectDiff = Math.abs(origAspect - targetAspect) / targetAspect;

    if (aspectDiff < 0.15) {
      // Aspect ratio is close - use fill (slight stretch is acceptable)
      console.log(`[Illustration Generator] Aspect ratio close (${(aspectDiff * 100).toFixed(1)}% diff) - using fill`);
      resizedImageBuffer = await sharp(imageBuffer)
        .resize(IMAGE_WIDTH, IMAGE_HEIGHT, {
          fit: "fill", // Stretch to exact dimensions
        })
        .jpeg({ quality: 95 })
        .toBuffer();
    } else {
      // Aspect ratio is very different - resize to fit inside, then extend edges
      console.log(`[Illustration Generator] Aspect ratio different (${(aspectDiff * 100).toFixed(1)}% diff) - using contain + extend`);

      // First resize to fit inside target dimensions
      const resizedInside = await sharp(imageBuffer)
        .resize(IMAGE_WIDTH, IMAGE_HEIGHT, {
          fit: "inside",
        })
        .toBuffer();

      // Get the resized dimensions
      const resizedMeta = await sharp(resizedInside).metadata();
      const resizedW = resizedMeta.width || IMAGE_WIDTH;
      const resizedH = resizedMeta.height || IMAGE_HEIGHT;

      // Calculate padding needed
      const padLeft = Math.floor((IMAGE_WIDTH - resizedW) / 2);
      const padRight = IMAGE_WIDTH - resizedW - padLeft;
      const padTop = Math.floor((IMAGE_HEIGHT - resizedH) / 2);
      const padBottom = IMAGE_HEIGHT - resizedH - padTop;

      console.log(`[Illustration Generator] Extending: left=${padLeft}, right=${padRight}, top=${padTop}, bottom=${padBottom}`);

      // Extend with edge pixel mirroring (better than solid color)
      resizedImageBuffer = await sharp(resizedInside)
        .extend({
          top: padTop,
          bottom: padBottom,
          left: padLeft,
          right: padRight,
          extendWith: "mirror", // Mirror edge pixels for seamless extension
        })
        .jpeg({ quality: 95 })
        .toBuffer();
    }

    console.log(`[Illustration Generator] Image resized: ${resizedImageBuffer.length} bytes`);

    // Upload to R2 immediately
    console.log(`[Illustration Generator] Uploading to R2...`);
    const uploadFn = pageType === "story-background" ? uploadBackgroundImage : uploadPageImage;
    const { url: r2Url } = await uploadFn(
      resizedImageBuffer,
      bookId,
      pageNumber,
      "image/jpeg",
    );

    console.log(`[Illustration Generator] Image uploaded to R2: ${r2Url}`);

    return {
      imageUrl: r2Url,
      status: "succeeded",
    };
  } catch (error) {
    console.error("[Illustration Generator] Gemini API Error:", error);

    if (error instanceof Error) {
      throw new Error(`Gemini API error: ${error.message}`);
    }

    throw new Error("Unknown error occurred while generating illustration");
  }
}
