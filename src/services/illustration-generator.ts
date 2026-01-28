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

/**
 * Format cover title to ensure it's max 2 words, in Uzbek, includes child name
 */
function formatCoverTitle(rawTitle: string, childName: string): string {
  // Clean the title
  let title = rawTitle.trim();

  // Check for English words and replace with Uzbek
  const englishPattern = /\b(the|of|and|in|on|at|to|for|with|adventure|journey|story|magic|world|adventures)\b/i;
  if (englishPattern.test(title)) {
    console.log(`[Cover Title] English detected in "${title}", using default`);
    return `${childName} Sarguzashti`;
  }

  // Split into words
  const words = title.split(/\s+/).filter(w => w.length > 0);

  // If more than 2 words, truncate or use default
  if (words.length > 2) {
    console.log(`[Cover Title] Too many words (${words.length}) in "${title}"`);

    // Check if first word is child name
    if (words[0]?.toLowerCase() === childName.toLowerCase()) {
      // Take first 2 words
      title = words.slice(0, 2).join(" ");
      console.log(`[Cover Title] Truncated to: "${title}"`);
    } else {
      // Use default format
      title = `${childName} Sarguzashti`;
      console.log(`[Cover Title] Using default: "${title}"`);
    }
  }

  // Ensure title includes child name
  if (!title.toLowerCase().includes(childName.toLowerCase())) {
    console.log(`[Cover Title] Missing child name in "${title}"`);
    title = `${childName} Sarguzashti`;
    console.log(`[Cover Title] Using default: "${title}"`);
  }

  return title;
}

export interface IllustrationInput {
  sceneDescription: string;
  storyText: string; // Cover: title text rendered by AI; Story pages: used for PDF overlay only
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
}): Promise<any> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${params.model}:generateContent?key=${env.GEMINI_API_KEY}`;

  // Build request body
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
 * Get title style instructions based on story theme/subject
 */
function getTitleStyleInstructions(sceneDescription: string, _storyText: string): string {
  const desc = sceneDescription.toLowerCase();

  // Jungle/Forest themes
  if (desc.includes('jungle') || desc.includes('forest') || desc.includes('tree')) {
    return `- Use GREEN, EARTHY title colors (jungle green, leaf green, brown)
- Font style: Natural, organic, leafy appearance
- Add vine-like decorations or leaf motifs around letters
- Nature-inspired typography that feels wild and adventurous`;
  }

  // Space/Cosmic themes
  if (desc.includes('space') || desc.includes('mars') || desc.includes('planet') || desc.includes('cosmic') || desc.includes('galaxy')) {
    return `- Use COSMIC title colors (deep blue, purple, silver, starlight white)
- Font style: Futuristic, sci-fi lettering
- Add stars, planets, or sparkle effects around text
- Space-inspired typography with a sense of wonder`;
  }

  // Ocean/Water themes
  if (desc.includes('ocean') || desc.includes('sea') || desc.includes('water') || desc.includes('underwater')) {
    return `- Use OCEAN title colors (deep blue, aqua, turquoise, coral)
- Font style: Flowing, wave-like letters
- Add water droplets, bubbles, or wave motifs
- Aquatic-inspired typography that feels fluid`;
  }

  // Desert/Sand themes
  if (desc.includes('desert') || desc.includes('sand') || desc.includes('kyzylkum')) {
    return `- Use DESERT title colors (sandy gold, warm orange, sunset colors)
- Font style: Warm, sun-baked appearance
- Add sand texture or sun motifs
- Desert-inspired typography with warmth`;
  }

  // Ice/Snow/Arctic themes
  if (desc.includes('ice') || desc.includes('snow') || desc.includes('arctic') || desc.includes('north pole') || desc.includes('frozen')) {
    return `- Use ICY title colors (ice blue, white, silver, frost)
