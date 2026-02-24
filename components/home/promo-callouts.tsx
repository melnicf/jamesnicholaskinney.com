import Link from "next/link";
import { BookOpen, Mic2 } from "lucide-react";

export function PromoCallouts() {
  return (
    <section className="py-12">
      <h2 className="sr-only">Get more from James</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/books"
          className="flex items-center gap-4 rounded-lg border border-neutral-800 bg-neutral-900/50 p-6 transition-colors hover:border-neutral-700 hover:bg-neutral-900"
        >
          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-neutral-800">
            <BookOpen className="size-6 text-neutral-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Books</h3>
            <p className="mt-1 text-sm text-neutral-500">
              Published and upcoming titles
            </p>
          </div>
        </Link>
        <Link
          href="/appearances"
          className="flex items-center gap-4 rounded-lg border border-neutral-800 bg-neutral-900/50 p-6 transition-colors hover:border-neutral-700 hover:bg-neutral-900"
        >
          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-neutral-800">
            <Mic2 className="size-6 text-neutral-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Appearances</h3>
            <p className="mt-1 text-sm text-neutral-500">
              Talks, keynotes, and booking
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
}
