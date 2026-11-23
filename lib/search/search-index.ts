/**
 * Client-safe search index for the global header.
 *
 * Today this reuses the same demo fixtures as `getCatalogue` / services pages.
 * When catalogue and services APIs exist, replace this module with a typed
 * fetch (or server-provided payload) — keep `GlobalSearchIndex` intact.
 */
import { DEMO_PRODUCTS } from "@/lib/data/catalogue-demo";
import { CORE_SERVICES } from "@/lib/data/services";
import { DEMO_SERVICE_PROVIDERS } from "@/lib/data/services-demo";
import type { GlobalSearchIndex } from "@/lib/search/global-search";

export function getClientSearchIndex(): GlobalSearchIndex {
  return {
    products: DEMO_PRODUCTS,
    partyServices: CORE_SERVICES,
    providers: DEMO_SERVICE_PROVIDERS,
  };
}
