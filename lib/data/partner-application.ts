/**
 * MOCK DATA / helpers — public partner application only.
 * No backend integration. Submission does not create accounts or credentials.
 */
import { OPERATIONS_PRODUCT_CATEGORIES } from "@/lib/data/operations-products";
import { PARTNER_SERVICE_CATEGORIES } from "@/types/partner-services";
import type {
  PartnerApplicationFieldErrors,
  PartnerApplicationPayload,
  PartnerBusinessCategoryKind,
  PartnerCapability,
  PartnerSelectedBusinessCategory,
} from "@/types/partner-application";

export const PARTNER_APPLY_PATH = "/partners/apply" as const;

export const PARTNER_CAPABILITY_OPTIONS: {
  value: PartnerCapability;
  label: string;
  hint: string;
}[] = [
  {
    value: "darkstore",
    label: "Darkstore",
    hint: "Stock drinks, platters, and party essentials for Party Wagon fulfilment.",
  },
  {
    value: "service_provider",
    label: "Service Provider",
    hint: "DJ, catering, mixtologist, mobile bar, and other party services.",
  },
  {
    value: "both",
    label: "Both",
    hint: "You can supply products and offer party services.",
  },
];

export type PartnerBusinessCategoryOption = PartnerSelectedBusinessCategory & {
  key: string;
  groupLabel: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+]?[\d\s()-]{8,20}$/;

export const PARTNER_DOCUMENT_ACCEPT =
  ".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp";

export const PARTNER_DOCUMENT_MAX_BYTES = 5 * 1024 * 1024;
export const PARTNER_DOCUMENT_MAX_COUNT = 5;

export function needsProductsOffered(capability: PartnerCapability | ""): boolean {
  return capability === "darkstore" || capability === "both";
}

export function needsServicesOffered(capability: PartnerCapability | ""): boolean {
  return capability === "service_provider" || capability === "both";
}

export function needsBusinessCategories(
  capability: PartnerCapability | "",
): boolean {
  return Boolean(capability);
}

function categoryKey(
  kind: PartnerBusinessCategoryKind,
  name: string,
): string {
  return `${kind}:${name}`;
}

/** Product categories from existing Operations catalogue list — not duplicated. */
export function getPartnerProductCategoryOptions(): PartnerBusinessCategoryOption[] {
  return OPERATIONS_PRODUCT_CATEGORIES.map((name) => ({
    key: categoryKey("product", name),
    kind: "product" as const,
    name,
    groupLabel: "Product categories",
  }));
}

/** Service categories from existing partner services list — not duplicated. */
export function getPartnerServiceCategoryOptions(): PartnerBusinessCategoryOption[] {
  return PARTNER_SERVICE_CATEGORIES.map((name) => ({
    key: categoryKey("service", name),
    kind: "service" as const,
    name,
    groupLabel: "Service categories",
  }));
}

/** Categories available for the selected partner capability. */
export function getBusinessCategoryOptionsForCapability(
  capability: PartnerCapability | "",
): PartnerBusinessCategoryOption[] {
  if (!capability) return [];
  if (capability === "darkstore") return getPartnerProductCategoryOptions();
  if (capability === "service_provider") {
    return getPartnerServiceCategoryOptions();
  }
  return [
    ...getPartnerProductCategoryOptions(),
    ...getPartnerServiceCategoryOptions(),
  ];
}

/** Drop selections that are no longer valid for the new capability. */
export function filterBusinessCategoriesForCapability(
  selected: PartnerSelectedBusinessCategory[],
  capability: PartnerCapability | "",
): PartnerSelectedBusinessCategory[] {
  const allowed = new Set(
    getBusinessCategoryOptionsForCapability(capability).map(
      (option) => option.key,
    ),
  );
  return selected.filter((item) =>
    allowed.has(categoryKey(item.kind, item.name)),
  );
}

export function isBusinessCategorySelected(
  selected: PartnerSelectedBusinessCategory[],
  option: PartnerBusinessCategoryOption,
): boolean {
  return selected.some(
    (item) => item.kind === option.kind && item.name === option.name,
  );
}

export function toggleBusinessCategory(
  selected: PartnerSelectedBusinessCategory[],
  option: PartnerBusinessCategoryOption,
): PartnerSelectedBusinessCategory[] {
  if (isBusinessCategorySelected(selected, option)) {
    return selected.filter(
      (item) => !(item.kind === option.kind && item.name === option.name),
    );
  }
  return [...selected, { kind: option.kind, name: option.name }];
}

export function formatBusinessCategoryLabel(
  category: PartnerSelectedBusinessCategory,
): string {
  return category.kind === "product"
    ? `Product · ${category.name}`
    : `Service · ${category.name}`;
}

export function validatePartnerApplication(
  payload: Omit<PartnerApplicationPayload, "capability"> & {
    capability: PartnerCapability | "";
  },
): PartnerApplicationFieldErrors {
  const errors: PartnerApplicationFieldErrors = {};

  if (!payload.businessName.trim()) {
    errors.businessName = "Enter your business name.";
  }
  if (!payload.contactName.trim()) {
    errors.contactName = "Enter the contact person's name.";
  }

  const email = payload.email.trim();
  if (!email) {
    errors.email = "Enter a contact email.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  const phone = payload.phone.trim();
  if (!phone) {
    errors.phone = "Enter a phone number.";
  } else if (!PHONE_PATTERN.test(phone)) {
    errors.phone = "Enter a valid phone number.";
  }

  if (!payload.address.trim()) {
    errors.address = "Enter your business location or address.";
  }

  if (!payload.capability) {
    errors.capability = "Select a partner capability.";
  }

  if (
    needsBusinessCategories(payload.capability) &&
    payload.businessCategories.length === 0
  ) {
    errors.businessCategories =
      "Select at least one business category for your capability.";
  } else if (payload.capability) {
    const valid = filterBusinessCategoriesForCapability(
      payload.businessCategories,
      payload.capability,
    );
    if (valid.length !== payload.businessCategories.length) {
      errors.businessCategories =
        "Remove categories that do not match the selected capability.";
    }
  }

  if (!payload.description.trim()) {
    errors.description = "Tell us a bit about your business.";
  }

  if (needsProductsOffered(payload.capability) && !payload.productsOffered.trim()) {
    errors.productsOffered = "List the products you can offer.";
  }

  if (needsServicesOffered(payload.capability) && !payload.servicesOffered.trim()) {
    errors.servicesOffered = "List the services you can offer.";
  }

  return errors;
}

/**
 * Mock submit — resolves locally. Does not create a partner account,
 * grant dashboard access, or issue credentials.
 */
export async function submitPartnerApplicationMock(
  payload: PartnerApplicationPayload,
): Promise<{ referenceId: string }> {
  await new Promise((resolve) => setTimeout(resolve, 700));
  const slug = payload.businessName
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "")
    .slice(0, 6);
  const referenceId = `PW-PA-${slug || "APP"}-${Date.now().toString(36).toUpperCase()}`;
  return { referenceId };
}

export function formatDocumentSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
