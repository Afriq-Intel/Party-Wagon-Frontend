"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  Pencil,
  Plus,
  Power,
  Search,
} from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { ProductImageThumb } from "@/components/operations/products/ProductImageThumb";
import {
  formatPartnerServicePrice,
  formatPartnerServiceUpdatedAt,
  PARTNER_SERVICES_PAGE_SIZE,
  partnerServiceStatusLabel,
} from "@/lib/data/partner-services";
import {
  filterPartnerServices,
  paginatePartnerServices,
} from "@/lib/partner/filter-services";
import { usePartnerServices } from "@/lib/partner/services-context";
import type {
  PartnerService,
  PartnerServiceStatus,
} from "@/types/partner-services";
import { ServiceAvailabilityBadge } from "./ServiceAvailabilityBadge";
import { ServiceChangeStatusModal } from "./ServiceActionModals";
import { ServiceStatusBadge } from "./ServiceStatusBadge";

const cardClass =
  "rounded-2xl border border-black/5 bg-white shadow-[0_10px_28px_rgba(51,16,56,0.05)]";

type StatusFilter = PartnerServiceStatus | "all";

function ServiceActionsMenu({
  service,
  onChangeStatus,
}: {
  service: PartnerService;
  onChangeStatus: () => void;
}) {
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  return (
    <div className="relative flex items-center justify-end gap-1" ref={rootRef}>
      <Link
        href={`/partner/services/${service.id}`}
        title="View service"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-midnight-party/10 text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
      >
        <Eye size={15} aria-hidden="true" />
        <span className="sr-only">View {service.name}</span>
      </Link>

      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-midnight-party/10 text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
        onClick={() => setOpen((prev) => !prev)}
      >
        <MoreHorizontal size={15} aria-hidden="true" />
        <span className="sr-only">More actions for {service.name}</span>
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-full z-20 mt-1 w-48 overflow-hidden rounded-xl border border-black/8 bg-white py-1 shadow-[0_12px_28px_rgba(51,16,56,0.12)]"
        >
          <Link
            href={`/partner/services/${service.id}`}
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-left font-outfit text-[12.5px] text-midnight-party transition hover:bg-offwhite/60"
            onClick={() => setOpen(false)}
          >
            <Eye size={14} aria-hidden="true" />
            View
          </Link>
          <Link
            href={`/partner/services/${service.id}/edit`}
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-left font-outfit text-[12.5px] text-midnight-party transition hover:bg-offwhite/60"
            onClick={() => setOpen(false)}
          >
            <Pencil size={14} aria-hidden="true" />
            Edit
          </Link>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-left font-outfit text-[12.5px] text-midnight-party transition hover:bg-offwhite/60"
            onClick={() => {
              setOpen(false);
              onChangeStatus();
            }}
          >
            <Power size={14} aria-hidden="true" />
            Activate / Deactivate
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function PartnerServicesPage() {
  const router = useRouter();
  const searchId = useId();
  const { services, ready, updateServiceStatus } = usePartnerServices();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [statusServiceId, setStatusServiceId] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;
    const timer = window.setTimeout(() => setLoading(false), 350);
    return () => window.clearTimeout(timer);
  }, [ready]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 3200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const filtered = filterPartnerServices(services, { search, status });
  const paged = paginatePartnerServices(
    filtered,
    page,
    PARTNER_SERVICES_PAGE_SIZE,
  );

  const statusCounts = {
    all: services.length,
    active: services.filter((service) => service.status === "active").length,
    draft: services.filter((service) => service.status === "draft").length,
    inactive: services.filter((service) => service.status === "inactive")
      .length,
  };

  const activeService = statusServiceId
    ? (services.find((service) => service.id === statusServiceId) ?? null)
    : null;

  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function updateStatusFilter(value: StatusFilter) {
    setStatus(value);
    setPage(1);
  }

  function handleChangeStatus(
    serviceId: string,
    nextStatus: PartnerServiceStatus,
  ) {
    const updated = updateServiceStatus(serviceId, nextStatus);
    setStatusServiceId(null);
    if (updated) {
      setNotice(
        `“${updated.name}” is now ${partnerServiceStatusLabel(nextStatus).toLowerCase()}.`,
      );
    }
  }

  const rangeStart =
    paged.totalItems === 0 ? 0 : (paged.page - 1) * paged.pageSize + 1;
  const rangeEnd = Math.min(paged.page * paged.pageSize, paged.totalItems);

  return (
    <main className="mx-auto flex w-full min-w-0 max-w-[1400px] flex-1 flex-col gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="font-oswald text-[1.7rem] font-bold uppercase leading-[1.05] tracking-wide text-midnight-party sm:text-[2rem]">
            My Services
          </h1>
          <p className="mt-1.5 max-w-2xl font-outfit text-[13px] leading-relaxed text-midnight-party/60 sm:text-[14px]">
            Manage the service packages you offer to celebration hosts —
            pricing, duration, availability, and listing status.
          </p>
        </div>

        <Link
          href="/partner/services/new"
          className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-midnight-party px-4 py-2.5 font-outfit text-[13px] font-semibold text-white transition hover:bg-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster sm:px-5"
        >
          <Plus size={16} aria-hidden="true" />
          Add Service
        </Link>
      </div>

      {notice ? (
        <div
          role="status"
          className="rounded-xl border border-lilac-luster/25 bg-lilac-luster/5 px-4 py-3 font-outfit text-[13px] text-midnight-party"
        >
          {notice}
        </div>
      ) : null}

      <section className={`${cardClass} p-4 sm:p-5`}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="min-w-0 flex-1">
            <label
              htmlFor={searchId}
              className="mb-1.5 block font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45"
            >
              Search
            </label>
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-midnight-party/40"
                aria-hidden="true"
              />
              <input
                id={searchId}
                type="search"
                value={search}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  updateSearch(event.target.value)
                }
                placeholder="Search by name, category or description"
                className="w-full rounded-xl border border-midnight-party/10 bg-[#fbf8fa] py-2.5 pl-10 pr-3 font-outfit text-[13px] text-midnight-party outline-none transition placeholder:text-midnight-party/35 focus:border-lilac-luster/40 focus:bg-white"
              />
            </div>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Service status filters"
          className="mt-4 flex flex-wrap gap-2"
        >
          {(
            [
              { id: "all", label: "All" },
              { id: "active", label: "Active" },
              { id: "draft", label: "Draft" },
              { id: "inactive", label: "Inactive" },
            ] as const
          ).map((entry) => {
            const selected = status === entry.id;
            return (
              <button
                key={entry.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => updateStatusFilter(entry.id)}
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 font-outfit text-[12.5px] font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster ${
                  selected
                    ? "bg-midnight-party text-white"
                    : "border border-midnight-party/10 bg-white text-midnight-party/70 hover:border-lilac-luster/35 hover:text-lilac-luster"
                }`}
              >
                {entry.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    selected
                      ? "bg-white/15 text-white"
                      : "bg-midnight-party/6 text-midnight-party/55"
                  }`}
                >
                  {statusCounts[entry.id]}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className={`${cardClass} overflow-hidden`}>
        {loading ? (
          <div className="flex min-h-[220px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-midnight-party/15 border-t-midnight-party" />
          </div>
        ) : paged.totalItems === 0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 px-6 py-10 text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-offwhite text-midnight-party">
              <Briefcase size={22} aria-hidden="true" />
            </span>
            <h2 className="font-oswald text-lg font-semibold uppercase tracking-wide text-midnight-party">
              No services found
            </h2>
            <p className="max-w-md font-outfit text-[13px] text-midnight-party/55">
              {services.length === 0
                ? "You have not added any services yet. Create your first offering for celebration hosts."
                : "Try a different search or clear the status filter."}
            </p>
            {services.length === 0 ? (
              <Link
                href="/partner/services/new"
                className="mt-1 inline-flex items-center gap-2 rounded-full bg-midnight-party px-4 py-2.5 font-outfit text-[13px] font-semibold text-white transition hover:bg-lilac-luster"
              >
                <Plus size={15} aria-hidden="true" />
                Add Service
              </Link>
            ) : null}
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-black/5 bg-[#fbf8fa]">
                    <th className="px-5 py-3 font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45">
                      Service
                    </th>
                    <th className="px-4 py-3 font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45">
                      Category
                    </th>
                    <th className="px-4 py-3 font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45">
                      Price
                    </th>
                    <th className="px-4 py-3 font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45">
                      Status
                    </th>
                    <th className="px-4 py-3 font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45">
                      Availability
                    </th>
                    <th className="px-4 py-3 font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45">
                      Updated
                    </th>
                    <th className="px-5 py-3 text-right font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paged.items.map((service) => (
                    <tr
                      key={service.id}
                      className="cursor-pointer border-b border-black/5 transition hover:bg-[#fbf8fa]/70"
                      onClick={() =>
                        router.push(`/partner/services/${service.id}`)
                      }
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-black/5 bg-white">
                            <ProductImageThumb
                              src={service.image}
                              size={48}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-outfit text-[13.5px] font-semibold text-midnight-party">
                              {service.name}
                            </p>
                            <p className="mt-0.5 line-clamp-1 font-outfit text-[12px] text-midnight-party/50">
                              {service.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-outfit text-[13px] text-midnight-party">
                        {service.category}
                      </td>
                      <td className="px-4 py-3.5 font-outfit text-[13px] text-midnight-party">
                        {formatPartnerServicePrice(
                          service.priceGhs,
                          service.pricingUnit,
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <ServiceStatusBadge status={service.status} />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="space-y-1">
                          <ServiceAvailabilityBadge
                            availability={service.availability}
                          />
                          <p className="max-w-[160px] truncate font-outfit text-[11px] text-midnight-party/45">
                            {service.availabilityNotes}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-outfit text-[12.5px] text-midnight-party/55">
                        {formatPartnerServiceUpdatedAt(service.updatedAt)}
                      </td>
                      <td
                        className="px-5 py-3.5"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <ServiceActionsMenu
                          service={service}
                          onChangeStatus={() =>
                            setStatusServiceId(service.id)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-black/5 lg:hidden">
              {paged.items.map((service) => (
                <li key={service.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <Link
                      href={`/partner/services/${service.id}`}
                      className="flex min-w-0 flex-1 items-start gap-3"
                    >
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-black/5 bg-white">
                        <ProductImageThumb src={service.image} size={56} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-outfit text-[14px] font-semibold text-midnight-party">
                          {service.name}
                        </p>
                        <p className="mt-0.5 font-outfit text-[12px] text-midnight-party/50">
                          {service.category}
                        </p>
                        <p className="mt-1 line-clamp-2 font-outfit text-[12.5px] text-midnight-party/60">
                          {service.description}
                        </p>
                        <p className="mt-2 font-outfit text-[13px] font-semibold text-midnight-party">
                          {formatPartnerServicePrice(
                            service.priceGhs,
                            service.pricingUnit,
                          )}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <ServiceStatusBadge status={service.status} />
                          <ServiceAvailabilityBadge
                            availability={service.availability}
                          />
                        </div>
                      </div>
                    </Link>
                    <ServiceActionsMenu
                      service={service}
                      onChangeStatus={() => setStatusServiceId(service.id)}
                    />
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 border-t border-black/5 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="font-outfit text-[12.5px] text-midnight-party/55">
                Showing {rangeStart}–{rangeEnd} of {paged.totalItems}
                {status !== "all"
                  ? ` · ${partnerServiceStatusLabel(status)}`
                  : ""}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={paged.page <= 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-midnight-party/10 text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} aria-hidden="true" />
                  <span className="sr-only">Previous page</span>
                </button>
                <span className="font-outfit text-[12.5px] text-midnight-party/60">
                  Page {paged.page} of {paged.totalPages}
                </span>
                <button
                  type="button"
                  disabled={paged.page >= paged.totalPages}
                  onClick={() =>
                    setPage((prev) => Math.min(paged.totalPages, prev + 1))
                  }
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-midnight-party/10 text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight size={16} aria-hidden="true" />
                  <span className="sr-only">Next page</span>
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {activeService ? (
        <ServiceChangeStatusModal
          service={activeService}
          onClose={() => setStatusServiceId(null)}
          onChangeStatus={(nextStatus) =>
            handleChangeStatus(activeService.id, nextStatus)
          }
        />
      ) : null}
    </main>
  );
}
