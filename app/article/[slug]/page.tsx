import { notFound } from "next/navigation";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { ARTICLE_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { PageContainer } from "@/components/page-container";
import type { PortableTextBlock } from "@portabletext/types";
import { PortableText } from "@/components/portable-text";
import { Badge } from "@/components/ui/badge";

type Article = {
  _id: string;
  title: string;
  slug: string;
  body?: unknown;
  excerpt?: string | null;
  publishedAt?: string | null;
  category?: { title: string; slug: string } | null;
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article: Article | null = await client.fetch(ARTICLE_BY_SLUG_QUERY, {
    slug,
  });

  if (!article || !article.slug) {
    notFound();
  }

  const bodyBlocks =
    Array.isArray(article.body) && article.body.length > 0
      ? (article.body as PortableTextBlock[])
      : null;

  return (
    <PageContainer size="narrow" className="py-8 md:py-12">
      <article>
        <header>
          {article.category && (
            <Link
              href={`/category/${article.category.slug}`}
              className="inline-block"
            >
              <Badge
                variant="secondary"
                className="mb-4 border-neutral-700 bg-neutral-800 text-neutral-300"
              >
                {article.category.title}
              </Badge>
            </Link>
          )}
          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            {article.title}
          </h1>
          <time
            className="mt-2 block text-sm text-neutral-500"
            dateTime={article.publishedAt ?? undefined}
          >
            {formatDate(article.publishedAt ?? null)}
          </time>
          {article.excerpt && (
            <p className="mt-4 text-lg text-neutral-400">{article.excerpt}</p>
          )}
        </header>

        {bodyBlocks && (
          <div className="mt-8 border-t border-neutral-800 pt-8">
            <PortableText value={bodyBlocks} />
          </div>
        )}
      </article>
    </PageContainer>
  );
}
