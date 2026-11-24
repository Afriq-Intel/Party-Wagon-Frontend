/**
 * MOCK LOCATION SUGGESTIONS — UI fixtures only.
 *
 * These entries power the checkout autocomplete interaction until a real
 * Ghana location / geocoding provider is wired. They are not live geocoding
 * results and must not be treated as verified coordinates or coverage data.
 *
 * Replace usages via `lib/checkout/location-provider.ts`.
 */

import type { CheckoutLocationSuggestion } from "@/types/checkout";

/** Explicit marker for UI / debugging that suggestions are demo fixtures. */
export const MOCK_LOCATION_PROVIDER_ID = "mock-ghana-ui-fixtures";

export const MOCK_LOCATION_SUGGESTIONS: CheckoutLocationSuggestion[] = [
  {
    id: "mock-osu-oxford",
    primaryText: "Osu Oxford Street",
    secondaryText: "Osu · Accra, Greater Accra",
    kind: "area",
    area: "Osu",
    city: "Accra",
    region: "Greater Accra",
    countryCode: "GH",
    formattedAddress: "Osu Oxford Street, Accra, Greater Accra, Ghana",
  },
  {
    id: "mock-east-legon",
    primaryText: "East Legon",
    secondaryText: "Accra, Greater Accra",
    kind: "area",
    area: "East Legon",
    city: "Accra",
    region: "Greater Accra",
    countryCode: "GH",
    formattedAddress: "East Legon, Accra, Greater Accra, Ghana",
  },
  {
    id: "mock-airport-residential",
    primaryText: "Airport Residential Area",
    secondaryText: "Accra, Greater Accra",
    kind: "estate",
    area: "Airport Residential",
    city: "Accra",
    region: "Greater Accra",
    countryCode: "GH",
    formattedAddress: "Airport Residential Area, Accra, Greater Accra, Ghana",
  },
  {
    id: "mock-labone",
    primaryText: "Labone",
    secondaryText: "Accra, Greater Accra",
    kind: "area",
    area: "Labone",
    city: "Accra",
    region: "Greater Accra",
    countryCode: "GH",
    formattedAddress: "Labone, Accra, Greater Accra, Ghana",
  },
  {
    id: "mock-cantonments",
    primaryText: "Cantonments",
    secondaryText: "Accra, Greater Accra",
    kind: "area",
    area: "Cantonments",
    city: "Accra",
    region: "Greater Accra",
    countryCode: "GH",
    formattedAddress: "Cantonments, Accra, Greater Accra, Ghana",
  },
  {
    id: "mock-achimota-mall",
    primaryText: "Achimota Mall",
    secondaryText: "Landmark · Accra, Greater Accra",
    kind: "landmark",
    area: "Achimota",
    city: "Accra",
    region: "Greater Accra",
    countryCode: "GH",
    formattedAddress: "Achimota Mall, Accra, Greater Accra, Ghana",
  },
  {
    id: "mock-madina-estate",
    primaryText: "Madina Estate",
    secondaryText: "Madina · Accra, Greater Accra",
    kind: "estate",
    area: "Madina",
    city: "Accra",
    region: "Greater Accra",
    countryCode: "GH",
    formattedAddress: "Madina Estate, Accra, Greater Accra, Ghana",
  },
  {
    id: "mock-tema-comm-25",
    primaryText: "Community 25",
    secondaryText: "Tema, Greater Accra",
    kind: "estate",
    area: "Community 25",
    city: "Tema",
    region: "Greater Accra",
    countryCode: "GH",
    formattedAddress: "Community 25, Tema, Greater Accra, Ghana",
  },
  {
    id: "mock-kasoa",
    primaryText: "Kasoa",
    secondaryText: "Central Region",
    kind: "place",
    area: "Kasoa",
    city: "Kasoa",
    region: "Central",
    countryCode: "GH",
    formattedAddress: "Kasoa, Central Region, Ghana",
  },
  {
    id: "mock-kejetia",
    primaryText: "Kejetia Market",
    secondaryText: "Landmark · Kumasi, Ashanti",
    kind: "landmark",
    area: "Kejetia",
    city: "Kumasi",
    region: "Ashanti",
    countryCode: "GH",
    formattedAddress: "Kejetia Market, Kumasi, Ashanti, Ghana",
  },
  {
    id: "mock-aduato",
    primaryText: "Ahodwo",
    secondaryText: "Kumasi, Ashanti",
    kind: "area",
    area: "Ahodwo",
    city: "Kumasi",
    region: "Ashanti",
    countryCode: "GH",
    formattedAddress: "Ahodwo, Kumasi, Ashanti, Ghana",
  },
  {
    id: "mock-takoradi-market-circle",
    primaryText: "Market Circle",
    secondaryText: "Landmark · Takoradi, Western",
    kind: "landmark",
    area: "Market Circle",
    city: "Takoradi",
    region: "Western",
    countryCode: "GH",
    formattedAddress: "Market Circle, Takoradi, Western, Ghana",
  },
];

/**
 * Filters the local fixture list synchronously.
 * No network, geocoding, or fabricated API responses.
 */
export function filterMockLocationSuggestions(
  query: string,
): CheckoutLocationSuggestion[] {
  const normalized = query.trim().toLowerCase();
  if (normalized.length < 2) return [];

  return MOCK_LOCATION_SUGGESTIONS.filter((item) => {
    const haystack = [
      item.primaryText,
      item.secondaryText,
      item.area ?? "",
      item.city,
      item.region ?? "",
      item.formattedAddress,
      item.kind,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalized);
  }).slice(0, 8);
}
