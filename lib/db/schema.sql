CREATE TABLE IF NOT EXISTS content_hashes (
  id SERIAL PRIMARY KEY,
  content_hash VARCHAR(64) NOT NULL UNIQUE,
  source_url TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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
);

CREATE TABLE IF NOT EXISTS ingestion_item_logs (
  id SERIAL PRIMARY KEY,
  run_id UUID NOT NULL,
  title TEXT,
  source_url TEXT,
  status VARCHAR(20) NOT NULL,
  error_message TEXT,
  sanity_document_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_hashes_hash ON content_hashes(content_hash);
CREATE INDEX IF NOT EXISTS idx_ingestion_runs_run_id ON ingestion_runs(run_id);
CREATE INDEX IF NOT EXISTS idx_ingestion_item_logs_run_id ON ingestion_item_logs(run_id);
