"use client";

import { X } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  productStatusHint,
  productStatusLabel,
} from "@/lib/data/operations-products";
import type {
  OperationsProduct,
  OperationsProductStatus,
} from "@/types/operations-products";
import { ProductImageThumb } from "./ProductImageThumb";
import { ProductStatusBadge } from "./ProductStatusBadge";

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
  value: OperationsProductStatus;
  title: string;
  description: string;
}[] = [
  {
    value: "published",
    title: "Publish / Activate",
    description: "Make this product visible in the customer catalogue.",
  },
  {
    value: "draft",
    title: "Unpublish",
    description: "Keep the product in draft and hide it from customers.",
  },
  {
    value: "inactive",
    title: "Deactivate",
    description: "Deactivate the product and remove it from active catalogue.",
  },
];

export function ProductChangeStatusModal({
  product,
  onClose,
  onChangeStatus,
}: {
  product: OperationsProduct;
  onClose: () => void;
  onChangeStatus: (status: OperationsProductStatus) => void;
}) {
  const [selected, setSelected] = useState<OperationsProductStatus>(
    product.status,
  );

  return (
    <ModalShell title="Change status" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div>
          <p className="font-outfit text-[13px] text-midnight-party/70">
            Update catalogue status for{" "}
            <span className="font-semibold text-midnight-party">
              {product.name}
            </span>
            .
          </p>
          <p className="mt-2 font-outfit text-[12.5px] text-midnight-party/50">
            Current status:{" "}
            <span className="font-semibold text-midnight-party">
              {productStatusLabel(product.status)}
            </span>
          </p>
        </div>

        <div
          className="flex flex-col gap-2"
          role="radiogroup"
          aria-label="Product status"
        >
          {STATUS_ACTIONS.map((action) => {
            const checked = selected === action.value;
            return (
              <label
                key={action.value}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 transition ${
                  checked
                    ? "border-lilac-luster/50 bg-lilac-luster/5"
                    : "border-black/5 bg-[#fbf8fa] hover:border-midnight-party/15"
                }`}
              >
                <input
                  type="radio"
                  name="product-status"
                  value={action.value}
                  checked={checked}
                  onChange={() => setSelected(action.value)}
                  className="mt-1 accent-lilac-luster"
                />
                <span className="min-w-0">
                  <span className="block font-outfit text-[13px] font-semibold text-midnight-party">
                    {action.title}
                  </span>
                  <span className="mt-0.5 block font-outfit text-[12.5px] text-midnight-party/55">
                    {action.description}
                  </span>
                  <span className="mt-1 block font-outfit text-[11px] text-midnight-party/40">
                    {productStatusHint(action.value)}
                  </span>
                </span>
              </label>
            );
          })}
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
            type="button"
            disabled={selected === product.status}
            onClick={() => onChangeStatus(selected)}
            className="rounded-full bg-midnight-party px-4 py-2.5 font-outfit text-[13px] font-semibold text-white transition hover:bg-lilac-luster disabled:cursor-not-allowed disabled:opacity-40"
          >
            Update status
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

export function ProductDeleteModal({
  product,
  onClose,
  onConfirm,
}: {
  product: OperationsProduct;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <ModalShell title="Delete product" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <p className="font-outfit text-[13.5px] leading-relaxed text-midnight-party/70">
          Delete{" "}
          <span className="font-semibold text-midnight-party">
            {product.name}
          </span>{" "}
          ({product.sku}) from the mock catalogue? This cannot be undone in this
          session.
        </p>

        <div className="flex items-center gap-3 rounded-xl border border-radiant-rose/20 bg-radiant-rose/5 p-3">
          <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white">
            <ProductImageThumb src={product.image} size={48} />
          </span>
          <div className="min-w-0">
            <p className="truncate font-outfit text-[13px] font-semibold text-midnight-party">
              {product.name}
            </p>
            <p className="mt-1">
              <ProductStatusBadge status={product.status} />
            </p>
          </div>
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
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-radiant-rose px-4 py-2.5 font-outfit text-[13px] font-semibold text-white transition hover:bg-midnight-party"
          >
            Delete product
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
