import { Hero } from "@/components/home/hero";
import { CredibilitySection } from "@/components/home/credibility-section";
import { FeaturedBooks } from "@/components/home/featured-books";
import { SpeakingSection } from "@/components/home/speaking-section";
import { SpeakerStats } from "@/components/home/speaker-stats";
import { FeaturedOrganisations } from "@/components/home/featured-organisations";
import { UpcomingEvents } from "@/components/home/upcoming-events";
import { AboutPreview } from "@/components/home/about-preview";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { LatestInsights } from "@/components/home/latest-insights";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { FutureCoursesSection } from "@/components/home/future-courses-section";
import { FinalCta } from "@/components/home/final-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <CredibilitySection />
      <FeaturedBooks />
      <SpeakingSection />
      <SpeakerStats />
      <FeaturedOrganisations />
      <UpcomingEvents />
      <AboutPreview />
      <TestimonialsSection />
      <LatestInsights />
      <NewsletterSection />
      <FutureCoursesSection />
      <FinalCta />
    </>
  );
}
