import { cn } from "@/lib/utils";

interface QuoteProps {
  children: React.ReactNode;
  attribution?: string;
  align?: "left" | "center";
  className?: string;
}

/** A consistent premium pull-quote treatment, used for philosophy/mission statements and standalone quotes. */
export function Quote({ children, attribution, align = "left", className }: QuoteProps) {
  return (
    <blockquote
      className={cn(
        align === "left" ? "border-l-2 border-gold pl-6" : "mx-auto max-w-2xl text-center",
        className
      )}
    >
      <p className="text-pretty font-heading text-2xl leading-snug font-medium text-foreground/90 italic sm:text-3xl">
        &ldquo;{children}&rdquo;
      </p>
      {attribution ? (
        <footer className="mt-4 text-sm font-medium text-muted-foreground not-italic">
          — {attribution}
        </footer>
      ) : null}
    </blockquote>
  );
}
