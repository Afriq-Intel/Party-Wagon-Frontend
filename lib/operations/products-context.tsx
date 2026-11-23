"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  cloneOperationsCategory,
  createMockOperationsCategories,
} from "@/lib/data/operations-categories";
import {
  cloneOperationsProduct,
  createMockOperationsProducts,
  primaryImageUrl,
} from "@/lib/data/operations-products";
import type {
  OperationsCatalogueCategory,
  OperationsCategoryInput,
  OperationsCategoryStatus,
  OperationsProduct,
  OperationsProductEditInput,
  OperationsProductStatus,
} from "@/types/operations-products";

type DeleteCategoryResult =
  | { ok: true; category: OperationsCatalogueCategory }
  | { ok: false; reason: "not_found" | "has_products"; productCount: number };

type OperationsProductsContextValue = {
  products: OperationsProduct[];
  categories: OperationsCatalogueCategory[];
  getProduct: (productId: string) => OperationsProduct | undefined;
  getCategory: (categoryId: string) => OperationsCatalogueCategory | undefined;
  getCategoryProductCount: (categoryName: string) => number;
  createProduct: (
    input: OperationsProductEditInput,
  ) => OperationsProduct | null;
  updateProduct: (
    productId: string,
    input: OperationsProductEditInput,
  ) => OperationsProduct | null;
  updateProductStatus: (
    productId: string,
    status: OperationsProductStatus,
  ) => OperationsProduct | null;
  deleteProduct: (productId: string) => OperationsProduct | null;
  createCategory: (
    input: OperationsCategoryInput,
  ) => OperationsCatalogueCategory | null;
  updateCategory: (
    categoryId: string,
    input: OperationsCategoryInput,
  ) => OperationsCatalogueCategory | null;
  updateCategoryStatus: (
    categoryId: string,
    status: OperationsCategoryStatus,
  ) => OperationsCatalogueCategory | null;
  deleteCategory: (categoryId: string) => DeleteCategoryResult;
};

const OperationsProductsContext =
  createContext<OperationsProductsContextValue | null>(null);


function slugifyCategoryId(name: string): string {
  return `cat-${name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}-${Date.now().toString(36)}`;
}

