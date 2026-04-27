import { client } from "@/sanity/lib/client";
import { THIS_WEEK_ARTICLES_QUERY } from "@/sanity/lib/queries";
import { getStoredWeeklySummary } from "@/lib/ai/weekly-summary";

type Article = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  publishedAt?: string | null;
  category?: { title: string; slug: string } | null;
};

export async function ThisWeekDigest() {
  const weekAgo = new Date(
    // eslint-disable-next-line react-hooks/purity -- intentional clock for "this week" filter
    Date.now() - 7 * 24 * 60 * 60 * 1000,
  ).toISOString();

  const articles: Article[] = await client.fetch(THIS_WEEK_ARTICLES_QUERY, {
    weekAgo,
  });

  if (articles.length === 0) return null;

  const summary = await getStoredWeeklySummary();
  if (!summary) return null;

  return (
    <div className="border-t border-border pb-4 pt-8">
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        This week
      </p>
      <p className="max-w-3xl text-lg leading-relaxed text-neutral-700 dark:text-neutral-400 md:text-xl md:leading-relaxed">
        {summary}
      </p>
    </div>
  );
}
