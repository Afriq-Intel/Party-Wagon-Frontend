import type {
  CatalogueProduct,
  CatalogueProductVariant,
} from "@/types/catalogue";

/** Format a Ghana cedi amount for catalogue / cart display. */
export function formatGhs(amount: number): string {
  return `GHS ${amount.toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Prefer cheapest in-stock variant; otherwise the first listed. */
export function getDefaultVariant(
  product: CatalogueProduct,
): CatalogueProductVariant {
  const inStock = product.variants.filter((variant) => variant.inStock);
  if (inStock.length === 0) return product.variants[0];
  return inStock.reduce((best, variant) =>
    variant.priceGhs < best.priceGhs ? variant : best,
  );
}

export function getVariantById(
  product: CatalogueProduct,
  variantId: string | null | undefined,
): CatalogueProductVariant | undefined {
  if (!variantId) return undefined;
  return product.variants.find((variant) => variant.id === variantId);
}

export function productHasMultipleVariants(product: CatalogueProduct): boolean {
  return product.variants.length > 1;
}

/** Lowest variant price — used for catalogue "From" pricing. */
export function getStartingPriceGhs(product: CatalogueProduct): number {
  if (product.variants.length === 0) return product.priceGhs;
  return Math.min(...product.variants.map((variant) => variant.priceGhs));
}

/**
 * Card / list price label: "From GHS X" when multiple variants exist,
 * otherwise the single variant (or product) price.
 */
export function getCataloguePriceLabel(product: CatalogueProduct): string {
  if (product.variants.length > 1) {
    return `From ${formatGhs(getStartingPriceGhs(product))}`;
  }
  if (product.variants.length === 1) {
    return product.variants[0].priceLabel;
  }
  return product.priceLabel;
}

export function getVariantOptionSummary(product: CatalogueProduct): string | null {
  if (product.variants.length < 2) return null;
  return `${product.variants.length} options`;
}

/** Cart line identity: same product + same variant merges; different variants stay separate. */
export function cartLineKey(productId: string, variantId: string): string {
  return `${productId}::${variantId}`;
}

export function resolveVariantImage(
  product: CatalogueProduct,
  variant: CatalogueProductVariant,
): string {
  return variant.image ?? product.image;
}
