import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { THIS_WEEK_ARTICLES_QUERY } from "@/sanity/lib/queries";
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
        <span className="text-xs uppercase tracking-wide text-neutral-500">
          {articles.length} article{articles.length !== 1 ? "s" : ""}
        </span>
      </div>

      {summary ? (
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-neutral-400">
          {summary}
        </p>
      ) : (
        <p className="mt-2 text-sm text-neutral-500">
          The most important stories from the past seven days.
        </p>
      )}

      <div className="mt-5 space-y-2">
        {articles.map((article) => (
          <Link
            key={article._id}
            href={`/article/${article.slug}`}
            className="block rounded-md px-3 py-3 transition-colors hover:bg-neutral-900/60"
          >
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <time
                dateTime={article.publishedAt ?? undefined}
              >
                {formatDate(article.publishedAt ?? null)}
              </time>
              {article.category && (
                <>
                  <span aria-hidden>•</span>
                  <span>{article.category.title}</span>
                </>
              )}
            </div>

            <h3 className="mt-1 font-medium leading-snug text-white">
              {article.title}
            </h3>

            {article.excerpt && (
              <p className="mt-1 line-clamp-2 text-sm text-neutral-400">
                {article.excerpt}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
