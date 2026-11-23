import type {
  ServiceProvider,
  ServiceProviderFilters,
} from "@/types/services";

function lowestPackagePrice(provider: ServiceProvider): number | null {
  const priced = provider.packages
    .map((pkg) => pkg.priceGhs)
    .filter((value): value is number => typeof value === "number");
  if (priced.length === 0) return null;
  return Math.min(...priced);
}

export function filterServiceProviders(
  providers: ServiceProvider[],
  filters: ServiceProviderFilters,
): ServiceProvider[] {
  const query = filters.query.trim().toLowerCase();

  let next = providers.filter((provider) => {
    if (filters.location && provider.location !== filters.location) {
      return false;
    }

    if (!query) return true;

    const haystack = [
      provider.name,
      provider.description,
      provider.location,
      provider.coverage,
      ...provider.packages.map((pkg) => pkg.name),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });

  next = [...next].sort((a, b) => {
    switch (filters.sort) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "price-asc":
      case "price-desc": {
        const priceA = lowestPackagePrice(a);
        const priceB = lowestPackagePrice(b);
        if (priceA == null && priceB == null) return a.name.localeCompare(b.name);
        if (priceA == null) return 1;
        if (priceB == null) return -1;
        return filters.sort === "price-asc" ? priceA - priceB : priceB - priceA;
      }
      case "featured":
      default: {
        const verifiedDelta = Number(Boolean(b.verified)) - Number(Boolean(a.verified));
        if (verifiedDelta !== 0) return verifiedDelta;
        return a.name.localeCompare(b.name);
      }
    }
  });

  return next;
}
