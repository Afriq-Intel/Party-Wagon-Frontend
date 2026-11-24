/**
 * Informational Paystack channels shown on the payment page.
 * Actual method selection happens inside Paystack Checkout.
 */

import type { PaystackChannelInfo } from "@/types/checkout";

export const PAYSTACK_SUPPORTED_CHANNELS: PaystackChannelInfo[] = [
  {
    id: "mobile_money",
    label: "Mobile Money",
    description: "MTN, Telecel, and AirtelTigo via Paystack Checkout.",
  },
  {
    id: "card",
    label: "Cards",
    description: "Visa and Mastercard via Paystack Checkout.",
  },
];
