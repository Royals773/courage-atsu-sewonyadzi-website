import type { MediaItem } from "./types";

/**
 * Fictional placeholder media appearances (3). Do not present as real
 * press coverage.
 */
export const mediaItems: MediaItem[] = [
  {
    id: "media-1",
    type: "podcast",
    title: "[Placeholder] On Leadership Under Pressure",
    outlet: "Sample Leadership Podcast",
    date: "2026-05-01",
    description: "[Placeholder description of a podcast appearance.]",
    isFictionalPlaceholder: true,
  },
  {
    id: "media-2",
    type: "interview",
    title: "[Placeholder] In Conversation: Care Quality and Culture",
    outlet: "Sample Industry Journal",
    date: "2026-03-18",
    description: "[Placeholder description of an interview feature.]",
    isFictionalPlaceholder: true,
  },
  {
    id: "media-3",
    type: "video",
    title: "[Placeholder] Keynote Highlights Reel",
    outlet: "Sample Conference",
    date: "2025-11-09",
    description: "[Placeholder description of a speaking highlights video.]",
    isFictionalPlaceholder: true,
  },
];
