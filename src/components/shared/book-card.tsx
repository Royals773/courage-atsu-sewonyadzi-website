"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Star } from "lucide-react";
import { toast } from "sonner";

import type { Book } from "@/lib/content/types";
import { formatPrice } from "@/lib/format";
import { useBasket } from "@/components/basket/basket-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CmsImage } from "@/components/shared/cms-image";

export function BookCard({ book }: { book: Book }) {
  const { addItem } = useBasket();
  const [isAdding, setIsAdding] = useState(false);
  const lowestPrice = Math.min(...book.formats.map((f) => f.price));
  const defaultFormat =
    book.formats.find((f) => f.stockStatus !== "out-of-stock") ?? book.formats[0];
  const soldOut = !defaultFormat || defaultFormat.stockStatus === "out-of-stock";

  async function handleAddToBasket() {
    if (!defaultFormat) return;
    setIsAdding(true);
    try {
      await addItem(defaultFormat.id, 1);
      toast.success(`Added "${book.title}" to your basket`, {
        description: defaultFormat.label,
      });
    } catch (error) {
      toast.error("Couldn't add this to your basket", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <Card className="h-full">
      <Link href={`/books/${book.slug}`} className="block px-4 pt-4">
        <CmsImage
          src={book.coverImageUrl}
          alt={book.coverImageLabel}
          aspect="portrait"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        />
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
          disabled={soldOut || isAdding}
          onClick={handleAddToBasket}
          aria-label={isAdding ? `Adding ${book.title} to basket…` : undefined}
        >
          {isAdding ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : soldOut ? (
            "Out of Stock"
          ) : (
            "Add to Basket"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
