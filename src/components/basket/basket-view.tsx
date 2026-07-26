"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { formatPrice } from "@/lib/format";
import { useBasket } from "@/components/basket/basket-provider";
import { validateDiscountCodeAction } from "@/lib/discounts/actions";
import { createCheckoutSessionAction } from "@/lib/checkout/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";

export function BasketView({ stripeConfigured }: { stripeConfigured: boolean }) {
  const { items, subtotal, removeItem, updateQuantity, isLoading } = useBasket();
  const [pendingItemId, setPendingItemId] = useState<string | null>(null);
  const [discountInput, setDiscountInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    description?: string | null;
    discountAmount: number;
  } | null>(null);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const total = Math.max(subtotal - (appliedDiscount?.discountAmount ?? 0), 0);

  async function handleQuantityChange(itemId: string, quantity: number) {
    setPendingItemId(itemId);
    try {
      await updateQuantity(itemId, quantity);
    } catch (error) {
      toast.error("Couldn't update quantity", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setPendingItemId(null);
    }
  }

  async function handleRemove(itemId: string, title: string) {
    setPendingItemId(itemId);
    try {
      await removeItem(itemId);
      toast.success(`Removed "${title}" from your basket`);
    } catch (error) {
      toast.error("Couldn't remove this item", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setPendingItemId(null);
    }
  }

  async function handleApplyDiscount() {
    setIsApplyingDiscount(true);
    setDiscountError(null);
    try {
      const result = await validateDiscountCodeAction(discountInput, subtotal);
      if (!result.valid) {
        setDiscountError(result.reason ?? "That code isn't valid.");
        setAppliedDiscount(null);
        return;
      }
      setAppliedDiscount({
        code: result.code!,
        description: result.description,
        discountAmount: result.discountAmount ?? 0,
      });
    } finally {
      setIsApplyingDiscount(false);
    }
  }

  async function handleCheckout() {
    setIsCheckingOut(true);
    try {
      await createCheckoutSessionAction(
        appliedDiscount ? { discountCode: appliedDiscount.code } : undefined
      );
      // Redirects to Stripe on success and does not return.
    } catch (error) {
      toast.error("Couldn't start checkout", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
      setIsCheckingOut(false);
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <ShoppingBag
          className="mx-auto size-10 text-muted-foreground/50"
          aria-hidden="true"
        />
        <h2 className="mt-4 font-heading text-xl font-semibold">
          Your basket is empty
        </h2>
        <p className="mt-2 text-muted-foreground">
          Browse the catalogue and add a book to get started.
        </p>
        <Button className="mt-6" render={<Link href="/books" />}>
          Browse Books
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <ul className="space-y-4">
          {items.map((item) => {
            const isPending = pendingItemId === item.id;
            return (
              <li key={item.id}>
                <Card className={isPending ? "opacity-60" : undefined}>
                  <CardContent className="flex gap-4">
                    <Link href={`/books/${item.bookSlug}`} className="w-20 shrink-0 sm:w-24">
                      <ImagePlaceholder
                        label={item.coverImageLabel}
                        aspect="portrait"
                        className="p-2 text-[10px]"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <Link
                          href={`/books/${item.bookSlug}`}
                          className="font-heading text-base font-semibold hover:underline"
                        >
                          {item.bookTitle}
                        </Link>
                        <p className="text-sm text-muted-foreground">{item.formatLabel}</p>
                        <p className="mt-1 text-sm font-medium sm:hidden">
                          {formatPrice(item.unitPrice)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-6 sm:justify-end">
                        <div className="flex items-center rounded-lg border border-border">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="rounded-r-none"
                            disabled={item.quantity <= 1 || isPending}
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            aria-label={`Decrease quantity of ${item.bookTitle}`}
                          >
                            <Minus className="size-3.5" aria-hidden="true" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium" aria-live="polite">
                            {isPending ? (
                              <Loader2 className="mx-auto size-3.5 animate-spin" aria-hidden="true" />
                            ) : (
                              item.quantity
                            )}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="rounded-l-none"
                            disabled={isPending}
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            aria-label={`Increase quantity of ${item.bookTitle}`}
                          >
                            <Plus className="size-3.5" aria-hidden="true" />
                          </Button>
                        </div>

                        <p className="hidden w-20 text-right font-heading text-base font-semibold sm:block">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </p>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={isPending}
                          onClick={() => handleRemove(item.id, item.bookTitle)}
                          aria-label={`Remove ${item.bookTitle} from basket`}
                        >
                          <Trash2 className="size-4 text-muted-foreground" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>

        <div>
          <Card>
            <CardContent>
              <h2 className="font-heading text-lg font-semibold">Order summary</h2>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                {appliedDiscount ? (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Discount ({appliedDiscount.code})
                    </span>
                    <span className="font-medium">
                      -{formatPrice(appliedDiscount.discountAmount)}
                    </span>
                  </div>
                ) : null}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-muted-foreground">Calculated at checkout</span>
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="discount-code" className="text-xs text-muted-foreground">
                  Discount code
                </Label>
                <div className="mt-1.5 flex gap-2">
                  <Input
                    id="discount-code"
                    placeholder="Enter code"
                    value={discountInput}
                    onChange={(e) => setDiscountInput(e.target.value)}
                    disabled={isApplyingDiscount}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleApplyDiscount}
                    disabled={isApplyingDiscount || discountInput.trim().length === 0}
                    aria-label={isApplyingDiscount ? "Applying discount code…" : undefined}
                  >
                    {isApplyingDiscount ? (
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    ) : (
                      "Apply"
                    )}
                  </Button>
                </div>
                {discountError ? (
                  <p className="mt-1.5 text-xs text-destructive">{discountError}</p>
                ) : null}
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <span className="font-semibold">Estimated total</span>
                <span className="font-heading text-lg font-semibold">
                  {formatPrice(total)}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Excludes shipping and tax, calculated at checkout.
              </p>

              <Button
                size="lg"
                className="mt-6 w-full"
                onClick={handleCheckout}
                disabled={isCheckingOut || !stripeConfigured}
                aria-label={isCheckingOut ? "Starting checkout…" : undefined}
              >
                {isCheckingOut ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  "Checkout"
                )}
              </Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                {stripeConfigured
                  ? "You'll be taken to Stripe's secure checkout."
                  : "Checkout is temporarily unavailable. Please check back soon."}
              </p>
            </CardContent>
          </Card>

          <Button
            variant="outline"
            className="mt-4 w-full"
            render={<Link href="/books" />}
          >
            Continue shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
