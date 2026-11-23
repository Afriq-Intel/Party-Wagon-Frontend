"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/lib/auth/auth-context";
import {
  findPartnerAccountByEmail,
  getPartnerCapability,
} from "@/lib/auth/partner-mock-store";
import {
  clonePartnerBooking,
  createMockPartnerBookings,
  PARTNER_BOOKINGS_STORAGE_KEY,
} from "@/lib/data/partner-bookings";
import type {
  PartnerBooking,
  PartnerBookingStatus,
} from "@/types/partner-bookings";

type PartnerBookingsContextValue = {
  partnerId: string | null;
  bookings: PartnerBooking[];
  ready: boolean;
  getBooking: (bookingId: string) => PartnerBooking | undefined;
  getBookingByReference: (reference: string) => PartnerBooking | undefined;
  updateBookingStatus: (
    bookingId: string,
    status: PartnerBookingStatus,
  ) => PartnerBooking | null;
};

const PartnerBookingsContext =
  createContext<PartnerBookingsContextValue | null>(null);

type PersistedBookingsState = {
  version: 1;
  byPartnerId: Record<string, PartnerBooking[]>;
};

function canUseStorage() {
  return typeof window !== "undefined";
}

function readPersistedState(): PersistedBookingsState | null {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(PARTNER_BOOKINGS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedBookingsState;
    if (!parsed || parsed.version !== 1 || !parsed.byPartnerId) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writePersistedState(state: PersistedBookingsState) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(
    PARTNER_BOOKINGS_STORAGE_KEY,
    JSON.stringify(state),
  );
}

function seedForPartner(partnerId: string): PartnerBooking[] {
  return createMockPartnerBookings()
    .filter((booking) => booking.partnerId === partnerId)
    .map(clonePartnerBooking);
}

export function PartnerBookingsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const partner = user ? findPartnerAccountByEmail(user.email) : undefined;
  const capability = partner
    ? getPartnerCapability(partner.partnerId)
    : null;
  const partnerId =
    partner && capability === "service_provider" ? partner.partnerId : null;

  const [bookings, setBookings] = useState<PartnerBooking[]>([]);
  const [ready, setReady] = useState(false);
  const [hydratedPartnerId, setHydratedPartnerId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!partnerId) {
      setBookings([]);
      setHydratedPartnerId(null);
      setReady(true);
      return;
    }

    setReady(false);
    const persisted = readPersistedState();
    const stored = persisted?.byPartnerId[partnerId];
    if (stored && Array.isArray(stored) && stored.length > 0) {
      setBookings(stored.map(clonePartnerBooking));
    } else {
      setBookings(seedForPartner(partnerId));
    }
    setHydratedPartnerId(partnerId);
    setReady(true);
  }, [partnerId]);

  useEffect(() => {
    if (!ready || !partnerId || hydratedPartnerId !== partnerId) return;
    const persisted = readPersistedState() ?? { version: 1, byPartnerId: {} };
    writePersistedState({
      version: 1,
      byPartnerId: {
        ...persisted.byPartnerId,
        [partnerId]: bookings.map(clonePartnerBooking),
      },
    });
  }, [partnerId, hydratedPartnerId, ready, bookings]);

  const getBooking = useCallback(
    (bookingId: string) =>
      bookings.find(
        (booking) =>
          booking.id === bookingId || booking.reference === bookingId,
      ),
    [bookings],
  );

  const getBookingByReference = useCallback(
    (reference: string) =>
      bookings.find(
        (booking) =>
          booking.reference.toLowerCase() === reference.trim().toLowerCase(),
      ),
    [bookings],
  );

  const updateBookingStatus = useCallback(
    (bookingId: string, status: PartnerBookingStatus) => {
      let updated: PartnerBooking | null = null;
      setBookings((current) =>
        current.map((booking) => {
          if (booking.id !== bookingId && booking.reference !== bookingId) {
            return booking;
          }
          if (partnerId && booking.partnerId !== partnerId) return booking;
          updated = {
            ...clonePartnerBooking(booking),
            status,
            updatedAt: new Date().toISOString(),
          };
          return updated;
        }),
      );
      return updated;
    },
    [partnerId],
  );

  const value = useMemo(
    () => ({
      partnerId,
      bookings,
      ready,
      getBooking,
      getBookingByReference,
      updateBookingStatus,
    }),
    [
      partnerId,
      bookings,
      ready,
      getBooking,
      getBookingByReference,
      updateBookingStatus,
    ],
  );

  return (
    <PartnerBookingsContext.Provider value={value}>
      {children}
    </PartnerBookingsContext.Provider>
  );
}

export function usePartnerBookings() {
  const context = useContext(PartnerBookingsContext);
  if (!context) {
    throw new Error(
      "usePartnerBookings must be used within PartnerBookingsProvider",
    );
  }
  return context;
}
