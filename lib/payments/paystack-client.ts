/**
 * Paystack payment client boundary.
 *
 * UI calls this module — not the mock file directly — so a real backend
 * initialize endpoint can be wired without rewriting the payment page.
 *
 * Flow when live:
 * 1. POST checkout/payment payload to Party Wagon backend (never to Paystack
 *    with a secret key from the browser).
 * 2. Backend initializes the Paystack transaction with the secret key.
 * 3. Frontend redirects to `authorizationUrl` from the response.
 */

import type {
  InitializePaystackPaymentRequest,
  InitializePaystackPaymentResult,
} from "@/types/checkout";
import {
  MOCK_PAYSTACK_PROVIDER_ID,
  mockInitializePaystackPayment,
} from "@/lib/payments/paystack.mock";

export type PaystackPaymentClient = {
  id: string;
  isMock: boolean;
  initialize: (
    request: InitializePaystackPaymentRequest,
  ) => Promise<InitializePaystackPaymentResult>;
};

const mockClient: PaystackPaymentClient = {
  id: MOCK_PAYSTACK_PROVIDER_ID,
  isMock: true,
  initialize: mockInitializePaystackPayment,
};

/** Active client — swap body when backend Paystack init is ready. */
export function getPaystackPaymentClient(): PaystackPaymentClient {
  return mockClient;
}

/**
 * Redirect helper for a live authorization URL.
 * Kept separate so the mock path never invents a success redirect.
 */
export function redirectToPaystackCheckout(authorizationUrl: string): void {
  if (typeof window === "undefined") return;
  if (!authorizationUrl.startsWith("https://")) {
    throw new Error("Invalid Paystack authorization URL.");
  }
  window.location.assign(authorizationUrl);
}
