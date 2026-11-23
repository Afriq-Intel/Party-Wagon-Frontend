import {
  BarChart3,
  Briefcase,
  CalendarCheck,
  CalendarDays,
  CircleHelp,
  ClipboardList,
  LayoutDashboard,
  Package,
  Boxes,
  Tag,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { PartnerNavIcon } from "@/lib/partner/nav";

const ICON_MAP: Record<PartnerNavIcon, LucideIcon> = {
  dashboard: LayoutDashboard,
  products: Package,
  inventory: Boxes,
  orders: ClipboardList,
  fulfilment: Truck,
  reports: BarChart3,
  help: CircleHelp,
  services: Briefcase,
  bookings: CalendarDays,
  availability: CalendarCheck,
  resources: Users,
  pricing: Tag,
};

type PartnerNavIconProps = {
  name: PartnerNavIcon;
  className?: string;
  size?: number;
};

export function PartnerNavIconGlyph({
  name,
  className,
  size = 18,
}: PartnerNavIconProps) {
  const Icon = ICON_MAP[name];
  return <Icon size={size} className={className} aria-hidden="true" />;
}
