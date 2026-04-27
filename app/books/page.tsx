import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { client } from "@/sanity/lib/client";
import { PAGE_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { PageContainer } from "@/components/page-container";
import { PortableText } from "@/components/portable-text";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { PortableTextBlock } from "@portabletext/types";

type SanityPage = {
  title?: string;
  body?: unknown;
};

export const metadata: Metadata = {
  title: "Books",
  description:
    "Books by James Nicholas Kinney — SustAIning Leadership and AI + Mental Health. Available on Amazon.",
  openGraph: {
    title: "Books by James Nicholas Kinney",
    description:
      "SustAIning Leadership and AI + Mental Health — bestselling books on the practical and human dimensions of AI.",
    url: "/books",
  },
  alternates: { canonical: "/books" },
};

const BOOKS = [
  {
    title: "SustAIning Leadership",
    description:
      "A practical guide for executives and leaders navigating the AI transformation. Explores how to sustain leadership relevance, make strategic AI decisions, and build organizations that thrive in an AI-augmented world.",
    purchaseUrl: "https://a.co/d/0d5qkYJe",
    tags: ["Leadership", "AI Strategy", "Enterprise"],
    coverFront: "/books/sustAIning_book.jpg",
    coverBack: "/books/sustAIning_book_back.jpg",
  },
  {
    title: "AI + Mental Health",
    description:
      "An examination of the intersection between artificial intelligence and mental health — how AI is reshaping wellbeing, the risks of unchecked automation, and the human considerations that must guide responsible AI deployment in health and wellness.",
    purchaseUrl: "https://a.co/d/0iKhwsov",
    tags: ["Mental Health", "AI Ethics", "Wellbeing"],
    coverFront: "/books/AI_MentalHealth.jpg",
    coverBack: "/books/AI_MentalHealth_back.jpg",
  },
] as const;

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
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white md:text-4xl">
          {page?.title ?? "Books"}
        </h1>
        <p className="mt-3 text-neutral-600 dark:text-neutral-400">
          Published works by James Nicholas Kinney on the practical and human
          dimensions of artificial intelligence.
        </p>

        {bodyBlocks && (
          <div className="mt-8">
            <PortableText value={bodyBlocks} />
          </div>
        )}

        <div className="mt-10 space-y-8">
          {BOOKS.map((book) => (
            <div
              key={book.title}
              className="overflow-hidden rounded-lg border border-border bg-neutral-50/60 dark:bg-neutral-900/50"
            >
              <div className="flex gap-3 overflow-x-auto p-5 md:p-6">
                <div className="relative aspect-2/3 w-44 shrink-0 overflow-hidden rounded-md shadow-lg shadow-neutral-300/40 dark:shadow-black/40">
                  <Image
                    src={book.coverFront}
                    alt={`${book.title} — front cover`}
                    fill
                    className="object-cover"
                    sizes="176px"
                  />
                </div>
                <div className="relative aspect-2/3 w-44 shrink-0 overflow-hidden rounded-md shadow-lg shadow-neutral-300/40 dark:shadow-black/40">
                  <Image
                    src={book.coverBack}
                    alt={`${book.title} — back cover`}
                    fill
                    className="object-cover"
                    sizes="176px"
                  />
                </div>
              </div>
              <div className="px-5 pb-6 md:px-6 md:pb-8">
                <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                  {book.title}
                </h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {book.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border bg-neutral-100/80 px-2.5 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800/50 dark:text-neutral-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
                  {book.description}
                </p>
                <div className="mt-6">
                  <Button asChild>
                    <a
                      href={book.purchaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Buy on Amazon
                      <ExternalLink className="ml-2 size-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-10" />

        <div className="text-center">
          <p className="text-neutral-600 dark:text-neutral-400">
            Interested in bulk orders or speaking about these topics?
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </article>
    </PageContainer>
  );
}
