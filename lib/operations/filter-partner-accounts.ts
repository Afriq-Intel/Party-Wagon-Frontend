import { OPERATIONS_PARTNER_DIRECTORY_PAGE_SIZE } from "@/lib/data/operations-partner-accounts";
import type {
  OperationsPartnerAccount,
  OperationsPartnerDirectoryFilters,
} from "@/types/operations-partners";

export function filterPartnerAccounts(
  partners: OperationsPartnerAccount[],
  filters: OperationsPartnerDirectoryFilters,
): OperationsPartnerAccount[] {
  const query = filters.search.trim().toLowerCase();

  return partners.filter((partner) => {
    if (
      filters.capability !== "all" &&
      partner.capability !== filters.capability
    ) {
      return false;
    }
    if (
      filters.verificationStatus !== "all" &&
      partner.verificationStatus !== filters.verificationStatus
    ) {
      return false;
    }
    if (
      filters.accountStatus !== "all" &&
      partner.accountStatus !== filters.accountStatus
    ) {
      return false;
    }
    if (!query) return true;

    return (
      partner.businessName.toLowerCase().includes(query) ||
      partner.partnerId.toLowerCase().includes(query) ||
      partner.contactName.toLowerCase().includes(query) ||
      partner.email.toLowerCase().includes(query) ||
      partner.phone.toLowerCase().includes(query)
    );
  });
}

export function paginatePartnerAccounts(
  partners: OperationsPartnerAccount[],
  page: number,
  pageSize: number = OPERATIONS_PARTNER_DIRECTORY_PAGE_SIZE,
): {
  items: OperationsPartnerAccount[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
} {
  const totalItems = partners.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: partners.slice(start, start + pageSize),
    page: safePage,
    pageSize,
    totalItems,
    totalPages,
  };
}
