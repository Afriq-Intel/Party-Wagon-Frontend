/**
 * MOCK DATA — Operations partner application verification queue.
 * Not live backend records. Approval provisions a directory partner account
 * in mock state (no real credentials or emails).
 */
import {
  formatBusinessCategoryLabel,
  PARTNER_CAPABILITY_OPTIONS,
} from "@/lib/data/partner-application";
import type {
  PartnerCapability,
  PartnerSelectedBusinessCategory,
} from "@/types/partner-application";
import type {
  OperationsPartnerApplication,
  OperationsPartnerApplicationStatus,
} from "@/types/operations-partners";

export const OPERATIONS_PARTNER_APPLICATION_STATUSES: OperationsPartnerApplicationStatus[] =
  [
    "pending_verification",
    "more_info_required",
    "approved",
    "rejected",
  ];

export const OPERATIONS_PARTNER_APPLICATIONS_PAGE_SIZE = 8;

export function partnerCapabilityLabel(capability: PartnerCapability): string {
  return (
    PARTNER_CAPABILITY_OPTIONS.find((option) => option.value === capability)
      ?.label ?? capability
  );
}

export function partnerApplicationStatusLabel(
  status: OperationsPartnerApplicationStatus,
): string {
  switch (status) {
    case "pending_verification":
      return "Pending verification";
    case "more_info_required":
      return "More information required";
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    default:
      return status;
  }
}

export function formatPartnerApplicationDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatPartnerApplicationDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function clonePartnerApplication(
  application: OperationsPartnerApplication,
): OperationsPartnerApplication {
  return {
    ...application,
    businessCategories: application.businessCategories.map((category) => ({
      ...category,
    })),
    documents: application.documents.map((doc) => ({ ...doc })),
  };
}

export function formatPartnerApplicationCategories(
  categories: PartnerSelectedBusinessCategory[],
): string {
  if (!categories.length) return "-";
  return categories.map(formatBusinessCategoryLabel).join(", ");
}

export function createMockPartnerApplications(): OperationsPartnerApplication[] {
  return MOCK_PARTNER_APPLICATIONS.map(clonePartnerApplication);
}

export function countPartnerApplicationsByStatus(
  applications: OperationsPartnerApplication[],
  status: OperationsPartnerApplicationStatus,
): number {
  return applications.filter((application) => application.status === status)
    .length;
}

/** Pending queue only — excludes approved, rejected, and more-info rows. */
export function countPendingPartnerApplications(
  applications: OperationsPartnerApplication[],
): number {
  return countPartnerApplicationsByStatus(
    applications,
    "pending_verification",
  );
}

export function countTotalPartnerApplications(
  applications: OperationsPartnerApplication[],
): number {
  return applications.length;
}

