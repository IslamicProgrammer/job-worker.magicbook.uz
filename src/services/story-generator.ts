/**
 * Story Generator for Job Worker
 * Generates personalized stories using Gemini AI
 * Full version with detailed prompts for quality stories
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
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 30000,
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
 * Get art style description for scene descriptions
 */
function getArtStyleDescription(illustrationStyle: string): string {
  const styles: Record<string, string> = {
    ANIMATION_3D: "Disney/Pixar 3D cartoon style, vibrant colors, expressive characters",
    FANTASY_STORYBOOK: "Hand-drawn fantasy storybook illustration, watercolor aesthetic, magical atmosphere",
    SEMI_REALISTIC: "Semi-realistic portrait illustration, natural proportions, warm lighting",
    WATERCOLOR: "Soft watercolor illustration style, gentle colors, artistic brushstrokes",
    PICTURE_BOOK: "Classic children's picture book style, traditional illustration",
    GOUACHE: "Gouache painting style, thick paint texture, rich colors",
    KAWAII: "Kawaii cute style, adorable characters, pastel colors, chibi proportions",
    COMIC_BOOK: "Comic book style, bold lines, dynamic panels, action-focused",
    SOFT_ANIME: "Soft anime/manga style, large expressive eyes, gentle shading",
    CLAY_ANIMATION: "Clay animation style, plasticine texture, stop-motion look",
    GEOMETRIC: "Geometric art style, simple shapes, modern minimalist",
    BLOCK_WORLD: "Block world style like Minecraft, cubic shapes, pixelated",
    COLLAGE: "Paper collage style, cut paper textures, layered artwork",
    STICKER_ART: "Sticker art style, flat colors, bold outlines, playful",
  };
  return styles[illustrationStyle] ?? "Disney/Pixar 3D cartoon style";
}

/**
 * Get age-appropriate story guidance
 */
function getAgeGuidance(ageCategory: string): string {
  switch (ageCategory) {
    case "AGE_0_2":
      return "YOSH: 0-2 yosh - Juda oddiy jumlalar, takrorlanuvchi ritm, sodda tasvirlar";
    case "AGE_3_5":
      return "YOSH: 3-5 yosh - Oddiy jumlalar, hayajonli voqealar, rang-barang tasvirlar";
    case "AGE_6_9":
      return "YOSH: 6-9 yosh - O'rtacha jumlalar, qiziqarli syujet, hayotiy tajribalar";
    case "AGE_10_PLUS":
      return "YOSH: 10+ yosh - Murakkab jumlalar, chuqur syujet, hayotiy darslar";
    default:
      return "";
  }
}

/**
 * Get theme-specific guidance
 */
function getThemeGuidance(theme: string): string {
  switch (theme) {
    case "EDUCATIONAL":
      return "MAVZU: Ta'limiy - O'rgatuvchi, foydali ma'lumotlar, yangi bilimlar";
    case "FAIRY_TALES":
      return "MAVZU: Ertaklar - Mo'jizaviy, fantastik, klassik ertak uslubi";
    case "ADVENTURE":
      return "MAVZU: Sarguzasht - Sayohat, kashfiyotlar, hayajonli voqealar";
    case "ACTIVITIES":
      return "MAVZU: Faoliyatlar - O'yin, sport, san'at, yaratish jarayoni";
    case "WORLDS":
      return "MAVZU: Dunyolar - Maxsus dunyo, noyob muhit va atmosfera";
    case "STORIES":
      return "MAVZU: Hikoyalar - Hayot tajribalari, haqiqiy hayotga yaqin";
    case "HOLIDAYS":
      return "MAVZU: Bayramlar - Bayram kayfiyati, an'analar, oilaviy birlik";
    case "FAMILY":
      return "MAVZU: Oila - Oilaviy munosabatlar, birlik va g'amxo'rlik";
    default:
      return "";
  }
}

/**
 * Get subject/world-specific guidance
 */
