/**
 * MOCK DATA — Partner Dashboard visual development only.
 * Mirrors the Partner / Service Partner Figma references. NOT live records.
 */
import type { MonthlyChartPoint } from "@/lib/data/operations-dashboard";
import type { PartnerWorkspaceCapability } from "@/lib/partner/nav";

export type PartnerDashboardKpi = {
  id: string;
  label: string;
  value: string;
  hint: string;
};

export type PartnerQuickAction = {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: "stock" | "products" | "bookings" | "availability" | "services";
};

export type PartnerAttentionItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  tone: "warning" | "info";
};

export type PartnerActivityItem = {
  id: string;
  title: string;
  detail: string;
  timeAgo: string;
  kind: "stock" | "booking" | "fulfilment" | "availability" | "service";
};

export type PartnerNextEvent = {
  day: string;
  month: string;
  title: string;
  meta: string;
  href: string;
};

export type PartnerDashboardCopy = {
  workspaceCapability: PartnerWorkspaceCapability;
  welcomeSubtitle: string;
  primaryCta: { label: string; href: string };
  searchPlaceholder: string;
  performanceTitle: string;
  performanceSubtitle: string;
  performanceTotalLabel: string;
  performanceTotalValue: string;
  performanceDelta: string;
  chartYLabel: string;
  kpis: PartnerDashboardKpi[];
  chart: MonthlyChartPoint[];
  quickActions: PartnerQuickAction[];
  attention: PartnerAttentionItem[];
  attentionCount: string;
  activity: PartnerActivityItem[];
  nextEvent?: PartnerNextEvent;
};

const SHARED_CHART: MonthlyChartPoint[] = [
  { month: "Jan", value: 420 },
  { month: "Feb", value: 510 },
  { month: "Mar", value: 640 },
  { month: "Apr", value: 780 },
  { month: "May", value: 920 },
  { month: "Jun", value: 1100 },
  { month: "Jul", value: 1320 },
  { month: "Aug", value: 1580 },
];

export const DARKSTORE_DASHBOARD: PartnerDashboardCopy = {
  workspaceCapability: "darkstore",
  welcomeSubtitle:
    "Here’s an overview of your products, stock levels and fulfilment activity.",
  primaryCta: {
    label: "Update Stock",
    href: "/partner/inventory",
  },
  searchPlaceholder: "Search anything...",
  performanceTitle: "Business Performance Overview",
  performanceSubtitle: "Orders and bookings at a glance",
  performanceTotalLabel: "100 total this week",
  performanceTotalValue: "100",
  performanceDelta: "+18.2%",
  chartYLabel: "Order volume",
  kpis: [
    {
      id: "active-products",
      label: "Active Products / Services",
      value: "48",
      hint: "Live catalogue listings",
    },
    {
      id: "available-stock",
      label: "Available Stock / Booking Slots",
      value: "256",
      hint: "Units ready to fulfil",
    },
    {
      id: "pending-orders",
      label: "Pending Orders / Bookings",
      value: "12",
      hint: "Awaiting your action",
    },
    {
      id: "completed",
      label: "Completed Orders / Fulfilments",
      value: "184",
      hint: "Successfully delivered",
    },
  ],
  chart: SHARED_CHART,
  quickActions: [
    {
      id: "update-stock",
      label: "Update Stock",
      description: "Adjust quantities & availability",
      href: "/partner/inventory",
      icon: "stock",
    },
    {
      id: "manage-products",
      label: "Manage Products",
      description: "Edit your products and services",
      href: "/partner/products",
      icon: "products",
    },
    {
      id: "view-bookings",
      label: "View Bookings",
      description: "Review upcoming celebrations",
      href: "/partner/orders",
      icon: "bookings",
    },
  ],
  attentionCount: "08",
  attention: [
    {
      id: "low-stock",
      title: "3 listings are running low",
      description: "Restock to stay celebration-ready",
      href: "/partner/inventory",
      tone: "warning",
    },
    {
      id: "awaiting-confirm",
      title: "5 bookings await confirmation",
      description: "Let your customers know you’re in",
      href: "/partner/orders",
      tone: "info",
    },
  ],
  activity: [
    {
      id: "a1",
      title: "Stock updated · Gold Chiavari Chairs",
      detail: "+24 units added · 80 units now available",
      timeAgo: "10 min ago",
      kind: "stock",
    },
    {
      id: "a2",
      title: "Booking confirmed · #PW-1048",
      detail: "Garden Party Package · Sat, 14 Nov",
      timeAgo: "32 min ago",
      kind: "booking",
    },
    {
      id: "a3",
      title: "Fulfilment completed · #PW-1042",
      detail: "Weekend Celebration Kit · Delivered successfully",
      timeAgo: "1 hour ago",
      kind: "fulfilment",
    },
  ],
};

