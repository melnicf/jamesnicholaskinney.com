import { createHash } from "crypto";
import type { RawFeedItem, NormalizedItem } from "./types";

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function generateContentHash(url: string, title: string): string {
  const input = `${url.toLowerCase().trim()}|${title.toLowerCase().trim()}`;
  return createHash("sha256").update(input).digest("hex");
}

function normalizeDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return new Date().toISOString();
    }
    return date.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

export function normalizeItem(item: RawFeedItem): NormalizedItem {
  const plainContent = stripHtml(item.content || item.contentSnippet);
  const snippet =
    item.contentSnippet?.trim() ||
    plainContent.slice(0, 500) + (plainContent.length > 500 ? "…" : "");

  return {
    title: item.title.trim(),
    sourceUrl: item.link.trim(),
    sourceName: item.feedSource.name,
    content: plainContent,
    snippet,
    publishedAt: normalizeDate(item.pubDate),
    contentHash: generateContentHash(item.link, item.title),
    imageUrl: item.imageUrl,
    feedSource: item.feedSource,
  };
}
