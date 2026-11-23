/**
 * Partner workspace — Bookings types.
 * Shaped for a future partner bookings API — mock UI only for now.
 */

export type PartnerBookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "declined"
  | "cancelled";

export type PartnerBookingCustomer = {
  name: string;
  email: string;
  phone: string;
};

export type PartnerBooking = {
  id: string;
  /** Public booking reference shown in UI (e.g. PW-1048). */
  reference: string;
  /** Owning partner account id (OperationsPartnerAccount.partnerId). */
  partnerId: string;
  customer: PartnerBookingCustomer;
  serviceId?: string;
  serviceName: string;
  packageName: string;
  eventType: string;
  /** ISO date (YYYY-MM-DD) for the event day. */
  eventDate: string;
  /** Display time, e.g. "2:00 PM". */
  eventTime: string;
  location: string;
  guestCount: number;
  priceGhs: number;
  specialRequests: string;
  status: PartnerBookingStatus;
  /** ISO datetime for last update. */
  updatedAt: string;
  /** ISO datetime when the booking request was created. */
  createdAt: string;
};

export type PartnerBookingFilters = {
  search: string;
  status: PartnerBookingStatus | "all";
};

export const PARTNER_BOOKING_STATUSES: PartnerBookingStatus[] = [
  "pending",
  "confirmed",
  "completed",
  "declined",
  "cancelled",
];
