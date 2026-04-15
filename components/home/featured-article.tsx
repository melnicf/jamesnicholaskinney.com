import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { FEATURED_AI_ARTICLE_QUERY } from "@/sanity/lib/queries";
import { Badge } from "@/components/ui/badge";

type Article = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  publishedAt?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  category?: { title: string; slug: string } | null;
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export async function FeaturedArticle() {
  const article: Article | null = await client.fetch(FEATURED_AI_ARTICLE_QUERY);

  if (!article) {
    return (
      <div className="rounded-lg border border-dashed border-neutral-700 bg-neutral-900/30 p-8 text-center">
        <p className="text-neutral-500">
          Featured AI article will appear here once Business & Tech content is
          published.
        </p>
      </div>
    );
  }

  return (
    <Link
      href={`/article/${article.slug}`}
      className="group block overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900/50 transition-colors hover:border-neutral-700 hover:bg-neutral-900"
    >
      {article.imageUrl && (
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={article.imageUrl}
            alt={article.imageAlt ?? article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 60vw"
            priority
          />
        </div>
      )}
      <div className="p-5 md:p-6">
        <div className="flex items-center gap-2">
          {article.category && (
            <Badge
              variant="secondary"
              className="border-neutral-700 bg-neutral-800 text-neutral-300"
            >
              {article.category.title}
            </Badge>
          )}
          <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
            Featured
          </span>
        </div>
        <h3 className="mt-3 text-xl font-semibold leading-snug text-white md:text-2xl">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mt-2 line-clamp-3 text-neutral-400">
            {article.excerpt}
          </p>
        )}
        <time
          className="mt-3 block text-sm text-neutral-500"
          dateTime={article.publishedAt ?? undefined}
        >
          {formatDate(article.publishedAt ?? null)}
        </time>
      </div>
    </Link>
  );
}
