import Link from "next/link";

import { getFeaturedBooks } from "@/lib/books/queries";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { BookCard } from "@/components/shared/book-card";
import { Reveal } from "@/components/shared/reveal";

export async function FeaturedBooks() {
  const books = await getFeaturedBooks();

  if (books.length === 0) return null;

  return (
    <section className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Books"
            title="Featured books"
            description="Practical, field-tested writing on leadership, strategy and building organisations that last."
          />
          <Button
            variant="outline"
            className="w-fit"
            render={<Link href="/books" />}
          >
            View all books
          </Button>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book, i) => (
            <Reveal key={book.id} delay={i * 80}>
              <BookCard book={book} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
