import type { Metadata } from "next";

import { getPublishedBooks } from "@/lib/books/queries";
import { isSupabaseConfigured } from "@/lib/env";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/shared/page-header";
import { BooksCatalogue } from "@/components/books/books-catalogue";
import { BackendUnavailable } from "@/components/shared/backend-unavailable";

export const metadata: Metadata = buildMetadata({
  title: "Books",
  description:
    "Browse the full catalogue of books on leadership, strategy, business, personal development, adult social care and African opportunity.",
  path: "/books",
});

export default async function BooksPage() {
  const books = await getPublishedBooks();

  return (
    <>
      <PageHeader
        eyebrow="Books"
        title="The full catalogue"
        description="Search, filter by category, and sort the full collection below."
      />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {books.length === 0 && !isSupabaseConfigured() ? (
          <BackendUnavailable
            title="The catalogue isn't connected yet"
            description="No Supabase project is configured, so live books can't be loaded. See the Step 3 setup guide."
          />
        ) : (
          <BooksCatalogue books={books} />
        )}
      </div>
    </>
  );
}
