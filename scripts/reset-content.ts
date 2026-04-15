import { createClient } from "next-sanity";
import { neon } from "@neondatabase/serverless";
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

async function resetSanity() {
  const types = ["article", "event"];

  for (const type of types) {
    const ids: string[] = await client.fetch(
      `*[_type == $type]._id`,
      { type },
    );
    if (ids.length === 0) {
      console.log(`  ${type}: nothing to delete`);
      continue;
    }

    console.log(`  ${type}: deleting ${ids.length} documents...`);
    const tx = client.transaction();
    for (const id of ids) {
      tx.delete(id);
      tx.delete(`drafts.${id}`);
    }
    await tx.commit();
    console.log(`  ${type}: done`);
  }
}

async function resetPostgres() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.log("  DATABASE_URL not set — skipping Postgres reset");
    return;
  }

  const sql = neon(url);
  await sql`TRUNCATE content_hashes, ingestion_runs, ingestion_item_logs, ai_summaries`;
  console.log(
    "  Cleared content_hashes, ingestion_runs, ingestion_item_logs, ai_summaries",
  );
}

async function main() {
  console.log("\n--- Resetting Sanity content ---");
  await resetSanity();

  console.log("\n--- Resetting Postgres dedup tables ---");
  await resetPostgres();

  console.log("\nAll clean. Ready for fresh ingestion.\n");
}

main().catch(console.error);
