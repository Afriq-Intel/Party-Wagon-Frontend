import {
  AlertTriangle,
  BarChart3,
  Boxes,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  Package,
  Truck,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { OperationsNavIcon } from "@/lib/operations/nav";

const ICON_MAP: Record<OperationsNavIcon, LucideIcon> = {
  dashboard: LayoutDashboard,
  orders: ClipboardList,
  products: Package,
  inventory: Boxes,
  partners: Users,
  deliveries: Truck,
  events: CalendarDays,
  payments: Wallet,
  exceptions: AlertTriangle,
  reports: BarChart3,
};

type OperationsNavIconProps = {
  name: OperationsNavIcon;
  className?: string;
  size?: number;
};

export function OperationsNavIconGlyph({
  name,
  className,
  size = 18,
}: OperationsNavIconProps) {
  const Icon = ICON_MAP[name];
  return <Icon size={size} className={className} aria-hidden="true" />;
}
