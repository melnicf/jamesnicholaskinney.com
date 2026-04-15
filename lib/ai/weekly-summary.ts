import OpenAI from "openai";

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

interface ArticleInput {
  title: string;
  excerpt?: string | null;
  category?: { title: string } | null;
}

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

let cachedSummary: { key: string; text: string; expiresAt: number } | null =
  null;

function buildCacheKey(articles: ArticleInput[]): string {
  return articles.map((a) => a.title).join("|");
}

export async function generateWeeklySummary(
  articles: ArticleInput[],
): Promise<string | null> {
  if (articles.length === 0) return null;

  const key = buildCacheKey(articles);

  if (cachedSummary && cachedSummary.key === key && Date.now() < cachedSummary.expiresAt) {
    return cachedSummary.text;
  }

  const openai = getOpenAI();

  const articleList = articles
    .map(
      (a, i) =>
        `${i + 1}. "${a.title}" (${a.category?.title ?? "Uncategorized"})${a.excerpt ? ` — ${a.excerpt}` : ""}`,
    )
    .join("\n");

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.5,
      max_tokens: 300,
      messages: [
        {
          role: "system",
          content: `You are an editorial voice for James Nicholas Kinney's media site covering business, technology, politics, and culture. Write a concise 2-3 sentence digest summarizing the key themes from this week's published articles. Be direct, insightful, and authoritative. Do not list individual articles — synthesize the overarching narrative. Address the reader implicitly ("This week…" is fine as an opener).`,
        },
        {
          role: "user",
          content: `Here are this week's articles:\n\n${articleList}`,
        },
      ],
    });

    const text = response.choices[0]?.message?.content?.trim() ?? null;

    if (text) {
      cachedSummary = { key, text, expiresAt: Date.now() + CACHE_TTL_MS };
    }

    return text;
  } catch (error) {
    console.error("Failed to generate weekly summary:", error);
    return null;
  }
}