function getSubjectGuidance(subject: string): string {
  const uzbekSubjects: Record<string, string> = {
    SAMARKAND_HISTORY: "HIKOYA OLAMI: Samarqand tarixi - Registon, Amir Temur, arxitektura",
    BUKHARA_TALES: "HIKOYA OLAMI: Buxoro ertaklari - Qadimiy shahar, sharq ertaklari",
    KHIVA_LEGENDS: "HIKOYA OLAMI: Xiva afsonalari - Ichan-Qal'a, qadimiy qal'a",
    SILK_ROAD_ADVENTURE: "HIKOYA OLAMI: Buyuk Ipak yo'li - Savdogarlar, sayohat",
    UZBEK_CUISINE: "HIKOYA OLAMI: O'zbek taomlari - Osh, somsa, lag'mon",
    NAVRUZ_CELEBRATION: "HIKOYA OLAMI: Navro'z bayrami - Bahor, an'analar",
    UZBEK_FAIRY_TALES: "HIKOYA OLAMI: O'zbek xalq ertaklari - Milliy ertaklar",
    AMIR_TEMUR_ERA: "HIKOYA OLAMI: Amir Temur davri - Buyuk davlat",
    TASHKENT_MODERN: "HIKOYA OLAMI: Zamonaviy Toshkent - Poytaxt shahri",
    FERGANA_VALLEY: "HIKOYA OLAMI: Farg'ona vodiysi - Mevali vodiy",
    DESERT_KYZYLKUM: "HIKOYA OLAMI: Qizilqum cho'li - Cho'l sarguzashtlari",
    MOUNTAIN_TIEN_SHAN: "HIKOYA OLAMI: Tyan-Shan tog'lari - Baland tog'lar",
  };

  if (uzbekSubjects[subject]) {
    return uzbekSubjects[subject];
  }

  const genericSubjects: Record<string, string> = {
    IN_THE_JUNGLE: "HIKOYA OLAMI: Junglida",
    THE_SAVANNA: "HIKOYA OLAMI: Savannada",
    DEEP_IN_THE_OCEAN: "HIKOYA OLAMI: Okean tubida",
    AT_THE_NORTH_POLE: "HIKOYA OLAMI: Shimoliy qutbda",
    CANDY_LAND: "HIKOYA OLAMI: Shirinliklar olami",
    MAGICAL_FOREST: "HIKOYA OLAMI: Sehrli o'rmon",
    FAIRY_KINGDOM: "HIKOYA OLAMI: Parilar shohligi",
    THE_MIDDLE_AGES: "HIKOYA OLAMI: O'rta asrlar",
    THE_PREHISTORIC_AGE: "HIKOYA OLAMI: Dinozavrlar davri",
    THE_WILD_WEST: "HIKOYA OLAMI: Yovvoyi G'arb",
    THE_VIKINGS: "HIKOYA OLAMI: Vikinglar",
    ANCIENT_EGYPT: "HIKOYA OLAMI: Qadimgi Misr (faqat madaniyat va arxitektura)",
    ANCIENT_GREECE: "HIKOYA OLAMI: Qadimgi Yunoniston (faqat madaniyat, sport, san'at)",
    ANCIENT_ROME: "HIKOYA OLAMI: Qadimgi Rim (faqat madaniyat va arxitektura)",
    ARABIAN_NIGHTS_1001: "HIKOYA OLAMI: 1001 kecha",
    IN_SPACE: "HIKOYA OLAMI: Kosmosda",
    IN_THE_FUTURE: "HIKOYA OLAMI: Kelajakda",
    ON_MARS: "HIKOYA OLAMI: Marsda",
  };

  return genericSubjects[subject] ?? "";
}

/**
 * Generate story using Gemini with full detailed prompt
 */
