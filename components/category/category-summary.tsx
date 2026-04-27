import { getStoredCategorySummary } from "@/lib/ai/weekly-summary";

export async function CategorySummary({
  categorySlug,
}: {
  categorySlug: string;
}) {
  const summary = await getStoredCategorySummary(categorySlug);

  if (!summary) return null;

  return (
    <div className="mt-8 rounded-2xl border border-border bg-linear-to-b from-neutral-50/80 to-transparent px-6 py-8 dark:from-neutral-900/50 sm:px-8 sm:py-10">
      <div className="flex items-center gap-3">
        <span className="inline-block size-2 rounded-full bg-primary" />
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          At a glance
        </span>
      </div>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-neutral-800 dark:text-neutral-200 sm:text-xl sm:leading-relaxed">
        {summary}
      </p>
    </div>
  );
}
