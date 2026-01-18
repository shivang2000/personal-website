import { personalInfo, socialLinks } from "@/lib/data/portfolio-data";
import { Github, Linkedin, Mail } from "lucide-react";

const iconMap = {
  mail: Mail,
  linkedin: Linkedin,
  github: Github,
};

/**
 * Site footer with copyright, social links, and navigation.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50 py-12">
      <div className="container mx-auto max-w-5xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Copyright */}
          <div className="text-sm text-muted-foreground">
            <span className="font-serif font-medium text-foreground">{personalInfo.name}</span>
            <span className="mx-2">•</span>
            <span>&copy; {currentYear}</span>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => {
              const Icon = iconMap[link.icon as keyof typeof iconMap];
              return (
                <a
                  key={link.name}
                  href={link.href}
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={link.name}
                >
                  {Icon && <Icon className="h-5 w-5" />}
                </a>
              );
            })}
          </div>

          {/* Built with */}
          <div className="text-xs text-muted-foreground">
            Built with{" "}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Next.js
            </a>{" "}
            &{" "}
            <a
              href="https://tailwindcss.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Tailwind
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
