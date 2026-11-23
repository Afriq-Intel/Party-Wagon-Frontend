/**
 * Party Services page content.
 * Static marketing data until the backend services / partner APIs are available.
 * Schema reference exists (services, partner_services) but no customer-facing
 * service listing or booking endpoints are implemented yet.
 */
import type {
  PartyService,
  ServiceCategorySlug,
  ServiceReason,
} from "@/types/services";
import { SERVICE_CATEGORY_SLUGS } from "@/lib/data/services-demo";

export const SERVICES_MARQUEE = [
  "Where the party dey, we dey",
  "Music, drinks, food: sorted",
  "Your party. Your vibe. Our plug.",
  "Ready, Set, Enjoy!",
] as const;

export const SERVICE_IMAGES = {
  hero: "/assets/services/hero-party.jpg",
  why: "/assets/services/why-choose.jpg",
  cta: "/assets/services/cta-banner.jpg",
} as const;

/** Category listing pages for onboarded core services. */
export function getServiceCategoryHref(slug: ServiceCategorySlug | string): string {
  return `/services/${slug}`;
}

/** Enquiry destination until booking APIs exist. Reuses the Party Planner route. */
export function getServiceEnquiryHref(slug: string): string {
  return `/planner?service=${encodeURIComponent(slug)}&intent=enquiry`;
}

/** Explore / register CTA target for a services overview card. */
export function getServiceExploreHref(service: PartyService): string {
  const isCategoryRoute = (SERVICE_CATEGORY_SLUGS as readonly string[]).includes(
    service.slug,
  );
  if (service.availability === "available" && isCategoryRoute) {
    return getServiceCategoryHref(service.slug);
  }
  return getServiceEnquiryHref(service.slug);
}

export const CORE_SERVICES: PartyService[] = [
  {
    id: "dj",
    slug: "dj",
    name: "DJ Services",
    description:
      "Professional DJs for birthdays, weddings, corporate events and private parties. We bring the soundtrack; you bring the dance moves.",
    image: "/assets/services/dj-services.jpg",
    imageAlt:
      "Professional DJ performing at an energetic night event with lighting and crowd",
    availability: "available",
    backendCode: "dj",
  },
  {
    id: "mixtologists",
    slug: "mixtologists",
    name: "Mixtologist Services",
    description:
      "Professional cocktail preparation and customised drink experiences. Colourful pours, sharp vibes, zero stress behind the bar.",
    image: "/assets/services/mixologist-services.jpg",
    imageAlt:
      "Skilled mixologist flaming a citrus garnish on a cocktail at a stylish bar",
    availability: "available",
    backendCode: "mixologist",
  },
  {
    id: "catering",
    slug: "catering",
    name: "Catering Services",
    description:
      "Food platters, finger foods and catering options for every kind of gathering. Guests chop; you enjoy the moment.",
    image: "/assets/services/catering-services.jpg",
    imageAlt:
      "Beautifully arranged party platters, appetisers and event buffet spread",
    availability: "available",
    backendCode: "catering",
  },
  {
    id: "mobile-bar",
    slug: "mobile-bar",
    name: "Mobile Bar Services",
    description:
      "Professional bar setups and drink service brought straight to your event. We roll up; the party level ups.",
    image: "/assets/services/mobile-bar-services.jpg",
    imageAlt:
      "Stylish outdoor mobile bar setup with bartender preparing drinks",
    availability: "available",
    backendCode: "mobile-bar",
  },
];

/** Optional services — shown as Coming Soon pending business confirmation. */
export const ADDITIONAL_SERVICES: PartyService[] = [
  {
    id: "mc-hosting",
    slug: "mc-hosting",
    name: "MC and Event Hosting",
    description:
      "Professional hosts and MCs to keep the energy up and the programme flowing.",
    image: "/assets/services/mc-hosting.jpg",
    imageAlt: "Performer with microphone energising a live stage crowd",
    availability: "coming-soon",
  },
  {
    id: "decorations",
    slug: "decorations",
    name: "Event Decoration and Styling",
    description:
      "Decorations, themed setups and styling that match the vibe you want.",
    image: "/assets/services/event-decorations.jpg",
    imageAlt: "Beautifully decorated outdoor celebration with floral styling",
    availability: "coming-soon",
  },
  {
    id: "photography",
    slug: "photography",
    name: "Photography and Videography",
    description:
      "Professional event coverage so the good times live longer than the night.",
    image: "/assets/services/photography-videography.jpg",
    imageAlt: "Professional videographer capturing moments with a cinema camera",
    availability: "coming-soon",
  },
];

export const SERVICE_REASONS: ServiceReason[] = [
  {
    id: "one-stop",
    title: "One plug. Whole party.",
    copy: "Drinks, food, and the people who make the night move, all in one place. No endless chasing around.",
  },
  {
    id: "less-stress",
    title: "Less wahala. More vibes.",
    copy: "Organising a gathering should feel exciting, not exhausting. We help take the stress off your plate.",
  },
  {
    id: "personalised",
    title: "Your vibe, your way.",
    copy: "Tell us what you're celebrating and how you want it to feel. We shape the service mix around you.",
  },
  {
    id: "dependable",
    title: "From plan to party.",
    copy: "Where the party dey, we dey. Count on a dependable experience from the first chat to the last toast.",
  },
];
