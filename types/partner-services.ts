/**
 * Partner workspace — My Services types.
 * Shaped for a future partner_services API — mock UI only for now.
 */

export type PartnerServiceStatus = "active" | "draft" | "inactive";

export type PartnerServiceAvailability =
  | "available"
  | "limited"
  | "unavailable";

export type PartnerServiceCategory =
  | "DJ"
  | "Mixologist"
  | "Catering"
  | "Mobile Bar"
  | "MC & Hosting"
  | "Event Décor"
  | "Photography";

export type PartnerServicePackage = {
  id: string;
  name: string;
  /** Numeric GHS amount when known. */
  priceGhs: number;
  /** e.g. event, hour, guest */
  pricingUnit: string;
  description?: string;
};

export type PartnerService = {
  id: string;
  /** Owning partner account id (OperationsPartnerAccount.partnerId). */
  partnerId: string;
  name: string;
  category: PartnerServiceCategory;
  description: string;
  image: string;
  /** Base / starting price in GHS. */
  priceGhs: number;
  /** e.g. event, hour, guest */
  pricingUnit: string;
  /** Human-readable duration, e.g. "3 hours", "Half day". */
  duration: string;
  status: PartnerServiceStatus;
  availability: PartnerServiceAvailability;
  /** Short coverage / booking window note. */
  availabilityNotes: string;
  packages: PartnerServicePackage[];
  /** ISO date string for last update. */
  updatedAt: string;
};

export type PartnerServiceFilters = {
  search: string;
  status: PartnerServiceStatus | "all";
};

/** Editable payload for create / edit flows. */
export type PartnerServiceEditInput = {
  name: string;
  category: PartnerServiceCategory;
  description: string;
  image: string;
  priceGhs: number;
  pricingUnit: string;
  duration: string;
  status: PartnerServiceStatus;
  availability: PartnerServiceAvailability;
  availabilityNotes: string;
  packages: PartnerServicePackage[];
};

export const PARTNER_SERVICE_CATEGORIES: PartnerServiceCategory[] = [
  "DJ",
  "Mixologist",
  "Catering",
  "Mobile Bar",
  "MC & Hosting",
  "Event Décor",
  "Photography",
];

export const PARTNER_SERVICE_STATUSES: PartnerServiceStatus[] = [
  "active",
  "draft",
  "inactive",
];

export const PARTNER_SERVICE_AVAILABILITIES: PartnerServiceAvailability[] = [
  "available",
  "limited",
  "unavailable",
];

export const PARTNER_SERVICE_PRICING_UNITS = [
  "event",
  "hour",
  "guest",
  "day",
] as const;

export type PartnerServicePricingUnit =
  (typeof PARTNER_SERVICE_PRICING_UNITS)[number];