export const SERVICE_PROVIDER_DASHBOARD: PartnerDashboardCopy = {
  workspaceCapability: "service_provider",
  welcomeSubtitle:
    "Here’s an overview of your services, upcoming events and booking activity.",
  primaryCta: {
    label: "Update Availability",
    href: "/partner/availability",
  },
  searchPlaceholder: "Search services, bookings...",
  performanceTitle: "Booking Performance Overview",
  performanceSubtitle: "Last 6 months",
  performanceTotalLabel: "100 total bookings",
  performanceTotalValue: "100",
  performanceDelta: "+18.2%",
  chartYLabel: "Number of bookings",
  kpis: [
    {
      id: "active-services",
      label: "Active Services",
      value: "8",
      hint: "Services currently listed",
    },
    {
      id: "upcoming",
      label: "Upcoming Bookings",
      value: "12",
      hint: "Assigned upcoming events",
    },
    {
      id: "slots",
      label: "Available Slots",
      value: "24",
      hint: "Open dates this month",
    },
    {
      id: "completed",
      label: "Completed Bookings",
      value: "184",
      hint: "Successfully delivered",
    },
  ],
  chart: SHARED_CHART,
  quickActions: [
    {
      id: "update-availability",
      label: "Update Availability",
      description: "Open or close booking slots",
      href: "/partner/availability",
      icon: "availability",
    },
    {
      id: "manage-services",
      label: "Manage Services",
      description: "Edit packages and offerings",
      href: "/partner/services",
      icon: "services",
    },
    {
      id: "view-bookings",
      label: "View Bookings",
      description: "Review upcoming celebrations",
      href: "/partner/bookings",
      icon: "bookings",
    },
  ],
  attentionCount: "03",
  attention: [
    {
      id: "confirm-bookings",
      title: "2 bookings need confirmation",
      description: "Respond so guests can plan with confidence",
      href: "/partner/bookings",
      tone: "info",
    },
    {
      id: "pricing-update",
      title: "1 service needs a pricing update",
      description: "Keep packages current before the weekend rush",
      href: "/partner/pricing",
      tone: "warning",
    },
  ],
  activity: [
    {
      id: "s1",
      title: "Availability updated · November",
      detail: "4 new booking slots opened for your team",
      timeAgo: "10 min ago",
      kind: "availability",
    },
    {
      id: "s2",
      title: "Booking confirmed · #PW-1048",
      detail: "Garden Wedding · Catering · Wed, 18 Nov",
      timeAgo: "32 min ago",
      kind: "booking",
    },
    {
      id: "s3",
      title: "Service completed · #PW-1042",
      detail: "Private Chef Experience · Completed successfully",
      timeAgo: "1 hour ago",
      kind: "service",
    },
  ],
  nextEvent: {
    day: "18",
    month: "NOV",
    title: "Garden Wedding",
    meta: "Catering · 2:00 PM · 80 guests",
    href: "/partner/bookings",
  },
};

export function getPartnerDashboardCopy(
  capability: PartnerWorkspaceCapability,
): PartnerDashboardCopy {
  return capability === "darkstore"
    ? DARKSTORE_DASHBOARD
    : SERVICE_PROVIDER_DASHBOARD;
}

/** Mock avatar used in partner top bar until profile photos come from API. */
export const MOCK_PARTNER_AVATAR = "/assets/testimonials/samuel-oduro.jpg";

export const PARTNER_DASHBOARD_NOTIFICATIONS = [
  {
    id: "n1",
    title: "New booking request awaiting confirmation",
    timeAgo: "8 min ago",
  },
  {
    id: "n2",
    title: "Stock reminder for weekend demand",
    timeAgo: "1 hour ago",
  },
  {
    id: "n3",
    title: "Fulfilment window opens tomorrow",
    timeAgo: "Yesterday",
  },
] as const;
