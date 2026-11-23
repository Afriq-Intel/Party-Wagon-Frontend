/**
 * MOCK DATA — Partner My Services visual development only.
 * Not live partner_services records. Replace with confirmed partner APIs later.
 */
import type {
  PartnerService,
  PartnerServiceAvailability,
  PartnerServiceEditInput,
  PartnerServiceStatus,
} from "@/types/partner-services";

export const PARTNER_SERVICES_PAGE_SIZE = 8;

export const PARTNER_SERVICES_STORAGE_KEY = "party-wagon-partner-services-v1";

/** Extra service images available for mock “add image” interactions. */
export const MOCK_PARTNER_SERVICE_IMAGE_POOL = [
  "/assets/services/dj-services.jpg",
  "/assets/services/mixologist-services.jpg",
  "/assets/services/catering-services.jpg",
  "/assets/services/mobile-bar-services.jpg",
  "/assets/services/mc-hosting.jpg",
  "/assets/services/event-decorations.jpg",
  "/assets/services/photography-videography.jpg",
  "/assets/services/providers/dj-provider-1.jpg",
  "/assets/services/providers/mix-provider-1.jpg",
  "/assets/services/providers/catering-provider-1.jpg",
  "/assets/services/providers/bar-provider-1.jpg",
] as const;

export function partnerServiceStatusLabel(status: PartnerServiceStatus): string {
  switch (status) {
    case "active":
      return "Active";
    case "draft":
      return "Draft";
    case "inactive":
      return "Inactive";
  }
}

export function partnerServiceStatusHint(status: PartnerServiceStatus): string {
  switch (status) {
    case "active":
      return "Visible to celebration hosts when they browse services.";
    case "draft":
      return "Hidden from customers while you finish the listing.";
    case "inactive":
      return "Deactivated — not bookable until you reactivate it.";
  }
}

export function partnerServiceAvailabilityLabel(
  availability: PartnerServiceAvailability,
): string {
  switch (availability) {
    case "available":
      return "Available";
    case "limited":
      return "Limited";
    case "unavailable":
      return "Unavailable";
  }
}

export function formatPartnerServicePrice(
  priceGhs: number,
  pricingUnit?: string,
): string {
  const amount = new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 0,
  }).format(priceGhs);
  if (!pricingUnit) return amount;
  return `From ${amount} / ${pricingUnit}`;
}

export function formatPartnerServiceUpdatedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function clonePartnerService(service: PartnerService): PartnerService {
  return {
    ...service,
    packages: service.packages.map((pkg) => ({ ...pkg })),
  };
}

/** Build a full edit payload from an existing service (for partial package/price updates). */
export function serviceToEditInput(
  service: PartnerService,
): PartnerServiceEditInput {
  return {
    name: service.name,
    category: service.category,
    description: service.description,
    image: service.image,
    priceGhs: service.priceGhs,
    pricingUnit: service.pricingUnit,
    duration: service.duration,
    status: service.status,
    availability: service.availability,
    availabilityNotes: service.availabilityNotes,
    packages: service.packages.map((pkg) => ({ ...pkg })),
  };
}

/**
 * Seed listings for the mock service-provider partners.
 * Coastal Mobile Bar (PW-PRT-COAST1) and Glow Events Catering (PW-PRT-GLOW1).
 */
