import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Fragment } from "react";

import { person } from "@/lib/data/profile";

import s from "./swiss.module.css";

export const mailto = `mailto:${person.email}?subject=${encodeURIComponent("Let's talk about a role")}`;

/** Two-digit index, the way a Swiss sheet numbers its parts. */
export const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Sets a string containing "→" with a drawn arrow (the Archivo latin subset
 * has no arrow glyph), read as "to" by screen readers. `figure` keeps each
 * side of the arrow unbroken, for metric values.
 */
export function Figure({ value, figure = true }: { value: string; figure?: boolean }) {
  const parts = value.split("→").map((part) => part.trim());
  if (parts.length === 1) return <>{value}</>;
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={part}>
          {i > 0 ? (
            <>
              <ArrowRight className={s.figArrow} strokeWidth={figure ? 2.5 : 2} aria-hidden />
              <span className={s.srOnly}> to </span>
            </>
          ) : null}
          {figure ? <span className={s.figPart}>{part}</span> : part}
        </Fragment>
      ))}
    </>
  );
}

/** A grid rule. Static everywhere except the hero, where it draws in once. */
export function Rule({ weight = "hair" }: { weight?: "hair" | "heavy" }) {
  return <span aria-hidden className={`${s.rule} ${weight === "heavy" ? s.ruleHeavy : s.ruleHair}`} />;
}

/** Link whose text underlines and whose arrow sits apart at a fixed gap. */
export function ArrowLink({
  href,
  className,
  external = false,
  children,
}: {
  href: string;
  className?: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  const Icon = external ? ArrowUpRight : ArrowRight;
  return (
    <a
      href={href}
      className={className ? `${s.arrowLink} ${className}` : s.arrowLink}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span className={s.linkText}>{children}</span>
      <Icon className={s.linkIcon} strokeWidth={2} aria-hidden />
      {external ? <span className={s.srOnly}> (opens in a new tab)</span> : null}
    </a>
  );
}

/** Anchor id for a role row, e.g. "Wow Rooms" → "role-wow-rooms". */
export const roleId = (company: string) => `role-${company.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
