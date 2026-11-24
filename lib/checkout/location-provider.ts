/**
 * Location suggestion provider boundary.
 *
 * Checkout UI depends on this module — not on the mock file directly —
 * so a real Ghana geocoding / places provider can be swapped in later
 * without rewriting the autocomplete components.
 */

import type {
  CheckoutAddressFormValues,
  CheckoutLocationSuggestion,
  SelectedCheckoutLocation,
} from "@/types/checkout";
import { COUNTRY_OPTIONS } from "@/lib/checkout/address";
import {
  MOCK_LOCATION_PROVIDER_ID,
  filterMockLocationSuggestions,
} from "@/lib/checkout/location-suggestions.mock";

export type LocationSuggestionProvider = {
  id: string;
  /** True while still using UI fixtures (not a live provider). */
  isMock: boolean;
  /** Local/sync search today; a live provider can still return arrays. */
  search: (query: string) => CheckoutLocationSuggestion[];
};

const mockProvider: LocationSuggestionProvider = {
  id: MOCK_LOCATION_PROVIDER_ID,
  isMock: true,
  search: filterMockLocationSuggestions,
};

/** Active provider — replace body when a real location API is ready. */
export function getLocationSuggestionProvider(): LocationSuggestionProvider {
  return mockProvider;
}

export function countryNameForCode(countryCode: string): string {
  const match = COUNTRY_OPTIONS.find(
    (country) => country.code === countryCode.toUpperCase(),
  );
  return match?.name ?? countryCode.toUpperCase();
}

export function applySuggestionToAddressFields(
  suggestion: CheckoutLocationSuggestion,
): Pick<
  CheckoutAddressFormValues,
  | "area"
  | "city"
  | "region"
  | "countryCode"
  | "formattedAddress"
  | "landmark"
> {
  return {
    area: suggestion.area ?? "",
    city: suggestion.city,
    region: suggestion.region ?? "",
    countryCode: suggestion.countryCode,
    formattedAddress: suggestion.formattedAddress,
    landmark: suggestion.kind === "landmark" ? suggestion.primaryText : "",
  };
}

export function selectedLocationFromSuggestion(
  suggestion: CheckoutLocationSuggestion,
): SelectedCheckoutLocation {
  return {
    source: "suggestion",
    title: suggestion.primaryText,
    subtitle: suggestion.formattedAddress,
    area: suggestion.area,
    city: suggestion.city,
    region: suggestion.region,
    countryCode: suggestion.countryCode,
    countryName: countryNameForCode(suggestion.countryCode),
    suggestionId: suggestion.id,
    latitude: suggestion.latitude ?? null,
    longitude: suggestion.longitude ?? null,
  };
}
