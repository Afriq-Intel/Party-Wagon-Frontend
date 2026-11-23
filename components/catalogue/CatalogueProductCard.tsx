"use client";

import { useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Plus } from "lucide-react";
import type { CatalogueProduct } from "@/types/catalogue";
import { useCart } from "@/lib/cart/cart-context";
import {
  cartLineKey,
  getCataloguePriceLabel,
  getDefaultVariant,
  getVariantOptionSummary,
  productHasMultipleVariants,
  resolveVariantImage,
} from "@/lib/catalogue/variants";
import { StarRating } from "@/components/ui/StarRating";

type CatalogueProductCardProps = {
  product: CatalogueProduct;
};

export function CatalogueProductCard({ product }: CatalogueProductCardProps) {
  const { addItem, recentlyAddedId } = useCart();
  const [localAdded, setLocalAdded] = useState(false);
  const hasDiscount = Boolean(product.discountLabel);
  const hasMultiple = productHasMultipleVariants(product);
  const defaultVariant = getDefaultVariant(product);
  const priceLabel = getCataloguePriceLabel(product);
  const optionsSummary = getVariantOptionSummary(product);
  const lineKey = cartLineKey(product.id, defaultVariant.id);
  const added = localAdded || recentlyAddedId === lineKey;

  function handleAddToCart(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (!defaultVariant.inStock) return;

    addItem({
      productId: product.id,
      variantId: defaultVariant.id,
      variantName: defaultVariant.name,
      slug: product.slug,
      name: product.name,
      image: resolveVariantImage(product, defaultVariant),
      priceGhs: defaultVariant.priceGhs,
      priceLabel: defaultVariant.priceLabel,
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

          {!product.inStock ? (
            <span className="absolute right-3 top-3 rounded-md bg-midnight-party/85 px-2.5 py-1 font-outfit text-[11px] font-semibold uppercase tracking-wide text-white">
              Out of stock
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-1.5 px-3.5 pb-3 sm:px-4">
          <p className="font-outfit text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-lagoon">
            {product.brand}
            <span className="mx-1.5 text-midnight-party/25">·</span>
            {product.categoryName}
          </p>
          <h3 className="line-clamp-2 font-outfit text-sm font-semibold leading-snug text-midnight-party transition group-hover:text-lilac-luster sm:text-[0.95rem]">
            {product.name}
          </h3>
          <StarRating rating={product.rating} size={12} />
          <div className="mt-1 flex flex-wrap items-baseline gap-2">
            <p className="font-outfit text-sm font-bold text-midnight-party sm:text-base">
              {priceLabel}
            </p>
            {hasDiscount && product.compareAtPriceLabel ? (
              <p className="font-outfit text-xs text-midnight-party/45 line-through sm:text-sm">
                {product.compareAtPriceLabel}
              </p>
            ) : null}
          </div>
          {optionsSummary ? (
            <p className="font-outfit text-[11px] font-medium text-midnight-party/55">
              {optionsSummary}
            </p>
          ) : null}
        </div>
      </Link>

      <div className="px-3.5 pb-3.5 sm:px-4 sm:pb-4">
        {hasMultiple ? (
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
            disabled={!product.inStock || !defaultVariant.inStock}
            aria-label={
              added
                ? `${product.name} added to cart`
                : `Add ${product.name} to cart`
            }
            className={`inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 font-outfit text-sm font-semibold transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
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
