import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { CATEGORIES_QUERY } from "@/sanity/lib/queries";

type Category = {
  _id: string;
  title: string;
  slug: string;
  description?: string | null;
};

const FALLBACK_CATEGORIES = [
  { title: "Business & Tech", slug: "business-tech", description: null },
  { title: "Politics & Policy", slug: "politics-policy", description: null },
  {
    title: "Sports & Entertainment",
    slug: "sports-entertainment",
    description: null,
  },
  { title: "Arts & Culture", slug: "arts-culture", description: null },
];

export async function CategoryHighlights() {
  let categories: Category[] = await client.fetch(CATEGORIES_QUERY);

  if (categories.length === 0) {
    categories = FALLBACK_CATEGORIES as Category[];
  }

  return (
    <section className="py-12">
      <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
        Explore by Topic
      </h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => (
          <li key={cat.slug}>
            <Link
              href={`/category/${cat.slug}`}
              className="block rounded-lg border border-border bg-neutral-50/60 p-4 transition-colors hover:border-neutral-300 hover:bg-neutral-100 dark:bg-neutral-900/50 dark:hover:border-neutral-700 dark:hover:bg-neutral-900"
            >
              <span className="font-medium text-neutral-900 dark:text-white">
                {cat.title}
              </span>
              {cat.description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {cat.description}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
