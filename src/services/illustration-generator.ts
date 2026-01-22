import sharp from "sharp";
import { env } from "../lib/env.js";
import { uploadPageImage, uploadBackgroundImage } from "../lib/r2-upload.js";

// Portrait page dimensions for children's book
// Single page = 8" wide × 10" tall at 300 DPI for print quality
const IMAGE_WIDTH = 2400;  // 8 inches × 300 DPI
const IMAGE_HEIGHT = 3000; // 10 inches × 300 DPI

export interface IllustrationInput {
  sceneDescription: string;
  storyText: string;
  childPhotoUrl: string;
  childName: string;
  childGender?: string | null;
  characterReferenceUrl?: string;
  previousPageUrl?: string;
  style?: string;
  pageType?: "cover" | "story-character" | "story-background";
  seed?: number;
}

export interface IllustrationResult {
  imageUrl: string;
  status: "succeeded" | "failed";
}

export interface CharacterReferenceInput {
  childPhotoUrl: string;
  childName: string;
  childGender?: string | null;
}

/**
 * Clean JSON string by removing/escaping control characters
 */
function cleanJsonString(str: string): string {
  return str.replace(/[\x00-\x1F\x7F]/g, (char) => {
    const escapeMap: Record<string, string> = {
      '\n': '\\n',
      '\r': '\\r',
      '\t': '\\t',
      '\b': '\\b',
      '\f': '\\f',
    };
    return escapeMap[char] ?? '';
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
 */
async function callGeminiDirectly(params: {
  model: string;
  contents: Array<{
    text?: string;
    inlineData?: { mimeType: string; data: string };
  }>;
}): Promise<any> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${params.model}:generateContent?key=${env.GEMINI_API_KEY}`;

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

  const rawText = await response.text();

  try {
    return JSON.parse(rawText);
  } catch (firstError) {
    console.error('[Gemini Direct] First parse attempt failed:', firstError);
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
function getTitleStyleInstructions(sceneDescription: string, storyText: string): string {
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

  // Historical/Ancient themes
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

  const styles: Record<string, string> = {
    ANIMATION_3D: `3D CGI CARTOON style (Pixar/Disney quality)
- Professional 3D rendered children's book character
- High-quality CGI animation style like Toy Story, Finding Nemo
- Warm, pleasant colors with good contrast
- Clean, polished 3D rendering with realistic lighting
- Expressive characters with detailed textures`,
    WATERCOLOR: `SOFT WATERCOLOR illustration style
- Gentle, flowing watercolor painting technique
- Soft edges and artistic brushstrokes
- Delicate colors with transparency effects
- Traditional watercolor paper texture
- Dreamy, artistic children's book aesthetic`,
    PICTURE_BOOK: `CLASSIC PICTURE BOOK illustration style
- Traditional children's book illustration
- Hand-drawn aesthetic with professional quality
- Rich colors and clear linework
- Timeless storybook feel
- Similar to classic published children's books`,
    GOUACHE: `GOUACHE PAINTING style
- Thick, opaque paint texture
- Rich, vibrant colors with matte finish
- Bold brushstrokes and artistic layering
- Traditional children's book illustration technique
- Professional gouache painting aesthetic`,
    KAWAII: `KAWAII CUTE style
- Adorable, chibi-style characters
- Large eyes and small features
- Pastel colors and soft palette
- Super cute and charming aesthetic
- Japanese kawaii illustration style`,
    COMIC_BOOK: `COMIC BOOK illustration style
- Bold, clean linework with dynamic composition
- Vibrant colors and strong contrast
- Action-focused illustrations
- Comic book panel aesthetic
- Professional comic art style`,
    SOFT_ANIME: `SOFT ANIME/MANGA style
- Anime-inspired illustration with gentle aesthetics
- Large expressive eyes and clean features
- Soft shading and delicate linework
- Pastel or vibrant colors depending on mood
- Professional manga/anime art style`,
    CLAY_ANIMATION: `CLAY ANIMATION style
- Plasticine/clay texture and appearance
- Stop-motion animation aesthetic
- Handcrafted, tactile look
- Similar to Wallace & Gromit or Shaun the Sheep
- Charming claymation character design`,
    GEOMETRIC: `GEOMETRIC ART style
- Simple geometric shapes and forms
- Modern, minimalist aesthetic
- Clean lines and bold colors
- Abstract, stylized character design
- Contemporary children's book illustration`,
    BLOCK_WORLD: `BLOCK WORLD style (like Minecraft)
- Cubic, pixelated block aesthetic
- Voxel-based character and environment design
- Blocky, low-poly geometric style
- Minecraft-inspired illustration
- Playful blocky construction look`,
    COLLAGE: `PAPER COLLAGE style
- Cut paper texture and layered artwork
- Mixed media collage aesthetic
- Visible paper edges and textures
- Artistic, handcrafted appearance
- Eric Carle-inspired children's book style`,
    STICKER_ART: `STICKER ART style
- Flat, bold colors with clean outlines
- Sticker-like appearance with slight borders
- Playful, modern illustration style
- Crisp edges and simple shapes
- Fun, contemporary children's aesthetic`,
  };

  return styles[illustrationStyle] || styles.ANIMATION_3D!;
}

/**
 * Generate character reference image from child photo
 */
export async function generateCharacterReference(
  input: CharacterReferenceInput,
  bookId: string,
): Promise<IllustrationResult> {
  const { childPhotoUrl, childName, childGender } = input;
  const genderNote = childGender
    ? ` (${childGender === "boy" ? "boy" : childGender === "girl" ? "girl" : "child"})`
    : "";

  const prompt = `Create a professional 3D CGI character reference for a children's book.

CHARACTER TO CREATE: ${childName}${genderNote}

★★★ ABSOLUTELY CRITICAL - PHOTO MATCHING RULES ★★★
YOU MUST MATCH THE REFERENCE PHOTO WITH 100% ACCURACY. THIS IS NON-NEGOTIABLE.

★★★ FACE SHAPE - MOST CRITICAL ★★★
STEP 1: Look at the photo and identify the EXACT face shape:
- Is it ROUND, OVAL, SQUARE, HEART-SHAPED, LONG, or TRIANGULAR?

STEP 2: Match EVERY facial proportion:
- Face width vs height ratio (EXACTLY)
- Chin shape: pointed, rounded, square, or soft? (CRITICAL!)
- Jawline: sharp, soft, wide, narrow? (MUST MATCH!)
- Cheekbone position: high, low, prominent, subtle?
- Forehead size: wide, narrow, high, low?

★★★ HAIR - ABSOLUTELY CRITICAL ★★★
STEP 1: Identify EXACT hair color from photo:
- Black, dark brown, medium brown, light brown, blonde, red?
- DO NOT guess - LOOK AT THE PHOTO CAREFULLY!

STEP 2: Identify EXACT hair style and texture:
- STRAIGHT, WAVY, CURLY, or COILY?
- Texture: fine, thick, medium?

STEP 3: Match hair LENGTH precisely:
- Where does it fall? (ears, shoulders, mid-back, waist?)

STEP 4: Match hair STYLE:
- How is it parted? Any bangs? How does it frame face?

EYES, NOSE, MOUTH, SKIN TONE:
- Match EXACTLY from photo
- DO NOT use generic features - match THIS child's specific features

ART STYLE:
- 3D CGI cartoon style (Pixar/Disney quality)
- Professional children's book character
- Full body character view, standing in neutral pose
- White or very light background

★★★ FINAL REQUIREMENT ★★★
The character MUST be INSTANTLY recognizable as the child in the photo.
Parents MUST immediately say "That's my child!"`;

  console.log(`[Character Reference] Generating character for ${childName}`);

  try {
    const photoResponse = await fetch(childPhotoUrl);
    const photoBuffer = await photoResponse.arrayBuffer();
    const photoBase64 = Buffer.from(photoBuffer).toString("base64");
    const photoMimeType = childPhotoUrl.toLowerCase().includes('.png') ? 'image/png' : 'image/jpeg';

    let response;
    let lastError: Error | null = null;
    const MAX_RETRIES = 3;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        console.log(`[Character Reference] Gemini API attempt ${attempt + 1}/${MAX_RETRIES}`);

        response = await callGeminiDirectly({
          model: "gemini-2.5-flash-image",
          contents: [
            {
              text: `★★★ REFERENCE PHOTO PROVIDED BELOW ★★★
Study this child's face with EXTREME CARE. You MUST match EVERY detail.

${prompt}

★★★ ABSOLUTE REQUIREMENT ★★★
This character MUST be INSTANTLY recognizable as the child in the photo.
Match the EXACT: face shape, hair color, hair style, eye shape, nose, mouth, skin tone.`
            },
            {
              inlineData: {
                mimeType: photoMimeType,
                data: photoBase64,
              },
            },
          ],
        });
        break;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(`[Character Reference] Attempt ${attempt + 1} failed:`, lastError.message);

        if (attempt === MAX_RETRIES - 1) {
          throw new Error(`Gemini API failed after ${MAX_RETRIES} attempts: ${lastError.message}`);
        }

        const waitTime = Math.min(1000 * Math.pow(2, attempt), 5000);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    if (!response?.candidates?.[0]?.content?.parts) {
      throw new Error("No valid response from Gemini");
    }

    let imageBuffer: Buffer | null = null;
    for (const part of response.candidates[0].content.parts) {
      const inlineData = part.inline_data || part.inlineData;
      if (inlineData?.data) {
        imageBuffer = Buffer.from(inlineData.data, "base64");
        break;
      }
    }

    if (!imageBuffer) {
      throw new Error("No image data in Gemini response");
    }

    // Resize to exact dimensions
    const resizedImageBuffer = await sharp(imageBuffer)
      .resize(IMAGE_WIDTH, IMAGE_HEIGHT, {
        fit: "contain",
        position: "center",
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .jpeg({ quality: 95 })
      .toBuffer();

    const { url: r2Url } = await uploadPageImage(resizedImageBuffer, bookId, -1, "image/jpeg");

    console.log(`[Character Reference] Created: ${r2Url}`);

    return {
      imageUrl: r2Url,
      status: "succeeded",
    };
  } catch (error) {
    console.error("[Character Reference] Error:", error);
    throw error;
  }
}

/**
 * Generate illustration using Gemini
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

  const genderNote = childGender ? ` (${childGender === "boy" ? "boy" : "girl"})` : "";

  // Build text instruction based on page type
  let textInstruction: string;

  if (pageType === "cover") {
    textInstruction = `PROFESSIONAL BOOK COVER LAYOUT:
★ This is the COVER of a professional children's book ★

TITLE TEXT (MOST IMPORTANT):
- TITLE: "${storyText}"
- Render title text at the TOP in LARGE, BOLD lettering
- Title styling that matches the story theme:
${getTitleStyleInstructions(sceneDescription, storyText)}
- Make title VERY prominent and easily readable

CHARACTER COMPOSITION:
- Main character positioned prominently in center/lower area
- Character looking happy, excited, and welcoming
- Full body or 3/4 view of character

BACKGROUND:
- Vibrant, engaging background that hints at the story theme
- Professional published book quality`;
  } else if (pageType === "story-background") {
    textInstruction = `BACKGROUND/ENVIRONMENT PAGE LAYOUT (RIGHT SIDE OF OPEN BOOK):
★★★ CRITICAL - SPATIAL CONTINUATION TO THE RIGHT ★★★

WHAT YOU'RE CREATING:
- Imagine standing in the scene and looking to the RIGHT →
- Left page (character page): What you see looking STRAIGHT ahead
- Right page (THIS PAGE): What you see when you turn your head RIGHT →
- When book is open: ONE WIDE PANORAMIC VIEW spanning both pages

CRITICAL RULES:
1. SAME EXACT environment - just the RIGHT-SIDE VIEW
2. SAME sky, horizon line, ground level (must align horizontally)
3. SAME lighting, colors, weather, time of day
4. NO character, NO people - just the environment extending rightward →
5. LARGE CLEAR SPACE in center for text overlay
6. ABSOLUTELY NO text, words, letters, or writing`;
  } else {
    textInstruction = `CHARACTER PAGE LAYOUT:
★★★ CLOSE-UP CHARACTER FOCUS ★★★
- Character should be LARGE and RECOGNIZABLE in the frame
- CLOSE framing - character should fill 60-70% of the image
- Character's FACE should be clearly visible and expressive
- Character actively participating in the scene
- ABSOLUTELY NO text, words, letters, or writing
- Background visible but character is the MAIN focus`;
  }

  // Build character instructions based on available references
  let characterInstructions: string;

  if (pageType === "story-background" && previousPageUrl) {
    characterInstructions = `★★★ CRITICAL - PANORAMIC CONTINUATION (DO NOT COPY CHARACTER) ★★★

You have been provided with the CHARACTER PAGE image (LEFT side of open book).
YOUR TASK: Create the RIGHT side that CONTINUES this scene panoramically.

STEP-BY-STEP:
1. Study the CHARACTER PAGE: What environment? What lighting? What colors?
2. Create CONTINUATION: Show MORE of that EXACT SAME environment extending to the right
3. REMOVE the character: Show ONLY scenery/background, NO people
4. Leave space for text: Clear center area

NOT ALLOWED:
❌ DO NOT duplicate/copy Image 1
❌ DO NOT just "remove the character" from Image 1
❌ DO NOT create a different/new scene
❌ DO NOT add the character anywhere

WHAT TO DO:
✅ Show what's PHYSICALLY TO THE RIGHT → of the character page's scene
✅ SAME environment extending rightward
✅ Horizon/sky/ground MUST align perfectly
✅ NO characters, NO people - just scenery`;
  } else if (previousPageUrl) {
    characterInstructions = `CRITICAL - USE PREVIOUS PAGE AS REFERENCE FOR CHARACTER:
You have been provided with the PREVIOUS PAGE image showing the EXACT character to use.
- Study the character from the previous page carefully
- Match EVERY detail: face, hair, body, proportions, features
- The character MUST look IDENTICAL to how they appeared on the previous page
- Only change: pose, expression, position in the new scene`;
  } else if (characterReferenceUrl) {
    characterInstructions = `★★★ CRITICAL - USE CHARACTER REFERENCE IMAGE ★★★
You have been provided with a CHARACTER REFERENCE image showing the EXACT character to use.

ABSOLUTE MATCHING REQUIREMENTS:
- This is the MASTER CHARACTER REFERENCE - use this character EXACTLY as shown
- Match EVERY SINGLE detail from the reference: face, hair, body, proportions
- DO NOT modify, change, interpret, or "improve" the character in ANY way
- The character MUST look 100% IDENTICAL in this scene

★★★ FACE SHAPE MATCHING - CRITICAL ★★★
STUDY the reference's face shape and match EXACTLY

★★★ HAIR MATCHING - CRITICAL ★★★
- EXACT hair color (Don't guess - LOOK!)
- EXACT hair texture (Straight, wavy, curly, coily?)
- EXACT hair length and style
- COPY EVERY HAIR DETAIL EXACTLY!`;
  } else {
    characterInstructions = `★★★ CRITICAL - CHARACTER PHOTO MATCHING ★★★
Main character: ${childName}${genderNote}

YOU MUST MATCH THE REFERENCE PHOTO WITH 100% ACCURACY.

★★★ FACE SHAPE - #1 PRIORITY ★★★
Match face shape, chin, jawline, cheekbones EXACTLY from photo

★★★ HAIR - #2 PRIORITY ★★★
Match EXACT color, texture, length, style from photo

FACIAL FEATURES: Match eyes, nose, mouth, skin tone EXACTLY from photo`;
  }

  const enhancedPrompt = `Professional children's book ${pageType === "cover" ? "cover" : "page"} illustration. ${sceneDescription}

${characterInstructions}

PROFESSIONAL BOOK QUALITY - KEEP IT SIMPLE:
- Focus ONLY on the main character and essential scene elements
- NO random animals unless they are part of the story scene
- Clean, simple, uncluttered composition
- Professional like real published children's books

ART STYLE - MUST BE CONSISTENT ON EVERY PAGE:
${getArtStyleInstructions(style)}

${textInstruction}

IMPORTANT: Portrait page format (4:5 aspect ratio, 2400×3000px).`;

  console.log(`[Illustration] Generating ${pageType} for page ${pageNumber}`);

  try {
    const contents: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];
    contents.push({ text: enhancedPrompt });

    // Add reference images
    if (previousPageUrl) {
      console.log(`[Illustration] Using previous page as reference`);
      const prevResponse = await fetch(previousPageUrl);
      const prevBuffer = await prevResponse.arrayBuffer();
      contents.push({
        inlineData: {
          mimeType: previousPageUrl.toLowerCase().includes('.png') ? 'image/png' : 'image/jpeg',
          data: Buffer.from(prevBuffer).toString("base64"),
        },
      });
    } else if (characterReferenceUrl) {
      console.log(`[Illustration] Using character reference`);
      const charResponse = await fetch(characterReferenceUrl);
      const charBuffer = await charResponse.arrayBuffer();
      contents.push({
        inlineData: {
          mimeType: characterReferenceUrl.toLowerCase().includes('.png') ? 'image/png' : 'image/jpeg',
          data: Buffer.from(charBuffer).toString("base64"),
        },
      });
    }

    // Add child photo
    const photoResponse = await fetch(input.childPhotoUrl);
    const photoBuffer = await photoResponse.arrayBuffer();
    contents.push({
      inlineData: {
        mimeType: input.childPhotoUrl.toLowerCase().includes('.png') ? 'image/png' : 'image/jpeg',
        data: Buffer.from(photoBuffer).toString("base64"),
      },
    });

    let response;
    const MAX_RETRIES = 3;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        console.log(`[Illustration] Gemini API attempt ${attempt + 1}/${MAX_RETRIES}`);

        response = await callGeminiDirectly({
          model: "gemini-2.5-flash-image",
          contents: contents,
        });
        break;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error(`[Illustration] Attempt ${attempt + 1} failed:`, err.message);

        if (attempt === MAX_RETRIES - 1) {
          throw new Error(`Gemini API failed after ${MAX_RETRIES} attempts: ${err.message}`);
        }

        const waitTime = Math.min(1000 * Math.pow(2, attempt), 5000);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    if (!response?.candidates?.[0]?.content?.parts) {
      throw new Error("No valid response from Gemini");
    }

    let imageBuffer: Buffer | null = null;
    for (const part of response.candidates[0].content.parts) {
      const inlineData = part.inline_data || part.inlineData;
      if (inlineData?.data) {
        imageBuffer = Buffer.from(inlineData.data, "base64");
        break;
      }
    }

    if (!imageBuffer) {
      throw new Error("No image data in Gemini response");
    }

    // Resize to exact dimensions
    const resizedImageBuffer = await sharp(imageBuffer)
      .resize(IMAGE_WIDTH, IMAGE_HEIGHT, {
        fit: "cover",
        position: "center",
      })
      .jpeg({ quality: 95 })
      .toBuffer();

    // Upload to R2
    const uploadFn = pageType === "story-background" ? uploadBackgroundImage : uploadPageImage;
    const { url: r2Url } = await uploadFn(resizedImageBuffer, bookId, pageNumber, "image/jpeg");

    console.log(`[Illustration] Page ${pageNumber} created: ${r2Url}`);

    return {
      imageUrl: r2Url,
      status: "succeeded",
    };
  } catch (error) {
    console.error("[Illustration] Error:", error);
    throw error;
  }
}
