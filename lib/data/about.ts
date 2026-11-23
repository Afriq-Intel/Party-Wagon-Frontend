/**
 * Behind the Party — brand-book messaging for the dedicated About page.
 * Copy is drawn from Party Wagon final brandbook.pdf (narrative, tension,
 * promise, values, personality, USPs). No invented dates, bios, or stats.
 */

export const ABOUT_MARQUEE = [
  "Where the party dey, we dey",
  "1-Click Enjoyment",
  "We'll bring the party to you",
  "Ready, Set, Enjoy!",
] as const;

export const BRAND_VALUES = [
  {
    id: "openness",
    title: "Openness",
    blurb: "Every vibe welcome. Every gathering counts: big, small, or spur of the moment.",
    tone: "lemon" as const,
  },
  {
    id: "dependability",
    title: "Dependability",
    blurb: "Where the party dey, we dey. Count on us to show up with what the night needs.",
    tone: "rose" as const,
  },
  {
    id: "agility",
    title: "Agility",
    blurb: "Plans shift. We move with you: fast, flexible, and ready for the next toast.",
    tone: "lilac" as const,
  },
  {
    id: "boldness",
    title: "Boldness",
    blurb: "We don’t take ourselves too seriously, but we take your celebration seriously.",
    tone: "blue" as const,
  },
  {
    id: "enthusiasm",
    title: "Enthusiasm",
    blurb: "Energetic about the product and the moments people make when they gather.",
    tone: "midnight" as const,
  },
] as const;

export const BRAND_PERSONALITIES = [
  "Fun",
  "Friendly",
  "Vibrant",
  "Innovative",
] as const;

export const HUMAN_TENSIONS = [
  {
    id: "costs",
    title: "Rising costs",
    copy: "Getting together is getting tougher as costs climb, no matter how big or small the group.",
  },
  {
    id: "stress",
    title: "Planning stress",
    copy: "Organising a celebration can pile on unnecessary hassle when all you want is good time.",
  },
  {
    id: "connect",
    title: "More connection",
    copy: "People deserve more chances to connect and enjoy time with the ones they love.",
  },
] as const;

export const BRAND_USPS = [
  {
    id: "service",
    title: "Stellar Customer Service",
    copy: "Personalised recommendations, timely deliveries, and exceptional customer experiences, from first click to doorstep.",
  },
  {
    id: "platform",
    title: "All Your Party Needs on One Convenient Platform",
    copy: "Drinks, party platters, and finger foods in one place, so you spend less time searching and more time celebrating.",
  },
] as const;

export const ABOUT_IMAGES = {
  heroPrimary: "/assets/about/hero-celebration.jpg",
  heroSecondary: "/assets/about/party-group.jpg",
  heroTertiary: "/assets/about/friends-toast.jpg",
  story: "/assets/about/friends-toast.jpg",
  tension: "/assets/about/party-cheers.jpg",
  promise: "/assets/about/nightclub-joy.jpg",
  usp: "/assets/about/party-group.jpg",
  closing: "/assets/about/party-dance-joy.jpg",
} as const;
