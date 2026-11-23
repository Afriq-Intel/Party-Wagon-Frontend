export type ServiceAvailability = "available" | "coming-soon";

/** Route slugs for onboarded core service categories. */
export type ServiceCategorySlug =
  | "dj"
  | "mixtologists"
  | "catering"
  | "mobile-bar";

export type PartyService = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  availability: ServiceAvailability;
  /** Future: map to backend service code when services API ships */
  backendCode?: string;
};

export type ServiceReason = {
  id: string;
  title: string;
  copy: string;
};

/**
 * Category page content. Fields mirror marketing + future service_categories.
 */
export type ServiceCategory = {
  id: string;
  slug: ServiceCategorySlug;
  name: string;
  shortName: string;
  headline: string;
  intro: string;
  heroImage: string;
  heroImageAlt: string;
  marquee: readonly string[];
  /** Future: services.code / service_categories.code */
  backendCode: string;
};

/**
 * Onboarded provider listing card.
 * Shaped to align with partners + partner_services + service_provider_profiles
 * once customer-facing APIs exist.
 */
export type ServiceProviderPackage = {
  id: string;
  name: string;
  /** Numeric GHS amount when known; omit when pricing is enquiry-only */
  priceGhs?: number;
  priceLabel: string;
  /** Matches partner_services.pricing_unit conceptually */
  pricingUnit?: string;
};

export type ServiceProvider = {
  id: string;
  slug: string;
  categorySlug: ServiceCategorySlug;
  /** Display / trading name (partners.trading_name) */
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  /** City / coverage copy derived from partner_service_areas */
  location: string;
  coverage: string;
  packages: ServiceProviderPackage[];
  /** verification_status-style badge when known */
  verified?: boolean;
};

export type ServiceProviderFilters = {
  query: string;
  location: string | null;
  sort: "featured" | "name-asc" | "price-asc" | "price-desc";
};

export type ServiceCategoryResponse = {
  source: "demo" | "api";
  category: ServiceCategory;
  providers: ServiceProvider[];
  locations: string[];
};
