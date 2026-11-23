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
  OPERATIONS_PRODUCT_STATUSES,
  OPERATIONS_PRODUCT_UOM_LABELS,
  productStatusLabel,
} from "@/lib/data/operations-products";
import {
  OPERATIONS_PRODUCT_UOMS,
  type OperationsProductStatus,
  type OperationsProductUom,
  type OperationsProductVariant,
} from "@/types/operations-products";

const fieldClass =
  "w-full rounded-xl border border-midnight-party/10 bg-[#fbf8fa] px-3 py-2.5 font-outfit text-[13px] text-midnight-party outline-none transition focus:border-lilac-luster/40 focus:bg-white";

const labelClass =
  "mb-1.5 block font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45";

export type ProductVariantFormValues = {
  label: string;
  sku: string;
  packSize: number;
  uom: OperationsProductUom;
  priceGhs: number;
  status: OperationsProductStatus;
};

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
    <div className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-4">
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
        className="relative z-[91] flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl border border-black/5 bg-white shadow-[0_24px_60px_rgba(51,16,56,0.22)] sm:max-w-lg sm:rounded-2xl"
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

export function validateProductVariantForm(
  values: {
    label: string;
    sku: string;
    packSize: number;
    uom: OperationsProductUom | "";
    priceGhs: number;
    status: OperationsProductStatus;
  },
  existingSkus: string[],
  options?: { ignoreSku?: string },
): string | null {
  const label = values.label.trim();
  const sku = values.sku.trim();

  if (!label) return "Variant name is required.";
  if (!sku) return "SKU is required.";
  if (!Number.isFinite(values.packSize) || values.packSize < 1) {
    return "Pack size must be at least 1.";
  }
  if (!values.uom) return "Unit of measure is required.";
  if (!Number.isFinite(values.priceGhs) || values.priceGhs < 0) {
    return "Enter a valid customer price.";
  }

  const duplicate = existingSkus.some(
    (entry) =>
      entry.toLowerCase() === sku.toLowerCase() &&
      entry.toLowerCase() !== (options?.ignoreSku ?? "").toLowerCase(),
  );
  if (duplicate) {
    return "A variant with this SKU already exists on this product.";
  }

  return null;
}

export function ProductVariantFormModal({
  mode = "create",
  initial,
  existingVariants,
  suggestedSkuPrefix,
  onClose,
  onSave,
}: {
  mode?: "create" | "edit";
  initial?: Partial<ProductVariantFormValues>;
  existingVariants: OperationsProductVariant[];
  suggestedSkuPrefix?: string;
  onClose: () => void;
  onSave: (values: ProductVariantFormValues) => void;
}) {
  const formId = useId();
  const [label, setLabel] = useState(initial?.label ?? "");
  const [sku, setSku] = useState(initial?.sku ?? "");
  const [packSize, setPackSize] = useState(
    initial?.packSize != null ? String(initial.packSize) : "1",
  );
  const [uom, setUom] = useState<OperationsProductUom>(
    initial?.uom ?? "unit",
  );
  const [priceGhs, setPriceGhs] = useState(
    initial?.priceGhs != null ? String(initial.priceGhs) : "",
  );
  const [status, setStatus] = useState<OperationsProductStatus>(
    initial?.status ?? "draft",
  );
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const parsedPackSize = Number(packSize);
    const parsedPrice = Number(priceGhs);
    const values = {
      label,
      sku,
      packSize: parsedPackSize,
      uom,
      priceGhs: parsedPrice,
      status,
    };

    const validationError = validateProductVariantForm(
      values,
      existingVariants.map((variant) => variant.sku),
      mode === "edit" ? { ignoreSku: initial?.sku } : undefined,
    );
    if (validationError) {
      setError(validationError);
      return;
    }

    onSave({
      label: values.label.trim(),
      sku: values.sku.trim(),
      packSize: parsedPackSize,
      uom,
      priceGhs: parsedPrice,
      status,
    });
  }

  return (
    <ModalShell
      title={mode === "create" ? "Add variant" : "Edit variant"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor={`${formId}-name`} className={labelClass}>
            Variant name
          </label>
          <input
            id={`${formId}-name`}
            value={label}
            onChange={(event) => {
              setLabel(event.target.value);
              setError(null);
            }}
            placeholder="e.g. Twin pack"
            className={fieldClass}
            autoFocus
          />
        </div>

        <div>
          <label htmlFor={`${formId}-sku`} className={labelClass}>
            SKU
          </label>
          <input
            id={`${formId}-sku`}
            value={sku}
            onChange={(event) => {
              setSku(event.target.value);
              setError(null);
            }}
            placeholder={
              suggestedSkuPrefix
                ? `e.g. ${suggestedSkuPrefix}-02`
                : "e.g. PW-ITEM-02"
            }
            className={fieldClass}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor={`${formId}-pack`} className={labelClass}>
              Pack size
            </label>
            <input
              id={`${formId}-pack`}
              type="number"
              min={1}
              step={1}
              value={packSize}
              onChange={(event) => {
                setPackSize(event.target.value);
                setError(null);
              }}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor={`${formId}-uom`} className={labelClass}>
              UOM
            </label>
            <select
              id={`${formId}-uom`}
              value={uom}
              onChange={(event) => {
                setUom(event.target.value as OperationsProductUom);
                setError(null);
              }}
              className={fieldClass}
            >
              {OPERATIONS_PRODUCT_UOMS.map((entry) => (
                <option key={entry} value={entry}>
                  {OPERATIONS_PRODUCT_UOM_LABELS[entry]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor={`${formId}-price`} className={labelClass}>
              Customer price (GHS)
            </label>
            <input
              id={`${formId}-price`}
              type="number"
              min={0}
              step="0.01"
              value={priceGhs}
              onChange={(event) => {
                setPriceGhs(event.target.value);
                setError(null);
              }}
              placeholder="0.00"
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor={`${formId}-status`} className={labelClass}>
              Status
            </label>
            <select
              id={`${formId}-status`}
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as OperationsProductStatus);
                setError(null);
              }}
              className={fieldClass}
            >
              {OPERATIONS_PRODUCT_STATUSES.map((entry) => (
                <option key={entry} value={entry}>
                  {productStatusLabel(entry)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error ? (
          <p
            role="alert"
            className="rounded-xl border border-radiant-rose/25 bg-radiant-rose/8 px-3 py-2 font-outfit text-[12.5px] text-radiant-rose"
          >
            {error}
          </p>
        ) : null}

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
            className="rounded-full bg-midnight-party px-4 py-2.5 font-outfit text-[13px] font-semibold text-white transition hover:bg-lilac-luster"
          >
            {mode === "create" ? "Add variant" : "Save variant"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
