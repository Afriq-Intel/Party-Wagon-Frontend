/**
 * Client-side checkout session persistence.
 * Bridges address + quote from /checkout to /payment until a backend
 * checkout API exists. Not a payment or order API.
 */

import type {
  CheckoutAddressFormValues,
  CheckoutSession,
  ConfirmedDeliveryQuote,
  SelectedCheckoutLocation,
} from "@/types/checkout";
import {
  INITIAL_CHECKOUT_ADDRESS,
  toCheckoutAddressPayload,
} from "@/lib/checkout/address";

export const CHECKOUT_SESSION_STORAGE_KEY = "party-wagon-checkout-session-v1";

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function isAddress(value: unknown): value is CheckoutAddressFormValues {
  if (!isObject(value)) return false;
  return (
    typeof value.recipientName === "string" &&
    typeof value.phone === "string" &&
    typeof value.addressLine1 === "string" &&
    typeof value.city === "string" &&
    typeof value.countryCode === "string" &&
    typeof value.label === "string"
  );
}

function isLocation(value: unknown): value is SelectedCheckoutLocation {
  if (!isObject(value)) return false;
  return (
    typeof value.source === "string" &&
    typeof value.title === "string" &&
    typeof value.subtitle === "string"
  );
}

function isQuote(value: unknown): value is ConfirmedDeliveryQuote {
  if (!isObject(value)) return false;
  return (
    typeof value.feeGhs === "number" &&
    Number.isFinite(value.feeGhs) &&
    value.feeGhs >= 0 &&
    typeof value.feeLabel === "string"
  );
}

export function isCheckoutSession(value: unknown): value is CheckoutSession {
  if (!isObject(value)) return false;
  return (
    isAddress(value.address) &&
    isObject(value.addressPayload) &&
    isLocation(value.location) &&
    isQuote(value.quote) &&
    typeof value.updatedAt === "string"
  );
}

export function readCheckoutSession(): CheckoutSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(CHECKOUT_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return isCheckoutSession(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeCheckoutSession(session: CheckoutSession): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(
    CHECKOUT_SESSION_STORAGE_KEY,
    JSON.stringify(session),
  );
}

export function clearCheckoutSession(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(CHECKOUT_SESSION_STORAGE_KEY);
}

export function buildCheckoutSession(input: {
  address: CheckoutAddressFormValues;
  location: SelectedCheckoutLocation;
  quote: ConfirmedDeliveryQuote;
}): CheckoutSession {
  return {
    address: { ...INITIAL_CHECKOUT_ADDRESS, ...input.address },
    addressPayload: toCheckoutAddressPayload(input.address),
    location: input.location,
    quote: input.quote,
    updatedAt: new Date().toISOString(),
  };
}

export function formatCheckoutAddressLines(
  address: CheckoutAddressFormValues,
): string[] {
  const lines = [
    address.addressLine1.trim(),
    address.addressLine2.trim(),
    [address.landmark.trim() && `Near ${address.landmark.trim()}`, address.area.trim()]
      .filter(Boolean)
      .join(" · "),
    [address.city.trim(), address.region.trim()].filter(Boolean).join(", "),
    address.countryCode.trim().toUpperCase() === "GH"
      ? "Ghana"
      : address.countryCode.trim().toUpperCase(),
  ].filter(Boolean);

  return lines;
}
