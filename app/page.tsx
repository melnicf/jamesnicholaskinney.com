import { PageContainer } from "@/components/page-container";
import { HeroSection } from "@/components/home/hero-section";
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
    "https://www.linkedin.com/in/jameskinney",
    "https://www.instagram.com/jamesnicholaskinney",
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

      <section className="grid items-start gap-8 pt-14 pb-8 md:pt-20 md:pb-10 lg:grid-cols-[1fr_320px] lg:gap-12">
        <HeroSection />
        <div className="lg:pt-6">
          <UpcomingEvents />
        </div>
      </section>

      <ThisWeekDigest />
      <LatestStories />
      <VideoEmbedSection />
      <CategoryHighlights />
      <PromoCallouts />
    </PageContainer>
  );
}
