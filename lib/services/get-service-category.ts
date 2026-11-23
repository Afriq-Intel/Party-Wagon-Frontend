import {
  DEMO_SERVICE_CATEGORIES,
  DEMO_SERVICE_PROVIDERS,
  SERVICE_CATEGORY_SLUGS,
} from "@/lib/data/services-demo";
import type {
  ServiceCategoryResponse,
  ServiceCategorySlug,
  ServiceProvider,
} from "@/types/services";

export function isServiceCategorySlug(
  value: string,
): value is ServiceCategorySlug {
  return (SERVICE_CATEGORY_SLUGS as string[]).includes(value);
}

/**
 * Service category data access layer.
 *
 * Backend status (inspected): `src/modules/services` is an empty placeholder;
 * Prisma has services / partners / partner_services / service_provider_profiles
 * but no customer-facing listing or booking HTTP routes. Until a confirmed API
 * exists, this returns clearly labelled demo fixtures.
 *
 * When the API is ready, replace the demo branch with a typed fetch against the
 * confirmed contract — keep returning `ServiceCategoryResponse`.
 */
export async function getServiceCategory(
  slug: ServiceCategorySlug,
): Promise<ServiceCategoryResponse | null> {
  // Future: const apiBase = process.env.NEXT_PUBLIC_API_URL;
  // if (apiBase) { return fetchCategoryFromApi(apiBase, slug); }

  await Promise.resolve();

  const category = DEMO_SERVICE_CATEGORIES[slug];
  if (!category) return null;

  const providers = DEMO_SERVICE_PROVIDERS.filter(
    (provider) => provider.categorySlug === slug,
  );

  const locations = Array.from(
    new Set(providers.map((provider) => provider.location)),
  ).sort((a, b) => a.localeCompare(b));

  return {
    source: "demo",
    category,
    providers,
    locations,
  };
}

export async function getServiceCategorySlugs(): Promise<ServiceCategorySlug[]> {
  return [...SERVICE_CATEGORY_SLUGS];
}

export async function getServiceProviderBySlug(
  categorySlug: ServiceCategorySlug,
  providerSlug: string,
): Promise<ServiceProvider | null> {
  const data = await getServiceCategory(categorySlug);
  if (!data) return null;
  return (
    data.providers.find((provider) => provider.slug === providerSlug) ?? null
  );
}
