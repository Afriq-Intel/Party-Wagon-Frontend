import { PARTNER_SERVICES_PAGE_SIZE } from "@/lib/data/partner-services";
import type {
  PartnerService,
  PartnerServiceFilters,
} from "@/types/partner-services";

export function filterPartnerServices(
  services: PartnerService[],
  filters: PartnerServiceFilters,
): PartnerService[] {
  const query = filters.search.trim().toLowerCase();

  return services.filter((service) => {
    if (filters.status !== "all" && service.status !== filters.status) {
      return false;
    }
    if (!query) return true;

    return (
      service.name.toLowerCase().includes(query) ||
      service.category.toLowerCase().includes(query) ||
      service.description.toLowerCase().includes(query) ||
      service.availabilityNotes.toLowerCase().includes(query)
    );
  });
}

export function paginatePartnerServices(
  services: PartnerService[],
  page: number,
  pageSize: number = PARTNER_SERVICES_PAGE_SIZE,
): {
  items: PartnerService[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
} {
  const totalItems = services.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: services.slice(start, start + pageSize),
    page: safePage,
    pageSize,
    totalItems,
    totalPages,
  };
}
