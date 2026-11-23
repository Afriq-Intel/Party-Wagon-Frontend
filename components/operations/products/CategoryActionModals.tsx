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
  categoryStatusHint,
  categoryStatusLabel,
  MOCK_CATEGORY_IMAGE_POOL,
  OPERATIONS_CATEGORY_STATUSES,
} from "@/lib/data/operations-categories";
import { formatProductUpdatedAt } from "@/lib/data/operations-products";
import type {
  OperationsCatalogueCategory,
  OperationsCategoryInput,
  OperationsCategoryStatus,
} from "@/types/operations-products";
import { CategoryImagePicker } from "./CategoryImagePicker";
import { CategoryStatusBadge } from "./CategoryStatusBadge";
import { ProductImageThumb } from "./ProductImageThumb";

function ModalShell({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
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
        className={`relative z-[81] flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl border border-black/5 bg-white shadow-[0_24px_60px_rgba(51,16,56,0.22)] sm:rounded-2xl ${
          wide ? "sm:max-w-2xl" : "sm:max-w-lg"
        }`}
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

const fieldClass =
  "w-full rounded-xl border border-midnight-party/10 bg-[#fbf8fa] px-3 py-2.5 font-outfit text-[13px] text-midnight-party outline-none transition focus:border-lilac-luster/40 focus:bg-white";

const labelClass =
  "mb-1.5 block font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45";

export function CategoryViewModal({
  category,
  productCount,
  onClose,
  onEdit,
}: {
  category: OperationsCatalogueCategory;
  productCount: number;
  onClose: () => void;
  onEdit: () => void;
}) {
  return (
    <ModalShell title="Category details" onClose={onClose} wide>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <span className="relative mx-auto h-32 w-32 shrink-0 overflow-hidden rounded-2xl bg-offwhite sm:mx-0">
            <ProductImageThumb src={category.image} size={128} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryStatusBadge status={category.status} />
              <span className="font-outfit text-[12px] text-midnight-party/50">
                Updated {formatProductUpdatedAt(category.updatedAt)}
              </span>
            </div>
            <h3 className="mt-2 font-oswald text-[1.35rem] font-bold uppercase leading-tight tracking-wide text-midnight-party">
              {category.name}
            </h3>
            <p className="mt-3 font-outfit text-[13.5px] leading-relaxed text-midnight-party/70">
              {category.description}
            </p>
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-black/5 bg-[#fbf8fa] px-3.5 py-3">
            <dt className={labelClass}>Products</dt>
            <dd className="font-outfit text-[13px] font-medium text-midnight-party">
              {productCount} assigned
            </dd>
          </div>
          <div className="rounded-xl border border-black/5 bg-[#fbf8fa] px-3.5 py-3">
            <dt className={labelClass}>Status</dt>
            <dd className="font-outfit text-[13px] font-medium text-midnight-party">
              {categoryStatusHint(category.status)}
            </dd>
          </div>
        </dl>

        <div className="flex flex-col-reverse gap-2 border-t border-black/5 pt-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-midnight-party/15 px-4 py-2.5 font-outfit text-[13px] font-semibold text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="rounded-full bg-midnight-party px-4 py-2.5 font-outfit text-[13px] font-semibold text-white transition hover:bg-lilac-luster"
          >
            Edit category
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

export function CategoryFormModal({
  mode,
  category,
  existingNames,
  onClose,
  onSave,
}: {
  mode: "create" | "edit";
  category?: OperationsCatalogueCategory;
  existingNames: string[];
  onClose: () => void;
  onSave: (input: OperationsCategoryInput) => string | null;
}) {
  const formId = useId();
  const [name, setName] = useState(category?.name ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [image, setImage] = useState(
    category?.image ?? MOCK_CATEGORY_IMAGE_POOL[0],
  );
  const [status, setStatus] = useState<OperationsCategoryStatus>(
    category?.status ?? "active",
  );
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      setError("Category name is required.");
      return;
    }
    if (!trimmedDescription) {
      setError("Description is required.");
      return;
    }
    if (!image) {
      setError("Select a category image.");
      return;
    }

    const duplicate = existingNames.some(
      (entry) =>
        entry.toLowerCase() === trimmedName.toLowerCase() &&
        entry.toLowerCase() !== (category?.name ?? "").toLowerCase(),
    );
    if (duplicate) {
      setError("A category with this name already exists.");
      return;
    }

    const saveError = onSave({
      name: trimmedName,
      description: trimmedDescription,
      image,
      status,
    });
    if (saveError) {
      setError(saveError);
    }
  }

  return (
    <ModalShell
      title={mode === "create" ? "Create category" : "Edit category"}
      onClose={onClose}
      wide
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor={`${formId}-name`} className={labelClass}>
            Name
          </label>
          <input
            id={`${formId}-name`}
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError(null);
            }}
            className={fieldClass}
            placeholder="e.g. Mocktails"
          />
        </div>

        <div>
          <label htmlFor={`${formId}-description`} className={labelClass}>
            Description
          </label>
          <textarea
            id={`${formId}-description`}
            rows={3}
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
              setError(null);
            }}
            className={`${fieldClass} resize-y`}
          />
        </div>

        <div>
          <p className={labelClass}>Category image</p>
          <CategoryImagePicker
            value={image}
            onChange={setImage}
            onError={setError}
          />
        </div>

        <div>
          <p className={labelClass}>Status</p>
          <div
            className="grid grid-cols-1 gap-2 sm:grid-cols-2"
            role="radiogroup"
            aria-label="Category status"
          >
            {OPERATIONS_CATEGORY_STATUSES.map((entry) => {
              const checked = status === entry;
              return (
                <label
                  key={entry}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 transition ${
                    checked
                      ? "border-lilac-luster/50 bg-lilac-luster/5"
                      : "border-black/5 bg-[#fbf8fa] hover:border-midnight-party/15"
                  }`}
                >
                  <input
                    type="radio"
                    name={`${formId}-status`}
                    value={entry}
                    checked={checked}
                    onChange={() => setStatus(entry)}
                    className="mt-1 accent-lilac-luster"
                  />
                  <span className="min-w-0">
                    <span className="block font-outfit text-[13px] font-semibold text-midnight-party">
                      {categoryStatusLabel(entry)}
                    </span>
                    <span className="mt-0.5 block font-outfit text-[12px] text-midnight-party/55">
                      {categoryStatusHint(entry)}
                    </span>
                  </span>
                </label>
              );
            })}
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
            {mode === "create" ? "Create category" : "Save changes"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

export function CategoryStatusModal({
  category,
  onClose,
  onChangeStatus,
}: {
  category: OperationsCatalogueCategory;
  onClose: () => void;
  onChangeStatus: (status: OperationsCategoryStatus) => void;
}) {
  const [selected, setSelected] = useState<OperationsCategoryStatus>(
    category.status,
  );

  return (
    <ModalShell title="Change status" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <p className="font-outfit text-[13px] text-midnight-party/70">
          Update status for{" "}
          <span className="font-semibold text-midnight-party">
            {category.name}
          </span>
          .
        </p>

        <div className="flex flex-col gap-2" role="radiogroup" aria-label="Category status">
          {OPERATIONS_CATEGORY_STATUSES.map((entry) => {
            const checked = selected === entry;
            return (
              <label
                key={entry}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 transition ${
                  checked
                    ? "border-lilac-luster/50 bg-lilac-luster/5"
                    : "border-black/5 bg-[#fbf8fa] hover:border-midnight-party/15"
                }`}
              >
                <input
                  type="radio"
                  name="category-status"
                  value={entry}
                  checked={checked}
                  onChange={() => setSelected(entry)}
                  className="mt-1 accent-lilac-luster"
                />
                <span className="min-w-0">
                  <span className="block font-outfit text-[13px] font-semibold text-midnight-party">
                    {entry === "active" ? "Activate" : "Deactivate"}
                  </span>
                  <span className="mt-0.5 block font-outfit text-[12.5px] text-midnight-party/55">
                    {categoryStatusHint(entry)}
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
            disabled={selected === category.status}
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

export function CategoryDeleteModal({
  category,
  productCount,
  onClose,
  onConfirm,
}: {
  category: OperationsCatalogueCategory;
  productCount: number;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const blocked = productCount > 0;

  return (
    <ModalShell title="Delete category" onClose={onClose}>
      <div className="flex flex-col gap-4">
        {blocked ? (
          <div
            role="alert"
            className="rounded-xl border border-radiant-rose/25 bg-radiant-rose/8 px-3.5 py-3 font-outfit text-[13px] leading-relaxed text-radiant-rose"
          >
            “{category.name}” still has{" "}
            <span className="font-semibold">{productCount}</span> product
            {productCount === 1 ? "" : "s"} assigned. Reassign or remove those
            products before deleting this category.
          </div>
        ) : (
          <p className="font-outfit text-[13.5px] leading-relaxed text-midnight-party/70">
            Delete{" "}
            <span className="font-semibold text-midnight-party">
              {category.name}
            </span>{" "}
            from the mock catalogue? This cannot be undone in this session.
          </p>
        )}

        <div className="flex items-center gap-3 rounded-xl border border-black/5 bg-[#fbf8fa] p-3">
          <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white">
            <ProductImageThumb src={category.image} size={48} />
          </span>
          <div className="min-w-0">
            <p className="truncate font-outfit text-[13px] font-semibold text-midnight-party">
              {category.name}
            </p>
            <p className="mt-1 flex flex-wrap items-center gap-2">
              <CategoryStatusBadge status={category.status} />
              <span className="font-outfit text-[12px] text-midnight-party/50">
                {productCount} product{productCount === 1 ? "" : "s"}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-black/5 pt-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-midnight-party/15 px-4 py-2.5 font-outfit text-[13px] font-semibold text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster"
          >
            {blocked ? "Close" : "Cancel"}
          </button>
          {!blocked ? (
            <button
              type="button"
              onClick={onConfirm}
              className="rounded-full bg-radiant-rose px-4 py-2.5 font-outfit text-[13px] font-semibold text-white transition hover:bg-midnight-party"
            >
              Delete category
            </button>
          ) : null}
        </div>
      </div>
    </ModalShell>
  );
}
