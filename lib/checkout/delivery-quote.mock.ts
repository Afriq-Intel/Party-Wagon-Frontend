/**
 * MOCK DELIVERY QUOTE — UI fixtures only.
 *
 * Isolated from live pricing. Replace via `lib/checkout/delivery-quote.ts`
 * when the backend delivery-quote endpoint is ready.
 * No network calls are made here.
 *
 * Quotes delivery fee only — never invents an arrival ETA. Ops confirms
 * delivery time after order review and driver assignment.
 */

import type { DeliveryQuoteRequest } from "@/types/checkout";

export const MOCK_DELIVERY_QUOTE_PROVIDER_ID = "mock-delivery-quote-ui";

/** Demo fee shown after a successful mock quote. */
export const MOCK_DELIVERY_FEE_GHS = 35;
export const MOCK_DELIVERY_FEE_LABEL = "GH₵35.00";

/**
 * Suggestion / area ids treated as out of delivery range for demo.
 * Keep this list in the mock module so real zone rules never depend on it.
 */
export const MOCK_UNAVAILABLE_LOCATION_IDS = new Set([
  "mock-kasoa",
]);

export const MOCK_UNAVAILABLE_AREA_NAMES = new Set([
  "kasoa",
]);

const MOCK_QUOTE_DELAY_MS = 750;

export type MockDeliveryQuoteResult =
  | {
      available: true;
      feeGhs: number;
      feeLabel: string;
      isMock: true;
    }
  | {
      available: false;
      reason: string;
      isMock: true;
    };

function isMockUnavailable(request: DeliveryQuoteRequest): boolean {
  if (request.locationId && MOCK_UNAVAILABLE_LOCATION_IDS.has(request.locationId)) {
    return true;
  }
  const area = request.area?.trim().toLowerCase();
  if (area && MOCK_UNAVAILABLE_AREA_NAMES.has(area)) {
    return true;
  }
  const city = request.city?.trim().toLowerCase();
  if (city && MOCK_UNAVAILABLE_AREA_NAMES.has(city)) {
    return true;
  }
  return false;
}

/**
 * Simulates a delivery fee quote for checkout UI.
 * Swap this out through the provider boundary — do not call APIs from here.
 */
export async function requestMockDeliveryQuote(
  request: DeliveryQuoteRequest,
): Promise<MockDeliveryQuoteResult> {
  await new Promise((resolve) => {
    window.setTimeout(resolve, MOCK_QUOTE_DELAY_MS);
  });

  if (isMockUnavailable(request)) {
    return {
      available: false,
      reason:
        "Delivery isn’t available for this area yet (demo). Try Accra, Tema, Kumasi, or Takoradi.",
      isMock: true,
    };
  }

  // Missing place hints should be gated in UI before calling the provider.
  // Still guard here so the mock never invents a fee for an empty request.
  if (!request.city?.trim() && !request.area?.trim() && !request.locationId) {
    return {
      available: false,
      reason: "Add a city or area so we can calculate a delivery fee.",
      isMock: true,
    };
  }

  return {
    available: true,
    feeGhs: MOCK_DELIVERY_FEE_GHS,
    feeLabel: MOCK_DELIVERY_FEE_LABEL,
    isMock: true,
  };
}
