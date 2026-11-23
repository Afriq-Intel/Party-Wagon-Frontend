"use client";

import { useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Check } from "lucide-react";
import type { ProductItem } from "@/types/homepage";
import { StarRating } from "@/components/ui/StarRating";
import { useCart } from "@/lib/cart/cart-context";

type ProductCardProps = {
  product: ProductItem;
};

function parsePriceGhs(priceLabel: string): number {
  const digits = priceLabel.replace(/[^\d.]/g, "");
  const value = Number(digits);
  return Number.isFinite(value) ? value : 0;
}

/**
 * Homepage best-seller card. Uses a synthetic default variant id until
 * homepage items are sourced from the catalogue (with real variants).
 */
export function ProductCard({ product }: ProductCardProps) {
  const { addItem, recentlyAddedId } = useCart();
  const [localAdded, setLocalAdded] = useState(false);
  const hasDiscount = Boolean(product.discountLabel);
  const defaultVariantId = `${product.id}-default`;
  const lineKey = `${product.id}::${defaultVariantId}`;
  const added = localAdded || recentlyAddedId === lineKey;
  const hasMultipleHint = /^From\s/i.test(product.priceLabel);

  function handleAddToCart(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    addItem({
      productId: product.id,
      variantId: defaultVariantId,
      variantName: "Standard",
      slug: product.slug,
      name: product.name,
      image: product.image,
      priceGhs: parsePriceGhs(product.priceLabel),
      priceLabel: product.priceLabel.replace(/^GHC\b/i, "GHS"),
    });
    setLocalAdded(true);
    window.setTimeout(() => setLocalAdded(false), 1600);
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white transition duration-300 hover:-translate-y-1.5 hover:border-lilac-luster/35 hover:shadow-[8px_8px_0_0_rgba(109,0,255,0.16)] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <Link
        href={`/catalogue/${product.slug}`}
        className="relative flex flex-1 flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
      >
        <div className="relative m-3 overflow-hidden rounded-xl bg-[#f3eef2] sm:m-3.5">
          <div className="relative aspect-[3/4] w-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              quality={92}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 320px"
              className="object-cover object-[center_30%] transition duration-500 ease-out group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-midnight-party/30 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
          </div>

          {hasDiscount && product.discountLabel ? (
            <span className="absolute left-3 top-3 rounded-md bg-radiant-rose px-2.5 py-1 font-outfit text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm">
              {product.discountLabel}
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-1.5 px-3.5 pb-3 sm:px-4">
          <p className="font-outfit text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-lagoon">
            {product.category}
          </p>
          <h3 className="line-clamp-2 font-outfit text-sm font-semibold leading-snug text-midnight-party transition group-hover:text-lilac-luster sm:text-[0.95rem]">
            {product.name}
          </h3>
          <StarRating rating={product.rating} size={12} />
          <div className="mt-1 flex flex-wrap items-baseline gap-2">
            <p className="font-outfit text-sm font-bold text-midnight-party sm:text-base">
              {product.priceLabel}
            </p>
            {hasDiscount && product.compareAtPriceLabel ? (
              <p className="font-outfit text-xs text-midnight-party/45 line-through sm:text-sm">
                {product.compareAtPriceLabel}
              </p>
            ) : null}
          </div>
        </div>
      </Link>

      <div className="px-3.5 pb-3.5 sm:px-4 sm:pb-4">
        {hasMultipleHint ? (
          <Link
            href={`/catalogue/${product.slug}`}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-midnight-party/20 bg-white px-3 py-2.5 font-outfit text-sm font-semibold text-midnight-party transition duration-200 hover:border-lilac-luster/45 hover:bg-offwhite/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster active:scale-[0.98]"
          >
            Choose options
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            aria-label={
              added ? `${product.name} added to cart` : `Add ${product.name} to cart`
            }
            className={`inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 font-outfit text-sm font-semibold transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster active:scale-[0.98] ${
              added
                ? "bg-blue-lagoon text-white"
                : "bg-midnight-party text-white hover:bg-[#4a1a52] active:bg-[#5c3663]"
            }`}
          >
            {added ? (
              <>
                <Check size={16} aria-hidden="true" strokeWidth={2.5} />
                Added
              </>
            ) : (
              <>
                <Plus size={16} aria-hidden="true" strokeWidth={2.5} />
                Add to Cart
              </>
            )}
          </button>
        )}
      </div>
    </article>
  );
}
