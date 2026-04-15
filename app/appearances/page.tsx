import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, MapPin, ExternalLink } from "lucide-react";
import { client } from "@/sanity/lib/client";
import { ALL_EVENTS_QUERY, PAGE_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { PageContainer } from "@/components/page-container";
import { PortableText } from "@/components/portable-text";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PortableTextBlock } from "@portabletext/types";

type SanityPage = {
  title?: string;
  body?: unknown;
};

type Event = {
  _id: string;
  title: string;
  slug: string;
  eventDate?: string | null;
  endDate?: string | null;
  location?: string | null;
  description?: string | null;
  externalUrl?: string | null;
  category?: { title: string; slug: string } | null;
};

export const metadata: Metadata = {
  title: "Appearances",
  description:
    "Talks, appearances, keynote topics, and booking information for James Nicholas Kinney.",
  openGraph: {
    title: "Appearances — James Nicholas Kinney",
    description:
      "Talks, appearances, keynote topics, and booking information for James Nicholas Kinney.",
    url: "/appearances",
  },
  alternates: { canonical: "/appearances" },
};

function formatDateShort(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return {
      month: d.toLocaleDateString("en-US", { month: "short" }),
      day: d.getUTCDate().toString(),
    };
  } catch {
    return { month: "", day: "" };
  }
}

function formatDateRange(
  startDateStr: string | null,
  endDateStr: string | null,
) {
  if (!startDateStr) return "";

  const fmt = (s: string) =>
    new Date(s).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  if (!endDateStr) return fmt(startDateStr);

  try {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
    const sameMonth = sameYear && start.getUTCMonth() === end.getUTCMonth();

    if (sameMonth) {
      return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${end.toLocaleDateString("en-US", { day: "numeric", year: "numeric" })}`;
    }
    if (sameYear) {
      return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    }
    return `${fmt(startDateStr)} – ${fmt(endDateStr)}`;
  } catch {
    return fmt(startDateStr);
  }
}

function EventCard({ event, isPast }: { event: Event; isPast: boolean }) {
  const dateParts = event.eventDate
    ? formatDateShort(event.eventDate)
    : null;

  const content = (
    <Card
      className={`group h-full border-neutral-800 bg-neutral-900/50 transition-colors hover:border-neutral-700 hover:bg-neutral-900 ${isPast ? "opacity-60 hover:opacity-80" : ""}`}
    >
      <CardContent className="flex gap-4 p-4 md:p-5">
        {dateParts && (
          <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-lg bg-neutral-800 text-center">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              {dateParts.month}
            </span>
            <span className="text-lg font-bold leading-tight text-white">
              {dateParts.day}
            </span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium leading-snug text-white">
              {event.title}
            </h3>
            {event.externalUrl && (
              <ExternalLink className="mt-0.5 size-3.5 shrink-0 text-neutral-500 transition-colors group-hover:text-neutral-300" />
            )}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-400">
            {event.eventDate && (
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="size-3" />
                {formatDateRange(event.eventDate, event.endDate ?? null)}
              </span>
            )}
            {event.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3" />
                {event.location}
              </span>
            )}
          </div>
          {event.description && (
            <p className="mt-2 line-clamp-2 text-sm text-neutral-500">
              {event.description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (event.externalUrl) {
    return (
      <a
        href={event.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {content}
      </a>
    );
  }

  return content;
}

export default async function AppearancesPage() {
  const [page, allEvents]: [SanityPage | null, Event[]] = await Promise.all([
    client.fetch(PAGE_BY_SLUG_QUERY, { slug: "appearances" }),
    client.fetch(ALL_EVENTS_QUERY),
  ]);

  const now = new Date();
  const upcoming = allEvents.filter(
    (e) => e.eventDate && new Date(e.eventDate) >= now,
  );
  const past = allEvents
    .filter((e) => e.eventDate && new Date(e.eventDate) < now)
    .reverse();

  const bodyBlocks =
    page?.body && Array.isArray(page.body) && page.body.length > 0
      ? (page.body as PortableTextBlock[])
      : null;

  return (
    <PageContainer size="wide" className="py-8 md:py-12">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
          {page?.title ?? "Appearances"}
        </h1>
        {bodyBlocks && (
          <div className="mt-6 max-w-2xl">
            <PortableText value={bodyBlocks} />
          </div>
        )}
      </header>

      {upcoming.length > 0 && (
        <section className="mt-10">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-white">Upcoming</h2>
            <Badge variant="secondary" className="border-neutral-700 bg-neutral-800 text-neutral-300">
              {upcoming.length}
            </Badge>
          </div>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event) => (
              <li key={event._id}>
                <EventCard event={event} isPast={false} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {upcoming.length === 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-white">Upcoming</h2>
          <p className="mt-4 text-neutral-500">
            No upcoming events scheduled. Check back soon.
          </p>
        </section>
      )}

      <div className="mt-10">
        <Button asChild>
          <Link href="/contact">Inquire about booking</Link>
        </Button>
      </div>

      {past.length > 0 && (
        <section className="mt-14">
          <h2 className="text-lg font-semibold text-neutral-400">Past</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((event) => (
              <li key={event._id}>
                <EventCard event={event} isPast={true} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </PageContainer>
  );
}
