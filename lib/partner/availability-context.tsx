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
  cloneAvailabilityState,
  createMockPartnerAvailability,
  normalizeTime,
  PARTNER_AVAILABILITY_STORAGE_KEY,
  validateSlotInput,
} from "@/lib/data/partner-availability";
import type {
  PartnerAvailabilitySlot,
  PartnerAvailabilitySlotInput,
  PartnerAvailabilityState,
  PartnerBlockedDate,
  PartnerBlockedDateInput,
} from "@/types/partner-availability";

type MutationResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

type PartnerAvailabilityContextValue = {
  partnerId: string | null;
  state: PartnerAvailabilityState;
  ready: boolean;
  addSlot: (
    input: PartnerAvailabilitySlotInput,
  ) => MutationResult<PartnerAvailabilitySlot>;
  updateSlot: (
    slotId: string,
    input: PartnerAvailabilitySlotInput,
  ) => MutationResult<PartnerAvailabilitySlot>;
  deleteSlot: (slotId: string) => PartnerAvailabilitySlot | null;
  blockDate: (
    input: PartnerBlockedDateInput,
  ) => MutationResult<PartnerBlockedDate>;
  unblockDate: (date: string) => PartnerBlockedDate | null;
};

const PartnerAvailabilityContext =
  createContext<PartnerAvailabilityContextValue | null>(null);

type PersistedAvailabilityState = {
  version: 1;
  byPartnerId: Record<string, PartnerAvailabilityState>;
};

function canUseStorage() {
  return typeof window !== "undefined";
}

