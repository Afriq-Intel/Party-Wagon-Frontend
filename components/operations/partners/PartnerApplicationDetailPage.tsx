"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Info,
  MessageSquareMore,
  XCircle,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { formatDocumentSize } from "@/lib/data/partner-application";
import { formatBusinessCategoryLabel } from "@/lib/data/partner-application";
import {
  formatPartnerApplicationDateTime,
  partnerApplicationStatusLabel,
  partnerCapabilityLabel,
} from "@/lib/data/operations-partner-applications";
import { usePartnerApplications } from "@/lib/operations/partner-applications-context";
import type { OperationsPartnerApplication } from "@/types/operations-partners";
import {
  ApproveApplicationModal,
  RejectApplicationModal,
  RequestMoreInfoModal,
} from "./PartnerApplicationActionModals";
import { PartnerApplicationStatusBadge } from "./PartnerApplicationStatusBadge";

const cardClass =
  "rounded-2xl border border-black/5 bg-white shadow-[0_10px_28px_rgba(51,16,56,0.05)]";

const labelClass =
  "mb-1 block font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45";

type ReviewDialog = "approve" | "reject" | "more_info";

function DetailField({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div>
      <p className={labelClass}>{label}</p>
      <div className="font-outfit text-[13.5px] leading-relaxed text-midnight-party">
        {value || "-"}
      </div>
    </div>
  );
}