- Font style: Crystalline, frozen appearance
- Add snowflakes or ice crystals around letters
- Winter-inspired typography that feels cool and crisp`;
  }

  // Medieval/Castle/Kingdom themes
  if (desc.includes('castle') || desc.includes('kingdom') || desc.includes('medieval') || desc.includes('knight') || desc.includes('middle ages')) {
    return `- Use ROYAL title colors (gold, deep purple, royal blue)
- Font style: Gothic, medieval, ornate lettering
- Add crown or shield decorations
- Fantasy kingdom typography with majestic feel`;
  }

  // Candy/Sweet themes
  if (desc.includes('candy') || desc.includes('sweet') || desc.includes('cake') || desc.includes('dessert')) {
    return `- Use SWEET title colors (pink, pastel rainbow, candy colors)
- Font style: Playful, bubbly, sweet lettering
- Add candy, lollipop, or sprinkle decorations
- Delicious-looking typography that feels fun`;
  }

  // Historical/Ancient themes (Egypt, Rome, Greece)
  if (desc.includes('egypt') || desc.includes('pyramid') || desc.includes('pharaoh') ||
      desc.includes('rome') || desc.includes('greece') || desc.includes('ancient')) {
    return `- Use ANCIENT title colors (gold, sandstone, aged bronze)
- Font style: Classical, hieroglyphic-inspired, or ancient script
- Add historical motifs (columns, hieroglyphs, ancient patterns)
- Historical typography with timeless elegance`;
  }

  // Uzbek cultural themes
  if (desc.includes('samarkand') || desc.includes('bukhara') || desc.includes('khiva') ||
      desc.includes('silk road') || desc.includes('uzbek') || desc.includes('navruz')) {
    return `- Use UZBEK CULTURAL colors (turquoise, gold, rich blue, ornate patterns)
- Font style: Elegant with traditional Uzbek ornamental motifs
- Add Islamic geometric patterns or traditional decorations
- Cultural typography honoring Uzbek heritage`;
  }

  // Magic/Fairy themes
  if (desc.includes('magic') || desc.includes('fairy') || desc.includes('wizard') || desc.includes('enchant')) {
    return `- Use MAGICAL title colors (purple, sparkle gold, mystical pink)
- Font style: Whimsical, enchanted, magical lettering
- Add sparkles, stars, or magic wand effects
- Fairy tale typography with wonder and magic`;
  }

  // Default: Colorful children's book style
  return `- Use VIBRANT, COLORFUL title colors appropriate for the story theme
- Font style: Bold, friendly, child-appropriate lettering
- Make title playful and engaging
- Professional children's book typography`;
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

CHARACTER TO CREATE: ${childName}${genderNote}

★★★ ABSOLUTELY CRITICAL - PHOTO MATCHING RULES ★★★
YOU MUST MATCH THE REFERENCE PHOTO WITH 100% ACCURACY. THIS IS NON-NEGOTIABLE.
SPEND SIGNIFICANT TIME STUDYING THE PHOTO BEFORE GENERATING!

★★★ FACE SHAPE - MOST CRITICAL ★★★
THIS IS THE #1 PRIORITY - FACE SHAPE MUST BE PERFECT!
STEP 1: Look at the photo and identify the EXACT face shape:
- Is it ROUND (cheeks wider, soft curves)?
- Is it OVAL (balanced proportions, gently curved)?
- Is it SQUARE (angular jaw, strong features)?
- Is it HEART-SHAPED (wider forehead, pointed chin)?
- Is it LONG (elongated proportions)?
- Is it TRIANGULAR (wider jaw, narrower forehead)?

STEP 2: Match EVERY facial proportion:
- Face width vs height ratio (measure and match EXACTLY)
- Chin shape: pointed, rounded, square, or soft? (CRITICAL!)
- Jawline: sharp, soft, wide, narrow? (MUST MATCH!)
- Cheekbone position: high, low, prominent, subtle? (EXACT!)
- Forehead size: wide, narrow, high, low? (MATCH EXACTLY!)
- Face symmetry and unique features (COPY PRECISELY!)

