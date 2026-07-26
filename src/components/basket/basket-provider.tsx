"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { BasketLineItem } from "@/lib/basket/types";
import {
  addItemAction,
  getBasketSnapshot,
  removeItemAction,
  updateQuantityAction,
} from "@/lib/basket/actions";

interface BasketContextValue {
  items: BasketLineItem[];
  itemCount: number;
  subtotal: number;
  isLoading: boolean;
  addItem: (bookFormatId: string, quantity?: number) => Promise<void>;
  updateQuantity: (basketItemId: string, quantity: number) => Promise<void>;
  removeItem: (basketItemId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const BasketContext = createContext<BasketContextValue | null>(null);

/**
 * Basket state now lives in Supabase (baskets/basket_items), not
 * localStorage — see src/lib/basket/actions.ts. This provider just caches
 * the current snapshot in memory for a snappy UI and re-syncs it after
 * every mutation and once on mount.
 */
export function BasketProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<BasketLineItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const snapshot = await getBasketSnapshot();
    setItems(snapshot.items);
    setSubtotal(snapshot.subtotal);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const snapshot = await getBasketSnapshot();
        if (cancelled) return;
        setItems(snapshot.items);
        setSubtotal(snapshot.subtotal);
      } catch (error) {
        console.error("Failed to load basket:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const addItem = useCallback(async (bookFormatId: string, quantity: number = 1) => {
    const snapshot = await addItemAction(bookFormatId, quantity);
    setItems(snapshot.items);
    setSubtotal(snapshot.subtotal);
  }, []);

  const updateQuantity = useCallback(async (basketItemId: string, quantity: number) => {
    const snapshot = await updateQuantityAction(basketItemId, quantity);
    setItems(snapshot.items);
    setSubtotal(snapshot.subtotal);
  }, []);

  const removeItem = useCallback(async (basketItemId: string) => {
    const snapshot = await removeItemAction(basketItemId);
    setItems(snapshot.items);
    setSubtotal(snapshot.subtotal);
  }, []);

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      isLoading,
      addItem,
      updateQuantity,
      removeItem,
      refresh,
    }),
    [items, itemCount, subtotal, isLoading, addItem, updateQuantity, removeItem, refresh]
  );

  return (
    <BasketContext.Provider value={value}>{children}</BasketContext.Provider>
  );
}

export function useBasket() {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error("useBasket must be used within a BasketProvider");
  }
  return context;
}
