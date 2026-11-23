"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Minus, Plus } from "lucide-react";
import type { CatalogueProduct } from "@/types/catalogue";
import { useCart } from "@/lib/cart/cart-context";
import {
  cartLineKey,
  getDefaultVariant,
  getVariantById,
  productHasMultipleVariants,
  resolveVariantImage,
} from "@/lib/catalogue/variants";
import { StarRating } from "@/components/ui/StarRating";
import { VariantSelector } from "@/components/catalogue/VariantSelector";

type ProductDetailProps = {
  product: CatalogueProduct;
};

export function ProductDetail({ product }: ProductDetailProps) {
  const { addItem, recentlyAddedId } = useCart();
  const defaultVariant = useMemo(() => getDefaultVariant(product), [product]);
  const [selectedVariantId, setSelectedVariantId] = useState(defaultVariant.id);
  const [quantity, setQuantity] = useState(1);
  const [localAdded, setLocalAdded] = useState(false);

  const selectedVariant =
    getVariantById(product, selectedVariantId) ?? defaultVariant;
  const displayImage = resolveVariantImage(product, selectedVariant);
  const hasMultiple = productHasMultipleVariants(product);
  const lineKey = cartLineKey(product.id, selectedVariant.id);
  const added = localAdded || recentlyAddedId === lineKey;
  const hasDiscount = Boolean(product.discountLabel);
  const canAdd = selectedVariant.inStock;

  function handleSelectVariant(variantId: string) {
    setSelectedVariantId(variantId);
    setQuantity(1);
  }

  function handleAdd() {
    if (!canAdd) return;
    addItem(
      {
        productId: product.id,
        variantId: selectedVariant.id,
        variantName: selectedVariant.name,
        slug: product.slug,
        name: product.name,
        image: displayImage,
        priceGhs: selectedVariant.priceGhs,
        priceLabel: selectedVariant.priceLabel,
      },
      quantity,
    );
    setLocalAdded(true);
    window.setTimeout(() => setLocalAdded(false), 1600);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Link
        href="/catalogue"
        className="mb-8 inline-flex items-center gap-2 font-outfit text-sm font-semibold text-lilac-luster transition hover:text-midnight-party focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to catalogue
      </Link>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-black/10 bg-[#f3eef2] shadow-[10px_10px_0_0_rgba(109,0,255,0.12)]">
          <div className="relative aspect-square w-full sm:aspect-[4/5]">
            <Image
              src={displayImage}
              alt={
                hasMultiple
                  ? `${product.name}: ${selectedVariant.name}`
                  : product.name
              }
              fill
              priority
              quality={92}
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="object-cover object-[center_30%]"
            />
          </div>
          {hasDiscount && product.discountLabel ? (
            <span className="absolute left-4 top-4 rounded-md bg-radiant-rose px-3 py-1.5 font-outfit text-xs font-semibold uppercase tracking-wide text-white">
              {product.discountLabel}
            </span>
          ) : null}
        </div>

        <div>
          <p className="font-outfit text-xs font-semibold uppercase tracking-[0.16em] text-blue-lagoon">
            {product.brand}
            <span className="mx-2 text-midnight-party/25">·</span>
            {product.categoryName}
          </p>
          <h1 className="mt-3 font-oswald text-4xl font-bold uppercase leading-tight tracking-wide text-midnight-party sm:text-5xl">
            {product.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <StarRating rating={product.rating} size={16} />
            <span
              className={`inline-flex items-center gap-1.5 font-outfit text-sm font-semibold ${
                selectedVariant.inStock ? "text-blue-lagoon" : "text-radiant-rose"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  selectedVariant.inStock ? "bg-blue-lagoon" : "bg-radiant-rose"
                }`}
                aria-hidden="true"
              />
              {selectedVariant.inStock ? "In Stock" : "Out of Stock"}
            </span>
            {product.ageRestricted ? (
              <span className="rounded-full bg-midnight-party/8 px-2.5 py-1 font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/70">
                18+
              </span>
            ) : null}
          </div>

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <p className="font-outfit text-3xl font-bold text-midnight-party">
              {selectedVariant.priceLabel}
            </p>
            {hasDiscount && product.compareAtPriceLabel ? (
              <p className="font-outfit text-lg text-midnight-party/45 line-through">
                {product.compareAtPriceLabel}
              </p>
            ) : null}
          </div>

          <p className="mt-6 max-w-xl font-outfit text-base leading-relaxed text-midnight-party/80">
            {product.description}
          </p>

          <VariantSelector
            variants={product.variants}
            selectedId={selectedVariant.id}
            onSelect={handleSelectVariant}
            label="Choose option"
          />

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div
              className="inline-flex items-stretch overflow-hidden rounded-lg border border-black/15"
              role="group"
              aria-label="Quantity"
            >
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-3 text-midnight-party transition hover:bg-offwhite focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
              >
                <Minus size={16} aria-hidden="true" />
              </button>
              <span className="flex min-w-[3rem] items-center justify-center border-x border-black/15 px-3 font-outfit text-sm font-semibold">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-3 text-midnight-party transition hover:bg-offwhite focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
              >
                <Plus size={16} aria-hidden="true" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={!canAdd}
              className={`inline-flex min-w-[12rem] flex-1 items-center justify-center gap-2 rounded-lg px-5 py-3.5 font-outfit text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none ${
                added
                  ? "bg-blue-lagoon text-white"
                  : "bg-midnight-party text-white hover:bg-[#4a1a52]"
              }`}
            >
              {added ? (
                <>
                  <Check size={18} aria-hidden="true" strokeWidth={2.5} />
                  Added to cart
                </>
              ) : (
                <>
                  <Plus size={18} aria-hidden="true" strokeWidth={2.5} />
                  Add to Cart
                </>
              )}
            </button>
          </div>

          <div className="mt-10 rounded-2xl border border-black/10 bg-offwhite/40 p-5">
            <h2 className="font-oswald text-lg font-semibold uppercase tracking-wide text-midnight-party">
              Details
            </h2>
            <dl className="mt-3 grid gap-2 font-outfit text-sm text-midnight-party/80 sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-midnight-party">Brand</dt>
                <dd>{product.brand}</dd>
              </div>
              <div>
                <dt className="font-semibold text-midnight-party">Category</dt>
                <dd>{product.categoryName}</dd>
              </div>
              <div>
                <dt className="font-semibold text-midnight-party">Selected</dt>
                <dd>{selectedVariant.name}</dd>
              </div>
              {selectedVariant.sku ? (
                <div>
                  <dt className="font-semibold text-midnight-party">SKU</dt>
                  <dd>{selectedVariant.sku}</dd>
                </div>
              ) : null}
              <div>
                <dt className="font-semibold text-midnight-party">Availability</dt>
                <dd>
                  {selectedVariant.inStock
                    ? "In stock"
                    : "Currently unavailable"}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-midnight-party">Age check</dt>
                <dd>{product.ageRestricted ? "18+ required" : "All ages"}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
