/**
 * MOCK DATA — Partner Availability Calendar visual development only.
 * Not live calendar/booking-slot records.
 */
import type { PartnerBooking } from "@/types/partner-bookings";
import type {
  PartnerAvailabilitySlot,
  PartnerAvailabilityState,
  PartnerBlockedDate,
  PartnerCalendarDayMarker,
} from "@/types/partner-availability";

export const PARTNER_AVAILABILITY_STORAGE_KEY =
  "party-wagon-partner-availability-v1";

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function cloneAvailabilitySlot(
  slot: PartnerAvailabilitySlot,
): PartnerAvailabilitySlot {
  return { ...slot };
}

export function cloneBlockedDate(
  blocked: PartnerBlockedDate,
): PartnerBlockedDate {
  return { ...blocked };
}

export function cloneAvailabilityState(
  state: PartnerAvailabilityState,
): PartnerAvailabilityState {
  return {
    slots: state.slots.map(cloneAvailabilitySlot),
    blockedDates: state.blockedDates.map(cloneBlockedDate),
  };
}

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDateKey(dateKey: string): Date | null {
  if (!DATE_PATTERN.test(dateKey)) return null;
  const date = new Date(`${dateKey}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatAvailabilityDate(dateKey: string): string {
  const date = parseDateKey(dateKey);
  if (!date) return dateKey;
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatMonthLabel(year: number, monthIndex: number): string {
  const date = new Date(year, monthIndex, 1);
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(date);
}

/** Normalise "9:00" / "09:00" into "HH:MM". */
export function normalizeTime(time: string): string {
  const match = /^(\d{1,2}):([0-5]\d)$/.exec(time.trim());
  if (!match) return time.trim();
  const hours = Number(match[1]);
  if (hours > 23) return time.trim();
  return `${String(hours).padStart(2, "0")}:${match[2]}`;
}

export function timeToMinutes(time: string): number | null {
  const normalised = normalizeTime(time);
  if (!TIME_PATTERN.test(normalised)) return null;
  const [hours, minutes] = normalised.split(":").map(Number);
  return hours * 60 + minutes;
}

export function formatDisplayTime(time: string): string {
  const minutes = timeToMinutes(time);
  if (minutes === null) return time;
  const hours24 = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${String(mins).padStart(2, "0")} ${period}`;
}

export function isValidTimeRange(startTime: string, endTime: string): boolean {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  if (start === null || end === null) return false;
  return end > start;
}

export function slotsOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  const aS = timeToMinutes(aStart);
  const aE = timeToMinutes(aEnd);
  const bS = timeToMinutes(bStart);
  const bE = timeToMinutes(bEnd);
  if (aS === null || aE === null || bS === null || bE === null) return false;
  return aS < bE && bS < aE;
}

export function validateSlotInput(
  input: {
    date: string;
    startTime: string;
    endTime: string;
    capacity?: number;
  },
  existing: PartnerAvailabilitySlot[],
  options?: { ignoreSlotId?: string },
): string | null {
  if (!DATE_PATTERN.test(input.date)) {
    return "Choose a valid date.";
  }
  const startTime = normalizeTime(input.startTime);
  const endTime = normalizeTime(input.endTime);
  if (!TIME_PATTERN.test(startTime) || !TIME_PATTERN.test(endTime)) {
    return "Use 24-hour times like 09:00 and 17:30.";
  }
  if (!isValidTimeRange(startTime, endTime)) {
    return "End time must be after start time.";
  }
  if (
    input.capacity !== undefined &&
    (!Number.isFinite(input.capacity) || input.capacity < 1)
  ) {
    return "Capacity must be at least 1 when set.";
  }

  const conflict = existing.some((slot) => {
    if (options?.ignoreSlotId && slot.id === options.ignoreSlotId) return false;
    if (slot.date !== input.date) return false;
    return slotsOverlap(slot.startTime, slot.endTime, startTime, endTime);
  });

  if (conflict) {
    return "This slot overlaps another slot on the same date.";
  }

  return null;
}

/** Bookings that should appear as busy on the calendar. */
export function isCalendarRelevantBooking(booking: PartnerBooking): boolean {
  return (
    booking.status === "pending" ||
    booking.status === "confirmed" ||
    booking.status === "completed"
  );
}

export function bookingsForDate(
  bookings: PartnerBooking[],
  dateKey: string,
): PartnerBooking[] {
  return bookings.filter(
    (booking) =>
      booking.eventDate === dateKey && isCalendarRelevantBooking(booking),
  );
}

export function slotsForDate(
  slots: PartnerAvailabilitySlot[],
  dateKey: string,
): PartnerAvailabilitySlot[] {
  return slots
    .filter((slot) => slot.date === dateKey)
    .sort((a, b) => (timeToMinutes(a.startTime) ?? 0) - (timeToMinutes(b.startTime) ?? 0));
}

