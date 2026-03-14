import { cn } from "@/lib/utils";

interface TagProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "filled";
  size?: "sm" | "md";
  className?: string;
}

/**
 * Skill/technology tag component with editorial styling.
 * Features subtle hover lift and border color transition.
 */
export function Tag({ children, variant = "default", size = "md", className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md font-mono font-medium transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-sm",
        {
          // Size variants
          "px-2.5 py-1 text-xs": size === "sm",
          "px-3 py-1.5 text-sm": size === "md",
          // Style variants
          "border border-accent/20 bg-card text-foreground hover:border-accent":
            variant === "default",
          "border border-border bg-transparent text-muted-foreground hover:border-accent hover:text-foreground":
            variant === "outline",
          "bg-primary text-primary-foreground hover:bg-primary/90": variant === "filled",
        },
        className,
      )}
    >
      {children}
    </span>
  );
}
