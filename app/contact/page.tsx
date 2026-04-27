import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { client } from "@/sanity/lib/client";
import { PAGE_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { PageContainer } from "@/components/page-container";
import { PortableText } from "@/components/portable-text";
import { ContactForm } from "@/components/contact-form";
import { Separator } from "@/components/ui/separator";
import type { PortableTextBlock } from "@portabletext/types";

type SanityPage = {
  title?: string;
  body?: unknown;
};

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with James Nicholas Kinney — inquiries, booking, and media requests.",
  openGraph: {
    title: "Contact James Nicholas Kinney",
    description:
      "Get in touch with James Nicholas Kinney — inquiries, booking, and media requests.",
    url: "/contact",
  },
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const page: SanityPage | null = await client.fetch(PAGE_BY_SLUG_QUERY, {
    slug: "contact",
  });

  const bodyBlocks =
    page?.body && Array.isArray(page.body) && page.body.length > 0
      ? (page.body as PortableTextBlock[])
      : null;

  return (
    <PageContainer size="narrow" className="py-8 md:py-12">
      <article>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white md:text-4xl">
          {page?.title ?? "Contact"}
        </h1>
        <p className="mt-3 text-neutral-600 dark:text-neutral-400">
          For inquiries, media requests, speaking engagements, and
          collaboration.
        </p>

        <div className="mt-8 flex items-center gap-3 rounded-lg border border-border bg-neutral-50/60 p-5 dark:bg-neutral-900/50">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
            <Mail className="size-5 text-neutral-600 dark:text-neutral-400" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <a
              href="mailto:hello@jamesnicholaskinney.com"
              className="font-medium text-neutral-900 transition-colors hover:text-primary dark:text-white dark:hover:text-neutral-300"
            >
              hello@jamesnicholaskinney.com
            </a>
          </div>
        </div>

        {bodyBlocks && (
          <div className="mt-6">
            <PortableText value={bodyBlocks} />
          </div>
        )}

        <Separator className="my-10" />

        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
          Send a Message
        </h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Fill out the form below and we&apos;ll get back to you.
        </p>
        <div className="mt-6">
          <ContactForm />
        </div>
      </article>
    </PageContainer>
  );
}
