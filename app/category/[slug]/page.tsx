import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import {
  CATEGORIES_QUERY,
  ARTICLES_BY_CATEGORY_QUERY,
  EVENTS_BY_CATEGORY_QUERY,
} from "@/sanity/lib/queries";
import { PageContainer } from "@/components/page-container";
import { CategorySummary } from "@/components/category/category-summary";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Calendar } from "lucide-react";

const ARTICLES_PER_PAGE = 9;

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
  imageUrl?: string | null;
  category?: { title: string; slug: string } | null;
};

type Event = {
  _id: string;
  title: string;
  slug: string;
  eventDate?: string | null;
  location?: string | null;
  description?: string | null;
  externalUrl?: string | null;
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

function pageHref(slug: string, page: number) {
  return page <= 1 ? `/category/${slug}` : `/category/${slug}?page=${page}`;
}

function getVisiblePages(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "ellipsis")[] = [1];

  if (current > 3) pages.push("ellipsis");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("ellipsis");

  pages.push(total);
  return pages;
}

export async function generateStaticParams() {
  const categories: Category[] = await client.fetch(CATEGORIES_QUERY);
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categories: Category[] = await client.fetch(CATEGORIES_QUERY);
  const category = categories.find((c) => c.slug === slug);

  if (!category) return {};

  const description =
    category.description ??
    `Latest ${category.title} coverage — curated and framed by James Nicholas Kinney.`;

  return {
    title: category.title,
    description,
    openGraph: {
      title: category.title,
      description,
      url: `/category/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: category.title,
      description,
    },
    alternates: {
      canonical: `/category/${slug}`,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;

  const categories: Category[] = await client.fetch(CATEGORIES_QUERY);
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const [articles, events]: [Article[], Event[]] = await Promise.all([
    client.fetch(ARTICLES_BY_CATEGORY_QUERY, { categorySlug: slug }),
    client.fetch(EVENTS_BY_CATEGORY_QUERY, { categorySlug: slug }),
  ]);

  const hasEvents = events.length > 0;
  const hasArticles = articles.length > 0;

  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const totalPages = Math.max(1, Math.ceil(articles.length / ARTICLES_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedArticles = articles.slice(
    (safePage - 1) * ARTICLES_PER_PAGE,
    safePage * ARTICLES_PER_PAGE,
  );
  const showPagination = totalPages > 1;

  return (
    <PageContainer size="wide" className="py-8 md:py-12">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
          {category.title}
        </h1>
        {category.description && (
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            {category.description}
          </p>
        )}
      </header>

      {hasArticles && <CategorySummary categorySlug={slug} />}

      {hasEvents && (
        <section className="mt-12">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-medium text-neutral-900 dark:text-white">
            <Calendar className="size-5 text-neutral-600 dark:text-neutral-400" />
            Events
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const Wrapper = event.externalUrl ? "a" : "div";
              const wrapperProps = event.externalUrl
                ? {
                    href: event.externalUrl,
                    target: "_blank" as const,
                    rel: "noopener noreferrer",
                    className: "block",
                  }
                : { className: "block" };
              return (
                <li key={event._id}>
                  <Wrapper {...wrapperProps}>
                    <Card className="h-full border-border bg-neutral-50/60 transition-colors hover:border-neutral-300 hover:bg-neutral-100 dark:bg-neutral-900/50 dark:hover:border-neutral-700 dark:hover:bg-neutral-900">
                      <CardHeader className="space-y-2 px-4 py-4 md:px-5 md:py-5">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="line-clamp-2 text-base font-medium text-neutral-900 dark:text-white">
                            {event.title}
                          </CardTitle>
                          <Badge variant="secondary" className="shrink-0">
                            Event
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 md:px-5 md:pb-5">
                        <p className="line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
                          {event.description ?? ""}
                        </p>
                        <time
                          className="mt-2 block text-xs text-muted-foreground"
                          dateTime={event.eventDate ?? undefined}
                        >
                          {formatDate(event.eventDate ?? null)}
                        </time>
                        {event.location && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {event.location}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Wrapper>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {hasArticles && (
        <section className="mt-12">
          <h2 className="mb-4 text-lg font-medium text-neutral-900 dark:text-white">
            Articles
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedArticles.map((article) => (
              <li key={article._id}>
                <Link href={`/article/${article.slug}`}>
                  <Card className="h-full overflow-hidden border-border bg-neutral-50/60 transition-colors hover:border-neutral-300 hover:bg-neutral-100 dark:bg-neutral-900/50 dark:hover:border-neutral-700 dark:hover:bg-neutral-900">
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
                      <CardTitle className="line-clamp-2 text-base font-medium text-neutral-900 dark:text-white">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 md:px-5 md:pb-5">
                      <p className="line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
                        {article.excerpt ?? ""}
                      </p>
                      <time
                        className="mt-2 block text-xs text-muted-foreground"
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

          {showPagination && (
            <Pagination className="mt-8">
              <PaginationContent>
                {safePage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious href={pageHref(slug, safePage - 1)} />
                  </PaginationItem>
                )}

                {getVisiblePages(safePage, totalPages).map((p, i) =>
                  p === "ellipsis" ? (
                    <PaginationItem key={`e-${i}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href={pageHref(slug, p)}
                        isActive={p === safePage}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}

                {safePage < totalPages && (
                  <PaginationItem>
                    <PaginationNext href={pageHref(slug, safePage + 1)} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </section>
      )}

      {!hasEvents && !hasArticles && (
        <p className="mt-12 text-muted-foreground">
          No published articles or events in this category yet.
        </p>
      )}
    </PageContainer>
  );
}
