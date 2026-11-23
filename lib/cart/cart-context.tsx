"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { cartLineKey } from "@/lib/catalogue/variants";

export type CartLine = {
  productId: string;
  /** Purchasable variant / SKU id — required so pack sizes stay distinct. */
  variantId: string;
  /** Display label for the selected option, e.g. "750ml". */
  variantName: string;
  slug: string;
  name: string;
  image: string;
  priceGhs: number;
  priceLabel: string;
  quantity: number;
};

type CartContextValue = {
  items: CartLine[];
  itemCount: number;
  addItem: (item: Omit<CartLine, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  clearCart: () => void;
  /** Line key (`productId::variantId`) of the most recently added item. */
  recentlyAddedId: string | null;
};

/** Bumped when cart line shape gained variant fields. */
const STORAGE_KEY = "party-wagon-cart-v2";

const CartContext = createContext<CartContextValue | null>(null);

function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const line = value as Record<string, unknown>;
  return (
    typeof line.productId === "string" &&
    typeof line.variantId === "string" &&
    typeof line.variantName === "string" &&
    typeof line.slug === "string" &&
    typeof line.name === "string" &&
    typeof line.image === "string" &&
    typeof line.priceGhs === "number" &&
    typeof line.priceLabel === "string" &&
    typeof line.quantity === "number"
  );
}

function readStoredCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCartLine);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  useEffect(() => {
    setItems(readStoredCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback(
    (item: Omit<CartLine, "quantity">, quantity = 1) => {
      const key = cartLineKey(item.productId, item.variantId);
      setItems((prev) => {
        const existing = prev.find(
          (line) =>
            line.productId === item.productId &&
            line.variantId === item.variantId,
        );
        if (existing) {
          return prev.map((line) =>
            line.productId === item.productId &&
            line.variantId === item.variantId
              ? { ...line, quantity: line.quantity + quantity }
              : line,
          );
        }
        return [...prev, { ...item, quantity }];
      });
      setRecentlyAddedId(key);
      window.setTimeout(() => {
        setRecentlyAddedId((current) => (current === key ? null : current));
      }, 1600);
    },
    [],
  );

  const removeItem = useCallback((productId: string, variantId?: string) => {
    setItems((prev) =>
      prev.filter((line) => {
        if (line.productId !== productId) return true;
        if (variantId == null) return false;
        return line.variantId !== variantId;
      }),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = useMemo(
    () => items.reduce((sum, line) => sum + line.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      addItem,
      removeItem,
      clearCart,
      recentlyAddedId,
    }),
    [items, itemCount, addItem, removeItem, clearCart, recentlyAddedId],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
