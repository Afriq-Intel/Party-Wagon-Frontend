"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type {
  CatalogueCategory,
  CatalogueFilters,
  CatalogueProduct,
} from "@/types/catalogue";
import {
  DEFAULT_CATALOGUE_FILTERS,
  filterAndSortProducts,
  parseOptionalNumber,
  parseSortParam,
} from "@/lib/catalogue/filter-catalogue";
import { CatalogueCategoryNav } from "@/components/catalogue/CatalogueCategoryNav";
import { CatalogueFiltersBar } from "@/components/catalogue/CatalogueFilters";
import { CatalogueProductGrid } from "@/components/catalogue/CatalogueProductGrid";
import { DEMO_CATALOGUE_NOTICE } from "@/lib/data/catalogue-demo";

type CatalogueBrowserProps = {
  categories: CatalogueCategory[];
  products: CatalogueProduct[];
  brands: string[];
  priceBounds: { min: number; max: number };
  source: "demo" | "api";
};

function filtersFromParams(params: URLSearchParams): CatalogueFilters {
  return {
    query: params.get("q") ?? "",
    category: params.get("category"),
    brand: params.get("brand"),
    minPrice: parseOptionalNumber(params.get("min")),
    maxPrice: parseOptionalNumber(params.get("max")),
    sort: parseSortParam(params.get("sort")),
  };
}

function filtersToParams(filters: CatalogueFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set("q", filters.query.trim());
  if (filters.category) params.set("category", filters.category);
  if (filters.brand) params.set("brand", filters.brand);
  if (filters.minPrice != null) params.set("min", String(filters.minPrice));
  if (filters.maxPrice != null) params.set("max", String(filters.maxPrice));
  if (filters.sort !== "popularity") params.set("sort", filters.sort);
  return params;
}

export function CatalogueBrowser({
  categories,
  products,
  brands,
  priceBounds,
  source,
}: CatalogueBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [filters, setFilters] = useState<CatalogueFilters>(() =>
    filtersFromParams(searchParams),
  );
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  useEffect(() => {
    setFilters(filtersFromParams(searchParams));
  }, [searchParams]);

  const syncUrl = useCallback(
    (next: CatalogueFilters) => {
      const params = filtersToParams(next);
      const query = params.toString();
      startTransition(() => {
        router.replace(query ? `${pathname}?${query}` : pathname, {
          scroll: false,
        });
      });
    },
    [pathname, router, startTransition],
  );

  const updateFilters = useCallback(
    (partial: Partial<CatalogueFilters>) => {
      const next = { ...filtersRef.current, ...partial };
      setFilters(next);
      syncUrl(next);
    },
    [syncUrl],
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_CATALOGUE_FILTERS);
    syncUrl(DEFAULT_CATALOGUE_FILTERS);
  }, [syncUrl]);

  const visibleProducts = useMemo(
    () => filterAndSortProducts(products, filters),
    [products, filters],
  );

  return (
    <>
      <CatalogueCategoryNav
        categories={categories}
        activeCategory={filters.category}
        onSelect={(slug) => updateFilters({ category: slug })}
      />

      <section
        id="catalogue-products"
        className="scroll-mt-28 bg-white px-4 py-12 sm:px-6 lg:px-8"
        aria-labelledby="catalogue-products-heading"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2
                id="catalogue-products-heading"
                className="font-oswald text-3xl font-bold uppercase tracking-wide text-midnight-party sm:text-4xl"
              >
                Popular Products
              </h2>
              <p className="mt-2 font-outfit text-sm text-midnight-party/70 sm:text-base">
                Stack your cart with drinks and party food for the night.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <CatalogueFiltersBar
              filters={filters}
              brands={brands}
              priceBounds={priceBounds}
              resultCount={visibleProducts.length}
              onChange={updateFilters}
              onReset={resetFilters}
            />
          </div>

          <CatalogueProductGrid
            products={visibleProducts}
            loading={isPending && visibleProducts.length === 0}
          />

          {source === "demo" ? (
            <p className="mt-8 font-outfit text-xs text-midnight-party/50">
              {DEMO_CATALOGUE_NOTICE}
            </p>
          ) : null}
        </div>
      </section>
    </>
  );
}
