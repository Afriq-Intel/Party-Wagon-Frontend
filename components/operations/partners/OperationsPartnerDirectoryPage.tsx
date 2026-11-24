"use client";

import {
  ChevronLeft,
  ChevronRight,
  Search,
  Users,
} from "lucide-react";
import {
  useEffect,
  useId,
  useState,
  type ChangeEvent,
} from "react";
import { PARTNER_CAPABILITY_OPTIONS } from "@/lib/data/partner-application";
import {
  formatPartnerDirectoryDate,
  OPERATIONS_PARTNER_ACCOUNT_STATUSES,
  OPERATIONS_PARTNER_DIRECTORY_PAGE_SIZE,
  OPERATIONS_PARTNER_VERIFICATION_STATUSES,
  partnerAccountStatusLabel,
  partnerVerificationStatusLabel,
} from "@/lib/data/operations-partner-accounts";
import { partnerCapabilityLabel } from "@/lib/data/operations-partner-applications";
import {
  filterPartnerAccounts,
  paginatePartnerAccounts,
} from "@/lib/operations/filter-partner-accounts";
import { usePartnerApplications } from "@/lib/operations/partner-applications-context";
import type { PartnerCapability } from "@/types/partner-application";
import type {
  OperationsPartnerAccountStatus,
  OperationsPartnerVerificationStatus,
} from "@/types/operations-partners";
import {
  PartnerAccountStatusBadge,
  PartnerCredentialsDeliveryBadge,
  PartnerVerificationStatusBadge,
} from "./PartnerAccountStatusBadges";

const cardClass =
  "rounded-2xl border border-black/5 bg-white shadow-[0_10px_28px_rgba(51,16,56,0.05)]";

