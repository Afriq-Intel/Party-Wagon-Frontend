"use client";

import { X } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { partnerApplicationStatusLabel } from "@/lib/data/operations-partner-applications";
import type { OperationsPartnerApplication } from "@/types/operations-partners";
import { PartnerApplicationStatusBadge } from "./PartnerApplicationStatusBadge";

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onEscape);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-midnight-party/45"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[81] flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl border border-black/5 bg-white shadow-[0_24px_60px_rgba(51,16,56,0.22)] sm:max-w-lg sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-black/5 px-4 py-3.5 sm:px-5">
          <h2
            id={titleId}
            className="font-oswald text-[1.15rem] font-bold uppercase tracking-wide text-midnight-party"
          >
            {title}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-midnight-party/10 text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
          >
            <X size={16} aria-hidden="true" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
          {children}
        </div>
      </div>
    </div>
  );
}

function ApplicationSummary({
  application,
}: {
  application: OperationsPartnerApplication;
}) {
  return (
    <div className="rounded-xl border border-black/5 bg-[#fbf8fa] px-3.5 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-outfit text-[13px] font-semibold text-midnight-party">
          {application.businessName}
        </p>
        <PartnerApplicationStatusBadge status={application.status} />
      </div>
      <p className="mt-1 font-outfit text-[12.5px] text-midnight-party/55">
        {application.contactName} · {application.referenceId}
      </p>
      <p className="mt-1 font-outfit text-[11.5px] text-midnight-party/45">
        Current status: {partnerApplicationStatusLabel(application.status)}
      </p>
    </div>
  );
}

export function ApproveApplicationModal({
  application,
  onClose,
  onConfirm,
}: {
  application: OperationsPartnerApplication;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <ModalShell title="Approve application" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <ApplicationSummary application={application} />
        <p className="font-outfit text-[13px] leading-relaxed text-midnight-party/70">
          Approving creates a Partner Directory account, assigns a unique
          Partner ID, and marks temporary credentials as{" "}
          <span className="font-semibold text-midnight-party">
            sent securely
          </span>
          . Passwords are never shown in Operations. First login and password
          change happen later on the partner side.
        </p>
        <div className="flex flex-col-reverse gap-2 border-t border-black/5 pt-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-midnight-party/15 px-4 py-2.5 font-outfit text-[13px] font-semibold text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-midnight-party px-4 py-2.5 font-outfit text-[13px] font-semibold text-white transition hover:bg-lilac-luster"
          >
            Approve &amp; create partner
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

export function RejectApplicationModal({
  application,
  onClose,
  onConfirm,
}: {
  application: OperationsPartnerApplication;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) {
  const reasonId = useId();
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = reason.trim();
    if (!trimmed) {
      setError("A rejection reason is required.");
      return;
    }
    onConfirm(trimmed);
  }

  return (
    <ModalShell title="Reject application" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <ApplicationSummary application={application} />
        <p className="font-outfit text-[13px] leading-relaxed text-midnight-party/70">
          Rejecting keeps this record in Operations history. No partner account
          is created.
        </p>
        <div>
          <label
            htmlFor={reasonId}
            className="mb-1.5 block font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45"
          >
            Rejection reason
          </label>
          <textarea
            id={reasonId}
            required
            rows={4}
            value={reason}
            onChange={(event) => {
              setReason(event.target.value);
              if (error) setError(null);
            }}
            className="w-full resize-y rounded-xl border border-midnight-party/10 bg-[#fbf8fa] px-3 py-2.5 font-outfit text-[13px] text-midnight-party outline-none transition focus:border-lilac-luster/40 focus:bg-white"
            placeholder="Explain why this application cannot proceed…"
            aria-invalid={Boolean(error)}
          />
          {error ? (
            <p className="mt-1.5 font-outfit text-[12.5px] text-radiant-rose" role="alert">
              {error}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col-reverse gap-2 border-t border-black/5 pt-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-midnight-party/15 px-4 py-2.5 font-outfit text-[13px] font-semibold text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-full bg-radiant-rose px-4 py-2.5 font-outfit text-[13px] font-semibold text-white transition hover:bg-radiant-rose/90"
          >
            Confirm rejection
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

export function RequestMoreInfoModal({
  application,
  onClose,
  onConfirm,
}: {
  application: OperationsPartnerApplication;
  onClose: () => void;
  onConfirm: (message: string) => void;
}) {
  const messageId = useId();
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) {
      setError("Add a short message describing what you need.");
      return;
    }
    onConfirm(trimmed);
  }

  return (
    <ModalShell title="Request more information" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <ApplicationSummary application={application} />
        <p className="font-outfit text-[13px] leading-relaxed text-midnight-party/70">
          Mark this application as needing more information. The applicant will
          not receive an automatic email in this mock; status updates locally
          for Operations review.
        </p>
        <div>
          <label
            htmlFor={messageId}
            className="mb-1.5 block font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45"
          >
            Message to applicant
          </label>
          <textarea
            id={messageId}
            required
            rows={4}
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              if (error) setError(null);
            }}
            className="w-full resize-y rounded-xl border border-midnight-party/10 bg-[#fbf8fa] px-3 py-2.5 font-outfit text-[13px] text-midnight-party outline-none transition focus:border-lilac-luster/40 focus:bg-white"
            placeholder="What extra documents or details do you need?"
            aria-invalid={Boolean(error)}
          />
          {error ? (
            <p className="mt-1.5 font-outfit text-[12.5px] text-radiant-rose" role="alert">
              {error}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col-reverse gap-2 border-t border-black/5 pt-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-midnight-party/15 px-4 py-2.5 font-outfit text-[13px] font-semibold text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-full bg-lilac-luster px-4 py-2.5 font-outfit text-[13px] font-semibold text-white transition hover:bg-lilac-luster/90"
          >
            Send request
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
