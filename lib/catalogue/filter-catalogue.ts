import type {
  CatalogueFilters,
  CatalogueProduct,
  CatalogueSortOption,
} from "@/types/catalogue";

export const DEFAULT_CATALOGUE_FILTERS: CatalogueFilters = {
  query: "",
  category: null,
  brand: null,
  minPrice: null,
  maxPrice: null,
  sort: "popularity",
};

export function parseSortParam(value: string | null | undefined): CatalogueSortOption {
  switch (value) {
    case "price-asc":
    case "price-desc":
    case "newest":
    case "popularity":
      return value;
    default:
      return "popularity";
  }
}

export function parseOptionalNumber(value: string | null | undefined): number | null {
  if (value == null || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function filterAndSortProducts(
  products: CatalogueProduct[],
  filters: CatalogueFilters,
): CatalogueProduct[] {
  const query = filters.query.trim().toLowerCase();

  const filtered = products.filter((product) => {
    if (filters.category && product.categorySlug !== filters.category) {
      return false;
    }

    if (filters.brand && product.brand !== filters.brand) {
      return false;
    }

    if (filters.minPrice != null && product.priceGhs < filters.minPrice) {
      return false;
    }

    if (filters.maxPrice != null && product.priceGhs > filters.maxPrice) {
      return false;
    }

    if (query) {
      const haystack = `${product.name} ${product.brand} ${product.categoryName}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    return true;
  });

  return [...filtered].sort((a, b) => {
    switch (filters.sort) {
      case "price-asc":
        return a.priceGhs - b.priceGhs;
      case "price-desc":
        return b.priceGhs - a.priceGhs;
      case "newest":
        return Date.parse(b.createdAt) - Date.parse(a.createdAt);
      case "popularity":
      default:
        return b.popularity - a.popularity;
    }
  });
}
