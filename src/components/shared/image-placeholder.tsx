import { ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  label: string;
  className?: string;
  aspect?: "square" | "portrait" | "landscape" | "wide";
}

const aspectClasses: Record<NonNullable<ImagePlaceholderProps["aspect"]>, string> = {
  square: "aspect-square",
  portrait: "aspect-3/4",
  landscape: "aspect-4/3",
  wide: "aspect-16/9",
};

/**
 * Stands in for real photography until it's supplied. Never dress this up
 * as a fake stock photo — it should always read as an intentional
 * placeholder so no one mistakes it for real brand imagery.
 */
export function ImagePlaceholder({
  label,
  className,
  aspect = "landscape",
}: ImagePlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "relative flex flex-col items-center justify-center gap-2.5 overflow-hidden rounded-xl border border-dashed border-border/80 bg-[linear-gradient(135deg,color-mix(in_oklch,var(--muted),transparent_0%)_0%,color-mix(in_oklch,var(--secondary),transparent_20%)_100%)] p-6 text-center",
        aspectClasses[aspect],
        className
      )}
    >
      <div className="flex size-11 items-center justify-center rounded-full bg-background/70 shadow-sm ring-1 ring-foreground/10">
        <ImageIcon className="size-5 text-muted-foreground/70" aria-hidden="true" />
      </div>
      <span className="max-w-[85%] text-xs leading-snug text-muted-foreground/80">{label}</span>
    </div>
  );
}
