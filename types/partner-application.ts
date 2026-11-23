/**
 * Public partner application — frontend/mock types only.
 * No partner account is created from this form.
 */

export type PartnerCapability = "darkstore" | "service_provider" | "both";

/** Selected business category — reuses product/service category names from existing lists. */
export type PartnerBusinessCategoryKind = "product" | "service";

export type PartnerSelectedBusinessCategory = {
  kind: PartnerBusinessCategoryKind;
  /** Matches OPERATIONS_PRODUCT_CATEGORIES or PARTNER_SERVICE_CATEGORIES */
  name: string;
};

export type PartnerApplicationDocument = {
  id: string;
  name: string;
  sizeBytes: number;
};

export type PartnerApplicationPayload = {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  capability: PartnerCapability;
  /** Multi-select business categories based on capability */
  businessCategories: PartnerSelectedBusinessCategory[];
  description: string;
  productsOffered: string;
  servicesOffered: string;
  documents: PartnerApplicationDocument[];
};

export type PartnerApplicationFieldErrors = Partial<
  Record<
    | "businessName"
    | "contactName"
    | "email"
    | "phone"
    | "address"
    | "capability"
    | "businessCategories"
    | "description"
    | "productsOffered"
    | "servicesOffered"
    | "documents",
    string
  >
>;
