import { PageContainer } from "@/components/page-container";
import { HeroSection } from "@/components/home/hero-section";
import { LatestStories } from "@/components/home/latest-stories";
import { CategoryHighlights } from "@/components/home/category-highlights";
import { FeaturedTake } from "@/components/home/featured-take";
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
  jobTitle: "Author, Speaker & Commentator",
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
      <FeaturedTake />
      <LatestStories />
      <CategoryHighlights />
      <VideoEmbedSection />
      <PromoCallouts />
    </PageContainer>
  );
}
