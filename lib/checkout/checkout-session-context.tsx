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
import type { CheckoutSession } from "@/types/checkout";
import {
  clearCheckoutSession,
  readCheckoutSession,
  writeCheckoutSession,
} from "@/lib/checkout/checkout-session";

type CheckoutSessionContextValue = {
  session: CheckoutSession | null;
  /** False until sessionStorage has been read on the client. */
  hydrated: boolean;
  saveSession: (session: CheckoutSession) => void;
  clearSession: () => void;
};

const CheckoutSessionContext =
  createContext<CheckoutSessionContextValue | null>(null);

export function CheckoutSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<CheckoutSession | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSession(readCheckoutSession());
    setHydrated(true);
  }, []);

  const saveSession = useCallback((next: CheckoutSession) => {
    // Persist first so /payment can read immediately even if React state
    // has not re-rendered yet after navigation.
    writeCheckoutSession(next);
    setSession(next);
  }, []);

  /** Prefer live context; fall back to sessionStorage after hydrate. */
  const resolvedSession = session ?? (hydrated ? readCheckoutSession() : null);

  const clearSession = useCallback(() => {
    clearCheckoutSession();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      session: resolvedSession,
      hydrated,
      saveSession,
      clearSession,
    }),
    [resolvedSession, hydrated, saveSession, clearSession],
  );

  return (
    <CheckoutSessionContext.Provider value={value}>
      {children}
    </CheckoutSessionContext.Provider>
  );
}

export function useCheckoutSession(): CheckoutSessionContextValue {
  const ctx = useContext(CheckoutSessionContext);
  if (!ctx) {
    throw new Error(
      "useCheckoutSession must be used within CheckoutSessionProvider",
    );
  }
  return ctx;
}
