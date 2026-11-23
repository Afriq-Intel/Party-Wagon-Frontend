/**
 * MOCK DATA — visual development only.
 * These values mirror the approved Figma homepage screenshot and are NOT
 * live catalogue / backend records. Replace with confirmed API data later.
 */
import type { CategoryItem, ProductItem, TestimonialItem } from "@/types/homepage";

export const ANNOUNCEMENT_MESSAGES = [
  "Good times",
  "Everything you need to celebrate",
  "Let's make it a party",
] as const;

export const VIBE_MESSAGES = [
  "What be the vibe?",
  "What are your plans for the night?",
  "Where the party dey, we dey",
] as const;

export const NAV_LINKS = [
  { label: "Party Essentials", href: "/catalogue" },
  { label: "Party Services", href: "/services" },
  { label: "Let's Get Planning", href: "/planner" },
  { label: "Behind the Party", href: "/about" },
] as const;

export const MOCK_CATEGORIES: CategoryItem[] = [
  {
    id: "champagne",
    name: "Champagne",
    slug: "champagne",
  },
  {
    id: "soft-drinks",
    name: "Soft Drinks",
    slug: "soft-drinks",
  },
  {
    id: "cocktails",
    name: "Cocktails",
    slug: "cocktails",
  },
  {
    id: "beer",
    name: "Beer",
    slug: "beer",
  },
  {
    id: "vodka",
    name: "Vodka",
    slug: "vodka",
  },
  {
    id: "dj",
    name: "DJ",
    slug: "dj",
  },
];

/**
 * Temporary Best Sellers demo content for homepage visual development.
 * Names/prices mirror the approved Figma homepage placeholders and are NOT
 * live catalogue / backend records. Imagery is local high-res Unsplash/Pexels
 * photography (see public/assets/products/ATTRIBUTION.md). No discount fields
 * are set — badges render only when real discount data exists.
 */
export const MOCK_BEST_SELLERS: ProductItem[] = [
  {
    id: "heineken",
    name: "Heineken | Lager | 5%",
    slug: "heineken-lager",
    image: "/assets/products/catalogue/heineken-packshot.jpg",
    category: "Beer",
    // Demo "From" label — mirrors catalogue starting variant price, not live stock.
    priceLabel: "From GHS 12.00",
    rating: 4,
  },
  {
    id: "smirnoff",
    name: "Smirnoff | No. 21",
    slug: "smirnoff-no-21",
    image: "/assets/products/catalogue/smirnoff-packshot.jpg",
    category: "Vodka",
    priceLabel: "From GHS 45.00",
    rating: 4,
  },
  {
    id: "dom-perignon",
    name: "Prestige Sparkling | Vintage Blend",
    slug: "prestige-sparkling",
    image: "/assets/products/catalogue/champagne-glasses.jpg",
    category: "Champagne",
    priceLabel: "From GHS 1,200.00",
    rating: 5,
  },
  {
    id: "sex-on-the-beach",
    name: "Sex on the Beach",
    slug: "sex-on-the-beach",
    image: "/assets/products/catalogue/cocktail-packshot.jpg",
    category: "Cocktails",
    priceLabel: "From GHS 45.00",
    rating: 4,
  },
  {
    id: "coca-cola",
    name: "Coca-Cola Classic",
    slug: "coca-cola-classic",
    image: "/assets/products/catalogue/coca-cola-packshot.jpg",
    category: "Soft Drinks",
    priceLabel: "From GHS 12.00",
    rating: 4,
  },
  {
    id: "sprite",
    name: "Citrus Burst Soft Drink",
    slug: "citrus-burst-soda",
    image: "/assets/products/catalogue/fanta-orange.jpg",
    category: "Soft Drinks",
    priceLabel: "From GHS 15.00",
    rating: 4,
  },
  {
    id: "absolut-vodka",
    name: "Absolut Vodka | Original",
    slug: "absolut-vodka",
    image: "/assets/products/catalogue/absolut-packshot.jpg",
    category: "Vodka",
    priceLabel: "From GHS 180.00",
    rating: 4,
  },
  {
    id: "jack-daniels",
    name: "Oak Reserve Whiskey",
    slug: "oak-reserve-whiskey",
    image: "/assets/products/catalogue/whiskey-packshot.jpg",
    category: "Spirits",
    priceLabel: "From GHS 250.00",
    rating: 5,
  },
];

/** Placeholder testimonials matching Figma layout — not verified customer reviews. */
export const MOCK_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "samuel",
    name: "Samuel Oduro",
    quote:
      "Customer support sorted out a delivery mix-up within minutes. That kind of responsiveness keeps me coming back.",
    rating: 5,
    avatar: "/assets/testimonials/samuel-oduro.jpg",
  },
  {
    id: "james",
    name: "James Dwomoh",
    quote:
      "Customer support sorted out a delivery mix-up within minutes. That kind of responsiveness keeps me coming back.",
    rating: 5,
    avatar: "/assets/testimonials/james-dwomoh.jpg",
  },
  {
    id: "elizabeth",
    name: "Elizabeth Oduro",
    quote:
      "Customer support sorted out a delivery mix-up within minutes. That kind of responsiveness keeps me coming back.",
    rating: 5,
    avatar: "/assets/testimonials/elizabeth-oduro.jpg",
  },
];

export const FOOTER_GROUPS = [
  {
    title: "Shop",
    links: [
      { label: "Party Essentials", href: "/catalogue" },
      { label: "Merchandise", href: "/catalogue?category=merchandise" },
    ],
  },
  {
    title: "Plan",
    links: [
      { label: "Party Services", href: "/services" },
      { label: "Party Planner", href: "/planner" },
      { label: "My Plans", href: "/account/plans" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Good Times Start Here", href: "/about" },
      { label: "Become a Partner", href: "/partners/apply" },
    ],
  },
] as const;
