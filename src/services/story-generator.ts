/**
 * Story Generator for Job Worker
 * Generates personalized stories using Gemini AI
 */

import { env } from "../lib/env.js";

export interface StoryPage {
  pageNumber: number;
  text: string;
  sceneDescription: string;
}

export interface GeneratedStory {
  title: string;
  pages: StoryPage[];
}

export interface StoryGenerationInput {
  childName: string;
  childAge?: number | null;
  childGender?: string | null;
  genreName: string;
  genreDescription: string;
  ageCategory?: string | null;
  theme?: string | null;
  subject?: string | null;
  illustrationStyle?: string | null;
}

/**
 * Call Gemini API directly
 */
async function callGemini(prompt: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${env.GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 15000,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("No text found in Gemini response");
  }

  return text;
}

/**
 * Get art style description
 */
function getArtStyleDescription(style: string): string {
  const styles: Record<string, string> = {
    ANIMATION_3D: "Disney/Pixar 3D cartoon style, vibrant colors",
    FANTASY_STORYBOOK: "Hand-drawn fantasy storybook illustration style",
    SEMI_REALISTIC: "Semi-realistic cartoon style, natural proportions",
    WATERCOLOR: "Soft watercolor illustration style",
    PICTURE_BOOK: "Classic children's picture book style",
  };
  return styles[style] ?? "Disney/Pixar 3D cartoon style";
}

/**
 * Generate story using Gemini
 */
export async function generateStory(input: StoryGenerationInput): Promise<GeneratedStory> {
  const { childName, childAge, childGender, genreName, genreDescription, illustrationStyle } = input;

  const ageContext = childAge ? `${childAge} yoshli` : "kichkina";
  const genderContext = childGender === "girl" ? "qiz bola" : childGender === "boy" ? "o'g'il bola" : "bola";
  const artStyle = getArtStyleDescription(illustrationStyle ?? "ANIMATION_3D");
  const totalPages = 11; // 1 cover + 10 story pages

  console.log(`[Story Generator] Generating story for ${childName} (${totalPages} pages)`);

  const prompt = `Sen professional bolalar kitoblari yozuvchisissan. ${childName} uchun ${genreName} janrida qiziqarli hikoya yarat.

Talablar:
- O'zbek tilida
- Bola: ${childName} (${ageContext} ${genderContext})
- Janr: ${genreName} (${genreDescription})
- Jami ${totalPages} sahifa (muqova + 10 hikoya)
- Har sahifa 100-150 so'z
- Ijobiy xulosa

MUHIM: ${childName} butun hikoya davomida BIR XIL YOSHDA qoladi!

JSON formatda javob ber:
{
  "title": "Sarlavha (2 so'z)",
  "pages": [
    {
      "pageNumber": 0,
      "text": "Sarlavha",
      "sceneDescription": "COVER: ${childName} as main character. ${artStyle}. NO TEXT."
    },
    {
      "pageNumber": 1,
      "text": "Hikoya matni...",
      "sceneDescription": "STORY PAGE 1: Scene description in ENGLISH. ${artStyle}. NO TEXT."
    }
    // ... pages 2-10
  ]
}

MUHIM: sceneDescription FAQAT INGLIZ TILIDA!`;

  const MAX_RETRIES = 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      console.log(`[Story Generator] Attempt ${attempt + 1}/${MAX_RETRIES}`);

      const responseText = await callGemini(prompt);

      // Clean response
      let cleaned = responseText.trim();
      if (cleaned.startsWith("```json")) {
        cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }

      const story = JSON.parse(cleaned) as GeneratedStory;

      // Validate
      if (!story.title || !story.pages || story.pages.length < 3) {
        throw new Error(`Invalid story: ${story.pages?.length ?? 0} pages`);
      }

      console.log(`[Story Generator] Generated: "${story.title}" with ${story.pages.length} pages`);
      return story;

    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`[Story Generator] Attempt ${attempt + 1} failed:`, lastError.message);

      if (attempt < MAX_RETRIES - 1) {
        await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
      }
    }
  }

  throw lastError ?? new Error("Failed to generate story");
}

/**
 * Create page records from story
 */
export function createPageRecords(
  bookId: string,
  story: GeneratedStory
): Array<{
  bookId: string;
  pageNumber: number;
  text: string;
  sceneDescription: string;
}> {
  return story.pages.map((page) => ({
    bookId,
    pageNumber: page.pageNumber,
    text: page.text,
    sceneDescription: page.sceneDescription,
  }));
}
