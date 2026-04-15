import Link from "next/link";
import { CalendarDays, MapPin, ExternalLink } from "lucide-react";
import { client } from "@/sanity/lib/client";
import { UPCOMING_EVENTS_QUERY } from "@/sanity/lib/queries";

type Event = {
  _id: string;
  title: string;
  slug: string;
  eventDate?: string | null;
  location?: string | null;
  description?: string | null;
  externalUrl?: string | null;
  category?: { title: string; slug: string } | null;
};

function formatEventDate(dateStr: string | null) {
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

export async function UpcomingEvents() {
  const now = new Date().toISOString();
  const events: Event[] = await client.fetch(UPCOMING_EVENTS_QUERY, { now });

  if (events.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
          What&apos;s Coming
        </h3>
        <p className="mt-3 text-sm text-neutral-500">
          No upcoming events scheduled. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
        What&apos;s Coming
      </h3>
      <div className="mt-4 space-y-4">
        {events.map((event) => {
          const Wrapper = event.externalUrl ? "a" : "div";
          const wrapperProps = event.externalUrl
            ? {
                href: event.externalUrl,
                target: "_blank" as const,
                rel: "noopener noreferrer",
              }
            : {};

          return (
            <Wrapper
              key={event._id}
              {...wrapperProps}
              className="group block rounded-md border border-neutral-800 bg-neutral-900/30 p-4 transition-colors hover:border-neutral-700 hover:bg-neutral-800/50"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium leading-snug text-white">
                  {event.title}
                </h4>
                {event.externalUrl && (
                  <ExternalLink className="mt-0.5 size-3.5 shrink-0 text-neutral-500 transition-colors group-hover:text-neutral-300" />
                )}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-400">
                {event.eventDate && (
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="size-3" />
                    {formatEventDate(event.eventDate)}
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
            </Wrapper>
          );
        })}
      </div>
      <Link
        href="/appearances"
        className="mt-4 block text-center text-sm font-medium text-neutral-400 transition-colors hover:text-white"
      >
        View all appearances →
      </Link>
    </div>
  );
}
