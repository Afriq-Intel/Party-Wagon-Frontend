"use client";

import { useState } from "react";
import type { CatalogueFilters, CatalogueSortOption } from "@/types/catalogue";
import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";

type CatalogueFiltersProps = {
  filters: CatalogueFilters;
  brands: string[];
  priceBounds: { min: number; max: number };
  resultCount: number;
  onChange: (next: Partial<CatalogueFilters>) => void;
  onReset: () => void;
};

const SORT_OPTIONS: { value: CatalogueSortOption; label: string }[] = [
  { value: "popularity", label: "Popularity" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

export function CatalogueFiltersBar({
  filters,
  brands,
  priceBounds,
  resultCount,
  onChange,
  onReset,
}: CatalogueFiltersProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const hasActiveFilters =
    Boolean(filters.query.trim()) ||
    Boolean(filters.category) ||
    Boolean(filters.brand) ||
    filters.minPrice != null ||
    filters.maxPrice != null ||
    filters.sort !== "popularity";

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-[0_10px_30px_rgba(51,16,56,0.05)] sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal
            size={18}
            className="text-lilac-luster"
            aria-hidden="true"
          />
          <h2 className="font-oswald text-xl font-semibold uppercase tracking-wide text-midnight-party">
            Search &amp; Filters
          </h2>
        </div>
        <p className="font-outfit text-sm text-midnight-party/65" aria-live="polite">
          {resultCount} {resultCount === 1 ? "product" : "products"}
        </p>
      </div>

      <div className="relative">
        <label htmlFor="catalogue-search" className="sr-only">
          Search products by name
        </label>
        <Search
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-midnight-party/45"
          aria-hidden="true"
        />
        <input
          id="catalogue-search"
          type="search"
          value={filters.query}
          onChange={(event) => onChange({ query: event.target.value })}
          placeholder="Search by name, brand…"
          className="w-full rounded-xl border border-black/10 bg-[#faf7f9] py-2.5 pl-10 pr-3 font-outfit text-sm text-midnight-party placeholder:text-midnight-party/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
        />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 md:hidden">
        <button
          type="button"
          aria-expanded={filtersOpen}
          aria-controls="catalogue-filter-panel"
          onClick={() => setFiltersOpen((open) => !open)}
          className="inline-flex items-center gap-2 rounded-full border border-midnight-party/15 px-3.5 py-2 font-outfit text-xs font-semibold uppercase tracking-wide text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
        >
          Filters
          {hasActiveFilters ? (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-lilac-luster px-1.5 text-[10px] text-white">
              !
            </span>
          ) : null}
          <ChevronDown
            size={14}
            className={`transition ${filtersOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={onReset}
            className="font-outfit text-sm font-semibold text-lilac-luster underline-offset-4 transition hover:text-midnight-party hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
          >
            Reset
          </button>
        ) : null}
      </div>

      <div
        id="catalogue-filter-panel"
        className={`grid gap-3 md:mt-3 md:grid-cols-2 md:grid-rows-1 xl:grid-cols-5 ${
          filtersOpen ? "mt-3 grid" : "hidden md:grid"
        }`}
      >
        <div>
          <label htmlFor="catalogue-brand" className="sr-only">
            Filter by brand
          </label>
          <select
            id="catalogue-brand"
            value={filters.brand ?? ""}
            onChange={(event) =>
              onChange({ brand: event.target.value || null })
            }
            className="w-full rounded-xl border border-black/10 bg-[#faf7f9] px-3 py-2.5 font-outfit text-sm text-midnight-party focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
          >
            <option value="">All brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="catalogue-min-price" className="sr-only">
            Minimum price in GHS
          </label>
          <input
            id="catalogue-min-price"
            type="number"
            inputMode="decimal"
            min={priceBounds.min}
            max={priceBounds.max}
            value={filters.minPrice ?? ""}
            onChange={(event) =>
              onChange({
                minPrice:
                  event.target.value === ""
                    ? null
                    : Number(event.target.value),
              })
            }
            placeholder={`Min GHS (${priceBounds.min})`}
            className="w-full rounded-xl border border-black/10 bg-[#faf7f9] px-3 py-2.5 font-outfit text-sm text-midnight-party placeholder:text-midnight-party/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
          />
        </div>

        <div>
          <label htmlFor="catalogue-max-price" className="sr-only">
            Maximum price in GHS
          </label>
          <input
            id="catalogue-max-price"
            type="number"
            inputMode="decimal"
            min={priceBounds.min}
            max={priceBounds.max}
            value={filters.maxPrice ?? ""}
            onChange={(event) =>
              onChange({
                maxPrice:
                  event.target.value === ""
                    ? null
                    : Number(event.target.value),
              })
            }
            placeholder={`Max GHS (${priceBounds.max})`}
            className="w-full rounded-xl border border-black/10 bg-[#faf7f9] px-3 py-2.5 font-outfit text-sm text-midnight-party placeholder:text-midnight-party/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
          />
        </div>

        <div className="md:col-span-2 xl:col-span-2">
          <label htmlFor="catalogue-sort" className="sr-only">
            Sort products
          </label>
          <select
            id="catalogue-sort"
            value={filters.sort}
            onChange={(event) =>
              onChange({ sort: event.target.value as CatalogueSortOption })
            }
            className="w-full rounded-xl border border-black/10 bg-[#faf7f9] px-3 py-2.5 font-outfit text-sm text-midnight-party focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                Sort: {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveFilters ? (
        <div className="mt-4 hidden justify-end md:flex">
          <button
            type="button"
            onClick={onReset}
            className="font-outfit text-sm font-semibold text-lilac-luster underline-offset-4 transition hover:text-midnight-party hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
          >
            Reset filters
          </button>
        </div>
      ) : null}
    </div>
  );
}
