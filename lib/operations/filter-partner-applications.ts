import { OPERATIONS_PARTNER_APPLICATIONS_PAGE_SIZE } from "@/lib/data/operations-partner-applications";
import type {
  OperationsPartnerApplication,
  OperationsPartnerApplicationFilters,
} from "@/types/operations-partners";

export function filterPartnerApplications(
  applications: OperationsPartnerApplication[],
  filters: OperationsPartnerApplicationFilters,
): OperationsPartnerApplication[] {
  const query = filters.search.trim().toLowerCase();

  return applications.filter((application) => {
    if (filters.status !== "all" && application.status !== filters.status) {
      return false;
    }
    if (
      filters.capability !== "all" &&
      application.capability !== filters.capability
    ) {
      return false;
    }
    if (!query) return true;

    return (
      application.businessName.toLowerCase().includes(query) ||
      application.contactName.toLowerCase().includes(query) ||
      application.email.toLowerCase().includes(query) ||
      application.referenceId.toLowerCase().includes(query) ||
      application.phone.toLowerCase().includes(query)
    );
  });
}

export function paginatePartnerApplications(
  applications: OperationsPartnerApplication[],
  page: number,
  pageSize: number = OPERATIONS_PARTNER_APPLICATIONS_PAGE_SIZE,
): {
  items: OperationsPartnerApplication[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
} {
  const totalItems = applications.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: applications.slice(start, start + pageSize),
    page: safePage,
    pageSize,
    totalItems,
    totalPages,
  };
}
