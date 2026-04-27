import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { ARTICLES_QUERY } from "@/sanity/lib/queries";
import { Badge } from "@/components/ui/badge";

type Article = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  publishedAt?: string | null;
  imageUrl?: string | null;
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

export async function FeaturedTake() {
  const articles: Article[] = await client.fetch(ARTICLES_QUERY);
  const featured = articles[0];

  if (!featured) {
    return (
      <section className="py-12">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
          Featured Take
        </h2>
        <div className="mt-6 rounded-lg border border-dashed border-neutral-300 bg-neutral-50/50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-900/30">
          <p className="text-muted-foreground">
            Featured commentary will appear here once content is published.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
        Featured Take
      </h2>
      <Link
        href={`/article/${featured.slug}`}
        className="mt-6 block overflow-hidden rounded-lg border border-border bg-neutral-50/60 transition-colors hover:border-neutral-300 hover:bg-neutral-100 dark:bg-neutral-900/50 dark:hover:border-neutral-700 dark:hover:bg-neutral-900 md:flex md:flex-row-reverse"
      >
        {featured.imageUrl && (
          <div className="relative aspect-video md:aspect-auto md:w-2/5">
            <Image
              src={featured.imageUrl}
              alt={featured.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
              priority
            />
          </div>
        )}
        <div className={`p-6 ${featured.imageUrl ? "md:w-3/5" : ""}`}>
          {featured.category && (
            <Badge variant="secondary" className="mb-3 w-fit">
              {featured.category.title}
            </Badge>
          )}
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
            {featured.title}
          </h3>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            {featured.excerpt ?? ""}
          </p>
          <time
            className="mt-4 block text-sm text-muted-foreground"
            dateTime={featured.publishedAt ?? undefined}
          >
            {formatDate(featured.publishedAt ?? null)}
          </time>
        </div>
      </Link>
    </section>
  );
}
