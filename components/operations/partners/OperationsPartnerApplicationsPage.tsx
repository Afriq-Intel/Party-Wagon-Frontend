"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Eye,
  Search,
} from "lucide-react";
import {
  useEffect,
  useId,
  useState,
  type ChangeEvent,
} from "react";
import { PARTNER_CAPABILITY_OPTIONS } from "@/lib/data/partner-application";
import {
  formatPartnerApplicationDate,
  OPERATIONS_PARTNER_APPLICATION_STATUSES,
  OPERATIONS_PARTNER_APPLICATIONS_PAGE_SIZE,
  partnerApplicationStatusLabel,
  partnerCapabilityLabel,
} from "@/lib/data/operations-partner-applications";
import {
  filterPartnerApplications,
  paginatePartnerApplications,
} from "@/lib/operations/filter-partner-applications";
import { usePartnerApplications } from "@/lib/operations/partner-applications-context";
import type { PartnerCapability } from "@/types/partner-application";
import type { OperationsPartnerApplicationStatus } from "@/types/operations-partners";
import { PartnerApplicationStatusBadge } from "./PartnerApplicationStatusBadge";

const cardClass =
  "rounded-2xl border border-black/5 bg-white shadow-[0_10px_28px_rgba(51,16,56,0.05)]";

export function OperationsPartnerApplicationsPage() {
  const router = useRouter();
  const searchId = useId();
  const statusId = useId();
  const capabilityId = useId();
  const { applications, totalCount, pendingCount } = usePartnerApplications();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<
    OperationsPartnerApplicationStatus | "all"
  >("all");
  const [capability, setCapability] = useState<PartnerCapability | "all">(
    "all",
  );
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 450);
    return () => window.clearTimeout(timer);
  }, []);

  const filtered = filterPartnerApplications(applications, {
    search,
    status,
    capability,
  });

  const paged = paginatePartnerApplications(
    filtered,
    page,
    OPERATIONS_PARTNER_APPLICATIONS_PAGE_SIZE,
  );

  useEffect(() => {
    if (page > paged.totalPages) {
      setPage(paged.totalPages);
    }
  }, [page, paged.totalPages]);

  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function updateStatus(value: OperationsPartnerApplicationStatus | "all") {
    setStatus(value);
    setPage(1);
  }

  function updateCapability(value: PartnerCapability | "all") {
    setCapability(value);
    setPage(1);
  }

  function clearFilters() {
    updateSearch("");
    updateStatus("all");
    updateCapability("all");
  }

  const rangeStart =
    paged.totalItems === 0 ? 0 : (paged.page - 1) * paged.pageSize + 1;
  const rangeEnd = Math.min(paged.page * paged.pageSize, paged.totalItems);

  return (
    <main className="mx-auto flex w-full min-w-0 max-w-[1400px] flex-1 flex-col gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <p className="font-outfit text-[11px] font-semibold uppercase tracking-[0.16em] text-midnight-party/45">
            Manage Partners
          </p>
          <h1 className="mt-1 font-oswald text-[1.7rem] font-bold uppercase leading-[1.05] tracking-wide text-midnight-party sm:text-[2rem]">
            Partner applications
          </h1>
          <p className="mt-1.5 max-w-2xl font-outfit text-[13px] leading-relaxed text-midnight-party/60 sm:text-[14px]">
            Review public partner applications for Operations verification.
            Approval here does not create partner accounts yet. Approved and
            rejected rows stay in history; only pending counts toward the queue.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 self-start">
          <div className="rounded-2xl border border-midnight-party/10 bg-white px-4 py-3">
            <p className="font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/55">
              Total applications
            </p>
            <p className="mt-0.5 font-oswald text-2xl font-bold text-midnight-party">
              {totalCount}
            </p>
          </div>
          <div className="rounded-2xl border border-lemon-twist/40 bg-lemon-twist/15 px-4 py-3">
            <p className="font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/55">
              Pending verification
            </p>
            <p className="mt-0.5 font-oswald text-2xl font-bold text-midnight-party">
              {pendingCount}
            </p>
          </div>
        </div>
      </div>

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
                placeholder="Search by business, contact, email or reference"
                className="w-full rounded-xl border border-midnight-party/10 bg-[#fbf8fa] py-2.5 pl-10 pr-3 font-outfit text-[13px] text-midnight-party outline-none transition placeholder:text-midnight-party/35 focus:border-lilac-luster/40 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-[420px]">
            <div>
              <label
                htmlFor={statusId}
                className="mb-1.5 block font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45"
              >
                Status
              </label>
              <select
                id={statusId}
                value={status}
                onChange={(event) =>
                  updateStatus(
                    event.target.value as
                      | OperationsPartnerApplicationStatus
                      | "all",
                  )
                }
                className="w-full rounded-xl border border-midnight-party/10 bg-[#fbf8fa] px-3 py-2.5 font-outfit text-[13px] text-midnight-party outline-none transition focus:border-lilac-luster/40 focus:bg-white"
              >
                <option value="all">All statuses</option>
                {OPERATIONS_PARTNER_APPLICATION_STATUSES.map((entry) => (
                  <option key={entry} value={entry}>
                    {partnerApplicationStatusLabel(entry)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor={capabilityId}
                className="mb-1.5 block font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45"
              >
                Capability
              </label>
              <select
                id={capabilityId}
                value={capability}
                onChange={(event) =>
                  updateCapability(
                    event.target.value as PartnerCapability | "all",
                  )
                }
                className="w-full rounded-xl border border-midnight-party/10 bg-[#fbf8fa] px-3 py-2.5 font-outfit text-[13px] text-midnight-party outline-none transition focus:border-lilac-luster/40 focus:bg-white"
              >
                <option value="all">All capabilities</option>
                {PARTNER_CAPABILITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className={`${cardClass} overflow-hidden`}>
        {loading ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 px-4 py-16">
            <div
              className="h-8 w-8 animate-spin rounded-full border-2 border-midnight-party/15 border-t-midnight-party"
              aria-hidden="true"
            />
            <p className="font-outfit text-sm text-midnight-party/60">
              Loading applications…
            </p>
          </div>
        ) : paged.totalItems === 0 ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 px-4 py-16 text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-offwhite text-midnight-party">
              <ClipboardList size={22} aria-hidden="true" />
            </span>
            <div>
              <p className="font-oswald text-lg font-semibold uppercase tracking-wide text-midnight-party">
                No applications found
              </p>
              <p className="mt-1 max-w-sm font-outfit text-[13px] text-midnight-party/55">
                Try a different search term or clear the status and capability
                filters.
              </p>
            </div>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-1 rounded-full border border-midnight-party/15 px-4 py-2 font-outfit text-[12.5px] font-semibold text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-black/5 bg-[#fbf8fa]">
                    {[
                      "Business",
                      "Contact",
                      "Capability",
                      "Submitted",
                      "Status",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        scope="col"
                        className="px-4 py-3 font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45 sm:px-5"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paged.items.map((application) => (
                    <tr
                      key={application.id}
                      className="border-b border-black/5 last:border-b-0"
                    >
                      <td className="px-4 py-3 sm:px-5">
                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/operations/partners/applications/${application.id}`,
                            )
                          }
                          className="min-w-0 text-left transition hover:opacity-80"
                        >
                          <span className="block font-outfit text-[13px] font-semibold text-midnight-party">
                            {application.businessName}
                          </span>
                          <span className="mt-0.5 block font-outfit text-[11.5px] text-midnight-party/45">
                            {application.referenceId}
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-3 sm:px-5">
                        <p className="font-outfit text-[13px] text-midnight-party/80">
                          {application.contactName}
                        </p>
                        <p className="mt-0.5 font-outfit text-[12px] text-midnight-party/50">
                          {application.email}
                        </p>
                      </td>
                      <td className="px-4 py-3 font-outfit text-[13px] text-midnight-party/70 sm:px-5">
                        {partnerCapabilityLabel(application.capability)}
                      </td>
                      <td className="px-4 py-3 font-outfit text-[12.5px] text-midnight-party/55 sm:px-5">
                        {formatPartnerApplicationDate(application.submittedAt)}
                      </td>
                      <td className="px-4 py-3 sm:px-5">
                        <PartnerApplicationStatusBadge
                          status={application.status}
                        />
                      </td>
                      <td className="px-4 py-3 sm:px-5">
                        <Link
                          href={`/operations/partners/applications/${application.id}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-midnight-party/10 text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
                          title="Review application"
                        >
                          <Eye size={15} aria-hidden="true" />
                          <span className="sr-only">
                            Review {application.businessName}
                          </span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-black/5 lg:hidden">
              {paged.items.map((application) => (
                <li key={application.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <Link
                      href={`/operations/partners/applications/${application.id}`}
                      className="min-w-0 flex-1"
                    >
                      <p className="font-outfit text-[14px] font-semibold text-midnight-party">
                        {application.businessName}
                      </p>
                      <p className="mt-0.5 font-outfit text-[11.5px] text-midnight-party/45">
                        {application.referenceId}
                      </p>
                      <p className="mt-2 font-outfit text-[12.5px] text-midnight-party/70">
                        {application.contactName} · {application.email}
                      </p>
                      <p className="mt-1 font-outfit text-[12px] text-midnight-party/50">
                        {partnerCapabilityLabel(application.capability)} ·{" "}
                        {formatPartnerApplicationDate(application.submittedAt)}
                      </p>
                      <div className="mt-2">
                        <PartnerApplicationStatusBadge
                          status={application.status}
                        />
                      </div>
                    </Link>
                    <Link
                      href={`/operations/partners/applications/${application.id}`}
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-midnight-party/10 text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster"
                      title="Review application"
                    >
                      <Eye size={15} aria-hidden="true" />
                      <span className="sr-only">
                        Review {application.businessName}
                      </span>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 border-t border-black/5 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="font-outfit text-[12.5px] text-midnight-party/55">
                Showing {rangeStart}–{rangeEnd} of {paged.totalItems}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={paged.page <= 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  className="inline-flex items-center gap-1 rounded-full border border-midnight-party/10 px-3 py-1.5 font-outfit text-[12px] font-semibold text-midnight-party transition enabled:hover:border-lilac-luster/40 enabled:hover:text-lilac-luster disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={14} aria-hidden="true" />
                  Previous
                </button>
                <span className="font-outfit text-[12px] text-midnight-party/50">
                  Page {paged.page} of {paged.totalPages}
                </span>
                <button
                  type="button"
                  disabled={paged.page >= paged.totalPages}
                  onClick={() =>
                    setPage((prev) => Math.min(paged.totalPages, prev + 1))
                  }
                  className="inline-flex items-center gap-1 rounded-full border border-midnight-party/10 px-3 py-1.5 font-outfit text-[12px] font-semibold text-midnight-party transition enabled:hover:border-lilac-luster/40 enabled:hover:text-lilac-luster disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={14} aria-hidden="true" />
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
