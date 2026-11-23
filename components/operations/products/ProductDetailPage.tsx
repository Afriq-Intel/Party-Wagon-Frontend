"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import {
  useEffect,
  useId,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  ageRestrictionLabel,
  formatOperationsPrice,
  formatProductUpdatedAt,
  OPERATIONS_PRODUCT_STATUSES,
  OPERATIONS_PRODUCT_UOM_LABELS,
  productStatusHint,
  productStatusLabel,
} from "@/lib/data/operations-products";
import { useOperationsProducts } from "@/lib/operations/products-context";
import {
  OPERATIONS_AGE_RESTRICTIONS,
  OPERATIONS_PRODUCT_UOMS,
  type OperationsAgeRestriction,
  type OperationsProduct,
  type OperationsProductCategory,
  type OperationsProductEditInput,
  type OperationsProductImage,
  type OperationsProductStatus,
  type OperationsProductUom,
  type OperationsProductVariant,
} from "@/types/operations-products";
import { ProductImagesManager } from "./ProductImagesManager";
import { ProductStatusBadge } from "./ProductStatusBadge";
import {
  ProductVariantFormModal,
  type ProductVariantFormValues,
} from "./ProductVariantFormModal";

const cardClass =
  "rounded-2xl border border-black/5 bg-white shadow-[0_10px_28px_rgba(51,16,56,0.05)]";

const fieldClass =
  "w-full rounded-xl border border-midnight-party/10 bg-[#fbf8fa] px-3 py-2.5 font-outfit text-[13px] text-midnight-party outline-none transition focus:border-lilac-luster/40 focus:bg-white disabled:cursor-default disabled:opacity-90";

const labelClass =
  "mb-1.5 block font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45";

type ProductDetailMode = "view" | "edit" | "create";

type DraftState = {
  name: string;
  brand: string;
  sku: string;
  category: OperationsProductCategory;
  description: string;
  ageRestriction: OperationsAgeRestriction;
  tagsInput: string;
  priceGhs: string;
  status: OperationsProductStatus;
  images: OperationsProductImage[];
  variants: OperationsProductVariant[];
};

function productToDraft(product: OperationsProduct): DraftState {
  return {
    name: product.name,
    brand: product.brand,
    sku: product.sku,
    category: product.category,
    description: product.description,
    ageRestriction: product.ageRestriction,
    tagsInput: product.tags.join(", "),
    priceGhs: String(product.priceGhs),
    status: product.status,
    images: product.images.map((image) => ({ ...image })),
    variants: product.variants.map((variant) => ({
      ...variant,
      uom: variant.uom ?? "unit",
    })),
  };
}

function createEmptyDraft(defaultCategory: string): DraftState {
  return {
    name: "",
    brand: "",
    sku: "",
    category: defaultCategory,
    description: "",
    ageRestriction: "none",
    tagsInput: "",
    priceGhs: "0",
    status: "draft",
    images: [],
    variants: [],
  };
}

