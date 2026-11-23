"use client";

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Folders,
  MoreHorizontal,
  Pencil,
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
  categoryStatusLabel,
  OPERATIONS_CATEGORIES_PAGE_SIZE,
  OPERATIONS_CATEGORY_STATUSES,
} from "@/lib/data/operations-categories";
import { formatProductUpdatedAt } from "@/lib/data/operations-products";
import {
  filterOperationsCategories,
  paginateOperationsCategories,
} from "@/lib/operations/filter-categories";
import { useOperationsProducts } from "@/lib/operations/products-context";
import type {
  OperationsCatalogueCategory,
  OperationsCategoryInput,
  OperationsCategoryStatus,
} from "@/types/operations-products";
import {
  CategoryDeleteModal,
  CategoryFormModal,
  CategoryStatusModal,
  CategoryViewModal,
} from "./CategoryActionModals";
import { CategoryStatusBadge } from "./CategoryStatusBadge";
import { ProductImageThumb } from "./ProductImageThumb";

const cardClass =
  "rounded-2xl border border-black/5 bg-white shadow-[0_10px_28px_rgba(51,16,56,0.05)]";

type CategoryDialog =
  | { type: "view"; categoryId: string }
  | { type: "edit"; categoryId: string }
  | { type: "create" }
  | { type: "status"; categoryId: string }
  | { type: "delete"; categoryId: string };

