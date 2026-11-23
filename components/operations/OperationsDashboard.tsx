"use client";

import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  ClipboardList,
  Package,
  Truck,
  Users,
} from "lucide-react";
import type { ComponentType, ReactNode, SVGProps } from "react";
import { MonthlyBarChart } from "@/components/operations/MonthlyBarChart";
import { useAuth } from "@/lib/auth/auth-context";
import {
  DASHBOARD_KPIS,
  DASHBOARD_SUMMARY_CARDS,
  MONTHLY_ORDER_VOLUME,
  NEEDS_ATTENTION,
  QUICK_ACTIONS,
  RECENT_ACTIVITY,
  type QuickActionIcon,
} from "@/lib/data/operations-dashboard";
import { IMPLEMENTED_OPERATIONS_ROUTES } from "@/lib/operations/nav";

type DashboardIcon = ComponentType<
  SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number }
>;

const ACTIVITY_ICONS = {
  order: Package,
  stock: Boxes,
  delivery: Truck,
  partner: Users,
} as const;

const QUICK_ACTION_ICONS: Record<QuickActionIcon, DashboardIcon> = {
  orders: ClipboardList,
  stock: Package,
  delivery: Truck,
  partners: Users,
};

const cardClass =
  "rounded-2xl border border-black/5 bg-white shadow-[0_10px_28px_rgba(51,16,56,0.05)]";

function SoftLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const implemented = IMPLEMENTED_OPERATIONS_ROUTES.has(href);

  if (!implemented) {
    return (
      <span className={className} title="Coming soon" aria-disabled="true">
        {children}
      </span>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function OperationsDashboard() {
  const { user } = useAuth();
  const firstName =
    user?.profile?.preferred_name ||
    user?.profile?.first_name ||
    "there";

  return (
    <main className="mx-auto flex w-full min-w-0 max-w-[1400px] flex-1 flex-col gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="font-oswald text-[1.7rem] font-bold uppercase leading-[1.05] tracking-wide text-midnight-party sm:text-[2rem] lg:text-[2.15rem]">
            Welcome back {firstName}!
          </h1>
          <p className="mt-1.5 max-w-xl font-outfit text-[13px] leading-relaxed text-midnight-party/60 sm:text-[14px]">
            Here&apos;s what needs your attention across Party Wagon.
          </p>
        </div>

        <SoftLink
          href="/operations/orders/review"
          className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-midnight-party px-4 py-2.5 font-outfit text-[13px] font-semibold text-white transition hover:bg-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster sm:px-5"
        >
          Review orders
          <ArrowRight size={15} aria-hidden="true" />
        </SoftLink>
      </div>

      <section
        aria-label="Summary metrics"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 xl:gap-4"
      >
        {DASHBOARD_SUMMARY_CARDS.map((card) => (
          <article key={card.id} className={`${cardClass} flex flex-col p-4 sm:p-5`}>
            <p className="font-outfit text-[12px] font-medium text-midnight-party/55">
              {card.label}
            </p>
            <p className="mt-2.5 font-oswald text-[2.1rem] font-bold leading-none tracking-wide text-midnight-party sm:text-[2.25rem]">
              {card.value}
            </p>
            <SoftLink
              href={card.href}
              className="mt-3 inline-flex items-center gap-1.5 font-outfit text-[12.5px] font-medium text-lilac-luster transition hover:text-radiant-rose"
            >
              {card.actionLabel}
              <ArrowRight size={13} aria-hidden="true" />
            </SoftLink>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:gap-4">
        <article className={`${cardClass} min-w-0 p-4 sm:p-5`}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-oswald text-base font-semibold uppercase tracking-wide text-midnight-party sm:text-lg">
              Sales &amp; Operations Overview
            </h2>
            <span className="inline-flex shrink-0 self-start rounded-full border border-midnight-party/10 bg-[#fbf8fa] px-3 py-1 font-outfit text-[11px] font-medium text-midnight-party/65 sm:self-auto">
              January – August
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2.5 xl:grid-cols-4">
            {DASHBOARD_KPIS.map((kpi) => (
              <div
                key={kpi.id}
                className="min-w-0 rounded-xl border border-black/5 bg-[#fbf8fa] px-3 py-2.5"
              >
                <p className="font-outfit text-[11px] leading-snug text-midnight-party/50">
                  {kpi.label}
                </p>
                <p className="mt-1 font-oswald text-[1.05rem] font-semibold leading-tight tracking-wide text-midnight-party sm:text-[1.15rem]">
                  {kpi.value}
                </p>
              </div>
            ))}
          </div>

          <MonthlyBarChart data={MONTHLY_ORDER_VOLUME} />
        </article>

        <div className="flex min-w-0 flex-col gap-4">
          <article className={`${cardClass} p-4 sm:p-5`}>
            <h2 className="font-oswald text-base font-semibold uppercase tracking-wide text-midnight-party">
              Quick Actions
            </h2>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {QUICK_ACTIONS.map((action) => {
                const Icon = QUICK_ACTION_ICONS[action.icon] ?? Package;
                return (
                  <SoftLink
                    key={action.id}
                    href={action.href}
                    className="flex flex-col items-center justify-center gap-2 rounded-xl border border-midnight-party/10 bg-[#fbf8fa] px-2.5 py-3.5 text-center font-outfit text-[12px] font-semibold text-midnight-party transition hover:border-lilac-luster/40 hover:bg-lilac-luster/5 hover:text-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster sm:text-[12.5px]"
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-midnight-party/10 text-midnight-party">
                      <Icon size={18} strokeWidth={2} aria-hidden="true" />
                    </span>
                    <span>{action.label}</span>
                  </SoftLink>
                );
              })}
            </div>
          </article>

          <article className={`${cardClass} p-4 sm:p-5`}>
            <h2 className="font-oswald text-base font-semibold uppercase tracking-wide text-midnight-party">
              Needs Attention
            </h2>
            <ul className="mt-3 space-y-2.5">
              {NEEDS_ATTENTION.map((item) => (
                <li key={item.id}>
                  <SoftLink
                    href={item.href}
                    className="flex items-start gap-3 rounded-xl px-0.5 py-1 transition hover:bg-[#fbf8fa]"
                  >
                    <span className="inline-flex min-w-9 shrink-0 items-center justify-center rounded-lg bg-midnight-party px-2 py-1.5 font-oswald text-sm font-semibold text-white">
                      {item.count}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-outfit text-[13px] font-semibold text-midnight-party">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block font-outfit text-[12px] text-midnight-party/50">
                        {item.description}
                      </span>
                    </span>
                  </SoftLink>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className={`${cardClass} min-w-0 p-4 sm:p-5`}>
        <div className="mb-3">
          <h2 className="font-oswald text-base font-semibold uppercase tracking-wide text-midnight-party sm:text-lg">
            Recent Activity
          </h2>
          <p className="mt-1 font-outfit text-[12px] text-midnight-party/50">
            Latest updates across your workspace.
          </p>
        </div>

        <ul className="divide-y divide-black/5">
          {RECENT_ACTIVITY.map((item) => {
            const Icon = ACTIVITY_ICONS[item.kind];
            return (
              <li
                key={item.id}
                className="flex flex-col gap-1.5 py-3 first:pt-1 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-offwhite text-midnight-party">
                    <Icon size={16} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-outfit text-[13px] font-medium text-midnight-party sm:text-[13.5px]">
                      {item.title}
                    </p>
                    <p className="mt-0.5 font-outfit text-[12px] text-midnight-party/50">
                      {item.status}
                    </p>
                  </div>
                </div>
                <p className="shrink-0 pl-12 font-outfit text-[12px] text-midnight-party/40 sm:pl-0">
                  {item.timeAgo}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <footer className="mt-auto flex flex-col gap-1 border-t border-black/5 pt-4 font-outfit text-[11px] text-midnight-party/40 sm:flex-row sm:items-center sm:justify-between">
        <p>Party Wagon · Operations workspace</p>
        <p>Dashboard overview</p>
      </footer>
    </main>
  );
}