function parseTags(value: string): string[] {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function draftsEqual(a: DraftState, b: DraftState): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function SectionCard({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className={`${cardClass} p-4 sm:p-5`}>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-oswald text-[1.05rem] font-bold uppercase tracking-wide text-midnight-party">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 font-outfit text-[12.5px] text-midnight-party/55">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

function ReadOnlyField({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-black/5 bg-[#fbf8fa] px-3.5 py-3">
      <p className={labelClass}>{label}</p>
      <div className="font-outfit text-[13.5px] font-medium text-midnight-party">
        {value}
      </div>
    </div>
  );
}

export function ProductDetailPage({
  productId,
  mode,
}: {
  productId?: string;
  mode: ProductDetailMode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formId = useId();
  const { getProduct, createProduct, updateProduct, categories } =
    useOperationsProducts();
  const product = productId ? getProduct(productId) : undefined;
  const categoryOptions = Array.from(
    new Set([
      ...categories.map((entry) => entry.name),
      ...(product ? [product.category] : []),
    ]),
  ).sort((a, b) => a.localeCompare(b));

  const [draft, setDraft] = useState<DraftState | null>(null);
  const [baseline, setBaseline] = useState<DraftState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  const [addVariantOpen, setAddVariantOpen] = useState(false);

  const isCreate = mode === "create";
  const isEdit = mode === "edit";
  const isEditable = isCreate || isEdit;

  useEffect(() => {
    if (!isCreate) return;
    const next = createEmptyDraft(categories[0]?.name ?? "Champagne");
    setDraft(next);
    setBaseline(next);
    setError(null);
    setEditingVariantId(null);
    // Initialise once when entering create mode.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- avoid resetting the draft on every categories reference change
  }, [isCreate]);

  useEffect(() => {
    if (isCreate || !product) return;
    const next = productToDraft(product);
    setDraft(next);
    setBaseline(next);
    setError(null);
    setEditingVariantId(null);
  }, [isCreate, product]);

  useEffect(() => {
    if (mode !== "view" || !productId) return;
    if (searchParams.get("saved") !== "1" || !product) return;
    const created = searchParams.get("created") === "1";
    setSuccess(
      created
        ? `Created “${product.name}” in the catalogue.`
        : `Saved changes to “${product.name}”.`,
    );
    router.replace(`/operations/products/${productId}`, { scroll: false });
  }, [mode, product, productId, router, searchParams]);

  const isDirty = useMemo(() => {
    if (!draft || !baseline) return false;
    return !draftsEqual(draft, baseline);
  }, [draft, baseline]);

  useEffect(() => {
    if (!isEditable || !isDirty) return;

    function onBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isEditable, isDirty]);

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(() => setSuccess(null), 3200);
    return () => window.clearTimeout(timer);
  }, [success]);

  function confirmDiscard(): boolean {
    if (!isDirty) return true;
    return window.confirm(
      "You have unsaved changes. Leave this page and discard them?",
    );
  }

  function navigateBack() {
    if (isEditable && !confirmDiscard()) return;
    router.push("/operations/products");
  }

  function navigateToEdit() {
    if (!productId) return;
    router.push(`/operations/products/${productId}/edit`);
  }

  function updateDraft<K extends keyof DraftState>(
    key: K,
    value: DraftState[K],
  ) {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
    setError(null);
  }

  function updateVariant(
    variantId: string,
    patch: Partial<OperationsProductVariant>,
  ) {
    setDraft((current) => {
      if (!current) return current;
      return {
        ...current,
        variants: current.variants.map((variant) =>
          variant.id === variantId ? { ...variant, ...patch } : variant,
        ),
      };
    });
    setError(null);
  }

  function handleAddVariantSave(values: ProductVariantFormValues) {
    if (!draft) return;

    const variant: OperationsProductVariant = {
      id: `${productId ?? "temp"}-var-${Date.now()}`,
      label: values.label,
      sku: values.sku,
      packSize: values.packSize,
      uom: values.uom,
      priceGhs: values.priceGhs,
      status: values.status,
    };

    updateDraft("variants", [...draft.variants, variant]);
    setAddVariantOpen(false);
    setError(null);
  }

  function removeVariant(variantId: string) {
    if (!draft) return;
    if (draft.variants.length <= 1) {
      setError("At least one variant is required.");
      return;
    }
    updateDraft(
      "variants",
      draft.variants.filter((variant) => variant.id !== variantId),
    );
  }

  function buildInput(current: DraftState): OperationsProductEditInput | null {
    const name = current.name.trim();
    const brand = current.brand.trim();
    const sku = current.sku.trim();
    const description = current.description.trim();
    const priceGhs = Number(current.priceGhs);
    const tags = parseTags(current.tagsInput);

    if (!name || !brand || !sku) {
      setError("Name, brand and SKU are required.");
      return null;
    }
    if (!current.category.trim()) {
      setError("Category is required.");
      return null;
    }
    if (!description) {
      setError("Description is required.");
      return null;
    }
    if (!Number.isFinite(priceGhs) || priceGhs < 0) {
      setError("Enter a valid customer base price in GHS.");
      return null;
    }
    if (current.images.length === 0) {
      setError("Add at least one product image.");
      return null;
    }
    if (current.variants.length === 0) {
      setError("Add at least one variant.");
      return null;
    }
    const seenSkus = new Set<string>();
    for (const variant of current.variants) {
      if (!variant.label.trim() || !variant.sku.trim()) {
        setError("Each variant needs a name/size and SKU.");
        return null;
      }
      const skuKey = variant.sku.trim().toLowerCase();
      if (seenSkus.has(skuKey)) {
        setError("Variant SKUs must be unique on this product.");
        return null;
      }
      seenSkus.add(skuKey);
      if (!Number.isFinite(variant.packSize) || variant.packSize < 1) {
        setError("Variant pack size must be at least 1.");
        return null;
      }
      if (!variant.uom) {
        setError("Each variant needs a unit of measure.");
        return null;
      }
      if (!Number.isFinite(variant.priceGhs) || variant.priceGhs < 0) {
        setError("Each variant needs a valid customer price.");
        return null;
      }
    }

    return {
      name,
      brand,
      sku,
      category: current.category,
      description,
      ageRestriction: current.ageRestriction,
      tags,
      priceGhs,
      status: current.status,
      images: current.images,
      variants: current.variants.map((variant) => ({
        ...variant,
        label: variant.label.trim(),
        sku: variant.sku.trim(),
      })),
    };
  }

  function handleSave(event: FormEvent) {
    event.preventDefault();
    if (!draft) return;

    const input = buildInput(draft);
    if (!input) return;

    if (isCreate) {
      const created = createProduct(input);
      if (!created) {
        setError("Could not create product. SKU may already exist.");
        return;
      }
      setError(null);
      router.replace(
        `/operations/products/${created.id}?saved=1&created=1`,
      );
      return;
    }

    if (!productId) {
      setError("Could not save this product.");
      return;
    }

    const updated = updateProduct(productId, input);
    if (!updated) {
      setError("Could not save this product. SKU may already exist.");
      return;
    }

    const next = productToDraft(updated);
    setDraft(next);
    setBaseline(next);
    setError(null);
    router.replace(`/operations/products/${productId}?saved=1`);
  }

  function handleCancel() {
    if (!confirmDiscard()) return;
    if (isCreate) {
      router.push("/operations/products");
      return;
    }
    if (baseline) {
      setDraft(baseline);
      setError(null);
    }
    if (productId) {
      router.push(`/operations/products/${productId}`);
    }
  }

  if (!isCreate && (!product || !draft)) {
    return (
      <main className="mx-auto flex w-full min-w-0 max-w-[1400px] flex-1 flex-col gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
        <div className={`${cardClass} flex flex-col items-start gap-3 p-6`}>
          <h1 className="font-oswald text-[1.5rem] font-bold uppercase tracking-wide text-midnight-party">
            Product not found
          </h1>
          <p className="font-outfit text-[13px] text-midnight-party/60">
            This product is not in the mock catalogue, or it was deleted.
          </p>
          <Link
            href="/operations/products"
            className="inline-flex items-center gap-2 rounded-full bg-midnight-party px-4 py-2.5 font-outfit text-[13px] font-semibold text-white transition hover:bg-lilac-luster"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Back to Catalogue
          </Link>
        </div>
      </main>
    );
  }

  if (!draft) {
    return (
      <main className="mx-auto flex w-full min-w-0 max-w-[1400px] flex-1 flex-col gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
        <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-black/5 bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-midnight-party/15 border-t-midnight-party" />
        </div>
      </main>
    );
  }

  const displayStatus = isEditable ? draft.status : product!.status;
  const displayName = isCreate
    ? draft.name.trim() || "New product"
    : isEdit
      ? draft.name || product!.name
      : product!.name;

  return (
    <main className="mx-auto flex w-full min-w-0 max-w-[1400px] flex-1 flex-col gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1.5 font-outfit text-[12px] text-midnight-party/50"
      >
        <Link
          href="/operations/products"
          onClick={(event) => {
            if (isEditable && isDirty && !confirmDiscard()) {
              event.preventDefault();
            }
          }}
          className="transition hover:text-lilac-luster"
        >
          Products &amp; Catalogue
        </Link>
        <ChevronRight size={12} aria-hidden="true" />
        {isCreate ? (
          <span className="text-midnight-party/70">Add product</span>
        ) : isEdit && product ? (
          <>
            <Link
              href={`/operations/products/${productId}`}
              onClick={(event) => {
                if (isDirty && !confirmDiscard()) event.preventDefault();
              }}
              className="transition hover:text-lilac-luster"
            >
              {product.name}
            </Link>
            <ChevronRight size={12} aria-hidden="true" />
            <span className="text-midnight-party/70">Edit</span>
          </>
        ) : (
          <span className="text-midnight-party/70">{product?.name}</span>
        )}
      </nav>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <ProductStatusBadge status={displayStatus} />
            {!isCreate && product ? (
              <span className="font-outfit text-[12px] text-midnight-party/45">
                Updated {formatProductUpdatedAt(product.updatedAt)}
              </span>
            ) : null}
            {isEditable && isDirty ? (
              <span className="rounded-full bg-lemon-twist/30 px-2.5 py-1 font-outfit text-[11px] font-semibold text-midnight-party">
                Unsaved changes
              </span>
            ) : null}
          </div>
          <h1 className="mt-2 font-oswald text-[1.7rem] font-bold uppercase leading-[1.05] tracking-wide text-midnight-party sm:text-[2rem]">
            {displayName}
          </h1>
          <p className="mt-1.5 font-outfit text-[13px] text-midnight-party/55">
            {isCreate
              ? "Create a catalogue product with details, imagery, variants and publishing status."
              : isEdit
                ? "Update product details, imagery, variants and publishing status."
                : "Review product details, imagery, variants and catalogue status."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={navigateBack}
            className="inline-flex items-center gap-2 rounded-full border border-midnight-party/15 px-4 py-2.5 font-outfit text-[13px] font-semibold text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Back to Catalogue
          </button>
          {!isEditable ? (
            <button
              type="button"
              onClick={navigateToEdit}
              className="inline-flex items-center gap-2 rounded-full bg-midnight-party px-4 py-2.5 font-outfit text-[13px] font-semibold text-white transition hover:bg-lilac-luster"
            >
              <Pencil size={15} aria-hidden="true" />
              Edit Product
            </button>
          ) : null}
        </div>
      </div>

      {success ? (
        <div
          role="status"
          className="rounded-xl border border-blue-lagoon/25 bg-blue-lagoon/10 px-4 py-3 font-outfit text-[13px] text-midnight-party"
        >
          {success}
        </div>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-radiant-rose/25 bg-radiant-rose/8 px-4 py-3 font-outfit text-[13px] text-radiant-rose"
        >
          {error}
        </div>
      ) : null}

      <form id={formId} onSubmit={handleSave} className="flex flex-col gap-4">
        <SectionCard
          title="Product Information"
          description="Core catalogue identity used across Operations and the storefront."
        >
          {isEditable ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor={`${formId}-name`} className={labelClass}>
                  Name
                </label>
                <input
                  id={`${formId}-name`}
                  value={draft.name}
                  onChange={(event) => updateDraft("name", event.target.value)}
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor={`${formId}-brand`} className={labelClass}>
                  Brand
                </label>
                <input
                  id={`${formId}-brand`}
                  value={draft.brand}
                  onChange={(event) => updateDraft("brand", event.target.value)}
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor={`${formId}-category`} className={labelClass}>
                  Category
                </label>
                <select
                  id={`${formId}-category`}
                  value={draft.category}
                  onChange={(event) =>
                    updateDraft(
                      "category",
                      event.target.value as OperationsProductCategory,
                    )
                  }
                  className={fieldClass}
                >
                  {categoryOptions.map((entry) => (
                    <option key={entry} value={entry}>
                      {entry}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label htmlFor={`${formId}-description`} className={labelClass}>
                  Description
                </label>
                <textarea
                  id={`${formId}-description`}
                  rows={4}
                  value={draft.description}
                  onChange={(event) =>
                    updateDraft("description", event.target.value)
                  }
                  className={`${fieldClass} resize-y`}
                />
              </div>
              <div>
                <label htmlFor={`${formId}-age`} className={labelClass}>
                  Age restriction
                </label>
                <select
                  id={`${formId}-age`}
                  value={draft.ageRestriction}
                  onChange={(event) =>
                    updateDraft(
                      "ageRestriction",
                      event.target.value as OperationsAgeRestriction,
                    )
                  }
                  className={fieldClass}
                >
                  {OPERATIONS_AGE_RESTRICTIONS.map((entry) => (
                    <option key={entry} value={entry}>
                      {ageRestrictionLabel(entry)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={`${formId}-sku`} className={labelClass}>
                  SKU
                </label>
                <input
                  id={`${formId}-sku`}
                  value={draft.sku}
                  onChange={(event) => updateDraft("sku", event.target.value)}
                  className={fieldClass}
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor={`${formId}-tags`} className={labelClass}>
                  Tags
                </label>
                <input
                  id={`${formId}-tags`}
                  value={draft.tagsInput}
                  onChange={(event) =>
                    updateDraft("tagsInput", event.target.value)
                  }
                  placeholder="Comma-separated tags"
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor={`${formId}-price`} className={labelClass}>
                  Customer base price (GHS)
                </label>
                <input
                  id={`${formId}-price`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={draft.priceGhs}
                  onChange={(event) =>
                    updateDraft("priceGhs", event.target.value)
                  }
                  className={fieldClass}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <ReadOnlyField label="Name" value={product!.name} />
              <ReadOnlyField label="Brand" value={product!.brand} />
              <ReadOnlyField label="Category" value={product!.category} />
              <ReadOnlyField label="SKU" value={product!.sku} />
              <ReadOnlyField
                label="Age restriction"
                value={ageRestrictionLabel(product!.ageRestriction)}
              />
              <ReadOnlyField
                label="Customer base price"
                value={formatOperationsPrice(product!.priceGhs)}
              />
              <div className="md:col-span-2">
                <ReadOnlyField
                  label="Description"
                  value={
                    <p className="font-normal leading-relaxed text-midnight-party/75">
                      {product!.description}
                    </p>
                  }
                />
              </div>
              <div className="md:col-span-2">
                <ReadOnlyField
                  label="Tags"
                  value={
                    product!.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {product!.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-midnight-party/8 px-2.5 py-1 font-outfit text-[11px] font-semibold text-midnight-party"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      "No tags"
                    )
                  }
                />
              </div>
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Images"
          description="Primary image is used in the catalogue listing and product cards. Reorder to control gallery sequence."
        >
          <ProductImagesManager
            images={isEditable ? draft.images : product!.images}
            editable={isEditable}
            productKey={productId ?? "new-product"}
            onChange={(images) => updateDraft("images", images)}
            onError={setError}
          />
        </SectionCard>

        <SectionCard
          title="Variants"
          description="Size and pack options with SKU, pack size, UOM and customer pricing."
          action={
            isEditable ? (
              <button
                type="button"
                onClick={() => setAddVariantOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-midnight-party/15 px-3 py-1.5 font-outfit text-[12px] font-semibold text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster"
              >
                <Plus size={14} aria-hidden="true" />
                Add variant
              </button>
            ) : null
          }
        >
          {(isEditable ? draft.variants : product!.variants).length === 0 ? (
            <div className="flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-midnight-party/15 bg-[#fbf8fa] px-4 py-8 text-center">
              <p className="font-oswald text-base font-semibold uppercase tracking-wide text-midnight-party">
                No variants yet
              </p>
              <p className="max-w-sm font-outfit text-[13px] text-midnight-party/55">
                {isEditable
                  ? "Use Add variant to create a size or pack option with SKU, UOM and customer price."
                  : "This product has no variants configured."}
              </p>
              {isEditable ? (
                <button
                  type="button"
                  onClick={() => setAddVariantOpen(true)}
                  className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-midnight-party/15 px-3.5 py-2 font-outfit text-[12.5px] font-semibold text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster"
                >
                  <Plus size={14} aria-hidden="true" />
                  Add variant
                </button>
              ) : null}
            </div>
          ) : (
          <div className="overflow-x-auto rounded-xl border border-black/5">
            <table className="min-w-[860px] w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-black/5 bg-[#fbf8fa]">
                  {[
                    "Name / Size",
                    "SKU",
                    "Pack size",
                    "UOM",
                    "Price",
                    "Status",
                    ...(isEditable ? ["Actions"] : []),
                  ].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="px-3 py-2.5 font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45 sm:px-4"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(isEditable ? draft.variants : product!.variants).map((variant) => {
                  const editing = isEditable && editingVariantId === variant.id;
                  return (
                    <tr
                      key={variant.id}
                      className="border-b border-black/5 last:border-b-0"
                    >
                      <td className="px-3 py-2.5 sm:px-4">
                        {editing ? (
                          <input
                            value={variant.label}
                            onChange={(event) =>
                              updateVariant(variant.id, {
                                label: event.target.value,
                              })
                            }
                            className={fieldClass}
                          />
                        ) : (
                          <span className="font-outfit text-[13px] font-semibold text-midnight-party">
                            {variant.label}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 sm:px-4">
                        {editing ? (
                          <input
                            value={variant.sku}
                            onChange={(event) =>
                              updateVariant(variant.id, {
                                sku: event.target.value,
                              })
                            }
                            className={fieldClass}
                          />
                        ) : (
                          <span className="font-outfit text-[12.5px] text-midnight-party/60">
                            {variant.sku}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 sm:px-4">
                        {editing ? (
                          <input
                            type="number"
                            min={1}
                            value={variant.packSize}
                            onChange={(event) =>
                              updateVariant(variant.id, {
                                packSize: Number(event.target.value) || 1,
                              })
                            }
                            className={`${fieldClass} max-w-24`}
                          />
                        ) : (
                          <span className="font-outfit text-[13px] text-midnight-party/70">
                            {variant.packSize}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 sm:px-4">
                        {editing ? (
                          <select
                            value={variant.uom}
                            onChange={(event) =>
                              updateVariant(variant.id, {
                                uom: event.target.value as OperationsProductUom,
                              })
                            }
                            className={`${fieldClass} min-w-24`}
                          >
                            {OPERATIONS_PRODUCT_UOMS.map((entry) => (
                              <option key={entry} value={entry}>
                                {OPERATIONS_PRODUCT_UOM_LABELS[entry]}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="font-outfit text-[13px] text-midnight-party/70">
                            {OPERATIONS_PRODUCT_UOM_LABELS[variant.uom]}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 sm:px-4">
                        {editing ? (
                          <input
                            type="number"
                            min={0}
                            step="0.01"
                            value={variant.priceGhs}
                            onChange={(event) =>
                              updateVariant(variant.id, {
                                priceGhs: Number(event.target.value) || 0,
                              })
                            }
                            className={`${fieldClass} max-w-28`}
                          />
                        ) : (
                          <span className="font-outfit text-[13px] font-medium text-midnight-party">
                            {formatOperationsPrice(variant.priceGhs)}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 sm:px-4">
                        {editing ? (
                          <select
                            value={variant.status}
                            onChange={(event) =>
                              updateVariant(variant.id, {
                                status: event.target
                                  .value as OperationsProductStatus,
                              })
                            }
                            className={fieldClass}
                          >
                            {OPERATIONS_PRODUCT_STATUSES.map((entry) => (
                              <option key={entry} value={entry}>
                                {productStatusLabel(entry)}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <ProductStatusBadge status={variant.status} />
                        )}
                      </td>
                      {isEditable ? (
                        <td className="px-3 py-2.5 sm:px-4">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                setEditingVariantId(
                                  editing ? null : variant.id,
                                )
                              }
                              className="rounded-lg px-2 py-1.5 font-outfit text-[11px] font-semibold text-midnight-party transition hover:bg-offwhite"
                            >
                              {editing ? "Done" : "Edit"}
                            </button>
                            <button
                              type="button"
                              onClick={() => removeVariant(variant.id)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-radiant-rose transition hover:bg-radiant-rose/8"
                              title="Remove variant"
                            >
                              <Trash2 size={14} aria-hidden="true" />
                              <span className="sr-only">Remove variant</span>
                            </button>
                          </div>
                        </td>
                      ) : null}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          )}
        </SectionCard>

        <SectionCard
          title="Publishing & Status"
          description="Control whether this product is draft, published, or inactive in the catalogue."
        >
          {isEditable ? (
            <div
              className="grid grid-cols-1 gap-2 sm:grid-cols-3"
              role="radiogroup"
              aria-label="Product publishing status"
            >
              {OPERATIONS_PRODUCT_STATUSES.map((status) => {
                const checked = draft.status === status;
                return (
                  <label
                    key={status}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 transition ${
                      checked
                        ? "border-lilac-luster/50 bg-lilac-luster/5"
                        : "border-black/5 bg-[#fbf8fa] hover:border-midnight-party/15"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`${formId}-status`}
                      value={status}
                      checked={checked}
                      onChange={() => updateDraft("status", status)}
                      className="mt-1 accent-lilac-luster"
                    />
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="font-outfit text-[13px] font-semibold text-midnight-party">
                          {productStatusLabel(status)}
                        </span>
                        {checked ? (
                          <Check
                            size={14}
                            className="text-lilac-luster"
                            aria-hidden="true"
                          />
                        ) : null}
                      </span>
                      <span className="mt-0.5 block font-outfit text-[12px] text-midnight-party/55">
                        {productStatusHint(status)}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <ProductStatusBadge status={product!.status} />
                <p className="font-outfit text-[13px] text-midnight-party/65">
                  {productStatusHint(product!.status)}
                </p>
              </div>
              <button
                type="button"
                onClick={navigateToEdit}
                className="self-start rounded-full border border-midnight-party/15 px-3.5 py-2 font-outfit text-[12.5px] font-semibold text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster"
              >
                Change in Edit
              </button>
            </div>
          )}
        </SectionCard>

        {isEditable ? (
          <div className="sticky bottom-3 z-10 flex flex-col-reverse gap-2 rounded-2xl border border-black/5 bg-white/95 p-3 shadow-[0_10px_28px_rgba(51,16,56,0.08)] backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-4">
            <p className="px-1 font-outfit text-[12.5px] text-midnight-party/55">
              {isCreate
                ? "Fill required product details, then create the catalogue entry."
                : isDirty
                  ? "You have unsaved changes on this product."
                  : "No changes yet. Edit a section above to enable save."}
            </p>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-full border border-midnight-party/15 px-4 py-2.5 font-outfit text-[13px] font-semibold text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreate ? false : !isDirty}
                className="rounded-full bg-midnight-party px-4 py-2.5 font-outfit text-[13px] font-semibold text-white transition hover:bg-lilac-luster disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isCreate ? "Create product" : "Save changes"}
              </button>
            </div>
          </div>
        ) : null}
      </form>

      <footer className="mt-auto flex flex-col gap-1 border-t border-black/5 pt-4 font-outfit text-[11px] text-midnight-party/40 sm:flex-row sm:items-center sm:justify-between">
        <p>Party Wagon · Operations workspace</p>
        <p>
          {isCreate
            ? "Add product"
            : isEdit
              ? "Edit product"
              : "View product"}
        </p>
      </footer>

      {addVariantOpen && draft ? (
        <ProductVariantFormModal
          mode="create"
          existingVariants={draft.variants}
          suggestedSkuPrefix={draft.sku.trim() || undefined}
          onClose={() => setAddVariantOpen(false)}
          onSave={handleAddVariantSave}
        />
      ) : null}
    </main>
  );
}
