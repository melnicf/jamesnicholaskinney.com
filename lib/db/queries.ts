import { getDb } from "./client";

let initialized = false;

export async function ensureTables(): Promise<void> {
  const sql = getDb();

  /** Created on every call so new tables ship without requiring a process restart. */
  await sql`
    CREATE TABLE IF NOT EXISTS ai_summaries (
      scope VARCHAR(128) PRIMARY KEY,
      body TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  if (initialized) return;

  await sql`
    CREATE TABLE IF NOT EXISTS content_hashes (
      id SERIAL PRIMARY KEY,
      content_hash VARCHAR(64) NOT NULL UNIQUE,
      source_url TEXT NOT NULL,
      title TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS ingestion_runs (
      id SERIAL PRIMARY KEY,
      run_id UUID NOT NULL UNIQUE,
      feed_url TEXT NOT NULL,
      items_fetched INTEGER DEFAULT 0,
      items_new INTEGER DEFAULT 0,
      items_duplicate INTEGER DEFAULT 0,
      items_errored INTEGER DEFAULT 0,
      started_at TIMESTAMPTZ DEFAULT NOW(),
      completed_at TIMESTAMPTZ,
      status VARCHAR(20) DEFAULT 'running',
      error_message TEXT
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS ingestion_item_logs (
      id SERIAL PRIMARY KEY,
      run_id UUID NOT NULL,
      title TEXT,
      source_url TEXT,
      status VARCHAR(20) NOT NULL,
      error_message TEXT,
      sanity_document_id TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_content_hashes_hash ON content_hashes(content_hash)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_ingestion_runs_run_id ON ingestion_runs(run_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_ingestion_item_logs_run_id ON ingestion_item_logs(run_id)`;

  initialized = true;
}

export async function checkHashExists(hash: string): Promise<boolean> {
  const sql = getDb();
  const rows = await sql`
    SELECT 1 FROM content_hashes WHERE content_hash = ${hash} LIMIT 1
  `;
  return rows.length > 0;
}

export async function insertHash(
  hash: string,
  sourceUrl: string,
  title: string,
): Promise<void> {
  const sql = getDb();
  await sql`
    INSERT INTO content_hashes (content_hash, source_url, title)
    VALUES (${hash}, ${sourceUrl}, ${title})
    ON CONFLICT (content_hash) DO NOTHING
  `;
}

export async function createIngestionRun(
  runId: string,
  feedUrl: string,
): Promise<void> {
  const sql = getDb();
  await sql`
    INSERT INTO ingestion_runs (run_id, feed_url)
    VALUES (${runId}, ${feedUrl})
  `;
}

export async function completeIngestionRun(
  runId: string,
  stats: {
    itemsFetched: number;
    itemsNew: number;
    itemsDuplicate: number;
    itemsErrored: number;
    status: "completed" | "failed";
    errorMessage?: string;
  },
): Promise<void> {
  const sql = getDb();
  await sql`
    UPDATE ingestion_runs
    SET
      items_fetched = ${stats.itemsFetched},
      items_new = ${stats.itemsNew},
      items_duplicate = ${stats.itemsDuplicate},
      items_errored = ${stats.itemsErrored},
      completed_at = NOW(),
      status = ${stats.status},
      error_message = ${stats.errorMessage ?? null}
    WHERE run_id = ${runId}
  `;
}

export async function logIngestionItem(
  runId: string,
  item: {
    title: string;
    sourceUrl: string;
    status: "created" | "duplicate" | "error";
    errorMessage?: string;
    sanityDocumentId?: string;
  },
): Promise<void> {
  const sql = getDb();
  await sql`
    INSERT INTO ingestion_item_logs (run_id, title, source_url, status, error_message, sanity_document_id)
    VALUES (
      ${runId},
      ${item.title},
      ${item.sourceUrl},
      ${item.status},
      ${item.errorMessage ?? null},
      ${item.sanityDocumentId ?? null}
    )
  `;
}

export async function getRecentRuns(limit = 20) {
  const sql = getDb();
  return sql`
    SELECT * FROM ingestion_runs
    ORDER BY started_at DESC
    LIMIT ${limit}
  `;
}

export async function getAiSummary(scope: string): Promise<string | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    await ensureTables();
    const sql = getDb();
    const rows = await sql`
      SELECT body FROM ai_summaries WHERE scope = ${scope} LIMIT 1
    `;
    const row = rows[0] as { body: string } | undefined;
    return row?.body ?? null;
  } catch (e) {
    console.error("getAiSummary failed:", e);
    return null;
  }
}

export async function upsertAiSummary(scope: string, body: string): Promise<void> {
  const sql = getDb();
  await sql`
    INSERT INTO ai_summaries (scope, body, updated_at)
    VALUES (${scope}, ${body}, NOW())
    ON CONFLICT (scope) DO UPDATE SET
      body = EXCLUDED.body,
      updated_at = NOW()
  `;
}

export async function deleteAiSummary(scope: string): Promise<void> {
  const sql = getDb();
  await sql`DELETE FROM ai_summaries WHERE scope = ${scope}`;
}
