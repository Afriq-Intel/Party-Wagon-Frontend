"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Briefcase,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Package,
  Boxes,
  Truck,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { MonthlyBarChart } from "@/components/operations/MonthlyBarChart";
import { useAuth } from "@/lib/auth/auth-context";
import {
  findPartnerAccountByEmail,
  getPartnerCapability,
} from "@/lib/auth/partner-mock-store";
import {
  getPartnerDashboardCopy,
  type PartnerActivityItem,
  type PartnerQuickAction,
} from "@/lib/data/partner-dashboard";
import { partnerCapabilityLabel } from "@/lib/data/operations-partner-applications";
import {
  IMPLEMENTED_PARTNER_ROUTES,
  isPartnerWorkspaceCapability,
} from "@/lib/partner/nav";

const cardClass =
  "rounded-2xl border border-black/5 bg-white shadow-[0_10px_28px_rgba(51,16,56,0.05)]";

const QUICK_ACTION_ICONS: Record<PartnerQuickAction["icon"], LucideIcon> = {
  stock: Boxes,
  products: Package,
  bookings: CalendarDays,
  availability: CalendarCheck,
  services: Briefcase,
};

const ACTIVITY_ICONS: Record<PartnerActivityItem["kind"], LucideIcon> = {
  stock: Boxes,
  booking: CalendarDays,
  fulfilment: Truck,
  availability: CalendarCheck,
  service: CheckCircle2,
};

function SoftLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const implemented = IMPLEMENTED_PARTNER_ROUTES.has(href);

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

function UnsupportedCapabilityNotice({
  capabilityLabel,
}: {
  capabilityLabel: string;
}) {
  return (
    <main className="mx-auto flex w-full min-w-0 max-w-[900px] flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
      <article className={`${cardClass} p-6 sm:p-8`}>
        <h1 className="font-oswald text-[1.7rem] font-bold uppercase tracking-wide text-midnight-party">
          Workspace not available
        </h1>
        <p className="mt-3 max-w-xl font-outfit text-[14px] leading-relaxed text-midnight-party/65">
          This partner is provisioned as {capabilityLabel}. The Partner
          Dashboard currently supports darkstore and service provider workspaces
          only. Combined capabilities and workspace switching are not available
          yet.
        </p>
      </article>
    </main>
  );
}

