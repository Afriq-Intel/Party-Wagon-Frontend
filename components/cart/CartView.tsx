"use client";

import { useMemo } from "react";
import { useCart } from "@/lib/cart/cart-context";
import { cartLineKey } from "@/lib/catalogue/variants";
import { CartEmpty } from "@/components/cart/CartEmpty";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CartOrderSummary } from "@/components/cart/CartOrderSummary";

export function CartView() {
  const { items, itemCount, hydrated, setQuantity, removeItem } = useCart();

  const subtotalGhs = useMemo(
    () => items.reduce((sum, line) => sum + line.priceGhs * line.quantity, 0),
    [items],
  );

  if (!hydrated) {
    return (
      <div
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
        aria-busy="true"
        aria-live="polite"
      >
        <div className="h-10 w-48 animate-pulse rounded-lg bg-midnight-party/10" />
        <div className="mt-3 h-5 w-32 animate-pulse rounded bg-midnight-party/8" />
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="h-64 animate-pulse rounded-[1.75rem] bg-midnight-party/5" />
          <div className="h-72 animate-pulse rounded-[1.75rem] bg-midnight-party/5" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <header>
        <p className="font-outfit text-xs font-semibold uppercase tracking-[0.16em] text-blue-lagoon">
          Your wagon
        </p>
        <h1 className="mt-2 font-oswald text-[clamp(2rem,8vw,3rem)] font-bold uppercase leading-tight tracking-wide text-midnight-party">
          Cart
        </h1>
        {items.length > 0 ? (
          <p className="mt-2 font-outfit text-base text-midnight-party/65">
            {itemCount === 1
              ? "1 item ready for checkout"
              : `${itemCount} items ready for checkout`}
          </p>
        ) : null}
      </header>

      {items.length === 0 ? (
        <div className="mt-10">
          <CartEmpty />
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-10 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <section
            aria-label="Cart items"
            className="rounded-[1.75rem] border border-black/10 bg-white px-4 shadow-[8px_8px_0_0_rgba(109,0,255,0.08)] sm:px-6"
          >
            {items.map((line) => (
              <CartLineItem
                key={cartLineKey(line.productId, line.variantId)}
                line={line}
                onSetQuantity={(quantity) =>
                  setQuantity(line.productId, line.variantId, quantity)
                }
                onRemove={() => removeItem(line.productId, line.variantId)}
              />
            ))}
          </section>

          <CartOrderSummary itemCount={itemCount} subtotalGhs={subtotalGhs} />
        </div>
      )}
    </div>
  );
}
