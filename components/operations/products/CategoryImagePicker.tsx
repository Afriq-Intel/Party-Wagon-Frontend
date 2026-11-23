"use client";

import Image from "next/image";
import { Check, ImagePlus, Trash2, Upload } from "lucide-react";
import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { MOCK_CATEGORY_IMAGE_POOL } from "@/lib/data/operations-categories";
import {
  formatProductImageMaxSize,
  isLocalPreviewUrl,
  PRODUCT_IMAGE_ACCEPT,
  readProductImageAsDataUrl,
  validateProductImageFile,
} from "@/lib/operations/product-images";
type CategoryImagePickerProps = {
  value: string;
  onChange: (url: string) => void;
  onError: (message: string | null) => void;
};

function CategoryPreview({ url }: { url: string }) {
  if (isLocalPreviewUrl(url)) {
    return (
      // Mock uploaded previews use data URLs outside next/image optimisation.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={url} alt="" className="h-full w-full object-cover" />
    );
  }

  return (
    <Image src={url} alt="" fill className="object-cover" sizes="160px" />
  );
}

export function CategoryImagePicker({
  value,
  onChange,
  onError,
}: CategoryImagePickerProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const uploadedSelected = isLocalPreviewUrl(value);

  async function ingestFile(file: File | undefined) {
    if (!file) return;

    const validationError = validateProductImageFile(file);
    if (validationError) {
      onError(validationError);
      return;
    }

    setBusy(true);
    onError(null);
    try {
      const dataUrl = await readProductImageAsDataUrl(file);
      onChange(dataUrl);
    } catch {
      onError("Could not read that image file.");
    } finally {
      setBusy(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleFileInput(event: ChangeEvent<HTMLInputElement>) {
    void ingestFile(event.target.files?.[0]);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    void ingestFile(event.dataTransfer.files?.[0]);
  }

  function clearUpload() {
    if (!uploadedSelected) return;
    onChange(MOCK_CATEGORY_IMAGE_POOL[0]);
    onError(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-1.5 font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45">
          Upload image
        </p>
        <div
          onDragEnter={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setDragging(false);
          }}
          onDrop={handleDrop}
          className={`rounded-2xl border border-dashed px-4 py-5 transition ${
            dragging
              ? "border-lilac-luster bg-lilac-luster/5"
              : "border-midnight-party/15 bg-[#fbf8fa]"
          }`}
        >
          <input
            ref={fileInputRef}
            id={inputId}
            type="file"
            accept={PRODUCT_IMAGE_ACCEPT}
            className="sr-only"
            onChange={handleFileInput}
          />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-black/5 bg-white sm:mx-0">
              {value ? (
                <CategoryPreview url={value} />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-midnight-party/35">
                  <ImagePlus size={22} aria-hidden="true" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <p className="font-outfit text-[13px] font-semibold text-midnight-party">
                {busy
                  ? "Uploading preview…"
                  : dragging
                    ? "Drop image to upload"
                    : "Drag and drop an image here"}
              </p>
              <p className="mt-1 font-outfit text-[12px] text-midnight-party/50">
                PNG, JPG/JPEG or WebP · max {formatProductImageMaxSize()}
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-full bg-midnight-party px-3.5 py-2 font-outfit text-[12.5px] font-semibold text-white transition hover:bg-lilac-luster disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Upload size={14} aria-hidden="true" />
                  {uploadedSelected ? "Replace image" : "Upload image"}
                </button>
                {uploadedSelected ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={clearUpload}
                    className="inline-flex items-center gap-1.5 rounded-full border border-midnight-party/15 px-3.5 py-2 font-outfit text-[12.5px] font-semibold text-radiant-rose transition hover:border-radiant-rose/40 hover:bg-radiant-rose/8 disabled:opacity-50"
                  >
                    <Trash2 size={14} aria-hidden="true" />
                    Remove upload
                  </button>
                ) : null}
              </div>
              {uploadedSelected ? (
                <p className="mt-2 font-outfit text-[11.5px] text-lilac-luster">
                  Custom upload selected as the category image
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div>
        <p className="mb-1.5 font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/45">
          Or choose from gallery
        </p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {MOCK_CATEGORY_IMAGE_POOL.map((url) => {
            const selected = value === url;
            return (
              <button
                key={url}
                type="button"
                onClick={() => {
                  onChange(url);
                  onError(null);
                }}
                className={`relative aspect-square overflow-hidden rounded-xl border transition ${
                  selected
                    ? "border-lilac-luster/60 ring-2 ring-lilac-luster/25"
                    : "border-black/5 hover:border-midnight-party/20"
                }`}
              >
                <Image
                  src={url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="96px"
                />
                {selected ? (
                  <span className="absolute right-1.5 top-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-lilac-luster shadow-sm">
                    <Check size={12} aria-hidden="true" />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
