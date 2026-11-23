/**
 * Partner workspace navigation by capability.
 * Only darkstore and service_provider are supported in this pass.
 */
import type { PartnerCapability } from "@/types/partner-application";

export type PartnerNavIcon =
  | "dashboard"
  | "products"
  | "inventory"
  | "orders"
  | "fulfilment"
  | "reports"
  | "help"
  | "services"
  | "bookings"
  | "availability"
  | "resources"
  | "pricing";

export type PartnerNavItem = {
  id: string;
  label: string;
  href: string;
  icon: PartnerNavIcon;
};

export type PartnerWorkspaceCapability = "darkstore" | "service_provider";

export function isPartnerWorkspaceCapability(
  capability: PartnerCapability | null | undefined,
): capability is PartnerWorkspaceCapability {
  return capability === "darkstore" || capability === "service_provider";
}

export const DARKSTORE_NAV: PartnerNavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/partner/dashboard",
    icon: "dashboard",
  },
  {
    id: "products",
    label: "Products & Services",
    href: "/partner/products",
    icon: "products",
  },
  {
    id: "inventory",
    label: "Inventory & Availability",
    href: "/partner/inventory",
    icon: "inventory",
  },
  {
    id: "orders",
    label: "Orders & Bookings",
    href: "/partner/orders",
    icon: "orders",
  },
  {
    id: "fulfilment",
    label: "Fulfilment",
    href: "/partner/fulfilment",
    icon: "fulfilment",
  },
  {
    id: "reports",
    label: "Reports & Analytics",
    href: "/partner/reports",
    icon: "reports",
  },
  {
    id: "help",
    label: "Help & Support",
    href: "/partner/help",
    icon: "help",
  },
];

export const SERVICE_PROVIDER_NAV: PartnerNavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/partner/dashboard",
    icon: "dashboard",
  },
  {
    id: "services",
    label: "My Services",
    href: "/partner/services",
    icon: "services",
  },
  {
    id: "bookings",
    label: "Bookings",
    href: "/partner/bookings",
    icon: "bookings",
  },
  {
    id: "availability",
    label: "Availability Calendar",
    href: "/partner/availability",
    icon: "availability",
  },
  {
    id: "pricing",
    label: "Pricing & Packages",
    href: "/partner/pricing",
    icon: "pricing",
  },
  {
    id: "help",
    label: "Help & Support",
    href: "/partner/help",
    icon: "help",
  },
];

export function getPartnerNav(
  capability: PartnerWorkspaceCapability,
): PartnerNavItem[] {
  return capability === "darkstore" ? DARKSTORE_NAV : SERVICE_PROVIDER_NAV;
}

export function getPartnerWorkspaceLabel(
  capability: PartnerWorkspaceCapability,
): string {
  return capability === "darkstore"
    ? "Partner Workspace"
    : "Service Partner Workspace";
}

export function isPartnerRouteActive(pathname: string, href: string): boolean {
  if (href === "/partner/dashboard") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Routes that currently have a real page (dashboard or placeholder). */
export const IMPLEMENTED_PARTNER_ROUTES = new Set([
  "/partner/dashboard",
  "/partner/products",
  "/partner/inventory",
  "/partner/orders",
  "/partner/fulfilment",
  "/partner/reports",
  "/partner/help",
  "/partner/services",
  "/partner/bookings",
  "/partner/availability",
  "/partner/resources",
  "/partner/pricing",
]);