export function PartnerDashboard() {
  const { user } = useAuth();
  const partner = user ? findPartnerAccountByEmail(user.email) : undefined;
  const capability = partner
    ? getPartnerCapability(partner.partnerId)
    : null;

  if (!isPartnerWorkspaceCapability(capability)) {
    return (
      <UnsupportedCapabilityNotice
        capabilityLabel={
          capability
            ? partnerCapabilityLabel(capability)
            : "an unsupported capability"
        }
      />
    );
  }

  const copy = getPartnerDashboardCopy(capability);
  const showPrimaryCta = capability === "service_provider";

  return (
    <main className="mx-auto flex w-full min-w-0 max-w-[1400px] flex-1 flex-col gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="font-oswald text-[1.7rem] font-bold uppercase leading-[1.05] tracking-wide text-midnight-party sm:text-[2rem] lg:text-[2.15rem]">
            Welcome back, Partner!
          </h1>
          <p className="mt-1.5 max-w-xl font-outfit text-[13px] leading-relaxed text-midnight-party/60 sm:text-[14px]">
            {copy.welcomeSubtitle}
          </p>
        </div>

        {showPrimaryCta ? (
          <SoftLink
            href={copy.primaryCta.href}
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-midnight-party px-4 py-2.5 font-outfit text-[13px] font-semibold text-white transition hover:bg-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster sm:px-5"
          >
            <CalendarCheck size={15} aria-hidden="true" />
            {copy.primaryCta.label}
          </SoftLink>
        ) : null}
      </div>

      <section
        aria-label="Summary metrics"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 xl:gap-4"
      >
        {copy.kpis.map((kpi) => (
          <article key={kpi.id} className={`${cardClass} flex flex-col p-4 sm:p-5`}>
            <p className="font-outfit text-[12px] font-medium text-midnight-party/55">
              {kpi.label}
            </p>
            <p className="mt-2.5 font-oswald text-[2.1rem] font-bold leading-none tracking-wide text-midnight-party sm:text-[2.25rem]">
              {kpi.value}
            </p>
            <p className="mt-2 font-outfit text-[12px] text-midnight-party/45">
              {kpi.hint}
            </p>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1.35fr_0.85fr] lg:gap-4">
        <div className="flex min-w-0 flex-col gap-4">
          <article className={`${cardClass} min-w-0 p-4 sm:p-5`}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h2 className="font-oswald text-base font-semibold uppercase tracking-wide text-midnight-party sm:text-lg">
                  {copy.performanceTitle}
                </h2>
                <p className="mt-1 font-outfit text-[12px] text-midnight-party/50">
                  {copy.performanceSubtitle}
                </p>
              </div>
              {capability === "service_provider" ? (
                <span className="inline-flex shrink-0 self-start rounded-full border border-midnight-party/10 bg-[#fbf8fa] px-3 py-1 font-outfit text-[11px] font-medium text-midnight-party/65">
                  Last 6 months
                </span>
              ) : null}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <p className="font-outfit text-[14px] font-semibold text-midnight-party sm:text-[15px]">
                {copy.performanceTotalLabel}
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 font-outfit text-[11px] font-semibold text-emerald-700">
                <ArrowUpRight size={12} aria-hidden="true" />
                {copy.performanceDelta}
              </span>
            </div>

            <MonthlyBarChart
              data={copy.chart}
              yAxisLabel={copy.chartYLabel}
              xAxisLabel="Months of the year"
            />
          </article>

          <article className={`${cardClass} min-w-0 p-4 sm:p-5`}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="font-oswald text-base font-semibold uppercase tracking-wide text-midnight-party sm:text-lg">
                Recent Activity
              </h2>
              <span className="font-outfit text-[12px] font-medium text-lilac-luster">
                View all activity →
              </span>
            </div>

            <ul className="divide-y divide-black/5">
              {copy.activity.map((item) => {
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
                          {item.detail}
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
          </article>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <article className={`${cardClass} p-4 sm:p-5`}>
            <h2 className="font-oswald text-base font-semibold uppercase tracking-wide text-midnight-party">
              Quick Actions
            </h2>
            <ul className="mt-3 space-y-2">
              {copy.quickActions.map((action) => {
                const Icon = QUICK_ACTION_ICONS[action.icon];
                return (
                  <li key={action.id}>
                    <SoftLink
                      href={action.href}
                      className="flex items-center gap-3 rounded-xl border border-midnight-party/8 bg-[#fbf8fa] px-3 py-3 transition hover:border-lilac-luster/40 hover:bg-lilac-luster/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
                    >
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-midnight-party/10 text-midnight-party">
                        <Icon size={18} aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-outfit text-[13px] font-semibold text-midnight-party">
                          {action.label}
                        </span>
                        <span className="mt-0.5 block font-outfit text-[12px] text-midnight-party/50">
                          {action.description}
                        </span>
                      </span>
                    </SoftLink>
                  </li>
                );
              })}
            </ul>
          </article>

          <article className={`${cardClass} p-4 sm:p-5`}>
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-oswald text-base font-semibold uppercase tracking-wide text-midnight-party">
                Needs Your Attention
              </h2>
              <span className="inline-flex min-w-8 items-center justify-center rounded-lg bg-midnight-party px-2 py-1 font-oswald text-sm font-semibold text-white">
                {copy.attentionCount}
              </span>
            </div>
            <ul className="mt-3 space-y-2.5">
              {copy.attention.map((item) => (
                <li key={item.id}>
                  <SoftLink
                    href={item.href}
                    className="flex items-start gap-3 rounded-xl px-0.5 py-1 transition hover:bg-[#fbf8fa]"
                  >
                    <span
                      className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        item.tone === "warning"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-midnight-party/8 text-midnight-party"
                      }`}
                    >
                      {item.tone === "warning" ? (
                        <AlertTriangle size={16} aria-hidden="true" />
                      ) : (
                        <CalendarDays size={16} aria-hidden="true" />
                      )}
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

          {copy.nextEvent ? (
            <article className={`${cardClass} p-4 sm:p-5`}>
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-oswald text-base font-semibold uppercase tracking-wide text-midnight-party">
                  Next Event
                </h2>
                <SoftLink
                  href={copy.nextEvent.href}
                  className="font-outfit text-[12px] font-medium text-lilac-luster transition hover:text-radiant-rose"
                >
                  View booking
                </SoftLink>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-[4.25rem] w-[3.75rem] shrink-0 flex-col items-center justify-center rounded-xl bg-midnight-party text-white">
                  <span className="font-oswald text-[1.35rem] font-bold leading-none tracking-wide">
                    {copy.nextEvent.day}
                  </span>
                  <span className="mt-1 font-outfit text-[10px] font-semibold uppercase tracking-[0.14em]">
                    {copy.nextEvent.month}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-outfit text-[14px] font-semibold text-midnight-party">
                    {copy.nextEvent.title}
                  </p>
                  <p className="mt-1 font-outfit text-[12px] text-midnight-party/55">
                    {copy.nextEvent.meta}
                  </p>
                </div>
              </div>
            </article>
          ) : null}
        </div>
      </section>

      <footer className="mt-auto flex flex-col gap-1 border-t border-black/5 pt-4 font-outfit text-[11px] text-midnight-party/40 sm:flex-row sm:items-center sm:justify-between">
        <p>Party Wagon · Partner workspace</p>
        <p>Dashboard overview</p>
      </footer>
    </main>
  );
}
