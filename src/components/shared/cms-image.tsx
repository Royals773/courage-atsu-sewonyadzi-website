import Image from "next/image";

import { cn } from "@/lib/utils";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";

interface CmsImageProps {
  src: string | null;
  alt: string;
  aspect?: "square" | "portrait" | "landscape" | "wide";
  className?: string;
  sizes?: string;
  priority?: boolean;
}

const aspectClasses: Record<NonNullable<CmsImageProps["aspect"]>, string> = {
  square: "aspect-square",
  portrait: "aspect-3/4",
  landscape: "aspect-4/3",
  wide: "aspect-16/9",
};

/**
 * Renders a real, CMS-uploaded image when `src` is set, falling back to
 * ImagePlaceholder (same aspect ratio) when it isn't — so pages don't need
 * their own conditional per image slot.
 */
export function CmsImage({
  src,
  alt,
  aspect = "landscape",
  className,
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority,
}: CmsImageProps) {
  if (!src) {
    return <ImagePlaceholder label={alt} aspect={aspect} className={className} />;
  }

  return (
    <div className={cn("relative overflow-hidden rounded-lg", aspectClasses[aspect], className)}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}
