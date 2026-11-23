/**
 * MOCK DATA — Operations Dashboard visual development only.
 * Values mirror the Operations Dashboard design reference and are NOT
 * live backend records. Replace with confirmed Operations APIs later.
 */

/** MOCK avatar for the Operations demo user until profile photos come from the API. */
export const MOCK_OPS_AVATAR = "/assets/operations/mary-mensah.jpg";

export type DashboardSummaryCard = {
  id: string;
  label: string;
  value: string;
  actionLabel: string;
  href: string;
};

export type DashboardKpi = {
  id: string;
  label: string;
  value: string;
};

export type MonthlyChartPoint = {
  month: string;
  value: number;
};

export type QuickActionIcon = "orders" | "stock" | "delivery" | "partners";

export type QuickAction = {
  id: string;
  label: string;
  href: string;
  icon: QuickActionIcon;
};

export type AttentionItem = {
  id: string;
  count: string;
  title: string;
  description: string;
  href: string;
};

export type ActivityItem = {
  id: string;
  title: string;
  status: string;
  timeAgo: string;
  kind: "order" | "stock" | "delivery" | "partner";
};

export const DASHBOARD_SUMMARY_CARDS: DashboardSummaryCard[] = [
  {
    id: "orders-awaiting",
    label: "Orders Awaiting Review",
    value: "12",
    actionLabel: "Review orders",
    href: "/operations/orders/review",
  },
  {
    id: "deliveries-transit",
    label: "Deliveries In Transit",
    value: "06",
    actionLabel: "Track deliveries",
    href: "/operations/deliveries",
  },
  {
    id: "inventory-alerts",
    label: "Inventory Alerts",
    value: "09",
    actionLabel: "Check inventory",
    href: "/operations/inventory",
  },
  {
    id: "new-exceptions",
    label: "New Exceptions",
    value: "2",
    actionLabel: "Resolve exceptions",
    href: "/operations/exceptions",
  },
];

export const DASHBOARD_KPIS: DashboardKpi[] = [
  { id: "sales", label: "Total Sales", value: "GHC 213,000" },
  { id: "orders", label: "Total Orders", value: "491" },
  { id: "fulfilment", label: "Fulfilment Rate", value: "99.1%" },
  { id: "aov", label: "Avg. Order Value", value: "GHC 500" },
];

/** Chart values scaled to match the design reference trend (Jan–Aug). */
export const MONTHLY_ORDER_VOLUME: MonthlyChartPoint[] = [
  { month: "Jan", value: 620 },
  { month: "Feb", value: 780 },
  { month: "Mar", value: 910 },
  { month: "Apr", value: 1050 },
  { month: "May", value: 1180 },
  { month: "Jun", value: 1320 },
  { month: "Jul", value: 1550 },
  { month: "Aug", value: 1780 },
];

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "review-orders",
    label: "Review Orders",
    href: "/operations/orders/review",
    icon: "orders",
  },
  {
    id: "update-stock",
    label: "Update Stock",
    href: "/operations/inventory",
    icon: "stock",
  },
  {
    id: "assign-delivery",
    label: "Assign Delivery",
    href: "/operations/deliveries",
    icon: "delivery",
  },
  {
    id: "manage-partners",
    label: "Manage Partners",
    href: "/operations/partners",
    icon: "partners",
  },
];

export const NEEDS_ATTENTION: AttentionItem[] = [
  {
    id: "att-orders",
    count: "12",
    title: "Orders awaiting review",
    description: "Approve orders for fulfilment",
    href: "/operations/orders/review",
  },
  {
    id: "att-inventory",
    count: "09",
    title: "Inventory alerts",
    description: "Review stock availability",
    href: "/operations/inventory",
  },
  {
    id: "att-exceptions",
    count: "2",
    title: "New exceptions",
    description: "Investigate and resolve issues",
    href: "/operations/exceptions",
  },
];

export const RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: "act-1",
    title: "Order # Pw201 reviewed and approved",
    status: "Order approved",
    timeAgo: "2m ago",
    kind: "order",
  },
  {
    id: "act-2",
    title: "Stock Updated: Malta Guinness (+50 units)",
    status: "Stock updated",
    timeAgo: "5m ago",
    kind: "stock",
  },
  {
    id: "act-3",
    title: "Delivery # DI201 marked delivered",
    status: "Delivered",
    timeAgo: "7m ago",
    kind: "delivery",
  },
  {
    id: "act-4",
    title: "New partner added",
    status: "Partner added",
    timeAgo: "10m ago",
    kind: "partner",
  },
];

export const DASHBOARD_NOTIFICATIONS = [
  {
    id: "n1",
    title: "12 orders awaiting review",
    timeAgo: "Just now",
  },
  {
    id: "n2",
    title: "Inventory alert: Soft drinks low",
    timeAgo: "8m ago",
  },
  {
    id: "n3",
    title: "New exception opened",
    timeAgo: "15m ago",
  },
] as const;
