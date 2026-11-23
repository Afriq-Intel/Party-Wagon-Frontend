/**
 * Shared global-search helpers.
 * Product matching reuses `filterAndSortProducts` (name, brand, category).
 * Service matching uses existing service fixtures / provider filter helpers.
 * No invented API endpoints — swap the search index when catalogue/services APIs exist.
 */
import type { CatalogueProduct } from "@/types/catalogue";
import type { PartyService, ServiceProvider } from "@/types/services";
import {
  DEFAULT_CATALOGUE_FILTERS,
  filterAndSortProducts,
} from "@/lib/catalogue/filter-catalogue";
import { getCataloguePriceLabel } from "@/lib/catalogue/variants";
import { filterServiceProviders } from "@/lib/services/filter-providers";
import {
  getServiceCategoryHref,
  getServiceExploreHref,
} from "@/lib/data/services";

export type ProductSearchSuggestion = {
  kind: "product";
  id: string;
  title: string;
  subtitle: string;
  href: string;
  image: string;
  priceLabel: string;
};

export type ServiceSearchSuggestion = {
  kind: "service";
  id: string;
  title: string;
  subtitle: string;
  href: string;
  image: string;
  priceLabel?: string;
};

export type SearchSuggestion = ProductSearchSuggestion | ServiceSearchSuggestion;

export type GlobalSearchResults = {
  query: string;
  products: ProductSearchSuggestion[];
  services: ServiceSearchSuggestion[];
  total: number;
};

export type GlobalSearchIndex = {
  products: CatalogueProduct[];
  partyServices: PartyService[];
  providers: ServiceProvider[];
};

function matchPartyServices(
  services: PartyService[],
  query: string,
): PartyService[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return services.filter((service) => {
    const haystack = `${service.name} ${service.description}`.toLowerCase();
    return haystack.includes(q);
  });
}

function providerLeadPrice(provider: ServiceProvider): string | undefined {
  const lead = provider.packages[0];
  return lead?.priceLabel;
}

/**
 * Build suggestions for the header dropdown.
 * Products use the same catalogue filter logic as `/catalogue`.
 */
export function buildGlobalSearchResults(
  index: GlobalSearchIndex,
  rawQuery: string,
  limits: { products?: number; services?: number } = {},
): GlobalSearchResults {
  const query = rawQuery.trim();
  const productLimit = limits.products ?? 6;
  const serviceLimit = limits.services ?? 4;

  if (!query) {
    return { query: "", products: [], services: [], total: 0 };
  }

  const matchedProducts = filterAndSortProducts(index.products, {
    ...DEFAULT_CATALOGUE_FILTERS,
    query,
  }).slice(0, productLimit);

  const products: ProductSearchSuggestion[] = matchedProducts.map((product) => ({
    kind: "product",
    id: product.id,
    title: product.name,
    subtitle: `${product.brand} · ${product.categoryName}`,
    href: `/catalogue/${product.slug}`,
    image: product.image,
    priceLabel: getCataloguePriceLabel(product),
  }));

  const matchedServices = matchPartyServices(index.partyServices, query);
  const matchedProviders = filterServiceProviders(index.providers, {
    query,
    location: null,
    sort: "featured",
  });

  const services: ServiceSearchSuggestion[] = [];
  const seen = new Set<string>();

  for (const service of matchedServices) {
    if (services.length >= serviceLimit) break;
    const id = `service-${service.id}`;
    if (seen.has(id)) continue;
    seen.add(id);
    services.push({
      kind: "service",
      id,
      title: service.name,
      subtitle:
        service.availability === "available"
          ? "Party service"
          : "Coming soon: enquire",
      href: getServiceExploreHref(service),
      image: service.image,
    });
  }

  for (const provider of matchedProviders) {
    if (services.length >= serviceLimit) break;
    const id = `provider-${provider.id}`;
    if (seen.has(id)) continue;
    seen.add(id);
    services.push({
      kind: "service",
      id,
      title: provider.name,
      subtitle: `${provider.location} · provider`,
      // No provider detail route yet — land on the category listing.
      href: getServiceCategoryHref(provider.categorySlug),
      image: provider.image,
      priceLabel: providerLeadPrice(provider),
    });
  }

  return {
    query,
    products,
    services,
    total: products.length + services.length,
  };
}

/** Catalogue results URL — preserves existing `q` param contract. */
export function getCatalogueSearchHref(query: string): string {
  const trimmed = query.trim();
  if (!trimmed) return "/catalogue";
  return `/catalogue?q=${encodeURIComponent(trimmed)}`;
}