function readPersistedState(): PersistedAvailabilityState | null {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(PARTNER_AVAILABILITY_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedAvailabilityState;
    if (!parsed || parsed.version !== 1 || !parsed.byPartnerId) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writePersistedState(state: PersistedAvailabilityState) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(
    PARTNER_AVAILABILITY_STORAGE_KEY,
    JSON.stringify(state),
  );
}

function createSlotId(): string {
  return `slot-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

function createBlockId(): string {
  return `block-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

function seedForPartner(partnerId: string): PartnerAvailabilityState {
  return cloneAvailabilityState(createMockPartnerAvailability(partnerId));
}

export function PartnerAvailabilityProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useAuth();
  const partner = user ? findPartnerAccountByEmail(user.email) : undefined;
  const capability = partner
    ? getPartnerCapability(partner.partnerId)
    : null;
  const partnerId =
    partner && capability === "service_provider" ? partner.partnerId : null;

  const [state, setState] = useState<PartnerAvailabilityState>({
    slots: [],
    blockedDates: [],
  });
  const [ready, setReady] = useState(false);
  const [hydratedPartnerId, setHydratedPartnerId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!partnerId) {
      setState({ slots: [], blockedDates: [] });
      setHydratedPartnerId(null);
      setReady(true);
      return;
    }

    setReady(false);
    const persisted = readPersistedState();
    const stored = persisted?.byPartnerId[partnerId];
    if (
      stored &&
      Array.isArray(stored.slots) &&
      Array.isArray(stored.blockedDates)
    ) {
      setState(cloneAvailabilityState(stored));
    } else {
      setState(seedForPartner(partnerId));
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
        [partnerId]: cloneAvailabilityState(state),
      },
    });
  }, [partnerId, hydratedPartnerId, ready, state]);

  const addSlot = useCallback(
    (input: PartnerAvailabilitySlotInput): MutationResult<PartnerAvailabilitySlot> => {
      if (!partnerId) {
        return { ok: false, error: "Partner workspace is not ready." };
      }

      const error = validateSlotInput(input, state.slots);
      if (error) return { ok: false, error };

      if (state.blockedDates.some((entry) => entry.date === input.date)) {
        return {
          ok: false,
          error: "This date is blocked. Unblock it before adding slots.",
        };
      }

      const created: PartnerAvailabilitySlot = {
        id: createSlotId(),
        partnerId,
        date: input.date,
        startTime: normalizeTime(input.startTime),
        endTime: normalizeTime(input.endTime),
        capacity: input.capacity,
      };

      setState((current) => ({
        ...current,
        slots: [...current.slots, created],
      }));

      return { ok: true, value: created };
    },
    [partnerId, state.blockedDates, state.slots],
  );

  const updateSlot = useCallback(
    (
      slotId: string,
      input: PartnerAvailabilitySlotInput,
    ): MutationResult<PartnerAvailabilitySlot> => {
      if (!partnerId) {
        return { ok: false, error: "Partner workspace is not ready." };
      }

      const existing = state.slots.find((slot) => slot.id === slotId);
      if (!existing || existing.partnerId !== partnerId) {
        return { ok: false, error: "Slot not found." };
      }

      const error = validateSlotInput(input, state.slots, {
        ignoreSlotId: slotId,
      });
      if (error) return { ok: false, error };

      if (state.blockedDates.some((entry) => entry.date === input.date)) {
        return {
          ok: false,
          error: "This date is blocked. Unblock it before saving slots.",
        };
      }

      const updated: PartnerAvailabilitySlot = {
        ...existing,
        date: input.date,
        startTime: normalizeTime(input.startTime),
        endTime: normalizeTime(input.endTime),
        capacity: input.capacity,
      };

      setState((current) => ({
        ...current,
        slots: current.slots.map((slot) =>
          slot.id === slotId ? updated : slot,
        ),
      }));

      return { ok: true, value: updated };
    },
    [partnerId, state.blockedDates, state.slots],
  );

  const deleteSlot = useCallback(
    (slotId: string) => {
      let removed: PartnerAvailabilitySlot | null = null;
      setState((current) => {
        const target = current.slots.find((slot) => slot.id === slotId);
        if (!target || (partnerId && target.partnerId !== partnerId)) {
          return current;
        }
        removed = { ...target };
        return {
          ...current,
          slots: current.slots.filter((slot) => slot.id !== slotId),
        };
      });
      return removed;
    },
    [partnerId],
  );

  const blockDate = useCallback(
    (input: PartnerBlockedDateInput): MutationResult<PartnerBlockedDate> => {
      if (!partnerId) {
        return { ok: false, error: "Partner workspace is not ready." };
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
        return { ok: false, error: "Choose a valid date." };
      }
      if (state.blockedDates.some((entry) => entry.date === input.date)) {
        return { ok: false, error: "This date is already blocked." };
      }

      const created: PartnerBlockedDate = {
        id: createBlockId(),
        partnerId,
        date: input.date,
        reason: input.reason?.trim() || undefined,
      };

      setState((current) => ({
        // Blocking a date clears open slots for that day.
        slots: current.slots.filter((slot) => slot.date !== input.date),
        blockedDates: [...current.blockedDates, created],
      }));

      return { ok: true, value: created };
    },
    [partnerId, state.blockedDates],
  );

  const unblockDate = useCallback(
    (date: string) => {
      let removed: PartnerBlockedDate | null = null;
      setState((current) => {
        const target = current.blockedDates.find((entry) => entry.date === date);
        if (!target || (partnerId && target.partnerId !== partnerId)) {
          return current;
        }
        removed = { ...target };
        return {
          ...current,
          blockedDates: current.blockedDates.filter(
            (entry) => entry.date !== date,
          ),
        };
      });
      return removed;
    },
    [partnerId],
  );

  const value = useMemo(
    () => ({
      partnerId,
      state,
      ready,
      addSlot,
      updateSlot,
      deleteSlot,
      blockDate,
      unblockDate,
    }),
    [
      partnerId,
      state,
      ready,
      addSlot,
      updateSlot,
      deleteSlot,
      blockDate,
      unblockDate,
    ],
  );

  return (
    <PartnerAvailabilityContext.Provider value={value}>
      {children}
    </PartnerAvailabilityContext.Provider>
  );
}

export function usePartnerAvailability() {
  const context = useContext(PartnerAvailabilityContext);
  if (!context) {
    throw new Error(
      "usePartnerAvailability must be used within PartnerAvailabilityProvider",
    );
  }
  return context;
}
