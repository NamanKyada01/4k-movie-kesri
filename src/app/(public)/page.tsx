import { Hero } from "@/components/sections/home/Hero";
import { TrustBar, ThreeDScrollSection } from "@/components/sections/home/ScrollEffects";
import { StatCounters, InfiniteMarquee } from "@/components/sections/home/StatsAndMarquee";
import { ProcessSection } from "@/components/sections/home/Process";
import { ServiceCardsGrid, CarouselShowcase } from "@/components/sections/home/Services";
import { YouTubeEmbedSection, Testimonials } from "@/components/sections/home/MediaTestimonials";
import { CinematicCTA } from "@/components/sections/home/CinematicCTA";

export default function HomePage() {
  return (
    <main className="bg-[#060606] min-h-screen">
      <Hero />
      <ThreeDScrollSection />
      <TrustBar />
      <StatCounters />
      <InfiniteMarquee />
      <ProcessSection />
      <CarouselShowcase />
      <ServiceCardsGrid />
      <YouTubeEmbedSection />
      <Testimonials />
      <CinematicCTA />
    </main>
  );
}