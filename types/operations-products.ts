/**
 * Operations Products & Catalogue types.
 * Shaped for a future Operations products API — not live backend contracts yet.
 */

export type OperationsProductStatus = "published" | "draft" | "inactive";

/** Product category name — matches an Operations catalogue category name. */
export type OperationsProductCategory = string;

export type OperationsCategoryStatus = "active" | "inactive";

export type OperationsAgeRestriction = "none" | "18+" | "21+";

export type OperationsCatalogueCategory = {
  id: string;
  name: string;
  description: string;
  image: string;
  status: OperationsCategoryStatus;
  /** ISO date string for last update. */
  updatedAt: string;
};

export type OperationsCategoryFilters = {
  search: string;
  status: OperationsCategoryStatus | "all";
};

export type OperationsCategoryInput = {
  name: string;
  description: string;
  image: string;
  status: OperationsCategoryStatus;
};

export type OperationsProductImage = {
  id: string;
  url: string;
  isPrimary: boolean;
};

export type OperationsProductUom =
  | "unit"
  | "bottle"
  | "can"
  | "pack"
  | "case"
  | "platter";

export type OperationsProductVariant = {
  id: string;
  /** Variant name / size label (e.g. Single, Twin pack). */
  label: string;
  sku: string;
  /** Units per pack. */
  packSize: number;
  /** Unit of measure for pack/pricing display. */
  uom: OperationsProductUom;
  priceGhs: number;
  status: OperationsProductStatus;
};

export const OPERATIONS_PRODUCT_UOMS: OperationsProductUom[] = [
  "unit",
  "bottle",
  "can",
  "pack",
  "case",
  "platter",
];

export type OperationsProduct = {
  id: string;
  name: string;
  description: string;
  brand: string;
  sku: string;
  category: OperationsProductCategory;
  ageRestriction: OperationsAgeRestriction;
  tags: string[];
  /** Display price in GHS (major units) — typically the primary/base variant. */
  priceGhs: number;
  variantsCount: number;
  variants: OperationsProductVariant[];
  status: OperationsProductStatus;
  images: OperationsProductImage[];
  /** Convenience primary image URL for catalogue thumbnails. */
  image: string;
  /** ISO date string for last update. */
  updatedAt: string;
};

export type OperationsProductFilters = {
  search: string;
  category: string | "all";
  status: OperationsProductStatus | "all";
};

/** Full editable product payload for the Operations product edit page. */
export type OperationsProductEditInput = {
  name: string;
  description: string;
  brand: string;
  sku: string;
  category: OperationsProductCategory;
  ageRestriction: OperationsAgeRestriction;
  tags: string[];
  priceGhs: number;
  status: OperationsProductStatus;
  images: OperationsProductImage[];
  variants: OperationsProductVariant[];
};

export const OPERATIONS_AGE_RESTRICTIONS: OperationsAgeRestriction[] = [
  "none",
  "18+",
  "21+",
];
