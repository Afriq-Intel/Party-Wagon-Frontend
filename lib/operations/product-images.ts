/**
 * Mock-only product image helpers for Operations catalogue management.
 * Files are validated client-side and stored as data URLs in frontend state.
 */

export const PRODUCT_IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";

export const PRODUCT_IMAGE_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

/** 2 MB mock upload limit. */
export const PRODUCT_IMAGE_MAX_BYTES = 2 * 1024 * 1024;

export function formatProductImageMaxSize(): string {
  return "2 MB";
}

export function isLocalPreviewUrl(url: string): boolean {
  return url.startsWith("data:") || url.startsWith("blob:");
}

export function validateProductImageFile(file: File): string | null {
  if (
    !PRODUCT_IMAGE_ALLOWED_TYPES.includes(
      file.type as (typeof PRODUCT_IMAGE_ALLOWED_TYPES)[number],
    )
  ) {
    return "Use a JPEG, PNG, or WebP image.";
  }
  if (file.size > PRODUCT_IMAGE_MAX_BYTES) {
    return `Image must be ${formatProductImageMaxSize()} or smaller.`;
  }
  return null;
}

export function readProductImageAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }
      reject(new Error("Could not read image file."));
    };
    reader.onerror = () => reject(new Error("Could not read image file."));
    reader.readAsDataURL(file);
  });
}

export function moveImageItem<T>(
  items: T[],
  fromIndex: number,
  toIndex: number,
): T[] {
  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= items.length ||
    toIndex >= items.length ||
    fromIndex === toIndex
  ) {
    return items;
  }
  const next = [...items];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}
