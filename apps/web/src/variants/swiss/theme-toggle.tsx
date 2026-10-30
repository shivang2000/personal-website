"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * Text toggle in keeping with the page: no icon, the label names the mode
 * you'll switch to. Before hydration the theme is unknown, so the button
 * reserves its width invisibly instead of guessing and flipping.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";
  const next = isDark ? "light" : "dark";

  return (
    <button
      type="button"
      className={className}
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} mode`}
      style={mounted ? undefined : { visibility: "hidden" }}
    >
      {isDark ? "Light" : "Dark"}
    </button>
  );
}
