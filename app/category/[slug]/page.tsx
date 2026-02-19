import { notFound } from "next/navigation";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { CATEGORIES_QUERY } from "@/sanity/lib/queries";
import { ARTICLES_QUERY } from "@/sanity/lib/queries";
import { PageContainer } from "@/components/page-container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Category = {
  _id: string;
  title: string;
  slug: string;
  description?: string | null;
};

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
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

const ARTICLES_BY_CATEGORY_QUERY = `*[_type == "article" && contentState == "published" && category->slug.current == $categorySlug && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  category->{ title, "slug": slug.current }
}`;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categories: Category[] = await client.fetch(CATEGORIES_QUERY);
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const articles: Article[] = await client.fetch(ARTICLES_BY_CATEGORY_QUERY, {
    categorySlug: slug,
  });

  return (
    <PageContainer size="wide" className="py-8 md:py-12">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          {category.title}
        </h1>
        {category.description && (
          <p className="mt-2 text-neutral-400">{category.description}</p>
        )}
      </header>

      {articles.length === 0 ? (
        <p className="mt-12 text-neutral-500">
          No published articles in this category yet.
        </p>
      ) : (
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <li key={article._id}>
              <Link href={`/article/${article.slug}`}>
                <Card className="h-full border-neutral-800 bg-neutral-900/50 transition-colors hover:border-neutral-700 hover:bg-neutral-900">
                  <CardHeader className="space-y-2 px-4 py-4 md:px-5 md:py-5">
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
      )}
    </PageContainer>
  );
}
