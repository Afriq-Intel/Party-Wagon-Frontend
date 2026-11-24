/**
 * MOCK Paystack initialization — frontend UI only.
 *
 * Does NOT call Paystack, does NOT redirect to a live checkout URL,
 * and does NOT invent a successful payment. Replace via
 * `lib/payments/paystack-client.ts` when the backend init endpoint exists.
 *
 * Secret keys must never appear in this file or any frontend module.
 */

import type {
  InitializePaystackPaymentRequest,
  InitializePaystackPaymentResult,
} from "@/types/checkout";

export const MOCK_PAYSTACK_PROVIDER_ID = "mock-paystack-init-ui";

const MOCK_INIT_DELAY_MS = 700;

/**
 * Simulates waiting on a backend "initialize transaction" call.
 * Always returns `pending_backend` — never a fake authorization URL.
 */
export async function mockInitializePaystackPayment(
  _request: InitializePaystackPaymentRequest,
): Promise<InitializePaystackPaymentResult> {
  await new Promise((resolve) => {
    window.setTimeout(resolve, MOCK_INIT_DELAY_MS);
  });

  return {
    status: "pending_backend",
    message:
      "Paystack Checkout is not connected yet. The backend still needs to initialize the transaction and return an authorization URL. No payment was started.",
  };
}
