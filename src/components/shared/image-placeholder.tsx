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
        "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/60 p-6 text-center",
        aspectClasses[aspect],
        className
      )}
    >
      <ImageIcon className="size-6 text-muted-foreground/70" aria-hidden="true" />
      <span className="text-xs text-muted-foreground/80">{label}</span>
    </div>
  );
}
