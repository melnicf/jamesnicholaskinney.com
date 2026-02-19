import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { ARTICLES_QUERY } from "@/sanity/lib/queries";
import { Badge } from "@/components/ui/badge";

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

export async function FeaturedTake() {
  const articles: Article[] = await client.fetch(ARTICLES_QUERY);
  const featured = articles[0];

  if (!featured) {
    return (
      <section className="py-12">
        <h2 className="text-xl font-semibold text-white">Featured Take</h2>
        <div className="mt-6 rounded-lg border border-dashed border-neutral-700 bg-neutral-900/30 p-8 text-center">
          <p className="text-neutral-500">
            Featured commentary will appear here once content is published.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <h2 className="text-xl font-semibold text-white">Featured Take</h2>
      <Link
        href={`/article/${featured.slug}`}
        className="mt-6 block rounded-lg border border-neutral-800 bg-neutral-900/50 p-6 transition-colors hover:border-neutral-700 hover:bg-neutral-900"
      >
        {featured.category && (
          <Badge
            variant="secondary"
            className="mb-3 w-fit border-neutral-700 bg-neutral-800 text-neutral-300"
          >
            {featured.category.title}
          </Badge>
        )}
        <h3 className="text-xl font-semibold text-white">{featured.title}</h3>
        <p className="mt-2 text-neutral-400">{featured.excerpt ?? ""}</p>
        <time
          className="mt-4 block text-sm text-neutral-500"
          dateTime={featured.publishedAt ?? undefined}
        >
          {formatDate(featured.publishedAt ?? null)}
        </time>
      </Link>
    </section>
  );
}
