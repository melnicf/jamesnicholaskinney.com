import type { Metadata } from "next";
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
  seoTitle?: string | null;
  seoDescription?: string | null;
  sourceName?: string | null;
  sourceUrl?: string | null;
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article: Article | null = await client.fetch(ARTICLE_BY_SLUG_QUERY, {
    slug,
  });

  if (!article) return {};

  const title = article.seoTitle ?? article.title;
  const description =
    article.seoDescription ?? article.excerpt ?? undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: article.publishedAt ?? undefined,
      section: article.category?.title,
      url: `/article/${article.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `/article/${article.slug}`,
    },
  };
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt ?? undefined,
    datePublished: article.publishedAt ?? undefined,
    author: {
      "@type": "Person",
      name: "James Nicholas Kinney",
      url: "https://jamesnicholaskinney.com/about",
    },
    publisher: {
      "@type": "Organization",
      name: "James Nicholas Kinney",
      url: "https://jamesnicholaskinney.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://jamesnicholaskinney.com/article/${article.slug}`,
    },
    ...(article.category && {
      articleSection: article.category.title,
    }),
  };

  return (
    <PageContainer size="narrow" className="py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
          {article.sourceName && (
            <p className="mt-2 text-sm text-neutral-500">
              Source:{" "}
              {article.sourceUrl ? (
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-neutral-300"
                >
                  {article.sourceName}
                </a>
              ) : (
                article.sourceName
              )}
            </p>
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
