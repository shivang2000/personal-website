import { Hero } from "@/components/portfolio/hero";
import { Stats } from "@/components/portfolio/stats";
import { Skills } from "@/components/portfolio/skills";
import { Projects } from "@/components/portfolio/projects";
import { ContactCTA } from "@/components/portfolio/contact-cta";
import { Footer } from "@/components/layout/footer";

/**
 * Portfolio Homepage
 *
 * Editorial Luxury Tech design featuring:
 * - Warm cream background with amber accents
 * - Playfair Display serif headlines
 * - Elegant scroll-triggered animations
 * - Professional, trustworthy aesthetic
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Skills />
      <Projects />
      <ContactCTA />
      <Footer />
    </>
  );
}