export function createMockPartnerServices(): PartnerService[] {
  return [
    {
      id: "svc-coast-signature-bar",
      partnerId: "PW-PRT-COAST1",
      name: "Signature Mobile Cocktail Bar",
      category: "Mobile Bar",
      description:
        "Fully staffed cocktail bar with signature mixes, glassware, and coastal-ready setup for beach weddings and private dinners.",
      image: "/assets/services/mobile-bar-services.jpg",
      priceGhs: 2800,
      pricingUnit: "event",
      duration: "4 hours",
      status: "active",
      availability: "available",
      availabilityNotes: "Fri–Sun · Cape Coast & Elmina",
      packages: [
        {
          id: "pkg-coast-classic",
          name: "Classic bar setup",
          priceGhs: 2800,
          pricingUnit: "event",
          description: "2 mixologists · 3 signature cocktails · glassware",
        },
        {
          id: "pkg-coast-premium",
          name: "Premium celebration bar",
          priceGhs: 4200,
          pricingUnit: "event",
          description: "3 mixologists · tasting flight · décor lighting",
        },
      ],
      updatedAt: "2026-11-12T09:20:00.000Z",
    },
    {
      id: "svc-coast-sunset-sips",
      partnerId: "PW-PRT-COAST1",
      name: "Sunset Sips Experience",
      category: "Mixologist",
      description:
        "Intimate mixology session for smaller gatherings — welcome drinks, a short cocktail class, and plated canapés pairing.",
      image: "/assets/services/mixologist-services.jpg",
      priceGhs: 1600,
      pricingUnit: "event",
      duration: "2.5 hours",
      status: "active",
      availability: "limited",
      availabilityNotes: "Saturday evenings only · max 40 guests",
      packages: [
        {
          id: "pkg-coast-sips",
          name: "Sunset package",
          priceGhs: 1600,
          pricingUnit: "event",
          description: "Welcome punch · 2 cocktails · tasting notes",
        },
      ],
      updatedAt: "2026-11-10T14:05:00.000Z",
    },
    {
      id: "svc-coast-draft-mocktails",
      partnerId: "PW-PRT-COAST1",
      name: "Zero-Proof Mocktail Bar",
      category: "Mobile Bar",
      description:
        "Alcohol-free bar experience with house infusions and fruit-forward mocktails — still polishing the menu before launch.",
      image: "/assets/services/providers/bar-provider-1.jpg",
      priceGhs: 1400,
      pricingUnit: "event",
      duration: "3 hours",
      status: "draft",
      availability: "unavailable",
      availabilityNotes: "Not listed yet — finishing flavour menu",
      packages: [
        {
          id: "pkg-coast-mock",
          name: "Mocktail essentials",
          priceGhs: 1400,
          pricingUnit: "event",
        },
      ],
      updatedAt: "2026-11-18T08:40:00.000Z",
    },
    {
      id: "svc-glow-private-chef",
      partnerId: "PW-PRT-GLOW1",
      name: "Private Chef Experience",
      category: "Catering",
      description:
        "Home-style celebration catering with plated mains, side platters, and on-site plating for birthdays and intimate dinners.",
      image: "/assets/services/catering-services.jpg",
      priceGhs: 2200,
      pricingUnit: "event",
      duration: "Half day",
      status: "active",
      availability: "available",
      availabilityNotes: "Wed–Sun · Tema & Accra East",
      packages: [
        {
          id: "pkg-glow-chef-20",
          name: "Up to 20 guests",
          priceGhs: 2200,
          pricingUnit: "event",
          description: "3-course set · service staff · clearing",
        },
        {
          id: "pkg-glow-chef-40",
          name: "Up to 40 guests",
          priceGhs: 3600,
          pricingUnit: "event",
          description: "Buffet + plated desserts · 2 servers",
        },
      ],
      updatedAt: "2026-11-16T11:10:00.000Z",
    },
    {
      id: "svc-glow-wedding-spread",
      partnerId: "PW-PRT-GLOW1",
      name: "Garden Wedding Spread",
      category: "Catering",
      description:
        "Celebration buffet built for garden weddings — live stations, vegetarian options, and coordinated plating with your décor team.",
      image: "/assets/services/providers/catering-provider-1.jpg",
      priceGhs: 95,
      pricingUnit: "guest",
      duration: "Full day",
      status: "active",
      availability: "limited",
      availabilityNotes: "Book 14 days ahead · Greater Accra",
      packages: [
        {
          id: "pkg-glow-wedding-std",
          name: "Standard wedding buffet",
          priceGhs: 95,
          pricingUnit: "guest",
        },
        {
          id: "pkg-glow-wedding-prem",
          name: "Premium live stations",
          priceGhs: 135,
          pricingUnit: "guest",
        },
      ],
      updatedAt: "2026-11-14T16:25:00.000Z",
    },
    {
      id: "svc-glow-inactive-brunch",
      partnerId: "PW-PRT-GLOW1",
      name: "Celebration Brunch Platter",
      category: "Catering",
      description:
        "Weekend brunch platters for smaller gatherings. Temporarily paused while kitchen capacity is rebalanced.",
      image: "/assets/services/providers/catering-provider-2.jpg",
      priceGhs: 850,
      pricingUnit: "event",
      duration: "2 hours",
      status: "inactive",
      availability: "unavailable",
      availabilityNotes: "Paused until further notice",
      packages: [
        {
          id: "pkg-glow-brunch",
          name: "Brunch essentials",
          priceGhs: 850,
          pricingUnit: "event",
        },
      ],
      updatedAt: "2026-11-08T12:00:00.000Z",
    },
    {
      id: "svc-glow-draft-dessert",
      partnerId: "PW-PRT-GLOW1",
      name: "Dessert Table Styling",
      category: "Event Décor",
      description:
        "Styled dessert table with cake stands, floral accents, and sweet platters — draft listing while photos are refreshed.",
      image: "/assets/services/event-decorations.jpg",
      priceGhs: 1100,
      pricingUnit: "event",
      duration: "Setup + 4 hours",
      status: "draft",
      availability: "limited",
      availabilityNotes: "Weekends preferred · Accra metro",
      packages: [
        {
          id: "pkg-glow-dessert",
          name: "Dessert styling",
          priceGhs: 1100,
          pricingUnit: "event",
        },
      ],
      updatedAt: "2026-11-19T09:55:00.000Z",
    },
  ];
}
