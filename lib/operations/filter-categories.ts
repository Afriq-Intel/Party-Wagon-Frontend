import { OPERATIONS_CATEGORIES_PAGE_SIZE } from "@/lib/data/operations-categories";
import type {
  OperationsCatalogueCategory,
  OperationsCategoryFilters,
} from "@/types/operations-products";

export function filterOperationsCategories(
  categories: OperationsCatalogueCategory[],
  filters: OperationsCategoryFilters,
): OperationsCatalogueCategory[] {
  const query = filters.search.trim().toLowerCase();

  return categories.filter((category) => {
    if (filters.status !== "all" && category.status !== filters.status) {
      return false;
    }
    if (!query) return true;

    return (
      category.name.toLowerCase().includes(query) ||
      category.description.toLowerCase().includes(query)
    );
  });
}

export function paginateOperationsCategories(
  categories: OperationsCatalogueCategory[],
  page: number,
  pageSize: number = OPERATIONS_CATEGORIES_PAGE_SIZE,
): {
  items: OperationsCatalogueCategory[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
} {
  const totalItems = categories.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: categories.slice(start, start + pageSize),
    page: safePage,
    pageSize,
    totalItems,
    totalPages,
  };
}
