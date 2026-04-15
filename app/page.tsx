import { PageContainer } from "@/components/page-container";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedArticle } from "@/components/home/featured-article";
import { UpcomingEvents } from "@/components/home/upcoming-events";
import { ThisWeekDigest } from "@/components/home/this-week-digest";
import { LatestStories } from "@/components/home/latest-stories";
import { CategoryHighlights } from "@/components/home/category-highlights";
import { VideoEmbedSection } from "@/components/home/video-embed-section";
import { PromoCallouts } from "@/components/home/promo-callouts";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://jamesnicholaskinney.com";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "James Nicholas Kinney",
  url: SITE_URL,
  description:
    "Daily intelligence on business, technology, politics, and culture — curated and framed by James Nicholas Kinney.",
  publisher: {
    "@type": "Person",
    name: "James Nicholas Kinney",
    url: SITE_URL,
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "James Nicholas Kinney",
  url: SITE_URL,
  jobTitle: "Global Chief AI Officer & Author",
  sameAs: [
    "https://www.linkedin.com/in/jamesnicholaskinney",
    "https://www.youtube.com/@jamesnicholaskinney",
  ],
};

export default function Home() {
  return (
    <PageContainer size="wide" className="py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <HeroSection />
      <ThisWeekDigest />

      {/* Featured article + Upcoming events — side by side on desktop */}
      <section className="py-12">
        <h2 className="text-xl font-semibold text-white">Featured</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          <FeaturedArticle />
          <UpcomingEvents />
        </div>
      </section>

      <LatestStories />
      <VideoEmbedSection />
      <CategoryHighlights />
      <PromoCallouts />
    </PageContainer>
  );
}
