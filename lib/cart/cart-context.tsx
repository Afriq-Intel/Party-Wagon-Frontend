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
  /** False until localStorage cart has been read on the client. */
  hydrated: boolean;
  addItem: (item: Omit<CartLine, "quantity">, quantity?: number) => void;
  /** Set line quantity; quantity below 1 removes the line. */
  setQuantity: (
    productId: string,
    variantId: string,
    quantity: number,
  ) => void;
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
    Number.isFinite(line.priceGhs) &&
    line.priceGhs >= 0 &&
    typeof line.priceLabel === "string" &&
    typeof line.quantity === "number" &&
    Number.isFinite(line.quantity) &&
    line.quantity >= 1
  );
}

function sanitizeCartLines(lines: CartLine[]): CartLine[] {
  return lines.map((line) => ({
    ...line,
    priceGhs: Math.max(0, line.priceGhs),
    quantity: Math.max(1, Math.floor(line.quantity)),
  }));
}

function readStoredCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return sanitizeCartLines(parsed.filter(isCartLine));
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
      const qty = Math.max(1, Math.floor(quantity));
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
              ? { ...line, quantity: line.quantity + qty }
              : line,
          );
        }
        return [
          ...prev,
          {
            ...item,
            priceGhs: Math.max(0, item.priceGhs),
            quantity: qty,
          },
        ];
      });
      setRecentlyAddedId(key);
      window.setTimeout(() => {
        setRecentlyAddedId((current) => (current === key ? null : current));
      }, 1600);
    },
    [],
  );

  const setQuantity = useCallback(
    (productId: string, variantId: string, quantity: number) => {
      const next = Math.floor(quantity);
      if (!Number.isFinite(next) || next < 1) {
        setItems((prev) =>
          prev.filter(
            (line) =>
              !(line.productId === productId && line.variantId === variantId),
          ),
        );
        return;
      }
      setItems((prev) =>
        prev.map((line) =>
          line.productId === productId && line.variantId === variantId
            ? { ...line, quantity: next }
            : line,
        ),
      );
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
      hydrated,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
      recentlyAddedId,
    }),
    [
      items,
      itemCount,
      hydrated,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
      recentlyAddedId,
    ],
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
