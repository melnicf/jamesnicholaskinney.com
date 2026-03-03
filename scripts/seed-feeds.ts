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

const CATEGORIES: Record<string, string> = {
  "business-tech": "138afca7-9cb7-4684-88bb-3aa515372133",
  "politics-policy": "ba19f30e-f981-4a0a-a8a8-bd700b480910",
  "sports-entertainment": "fa25a876-6ce7-4b18-809e-e24ed7ca6008",
  "arts-culture": "1bffaa7e-9436-43ea-9593-7805dbe928f5",
};

const feeds = [
  // Business & Tech
  { name: "NYT Business", url: "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml", cat: "business-tech" },
  { name: "NYT Technology", url: "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml", cat: "business-tech" },
  { name: "TechCrunch", url: "https://techcrunch.com/feed/", cat: "business-tech" },
  // Politics & Policy
  { name: "NYT Politics", url: "https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml", cat: "politics-policy" },
  { name: "Politico", url: "https://rss.politico.com/politics-news.xml", cat: "politics-policy" },
  { name: "The Hill", url: "https://thehill.com/news/feed/", cat: "politics-policy" },
  // Sports & Entertainment
  { name: "ESPN", url: "https://www.espn.com/espn/rss/news", cat: "sports-entertainment" },
  { name: "NYT Sports", url: "https://rss.nytimes.com/services/xml/rss/nyt/Sports.xml", cat: "sports-entertainment" },
  // Arts & Culture
  { name: "NYT Arts", url: "https://rss.nytimes.com/services/xml/rss/nyt/Arts.xml", cat: "arts-culture" },
  { name: "BBC Entertainment & Arts", url: "https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml", cat: "arts-culture" },
  { name: "Guardian Culture", url: "https://www.theguardian.com/uk/culture/rss", cat: "arts-culture" },
];

async function seed() {
  console.log(`Seeding ${feeds.length} feed sources...`);

  for (const feed of feeds) {
    const doc = await client.create({
      _type: "feedSource" as const,
      name: feed.name,
      url: feed.url,
      active: true,
      category: {
        _type: "reference" as const,
        _ref: CATEGORIES[feed.cat],
      },
    });
    console.log(`  Created: ${feed.name} (${doc._id})`);
  }

  console.log("Done!");
}

seed().catch(console.error);
