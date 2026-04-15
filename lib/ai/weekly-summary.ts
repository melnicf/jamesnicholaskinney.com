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
        `${i + 1}. ${a.title}${a.excerpt ? ` — ${a.excerpt}` : ""}`,
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
    `You write short editorial digests for James Nicholas Kinney's media site. Synthesize the articles below into 2-3 sentences that capture what's interesting right now across business, technology, politics, and culture. Write the way a sharp editor would — concise, opinionated, and conversational. Vary your sentence openings naturally; never start with "This week," "Recent coverage," or any stock phrase. Do not mention article titles, author names, category labels, or publication metadata. Just distill the ideas.`,
    `Articles:\n\n${articleList}`,
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
    `You write short editorial digests for the ${categoryTitle} vertical of James Nicholas Kinney's media site. Synthesize the articles below into 2-3 sentences that capture the throughline — what themes connect them, what tensions are emerging, what's worth paying attention to. Write the way a sharp editor would — concise, opinionated, and conversational. Never open with "Recent coverage," "In recent weeks," or any formulaic phrase. Do not mention article titles, author names, category labels, dates, or publication metadata. Just distill the ideas as if you're telling a well-read friend what's been interesting lately.`,
    `Articles:\n\n${articleList}`,
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
