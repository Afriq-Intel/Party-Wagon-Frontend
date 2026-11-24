/** Address label presets for saved-address UX (maps to user_addresses.label). */
export type CheckoutAddressLabel = "Home" | "Work" | "Other";

/**
 * Checkout address form values.
 * Aligns with Prisma `addresses` + `user_addresses` for a future API payload.
 */
export type CheckoutAddressFormValues = {
  recipientName: string;
  phone: string;
  /** House number, street, or plot description. */
  addressLine1: string;
  addressLine2: string;
  /** Nearby landmark (Ghana-friendly delivery cue). */
  landmark: string;
  area: string;
  city: string;
  region: string;
  /** ISO 3166-1 alpha-2 — matches addresses.country_code */
  countryCode: string;
  postalCode: string;
  /** Display string from a location provider when available. */
  formattedAddress: string;
  deliveryInstructions: string;
  label: CheckoutAddressLabel;
  isDefault: boolean;
};

/** Provider-agnostic location suggestion for autocomplete UI. */
export type CheckoutLocationSuggestion = {
  id: string;
  primaryText: string;
  secondaryText: string;
  kind: "area" | "landmark" | "estate" | "place";
  area?: string;
  city: string;
  region?: string;
  countryCode: string;
  formattedAddress: string;
  latitude?: number;
  longitude?: number;
};

export type CheckoutLocationSource = "suggestion" | "device" | "manual";

/** Currently selected location pin for map / confirmation UI. */
export type SelectedCheckoutLocation = {
  source: CheckoutLocationSource;
  title: string;
  subtitle: string;
  area?: string;
  city?: string;
  region?: string;
  countryCode?: string;
  countryName?: string;
  suggestionId?: string;
  latitude?: number | null;
  longitude?: number | null;
};

export type LocationSearchStatus =
  | "idle"
  | "loading"
  | "ready"
  | "empty"
  | "error";

export type CheckoutAddressFieldErrors = Partial<
  Record<keyof CheckoutAddressFormValues, string>
>;

/**
 * Normalized payload ready for a future address / quote API.
 * Optional fields are omitted when empty.
 */
export type CheckoutAddressPayload = {
  recipient_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  landmark?: string;
  area?: string;
  city: string;
  region?: string;
  country_code: string;
  postal_code?: string;
  formatted_address?: string;
  delivery_instructions?: string;
  label: CheckoutAddressLabel;
  is_default: boolean;
};

/** Delivery quote UI states — API wiring can drive these later. */
export type DeliveryQuoteStatus =
  | "needs_address"
  | "ready_for_quote"
  | "loading"
  | "quoted"
  | "unavailable"
  | "error";

export type DeliveryQuotePlaceholder = {
  status: DeliveryQuoteStatus;
  feeLabel?: string;
  /** Numeric fee for order-total math when status is `quoted`. */
  feeGhs?: number;
  message?: string;
  errorMessage?: string;
};

/** Input shape for a future delivery-quote API. */
export type DeliveryQuoteRequest = {
  locationId?: string;
  area?: string;
  city?: string;
  region?: string;
  countryCode?: string;
  source?: string;
};

/** Snapshot of a successful mock/live delivery fee quote for payment. */
export type ConfirmedDeliveryQuote = {
  feeGhs: number;
  feeLabel: string;
};

/**
 * Persisted checkout handoff between /checkout and /payment.
 * Stored client-side until a real checkout/order API exists.
 */
export type CheckoutSession = {
  address: CheckoutAddressFormValues;
  addressPayload: CheckoutAddressPayload;
  location: SelectedCheckoutLocation;
  quote: ConfirmedDeliveryQuote;
  updatedAt: string;
};

/** Informational Paystack channel labels (Checkout chooses the method). */
export type PaystackChannelId = "mobile_money" | "card";

export type PaystackChannelInfo = {
  id: PaystackChannelId;
  label: string;
  description: string;
};

/** Request the backend will accept when initializing Paystack. */
export type InitializePaystackPaymentRequest = {
  amountGhs: number;
  currency: "GHS";
  customerEmail?: string;
  customerPhone?: string;
  metadata: {
    subtotalGhs: number;
    deliveryFeeGhs: number;
    itemCount: number;
    deliveryCity?: string;
  };
};

/**
 * Result of payment initialization.
 * `ready` is reserved for a live backend response with an authorization URL.
 * Never put secret keys in this payload.
 */
export type InitializePaystackPaymentResult =
  | {
      status: "ready";
      authorizationUrl: string;
      reference: string;
      accessCode?: string;
    }
  | {
      status: "pending_backend";
      message: string;
    }
  | {
      status: "error";
      message: string;
    }
  | {
      status: "cancelled";
      message: string;
    };

export type PaystackUiStatus =
  | "idle"
  | "loading"
  | "pending_backend"
  | "error"
  | "cancelled";
