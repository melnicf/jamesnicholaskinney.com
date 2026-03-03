import { checkHashExists, insertHash } from "@/lib/db/queries";
import type { NormalizedItem } from "./types";

export async function isDuplicate(item: NormalizedItem): Promise<boolean> {
  return checkHashExists(item.contentHash);
}

export async function markAsSeen(item: NormalizedItem): Promise<void> {
  await insertHash(item.contentHash, item.sourceUrl, item.title);
}
