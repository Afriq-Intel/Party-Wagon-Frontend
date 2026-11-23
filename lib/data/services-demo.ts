/**
 * TEMPORARY DEMO FIXTURES — not live Party Wagon partners / backend records.
 * Backend `src/modules/services` is an empty placeholder; Prisma has
 * services / partners / partner_services tables but no customer HTTP routes.
 * Replace via `lib/services/get-service-category.ts` when the API is ready.
 */
import type {
  ServiceCategory,
  ServiceCategorySlug,
  ServiceProvider,
} from "@/types/services";

export const DEMO_SERVICES_NOTICE =
  "Provider names, packages, and pricing shown here are temporary demo fixtures for Party Services UI, not live Party Wagon partner listings.";

export const SERVICE_CATEGORY_SLUGS: ServiceCategorySlug[] = [
  "dj",
  "mixtologists",
  "catering",
  "mobile-bar",
];

export const DEMO_SERVICE_CATEGORIES: Record<
  ServiceCategorySlug,
  ServiceCategory
> = {
  dj: {
    id: "cat-dj",
    slug: "dj",
    name: "DJ Services",
    shortName: "DJs",
    headline: "DJs Who Know How to Move a Crowd",
    intro:
      "From intimate birthdays to full wedding receptions, explore DJs who can read the room and keep the dance floor alive. Tell us the vibe and we’ll help you connect.",
    heroImage: "/assets/services/dj-services.jpg",
    heroImageAlt:
      "Professional DJ performing at an energetic night event with lighting and crowd",
    marquee: [
      "Birthdays",
      "Weddings",
      "Corporate",
      "Private parties",
      "Where the party dey, we dey",
    ],
    backendCode: "dj",
  },
  mixtologists: {
    id: "cat-mixtologists",
    slug: "mixtologists",
    name: "Mixtologist Services",
    shortName: "Mixtologists",
    headline: "Cocktails That Match the Vibe",
    intro:
      "Custom drink menus, flashy pours, and bartenders who make guests feel looked after. Browse mixtologists ready to elevate your celebration.",
    heroImage: "/assets/services/mixologist-services.jpg",
    heroImageAlt:
      "Skilled mixologist flaming a citrus garnish on a cocktail at a stylish bar",
    marquee: [
      "Signature cocktails",
      "Custom menus",
      "Event bars",
      "Zero stress pours",
      "Your vibe, your way",
    ],
    backendCode: "mixologist",
  },
  catering: {
    id: "cat-catering",
    slug: "catering",
    name: "Catering Services",
    shortName: "Caterers",
    headline: "Food That Keeps Guests Coming Back",
    intro:
      "Platters, finger foods, and full catering setups for gatherings big and small. Find caterers who can feed the room without the fuss.",
    heroImage: "/assets/services/catering-services.jpg",
    heroImageAlt:
      "Beautifully arranged party platters, appetisers and event buffet spread",
    marquee: [
      "Finger foods",
      "Party platters",
      "Buffets",
      "Guest-ready spreads",
      "Ready, Set, Enjoy!",
    ],
    backendCode: "catering",
  },
  "mobile-bar": {
    id: "cat-mobile-bar",
    slug: "mobile-bar",
    name: "Mobile Bar Services",
    shortName: "Mobile Bars",
    headline: "The Bar Comes to You",
    intro:
      "Professional bar setups rolled straight to your venue. Staff, glassware energy, and drinks service, so you can host without running the bar yourself.",
    heroImage: "/assets/services/mobile-bar-services.jpg",
    heroImageAlt:
      "Stylish outdoor mobile bar setup with bartender preparing drinks",
    marquee: [
      "On-site bars",
      "Drink service",
      "Garden parties",
      "Wedding receptions",
      "We bring the party to you",
    ],
    backendCode: "mobile-bar",
  },
};

/**
 * Demo onboarded providers. Clearly fictional — for layout/filtering only.
 * One category intentionally starts empty-ready via filter; all four have
 * sample listings so each category page has content to browse.
 */
