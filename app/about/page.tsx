import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { PAGE_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { PageContainer } from "@/components/page-container";
import { PortableText } from "@/components/portable-text";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import type { PortableTextBlock } from "@portabletext/types";

type SanityPage = {
  title?: string;
  body?: unknown;
};

export const metadata: Metadata = {
  title: "About",
  description:
    "James Nicholas Kinney — Global Chief AI Officer, bestselling author, and President of AI For Better. Trusted voice in enterprise AI transformation.",
  openGraph: {
    title: "About James Nicholas Kinney",
    description:
      "Global Chief AI Officer, bestselling author, and President of AI For Better. Trusted voice in enterprise AI transformation.",
    url: "/about",
  },
  alternates: { canonical: "/about" },
};

const CREDENTIALS = [
  "Global Chief AI Officer",
  "President, AI For Better",
  "Bestselling Author",
  "Enterprise AI Strategist",
  "Keynote Speaker",
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
        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
          {page?.title ?? "About James Nicholas Kinney"}
        </h1>

        <div className="mt-4 flex flex-wrap gap-2">
          {CREDENTIALS.map((cred) => (
            <span
              key={cred}
              className="rounded-full border border-neutral-700 bg-neutral-800/50 px-3 py-1 text-sm text-neutral-300"
            >
              {cred}
            </span>
          ))}
        </div>

        {bodyBlocks ? (
          <div className="mt-8">
            <PortableText value={bodyBlocks} />
          </div>
        ) : (
          <div className="mt-8 space-y-5 text-neutral-300 leading-relaxed">
            <p>
              James Nicholas Kinney is a Global Chief AI Officer, bestselling
              author, and one of the most sought-after voices in enterprise AI
              transformation. As President of{" "}
              <strong className="text-white">AI For Better</strong>, he works at
              the intersection of artificial intelligence, business strategy,
              and human impact.
            </p>
            <p>
              With decades of experience leading technology initiatives across
              global enterprises, James brings a unique perspective that bridges
              the gap between technical capability and strategic value. He is
              known for his clear, opinionated analysis that cuts through the
              noise of the AI hype cycle to identify what actually matters for
              business leaders and policymakers.
            </p>
            <p>
              James is the author of{" "}
              <em className="text-white">SustAIning Leadership</em> and{" "}
              <em className="text-white">AI + Mental Health</em>, both of which
              explore the practical and human dimensions of artificial
              intelligence in the modern world.
            </p>
            <p>
              Through this platform, James curates and frames the most important
              developments in AI, business, policy, and culture — providing a
              daily intelligence layer for leaders who need context, not just
              headlines.
            </p>
          </div>
        )}

        <Separator className="my-10 bg-neutral-800" />

        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/books">Read His Books</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-neutral-700 bg-transparent text-neutral-200 hover:bg-neutral-800 hover:text-white"
          >
            <Link href="/appearances">Speaking & Appearances</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-neutral-700 bg-transparent text-neutral-200 hover:bg-neutral-800 hover:text-white"
          >
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </article>
    </PageContainer>
  );
}
