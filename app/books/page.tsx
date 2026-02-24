import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { PAGE_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { PageContainer } from "@/components/page-container";
import { PortableText } from "@/components/portable-text";
import type { PortableTextBlock } from "@portabletext/types";

type SanityPage = {
  title?: string;
  body?: unknown;
};

export const metadata: Metadata = {
  title: "Books",
  description:
    "Published and upcoming books by James Nicholas Kinney. Summaries, purchase links, and more.",
  openGraph: {
    title: "Books by James Nicholas Kinney",
    description:
      "Published and upcoming books by James Nicholas Kinney. Summaries, purchase links, and more.",
    url: "/books",
  },
  alternates: { canonical: "/books" },
};

export default async function BooksPage() {
  const page: SanityPage | null = await client.fetch(PAGE_BY_SLUG_QUERY, {
    slug: "books",
  });

  const bodyBlocks =
    page?.body && Array.isArray(page.body) && page.body.length > 0
      ? (page.body as PortableTextBlock[])
      : null;

  return (
    <PageContainer size="narrow" className="py-8 md:py-12">
      <article>
        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
          {page?.title ?? "Books"}
        </h1>
        {bodyBlocks ? (
          <div className="mt-8">
            <PortableText value={bodyBlocks} />
          </div>
        ) : (
          <p className="mt-6 text-neutral-500">
            Published and upcoming books, with purchase links and summaries.
            Add content in Sanity Studio by creating a page with slug
            &quot;books&quot;.
          </p>
        )}
      </article>
    </PageContainer>
  );
}
