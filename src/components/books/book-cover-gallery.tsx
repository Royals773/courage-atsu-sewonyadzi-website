"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { CmsImage } from "@/components/shared/cms-image";

export function BookCoverGallery({
  coverLabel,
  coverUrl,
  galleryLabels,
  galleryUrls,
}: {
  coverLabel: string;
  coverUrl: string | null;
  galleryLabels: string[];
  galleryUrls: (string | null)[];
}) {
  const images = [
    { label: coverLabel, url: coverUrl },
    ...galleryLabels.map((label, i) => ({ label, url: galleryUrls[i] ?? null })),
  ];
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  return (
    <div>
      <CmsImage src={active.url} alt={active.label} aspect="portrait" priority sizes="(min-width: 1024px) 380px, 90vw" />
      {images.length > 1 ? (
        <div className="mt-3 grid grid-cols-3 gap-3" role="tablist" aria-label="Book cover gallery">
          {images.map((image, index) => (
            <button
              key={image.label}
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "rounded-lg outline-none ring-offset-2 transition-all focus-visible:ring-2 focus-visible:ring-ring",
                activeIndex === index
                  ? "ring-2 ring-gold"
                  : "opacity-70 hover:opacity-100"
              )}
            >
              <CmsImage src={image.url} alt={image.label} aspect="square" className="p-3" sizes="120px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
