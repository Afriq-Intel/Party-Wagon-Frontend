"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  PackageSearch,
  Pencil,
  Plus,
  Power,
  Search,
  Trash2,
} from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import {
  formatOperationsPrice,
  formatProductUpdatedAt,
  OPERATIONS_PRODUCT_STATUSES,
  OPERATIONS_PRODUCTS_PAGE_SIZE,
  productStatusLabel,
} from "@/lib/data/operations-products";
import {
  filterOperationsProducts,
  paginateOperationsProducts,
} from "@/lib/operations/filter-products";
import { useOperationsProducts } from "@/lib/operations/products-context";
import type {
  OperationsProduct,
  OperationsProductStatus,
} from "@/types/operations-products";
import { OperationsCategoriesPanel } from "./OperationsCategoriesPanel";
import {
  ProductChangeStatusModal,
  ProductDeleteModal,
} from "./ProductActionModals";
import { ProductImageThumb } from "./ProductImageThumb";
import { ProductStatusBadge } from "./ProductStatusBadge";

const cardClass =
  "rounded-2xl border border-black/5 bg-white shadow-[0_10px_28px_rgba(51,16,56,0.05)]";

type CatalogueTab = "products" | "categories";

type ProductDialog =
  | { type: "status"; productId: string }
  | { type: "delete"; productId: string };