const MOCK_PARTNER_APPLICATIONS: OperationsPartnerApplication[] = [
  {
    id: "app-accra-night",
    referenceId: "PW-PA-ACCRAN-M8K2P1",
    businessName: "Accra Night Supplies",
    contactName: "Kwame Mensah",
    email: "kwame@accranight.gh",
    phone: "+233 24 555 0182",
    address: "Spintex Road, Accra",
    capability: "darkstore",
    businessCategories: [
      { kind: "product", name: "Beer" },
      { kind: "product", name: "Soft Drinks" },
      { kind: "product", name: "Party Food" },
    ],
    description:
      "Darkstore stocking beers, soft drinks, ice, and party platters for same-day fulfilment across Accra East.",
    productsOffered:
      "Lager and stout packs, soft drinks, ice bags, finger-food platters, disposable cups.",
    servicesOffered: "",
    documents: [
      {
        id: "doc-ans-1",
        name: "business-registration.pdf",
        sizeBytes: 420_000,
      },
      {
        id: "doc-ans-2",
        name: "warehouse-photos.jpg",
        sizeBytes: 1_850_000,
      },
    ],
    status: "pending_verification",
    submittedAt: "2026-11-18T09:24:00.000Z",
    updatedAt: "2026-11-18T09:24:00.000Z",
    rejectionReason: null,
    moreInfoMessage: null,
    reviewNotes: null,
    partnerId: null,
  },
  {
    id: "app-vibes-dj",
    referenceId: "PW-PA-VIBESD-M7Q9R2",
    businessName: "Vibes DJ Collective",
    contactName: "Ama Owusu",
    email: "ama@vibesdj.gh",
    phone: "+233 20 441 7780",
    address: "Osu, Accra",
    capability: "service_provider",
    businessCategories: [
      { kind: "service", name: "DJ" },
      { kind: "service", name: "MC & Hosting" },
    ],
    description:
      "Wedding and corporate DJ packages with sound setup across Greater Accra.",
    productsOffered: "",
    servicesOffered:
      "DJ sets, MC add-ons, basic lighting, sound system hire for 50–300 guests.",
    documents: [
      {
        id: "doc-vdj-1",
        name: "sample-set-reel.pdf",
        sizeBytes: 980_000,
      },
    ],
    status: "pending_verification",
    submittedAt: "2026-11-17T14:05:00.000Z",
    updatedAt: "2026-11-17T14:05:00.000Z",
    rejectionReason: null,
    moreInfoMessage: null,
    reviewNotes: null,
    partnerId: null,
  },
  {
    id: "app-kumasi-party",
    referenceId: "PW-PA-KUMASI-M6N4T8",
    businessName: "Kumasi Party Hub",
    contactName: "Yaw Boateng",
    email: "yaw@kumasiparty.gh",
    phone: "+233 55 210 9033",
    address: "Ahodwo, Kumasi",
    capability: "both",
    businessCategories: [
      { kind: "product", name: "Champagne" },
      { kind: "product", name: "Wine" },
      { kind: "product", name: "Soft Drinks" },
      { kind: "product", name: "Party Food" },
      { kind: "service", name: "Mobile Bar" },
      { kind: "service", name: "Catering" },
    ],
    description:
      "Regional darkstore plus mobile bar and catering crews for Ashanti Region events.",
    productsOffered:
      "Champagne, wines, soft drinks, grilled platters, snack boxes.",
    servicesOffered: "Mobile bar, catering staff, event setup support.",
    documents: [
      {
        id: "doc-kph-1",
        name: "tax-clearance.pdf",
        sizeBytes: 310_000,
      },
      {
        id: "doc-kph-2",
        name: "menu-brochure.pdf",
        sizeBytes: 2_100_000,
      },
    ],
    status: "more_info_required",
    submittedAt: "2026-11-12T11:40:00.000Z",
    updatedAt: "2026-11-15T08:12:00.000Z",
    rejectionReason: null,
    moreInfoMessage:
      "Please share cold-storage capacity details and proof of food-handling certification for the catering team.",
    reviewNotes: null,
    partnerId: null,
  },
  {
    id: "app-coastal-bar",
    referenceId: "PW-PA-COASTA-M5H1W3",
    businessName: "Coastal Mobile Bar",
    contactName: "Efua Addo",
    email: "efua@coastalbar.gh",
    phone: "+233 27 889 4412",
    address: "Cape Coast",
    capability: "service_provider",
    businessCategories: [
      { kind: "service", name: "Mobile Bar" },
      { kind: "service", name: "Mixologist" },
    ],
    description:
      "Premium mobile cocktail bar for beach weddings and private dinners.",
    productsOffered: "",
    servicesOffered:
      "Mixologist packages, cocktail menus, glassware hire, staffed bar service.",
    documents: [],
    status: "approved",
    submittedAt: "2026-11-02T16:20:00.000Z",
    updatedAt: "2026-11-08T10:05:00.000Z",
    rejectionReason: null,
    moreInfoMessage: null,
    reviewNotes:
      "Verified service portfolio. Partner account PW-PRT-COAST1 provisioned; temporary credentials marked sent securely.",
    partnerId: "PW-PRT-COAST1",
  },
  {
    id: "app-northside",
    referenceId: "PW-PA-NORTHS-M4G8Z0",
    businessName: "Northside Depot",
    contactName: "Ibrahim Fuseini",
    email: "ibrahim@northsidedepot.gh",
    phone: "+233 24 100 6621",
    address: "Tamale Central",
    capability: "darkstore",
    businessCategories: [
      { kind: "product", name: "Soft Drinks" },
      { kind: "product", name: "Party Food" },
    ],
    description:
      "Proposed darkstore covering Tamale with soft drinks and packaged snacks.",
    productsOffered: "Soft drinks, bottled water, snack packs.",
    servicesOffered: "",
    documents: [
      {
        id: "doc-nsd-1",
        name: "storefront.jpg",
        sizeBytes: 740_000,
      },
    ],
    status: "rejected",
    submittedAt: "2026-10-28T09:00:00.000Z",
    updatedAt: "2026-11-01T13:45:00.000Z",
    rejectionReason:
      "Coverage area and inventory depth do not yet meet Party Wagon fulfilment requirements for Northern Region launch.",
    moreInfoMessage: null,
    reviewNotes: null,
    partnerId: null,
  },
  {
    id: "app-glow-events",
    referenceId: "PW-PA-GLOWEV-M9C3L7",
    businessName: "Glow Events GH",
    contactName: "Nana Adjei",
    email: "nana@glowevents.gh",
    phone: "+233 50 332 1190",
    address: "East Legon, Accra",
    capability: "both",
    businessCategories: [
      { kind: "product", name: "Champagne" },
      { kind: "product", name: "Cocktails" },
      { kind: "product", name: "Party Food" },
      { kind: "service", name: "Event Décor" },
    ],
    description:
      "Boutique event supplier offering décor packages and a small curated drinks catalogue.",
    productsOffered: "Sparkling wines, mocktail kits, dessert platters.",
    servicesOffered: "Event décor, balloon styling, on-site coordination.",
    documents: [
      {
        id: "doc-geg-1",
        name: "portfolio.pdf",
        sizeBytes: 3_400_000,
      },
    ],
    status: "pending_verification",
    submittedAt: "2026-11-19T18:30:00.000Z",
    updatedAt: "2026-11-19T18:30:00.000Z",
    rejectionReason: null,
    moreInfoMessage: null,
    reviewNotes: null,
    partnerId: null,
  },
];
