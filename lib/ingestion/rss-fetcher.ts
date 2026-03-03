import RssParser from "rss-parser";
import type { FeedSource, RawFeedItem } from "./types";

type CustomItem = {
  "media:content"?: { $: { url?: string } };
  "media:thumbnail"?: { $: { url?: string } };
  enclosure?: { url?: string };
};

const parser = new RssParser<Record<string, unknown>, CustomItem>({
  timeout: 15_000,
  headers: {
    "User-Agent": "JNK-Aggregator/1.0",
    Accept: "application/rss+xml, application/xml, text/xml",
  },
  customFields: {
    item: [
      ["media:content", "media:content", { keepArray: false }],
      ["media:thumbnail", "media:thumbnail", { keepArray: false }],
    ],
  },
});

function extractImageUrl(item: CustomItem & Record<string, unknown>): string | undefined {
  const mediaContent = item["media:content"]?.$ ?.url;
  if (mediaContent) return mediaContent;

  const mediaThumbnail = item["media:thumbnail"]?.$?.url;
  if (mediaThumbnail) return mediaThumbnail;

  const enclosureUrl = item.enclosure?.url;
  if (enclosureUrl && typeof enclosureUrl === "string" && /\.(jpe?g|png|webp|gif)/i.test(enclosureUrl)) {
    return enclosureUrl;
  }

  const content = (item["content:encoded"] ?? item.content ?? "") as string;
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch?.[1]) return imgMatch[1];

  return undefined;
}

export async function fetchFeed(source: FeedSource): Promise<RawFeedItem[]> {
  const feed = await parser.parseURL(source.url);

  return (feed.items ?? []).map((item) => ({
    title: item.title?.trim() ?? "Untitled",
    link: item.link ?? "",
    content: (item as Record<string, unknown>)["content:encoded"] as string ?? item.content ?? "",
    contentSnippet: item.contentSnippet ?? "",
    pubDate: item.pubDate ?? item.isoDate ?? new Date().toISOString(),
    creator: item.creator ?? (item as Record<string, unknown>)["dc:creator"] as string ?? undefined,
    categories: item.categories ?? [],
    imageUrl: extractImageUrl(item as CustomItem & Record<string, unknown>),
    feedSource: source,
  }));
}
