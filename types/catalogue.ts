/**
 * Catalogue domain types shaped for the future backend catalogue module.
 * Demo fixtures implement these shapes so the UI can swap data sources later.
 *
 * Backend reference (Prisma `product_variants`): id, sku, variant_name,
 * attributes, pack_size, is_active — pricing/stock are not yet on the schema.
 * Frontend variant fields below include demo price/stock until the API contract
 * exposes them.
 */

export type CatalogueCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  accent: "lemon" | "rose" | "lilac" | "teal" | "midnight" | "offwhite";
};

/**
 * Purchasable SKU under a parent product.
 * Aligns with backend `product_variants` naming where possible.
 */
export type CatalogueProductVariant = {
  id: string;
  /** Display label, e.g. "750ml", "6-pack", "Serves 8–10". */
  name: string;
  priceGhs: number;
  priceLabel: string;
  inStock: boolean;
  /** Optional SKU matching backend `sku` when available. */
  sku?: string;
  /** Optional pack size matching backend `pack_size`. */
  packSize?: string;
  /** Optional variant-specific image; falls back to product image. */
  image?: string;
};

export type CatalogueProduct = {
  id: string;
  name: string;
  slug: string;
  image: string;
  brand: string;
  categorySlug: string;
  categoryName: string;
  /**
   * Starting / filter price — typically the lowest in-stock variant.
   * Prefer reading `variants` for the selected SKU on detail/cart.
   */
  priceGhs: number;
  priceLabel: string;
  rating: number;
  /** Relative popularity score for sorting (demo / future analytics). */
  popularity: number;
  /** ISO date string used for "newest" sorting. */
  createdAt: string;
  description: string;
  /** True when at least one variant is in stock. */
  inStock: boolean;
  ageRestricted: boolean;
  /**
   * One or more purchasable variants. Every product has at least one
   * (a single default variant when there are no size/pack options).
   */
  variants: CatalogueProductVariant[];
  discountLabel?: string;
  compareAtPriceLabel?: string;
  compareAtPriceGhs?: number;
};

export type CatalogueSortOption =
  | "popularity"
  | "price-asc"
  | "price-desc"
  | "newest";

export type CatalogueFilters = {
  query: string;
  category: string | null;
  brand: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  sort: CatalogueSortOption;
};

export type CatalogueResponse = {
  source: "demo" | "api";
  categories: CatalogueCategory[];
  products: CatalogueProduct[];
  brands: string[];
  priceBounds: { min: number; max: number };
};
