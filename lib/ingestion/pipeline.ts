import { randomUUID } from "crypto";
import { fetchFeed } from "./rss-fetcher";
import { normalizeItem } from "./normalizer";
import { isDuplicate, markAsSeen } from "./deduplication";
import { enrichItem } from "./ai-services";
import { createArticle, fetchCategories, fetchActiveFeedSources } from "./sanity-writer";
import {
  ensureTables,
  createIngestionRun,
  completeIngestionRun,
  logIngestionItem,
} from "@/lib/db/queries";
import type {
  FeedSource,
  IngestionResult,
  PipelineResult,
  SanityCategory,
} from "./types";

const MAX_ITEMS_PER_FEED = 15;
const CONCURRENCY = 5;

async function runWithConcurrency<T>(
  items: T[],
  fn: (item: T) => Promise<void>,
  limit: number,
): Promise<void> {
  const queue = [...items];
  const workers = Array.from({ length: Math.min(limit, queue.length) }, async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      if (item) await fn(item);
    }
  });
  await Promise.all(workers);
}

async function processFeed(
  source: FeedSource,
  categories: SanityCategory[],
): Promise<IngestionResult> {
  const runId = randomUUID();
  const result: IngestionResult = {
    runId,
    feedUrl: source.url,
    itemsFetched: 0,
    itemsNew: 0,
    itemsDuplicate: 0,
    itemsErrored: 0,
    errors: [],
  };

  await createIngestionRun(runId, source.url);

  try {
    const rawItems = (await fetchFeed(source)).slice(0, MAX_ITEMS_PER_FEED);
    result.itemsFetched = rawItems.length;

    await runWithConcurrency(
      rawItems,
      async (raw) => {
        try {
          const normalized = normalizeItem(raw);

          if (await isDuplicate(normalized)) {
            result.itemsDuplicate++;
            await logIngestionItem(runId, {
              title: normalized.title,
              sourceUrl: normalized.sourceUrl,
              status: "duplicate",
            });
            return;
          }

          const enriched = await enrichItem(normalized, categories);
          const sanityId = await createArticle(enriched);
          await markAsSeen(normalized);

          result.itemsNew++;
          await logIngestionItem(runId, {
            title: normalized.title,
            sourceUrl: normalized.sourceUrl,
            status: "created",
            sanityDocumentId: sanityId,
          });
        } catch (itemError) {
          result.itemsErrored++;
          const msg =
            itemError instanceof Error ? itemError.message : "Unknown error";
          result.errors.push(`[${raw.title}] ${msg}`);
          await logIngestionItem(runId, {
            title: raw.title,
            sourceUrl: raw.link,
            status: "error",
            errorMessage: msg,
          });
        }
      },
      CONCURRENCY,
    );

    await completeIngestionRun(runId, {
      ...result,
      status: "completed",
    });
  } catch (feedError) {
    const msg =
      feedError instanceof Error ? feedError.message : "Unknown error";
    result.errors.push(`Feed error: ${msg}`);
    await completeIngestionRun(runId, {
      ...result,
      status: "failed",
      errorMessage: msg,
    });
  }

  return result;
}

export async function runPipeline(): Promise<PipelineResult> {
  const startedAt = new Date().toISOString();

  await ensureTables();

  const [categories, feedSources] = await Promise.all([
    fetchCategories(),
    fetchActiveFeedSources(),
  ]);

  if (feedSources.length === 0) {
    return {
      startedAt,
      completedAt: new Date().toISOString(),
      feeds: [],
      totalNew: 0,
      totalDuplicate: 0,
      totalErrored: 0,
    };
  }

  const feedResults = await Promise.allSettled(
    feedSources.map((source: FeedSource) => processFeed(source, categories)),
  );

  const results: IngestionResult[] = feedResults.map((r, i) => {
    if (r.status === "fulfilled") return r.value;
    return {
      runId: "error",
      feedUrl: feedSources[i].url,
      itemsFetched: 0,
      itemsNew: 0,
      itemsDuplicate: 0,
      itemsErrored: 0,
      errors: [r.reason instanceof Error ? r.reason.message : "Feed failed"],
    };
  });

  const completedAt = new Date().toISOString();

  return {
    startedAt,
    completedAt,
    feeds: results,
    totalNew: results.reduce((sum, f) => sum + f.itemsNew, 0),
    totalDuplicate: results.reduce((sum, f) => sum + f.itemsDuplicate, 0),
    totalErrored: results.reduce((sum, f) => sum + f.itemsErrored, 0),
  };
}
