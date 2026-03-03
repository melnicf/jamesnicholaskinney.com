import OpenAI from "openai";
import type { NormalizedItem, EnrichedItem, SanityCategory } from "./types";

let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

interface AiResult {
  excerpt: string;
  categorySlug: string | null;
}

async function analyzeContent(
  item: NormalizedItem,
  categories: SanityCategory[],
): Promise<AiResult> {
  const openai = getOpenAI();

  const categoryList = categories
    .map((c) => `- "${c.slug}" (${c.title})`)
    .join("\n");

  const contentPreview = item.content.slice(0, 3000);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an editorial assistant for a media commentary site. You perform two tasks:

1. **Summarize** the article in 1-2 sentences for an informed audience. Be direct and sharp. Do not start with "This article..." — lead with the insight.

2. **Categorize** the article into exactly one of these categories:
${categoryList}

Respond with JSON: { "excerpt": "...", "categorySlug": "..." }
If no category fits well, set categorySlug to null.`,
      },
      {
        role: "user",
        content: `Title: ${item.title}\nSource: ${item.sourceName}\n\n${contentPreview}`,
      },
    ],
  });

  const text = response.choices[0]?.message?.content;
  if (!text) {
    return { excerpt: item.snippet.slice(0, 300), categorySlug: null };
  }

  try {
    const parsed = JSON.parse(text) as AiResult;
    return {
      excerpt: parsed.excerpt || item.snippet.slice(0, 300),
      categorySlug: parsed.categorySlug || null,
    };
  } catch {
    return { excerpt: item.snippet.slice(0, 300), categorySlug: null };
  }
}

export async function enrichItem(
  item: NormalizedItem,
  categories: SanityCategory[],
): Promise<EnrichedItem> {
  const aiResult = await analyzeContent(item, categories);

  const matchedCategory = aiResult.categorySlug
    ? categories.find((c) => c.slug === aiResult.categorySlug)
    : null;

  const categoryId =
    matchedCategory?._id ?? item.feedSource.defaultCategoryId ?? null;

  return {
    ...item,
    excerpt: aiResult.excerpt,
    categoryId,
  };
}
