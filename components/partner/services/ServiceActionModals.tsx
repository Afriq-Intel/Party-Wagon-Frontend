"use client";

import { X } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ProductImageThumb } from "@/components/operations/products/ProductImageThumb";
import {
  partnerServiceStatusHint,
  partnerServiceStatusLabel,
} from "@/lib/data/partner-services";
import type {
  PartnerService,
  PartnerServiceStatus,
} from "@/types/partner-services";
import { ServiceStatusBadge } from "./ServiceStatusBadge";

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

const STATUS_ACTIONS: {
  value: PartnerServiceStatus;
  title: string;
  description: string;
}[] = [
  {
    value: "active",
    title: "Activate",
    description: "Make this service visible and bookable for celebration hosts.",
  },
  {
    value: "draft",
    title: "Move to draft",
    description: "Keep the listing private while you refine details.",
  },
  {
    value: "inactive",
    title: "Deactivate",
    description: "Hide the service from active listings until you reactivate it.",
  },
];

export function ServiceChangeStatusModal({
  service,
  onClose,
  onChangeStatus,
}: {
  service: PartnerService;
  onClose: () => void;
  onChangeStatus: (status: PartnerServiceStatus) => void;
}) {
  const [selected, setSelected] = useState<PartnerServiceStatus>(
    service.status,
  );

  return (
    <ModalShell title="Change service status" onClose={onClose}>
      <div className="flex items-start gap-3 rounded-xl border border-black/5 bg-[#fbf8fa] p-3">
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
          <div className="mt-2">
            <ServiceStatusBadge status={service.status} />
          </div>
        </div>
      </div>

      <p className="mt-4 font-outfit text-[12.5px] text-midnight-party/60">
        {partnerServiceStatusHint(service.status)}
      </p>

      <fieldset className="mt-4 space-y-2">
        <legend className="mb-2 font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45">
          Choose status
        </legend>
        {STATUS_ACTIONS.map((action) => {
          const checked = selected === action.value;
          return (
            <label
              key={action.value}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 transition ${
                checked
                  ? "border-lilac-luster/40 bg-lilac-luster/5"
                  : "border-midnight-party/10 bg-white hover:border-lilac-luster/25"
              }`}
            >
              <input
                type="radio"
                name="service-status"
                value={action.value}
                checked={checked}
                onChange={() => setSelected(action.value)}
                className="mt-1"
              />
              <span className="min-w-0">
                <span className="block font-outfit text-[13px] font-semibold text-midnight-party">
                  {action.title}
                </span>
                <span className="mt-0.5 block font-outfit text-[12px] text-midnight-party/55">
                  {action.description}
                </span>
              </span>
            </label>
          );
        })}
      </fieldset>

      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center justify-center rounded-full border border-midnight-party/15 px-4 py-2.5 font-outfit text-[13px] font-semibold text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={selected === service.status}
          onClick={() => onChangeStatus(selected)}
          className="inline-flex items-center justify-center rounded-full bg-midnight-party px-4 py-2.5 font-outfit text-[13px] font-semibold text-white transition hover:bg-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster disabled:cursor-not-allowed disabled:opacity-45"
        >
          Set as {partnerServiceStatusLabel(selected).toLowerCase()}
        </button>
      </div>
    </ModalShell>
  );
}