export const DEMO_SERVICE_PROVIDERS: ServiceProvider[] = [
  {
    id: "demo-dj-pulse",
    slug: "pulse-frequency-dj",
    categorySlug: "dj",
    name: "Pulse Frequency DJ",
    description:
      "High-energy sets spanning Afrobeats, amapiano, and throwback favourites. Ideal for birthdays and after-parties.",
    image: "/assets/services/providers/dj-provider-1.jpg",
    imageAlt: "DJ performing under colourful nightclub lights",
    location: "Accra",
    coverage: "Greater Accra · up to 40km",
    verified: true,
    packages: [
      {
        id: "dj-pulse-3h",
        name: "3-hour party set",
        priceGhs: 1200,
        priceLabel: "From GHS 1,200",
        pricingUnit: "event",
      },
      {
        id: "dj-pulse-5h",
        name: "5-hour celebration set",
        priceGhs: 1800,
        priceLabel: "From GHS 1,800",
        pricingUnit: "event",
      },
    ],
  },
  {
    id: "demo-dj-velvet",
    slug: "velvet-vinyl-collective",
    categorySlug: "dj",
    name: "Velvet Vinyl Collective",
    description:
      "Smooth, curated playlists for weddings and corporate mixers, reading the room without missing a beat.",
    image: "/assets/services/providers/dj-provider-2.jpg",
    imageAlt: "DJ performing at an outdoor urban event",
    location: "Tema",
    coverage: "Tema · Accra East",
    verified: true,
    packages: [
      {
        id: "dj-velvet-half",
        name: "Half-day reception",
        priceGhs: 1500,
        priceLabel: "From GHS 1,500",
        pricingUnit: "event",
      },
    ],
  },
  {
    id: "demo-dj-nightshift",
    slug: "nightshift-sounds",
    categorySlug: "dj",
    name: "Nightshift Sounds",
    description:
      "Late-night specialists with lighting add-ons. Built for private parties that want to go long.",
    image: "/assets/services/dj-services.jpg",
    imageAlt: "DJ at a red-lit party console with headphones",
    location: "Kumasi",
    coverage: "Kumasi metro",
    packages: [
      {
        id: "dj-night-enquire",
        name: "Custom night package",
        priceLabel: "Price on enquiry",
      },
    ],
  },
  {
    id: "demo-mix-flame",
    slug: "flame-and-fizz",
    categorySlug: "mixtologists",
    name: "Flame & Fizz",
    description:
      "Theatrical cocktail service with signature garnishes and guest-facing mixology moments.",
    image: "/assets/services/mixologist-services.jpg",
    imageAlt: "Mixologist flaming a cocktail garnish",
    location: "Accra",
    coverage: "Greater Accra",
    verified: true,
    packages: [
      {
        id: "mix-flame-2h",
        name: "2-hour cocktail bar",
        priceGhs: 2000,
        priceLabel: "From GHS 2,000",
        pricingUnit: "event",
      },
      {
        id: "mix-flame-menu",
        name: "Custom 4-drink menu",
        priceGhs: 2800,
        priceLabel: "From GHS 2,800",
        pricingUnit: "event",
      },
    ],
  },
  {
    id: "demo-mix-shaker",
    slug: "shaker-room-crew",
    categorySlug: "mixtologists",
    name: "Shaker Room Crew",
    description:
      "Classic and contemporary cocktails for intimate gatherings and rooftop celebrations.",
    image: "/assets/services/providers/mix-provider-1.jpg",
    imageAlt: "Bartender preparing a cocktail with precision tools",
    location: "Accra",
    coverage: "Accra · East Legon · Airport area",
    packages: [
      {
        id: "mix-shaker-std",
        name: "Standard bar team",
        priceGhs: 1600,
        priceLabel: "From GHS 1,600",
        pricingUnit: "event",
      },
    ],
  },
  {
    id: "demo-mix-citrus",
    slug: "citrus-lane-bartenders",
    categorySlug: "mixtologists",
    name: "Citrus Lane Bartenders",
    description:
      "Fresh, colourful pours with non-alcoholic options so every guest has a glass in hand.",
    image: "/assets/services/providers/mix-provider-2.jpg",
    imageAlt: "Bartender blending a cocktail with ice",
    location: "Cape Coast",
    coverage: "Central Region (select dates)",
    packages: [
      {
        id: "mix-citrus-enquire",
        name: "Weekend event package",
        priceLabel: "Price on enquiry",
      },
    ],
  },
  {
    id: "demo-cat-platter",
    slug: "golden-platter-kitchen",
    categorySlug: "catering",
    name: "Golden Platter Kitchen",
    description:
      "Party platters, canapés, and finger-food spreads designed for mingling, not formal sit-downs.",
    image: "/assets/services/providers/catering-provider-1.jpg",
    imageAlt: "Charcuterie and party catering board",
    location: "Accra",
    coverage: "Greater Accra",
    verified: true,
    packages: [
      {
        id: "cat-platter-20",
        name: "Finger food for 20",
        priceGhs: 900,
        priceLabel: "From GHS 900",
        pricingUnit: "package",
      },
      {
        id: "cat-platter-50",
        name: "Celebration spread for 50",
        priceGhs: 2200,
        priceLabel: "From GHS 2,200",
        pricingUnit: "package",
      },
    ],
  },
  {
    id: "demo-cat-buffet",
    slug: "table-and-toast-catering",
    categorySlug: "catering",
    name: "Table & Toast Catering",
    description:
      "Buffet-style setups with colourful appetisers, great for family gatherings and office parties.",
    image: "/assets/services/providers/catering-provider-2.jpg",
    imageAlt: "Elegant gourmet appetiser buffet display",
    location: "Tema",
    coverage: "Tema · Ashaiman · Accra East",
    packages: [
      {
        id: "cat-buffet-std",
        name: "Buffet station (per guest)",
        priceGhs: 85,
        priceLabel: "From GHS 85 / guest",
        pricingUnit: "guest",
      },
    ],
  },
  {
    id: "demo-cat-bite",
    slug: "small-bites-collective",
    categorySlug: "catering",
    name: "Small Bites Collective",
    description:
      "Compact catering for house parties and intimate celebrations: tasty without overcrowding the table.",
    image: "/assets/services/catering-services.jpg",
    imageAlt: "Colourful gourmet buffet with appetisers",
    location: "Kumasi",
    coverage: "Kumasi metro",
    packages: [
      {
        id: "cat-bite-enquire",
        name: "Custom menu tasting",
        priceLabel: "Price on enquiry",
      },
    ],
  },
  {
    id: "demo-bar-wagon",
    slug: "rolling-cheers-bar",
    categorySlug: "mobile-bar",
    name: "Rolling Cheers Bar",
    description:
      "Mobile bar van with bartenders, basic glassware, and a ready-to-serve setup for outdoor events.",
    image: "/assets/services/mobile-bar-services.jpg",
    imageAlt: "Bartender at a blue outdoor mobile bar van",
    location: "Accra",
    coverage: "Greater Accra · garden venues",
    verified: true,
    packages: [
      {
        id: "bar-roll-4h",
        name: "4-hour mobile bar",
        priceGhs: 2500,
        priceLabel: "From GHS 2,500",
        pricingUnit: "event",
      },
    ],
  },
  {
    id: "demo-bar-bloom",
    slug: "bloom-cart-bartending",
    categorySlug: "mobile-bar",
    name: "Bloom Cart Bartending",
    description:
      "Styled mobile bar carts for weddings and styled shoots: pretty setup, serious pours.",
    image: "/assets/services/providers/bar-provider-1.jpg",
    imageAlt: "Flower-adorned mobile bar parked outdoors",
    location: "Accra",
    coverage: "Accra · wedding venues",
    packages: [
      {
        id: "bar-bloom-half",
        name: "Half-day styled bar",
        priceGhs: 3000,
        priceLabel: "From GHS 3,000",
        pricingUnit: "event",
      },
    ],
  },
  {
    id: "demo-bar-sunset",
    slug: "sunset-pour-mobile",
    categorySlug: "mobile-bar",
    name: "Sunset Pour Mobile",
    description:
      "Evening outdoor bar service for rooftops, beaches, and backyard celebrations.",
    image: "/assets/services/providers/bar-provider-2.jpg",
    imageAlt: "Bartender preparing cocktails for guests at an outdoor bar",
    location: "Cape Coast",
    coverage: "Cape Coast · Elmina (select weekends)",
    packages: [
      {
        id: "bar-sunset-enquire",
        name: "Coastal event package",
        priceLabel: "Price on enquiry",
      },
    ],
  },
];