STEP 3: Verify face shape match:
- Does the 3D character's face outline match the photo when overlaid?
- Are the proportions IDENTICAL?
- Would parents say "That's my child's face shape!" immediately?
- If NO to any question, START OVER and match more carefully!

★★★ HAIR - ABSOLUTELY CRITICAL ★★★
HAIR IS THE #2 MOST NOTICEABLE FEATURE - MUST BE PERFECT!

STEP 1: Identify EXACT hair color from photo:
- Black, dark brown, medium brown, light brown, blonde, red?
- What EXACT shade? (dark black, soft brown, golden blonde, etc.)
- Any highlights or color variations?
- DO NOT guess - LOOK AT THE PHOTO CAREFULLY!
- DO NOT make hair lighter or darker - EXACT MATCH ONLY!

STEP 2: Identify EXACT hair style and texture:
- STRAIGHT, WAVY, CURLY, or COILY?
- How curly? (loose waves, tight curls, kinky coils?)
- Texture: fine, thick, medium?
- Volume: flat, voluminous, medium?
- COPY THE EXACT TEXTURE from photo!

STEP 3: Match hair LENGTH precisely:
- Shoulder-length, long, short, bob, pixie cut?
- Where does it fall? (ears, shoulders, mid-back, waist?)
- Measure the length in the photo - MATCH IT EXACTLY!

STEP 4: Match hair STYLE:
- How is it parted? (center, side, no part?)
- Does it cover forehead or show forehead?
- How does it frame the face? (behind ears, covering ears, over face?)
- Any bangs/fringe? (straight across, side-swept, none?)
- Any specific style features? (ponytail, braids, etc.)
- HAIRLINE shape: rounded, straight, widow's peak, receding?

STEP 5: Verify hair match:
- Color: EXACT SAME shade as photo?
- Style: EXACT SAME as photo?
- Length: EXACT SAME as photo?
- Texture: EXACT SAME as photo?
- If NO to any question, FIX IT BEFORE GENERATING!

EYES (CRITICAL):
- Match the EXACT eye shape: almond, round, wide-set, close-set
- Match the EXACT eye color visible in photo
- Match the EXACT eyebrow shape and position
- Match the EXACT distance between eyes
- Eyes MUST look exactly like the child's eyes in the photo

NOSE (CRITICAL):
- Match the EXACT nose shape and size from photo
- Match the EXACT nose bridge width
- Match the EXACT nostril shape
- DO NOT use generic nose - match THIS child's specific nose

MOUTH (CRITICAL):
- Match the EXACT lip shape and size from photo
- Match the EXACT mouth width
- Match the EXACT smile style if visible in photo

SKIN TONE (CRITICAL):
- Match the EXACT skin color from the photo
- DO NOT lighten or darken - match it PRECISELY
- Match any visible skin characteristics

OVERALL APPEARANCE:
- The character MUST be INSTANTLY recognizable as this specific child
- Parents MUST immediately say "That's my child!"
- Every facial feature MUST match the photo EXACTLY
- DO NOT create a "generic cute child" - create THIS SPECIFIC CHILD

ART STYLE:
${artStyleInstructions}
- Maintain photo accuracy while applying the art style

CHARACTER POSE:
- Full body character view
- Standing in neutral, friendly pose
- Facing forward, slight smile
- White or very light background