export async function generateStory(input: StoryGenerationInput): Promise<GeneratedStory> {
  const {
    childName,
    childAge,
    childGender,
    genreName,
    genreDescription,
    ageCategory,
    theme,
    subject,
    illustrationStyle,
  } = input;

  const ageContext = childAge ? `${childAge} yoshli` : "kichkina";
  const genderContext = childGender === "girl" ? "qiz bola" : childGender === "boy" ? "o'g'il bola" : "bola";
  const artStyle = getArtStyleDescription(illustrationStyle ?? "ANIMATION_3D");
  const totalPages = 20; // 1 cover + 19 story pages
  const storyPages = totalPages - 1;

  console.log(`[Story Generator] Generating story for ${childName} (${totalPages} pages)`);

  // Build customization context
  const ageGuidance = ageCategory ? getAgeGuidance(ageCategory) : "";
  const themeGuidance = theme ? getThemeGuidance(theme) : "";
  const subjectGuidance = subject ? getSubjectGuidance(subject) : "";

  const customizationContext = [ageGuidance, themeGuidance, subjectGuidance]
    .filter((g) => g.length > 0)
    .join("\n\n");

  const prompt = `Sen professional bolalar kitoblari yozuvchisissan. Sening vazifang ${ageContext} bolalar uchun qiziqarli va ta'limiy hikoyalar yaratish.

${childName} uchun ${genreName} janrida qiziqarli hikoya yarat.

MUHIM: Har bir hikoya NOYOB va IJODIY bo'lishi kerak! Umumiy mavzularni (olma, maktab, hayvonlar bog'i) takrorlamang. Fantaziyangizdan foydalaning!
${customizationContext ? `\n${customizationContext}\n` : ""}
Hikoya quyidagi talablarga javob berishi kerak:
1. O'zbek tilida yozilgan bo'lsin
2. Bola ismi: ${childName} (${genderContext})
3. Janr: ${genreName} (${genreDescription})
4. Jami ${totalPages} sahifa (muqova + ${storyPages} sahifa hikoya)
5. ★★★ JUDA MUHIM - HAR BIR SAHIFA KAMIDA 300-400 SO'Z ★★★
   - Har bir sahifa UZUN va TO'LIQ bo'lishi kerak
   - TAKRORLAMANG - har bir jumla yangi ma'lumot berishi kerak
   - Bitta fikrni bir marta ayting, keyin davom eting
6. Har bir sahifa 3-4 PARAGRAFGA bo'lingan bo'lsin
7. Hikoya bolaning yoshiga mos bo'lsin
8. Hikoya ijobiy xulosa bilan tugasin
9. To'g'ri jinsga mos olmoshlardan foydalaning
10. Hikoyada boshlanish, o'rtalik, va yakunlovchi qismlar aniq bo'lsin

MUHIM - HAR SAHIFADA VOQEALAR:
- Har bir sahifa ALOHIDA VOQEA yoki HARAKAT bo'lishi kerak
- Faqat tasvirlab qolmang - NIMA BO'LYAPTI, NIMA SODIR BO'LADI?
- Har sahifada: yangi kashfiyot, yangi tanishuv, yangi muammo, yangi yechim
- Dialoglar, his-tuyg'ular, harakatlar - barchasini qo'shing
- Hikoya dinamik va qiziqarli bo'lsin - statik tasvirlardan qoching

★★★ BOLANING YOSHI HECH QACHON O'ZGARMAYDI - MUTLAQO TAQIQLANGAN! ★★★
JUDA MUHIM - YOSH BO'YICHA QOIDALAR:
- ${childName} butun hikoya davomida BIR XIL YOSHDA qoladi - ${ageContext}!
- Hikoya faqat BIR KUN yoki BIR HAFTA ichida sodir bo'ladi - yillar o'tmaydi
- ${childName} HECH QACHON katta bo'lib, keksa bo'lmaydi, qariyb qolmaydi
- ${childName} HECH QACHON voyaga yetmaydi, kattalashmaydi
- Hikoya oxirida ${childName} boshqa yoshlarga hikoya aytmaydi - u o'zi hali yoshdir!
- Bu BITTA SARGUZASHT - umr bo'yi hikoya EMAS!

★★★ TAQIQLANGAN SO'ZLAR VA TUSHUNCHALAR ★★★
QUYIDAGILARNI HECH QACHON YOZMANG:
- "Oqsoqol" - TAQIQLANGAN! Bola oqsoqol bo'lmaydi!
- "Keksa", "qarigan", "katta bo'lib" - TAQIQLANGAN!
- "Yillar o'tdi", "vaqt o'tdi", "kattaydi" - TAQIQLANGAN!
- "Nabiralarga aytib berdi", "bolalarga o'rgatdi" - TAQIQLANGAN!

★★★ DINIY VA XUDOLAR MAVZULARI - MUTLAQO TAQIQLANGAN! ★★★
HECH QACHON YOZMANG - bu bolalar kitobi!
- Xudolar: Zevs, Apollon, Afrodita, Poseydon, Ares, Hera, Afina va boshqa yunon xudolari - TAQIQLANGAN!
- Rim xudolari: Yupiter, Mars, Venera, Neptun - TAQIQLANGAN!
- Misr xudolari: Ra, Ozirus, Izida, Anubis - TAQIQLANGAN!
- Viking xudolari: Odin, Tor, Loki, Freya - TAQIQLANGAN!
- HECH QANDAY xudo, iloh, ma'buda, tangri eslatmasi bo'lmasin!
- Diniy marosimlar, qurbonliklar, ibodatxonalardagi diniy faoliyat - TAQIQLANGAN!
- Afsonalar va mifologiya o'rniga FAQAT madaniyat, san'at, arxitektura, sport, fan, kashfiyotlar haqida yozing!

Qadimgi Yunoniston uchun TO'G'RI mavzular:
- Olimpiya o'yinlari, sport musobaqalari
- Arxitektura: ustunlar, teatrlar, stadionlar
- San'at: haykaltaroshlik, kulolchilik, mozaika
- Matematika va fan: Pifagor, Arximed
- Falsafa va bilim: maktablar, kutubxonalar
- Kundalik hayot: bozorlar, hunarmandchilik

Qadimgi Misr uchun TO'G'RI mavzular:
- Piramidalar va arxitektura
- Nil daryosi va dehqonchilik
- Yozuv (iyerogliflar) va qog'oz (papirus)
- San'at va haykaltaroshlik
- Kundalik hayot va hunarmandchilik

Qadimgi Rim uchun TO'G'RI mavzular:
- Yo'llar, ko'priklar, akveduklar
- Kolizey va sport o'yinlari (gladiatorlarsiz)
- Hammomlar va arxitektura
- Qonunlar va boshqaruv
- Hunarmandchilik va savdo

HIKOYA YAKUNLASH QOIDASI:
- Hikoya oxirida ${childName} HALI HAM ${ageContext} BOLA!
- Yakuniy sahifada: ${childName} o'z sarguzashtidan XURSAND, lekin U HALI BOLA!
- TO'G'RI yakun: "${childName} juda xursand edi va ertaga yangi sarguzashtlar kutayotganini bilardi"

★★★ O'ZBEK TILIDA TO'G'RI YOZISH ★★★
- Grammatik xatolar YO'Q - professional kitob kabi yozing
- Har bir jumla BOSH HARF bilan boshlanishi kerak
- Har bir jumla NUQTA bilan tugashi kerak

PROFESSIONAL KITOB FORMATI:
- Matn 3-4 paragraflarga bo'lingan
- Har bir paragraf KAMIDA 3-5 jumladan iborat (UZUN paragraflar)
- Dialoglar alohida paragrafda
- MUHIM: Paragraflar orasida \\n\\n ishlatish

★★★ TITLE (SARLAVHA) QOIDALARI - JUDA MUHIM! ★★★
QATTIY QOIDALAR - BUZILSA XATO!
1. Title FAQAT 2 SO'ZDAN iborat bo'lishi SHART!
2. Birinchi so'z: ${childName} (bolaning ismi)
3. Ikkinchi so'z: Sarguzashti, Sayohati, Sehrli, Mo'jizasi, Kashfiyoti, Dunyosi, va hokazo
4. TO'G'RI YOZUV - imlo xatosiz!
5. INGLIZ TILIDA so'z ishlatish MUTLAQO TAQIQLANGAN!

TO'G'RI MISOLLAR:
- "${childName} Sarguzashti"
- "${childName} Sayohati"
- "${childName} Mo'jizasi"
- "${childName} Kashfiyoti"
- "${childName} Dunyosi"

NOTO'G'RI MISOLLAR (TAQIQLANGAN):
- "The Adventures of ${childName}" - INGLIZCHA! XATO!
- "${childName}'s Journey" - INGLIZCHA! XATO!
- "${childName} va Sehrli O'rmon Sarguzashti" - 4+ so'z! XATO!
- "Sehrli Hikoya" - bola ismi yo'q! XATO!

JUDA MUHIM - sceneDescription FAQAT INGLIZ TILIDA!
- "text" maydoni: O'zbek tilida hikoya matni
- "sceneDescription" maydoni: FAQAT INGLIZ TILIDA rasm tavsifi

MUHIM: Javobni qat'iy quyidagi JSON formatda ber:
{
  "title": "Qisqa Sarlavha",
  "pages": [
    {
      "pageNumber": 0,
      "text": "Hikoya sarlavhasi",
      "sceneDescription": "COVER PAGE: ${childName} as the main character. ${artStyle}. NO TEXT ON IMAGE."
    },
    {
      "pageNumber": 1,
      "text": "[300-400 SO'Z - 3-4 paragraf]\\n\\nVoqeaning boshlanishi haqida batafsil yozing...\\n\\n${childName}ning fikrlari va his-tuyg'ulari...\\n\\nBirinchi harakatlar va natijalar...",
      "sceneDescription": "STORY PAGE 1: ${childName} in opening scene. ${artStyle}. NO TEXT ON IMAGE."
    },
    {
      "pageNumber": 2,
      "text": "[300-400 SO'Z - 3-4 paragraf]\\n\\nHikoya davomi...",
      "sceneDescription": "STORY PAGE 2: Scene description in ENGLISH. ${artStyle}. NO TEXT ON IMAGE."
    }
  ]
}

Generate all ${totalPages} pages (0 to ${storyPages}).

IMPORTANT: Respond ONLY with valid JSON. No explanatory text.`;

  const MAX_RETRIES = 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      console.log(`[Story Generator] Attempt ${attempt + 1}/${MAX_RETRIES}`);

      const responseText = await callGemini(prompt);

      // Log first 200 chars for debugging
      console.log(`[Story Generator] Response preview: ${responseText.substring(0, 200)}`);

      // Clean response
      let cleaned = responseText.trim();
      if (cleaned.startsWith("```json")) {
        cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }

      // Fix common JSON issues
      cleaned = cleaned
        .replace(/,(\s*[\]}])/g, "$1") // Remove trailing commas
        .replace(/,\s*,/g, ","); // Remove double commas

      // More robust string cleaning - handle each character
      let inString = false;
      let escaped = false;
      let result = '';

      for (let i = 0; i < cleaned.length; i++) {
        const char = cleaned[i]!;
        const code = char.charCodeAt(0);

        if (escaped) {
          result += char;
          escaped = false;
          continue;
        }

        if (char === '\\' && inString) {
          escaped = true;
          result += char;
          continue;
        }

        if (char === '"') {
          inString = !inString;
          result += char;
          continue;
        }

        if (inString) {
          // Inside a string - handle special characters
          if (char === '\n') {
            result += '\\n';
          } else if (char === '\r') {
            result += '\\n';
          } else if (char === '\t') {
            result += ' ';
          } else if (code < 32 || code === 127) {
            // Skip control characters
          } else {
            result += char;
          }
        } else {
          // Outside string - keep as is
          result += char;
        }
      }

      cleaned = result;

      // Try to parse, if fails log the problematic area
      let story: GeneratedStory;
      try {
        story = JSON.parse(cleaned) as GeneratedStory;
      } catch (parseError) {
        const errorMsg = parseError instanceof Error ? parseError.message : String(parseError);
        // Extract position from error message
        const posMatch = errorMsg.match(/position\s+(\d+)/i);
        if (posMatch) {
          const pos = parseInt(posMatch[1]!, 10);
          const start = Math.max(0, pos - 50);
          const end = Math.min(cleaned.length, pos + 50);
          console.error(`[Story Generator] JSON error at position ${pos}:`);
          console.error(`[Story Generator] Context: ...${cleaned.substring(start, end)}...`);
        }
        throw parseError;
      }

      // Validate structure
      if (!story.title || !story.pages || story.pages.length < 5) {
        throw new Error(`Invalid story: ${story.pages?.length ?? 0} pages (minimum 5 required)`);
      }

      // Validate title format (should be 2 words, include child name)
      const titleWords = story.title.trim().split(/\s+/);
      if (titleWords.length > 3) {
        console.warn(`[Story Generator] Title too long: "${story.title}" (${titleWords.length} words), truncating...`);
        // Try to fix: take first 2 words or create standard format
        if (titleWords[0]?.toLowerCase() === childName.toLowerCase() ||
            titleWords.includes(childName)) {
          story.title = `${childName} Sarguzashti`;
        } else {
          story.title = titleWords.slice(0, 2).join(" ");
        }
        console.log(`[Story Generator] Fixed title: "${story.title}"`);
      }

      // Check for English words in title
      const englishPattern = /\b(the|of|and|in|on|at|to|for|with|adventure|journey|story|magic|world)\b/i;
      if (englishPattern.test(story.title)) {
        console.warn(`[Story Generator] English words in title: "${story.title}", fixing...`);
        story.title = `${childName} Sarguzashti`;
        console.log(`[Story Generator] Fixed title: "${story.title}"`);
      }

      // Log page word counts
      for (const page of story.pages) {
        if (page.pageNumber > 0) {
          const wordCount = page.text.trim().split(/\s+/).length;
          console.log(`[Story Generator] Page ${page.pageNumber}: ${wordCount} words`);
        }
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
