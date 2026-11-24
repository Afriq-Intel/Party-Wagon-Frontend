/**
 * Delivery quote provider boundary.
 *
 * Checkout depends on this module — not the mock file directly — so a real
 * backend quote endpoint can replace the mock without rewriting UI.
 *
 * Fee quoting is separate from delivery ETA. Arrival time is confirmed only
 * after Ops reviews the order and assigns a driver.
 */

import type {
  DeliveryQuotePlaceholder,
  DeliveryQuoteRequest,
  SelectedCheckoutLocation,
} from "@/types/checkout";
import {
  MOCK_DELIVERY_QUOTE_PROVIDER_ID,
  requestMockDeliveryQuote,
  type MockDeliveryQuoteResult,
} from "@/lib/checkout/delivery-quote.mock";

/** Shown in checkout/payment until Ops assigns a driver. */
export const DELIVERY_TIME_PENDING_MESSAGE =
  "Delivery time confirmed after order review and driver assignment.";

export type DeliveryQuoteProvider = {
  id: string;
  isMock: boolean;
  quote: (request: DeliveryQuoteRequest) => Promise<MockDeliveryQuoteResult>;
};

const mockProvider: DeliveryQuoteProvider = {
  id: MOCK_DELIVERY_QUOTE_PROVIDER_ID,
  isMock: true,
  quote: requestMockDeliveryQuote,
};

/** Active provider — replace with a live API client when the contract exists. */
export function getDeliveryQuoteProvider(): DeliveryQuoteProvider {
  return mockProvider;
}

export function deliveryQuoteRequestFromLocation(
  location: SelectedCheckoutLocation,
): DeliveryQuoteRequest {
  return {
    locationId: location.suggestionId,
    area: location.area,
    city: location.city,
    region: location.region,
    countryCode: location.countryCode,
    source: location.source,
  };
}

export function placeholderFromMockQuoteResult(
  result: MockDeliveryQuoteResult,
): DeliveryQuotePlaceholder {
  if (!result.available) {
    const needsPlaceDetails = /city or area/i.test(result.reason);
    if (needsPlaceDetails) {
      return {
        status: "needs_address",
        message: result.reason,
      };
    }
    return {
      status: "unavailable",
      errorMessage: result.reason,
      message: result.reason,
    };
  }

  return {
    status: "quoted",
    feeGhs: result.feeGhs,
    feeLabel: result.feeLabel,
    message: result.isMock
      ? "Mock delivery fee for UI demo — replace with the live pricing API later."
      : undefined,
  };
}

export function needsAddressQuotePlaceholder(
  message?: string,
): DeliveryQuotePlaceholder {
  return {
    status: "needs_address",
    message:
      message ??
      "Select a delivery location so we can calculate a delivery fee.",
  };
}

export function loadingQuotePlaceholder(): DeliveryQuotePlaceholder {
  return { status: "loading" };
}
