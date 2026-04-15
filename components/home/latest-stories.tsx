import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { ARTICLES_QUERY } from "@/sanity/lib/queries";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FeaturedArticle } from "./featured-article";

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
  imageUrl?: string | null;
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

  const sidebarArticles = articles.slice(0, 3);
  const gridArticles = articles.slice(3, 9);

  return (
    <>
      <section className="py-12">
        <h2 className="text-xl font-semibold text-white">Featured</h2>

        <div className="mt-6 grid gap-6 lg:grid-cols-[3fr_2fr]">
          <FeaturedArticle />

          <div className="flex flex-col gap-3">
            {sidebarArticles.map((article) => (
              <Link
                key={article._id}
                href={`/article/${article.slug}`}
                className="group flex gap-3 rounded-lg border border-neutral-800 bg-neutral-900/50 p-3.5 transition-colors hover:border-neutral-700 hover:bg-neutral-900"
              >
                {article.imageUrl && (
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  {article.category && (
                    <Badge
                      variant="secondary"
                      className="mb-1.5 border-neutral-700 bg-neutral-800 text-[10px] text-neutral-400"
                    >
                      {article.category.title}
                    </Badge>
                  )}
                  <h3 className="line-clamp-2 text-sm font-medium leading-snug text-white">
                    {article.title}
                  </h3>
                  <time
                    className="mt-1 block text-[11px] text-neutral-500"
                    dateTime={article.publishedAt ?? undefined}
                  >
                    {formatDate(article.publishedAt ?? null)}
                  </time>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {gridArticles.length > 0 && (
        <section className="py-12">
          <h2 className="text-xl font-semibold text-white">Latest</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gridArticles.map((article) => (
            <li key={article._id}>
              <Link href={`/article/${article.slug}`}>
                <Card className="h-full overflow-hidden border-neutral-800 bg-neutral-900/50 transition-colors hover:border-neutral-700 hover:bg-neutral-900">
                  {article.imageUrl && (
                    <div className="relative aspect-[16/9] w-full">
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
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
      )}
    </>
  );
}