function CategoryActionsMenu({
  category,
  onView,
  onEdit,
  onChangeStatus,
  onDelete,
}: {
  category: OperationsCatalogueCategory;
  onView: () => void;
  onEdit: () => void;
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
      <button
        type="button"
        title="View category"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-midnight-party/10 text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
        onClick={onView}
      >
        <Eye size={15} aria-hidden="true" />
        <span className="sr-only">View {category.name}</span>
      </button>

      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-midnight-party/10 text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
        onClick={() => setOpen((prev) => !prev)}
      >
        <MoreHorizontal size={15} aria-hidden="true" />
        <span className="sr-only">More actions for {category.name}</span>
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-full z-20 mt-1 w-48 overflow-hidden rounded-xl border border-black/8 bg-white py-1 shadow-[0_12px_28px_rgba(51,16,56,0.12)]"
        >
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-left font-outfit text-[12.5px] text-midnight-party transition hover:bg-offwhite/60"
            onClick={() => {
              setOpen(false);
              onView();
            }}
          >
            <Eye size={14} aria-hidden="true" />
            View
          </button>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-left font-outfit text-[12.5px] text-midnight-party transition hover:bg-offwhite/60"
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
          >
            <Pencil size={14} aria-hidden="true" />
            Edit
          </button>
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
            {category.status === "active" ? "Deactivate" : "Activate"}
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

export function OperationsCategoriesPanel({
  onNotice,
  createRequestKey = 0,
}: {
  onNotice: (message: string) => void;
  /** Increment from parent to open the create dialog (e.g. header CTA). */
  createRequestKey?: number;
}) {
  const searchId = useId();
  const statusId = useId();
  const {
    categories,
    getCategoryProductCount,
    createCategory,
    updateCategory,
    updateCategoryStatus,
    deleteCategory,
  } = useOperationsProducts();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OperationsCategoryStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState<CategoryDialog | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 350);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (createRequestKey > 0) {
      setDialog({ type: "create" });
    }
  }, [createRequestKey]);

  const filtered = filterOperationsCategories(categories, { search, status });
  const paged = paginateOperationsCategories(
    filtered,
    page,
    OPERATIONS_CATEGORIES_PAGE_SIZE,
  );

  const activeCategory =
    dialog && dialog.type !== "create"
      ? categories.find((category) => category.id === dialog.categoryId) ?? null
      : null;

  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function updateStatusFilter(value: OperationsCategoryStatus | "all") {
    setStatus(value);
    setPage(1);
  }

  function handleCreate(input: OperationsCategoryInput): string | null {
    const created = createCategory(input);
    if (!created) {
      return "Could not create category. The name may already exist.";
    }
    setDialog(null);
    onNotice(`Created category “${created.name}”.`);
    return null;
  }

  function handleEdit(input: OperationsCategoryInput): string | null {
    if (!activeCategory) return "Category not found.";
    const updated = updateCategory(activeCategory.id, input);
    if (!updated) {
      return "Could not save category. The name may already exist.";
    }
    setDialog(null);
    onNotice(`Saved changes to “${updated.name}”.`);
    return null;
  }

  function handleStatus(nextStatus: OperationsCategoryStatus) {
    if (!activeCategory) return;
    const updated = updateCategoryStatus(activeCategory.id, nextStatus);
    setDialog(null);
    if (updated) {
      onNotice(
        `“${updated.name}” is now ${categoryStatusLabel(nextStatus).toLowerCase()}.`,
      );
    }
  }

  function handleDelete() {
    if (!activeCategory) return;
    const result = deleteCategory(activeCategory.id);
    if (!result.ok) {
      if (result.reason === "has_products") {
        onNotice(
          `Cannot delete “${activeCategory.name}” while ${result.productCount} product${result.productCount === 1 ? "" : "s"} remain assigned.`,
        );
      }
      return;
    }

    const nextFiltered = filterOperationsCategories(
      categories.filter((category) => category.id !== activeCategory.id),
      { search, status },
    );
    const nextPaged = paginateOperationsCategories(
      nextFiltered,
      page,
      OPERATIONS_CATEGORIES_PAGE_SIZE,
    );
    if (page > nextPaged.totalPages) {
      setPage(Math.max(1, nextPaged.totalPages));
    }

    setDialog(null);
    onNotice(`Deleted “${result.category.name}” from the catalogue.`);
  }

  const rangeStart =
    paged.totalItems === 0 ? 0 : (paged.page - 1) * paged.pageSize + 1;
  const rangeEnd = Math.min(paged.page * paged.pageSize, paged.totalItems);

  return (
    <>
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
                placeholder="Search by name or description"
                className="w-full rounded-xl border border-midnight-party/10 bg-[#fbf8fa] py-2.5 pl-10 pr-3 font-outfit text-[13px] text-midnight-party outline-none transition placeholder:text-midnight-party/35 focus:border-lilac-luster/40 focus:bg-white"
              />
            </div>
          </div>

          <div className="lg:w-[220px]">
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
                  event.target.value as OperationsCategoryStatus | "all",
                )
              }
              className="w-full rounded-xl border border-midnight-party/10 bg-[#fbf8fa] px-3 py-2.5 font-outfit text-[13px] text-midnight-party outline-none transition focus:border-lilac-luster/40 focus:bg-white"
            >
              <option value="all">All statuses</option>
              {OPERATIONS_CATEGORY_STATUSES.map((entry) => (
                <option key={entry} value={entry}>
                  {categoryStatusLabel(entry)}
                </option>
              ))}
            </select>
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
              Loading categories…
            </p>
          </div>
        ) : paged.totalItems === 0 ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 px-4 py-16 text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-offwhite text-midnight-party">
              <Folders size={22} aria-hidden="true" />
            </span>
            <div>
              <p className="font-oswald text-lg font-semibold uppercase tracking-wide text-midnight-party">
                No categories found
              </p>
              <p className="mt-1 max-w-sm font-outfit text-[13px] text-midnight-party/55">
                Try a different search term or clear the status filter.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                updateSearch("");
                updateStatusFilter("all");
              }}
              className="mt-1 rounded-full border border-midnight-party/15 px-4 py-2 font-outfit text-[12.5px] font-semibold text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-[920px] w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-black/5 bg-[#fbf8fa]">
                    {[
                      "Category",
                      "Description",
                      "Products",
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
                  {paged.items.map((category) => {
                    const productCount = getCategoryProductCount(category.name);
                    return (
                      <tr
                        key={category.id}
                        className="border-b border-black/5 last:border-b-0"
                      >
                        <td className="px-4 py-3 sm:px-5">
                          <button
                            type="button"
                            onClick={() =>
                              setDialog({
                                type: "view",
                                categoryId: category.id,
                              })
                            }
                            className="flex min-w-0 items-center gap-3 text-left transition hover:opacity-80"
                          >
                            <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-offwhite">
                              <ProductImageThumb
                                src={category.image}
                                size={44}
                              />
                            </span>
                            <span className="min-w-0 font-outfit text-[13px] font-semibold text-midnight-party">
                              {category.name}
                            </span>
                          </button>
                        </td>
                        <td className="max-w-[280px] px-4 py-3 sm:px-5">
                          <p className="line-clamp-2 font-outfit text-[13px] text-midnight-party/65">
                            {category.description}
                          </p>
                        </td>
                        <td className="px-4 py-3 font-outfit text-[13px] text-midnight-party/70 sm:px-5">
                          {productCount}
                        </td>
                        <td className="px-4 py-3 sm:px-5">
                          <CategoryStatusBadge status={category.status} />
                        </td>
                        <td className="px-4 py-3 font-outfit text-[12.5px] text-midnight-party/55 sm:px-5">
                          {formatProductUpdatedAt(category.updatedAt)}
                        </td>
                        <td className="px-4 py-3 sm:px-5">
                          <CategoryActionsMenu
                            category={category}
                            onView={() =>
                              setDialog({
                                type: "view",
                                categoryId: category.id,
                              })
                            }
                            onEdit={() =>
                              setDialog({
                                type: "edit",
                                categoryId: category.id,
                              })
                            }
                            onChangeStatus={() =>
                              setDialog({
                                type: "status",
                                categoryId: category.id,
                              })
                            }
                            onDelete={() =>
                              setDialog({
                                type: "delete",
                                categoryId: category.id,
                              })
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

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
                categories
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

      {dialog?.type === "view" && activeCategory ? (
        <CategoryViewModal
          category={activeCategory}
          productCount={getCategoryProductCount(activeCategory.name)}
          onClose={() => setDialog(null)}
          onEdit={() =>
            setDialog({ type: "edit", categoryId: activeCategory.id })
          }
        />
      ) : null}

      {dialog?.type === "create" ? (
        <CategoryFormModal
          mode="create"
          existingNames={categories.map((category) => category.name)}
          onClose={() => setDialog(null)}
          onSave={handleCreate}
        />
      ) : null}

      {dialog?.type === "edit" && activeCategory ? (
        <CategoryFormModal
          key={activeCategory.id}
          mode="edit"
          category={activeCategory}
          existingNames={categories.map((category) => category.name)}
          onClose={() => setDialog(null)}
          onSave={handleEdit}
        />
      ) : null}

      {dialog?.type === "status" && activeCategory ? (
        <CategoryStatusModal
          key={activeCategory.id}
          category={activeCategory}
          onClose={() => setDialog(null)}
          onChangeStatus={handleStatus}
        />
      ) : null}

      {dialog?.type === "delete" && activeCategory ? (
        <CategoryDeleteModal
          category={activeCategory}
          productCount={getCategoryProductCount(activeCategory.name)}
          onClose={() => setDialog(null)}
          onConfirm={handleDelete}
        />
      ) : null}
    </>
  );
}
