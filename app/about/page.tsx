import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { PAGE_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { PageContainer } from "@/components/page-container";
import { PortableText } from "@/components/portable-text";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import type { PortableTextBlock } from "@portabletext/types";
import { ABOUT_PAGE_BODY } from "@/lib/content/about-portable-text";

type SanityPage = {
  title?: string;
  body?: unknown;
};

export const metadata: Metadata = {
  title: "About",
  description:
    "James Nicholas Kinney — Global Chief AI Officer at INVNT, enterprise transformation leader, and voice at the intersection of AI, leadership, and human behavior.",
  openGraph: {
    title: "About James Nicholas Kinney",
    description:
      "Global CAIO at INVNT, former Global CPO at S4 Capital, triple-certified in AI, author, and speaker on human-centered AI and enterprise transformation.",
    url: "/about",
  },
  alternates: { canonical: "/about" },
};

const CREDENTIALS = [
  "Global Chief AI Officer, INVNT",
  "Enterprise transformation leader",
  "Triple-certified in AI",
  "Author & speaker",
  "AI for Better",
] as const;

export default async function AboutPage() {
  const page: SanityPage | null = await client.fetch(PAGE_BY_SLUG_QUERY, {
    slug: "about",
  });

  const bodyBlocks =
    page?.body && Array.isArray(page.body) && page.body.length > 0
      ? (page.body as PortableTextBlock[])
      : null;

  return (
    <PageContainer size="narrow" className="py-8 md:py-12">
      <article>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white md:text-4xl">
          {page?.title ?? "About James Nicholas Kinney"}
        </h1>

        <div className="mt-4 flex flex-wrap gap-2">
          {CREDENTIALS.map((cred) => (
            <span
              key={cred}
              className="rounded-full border border-border bg-neutral-100/80 px-3 py-1 text-sm text-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-300"
            >
              {cred}
            </span>
          ))}
        </div>

        <div className="mt-8">
          <PortableText value={bodyBlocks ?? ABOUT_PAGE_BODY} />
        </div>

        <Separator className="my-10" />

        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/books">Read His Books</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/appearances">Speaking & Appearances</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </article>
    </PageContainer>
  );
}
