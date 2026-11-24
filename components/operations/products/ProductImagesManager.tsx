"use client";

import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  ImagePlus,
  Images,
  Star,
  Trash2,
} from "lucide-react";
import { useId, useRef, useState } from "react";
import { MOCK_PRODUCT_IMAGE_POOL } from "@/lib/data/operations-products";
import {
  formatProductImageMaxSize,
  isLocalPreviewUrl,
  moveImageItem,
  PRODUCT_IMAGE_ACCEPT,
  readProductImageAsDataUrl,
  validateProductImageFile,
} from "@/lib/operations/product-images";
import type { OperationsProductImage } from "@/types/operations-products";

type ProductImagesManagerProps = {
  images: OperationsProductImage[];
  editable: boolean;
  productKey?: string;
  onChange: (images: OperationsProductImage[]) => void;
  onError: (message: string | null) => void;
};

function ProductImagePreview({
  url,
  className,
}: {
  url: string;
  className?: string;
}) {
  if (isLocalPreviewUrl(url)) {
    return (
      // Local mock previews (data/blob URLs) are not served by next/image.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={url} alt="" className={className ?? "h-full w-full object-cover"} />
    );
  }

  return (
    <Image
      src={url}
      alt=""
      fill
      className="object-cover"
      sizes="(max-width: 640px) 45vw, 180px"
    />
  );
}

