"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ModeToggle } from "./mode-toggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Work" },
  { href: "#contact", label: "Contact" },
] as const;

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isScrolled ? "border-b border-border bg-background/80 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="container mx-auto max-w-5xl px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Name */}
          <Link
            href="/"
            className="font-sans text-xl font-bold tracking-tight text-foreground transition-colors hover:text-accent"
          >
            SC
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="font-mono text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Resume link */}
            <a
              href="https://docs.google.com/document/d/1KeM7MY88dSPeQmXlcjcM-QSd_nDEe7gEx2i1V6WVw6g/edit"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden font-mono text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            >
              Resume
            </a>

            {/* Divider */}
            <div className="hidden h-4 w-px bg-border sm:block" />

            {/* Theme toggle */}
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
