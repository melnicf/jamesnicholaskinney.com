import { PageContainer } from "@/components/page-container";
import { HeroSection } from "@/components/home/hero-section";
import { LatestStories } from "@/components/home/latest-stories";
import { CategoryHighlights } from "@/components/home/category-highlights";
import { FeaturedTake } from "@/components/home/featured-take";
import { VideoEmbedSection } from "@/components/home/video-embed-section";
import { PromoCallouts } from "@/components/home/promo-callouts";

export default function Home() {
  return (
    <PageContainer size="wide" className="py-8 md:py-12">
      <HeroSection />
      <FeaturedTake />
      <LatestStories />
      <CategoryHighlights />
      <VideoEmbedSection />
      <PromoCallouts />
    </PageContainer>
  );
}