export function ProductImagesManager({
  images,
  editable,
  productKey = "product",
  onChange,
  onError,
}: ProductImagesManagerProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [poolOpen, setPoolOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  function setPrimary(imageId: string) {
    onChange(
      images.map((image) => ({
        ...image,
        isPrimary: image.id === imageId,
      })),
    );
    onError(null);
  }

  function removeImage(imageId: string) {
    const remaining = images.filter((image) => image.id !== imageId);
    if (
      remaining.length > 0 &&
      !remaining.some((image) => image.isPrimary)
    ) {
      remaining[0] = { ...remaining[0], isPrimary: true };
    }
    onChange(remaining);
    onError(null);
  }

  function reorder(fromIndex: number, toIndex: number) {
    onChange(moveImageItem(images, fromIndex, toIndex));
    onError(null);
  }

  function appendImages(urls: string[]) {
    if (urls.length === 0) return;
    const stamp = Date.now();
    const next = [
      ...images,
      ...urls.map((url, index) => ({
        id: `${productKey}-img-${stamp}-${index}`,
        url,
        isPrimary: images.length === 0 && index === 0,
      })),
    ];
    if (!next.some((image) => image.isPrimary) && next[0]) {
      next[0] = { ...next[0], isPrimary: true };
    }
    onChange(next);
    onError(null);
  }

  async function handleFilesSelected(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;

    setBusy(true);
    onError(null);

    try {
      const accepted: string[] = [];
      for (const file of Array.from(fileList)) {
        const validationError = validateProductImageFile(file);
        if (validationError) {
          onError(`${file.name}: ${validationError}`);
          continue;
        }
        const dataUrl = await readProductImageAsDataUrl(file);
        accepted.push(dataUrl);
      }
      if (accepted.length > 0) {
        appendImages(accepted);
      }
    } catch {
      onError("Could not read one or more image files.");
    } finally {
      setBusy(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function addFromPool(url: string) {
    if (images.some((image) => image.url === url)) {
      onError("That catalogue image is already added.");
      return;
    }
    appendImages([url]);
    setPoolOpen(false);
  }

  const empty = images.length === 0;

  return (
    <div className="flex flex-col gap-4">
      {editable ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <input
            ref={fileInputRef}
            id={inputId}
            type="file"
            accept={PRODUCT_IMAGE_ACCEPT}
            multiple
            className="sr-only"
            onChange={(event) => void handleFilesSelected(event.target.files)}
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-midnight-party px-3.5 py-2 font-outfit text-[12.5px] font-semibold text-white transition hover:bg-lilac-luster disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ImagePlus size={14} aria-hidden="true" />
            {busy ? "Adding…" : "Upload images"}
          </button>
          <button
            type="button"
            onClick={() => setPoolOpen((prev) => !prev)}
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-midnight-party/15 px-3.5 py-2 font-outfit text-[12.5px] font-semibold text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster"
          >
            <Images size={14} aria-hidden="true" />
            {poolOpen ? "Hide catalogue picks" : "Pick from catalogue"}
          </button>
          <p className="font-outfit text-[12px] text-midnight-party/50 sm:ml-1">
            JPEG, PNG or WebP · max {formatProductImageMaxSize()} each
          </p>
        </div>
      ) : null}

      {poolOpen && editable ? (
        <div className="rounded-xl border border-black/5 bg-[#fbf8fa] p-3">
          <p className="mb-2 font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45">
            Mock catalogue images
          </p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-8">
            {MOCK_PRODUCT_IMAGE_POOL.map((url) => {
              const alreadyAdded = images.some((image) => image.url === url);
              return (
                <button
                  key={url}
                  type="button"
                  disabled={alreadyAdded}
                  onClick={() => addFromPool(url)}
                  className={`relative aspect-square overflow-hidden rounded-lg border transition ${
                    alreadyAdded
                      ? "cursor-not-allowed border-black/5 opacity-40"
                      : "border-black/5 hover:border-lilac-luster/50"
                  }`}
                  title={alreadyAdded ? "Already added" : "Add image"}
                >
                  <Image
                    src={url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {empty ? (
        <div className="flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-midnight-party/15 bg-[#fbf8fa] px-4 py-10 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-midnight-party shadow-sm">
            <Images size={22} aria-hidden="true" />
          </span>
          <div>
            <p className="font-oswald text-base font-semibold uppercase tracking-wide text-midnight-party">
              No product images
            </p>
            <p className="mt-1 max-w-sm font-outfit text-[13px] text-midnight-party/55">
              {editable
                ? "Upload a JPEG, PNG or WebP file, or pick a mock catalogue image. The primary image appears in the product listing."
                : "This product has no images yet."}
            </p>
          </div>
          {editable ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => fileInputRef.current?.click()}
              className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-midnight-party/15 px-3.5 py-2 font-outfit text-[12.5px] font-semibold text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster"
            >
              <ImagePlus size={14} aria-hidden="true" />
              Add first image
            </button>
          ) : null}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`overflow-hidden rounded-2xl border ${
                image.isPrimary
                  ? "border-lilac-luster/50 ring-2 ring-lilac-luster/20"
                  : "border-black/5"
              }`}
            >
              <div className="relative aspect-square bg-offwhite">
                <ProductImagePreview url={image.url} />
                {image.isPrimary ? (
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 font-outfit text-[10px] font-semibold text-midnight-party shadow-sm">
                    <Star size={11} aria-hidden="true" />
                    Primary
                  </span>
                ) : null}
                <span className="absolute bottom-2 left-2 rounded-full bg-midnight-party/75 px-2 py-0.5 font-outfit text-[10px] font-semibold text-white">
                  {index + 1}
                </span>
              </div>

              {editable ? (
                <div className="flex flex-col gap-1 border-t border-black/5 bg-white p-2">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={image.isPrimary}
                      onClick={() => setPrimary(image.id)}
                      className="flex-1 rounded-lg px-2 py-1.5 font-outfit text-[11px] font-semibold text-midnight-party transition hover:bg-offwhite disabled:opacity-40"
                    >
                      Set primary
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-radiant-rose transition hover:bg-radiant-rose/8"
                      title="Remove image"
                    >
                      <Trash2 size={14} aria-hidden="true" />
                      <span className="sr-only">Remove image</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => reorder(index, index - 1)}
                      className="inline-flex h-8 flex-1 items-center justify-center gap-1 rounded-lg font-outfit text-[11px] font-semibold text-midnight-party transition hover:bg-offwhite disabled:opacity-35"
                      title="Move earlier"
                    >
                      <ChevronUp size={14} aria-hidden="true" />
                      Up
                    </button>
                    <button
                      type="button"
                      disabled={index === images.length - 1}
                      onClick={() => reorder(index, index + 1)}
                      className="inline-flex h-8 flex-1 items-center justify-center gap-1 rounded-lg font-outfit text-[11px] font-semibold text-midnight-party transition hover:bg-offwhite disabled:opacity-35"
                      title="Move later"
                    >
                      Down
                      <ChevronDown size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {!editable && !empty ? (
        <p className="font-outfit text-[12px] text-midnight-party/50">
          {images.length} image{images.length === 1 ? "" : "s"} · Primary used
          in the catalogue listing
        </p>
      ) : null}
    </div>
  );
}
