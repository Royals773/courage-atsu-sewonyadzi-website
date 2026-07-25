import Link from "next/link";
import { Star } from "lucide-react";

import type { Book } from "@/lib/content/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(price);
}

export function BookCard({ book }: { book: Book }) {
  const lowestPrice = Math.min(...book.formats.map((f) => f.price));

  return (
    <Card className="h-full">
      <Link href={`/books/${book.slug}`} className="block px-4 pt-4">
        <ImagePlaceholder label={book.coverImageLabel} aspect="portrait" />
      </Link>
      <CardContent className="flex flex-1 flex-col gap-2">
        {book.isNew ? <Badge className="w-fit">New</Badge> : null}
        <Link href={`/books/${book.slug}`}>
          <h3 className="font-heading text-lg font-semibold leading-snug hover:underline">
            {book.title}
          </h3>
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {book.description}
        </p>
        <div className="mt-1 flex items-center gap-1 text-muted-foreground/70">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="size-3.5" aria-hidden="true" />
          ))}
          <span className="ml-1 text-xs">(Rating placeholder)</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {book.formats.map((f) => f.label).join(" · ")}
        </p>
        <p className="font-heading text-lg font-semibold">
          From {formatPrice(lowestPrice)}
        </p>
      </CardContent>
      <CardFooter className="flex gap-2 bg-transparent">
        <Button
          variant="outline"
          className="flex-1"
          render={<Link href={`/books/${book.slug}`} />}
        >
          View Book
        </Button>
        <Button
          className="flex-1"
          render={<Link href={`/books/${book.slug}`} />}
        >
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
}
