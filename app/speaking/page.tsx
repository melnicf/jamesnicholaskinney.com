import { client } from "@/sanity/lib/client";
import { PAGE_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { PageContainer } from "@/components/page-container";
import { PortableText } from "@/components/portable-text";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { PortableTextBlock } from "@portabletext/types";

type SanityPage = {
  title?: string;
  body?: unknown;
};

export default async function SpeakingPage() {
  const page: SanityPage | null = await client.fetch(PAGE_BY_SLUG_QUERY, {
    slug: "speaking",
  });

  const bodyBlocks =
    page?.body && Array.isArray(page.body) && page.body.length > 0
      ? (page.body as PortableTextBlock[])
      : null;

  return (
    <PageContainer size="narrow" className="py-8 md:py-12">
      <article>
        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
          {page?.title ?? "Speaking"}
        </h1>
        {bodyBlocks ? (
          <div className="mt-8">
            <PortableText value={bodyBlocks} />
          </div>
        ) : (
          <p className="mt-6 text-neutral-500">
            Talks, appearances, keynote topics, and booking information.
            Add content in Sanity Studio by creating a page with slug
            &quot;speaking&quot;.
          </p>
        )}
        <div className="mt-10">
          <Button asChild>
            <Link href="/contact">Inquire about booking</Link>
          </Button>
        </div>
      </article>
    </PageContainer>
  );
}
