import { PARTNER_BOOKINGS_PAGE_SIZE } from "@/lib/data/partner-bookings";
import type {
  PartnerBooking,
  PartnerBookingFilters,
} from "@/types/partner-bookings";

export function filterPartnerBookings(
  bookings: PartnerBooking[],
  filters: PartnerBookingFilters,
): PartnerBooking[] {
  const query = filters.search.trim().toLowerCase();

  return bookings.filter((booking) => {
    if (filters.status !== "all" && booking.status !== filters.status) {
      return false;
    }
    if (!query) return true;

    return (
      booking.reference.toLowerCase().includes(query) ||
      booking.customer.name.toLowerCase().includes(query) ||
      booking.customer.email.toLowerCase().includes(query) ||
      booking.serviceName.toLowerCase().includes(query) ||
      booking.eventType.toLowerCase().includes(query) ||
      booking.location.toLowerCase().includes(query) ||
      booking.packageName.toLowerCase().includes(query)
    );
  });
}

export function paginatePartnerBookings(
  bookings: PartnerBooking[],
  page: number,
  pageSize: number = PARTNER_BOOKINGS_PAGE_SIZE,
): {
  items: PartnerBooking[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
} {
  const totalItems = bookings.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: bookings.slice(start, start + pageSize),
    page: safePage,
    pageSize,
    totalItems,
    totalPages,
  };
}
