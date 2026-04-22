import { cn } from "@/lib/utils";

/**
 * FWC 2026 wordmark / logo. Simple stacked text with the pitch-green accent
 * on "26" — deliberately minimal so it works inline in navbars and footers.
 */
export function Brand({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: { outer: "h-7 px-2 text-[11px]", accent: "text-[11px]" },
    md: { outer: "h-8 px-2.5 text-xs", accent: "text-sm" },
    lg: { outer: "h-11 px-4 text-sm", accent: "text-lg" },
  }[size];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-card/60 font-semibold uppercase tracking-[0.14em] backdrop-blur",
        sizes.outer,
        className,
      )}
    >
      <SoccerBall className="size-3.5 text-primary" />
      <span>FWC</span>
      <span className={cn("font-bold text-primary", sizes.accent)}>26</span>
    </div>
  );
}

/**
 * Spinner temático: balón que rueda (gira sobre su eje).
 * Usar en lugar de un Loader2 en estados pending.
 */
export function BallSpinner({ className }: { className?: string }) {
  return (
    <SoccerBall
      className={cn(
        "animate-spin [animation-duration:0.9s] motion-reduce:animate-none",
        className,
      )}
    />
  );
}

/** Inline soccer-ball icon (lightweight SVG, no emoji). */
export function SoccerBall({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <circle cx="12" cy="12" r="9.2" />
      <path d="M12 4.5l3.8 2.8-1.5 4.4h-4.6L8.2 7.3 12 4.5z" />
      <path d="M10.2 11.7l1.8 5.6 1.8-5.6" />
      <path d="M3.8 10.2l3 2.2-.7 4.2" />
      <path d="M20.2 10.2l-3 2.2.7 4.2" />
      <path d="M6.1 17.2l2.6-.5" />
      <path d="M17.9 17.2l-2.6-.5" />
    </svg>
  );
}