export function blockedForDate(
  blockedDates: PartnerBlockedDate[],
  dateKey: string,
): PartnerBlockedDate | undefined {
  return blockedDates.find((entry) => entry.date === dateKey);
}

/**
 * Day markers for the month grid.
 * Priority for primary chip: unavailable > booked > limited > available.
 * Multiple markers may still be returned for legend dots.
 */
export function getDayMarkers(
  dateKey: string,
  state: PartnerAvailabilityState,
  bookings: PartnerBooking[],
): PartnerCalendarDayMarker[] {
  const markers: PartnerCalendarDayMarker[] = [];
  const blocked = blockedForDate(state.blockedDates, dateKey);
  const daySlots = slotsForDate(state.slots, dateKey);
  const dayBookings = bookingsForDate(bookings, dateKey);

  if (blocked) {
    markers.push("unavailable");
  }

  if (dayBookings.length > 0) {
    markers.push("booked");
  }

  if (!blocked && daySlots.length > 0) {
    const capacities = daySlots
      .map((slot) => slot.capacity)
      .filter((value): value is number => typeof value === "number");
    const isLimited =
      capacities.length > 0 &&
      capacities.every((capacity) => capacity <= 2);
    markers.push(isLimited ? "limited" : "available");
  }

  return markers;
}

export function markerLabel(marker: PartnerCalendarDayMarker): string {
  switch (marker) {
    case "available":
      return "Available";
    case "limited":
      return "Limited";
    case "unavailable":
      return "Unavailable";
    case "booked":
      return "Booked";
  }
}

export function markerDotClass(marker: PartnerCalendarDayMarker): string {
  switch (marker) {
    case "available":
      return "bg-blue-lagoon";
    case "limited":
      return "bg-lemon-twist";
    case "unavailable":
      return "bg-midnight-party/35";
    case "booked":
      return "bg-radiant-rose";
  }
}

/** Build the Sunday-start month matrix (null = empty pad cell). */
export function buildMonthCells(
  year: number,
  monthIndex: number,
): Array<Date | null> {
  const first = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const startPad = first.getDay(); // 0 Sun
  const cells: Array<Date | null> = [];

  for (let i = 0; i < startPad; i += 1) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, monthIndex, day));
  }
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }
  return cells;
}

export function createMockPartnerAvailability(
  partnerId: string,
): PartnerAvailabilityState {
  if (partnerId === "PW-PRT-GLOW1") {
    return {
      slots: [
        {
          id: "slot-glow-1115-am",
          partnerId,
          date: "2026-11-15",
          startTime: "10:00",
          endTime: "14:00",
          capacity: 2,
        },
        {
          id: "slot-glow-1120-eve",
          partnerId,
          date: "2026-11-20",
          startTime: "16:00",
          endTime: "21:00",
          capacity: 1,
        },
        {
          id: "slot-glow-1122-eve",
          partnerId,
          date: "2026-11-22",
          startTime: "17:00",
          endTime: "22:00",
          capacity: 1,
        },
        {
          id: "slot-glow-1125-day",
          partnerId,
          date: "2026-11-25",
          startTime: "09:00",
          endTime: "17:00",
          capacity: 3,
        },
        {
          id: "slot-glow-1128-day",
          partnerId,
          date: "2026-11-28",
          startTime: "11:00",
          endTime: "18:00",
        },
      ],
      blockedDates: [
        {
          id: "block-glow-1126",
          partnerId,
          date: "2026-11-26",
          reason: "Team rest day after midweek events",
        },
      ],
    };
  }

  if (partnerId === "PW-PRT-COAST1") {
    return {
      slots: [
        {
          id: "slot-coast-1115-eve",
          partnerId,
          date: "2026-11-15",
          startTime: "16:00",
          endTime: "20:00",
          capacity: 1,
        },
        {
          id: "slot-coast-1121-day",
          partnerId,
          date: "2026-11-21",
          startTime: "12:00",
          endTime: "18:00",
          capacity: 2,
        },
        {
          id: "slot-coast-1129-eve",
          partnerId,
          date: "2026-11-29",
          startTime: "14:00",
          endTime: "20:00",
          capacity: 1,
        },
        {
          id: "slot-coast-1130-day",
          partnerId,
          date: "2026-11-30",
          startTime: "10:00",
          endTime: "16:00",
        },
      ],
      blockedDates: [
        {
          id: "block-coast-1123",
          partnerId,
          date: "2026-11-23",
          reason: "Equipment maintenance",
        },
      ],
    };
  }

  return { slots: [], blockedDates: [] };
}