★★★ FINAL REQUIREMENT ★★★
Before generating, ask yourself: "Does this character look EXACTLY like the child in the photo?"
If the answer is not "YES, EXACTLY", start over and match the photo more carefully.
Hair color, face shape, and facial features MUST be IDENTICAL to the reference photo.`;

  console.log(`[Character Reference] Generating character for ${childName}`);

  try {
    // Fetch child photo and convert to base64 (with retry)
    const photoResponse = await fetchWithRetry(childPhotoUrl, "Child photo for character reference");
    const photoBuffer = await photoResponse.arrayBuffer();
    const photoBase64 = Buffer.from(photoBuffer).toString("base64");

    const photoMimeType = childPhotoUrl.toLowerCase().includes('.png')
      ? 'image/png'
      : 'image/jpeg';

    console.log(`[Character Reference] Using photo as reference (${photoMimeType})`);

    // Generate character reference with Gemini (with retry logic + direct API)
    let response;
    let lastError: Error | null = null;
    const MAX_RETRIES = 3;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        console.log(`[Character Reference] Gemini API attempt ${attempt + 1}/${MAX_RETRIES}`);

        // Use direct API call with JSON sanitization
        response = await callGeminiDirectly({
          model: "gemini-2.5-flash-image",
          contents: [
            {
              text: `★★★ REFERENCE PHOTO PROVIDED BELOW ★★★
Study this child's face with EXTREME CARE. You MUST match EVERY detail.

${prompt}

