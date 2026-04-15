/**
 * Upserts the About page (`slug: about`) in Sanity from lib/content/about-portable-text.ts.
 *
 * Requires .env.local: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN
 *
 * Run: pnpm sanity:sync-about
 */
import { createClient } from "next-sanity";
import * as dotenv from "dotenv";
import { resolve } from "path";
import { ABOUT_PAGE_BODY } from "../lib/content/about-portable-text";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
});

async function main() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    throw new Error("SANITY_API_WRITE_TOKEN is not set (.env.local)");
  }

  const existing = await client.fetch<{ _id: string } | null>(
    `*[_type == "page" && slug.current == $slug][0]{ _id }`,
    { slug: "about" },
  );

  const fields = {
    title: "About James Nicholas Kinney",
    slug: { _type: "slug" as const, current: "about" },
    body: ABOUT_PAGE_BODY,
  };

  if (existing?._id) {
    await client.patch(existing._id).set(fields).commit();
    console.log(`Updated Sanity page ${existing._id} (slug: about)`);
  } else {
    const created = await client.create({
      _type: "page",
      ...fields,
    });
    console.log(`Created Sanity page ${created._id} (slug: about)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
