"use client";

import type { CatalogueProduct } from "@/types/catalogue";
import { CatalogueProductCard } from "@/components/catalogue/CatalogueProductCard";
import { Reveal } from "@/components/ui/Reveal";

type CatalogueProductGridProps = {
  products: CatalogueProduct[];
  loading?: boolean;
  error?: string | null;
};

export function CatalogueProductGrid({
  products,
  loading = false,
  error = null,
}: CatalogueProductGridProps) {
  if (loading) {
    return (
      <ul
        className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6"
        aria-busy="true"
        aria-label="Loading products"
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <li
            key={index}
            className="animate-pulse rounded-2xl border border-black/5 bg-white p-3"
          >
            <div className="aspect-[3/4] rounded-xl bg-offwhite/80" />
            <div className="mt-3 h-3 w-1/3 rounded bg-offwhite" />
            <div className="mt-2 h-4 w-4/5 rounded bg-offwhite" />
            <div className="mt-3 h-9 rounded-lg bg-offwhite" />
          </li>
        ))}
      </ul>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-radiant-rose/30 bg-radiant-rose/10 px-5 py-10 text-center"
      >
        <p className="font-oswald text-2xl font-semibold uppercase text-midnight-party">
          Something went wrong
        </p>
        <p className="mt-2 font-outfit text-sm text-midnight-party/75">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-midnight-party/25 bg-white px-5 py-14 text-center">
        <p className="font-oswald text-2xl font-semibold uppercase text-midnight-party">
          No party finds yet
        </p>
        <p className="mx-auto mt-2 max-w-md font-outfit text-sm text-midnight-party/70">
          Try another search, clear a filter, or browse a different category.
          we go get am.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
      {products.map((product, index) => (
        <li key={product.id} className="h-full">
          <Reveal delayMs={Math.min(index * 45, 270)} className="h-full">
            <CatalogueProductCard product={product} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