function createProductId(): string {
  return `prod-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

function buildProductFromInput(
  input: OperationsProductEditInput,
  existing?: OperationsProduct,
): OperationsProduct {
  const id = existing?.id ?? createProductId();
  const images = input.images.map((image, index) => ({
    ...image,
    id:
      image.id.startsWith("temp-") || image.id.startsWith("new-")
        ? `${id}-img-${index + 1}`
        : image.id,
  }));
  if (images.length > 0 && !images.some((image) => image.isPrimary)) {
    images[0] = { ...images[0], isPrimary: true };
  }

  const variants = input.variants.map((variant, index) => ({
    ...variant,
    id:
      variant.id.includes("temp-") || variant.id.includes("new-")
        ? `${id}-var-${index + 1}`
        : variant.id,
    label: variant.label.trim(),
    sku: variant.sku.trim(),
  }));

  return {
    id,
    name: input.name,
    description: input.description,
    brand: input.brand,
    sku: input.sku,
    category: input.category,
    ageRestriction: input.ageRestriction,
    tags: [...input.tags],
    priceGhs: input.priceGhs,
    status: input.status,
    images,
    image: primaryImageUrl(images, existing?.image ?? ""),
    variants,
    variantsCount: variants.length,
    updatedAt: new Date().toISOString(),
  };
}

export function OperationsProductsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [products, setProducts] = useState<OperationsProduct[]>(() =>
    createMockOperationsProducts().map(cloneOperationsProduct),
  );
  const [categories, setCategories] = useState<OperationsCatalogueCategory[]>(
    () => createMockOperationsCategories().map(cloneOperationsCategory),
  );

  const getProduct = useCallback(
    (productId: string) => products.find((product) => product.id === productId),
    [products],
  );

  const getCategory = useCallback(
    (categoryId: string) =>
      categories.find((category) => category.id === categoryId),
    [categories],
  );

  const getCategoryProductCount = useCallback(
    (categoryName: string) =>
      products.filter((product) => product.category === categoryName).length,
    [products],
  );

  const createProduct = useCallback(
    (input: OperationsProductEditInput) => {
      const duplicateSku = products.some(
        (product) => product.sku.toLowerCase() === input.sku.toLowerCase(),
      );
      if (duplicateSku) return null;

      const created = buildProductFromInput(input);
      setProducts((current) => [created, ...current]);
      return created;
    },
    [products],
  );

  const updateProduct = useCallback(
    (productId: string, input: OperationsProductEditInput) => {
      const existing = products.find((product) => product.id === productId);
      if (!existing) return null;

      const duplicateSku = products.some(
        (product) =>
          product.id !== productId &&
          product.sku.toLowerCase() === input.sku.toLowerCase(),
      );
      if (duplicateSku) return null;

      const updated = buildProductFromInput(input, existing);
      setProducts((current) =>
        current.map((product) =>
          product.id === productId ? updated : product,
        ),
      );
      return updated;
    },
    [products],
  );

  const updateProductStatus = useCallback(
    (productId: string, status: OperationsProductStatus) => {
      let updated: OperationsProduct | null = null;
      setProducts((current) => {
        const next = current.map((product) => {
          if (product.id !== productId) return product;
          updated = {
            ...cloneOperationsProduct(product),
            status,
            updatedAt: new Date().toISOString(),
          };
          return updated;
        });
        return next;
      });
      return updated;
    },
    [],
  );

  const deleteProduct = useCallback((productId: string) => {
    let removed: OperationsProduct | null = null;
    setProducts((current) => {
      const target = current.find((product) => product.id === productId);
      removed = target ? cloneOperationsProduct(target) : null;
      return current.filter((product) => product.id !== productId);
    });
    return removed;
  }, []);

  const createCategory = useCallback(
    (input: OperationsCategoryInput) => {
      const name = input.name.trim();
      if (!name) return null;

      const duplicate = categories.some(
        (category) => category.name.toLowerCase() === name.toLowerCase(),
      );
      if (duplicate) return null;

      const created: OperationsCatalogueCategory = {
        id: slugifyCategoryId(name),
        name,
        description: input.description.trim(),
        image: input.image,
        status: input.status,
        updatedAt: new Date().toISOString(),
      };
      setCategories((current) => [...current, created]);
      return created;
    },
    [categories],
  );

  const updateCategory = useCallback(
    (categoryId: string, input: OperationsCategoryInput) => {
      const name = input.name.trim();
      if (!name) return null;

      const current = categories.find((category) => category.id === categoryId);
      if (!current) return null;

      const duplicate = categories.some(
        (category) =>
          category.id !== categoryId &&
          category.name.toLowerCase() === name.toLowerCase(),
      );
      if (duplicate) return null;

      const previousName = current.name;
      const updated: OperationsCatalogueCategory = {
        ...current,
        name,
        description: input.description.trim(),
        image: input.image,
        status: input.status,
        updatedAt: new Date().toISOString(),
      };

      setCategories((list) =>
        list.map((category) =>
          category.id === categoryId ? updated : category,
        ),
      );

      if (previousName !== name) {
        setProducts((list) =>
          list.map((product) =>
            product.category === previousName
              ? {
                  ...product,
                  category: name,
                  updatedAt: new Date().toISOString(),
                }
              : product,
          ),
        );
      }

      return updated;
    },
    [categories],
  );

  const updateCategoryStatus = useCallback(
    (categoryId: string, status: OperationsCategoryStatus) => {
      let updated: OperationsCatalogueCategory | null = null;
      setCategories((current) =>
        current.map((category) => {
          if (category.id !== categoryId) return category;
          updated = {
            ...category,
            status,
            updatedAt: new Date().toISOString(),
          };
          return updated;
        }),
      );
      return updated;
    },
    [],
  );

  const deleteCategory = useCallback(
    (categoryId: string): DeleteCategoryResult => {
      const target = categories.find((category) => category.id === categoryId);
      if (!target) {
        return { ok: false, reason: "not_found", productCount: 0 };
      }

      const productCount = products.filter(
        (product) => product.category === target.name,
      ).length;
      if (productCount > 0) {
        return { ok: false, reason: "has_products", productCount };
      }

      setCategories((current) =>
        current.filter((category) => category.id !== categoryId),
      );
      return { ok: true, category: cloneOperationsCategory(target) };
    },
    [categories, products],
  );

  const value = useMemo(
    () => ({
      products,
      categories,
      getProduct,
      getCategory,
      getCategoryProductCount,
      createProduct,
      updateProduct,
      updateProductStatus,
      deleteProduct,
      createCategory,
      updateCategory,
      updateCategoryStatus,
      deleteCategory,
    }),
    [
      products,
      categories,
      getProduct,
      getCategory,
      getCategoryProductCount,
      createProduct,
      updateProduct,
      updateProductStatus,
      deleteProduct,
      createCategory,
      updateCategory,
      updateCategoryStatus,
      deleteCategory,
    ],
  );

  return (
    <OperationsProductsContext.Provider value={value}>
      {children}
    </OperationsProductsContext.Provider>
  );
}

export function useOperationsProducts() {
  const context = useContext(OperationsProductsContext);
  if (!context) {
    throw new Error(
      "useOperationsProducts must be used within OperationsProductsProvider",
    );
  }
  return context;
}
