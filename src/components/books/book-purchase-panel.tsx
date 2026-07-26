"use client";

import { useState } from "react";
import { Loader2, Minus, Plus } from "lucide-react";
import { toast } from "sonner";

import type { Book } from "@/lib/content/types";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useBasket } from "@/components/basket/basket-provider";
import { createCheckoutSessionAction } from "@/lib/checkout/actions";
import { Button } from "@/components/ui/button";

export function BookPurchasePanel({ book }: { book: Book }) {
  const { addItem } = useBasket();
  const [selectedFormatId, setSelectedFormatId] = useState(
    book.formats.find((f) => f.stockStatus !== "out-of-stock")?.id ?? book.formats[0]?.id
  );
  const [quantity, setQuantity] = useState(1);
  const [pendingAction, setPendingAction] = useState<"add" | "buy" | null>(null);

  const selectedFormat = book.formats.find((f) => f.id === selectedFormatId);
  const isOutOfStock = selectedFormat?.stockStatus === "out-of-stock";
  const isPreorder = selectedFormat?.stockStatus === "preorder";

  async function handleAdd() {
    if (!selectedFormat) return;
    setPendingAction("add");
    try {
      await addItem(selectedFormat.id, quantity);
      toast.success(`Added "${book.title}" to your basket`, {
        description: `${selectedFormat.label} × ${quantity}`,
      });
    } catch (error) {
      toast.error("Couldn't add this to your basket", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setPendingAction(null);
    }
  }

  async function handleBuyNow() {
    if (!selectedFormat) return;
    setPendingAction("buy");
    try {
      await addItem(selectedFormat.id, quantity);
      await createCheckoutSessionAction();
      // createCheckoutSessionAction redirects on success and does not return.
    } catch (error) {
      toast.error("Couldn't start checkout", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
      setPendingAction(null);
    }
  }

  return (
    <div>
      <div className="space-y-3" role="radiogroup" aria-label="Available formats">
        <p className="text-sm font-semibold">Available formats</p>
        {book.formats.map((format) => (
          <button
            key={format.id}
            type="button"
            role="radio"
            aria-checked={selectedFormatId === format.id}
            onClick={() => setSelectedFormatId(format.id)}
            className={cn(
              "flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors",
              selectedFormatId === format.id
                ? "border-primary ring-1 ring-primary"
                : "border-border hover:border-foreground/30"
            )}
          >
            <div>
              <p className="text-sm font-medium">{format.label}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {format.stockStatus.replace("-", " ")}
              </p>
            </div>
            <p className="font-heading text-base font-semibold">
              {formatPrice(format.price)}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <p className="text-sm font-semibold">Quantity</p>
        <div className="flex items-center rounded-lg border border-border">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-r-none"
            disabled={quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            <Minus className="size-4" aria-hidden="true" />
          </Button>
          <span className="w-10 text-center text-sm font-medium" aria-live="polite">
            {quantity}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-l-none"
            disabled={quantity >= 99}
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            aria-label="Increase quantity"
          >
            <Plus className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button
          size="lg"
          className="flex-1"
          disabled={isOutOfStock || pendingAction !== null}
          onClick={handleAdd}
          aria-label={pendingAction === "add" ? "Adding to basket…" : undefined}
        >
          {pendingAction === "add" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : isOutOfStock ? (
            "Out of Stock"
          ) : isPreorder ? (
            "Pre-order"
          ) : (
            "Add to Basket"
          )}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="flex-1"
          disabled={isOutOfStock || pendingAction !== null}
          onClick={handleBuyNow}
          aria-label={pendingAction === "buy" ? "Starting checkout…" : undefined}
        >
          {pendingAction === "buy" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : isPreorder ? (
            "Pre-order Now"
          ) : (
            "Buy Now"
          )}
        </Button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Buy Now takes you straight to secure Stripe checkout with your
        current basket.
      </p>

      {book.hasSampleChapter ? (
        <Button variant="link" className="mt-4 h-auto p-0" disabled>
          Download sample chapter (available after purchase)
        </Button>
      ) : null}
    </div>
  );
}
