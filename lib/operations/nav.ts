/**
 * Operations workspace navigation structure.
 * Routes beyond Dashboard are reserved for future page implementation.
 *
 * Partner Applications pending badge is resolved live in the sidebar from
 * PartnerApplicationsProvider — do not hardcode seed counts here.
 */

export type OperationsNavChild = {
  id: string;
  label: string;
  href: string;
  badge?: number;
  /** When set, sidebar resolves the badge from live mock application state. */
  badgeSource?: "partner-applications-pending";
};

export type OperationsNavItem = {
  id: string;
  label: string;
  href: string;
  icon: OperationsNavIcon;
  children?: OperationsNavChild[];
};

export type OperationsNavIcon =
  | "dashboard"
  | "orders"
  | "products"
  | "inventory"
  | "partners"
  | "deliveries"
  | "events"
  | "payments"
  | "exceptions"
  | "reports";

export const OPERATIONS_NAV: OperationsNavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/operations/dashboard",
    icon: "dashboard",
  },
  {
    id: "orders",
    label: "Orders",
    href: "/operations/orders",
    icon: "orders",
    children: [
      {
        id: "order-review",
        label: "Order Review",
        href: "/operations/orders/review",
        badge: 12,
      },
      {
        id: "order-history",
        label: "Order History",
        href: "/operations/orders/history",
      },
    ],
  },
  {
    id: "products",
    label: "Products & Catalogue",
    href: "/operations/products",
    icon: "products",
  },
  {
    id: "inventory",
    label: "Inventory & Stock",
    href: "/operations/inventory",
    icon: "inventory",
  },
  {
    id: "partners",
    label: "Partners",
    href: "/operations/partners",
    icon: "partners",
    children: [
      {
        id: "manage-partners",
        label: "Manage Partners",
        href: "/operations/partners",
      },
      {
        id: "partner-applications",
        label: "Applications",
        href: "/operations/partners/applications",
        badgeSource: "partner-applications-pending",
      },
      {
        id: "partner-directory",
        label: "Partner Directory",
        href: "/operations/partners/directory",
      },
    ],
  },
  {
    id: "deliveries",
    label: "Deliveries",
    href: "/operations/deliveries",
    icon: "deliveries",
  },
  {
    id: "events",
    label: "Events & Bookings",
    href: "/operations/events",
    icon: "events",
  },
  {
    id: "payments",
    label: "Payments",
    href: "/operations/payments",
    icon: "payments",
  },
  {
    id: "exceptions",
    label: "Exceptions & Support",
    href: "/operations/exceptions",
    icon: "exceptions",
  },
  {
    id: "reports",
    label: "Reports & Analytics",
    href: "/operations/reports",
    icon: "reports",
  },
];

/** Routes that currently have a real page implementation. */
export const IMPLEMENTED_OPERATIONS_ROUTES = new Set([
  "/operations/dashboard",
  "/operations/products",
  "/operations/products/new",
  "/operations/partners",
  "/operations/partners/applications",
  "/operations/partners/directory",
]);

export function isOperationsRouteActive(
  pathname: string,
  href: string,
): boolean {
  // Exact-only hubs so nested partner/application routes don't double-highlight.
  if (
    href === "/operations/dashboard" ||
    href === "/operations/partners"
  ) {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
