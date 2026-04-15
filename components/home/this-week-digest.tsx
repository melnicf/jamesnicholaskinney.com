import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { THIS_WEEK_ARTICLES_QUERY } from "@/sanity/lib/queries";
import { Badge } from "@/components/ui/badge";
import { generateWeeklySummary } from "@/lib/ai/weekly-summary";

type Article = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  publishedAt?: string | null;
  category?: { title: string; slug: string } | null;
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export async function ThisWeekDigest() {
  const weekAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000
  ).toISOString();

  const articles: Article[] = await client.fetch(THIS_WEEK_ARTICLES_QUERY, {
    weekAgo,
  });

  if (articles.length === 0) return null;

  const summary = await generateWeeklySummary(articles);

  return (
    <section className="py-12">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl font-semibold text-white">This Week</h2>
        <span className="text-sm text-neutral-500">
          {articles.length} article{articles.length !== 1 ? "s" : ""}
        </span>
      </div>

      {summary ? (
        <p className="mt-3 text-sm leading-relaxed text-neutral-300">
          {summary}
        </p>
      ) : (
        <p className="mt-1 text-sm text-neutral-400">
          The most important stories from the past seven days.
        </p>
      )}

      <div className="mt-6 divide-y divide-neutral-800 rounded-lg border border-neutral-800 bg-neutral-900/50">
        {articles.map((article) => (
          <Link
            key={article._id}
            href={`/article/${article.slug}`}
            className="flex items-start gap-4 px-5 py-4 transition-colors first:rounded-t-lg last:rounded-b-lg hover:bg-neutral-800/50"
          >
            <div className="min-w-0 flex-1">
              <h3 className="font-medium leading-snug text-white">
                {article.title}
              </h3>
              {article.excerpt && (
                <p className="mt-1 line-clamp-1 text-sm text-neutral-400">
                  {article.excerpt}
                </p>
              )}
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1 pt-0.5">
              {article.category && (
                <Badge
                  variant="secondary"
                  className="border-neutral-700 bg-neutral-800 text-neutral-400"
                >
                  {article.category.title}
                </Badge>
              )}
              <time
                className="text-xs text-neutral-500"
                dateTime={article.publishedAt ?? undefined}
              >
                {formatDate(article.publishedAt ?? null)}
              </time>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
