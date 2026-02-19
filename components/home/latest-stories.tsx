import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { ARTICLES_QUERY } from "@/sanity/lib/queries";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

type Article = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  publishedAt?: string | null;
  category?: { title: string; slug: string } | null;
};

export async function LatestStories() {
  const articles: Article[] = await client.fetch(ARTICLES_QUERY);

  if (articles.length === 0) {
    return (
      <section className="py-12">
        <h2 className="text-xl font-semibold text-white">Latest</h2>
        <p className="mt-4 text-neutral-500">
          No published articles yet. Content will appear here once published from
          Sanity Studio.
        </p>
      </section>
    );
  }

  return (
    <section className="py-12">
      <h2 className="text-xl font-semibold text-white">Latest</h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.slice(0, 6).map((article) => (
          <li key={article._id}>
            <Link href={`/article/${article.slug}`}>
              <Card className="h-full border-neutral-800 bg-neutral-900/50 transition-colors hover:border-neutral-700 hover:bg-neutral-900">
                <CardHeader className="space-y-2 px-4 py-4 md:px-5 md:py-5">
                  {article.category && (
                    <Badge
                      variant="secondary"
                      className="w-fit border-neutral-700 bg-neutral-800 text-neutral-300"
                    >
                      {article.category.title}
                    </Badge>
                  )}
                  <CardTitle className="line-clamp-2 text-base font-medium text-white">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 md:px-5 md:pb-5">
                  <p className="line-clamp-2 text-sm text-neutral-400">
                    {article.excerpt ?? ""}
                  </p>
                  <time
                    className="mt-2 block text-xs text-neutral-500"
                    dateTime={article.publishedAt ?? undefined}
                  >
                    {formatDate(article.publishedAt ?? null)}
                  </time>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
