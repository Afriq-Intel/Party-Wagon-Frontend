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
import {
  formatPartnerServicePrice,
  partnerServiceStatusLabel,
} from "@/lib/data/partner-services";
import {
  PARTNER_SERVICE_PRICING_UNITS,
  type PartnerService,
  type PartnerServicePackage,
} from "@/types/partner-services";
import { ServiceStatusBadge } from "@/components/partner/services/ServiceStatusBadge";

const fieldClass =
  "w-full rounded-xl border border-midnight-party/10 bg-[#fbf8fa] px-3 py-2.5 font-outfit text-[13px] text-midnight-party outline-none transition focus:border-lilac-luster/40 focus:bg-white";

const labelClass =
  "mb-1.5 block font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45";

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

export type PackageFormValues = {
  name: string;
  description: string;
  priceGhs: number;
  pricingUnit: string;
};

export function PackageFormModal({
  title,
  serviceName,
  initial,
  onClose,
  onSave,
}: {
  title: string;
  serviceName: string;
  initial: PackageFormValues;
  onClose: () => void;
  onSave: (values: PackageFormValues) => string | null;
}) {
  const formId = useId();
  const [name, setName] = useState(initial.name);
  const [description, setDescription] = useState(initial.description);
  const [priceGhs, setPriceGhs] = useState(String(initial.priceGhs));
  const [pricingUnit, setPricingUnit] = useState(initial.pricingUnit);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const price = Number(priceGhs);
    if (!name.trim()) {
      setError("Package name is required.");
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      setError("Enter a valid price in GHS.");
      return;
    }
    if (!pricingUnit.trim()) {
      setError("Pricing unit is required.");
      return;
    }

    const saveError = onSave({
      name: name.trim(),
      description: description.trim(),
      priceGhs: price,
      pricingUnit: pricingUnit.trim(),
    });
    if (saveError) {
      setError(saveError);
      return;
    }
  }

  return (
    <ModalShell title={title} onClose={onClose}>
      <p className="mb-4 font-outfit text-[12.5px] text-midnight-party/55">
        Service: <span className="font-semibold text-midnight-party">{serviceName}</span>
      </p>
      {error ? (
        <div
          role="alert"
          className="mb-3 rounded-xl border border-radiant-rose/25 bg-radiant-rose/5 px-3 py-2.5 font-outfit text-[12.5px] text-radiant-rose"
        >
          {error}
        </div>
      ) : null}
      <form id={formId} onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor={`${formId}-name`} className={labelClass}>
            Package name
          </label>
          <input
            id={`${formId}-name`}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={fieldClass}
            placeholder="e.g. Classic bar setup"
          />
        </div>
        <div>
          <label htmlFor={`${formId}-description`} className={labelClass}>
            Description (optional)
          </label>
          <textarea
            id={`${formId}-description`}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            className={`${fieldClass} resize-y`}
            placeholder="What’s included"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${formId}-price`} className={labelClass}>
              Price (GHS)
            </label>
            <input
              id={`${formId}-price`}
              type="number"
              min={0}
              step={1}
              value={priceGhs}
              onChange={(event) => setPriceGhs(event.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor={`${formId}-unit`} className={labelClass}>
              Pricing unit
            </label>
            <select
              id={`${formId}-unit`}
              value={pricingUnit}
              onChange={(event) => setPricingUnit(event.target.value)}
              className={fieldClass}
            >
              {PARTNER_SERVICE_PRICING_UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full border border-midnight-party/15 px-4 py-2.5 font-outfit text-[13px] font-semibold text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-midnight-party px-4 py-2.5 font-outfit text-[13px] font-semibold text-white transition hover:bg-lilac-luster"
          >
            Save package
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

export function StartingPriceModal({
  service,
  onClose,
  onSave,
}: {
  service: PartnerService;
  onClose: () => void;
  onSave: (priceGhs: number, pricingUnit: string) => string | null;
}) {
  const formId = useId();
  const [priceGhs, setPriceGhs] = useState(String(service.priceGhs));
  const [pricingUnit, setPricingUnit] = useState(service.pricingUnit);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const price = Number(priceGhs);
    if (!Number.isFinite(price) || price < 0) {
      setError("Enter a valid starting price in GHS.");
      return;
    }
    if (!pricingUnit.trim()) {
      setError("Pricing unit is required.");
      return;
    }
    const saveError = onSave(price, pricingUnit.trim());
    if (saveError) {
      setError(saveError);
    }
  }

  return (
    <ModalShell title="Edit starting price" onClose={onClose}>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <p className="font-outfit text-[14px] font-semibold text-midnight-party">
          {service.name}
        </p>
        <ServiceStatusBadge status={service.status} />
      </div>
      <p className="mb-3 font-outfit text-[12.5px] text-midnight-party/55">
        Current:{" "}
        {formatPartnerServicePrice(service.priceGhs, service.pricingUnit)}
      </p>
      {error ? (
        <div
          role="alert"
          className="mb-3 rounded-xl border border-radiant-rose/25 bg-radiant-rose/5 px-3 py-2.5 font-outfit text-[12.5px] text-radiant-rose"
        >
          {error}
        </div>
      ) : null}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${formId}-price`} className={labelClass}>
              Starting price (GHS)
            </label>
            <input
              id={`${formId}-price`}
              type="number"
              min={0}
              step={1}
              value={priceGhs}
              onChange={(event) => setPriceGhs(event.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor={`${formId}-unit`} className={labelClass}>
              Pricing unit
            </label>
            <select
              id={`${formId}-unit`}
              value={pricingUnit}
              onChange={(event) => setPricingUnit(event.target.value)}
              className={fieldClass}
            >
              {PARTNER_SERVICE_PRICING_UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full border border-midnight-party/15 px-4 py-2.5 font-outfit text-[13px] font-semibold text-midnight-party transition hover:border-lilac-luster/40"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-midnight-party px-4 py-2.5 font-outfit text-[13px] font-semibold text-white transition hover:bg-lilac-luster"
          >
            Save starting price
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

export function RemovePackageModal({
  service,
  pkg,
  onClose,
  onConfirm,
}: {
  service: PartnerService;
  pkg: PartnerServicePackage;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const isLast = service.packages.length <= 1;

  return (
    <ModalShell title="Remove package" onClose={onClose}>
      <div className="rounded-xl border border-black/5 bg-[#fbf8fa] p-3.5">
        <p className="font-outfit text-[14px] font-semibold text-midnight-party">
          {pkg.name}
        </p>
        <p className="mt-1 font-outfit text-[12.5px] text-midnight-party/55">
          {service.name} · {partnerServiceStatusLabel(service.status)}
        </p>
        <p className="mt-2 font-outfit text-[13px] font-semibold text-midnight-party">
          {formatPartnerServicePrice(pkg.priceGhs, pkg.pricingUnit)}
        </p>
      </div>
      {isLast ? (
        <p className="mt-4 font-outfit text-[13px] text-radiant-rose">
          Each service needs at least one package. Add another package before
          removing this one.
        </p>
      ) : (
        <p className="mt-4 font-outfit text-[13px] text-midnight-party/65">
          Remove this package from “{service.name}”? This updates the shared My
          Services catalogue in this browser.
        </p>
      )}
      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center justify-center rounded-full border border-midnight-party/15 px-4 py-2.5 font-outfit text-[13px] font-semibold text-midnight-party transition hover:border-lilac-luster/40"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={isLast}
          onClick={onConfirm}
          className="inline-flex items-center justify-center rounded-full bg-radiant-rose px-4 py-2.5 font-outfit text-[13px] font-semibold text-white transition hover:bg-radiant-rose/90 disabled:cursor-not-allowed disabled:opacity-45"
        >
          Remove package
        </button>
      </div>
    </ModalShell>
  );
}