function ProductActionsMenu({
  product,
  onChangeStatus,
  onDelete,
}: {
  product: OperationsProduct;
  onChangeStatus: () => void;
  onDelete: () => void;
}) {
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  return (
    <div className="relative flex items-center justify-end gap-1" ref={rootRef}>
      <Link
        href={`/operations/products/${product.id}`}
        title="View product"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-midnight-party/10 text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
      >
        <Eye size={15} aria-hidden="true" />
        <span className="sr-only">View {product.name}</span>
      </Link>

      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-midnight-party/10 text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
        onClick={() => setOpen((prev) => !prev)}
      >
        <MoreHorizontal size={15} aria-hidden="true" />
        <span className="sr-only">More actions for {product.name}</span>
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-full z-20 mt-1 w-48 overflow-hidden rounded-xl border border-black/8 bg-white py-1 shadow-[0_12px_28px_rgba(51,16,56,0.12)]"
        >
          <Link
            href={`/operations/products/${product.id}`}
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-left font-outfit text-[12.5px] text-midnight-party transition hover:bg-offwhite/60"
            onClick={() => setOpen(false)}
          >
            <Eye size={14} aria-hidden="true" />
            View
          </Link>
          <Link
            href={`/operations/products/${product.id}/edit`}
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-left font-outfit text-[12.5px] text-midnight-party transition hover:bg-offwhite/60"
            onClick={() => setOpen(false)}
          >
            <Pencil size={14} aria-hidden="true" />
            Edit
          </Link>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-left font-outfit text-[12.5px] text-midnight-party transition hover:bg-offwhite/60"
            onClick={() => {
              setOpen(false);
              onChangeStatus();
            }}
          >
            <Power size={14} aria-hidden="true" />
            Change Status
          </button>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-left font-outfit text-[12.5px] text-radiant-rose transition hover:bg-radiant-rose/8"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
          >
            <Trash2 size={14} aria-hidden="true" />
            Delete
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function OperationsProductsPage() {
  const router = useRouter();
  const searchId = useId();
  const categoryId = useId();
  const statusId = useId();
  const tabsId = useId();
  const {
    products,
    categories,
    updateProductStatus,
    deleteProduct,
  } = useOperationsProducts();

  const [tab, setTab] = useState<CatalogueTab>("products");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | "all">("all");
  const [status, setStatus] = useState<OperationsProductStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [dialog, setDialog] = useState<ProductDialog | null>(null);
  const [categoryCreateKey, setCategoryCreateKey] = useState(0);

  const categoryOptions = categories
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    if (category !== "all" && !categoryOptions.includes(category)) {
      setCategory("all");
      setPage(1);
    }
  }, [category, categoryOptions]);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 450);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 3200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const filtered = filterOperationsProducts(products, {
    search,
    category,
    status,
  });

  const paged = paginateOperationsProducts(
    filtered,
    page,
    OPERATIONS_PRODUCTS_PAGE_SIZE,
  );

  const activeProduct = dialog
    ? products.find((product) => product.id === dialog.productId) ?? null
    : null;

  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function updateCategory(value: string | "all") {
    setCategory(value);
    setPage(1);
  }

  function updateStatusFilter(value: OperationsProductStatus | "all") {
    setStatus(value);
    setPage(1);
  }

  function closeDialog() {
    setDialog(null);
  }

  function handleChangeStatus(
    productId: string,
    nextStatus: OperationsProductStatus,
  ) {
    const updated = updateProductStatus(productId, nextStatus);
    setDialog(null);
    if (updated) {
      setNotice(
        `“${updated.name}” is now ${productStatusLabel(nextStatus).toLowerCase()}.`,
      );
    }
  }

  function handleDeleteProduct(productId: string) {
    const removed = deleteProduct(productId);
    const nextFiltered = filterOperationsProducts(
      products.filter((product) => product.id !== productId),
      { search, category, status },
    );
    const nextPaged = paginateOperationsProducts(
      nextFiltered,
      page,
      OPERATIONS_PRODUCTS_PAGE_SIZE,
    );
    if (page > nextPaged.totalPages) {
      setPage(Math.max(1, nextPaged.totalPages));
    }

    setDialog(null);
    if (removed) {
      setNotice(`Deleted “${removed.name}” from the catalogue.`);
    }
  }

  const rangeStart =
    paged.totalItems === 0 ? 0 : (paged.page - 1) * paged.pageSize + 1;
  const rangeEnd = Math.min(paged.page * paged.pageSize, paged.totalItems);

  return (
    <main className="mx-auto flex w-full min-w-0 max-w-[1400px] flex-1 flex-col gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="font-oswald text-[1.7rem] font-bold uppercase leading-[1.05] tracking-wide text-midnight-party sm:text-[2rem]">
            Products &amp; Catalogue
          </h1>
          <p className="mt-1.5 max-w-2xl font-outfit text-[13px] leading-relaxed text-midnight-party/60 sm:text-[14px]">
            Browse and manage Party Wagon products, categories, and catalogue
            status across the Operations workspace.
          </p>
        </div>

        {tab === "products" ? (
          <Link
            href="/operations/products/new"
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-midnight-party px-4 py-2.5 font-outfit text-[13px] font-semibold text-white transition hover:bg-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster sm:px-5"
          >
            <Plus size={16} aria-hidden="true" />
            Add Product
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setCategoryCreateKey((prev) => prev + 1)}
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-midnight-party px-4 py-2.5 font-outfit text-[13px] font-semibold text-white transition hover:bg-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster sm:px-5"
          >
            <Plus size={16} aria-hidden="true" />
            Add Category
          </button>
        )}
      </div>

      {notice ? (
        <div
          role="status"
          className="rounded-xl border border-lilac-luster/25 bg-lilac-luster/5 px-4 py-3 font-outfit text-[13px] text-midnight-party"
        >
          {notice}
        </div>
      ) : null}

      <div
        role="tablist"
        aria-label="Catalogue sections"
        className="flex w-full max-w-md gap-1 rounded-2xl border border-black/5 bg-white p-1 shadow-[0_10px_28px_rgba(51,16,56,0.05)]"
      >
        {(
          [
            { id: "products", label: "Products" },
            { id: "categories", label: "Categories" },
          ] as const
        ).map((entry) => {
          const selected = tab === entry.id;
          return (
            <button
              key={entry.id}
              type="button"
              role="tab"
              id={`${tabsId}-${entry.id}`}
              aria-selected={selected}
              aria-controls={`${tabsId}-${entry.id}-panel`}
              onClick={() => setTab(entry.id)}
              className={`flex-1 rounded-xl px-4 py-2.5 font-outfit text-[13px] font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster ${
                selected
                  ? "bg-midnight-party text-white"
                  : "text-midnight-party/65 hover:bg-offwhite hover:text-midnight-party"
              }`}
            >
              {entry.label}
            </button>
          );
        })}
      </div>

      {tab === "categories" ? (
        <div
          role="tabpanel"
          id={`${tabsId}-categories-panel`}
          aria-labelledby={`${tabsId}-categories`}
          className="flex flex-col gap-4"
        >
          <OperationsCategoriesPanel
            onNotice={setNotice}
            createRequestKey={categoryCreateKey}
          />
        </div>
      ) : null}

      {tab === "products" ? (
      <div
        role="tabpanel"
        id={`${tabsId}-products-panel`}
        aria-labelledby={`${tabsId}-products`}
        className="flex flex-col gap-4"
      >
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
                placeholder="Search by name, SKU or category"
                className="w-full rounded-xl border border-midnight-party/10 bg-[#fbf8fa] py-2.5 pl-10 pr-3 font-outfit text-[13px] text-midnight-party outline-none transition placeholder:text-midnight-party/35 focus:border-lilac-luster/40 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-[420px]">
            <div>
              <label
                htmlFor={categoryId}
                className="mb-1.5 block font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45"
              >
                Category
              </label>
              <select
                id={categoryId}
                value={category}
                onChange={(event) => updateCategory(event.target.value)}
                className="w-full rounded-xl border border-midnight-party/10 bg-[#fbf8fa] px-3 py-2.5 font-outfit text-[13px] text-midnight-party outline-none transition focus:border-lilac-luster/40 focus:bg-white"
              >
                <option value="all">All categories</option>
                {categoryOptions.map((entry) => (
                  <option key={entry} value={entry}>
                    {entry}
                  </option>
                ))}
              </select>
            </div>

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
                  updateStatusFilter(
                    event.target.value as OperationsProductStatus | "all",
                  )
                }
                className="w-full rounded-xl border border-midnight-party/10 bg-[#fbf8fa] px-3 py-2.5 font-outfit text-[13px] text-midnight-party outline-none transition focus:border-lilac-luster/40 focus:bg-white"
              >
                <option value="all">All statuses</option>
                {OPERATIONS_PRODUCT_STATUSES.map((entry) => (
                  <option key={entry} value={entry}>
                    {productStatusLabel(entry)}
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
              Loading catalogue…
            </p>
          </div>
        ) : paged.totalItems === 0 ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 px-4 py-16 text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-offwhite text-midnight-party">
              <PackageSearch size={22} aria-hidden="true" />
            </span>
            <div>
              <p className="font-oswald text-lg font-semibold uppercase tracking-wide text-midnight-party">
                No products found
              </p>
              <p className="mt-1 max-w-sm font-outfit text-[13px] text-midnight-party/55">
                Try a different search term or clear the category and status
                filters.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                updateSearch("");
                updateCategory("all");
                updateStatusFilter("all");
              }}
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
                      "Product",
                      "Category",
                      "SKU",
                      "Price",
                      "Variants",
                      "Status",
                      "Last updated",
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
                  {paged.items.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-black/5 last:border-b-0"
                    >
                      <td className="px-4 py-3 sm:px-5">
                        <button
                          type="button"
                          onClick={() =>
                            router.push(`/operations/products/${product.id}`)
                          }
                          className="flex min-w-0 items-center gap-3 text-left transition hover:opacity-80"
                        >
                          <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-offwhite">
                            <ProductImageThumb src={product.image} size={44} />
                          </span>
                          <span className="min-w-0 font-outfit text-[13px] font-semibold text-midnight-party">
                            {product.name}
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-3 font-outfit text-[13px] text-midnight-party/70 sm:px-5">
                        {product.category}
                      </td>
                      <td className="px-4 py-3 font-outfit text-[12.5px] text-midnight-party/60 sm:px-5">
                        {product.sku}
                      </td>
                      <td className="px-4 py-3 font-outfit text-[13px] font-medium text-midnight-party sm:px-5">
                        {formatOperationsPrice(product.priceGhs)}
                      </td>
                      <td className="px-4 py-3 font-outfit text-[13px] text-midnight-party/70 sm:px-5">
                        {product.variantsCount}
                      </td>
                      <td className="px-4 py-3 sm:px-5">
                        <ProductStatusBadge status={product.status} />
                      </td>
                      <td className="px-4 py-3 font-outfit text-[12.5px] text-midnight-party/55 sm:px-5">
                        {formatProductUpdatedAt(product.updatedAt)}
                      </td>
                      <td className="px-4 py-3 sm:px-5">
                        <ProductActionsMenu
                          product={product}
                          onChangeStatus={() =>
                            setDialog({
                              type: "status",
                              productId: product.id,
                            })
                          }
                          onDelete={() =>
                            setDialog({
                              type: "delete",
                              productId: product.id,
                            })
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-black/5 lg:hidden">
              {paged.items.map((product) => (
                <li key={product.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        router.push(`/operations/products/${product.id}`)
                      }
                      className="flex min-w-0 flex-1 items-start gap-3 text-left"
                    >
                      <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-offwhite">
                        <ProductImageThumb src={product.image} size={56} />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-outfit text-[14px] font-semibold text-midnight-party">
                          {product.name}
                        </span>
                        <span className="mt-0.5 block font-outfit text-[12px] text-midnight-party/50">
                          {product.category} · {product.sku}
                        </span>
                        <span className="mt-2 block font-outfit text-[13px] font-semibold text-midnight-party">
                          {formatOperationsPrice(product.priceGhs)}
                          <span className="ml-2 font-normal text-midnight-party/50">
                            {product.variantsCount} variants
                          </span>
                        </span>
                        <span className="mt-2 inline-flex">
                          <ProductStatusBadge status={product.status} />
                        </span>
                      </span>
                    </button>
                    <ProductActionsMenu
                      product={product}
                      onChangeStatus={() =>
                        setDialog({
                          type: "status",
                          productId: product.id,
                        })
                      }
                      onDelete={() =>
                        setDialog({
                          type: "delete",
                          productId: product.id,
                        })
                      }
                    />
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 border-t border-black/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="font-outfit text-[12.5px] text-midnight-party/55">
                Showing{" "}
                <span className="font-semibold text-midnight-party">
                  {rangeStart}–{rangeEnd}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-midnight-party">
                  {paged.totalItems}
                </span>{" "}
                products
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
                <span className="min-w-16 text-center font-outfit text-[12px] text-midnight-party/55">
                  Page {paged.page} / {paged.totalPages}
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
      </div>
      ) : null}

      <footer className="mt-auto flex flex-col gap-1 border-t border-black/5 pt-4 font-outfit text-[11px] text-midnight-party/40 sm:flex-row sm:items-center sm:justify-between">
        <p>Party Wagon · Operations workspace</p>
        <p>Products &amp; Catalogue</p>
      </footer>

      {dialog?.type === "status" && activeProduct ? (
        <ProductChangeStatusModal
          key={activeProduct.id}
          product={activeProduct}
          onClose={closeDialog}
          onChangeStatus={(nextStatus) =>
            handleChangeStatus(activeProduct.id, nextStatus)
          }
        />
      ) : null}

      {dialog?.type === "delete" && activeProduct ? (
        <ProductDeleteModal
          product={activeProduct}
          onClose={closeDialog}
          onConfirm={() => handleDeleteProduct(activeProduct.id)}
        />
      ) : null}
    </main>
  );
}
