/**
 * Upserts upcoming event documents in Sanity.
 *
 * Requires .env.local: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN
 *
 * Run: pnpm sanity:sync-events
 */
import { createClient } from "next-sanity";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
});

type SeedEvent = {
  title: string;
  startDate: string;
  endDate?: string;
  location: string;
  description: string;
  externalUrl?: string;
};

const EVENTS: SeedEvent[] = [
  {
    title: "The Aspen Ideas Festival",
    startDate: "2026-06-25",
    endDate: "2026-07-01",
    location: "Aspen, CO",
    description: "Scheduled appearance at the Aspen Ideas Festival.",
  },
  {
    title: "World Business Forum",
    startDate: "2026-11-04",
    endDate: "2026-11-05",
    location: "New York, NY",
    description: "Scheduled appearance at the World Business Forum.",
  },
  {
    title: "Consumer Electronics Show",
    startDate: "2027-01-06",
    endDate: "2027-01-09",
    location: "Las Vegas, NV",
    description: "Scheduled appearance at CES.",
  },
  {
    title: "World Economic Forum",
    startDate: "2027-01-20",
    endDate: "2027-01-24",
    location: "Davos, Switzerland",
    description: "Scheduled appearance at the World Economic Forum.",
  },
  {
    title: "Munich Security Conference",
    startDate: "2027-02-12",
    endDate: "2027-02-14",
    location: "Munich, Germany",
    description: "Scheduled appearance at the Munich Security Conference.",
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96);
}

function toSanityDateTime(date: string) {
  // Use noon UTC so the rendered date stays stable across time zones.
  return `${date}T12:00:00.000Z`;
}

async function upsertEvent(event: SeedEvent) {
  const slug = slugify(event.title);
  const existing = await client.fetch<{ _id: string } | null>(
    `*[_type == "event" && slug.current == $slug][0]{ _id }`,
    { slug },
  );

  const fields = {
    title: event.title,
    slug: { _type: "slug" as const, current: slug },
    eventDate: toSanityDateTime(event.startDate),
    ...(event.endDate && { endDate: toSanityDateTime(event.endDate) }),
    location: event.location,
    description: event.description,
    ...(event.externalUrl && { externalUrl: event.externalUrl }),
  };

  if (existing?._id) {
    await client.patch(existing._id).set(fields).commit();
    console.log(`Updated ${event.title}`);
    return;
  }

  await client.create({
    _type: "event",
    ...fields,
  });
  console.log(`Created ${event.title}`);
}

async function main() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    throw new Error("SANITY_API_WRITE_TOKEN is not set (.env.local)");
  }

  for (const event of EVENTS) {
    await upsertEvent(event);
  }

  console.log(`Upserted ${EVENTS.length} events`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
