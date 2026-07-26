import type { BookCategory } from "./types";

export const bookCategoryLabels: Record<BookCategory, string> = {
  leadership: "Leadership",
  business: "Business",
  "personal-development": "Personal Development",
  "care-quality": "Care Quality",
  entrepreneurship: "Entrepreneurship",
  "africa-investment": "Africa & Investment",
};

export const bookCategories = Object.keys(bookCategoryLabels) as BookCategory[];
