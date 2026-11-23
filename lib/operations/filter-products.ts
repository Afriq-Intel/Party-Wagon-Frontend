import { OPERATIONS_PRODUCTS_PAGE_SIZE } from "@/lib/data/operations-products";
import type {
  OperationsProduct,
  OperationsProductFilters,
} from "@/types/operations-products";

export function filterOperationsProducts(
  products: OperationsProduct[],
  filters: OperationsProductFilters,
): OperationsProduct[] {
  const query = filters.search.trim().toLowerCase();

  return products.filter((product) => {
    if (filters.category !== "all" && product.category !== filters.category) {
      return false;
    }
    if (filters.status !== "all" && product.status !== filters.status) {
      return false;
    }
    if (!query) return true;

    return (
      product.name.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  });
}

export function paginateOperationsProducts(
  products: OperationsProduct[],
  page: number,
  pageSize: number = OPERATIONS_PRODUCTS_PAGE_SIZE,
): {
  items: OperationsProduct[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
} {
  const totalItems = products.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: products.slice(start, start + pageSize),
    page: safePage,
    pageSize,
    totalItems,
    totalPages,
  };
}
