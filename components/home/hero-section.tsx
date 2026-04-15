import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="py-14 md:py-20">
      <p className="text-sm font-medium uppercase tracking-widest text-neutral-500">
        James Nicholas Kinney
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
        Cut through the noise.
        <br />
        <span className="text-neutral-400">Know what matters.</span>
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-neutral-400 md:text-xl">
        Daily intelligence on AI, business, policy, and culture — curated and
        framed by a Global Chief AI Officer, bestselling author, and trusted
        voice in enterprise transformation.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link href="/category/business-tech">
            Explore AI & Business
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="border-neutral-700 bg-transparent text-neutral-200 hover:bg-neutral-800 hover:text-white">
          <Link href="/about">
            About James
          </Link>
        </Button>
      </div>
    </section>
  );
}