function ReviewActions({
  application,
  onApprove,
  onReject,
  onRequestInfo,
}: {
  application: OperationsPartnerApplication;
  onApprove: () => void;
  onReject: () => void;
  onRequestInfo: () => void;
}) {
  const canDecide =
    application.status === "pending_verification" ||
    application.status === "more_info_required";

  if (!canDecide) {
    return (
      <div className="rounded-xl border border-dashed border-midnight-party/15 bg-[#fbf8fa] px-4 py-3 font-outfit text-[13px] text-midnight-party/65">
        This application is already{" "}
        <span className="font-semibold text-midnight-party">
          {partnerApplicationStatusLabel(application.status).toLowerCase()}
        </span>
        .
        {application.partnerId ? (
          <>
            {" "}
            Partner account{" "}
            <span className="font-semibold text-midnight-party">
              {application.partnerId}
            </span>{" "}
            is in the{" "}
            <Link
              href="/operations/partners/directory"
              className="font-semibold text-lilac-luster underline-offset-2 hover:underline"
            >
              Partner Directory
            </Link>
            .
          </>
        ) : (
          " Further verification actions are closed in this mock."
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      <button
        type="button"
        onClick={onApprove}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-midnight-party px-4 py-2.5 font-outfit text-[13px] font-semibold text-white transition hover:bg-lilac-luster"
      >
        <CheckCircle2 size={16} aria-hidden="true" />
        Approve
      </button>
      <button
        type="button"
        onClick={onRequestInfo}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-lilac-luster/40 bg-lilac-luster/10 px-4 py-2.5 font-outfit text-[13px] font-semibold text-lilac-luster transition hover:bg-lilac-luster hover:text-white"
      >
        <MessageSquareMore size={16} aria-hidden="true" />
        Request more information
      </button>
      <button
        type="button"
        onClick={onReject}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-radiant-rose/30 bg-radiant-rose/8 px-4 py-2.5 font-outfit text-[13px] font-semibold text-radiant-rose transition hover:bg-radiant-rose hover:text-white"
      >
        <XCircle size={16} aria-hidden="true" />
        Reject
      </button>
    </div>
  );
}

export function PartnerApplicationDetailPage({
  applicationId,
}: {
  applicationId: string;
}) {
  const { getApplication, applyDecision } = usePartnerApplications();
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [dialog, setDialog] = useState<ReviewDialog | null>(null);

  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), 400);
    return () => window.clearTimeout(timer);
  }, [applicationId]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 3600);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const application = getApplication(applicationId);

  if (loading) {
    return (
      <main className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col items-center justify-center gap-3 px-4 py-16">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-midnight-party/15 border-t-midnight-party"
          aria-hidden="true"
        />
        <p className="font-outfit text-sm text-midnight-party/60">
          Loading application…
        </p>
      </main>
    );
  }

  if (!application) {
    return (
      <main className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col gap-4 px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/operations/partners/applications"
          className="inline-flex items-center gap-2 self-start font-outfit text-[13px] font-semibold text-lilac-luster transition hover:text-midnight-party"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to applications
        </Link>
        <div className={`${cardClass} px-5 py-12 text-center`}>
          <p className="font-oswald text-xl font-bold uppercase text-midnight-party">
            Application not found
          </p>
          <p className="mt-2 font-outfit text-[13px] text-midnight-party/55">
            This partner application is not in the current mock dataset.
          </p>
        </div>
      </main>
    );
  }

  const current = application;
  const showProducts =
    current.capability === "darkstore" || current.capability === "both";
  const showServices =
    current.capability === "service_provider" ||
    current.capability === "both";

  function closeDialog() {
    setDialog(null);
  }

  function handleApprove() {
    const result = applyDecision(current.id, { type: "approve" });
    setDialog(null);
    if (!result) return;

    if (result.partnerCreated && result.partner) {
      setNotice(
        `“${result.application.businessName}” approved. Partner ${result.partner.partnerId} created with Pending first login. Temporary credentials marked sent securely (password not shown).`,
      );
    } else if (result.partner) {
      setNotice(
        `“${result.application.businessName}” is already approved. Partner ${result.partner.partnerId} already exists. Duplicate account creation skipped.`,
      );
    } else {
      setNotice(`“${result.application.businessName}” approved.`);
    }
  }

  function handleReject(reason: string) {
    const result = applyDecision(current.id, {
      type: "reject",
      reason,
    });
    setDialog(null);
    if (result) {
      setNotice(`“${result.application.businessName}” was rejected.`);
    }
  }

  function handleRequestInfo(message: string) {
    const result = applyDecision(current.id, {
      type: "request_more_info",
      message,
    });
    setDialog(null);
    if (result) {
      setNotice(
        `More information requested for “${result.application.businessName}”.`,
      );
    }
  }

  return (
    <main className="mx-auto flex w-full min-w-0 max-w-[1100px] flex-1 flex-col gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
      <div className="flex flex-col gap-3">
        <Link
          href="/operations/partners/applications"
          className="inline-flex items-center gap-2 self-start font-outfit text-[13px] font-semibold text-lilac-luster transition hover:text-midnight-party"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to applications
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="font-outfit text-[11px] font-semibold uppercase tracking-[0.16em] text-midnight-party/45">
              Application review
            </p>
            <h1 className="mt-1 font-oswald text-[1.6rem] font-bold uppercase leading-[1.05] tracking-wide text-midnight-party sm:text-[1.9rem]">
              {current.businessName}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <PartnerApplicationStatusBadge status={current.status} />
              <span className="font-outfit text-[12.5px] text-midnight-party/50">
                {current.referenceId}
              </span>
            </div>
          </div>
        </div>
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
        <div className="mb-4 flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lemon-twist/20 text-midnight-party">
            <Info size={16} aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-oswald text-lg font-bold uppercase tracking-wide text-midnight-party">
              Verification actions
            </h2>
            <p className="mt-1 font-outfit text-[13px] text-midnight-party/60">
              Public application → Operations verification → Partner account
              creation. Temporary credentials are marked sent securely; passwords
              are never shown here.
            </p>
          </div>
        </div>
        <ReviewActions
          application={current}
          onApprove={() => setDialog("approve")}
          onReject={() => setDialog("reject")}
          onRequestInfo={() => setDialog("more_info")}
        />
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <section className={`${cardClass} p-4 sm:p-5`}>
          <h2 className="mb-4 font-oswald text-lg font-bold uppercase tracking-wide text-midnight-party">
            Submitted details
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Business name" value={current.businessName} />
            <DetailField
              label="Capability"
              value={partnerCapabilityLabel(current.capability)}
            />
            <DetailField label="Contact person" value={current.contactName} />
            <DetailField label="Email" value={current.email} />
            <DetailField label="Phone" value={current.phone} />
            <DetailField label="Location / address" value={current.address} />
            <div className="sm:col-span-2">
              <p className={labelClass}>Business categories</p>
              {current.businessCategories.length > 0 ? (
                <ul className="flex flex-wrap gap-2">
                  {current.businessCategories.map((category) => (
                    <li
                      key={`${category.kind}:${category.name}`}
                      className="rounded-full border border-lilac-luster/25 bg-lilac-luster/8 px-3 py-1 font-outfit text-[12px] font-semibold text-lilac-luster"
                    >
                      {formatBusinessCategoryLabel(category)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="font-outfit text-[13.5px] text-midnight-party">-</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <DetailField
                label="Business description"
                value={current.description}
              />
            </div>
            {showProducts ? (
              <div className="sm:col-span-2">
                <DetailField
                  label="Products offered"
                  value={current.productsOffered}
                />
              </div>
            ) : null}
            {showServices ? (
              <div className="sm:col-span-2">
                <DetailField
                  label="Services offered"
                  value={current.servicesOffered}
                />
              </div>
            ) : null}
          </div>
        </section>

        <div className="flex flex-col gap-4">
          <section className={`${cardClass} p-4 sm:p-5`}>
            <h2 className="mb-4 font-oswald text-lg font-bold uppercase tracking-wide text-midnight-party">
              Timeline
            </h2>
            <div className="space-y-3">
              <DetailField
                label="Submitted"
                value={formatPartnerApplicationDateTime(current.submittedAt)}
              />
              <DetailField
                label="Last updated"
                value={formatPartnerApplicationDateTime(current.updatedAt)}
              />
              <DetailField
                label="Status"
                value={
                  <PartnerApplicationStatusBadge status={current.status} />
                }
              />
              {current.partnerId ? (
                <DetailField
                  label="Partner ID"
                  value={
                    <Link
                      href="/operations/partners/directory"
                      className="font-semibold text-lilac-luster underline-offset-2 hover:underline"
                    >
                      {current.partnerId}
                    </Link>
                  }
                />
              ) : null}
            </div>
          </section>

          <section className={`${cardClass} p-4 sm:p-5`}>
            <h2 className="mb-4 font-oswald text-lg font-bold uppercase tracking-wide text-midnight-party">
              Supporting documents
            </h2>
            {current.documents.length === 0 ? (
              <p className="font-outfit text-[13px] text-midnight-party/55">
                No supporting documents were attached.
              </p>
            ) : (
              <ul className="space-y-2">
                {current.documents.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex items-center gap-3 rounded-xl border border-midnight-party/8 bg-[#fbf8fa] px-3 py-2.5"
                  >
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-lilac-luster">
                      <FileText size={16} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-outfit text-[13px] font-semibold text-midnight-party">
                        {doc.name}
                      </p>
                      <p className="font-outfit text-[11.5px] text-midnight-party/50">
                        {formatDocumentSize(doc.sizeBytes)} · mock attachment
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      {current.rejectionReason ||
      current.moreInfoMessage ||
      current.reviewNotes ? (
        <section className={`${cardClass} p-4 sm:p-5`}>
          <h2 className="mb-4 font-oswald text-lg font-bold uppercase tracking-wide text-midnight-party">
            Review notes
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {current.rejectionReason ? (
              <DetailField
                label="Rejection reason"
                value={current.rejectionReason}
              />
            ) : null}
            {current.moreInfoMessage ? (
              <DetailField
                label="More information request"
                value={current.moreInfoMessage}
              />
            ) : null}
            {current.reviewNotes ? (
              <DetailField
                label="Internal notes"
                value={current.reviewNotes}
              />
            ) : null}
          </div>
        </section>
      ) : null}

      {dialog === "approve" ? (
        <ApproveApplicationModal
          application={current}
          onClose={closeDialog}
          onConfirm={handleApprove}
        />
      ) : null}
      {dialog === "reject" ? (
        <RejectApplicationModal
          application={current}
          onClose={closeDialog}
          onConfirm={handleReject}
        />
      ) : null}
      {dialog === "more_info" ? (
        <RequestMoreInfoModal
          application={current}
          onClose={closeDialog}
          onConfirm={handleRequestInfo}
        />
      ) : null}
    </main>
  );
}
