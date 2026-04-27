const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@jamesnicholaskinney";

/**
 * Set a specific video ID here to embed the latest video.
 * When null, shows a CTA linking to the channel.
 */
const YOUTUBE_VIDEO_ID: string | null = null;

export function VideoEmbedSection() {
  return (
    <section className="py-12">
      <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
        Weekly Recap
      </h2>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
        Here&apos;s what mattered this week — video breakdown.
      </p>
      <div className="mt-6 overflow-hidden rounded-lg border border-border bg-neutral-50/60 dark:bg-neutral-900/50">
        {YOUTUBE_VIDEO_ID ? (
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?rel=0`}
              title="Weekly Recap — James Nicholas Kinney"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="size-full"
              loading="lazy"
            />
          </div>
        ) : (
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex aspect-video flex-col items-center justify-center gap-3 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
          >
            <svg
              viewBox="0 0 28 20"
              className="size-12 text-red-500"
              fill="currentColor"
            >
              <path d="M27.4 3.1a3.5 3.5 0 0 0-2.5-2.5C22.7 0 14 0 14 0S5.3 0 3.1.6A3.5 3.5 0 0 0 .6 3.1C0 5.3 0 10 0 10s0 4.7.6 6.9a3.5 3.5 0 0 0 2.5 2.5C5.3 20 14 20 14 20s8.7 0 10.9-.6a3.5 3.5 0 0 0 2.5-2.5C28 14.7 28 10 28 10s0-4.7-.6-6.9ZM11.2 14.3V5.7l7.2 4.3-7.2 4.3Z" />
            </svg>
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Watch on YouTube
            </span>
            <span className="text-xs text-muted-foreground">
              @jamesnicholaskinney
            </span>
          </a>
        )}
      </div>
    </section>
  );
}
