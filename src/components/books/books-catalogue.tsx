"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import type { Book, BookCategory } from "@/lib/content/types";
import { bookCategories, bookCategoryLabels } from "@/lib/content/book-categories";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookCard } from "@/components/shared/book-card";

type SortKey = "newest" | "popular" | "price-asc" | "price-desc";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

function lowestPrice(book: Book) {
  return Math.min(...book.formats.map((f) => f.price));
}

export function BooksCatalogue({ books }: { books: Book[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<BookCategory | "all">("all");
  const [sort, setSort] = useState<SortKey>("newest");

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = books.filter((book) => {
      const matchesCategory = category === "all" || book.categories.includes(category);
      const matchesSearch =
        query.length === 0 ||
        book.title.toLowerCase().includes(query) ||
        book.subtitle.toLowerCase().includes(query) ||
        book.description.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });

    const sorted = [...filtered];
    switch (sort) {
      case "newest":
        sorted.sort((a, b) => (a.publicationDate < b.publicationDate ? 1 : -1));
        break;
      case "popular":
        sorted.sort((a, b) => b.popularityScore - a.popularityScore);
        break;
      case "price-asc":
        sorted.sort((a, b) => lowestPrice(a) - lowestPrice(b));
        break;
      case "price-desc":
        sorted.sort((a, b) => lowestPrice(b) - lowestPrice(a));
        break;
    }
    return sorted;
  }, [books, search, category, sort]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search books…"
            aria-label="Search books"
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-muted-foreground" aria-hidden="true" />
          <Select value={sort} onValueChange={(value) => setSort(value as SortKey)}>
            <SelectTrigger aria-label="Sort books" className="w-48">
              <SelectValue placeholder="Sort by">
                {(value: SortKey) =>
                  sortOptions.find((option) => option.value === value)?.label ?? "Sort by"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Category filters">
        <Badge
          variant={category === "all" ? "default" : "secondary"}
          className="cursor-pointer select-none"
          render={
            <button
              type="button"
              aria-pressed={category === "all"}
              onClick={() => setCategory("all")}
            />
          }
        >
          All Books
        </Badge>
        {bookCategories.map((cat) => (
          <Badge
            key={cat}
            variant={category === cat ? "default" : "secondary"}
            className="cursor-pointer select-none"
            render={
              <button
                type="button"
                aria-pressed={category === cat}
                onClick={() => setCategory(cat)}
              />
            }
          >
            {bookCategoryLabels[cat]}
          </Badge>
        ))}
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"} found
      </p>

      {filteredBooks.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-dashed border-border py-16 text-center">
          <p className="font-heading text-lg font-semibold">No books match your search</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a different keyword or clear the category filter.
          </p>
        </div>
      )}
    </div>
  );
}
