import type { Metadata } from "next";

import { books } from "@/lib/content/books";
import { PageHeader } from "@/components/shared/page-header";
import { BookCard } from "@/components/shared/book-card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Books",
  description:
    "Browse the full catalogue of books on leadership, business, personal development, care quality and African opportunity.",
};

const categoryLabels: Record<string, string> = {
  all: "All Books",
  leadership: "Leadership",
  business: "Business",
  "personal-development": "Personal Development",
  "care-quality": "Care Quality",
  entrepreneurship: "Entrepreneurship",
  "africa-investment": "Africa & Investment",
};

export default function BooksPage() {
  return (
    <>
      <PageHeader
        eyebrow="Books"
        title="The full catalogue"
        description="Filtering, sorting and search-as-you-type arrive in Phase 2 alongside the basket and checkout. For now, browse the full collection below."
      />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2" aria-label="Category filters (coming in Phase 2)">
          {Object.values(categoryLabels).map((label) => (
            <Badge
              key={label}
              variant={label === "All Books" ? "default" : "secondary"}
              className="cursor-not-allowed opacity-70"
              title="Filtering arrives in Phase 2"
            >
              {label}
            </Badge>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </>
  );
}
