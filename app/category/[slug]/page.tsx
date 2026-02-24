import { notFound } from "next/navigation";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import {
  CATEGORIES_QUERY,
  ARTICLES_BY_CATEGORY_QUERY,
  EVENTS_BY_CATEGORY_QUERY,
} from "@/sanity/lib/queries";
import { PageContainer } from "@/components/page-container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

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

  const [articles, events] = await Promise.all([
    client.fetch(ARTICLES_BY_CATEGORY_QUERY, { categorySlug: slug }),
    client.fetch(EVENTS_BY_CATEGORY_QUERY, { categorySlug: slug }),
  ]);

  const hasEvents = events.length > 0;
  const hasArticles = articles.length > 0;

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

      {hasEvents && (
        <section className="mt-12">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-medium text-white">
            <Calendar className="size-5 text-neutral-400" />
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
                    <Card className="h-full border-neutral-800 bg-neutral-900/50 transition-colors hover:border-neutral-700 hover:bg-neutral-900">
                      <CardHeader className="space-y-2 px-4 py-4 md:px-5 md:py-5">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="line-clamp-2 text-base font-medium text-white">
                            {event.title}
                          </CardTitle>
                          <Badge variant="secondary" className="shrink-0">
                            Event
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 md:px-5 md:pb-5">
                        <p className="line-clamp-2 text-sm text-neutral-400">
                          {event.description ?? ""}
                        </p>
                        <time
                          className="mt-2 block text-xs text-neutral-500"
                          dateTime={event.eventDate ?? undefined}
                        >
                          {formatDate(event.eventDate ?? null)}
                        </time>
                        {event.location && (
                          <p className="mt-1 text-xs text-neutral-500">
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
        <section className={hasEvents ? "mt-12" : "mt-12"}>
          <h2 className="mb-4 text-lg font-medium text-white">Articles</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        </section>
      )}

      {!hasEvents && !hasArticles && (
        <p className="mt-12 text-neutral-500">
          No published articles or events in this category yet.
        </p>
      )}
    </PageContainer>
  );
}
