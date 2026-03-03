export interface FeedSource {
  _id: string;
  name: string;
  url: string;
  active: boolean;
  defaultCategoryId: string | null;
}

export interface RawFeedItem {
  title: string;
  link: string;
  content: string;
  contentSnippet: string;
  pubDate: string;
  creator?: string;
  categories?: string[];
  imageUrl?: string;
  feedSource: FeedSource;
}

export interface NormalizedItem {
  title: string;
  sourceUrl: string;
  sourceName: string;
  content: string;
  snippet: string;
  publishedAt: string;
  contentHash: string;
  imageUrl?: string;
  feedSource: FeedSource;
}

export interface EnrichedItem extends NormalizedItem {
  excerpt: string;
  categoryId: string | null;
}

export interface IngestionResult {
  runId: string;
  feedUrl: string;
  itemsFetched: number;
  itemsNew: number;
  itemsDuplicate: number;
  itemsErrored: number;
  errors: string[];
}

export interface PipelineResult {
  startedAt: string;
  completedAt: string;
  feeds: IngestionResult[];
  totalNew: number;
  totalDuplicate: number;
  totalErrored: number;
}

export interface SanityCategory {
  _id: string;
  title: string;
  slug: string;
}
