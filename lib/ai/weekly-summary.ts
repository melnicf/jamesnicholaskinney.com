import OpenAI from "openai";
import { getAiSummary } from "@/lib/db/queries";

/** DB scope for the homepage “This week” digest. */
export const WEEKLY_SUMMARY_SCOPE = "weekly";

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

export interface ArticleInput {
  title: string;
  excerpt?: string | null;
  category?: { title: string } | null;
}

async function callOpenAI(system: string, user: string): Promise<string | null> {
  const openai = getOpenAI();
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.5,
      max_tokens: 300,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });
    return response.choices[0]?.message?.content?.trim() ?? null;
  } catch (error) {
    console.error("Failed to generate AI summary:", error);
    return null;
  }
}

function formatArticleList(articles: ArticleInput[]): string {
  return articles
    .map(
      (a, i) =>
        `${i + 1}. "${a.title}" (${a.category?.title ?? "Uncategorized"})${a.excerpt ? ` — ${a.excerpt}` : ""}`,
    )
    .join("\n");
}

/** Called from ingest only — generates and stores via `refreshIngestSummaries`. */
export async function generateWeeklySummaryText(
  articles: ArticleInput[],
): Promise<string | null> {
  if (articles.length === 0) return null;
  const articleList = formatArticleList(articles);
  return callOpenAI(
    `You are an editorial voice for James Nicholas Kinney's media site covering business, technology, politics, and culture. Write a concise 2-3 sentence digest summarizing the key themes from this week's published articles. Be direct, insightful, and authoritative. Do not list individual articles — synthesize the overarching narrative. Address the reader implicitly ("This week…" is fine as an opener).`,
    `Here are this week's articles:\n\n${articleList}`,
  );
}

/** Called from ingest only. */
export async function generateCategorySummaryText(
  categorySlug: string,
  categoryTitle: string,
  articles: ArticleInput[],
): Promise<string | null> {
  if (articles.length === 0) return null;
  const slice = articles.slice(0, 12);
  const articleList = formatArticleList(slice);
  return callOpenAI(
    `You are an editorial voice for James Nicholas Kinney's media site covering business, technology, politics, and culture. Write a concise 2-3 sentence digest summarizing the key themes from recent ${categoryTitle} coverage on the site. Be direct, insightful, and authoritative. Do not list individual articles by title — synthesize the narrative for this vertical. Address the reader implicitly (opening with the category or "Recent coverage…" is fine).`,
    `Category: ${categoryTitle} (slug: ${categorySlug})\n\nRecent articles in this category:\n\n${articleList}`,
  );
}

/** Reads precomputed copy from Neon (written during ingest). */
export async function getStoredWeeklySummary(): Promise<string | null> {
  return getAiSummary(WEEKLY_SUMMARY_SCOPE);
}

/** Reads precomputed copy from Neon (written during ingest). */
export async function getStoredCategorySummary(
  categorySlug: string,
): Promise<string | null> {
  return getAiSummary(categorySlug);
}
