import { client } from "@/sanity/lib/client";
import {
  ARTICLES_BY_CATEGORY_QUERY,
  CATEGORIES_QUERY,
  THIS_WEEK_ARTICLES_QUERY,
} from "@/sanity/lib/queries";
import {
  deleteAiSummary,
  ensureTables,
  upsertAiSummary,
} from "@/lib/db/queries";
import {
  generateCategorySummaryText,
  generateWeeklySummaryText,
  WEEKLY_SUMMARY_SCOPE,
  type ArticleInput,
} from "@/lib/ai/weekly-summary";

type SanityArticle = {
  title: string;
  excerpt?: string | null;
  category?: { title: string; slug: string } | null;
};

function toInputs(articles: SanityArticle[]): ArticleInput[] {
  return articles.map((a) => ({
    title: a.title,
    excerpt: a.excerpt,
    category: a.category,
  }));
}

/**
 * Regenerates and persists AI summaries in Neon after content changes.
 * Intended to run on ingest (cron); does not run OpenAI on page views.
 */
export async function refreshIngestSummaries(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    console.warn("refreshIngestSummaries: DATABASE_URL not set, skipping");
    return;
  }
  if (!process.env.OPENAI_API_KEY) {
    console.warn("refreshIngestSummaries: OPENAI_API_KEY not set, skipping");
    return;
  }

  await ensureTables();

  const weekAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000,
  ).toISOString();

  const weekArticles: SanityArticle[] = await client.fetch(
    THIS_WEEK_ARTICLES_QUERY,
    { weekAgo },
  );

  if (weekArticles.length === 0) {
    await deleteAiSummary(WEEKLY_SUMMARY_SCOPE);
  } else {
    const text = await generateWeeklySummaryText(toInputs(weekArticles));
    if (text) {
      await upsertAiSummary(WEEKLY_SUMMARY_SCOPE, text);
    } else {
      await deleteAiSummary(WEEKLY_SUMMARY_SCOPE);
    }
  }

  const categories: { slug: string; title: string }[] = await client.fetch(
    CATEGORIES_QUERY,
  );

  for (const cat of categories) {
    const catArticles: SanityArticle[] = await client.fetch(
      ARTICLES_BY_CATEGORY_QUERY,
      { categorySlug: cat.slug },
    );

    if (catArticles.length === 0) {
      await deleteAiSummary(cat.slug);
      continue;
    }

    const text = await generateCategorySummaryText(
      cat.slug,
      cat.title,
      toInputs(catArticles),
    );
    if (text) {
      await upsertAiSummary(cat.slug, text);
    } else {
      await deleteAiSummary(cat.slug);
    }
  }
}
