import type {
  CheckoutAddressFieldErrors,
  CheckoutAddressFormValues,
  CheckoutAddressLabel,
  CheckoutAddressPayload,
} from "@/types/checkout";

export const CHECKOUT_ADDRESS_LABELS: CheckoutAddressLabel[] = [
  "Home",
  "Work",
  "Other",
];

/** Default market — Party Wagon launches in Ghana. */
export const DEFAULT_COUNTRY_CODE = "GH";

export const COUNTRY_OPTIONS: { code: string; name: string }[] = [
  { code: "GH", name: "Ghana" },
];

const PHONE_PATTERN = /^[+]?[\d\s()-]{8,20}$/;

export const INITIAL_CHECKOUT_ADDRESS: CheckoutAddressFormValues = {
  recipientName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  area: "",
  city: "",
  region: "",
  countryCode: DEFAULT_COUNTRY_CODE,
  postalCode: "",
  formattedAddress: "",
  deliveryInstructions: "",
  label: "Home",
  isDefault: true,
};

function optional(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

/** Client-side validation for required checkout address fields. */
export function validateCheckoutAddress(
  values: CheckoutAddressFormValues,
): CheckoutAddressFieldErrors {
  const errors: CheckoutAddressFieldErrors = {};

  if (!values.recipientName.trim()) {
    errors.recipientName = "Enter the recipient's name.";
  }

  const phone = values.phone.trim();
  if (!phone) {
    errors.phone = "Enter a phone number.";
  } else if (!PHONE_PATTERN.test(phone)) {
    errors.phone = "Enter a valid phone number.";
  }

  if (!values.addressLine1.trim()) {
    errors.addressLine1 = "Enter house / street details.";
  }

  if (!values.city.trim()) {
    errors.city = "Enter a city or select a location.";
  }

  if (!values.countryCode.trim()) {
    errors.countryCode = "Select a country.";
  } else if (!/^[A-Za-z]{2}$/.test(values.countryCode.trim())) {
    errors.countryCode = "Use a 2-letter country code.";
  }

  if (!values.label) {
    errors.label = "Choose an address label.";
  }

  return errors;
}

export function hasCheckoutAddressErrors(
  errors: CheckoutAddressFieldErrors,
): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * Maps form values to a backend-shaped payload for later API integration.
 * Does not call any endpoint.
 */
export function toCheckoutAddressPayload(
  values: CheckoutAddressFormValues,
): CheckoutAddressPayload {
  return {
    recipient_name: values.recipientName.trim(),
    phone: values.phone.trim(),
    address_line_1: values.addressLine1.trim(),
    address_line_2: optional(values.addressLine2),
    landmark: optional(values.landmark),
    area: optional(values.area),
    city: values.city.trim(),
    region: optional(values.region),
    country_code: values.countryCode.trim().toUpperCase(),
    postal_code: optional(values.postalCode),
    formatted_address: optional(values.formattedAddress),
    delivery_instructions: optional(values.deliveryInstructions),
    label: values.label,
    is_default: values.isDefault,
  };
}
