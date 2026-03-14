import { Hero } from "@/components/portfolio/hero";
import { Stats } from "@/components/portfolio/stats";
import { Skills } from "@/components/portfolio/skills";
import { Projects } from "@/components/portfolio/projects";
import { ContactCTA } from "@/components/portfolio/contact-cta";
import { Footer } from "@/components/layout/footer";

/**
 * Portfolio Homepage
 *
 * Dark & Techy design featuring:
 * - Deep blue-black background with neon green accents
 * - Sora sans-serif + JetBrains Mono terminal typography
 * - GSAP scroll-triggered animations + Lenis smooth scroll
 * - Developer-focused, high-signal aesthetic
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
