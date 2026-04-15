import { getMutationClient } from "@/sanity/lib/mutation-client";
import type { EnrichedItem, SanityCategory } from "./types";

const CATEGORIES_QUERY = `*[_type == "category" && defined(slug.current)] {
  _id,
  title,
  "slug": slug.current
}`;

const FEED_SOURCES_QUERY = `*[_type == "feedSource" && active == true] {
  _id,
  name,
  url,
  active,
  "defaultCategoryId": category->_id
}`;

export async function fetchCategories(): Promise<SanityCategory[]> {
  const client = getMutationClient();
  return client.fetch(CATEGORIES_QUERY);
}

export async function fetchActiveFeedSources() {
  const client = getMutationClient();
  return client.fetch(FEED_SOURCES_QUERY);
}

async function uploadImage(
  imageUrl: string,
  filename: string,
): Promise<string | null> {
  try {
    const client = getMutationClient();
    const response = await fetch(imageUrl, {
      headers: { "User-Agent": "JNK-Aggregator/1.0" },
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) return null;

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) return null;

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length < 1000) return null;

    const asset = await client.assets.upload("image", buffer, {
      filename,
      contentType,
    });

    return asset._id;
  } catch {
    return null;
  }
}

export async function createArticle(item: EnrichedItem): Promise<string> {
  const client = getMutationClient();

  const slug = item.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96);

  let imageRef: string | null = null;
  if (item.imageUrl) {
    imageRef = await uploadImage(item.imageUrl, `${slug}.jpg`);
  }

  const doc = {
    _type: "article" as const,
    title: item.title,
    slug: { _type: "slug" as const, current: slug },
    excerpt: item.excerpt,
    contentState: "published",
    sourceUrl: item.sourceUrl,
    sourceName: item.sourceName,
    publishedAt: item.publishedAt,
    ...(item.categoryId && {
      category: {
        _type: "reference" as const,
        _ref: item.categoryId,
      },
    }),
    ...(imageRef && {
      mainImage: {
        _type: "image" as const,
        asset: {
          _type: "reference" as const,
          _ref: imageRef,
        },
        alt: item.title,
      },
    }),
  };

  const result = await client.create(doc);
  return result._id;
}