★★★ ABSOLUTE REQUIREMENT ★★★
This character MUST be INSTANTLY recognizable as the child in the photo.
Match the EXACT: face shape, hair color, hair style, eye shape, nose, mouth, skin tone.
DO NOT create a generic character - create THIS SPECIFIC CHILD from the photo.
Parents must look at this and immediately recognize their child.`,
            },
            {
              inlineData: {
                mimeType: photoMimeType,
                data: photoBase64,
              },
            },
          ],
        });

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

        // Wait before retrying (exponential backoff)
        const waitTime = Math.min(1000 * Math.pow(2, attempt), 5000);
        console.log(`[Character Reference] Retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    if (!response) {
      throw new Error(`Failed to get response from Gemini after ${MAX_RETRIES} attempts`);
    }

    // Extract image from response (direct API format)
    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("No candidates in Gemini response");
    }

    const candidate = response.candidates[0];
    if (!candidate?.content?.parts) {
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
 * Cover page: AI generates artistic title text as part of the illustration
 * Story pages: Illustration only (text overlaid in PDF for perfect spelling)
 * Feature 006: Hybrid approach - artistic AI covers + perfect text overlay on story pages
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
  // For cover, ensure title is max 2 words
  const coverTitle = pageType === "cover" ? formatCoverTitle(storyText, childName) : storyText;

  const textInstruction =
    pageType === "cover"
      ? `PROFESSIONAL BOOK COVER LAYOUT:
★ This is the COVER of a professional children's book ★

★★★ TITLE TEXT - CRITICAL RULES ★★★
TITLE: "${coverTitle}"

MANDATORY TITLE REQUIREMENTS:
1. Render EXACTLY these words: "${coverTitle}" - NO changes, NO additions!
2. Title must be ONLY 2 WORDS - do NOT add extra words!
3. CORRECT SPELLING - copy the title EXACTLY as shown above!
4. NO ENGLISH WORDS - title is in Uzbek language!
5. Position at TOP of cover in LARGE, BOLD, READABLE lettering

TITLE STYLING:
${getTitleStyleInstructions(sceneDescription, coverTitle)}
- Make title VERY prominent and easily readable
- Add subtle shadows/outlines to make text pop against background
- Title should be the FIRST thing people notice
- Professional children's book cover typography

⚠️ WARNING: Do NOT write anything other than "${coverTitle}"!
⚠️ Do NOT add subtitles, author names, or extra text!

CHARACTER COMPOSITION:
- Main character positioned prominently in center/lower area
- Character looking happy, excited, and welcoming
- Character should be facing slightly toward viewer
- Full body or 3/4 view of character

BACKGROUND:
- Vibrant, engaging background that hints at the story theme
- Colors should be bright and eye-catching
- Professional published book quality
- Clean, not too cluttered
- Should appeal to children and parents

OVERALL DESIGN:
- This should look like a real published children's book cover
- Professional, polished, high-quality illustration
- Warm, inviting, magical feeling
- Perfect for bookstore display`
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
- FULL BLEED: Image must fill the ENTIRE canvas edge-to-edge
- CLEAN, PROFESSIONAL illustration only`
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
- Top of page: Sky/ceiling continues from left page
- Middle: Main environment extends rightward
- Bottom: Ground/floor continues from left page
- Think: Camera panned RIGHT from character page

ABSOLUTELY NO text, words, letters, or writing - text will be overlaid in PDF`;

  const compositionRule =
    pageType === "cover"
      ? `COVER PAGE COMPOSITION:
- Image dimensions: 2400×3000 pixels (8" × 10" portrait at 300 DPI)
- Single portrait cover page
- Character prominently featured
- Title text at top (rendered by AI)
- Professional book cover design`
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
- NO text or words in illustration`
      : `BACKGROUND PAGE COMPOSITION:
- Image dimensions: 2400×3000 pixels (8" × 10" portrait at 300 DPI)
- Single PORTRAIT page for children's book
- SAME SCENE as character page but empty
- Recreate the SAME environment/setting
- Leave clear space in middle for text overlay
- Think: character walked away, scene remains
- Professional children's book background`;

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
      ? `CRITICAL - USE PREVIOUS PAGE AS REFERENCE FOR CHARACTER:
You have been provided with the PREVIOUS PAGE image showing the EXACT character to use.
- Study the character from the previous page carefully
- Match EVERY detail from the previous page: face, hair, body, proportions, features
- The character MUST look IDENTICAL to how they appeared on the previous page
- Keep consistent: face, hair style, hair color, body type, all features
- Only change: pose, expression, position in the new scene
- Maintain visual continuity - this is the SAME character, just a new scene`
      : characterReferenceUrl
      ? `★★★ CRITICAL - USE CHARACTER REFERENCE IMAGE ★★★
You have been provided with a CHARACTER REFERENCE image showing the EXACT character to use.
STUDY THE REFERENCE IMAGE VERY CAREFULLY BEFORE GENERATING!

ABSOLUTE MATCHING REQUIREMENTS:
- This is the MASTER CHARACTER REFERENCE - use this character EXACTLY as shown
- Match EVERY SINGLE detail from the reference: face, hair, body, proportions, features
- DO NOT modify, change, interpret, or "improve" the character in ANY way
- The character MUST look 100% IDENTICAL in this scene

★★★ FACE SHAPE MATCHING - CRITICAL ★★★
STUDY the reference's face shape:
- What is the face shape? (round, oval, square, heart, long, triangular)
- What is the chin shape? (pointed, rounded, square, soft)
- What is the jawline? (sharp, soft, wide, narrow)
- What are the cheekbones like? (high, low, prominent, subtle)
- MATCH EVERY PROPORTION EXACTLY in your generation!

★★★ HAIR MATCHING - CRITICAL ★★★
STUDY the reference's hair carefully:
- EXACT hair color: What shade? (Don't guess - LOOK!)
- EXACT hair texture: Straight, wavy, curly, coily?
- EXACT hair length: Where does it fall?
- EXACT hair style: How is it parted? Any bangs? How does it frame face?
- EXACT hair volume: Thick, thin, medium?
- COPY EVERY HAIR DETAIL EXACTLY!

WHAT MUST STAY EXACTLY THE SAME:
- Face shape and proportions (EXACTLY as in reference - measure it!)
- Chin and jawline (EXACTLY as in reference)
- Hair color, style, length, texture (EXACTLY as in reference - don't change ANYTHING!)
- Eye shape, color, and placement (EXACTLY as in reference)
- Nose shape and size (EXACTLY as in reference)
- Mouth and lip shape (EXACTLY as in reference)
- Skin tone (EXACTLY as in reference)
- Body proportions and build (EXACTLY as in reference)
- Overall appearance (MUST be instantly recognizable)

WHAT CAN CHANGE:
- Pose and body position (to fit the scene)
- Facial expression (to show emotion)
- Clothing (only if scene requires different outfit)
- Position in scene

★★★ VERIFICATION CHECKLIST ★★★
Before generating, verify:
□ Face shape IDENTICAL to reference?
□ Chin and jawline IDENTICAL to reference?
□ Hair color IDENTICAL to reference (exact shade)?
□ Hair style IDENTICAL to reference?
□ Hair length IDENTICAL to reference?
□ Hair texture IDENTICAL to reference?
□ All facial features IDENTICAL to reference?
□ Character instantly recognizable?

If answer is NO to ANY question, STUDY REFERENCE AGAIN and match more carefully!
This character MUST be 100% IDENTICAL to the reference image.`
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

★★★ HAIR - #2 PRIORITY ★★★
STEP 1: Identify EXACT hair details from photo:
- EXACT color: black, dark brown, medium brown, light brown, blonde, red?
- EXACT shade (don't guess - LOOK at the photo!)
- EXACT texture: straight, wavy, curly, coily?
- EXACT length: where does it fall? (ears, shoulders, back, waist?)
- EXACT style: parted? bangs? how does it frame the face?
- EXACT volume: thick, thin, medium?
- EXACT hairline shape

STEP 2: Match hair EXACTLY:
- Color: EXACT SAME shade (DO NOT lighten or darken!)
- Texture: EXACT SAME (straight stays straight, curly stays curly!)
- Length: EXACT SAME (measure it!)
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

IMPORTANT: Portrait page format (4:5 aspect ratio, 2400×3000px). ${pageType === "cover" ? "Single portrait cover page" : "Single portrait page"}`;

  console.log(`[Illustration Generator] Generating ${pageType} with Gemini 2.5 Flash Image`);
  console.log(`[Illustration Generator] Prompt: ${enhancedPrompt.substring(0, 200)}...`);

  try {
    // Fetch child photo for reference (with retry)
    const photoResponse = await fetchWithRetry(input.childPhotoUrl, "Child photo for illustration");
    const photoBuffer = await photoResponse.arrayBuffer();
    const photoBase64 = Buffer.from(photoBuffer).toString("base64");
    const photoMimeType = input.childPhotoUrl.toLowerCase().includes('.png')
      ? 'image/png'
      : 'image/jpeg';

    console.log(`[Illustration Generator] Using child photo as reference (${photoMimeType})`);

    // Prepare contents for Gemini
    const contents: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];

    // Build the prompt text based on what references we have
    let promptText: string;

    if (previousPageUrl && pageType === "story-background") {
      // BACKGROUND PAGE: Create panoramic continuation
      const hasCharRef = !!characterReferenceUrl;
      promptText = `★★★ CRITICAL: CREATE THE RIGHT-SIDE CONTINUATION OF THE PANORAMA ★★★

${hasCharRef ? `IMAGE 1: Character reference (for style reference only - DO NOT include character)
IMAGE 2: Shows the LEFT HALF of the panoramic scene (with character) - THIS IS YOUR MAIN REFERENCE
IMAGE 3: Child photo (for reference only - DO NOT include in output)` : `IMAGE 1: Shows the LEFT HALF of a wide panoramic scene (with character)
IMAGE 2: Child photo reference (DO NOT include character in your output)`}

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
    } else if (previousPageUrl && characterReferenceUrl) {
      // CHARACTER PAGE with both references: Use character reference as MASTER, previous page for scene style
      promptText = `★★★ THREE REFERENCE IMAGES PROVIDED ★★★

IMAGE 1 (MASTER CHARACTER REFERENCE): The FIRST image is the CHARACTER REFERENCE - this is the EXACT character you MUST recreate.
IMAGE 2 (SCENE REFERENCE): The second image shows the previous page for art style/scene continuity.
IMAGE 3 (ORIGINAL PHOTO): The third image is the original child photo for verification.

★★★ ABSOLUTE RULE: COPY CHARACTER FROM IMAGE 1 EXACTLY ★★★
- IMAGE 1 is the MASTER - copy this character with 100% accuracy
- DO NOT modify, change, or "interpret" the character in any way
- SAME face shape, SAME hair (color, style, length), SAME features
- The character in YOUR output must be INDISTINGUISHABLE from IMAGE 1

${enhancedPrompt}

CRITICAL REQUIREMENTS:
- Output dimensions: 2400×3000 pixels (8" × 10" portrait at 300 DPI)
- CHARACTER: Copy EXACTLY from IMAGE 1 (master reference)
- STYLE: Match art style from IMAGE 2 (previous page)
- 3D CGI CARTOON style (Pixar/Disney quality)
- Only change: pose, expression, position for this new scene
- Leave clear space in middle/center for text overlay
- Simple, clean, professional illustrations

★★★ DO NOT CHANGE THESE FEATURES ★★★
- Face shape and proportions - COPY FROM IMAGE 1
- Hair color - EXACT SAME as IMAGE 1
- Hair style/length - EXACT SAME as IMAGE 1
- Eye shape/color - EXACT SAME as IMAGE 1
- Skin tone - EXACT SAME as IMAGE 1
- Body proportions - EXACT SAME as IMAGE 1

WHAT TO AVOID:
- Changing ANY character features from IMAGE 1
- Different art styles - ONLY 3D CGI
- Random animals or objects not in scene
- Text or words in the illustration`;
    } else if (previousPageUrl) {
      // CHARACTER PAGE: Only previous page available (no character reference)
      promptText = `PREVIOUS PAGE REFERENCE: The first image shows the character from the previous page.
CHILD PHOTO: The second image is the original photo for additional reference.

${enhancedPrompt}

CRITICAL REQUIREMENTS:
- Output dimensions: 2400×3000 pixels (8" × 10" portrait at 300 DPI)
- This is a SINGLE PORTRAIT PAGE for a children's book
- 3D CGI CARTOON style (Pixar/Disney quality) - SAME style as previous page
- Use the PREVIOUS PAGE as reference - character must look IDENTICAL
- Character must look the SAME as on the previous page (same face, hair, features, proportions)
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
- Text or words in the illustration`;
    } else if (characterReferenceUrl) {
      promptText = `★★★ TWO REFERENCE IMAGES PROVIDED ★★★

IMAGE 1 (MASTER CHARACTER REFERENCE): This is the EXACT character you MUST recreate - copy with 100% accuracy.
IMAGE 2 (ORIGINAL PHOTO): The original child photo for verification.

★★★ ABSOLUTE RULE: COPY CHARACTER FROM IMAGE 1 EXACTLY ★★★
The character in IMAGE 1 is the MASTER REFERENCE.
You MUST recreate this EXACT character - no modifications allowed.

${enhancedPrompt}

CRITICAL REQUIREMENTS:
- Output dimensions: 2400×3000 pixels (8" × 10" portrait at 300 DPI)
- CHARACTER: Copy EXACTLY from IMAGE 1 (master reference)
- 3D CGI CARTOON style (Pixar/Disney quality) on EVERY page
- Leave clear space in middle/center for text overlay
- Simple, clean, professional illustrations

★★★ COPY THESE EXACTLY FROM IMAGE 1 - NO CHANGES ★★★
- Face shape: IDENTICAL to IMAGE 1
- Hair color: EXACT SAME shade as IMAGE 1
- Hair style: EXACT SAME as IMAGE 1
- Hair length: EXACT SAME as IMAGE 1
- Eye shape/color: IDENTICAL to IMAGE 1
- Nose shape: IDENTICAL to IMAGE 1
- Skin tone: IDENTICAL to IMAGE 1
- Body proportions: IDENTICAL to IMAGE 1

WHAT TO AVOID:
- Changing ANY character features from IMAGE 1
- Making hair lighter, darker, or different style
- Changing face shape or proportions
- Different art styles - ONLY 3D CGI
- Random animals or objects not in scene
- Text or words in the illustration`;
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
- Text or words in the illustration`;
    }

    contents.push({ text: promptText });

    // ALWAYS include character reference first (master reference for consistency)
    // This prevents "drift" where character changes across pages
    if (characterReferenceUrl) {
      console.log(`[Illustration Generator] Using CHARACTER REFERENCE (master): ${characterReferenceUrl}`);
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

    // ALSO include previous page for scene/style continuity (but NOT as primary character reference)
    if (previousPageUrl) {
      console.log(`[Illustration Generator] Also using previous page for scene continuity: ${previousPageUrl}`);
      const prevPageResponse = await fetchWithRetry(previousPageUrl, "Previous page");
      const prevPageBuffer = await prevPageResponse.arrayBuffer();
      const prevPageBase64 = Buffer.from(prevPageBuffer).toString("base64");
      const prevPageMimeType = previousPageUrl.toLowerCase().includes('.png')
        ? 'image/png'
        : 'image/jpeg';

      contents.push({
        inlineData: {
          mimeType: prevPageMimeType,
          data: prevPageBase64,
        },
      });
    }

    // Add child photo
    contents.push({
      inlineData: {
        mimeType: photoMimeType,
        data: photoBase64,
      },
    });

    // Generate with Gemini (with retry logic + direct API)
    let response;
    let lastError: Error | null = null;
    const MAX_RETRIES = 3;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        console.log(`[Illustration Generator] Gemini API attempt ${attempt + 1}/${MAX_RETRIES}`);

        // Use direct API call with JSON sanitization
        response = await callGeminiDirectly({
          model: "gemini-2.5-flash-image",
          contents: contents,
        });

        // Success - break out of retry loop
        console.log(`[Illustration Generator] Gemini API call successful`);
        break;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(`[Illustration Generator] Gemini API attempt ${attempt + 1} failed:`, lastError.message);

        // Log full error for debugging
        if (lastError.message.includes('parse') || lastError.message.includes('JSON') || lastError.message.includes('control character')) {
          console.error(`[Illustration Generator] JSON/parsing error details:`, {
            message: lastError.message,
            stack: lastError.stack,
          });
        }

        // If this is the last attempt, throw the error
        if (attempt === MAX_RETRIES - 1) {
          throw new Error(`Gemini API failed after ${MAX_RETRIES} attempts: ${lastError.message}`);
        }

        // Wait before retrying (exponential backoff)
        const waitTime = Math.min(1000 * Math.pow(2, attempt), 5000);
        console.log(`[Illustration Generator] Retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    if (!response) {
      throw new Error(`Failed to get response from Gemini after ${MAX_RETRIES} attempts`);
    }

    // Extract image from response (direct API format)
    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("No candidates in Gemini response");
    }

    const candidate = response.candidates[0];
    if (!candidate?.content?.parts) {
      throw new Error("No candidate data in Gemini response");
    }

    let imageBuffer: Buffer | null = null;

    // Direct API uses snake_case: inline_data instead of inlineData
    for (const part of candidate.content.parts) {
      const inlineData = part.inline_data || part.inlineData;
      if (inlineData?.data) {
        imageBuffer = Buffer.from(inlineData.data, "base64");
        console.log(`[Illustration Generator] Image generated successfully (${imageBuffer.length} bytes)`);
        break;
      }
    }

    if (!imageBuffer) {
      throw new Error("No image data in Gemini response");
    }

    // Resize image to exact dimensions (2400x3000)
    console.log(`[Illustration Generator] Resizing to ${IMAGE_WIDTH}x${IMAGE_HEIGHT}...`);
    const resizedImageBuffer = await sharp(imageBuffer)
      .resize(IMAGE_WIDTH, IMAGE_HEIGHT, {
        fit: "cover",
        position: "center",
      })
      .jpeg({ quality: 95 })
      .toBuffer();

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
