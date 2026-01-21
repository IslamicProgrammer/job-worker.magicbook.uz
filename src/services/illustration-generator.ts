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

  const styles: Record<string, string> = {
    ANIMATION_3D: `3D CGI CARTOON style (Pixar/Disney quality)
- Professional 3D rendered children's book character
- High-quality CGI animation style like Toy Story, Finding Nemo
- Warm, pleasant colors with good contrast
- Clean, polished 3D rendering with realistic lighting`,
    WATERCOLOR: `SOFT WATERCOLOR illustration style
- Gentle, flowing watercolor painting technique
- Soft edges and artistic brushstrokes
- Delicate colors with transparency effects`,
    PICTURE_BOOK: `CLASSIC PICTURE BOOK illustration style
- Traditional children's book illustration
- Hand-drawn aesthetic with professional quality
- Rich colors and clear linework`,
    KAWAII: `KAWAII CUTE style
- Adorable, chibi-style characters
- Large eyes and small features
- Pastel colors and soft palette`,
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

CRITICAL REQUIREMENTS:
- Match the reference photo with 100% accuracy
- Face shape, hair color, hair style must be EXACTLY like the photo
- 3D CGI cartoon style (Pixar/Disney quality)
- Full body character view, standing in neutral pose
- White or very light background

The character MUST be INSTANTLY recognizable as the child in the photo.`;

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
          model: "gemini-2.0-flash-exp-image-generation",
          contents: [
            { text: prompt },
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

  // Build prompt based on page type
  let promptText: string;

  if (pageType === "cover") {
    promptText = `Create a professional children's book COVER illustration.

SCENE: ${sceneDescription}
TITLE: "${storyText}"
CHARACTER: ${childName}${genderNote}

REQUIREMENTS:
- Professional book cover design
- Title text at TOP in large, bold, colorful lettering
- Character prominently featured in center/lower area
- Vibrant, engaging background matching the story theme
- 3D CGI cartoon style (Pixar/Disney quality)
- Dimensions: 2400×3000 pixels (portrait)`;
  } else if (pageType === "story-background") {
    promptText = `Create a BACKGROUND PAGE for a children's book (no character).

SCENE: ${sceneDescription}

REQUIREMENTS:
- Same environment as the character page but WITHOUT any character
- Leave clear space in center for text overlay
- Continuation of the scene, showing more of the environment
- ABSOLUTELY NO text, words, or characters
- 3D CGI style matching the character pages
- Dimensions: 2400×3000 pixels (portrait)`;
  } else {
    promptText = `Create a CHARACTER PAGE illustration for a children's book.

SCENE: ${sceneDescription}
CHARACTER: ${childName}${genderNote}

REQUIREMENTS:
- Character should fill 60-70% of the frame (close-up)
- Character's face clearly visible and expressive
- Character actively participating in the scene
- ABSOLUTELY NO text or words in the illustration
- ${getArtStyleInstructions(style)}
- Dimensions: 2400×3000 pixels (portrait)`;
  }

  console.log(`[Illustration] Generating ${pageType} for page ${pageNumber}`);

  try {
    const contents: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];
    contents.push({ text: promptText });

    // Add reference images
    if (previousPageUrl) {
      const prevResponse = await fetch(previousPageUrl);
      const prevBuffer = await prevResponse.arrayBuffer();
      contents.push({
        inlineData: {
          mimeType: previousPageUrl.toLowerCase().includes('.png') ? 'image/png' : 'image/jpeg',
          data: Buffer.from(prevBuffer).toString("base64"),
        },
      });
    } else if (characterReferenceUrl) {
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
          model: "gemini-2.0-flash-exp-image-generation",
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
