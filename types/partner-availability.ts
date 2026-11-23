/**
 * Partner workspace — Availability Calendar types.
 * Mock UI for open/close booking slots. Not a live bookings API.
 */

export type PartnerAvailabilitySlot = {
  id: string;
  partnerId: string;
  /** ISO date YYYY-MM-DD */
  date: string;
  /** 24h "HH:MM" */
  startTime: string;
  /** 24h "HH:MM" */
  endTime: string;
  /** Optional max bookings / guests for this slot. */
  capacity?: number;
};

export type PartnerBlockedDate = {
  id: string;
  partnerId: string;
  /** ISO date YYYY-MM-DD */
  date: string;
  reason?: string;
};

export type PartnerAvailabilityState = {
  slots: PartnerAvailabilitySlot[];
  blockedDates: PartnerBlockedDate[];
};

export type PartnerAvailabilitySlotInput = {
  date: string;
  startTime: string;
  endTime: string;
  capacity?: number;
};

export type PartnerBlockedDateInput = {
  date: string;
  reason?: string;
};

/** Visual day markers on the month grid. */
export type PartnerCalendarDayMarker =
  | "available"
  | "limited"
  | "unavailable"
  | "booked";