export function OperationsPartnerDirectoryPage() {
  const searchId = useId();
  const capabilityId = useId();
  const verificationId = useId();
  const accountStatusId = useId();
  const { partners, partnerDirectoryCount } = usePartnerApplications();

  const [search, setSearch] = useState("");
  const [capability, setCapability] = useState<PartnerCapability | "all">(
    "all",
  );
  const [verificationStatus, setVerificationStatus] = useState<
    OperationsPartnerVerificationStatus | "all"
  >("all");
  const [accountStatus, setAccountStatus] = useState<
    OperationsPartnerAccountStatus | "all"
  >("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 450);
    return () => window.clearTimeout(timer);
  }, []);

  const filtered = filterPartnerAccounts(partners, {
    search,
    capability,
    verificationStatus,
    accountStatus,
  });

  const paged = paginatePartnerAccounts(
    filtered,
    page,
    OPERATIONS_PARTNER_DIRECTORY_PAGE_SIZE,
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

  function clearFilters() {
    setSearch("");
    setCapability("all");
    setVerificationStatus("all");
    setAccountStatus("all");
    setPage(1);
  }

  const rangeStart =
    paged.totalItems === 0 ? 0 : (paged.page - 1) * paged.pageSize + 1;
  const rangeEnd = Math.min(paged.page * paged.pageSize, paged.totalItems);
  const pendingFirstLogin = partners.filter(
    (partner) => partner.accountStatus === "pending_first_login",
  ).length;

  return (
    <main className="mx-auto flex w-full min-w-0 max-w-[1400px] flex-1 flex-col gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <p className="font-outfit text-[11px] font-semibold uppercase tracking-[0.16em] text-midnight-party/45">
            Manage Partners
          </p>
          <h1 className="mt-1 font-oswald text-[1.7rem] font-bold uppercase leading-[1.05] tracking-wide text-midnight-party sm:text-[2rem]">
            Partner directory
          </h1>
          <p className="mt-1.5 max-w-2xl font-outfit text-[13px] leading-relaxed text-midnight-party/60 sm:text-[14px]">
            Approved partners provisioned after Operations verification.
            Temporary credentials are delivered securely. Passwords are never
            shown here.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 self-start">
          <div className="rounded-2xl border border-midnight-party/10 bg-white px-4 py-3">
            <p className="font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/55">
              Directory partners
            </p>
            <p className="mt-0.5 font-oswald text-2xl font-bold text-midnight-party">
              {partnerDirectoryCount}
            </p>
          </div>
          <div className="rounded-2xl border border-lemon-twist/40 bg-lemon-twist/15 px-4 py-3">
            <p className="font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/55">
              Pending first login
            </p>
            <p className="mt-0.5 font-oswald text-2xl font-bold text-midnight-party">
              {pendingFirstLogin}
            </p>
          </div>
        </div>
      </div>

      <section className={`${cardClass} p-4 sm:p-5`}>
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end">
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
                placeholder="Search by name, Partner ID, contact or email"
                className="w-full rounded-xl border border-midnight-party/10 bg-[#fbf8fa] py-2.5 pl-10 pr-3 font-outfit text-[13px] text-midnight-party outline-none transition placeholder:text-midnight-party/35 focus:border-lilac-luster/40 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:w-[640px]">
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
                onChange={(event) => {
                  setCapability(event.target.value as PartnerCapability | "all");
                  setPage(1);
                }}
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

            <div>
              <label
                htmlFor={verificationId}
                className="mb-1.5 block font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45"
              >
                Verification
              </label>
              <select
                id={verificationId}
                value={verificationStatus}
                onChange={(event) => {
                  setVerificationStatus(
                    event.target.value as
                      | OperationsPartnerVerificationStatus
                      | "all",
                  );
                  setPage(1);
                }}
                className="w-full rounded-xl border border-midnight-party/10 bg-[#fbf8fa] px-3 py-2.5 font-outfit text-[13px] text-midnight-party outline-none transition focus:border-lilac-luster/40 focus:bg-white"
              >
                <option value="all">All verification</option>
                {OPERATIONS_PARTNER_VERIFICATION_STATUSES.map((entry) => (
                  <option key={entry} value={entry}>
                    {partnerVerificationStatusLabel(entry)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor={accountStatusId}
                className="mb-1.5 block font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45"
              >
                Account status
              </label>
              <select
                id={accountStatusId}
                value={accountStatus}
                onChange={(event) => {
                  setAccountStatus(
                    event.target.value as OperationsPartnerAccountStatus | "all",
                  );
                  setPage(1);
                }}
                className="w-full rounded-xl border border-midnight-party/10 bg-[#fbf8fa] px-3 py-2.5 font-outfit text-[13px] text-midnight-party outline-none transition focus:border-lilac-luster/40 focus:bg-white"
              >
                <option value="all">All account statuses</option>
                {OPERATIONS_PARTNER_ACCOUNT_STATUSES.map((entry) => (
                  <option key={entry} value={entry}>
                    {partnerAccountStatusLabel(entry)}
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
              Loading partner directory…
            </p>
          </div>
        ) : paged.totalItems === 0 ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 px-4 py-16 text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-offwhite text-midnight-party">
              <Users size={22} aria-hidden="true" />
            </span>
            <div>
              <p className="font-oswald text-lg font-semibold uppercase tracking-wide text-midnight-party">
                No partners found
              </p>
              <p className="mt-1 max-w-sm font-outfit text-[13px] text-midnight-party/55">
                {partnerDirectoryCount === 0
                  ? "Approve a partner application to provision the first directory account."
                  : "Try a different search or clear the capability and status filters."}
              </p>
            </div>
            {partnerDirectoryCount > 0 ? (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-1 rounded-full border border-midnight-party/15 px-4 py-2 font-outfit text-[12.5px] font-semibold text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-black/5 bg-[#fbf8fa]">
                    {[
                      "Partner",
                      "Partner ID",
                      "Capability",
                      "Verification",
                      "Account status",
                      "Contact",
                      "Approved",
                      "Credentials",
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
                  {paged.items.map((partner) => (
                    <tr
                      key={partner.id}
                      className="border-b border-black/5 last:border-b-0"
                    >
                      <td className="px-4 py-3 sm:px-5">
                        <p className="font-outfit text-[13px] font-semibold text-midnight-party">
                          {partner.businessName}
                        </p>
                        <p className="mt-0.5 font-outfit text-[12px] text-midnight-party/50">
                          {partner.contactName}
                        </p>
                      </td>
                      <td className="px-4 py-3 font-outfit text-[12.5px] font-semibold text-midnight-party/75 sm:px-5">
                        {partner.partnerId}
                      </td>
                      <td className="px-4 py-3 font-outfit text-[13px] text-midnight-party/70 sm:px-5">
                        {partnerCapabilityLabel(partner.capability)}
                      </td>
                      <td className="px-4 py-3 sm:px-5">
                        <PartnerVerificationStatusBadge
                          status={partner.verificationStatus}
                        />
                      </td>
                      <td className="px-4 py-3 sm:px-5">
                        <PartnerAccountStatusBadge
                          status={partner.accountStatus}
                        />
                      </td>
                      <td className="px-4 py-3 sm:px-5">
                        <p className="font-outfit text-[12.5px] text-midnight-party/75">
                          {partner.email}
                        </p>
                        <p className="mt-0.5 font-outfit text-[12px] text-midnight-party/50">
                          {partner.phone}
                        </p>
                      </td>
                      <td className="px-4 py-3 font-outfit text-[12.5px] text-midnight-party/55 sm:px-5">
                        {formatPartnerDirectoryDate(partner.approvedAt)}
                      </td>
                      <td className="px-4 py-3 sm:px-5">
                        <PartnerCredentialsDeliveryBadge
                          status={partner.credentialsDeliveryStatus}
                        />
                        <p className="mt-1 font-outfit text-[11px] text-midnight-party/40">
                          Password not shown
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-black/5 lg:hidden">
              {paged.items.map((partner) => (
                <li key={partner.id} className="p-4">
                  <p className="font-outfit text-[14px] font-semibold text-midnight-party">
                    {partner.businessName}
                  </p>
                  <p className="mt-0.5 font-outfit text-[12px] text-midnight-party/50">
                    {partner.contactName} · {partner.partnerId}
                  </p>
                  <p className="mt-2 font-outfit text-[12.5px] text-midnight-party/70">
                    {partnerCapabilityLabel(partner.capability)}
                  </p>
                  <p className="mt-1 font-outfit text-[12px] text-midnight-party/55">
                    {partner.email}
                    <span className="mx-1 text-midnight-party/30">·</span>
                    {partner.phone}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <PartnerVerificationStatusBadge
                      status={partner.verificationStatus}
                    />
                    <PartnerAccountStatusBadge status={partner.accountStatus} />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <PartnerCredentialsDeliveryBadge
                      status={partner.credentialsDeliveryStatus}
                    />
                    <span className="font-outfit text-[11px] text-midnight-party/40">
                      Approved {formatPartnerDirectoryDate(partner.approvedAt)}
                    </span>
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
