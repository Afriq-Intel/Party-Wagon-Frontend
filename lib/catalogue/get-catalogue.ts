import {
  DEMO_CATEGORIES,
  DEMO_PRODUCTS,
} from "@/lib/data/catalogue-demo";
import type { CatalogueProduct, CatalogueResponse } from "@/types/catalogue";

/**
 * Catalogue data access layer.
 *
 * Backend status (inspected): `src/modules/catalogue` is an empty placeholder;
 * Prisma has `products` + `product_variants` (sku, variant_name, pack_size) but
 * no price, image, or stock fields on those tables, and no HTTP catalogue routes
 * are registered. Until a confirmed API exists, this returns clearly labelled
 * demo fixtures (including demo variants).
 *
 * When the API is ready, replace the demo branch with a typed fetch against the
 * confirmed contract — keep returning `CatalogueResponse` so the UI stays intact.
 * Map API variants into `CatalogueProduct.variants` without inventing endpoints.
 */
export async function getCatalogue(): Promise<CatalogueResponse> {
  // Future: const apiBase = process.env.NEXT_PUBLIC_API_URL;
  // if (apiBase) { return fetchFromApi(apiBase); }

  await Promise.resolve();

  const prices = DEMO_PRODUCTS.map((product) => product.priceGhs);
  const brands = Array.from(
    new Set(DEMO_PRODUCTS.map((product) => product.brand)),
  ).sort((a, b) => a.localeCompare(b));

  return {
    source: "demo",
    categories: DEMO_CATEGORIES,
    products: DEMO_PRODUCTS,
    brands,
    priceBounds: {
      min: Math.min(...prices),
      max: Math.max(...prices),
    },
  };
}

export async function getCatalogueProductBySlug(
  slug: string,
): Promise<CatalogueProduct | null> {
  const catalogue = await getCatalogue();
  return catalogue.products.find((product) => product.slug === slug) ?? null;
}
