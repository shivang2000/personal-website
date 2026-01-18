import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "outline";
  pulse?: boolean;
  className?: string;
}

/**
 * Editorial badge component for status indicators like "Available for Hire"
 */
export function Badge({ children, variant = "default", pulse = false, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
        {
          // Default - subtle background
          "bg-secondary text-secondary-foreground": variant === "default",
          // Accent - amber highlight
          "bg-accent/15 text-accent-foreground border border-accent/30": variant === "accent",
          // Outline - bordered
          "border border-border bg-transparent text-foreground": variant === "outline",
        },
        className,
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
        </span>
      )}
      {children}
    </span>
  );
}
