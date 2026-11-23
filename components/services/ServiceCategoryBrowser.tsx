"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import type {
  ServiceCategory,
  ServiceProvider,
  ServiceProviderFilters,
} from "@/types/services";
import { filterServiceProviders } from "@/lib/services/filter-providers";
import { ServiceProviderCard } from "@/components/services/ServiceProviderCard";
import { ServiceCategoryEmpty } from "@/components/services/ServiceCategoryEmpty";
import { Reveal } from "@/components/ui/Reveal";

type ServiceCategoryBrowserProps = {
  category: ServiceCategory;
  providers: ServiceProvider[];
  locations: string[];
  source: "demo" | "api";
  demoNotice?: string;
};

const DEFAULT_FILTERS: ServiceProviderFilters = {
  query: "",
  location: null,
  sort: "featured",
};

const SORT_OPTIONS: {
  value: ServiceProviderFilters["sort"];
  label: string;
}[] = [
  { value: "featured", label: "Featured" },
  { value: "name-asc", label: "Name A–Z" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function ServiceCategoryBrowser({
  category,
  providers,
  locations,
  source,
  demoNotice,
}: ServiceCategoryBrowserProps) {
  const [filters, setFilters] = useState<ServiceProviderFilters>(DEFAULT_FILTERS);

  const filtered = useMemo(
    () => filterServiceProviders(providers, filters),
    [providers, filters],
  );

  const hasActiveFilters =
    Boolean(filters.query.trim()) ||
    Boolean(filters.location) ||
    filters.sort !== "featured";

  function resetFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  return (
    <section
      id="providers"
      className="scroll-mt-28 bg-white"
      aria-labelledby={`${category.slug}-providers-heading`}
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <Reveal>
          <p className="mb-3 font-outfit text-xs font-semibold uppercase tracking-[0.18em] text-lilac-luster">
            Onboarded providers
          </p>
          <h2
            id={`${category.slug}-providers-heading`}
            className="font-oswald text-[clamp(2.2rem,5vw,3.75rem)] font-bold uppercase leading-[0.95] tracking-[-0.02em] text-midnight-party"
          >
            Find your
            <span className="block text-radiant-rose">{category.shortName}</span>
          </h2>
          <p className="mt-4 max-w-2xl font-outfit text-base leading-relaxed text-midnight-party/75">
            Browse demo listings for this category. When live partner APIs ship,
            this grid will show real onboarded providers without a redesign.
          </p>
        </Reveal>

        {locations.length > 0 || providers.length > 0 ? (
          <div className="mt-8 rounded-2xl border border-black/10 bg-white p-4 shadow-[0_10px_30px_rgba(51,16,56,0.05)] sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal
                  size={18}
                  className="text-lilac-luster"
                  aria-hidden="true"
                />
                <h3 className="font-oswald text-xl font-semibold uppercase tracking-wide text-midnight-party">
                  Search &amp; Filters
                </h3>
              </div>
              <p
                className="font-outfit text-sm text-midnight-party/65"
                aria-live="polite"
              >
                {filtered.length}{" "}
                {filtered.length === 1 ? "provider" : "providers"}
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="relative xl:col-span-2">
                <label htmlFor={`${category.slug}-search`} className="sr-only">
                  Search providers by name
                </label>
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-midnight-party/45"
                  aria-hidden="true"
                />
                <input
                  id={`${category.slug}-search`}
                  type="search"
                  value={filters.query}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      query: event.target.value,
                    }))
                  }
                  placeholder="Search by name, coverage…"
                  className="w-full rounded-xl border border-black/10 bg-[#faf7f9] py-2.5 pl-10 pr-3 font-outfit text-sm text-midnight-party placeholder:text-midnight-party/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
                />
              </div>

              <div>
                <label htmlFor={`${category.slug}-location`} className="sr-only">
                  Filter by location
                </label>
                <select
                  id={`${category.slug}-location`}
                  value={filters.location ?? ""}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      location: event.target.value || null,
                    }))
                  }
                  className="w-full rounded-xl border border-black/10 bg-[#faf7f9] px-3 py-2.5 font-outfit text-sm text-midnight-party focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
                >
                  <option value="">All locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor={`${category.slug}-sort`} className="sr-only">
                  Sort providers
                </label>
                <select
                  id={`${category.slug}-sort`}
                  value={filters.sort}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      sort: event.target.value as ServiceProviderFilters["sort"],
                    }))
                  }
                  className="w-full rounded-xl border border-black/10 bg-[#faf7f9] px-3 py-2.5 font-outfit text-sm text-midnight-party focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {hasActiveFilters ? (
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="font-outfit text-xs font-semibold uppercase tracking-[0.12em] text-lilac-luster transition hover:text-midnight-party"
                >
                  Clear filters
                </button>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="mt-10">
          {filtered.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((provider, index) => (
                <ServiceProviderCard
                  key={provider.id}
                  provider={provider}
                  delayMs={Math.min(index * 70, 280)}
                />
              ))}
            </div>
          ) : (
            <ServiceCategoryEmpty
              categorySlug={category.slug}
              categoryName={category.name}
              hasProvidersInCategory={providers.length > 0}
              onReset={providers.length > 0 ? resetFilters : undefined}
            />
          )}
        </div>

        {source === "demo" && demoNotice ? (
          <p className="mt-10 font-outfit text-xs text-midnight-party/50">
            {demoNotice}
          </p>
        ) : null}
      </div>
    </section>
  );
}
