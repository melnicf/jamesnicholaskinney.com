import Link from "next/link";
import { MapPin, ExternalLink, ArrowRight } from "lucide-react";
import { client } from "@/sanity/lib/client";
import { UPCOMING_EVENTS_QUERY } from "@/sanity/lib/queries";

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

function parseDateParts(dateStr: string) {
  const d = new Date(dateStr);
  return {
    month: d.toLocaleDateString("en-US", { month: "short" }),
    day: d.getUTCDate().toString(),
  };
}

function formatDateRange(start: string | null, end: string | null) {
  if (!start) return "";
  const fmt = (s: string) =>
    new Date(s).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  if (!end) return fmt(start);
  try {
    const s = new Date(start);
    const e = new Date(end);
    const sameYear = s.getUTCFullYear() === e.getUTCFullYear();
    const sameMonth = sameYear && s.getUTCMonth() === e.getUTCMonth();
    if (sameMonth) {
      return `${s.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${e.toLocaleDateString("en-US", { day: "numeric", year: "numeric" })}`;
    }
    if (sameYear) {
      return `${s.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${e.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    }
    return `${fmt(start)} – ${fmt(end)}`;
  } catch {
    return fmt(start);
  }
}

export async function UpcomingEvents() {
  const now = new Date().toISOString();
  const events: Event[] = await client.fetch(UPCOMING_EVENTS_QUERY, { now });

  if (events.length === 0) return null;

  return (
    <div className="flex flex-col rounded-lg border border-border bg-neutral-50/60 dark:bg-neutral-900/40">
      <h3 className="px-5 pt-4 pb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Events Coming Up
      </h3>

      <div className="divide-y divide-border">
        {events.slice(0, 4).map((event) => {
          const dateParts = event.eventDate
            ? parseDateParts(event.eventDate)
            : null;

          const inner = (
            <div className="group flex gap-3.5 px-5 py-3.5 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800/40">
              {dateParts && (
                <div className="flex w-10 shrink-0 flex-col items-center pt-0.5">
                  <span className="text-[10px] font-semibold uppercase leading-none tracking-wider text-muted-foreground">
                    {dateParts.month}
                  </span>
                  <span className="text-xl font-bold leading-tight text-neutral-900 dark:text-white">
                    {dateParts.day}
                  </span>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium leading-snug text-neutral-900 dark:text-white">
                    {event.title}
                  </p>
                  {event.externalUrl && (
                    <ExternalLink className="mt-0.5 size-3 shrink-0 text-neutral-400 transition-colors group-hover:text-neutral-600 dark:text-neutral-600 dark:group-hover:text-neutral-400" />
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px] text-muted-foreground">
                  {event.eventDate && (
                    <span>
                      {formatDateRange(event.eventDate, event.endDate ?? null)}
                    </span>
                  )}
                  {event.location && (
                    <span className="inline-flex items-center gap-0.5">
                      <MapPin className="size-2.5" />
                      {event.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );

          if (event.externalUrl) {
            return (
              <a
                key={event._id}
                href={event.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {inner}
              </a>
            );
          }

          return <div key={event._id}>{inner}</div>;
        })}
      </div>

      <Link
        href="/appearances"
        className="flex items-center justify-center gap-1 border-t border-border px-5 py-3 text-xs font-medium text-muted-foreground transition-colors hover:text-neutral-900 dark:hover:text-white"
      >
        All appearances
        <ArrowRight className="size-3" />
      </Link>
    </div>
  );
}
