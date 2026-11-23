"use client";

import Image from "next/image";
import { ImagePlus, Images, Trash2 } from "lucide-react";
import { useId, useRef, useState } from "react";
import { MOCK_PARTNER_SERVICE_IMAGE_POOL } from "@/lib/data/partner-services";
import {
  formatProductImageMaxSize,
  isLocalPreviewUrl,
  PRODUCT_IMAGE_ACCEPT,
  readProductImageAsDataUrl,
  validateProductImageFile,
} from "@/lib/operations/product-images";

type ServiceImagePickerProps = {
  image: string;
  editable: boolean;
  onChange: (image: string) => void;
  onError: (message: string | null) => void;
};

function Preview({ url }: { url: string }) {
  if (!url) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#fbf8fa] text-midnight-party/35">
        <ImagePlus size={28} aria-hidden="true" />
      </div>
    );
  }

  if (isLocalPreviewUrl(url)) {
    return (
      // Local mock previews (data/blob URLs) are not served by next/image.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={url} alt="" className="h-full w-full object-cover" />
    );
  }

  return (
    <Image
      src={url}
      alt=""
      fill
      className="object-cover"
      sizes="(max-width: 640px) 70vw, 280px"
    />
  );
}

export function ServiceImagePicker({
  image,
  editable,
  onChange,
  onError,
}: ServiceImagePickerProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [poolOpen, setPoolOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleFileChange(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;

    const validationError = validateProductImageFile(file);
    if (validationError) {
      onError(validationError);
      return;
    }

    setBusy(true);
    try {
      const dataUrl = await readProductImageAsDataUrl(file);
      onChange(dataUrl);
      onError(null);
    } catch {
      onError("Could not read that image file.");
    } finally {
      setBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] w-full max-w-sm overflow-hidden rounded-2xl border border-black/5 bg-[#fbf8fa]">
        <Preview url={image} />
      </div>

      {editable ? (
        <div className="flex flex-wrap gap-2">
          <input
            ref={fileInputRef}
            id={inputId}
            type="file"
            accept={PRODUCT_IMAGE_ACCEPT}
            className="sr-only"
            onChange={(event) => {
              void handleFileChange(event.target.files);
            }}
          />
          <label
            htmlFor={inputId}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-full border border-midnight-party/15 bg-white px-3.5 py-2 font-outfit text-[12.5px] font-semibold text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster ${
              busy ? "pointer-events-none opacity-60" : ""
            }`}
          >
            <ImagePlus size={15} aria-hidden="true" />
            Upload image
          </label>
          <button
            type="button"
            onClick={() => setPoolOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-full border border-midnight-party/15 bg-white px-3.5 py-2 font-outfit text-[12.5px] font-semibold text-midnight-party transition hover:border-lilac-luster/40 hover:text-lilac-luster focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
          >
            <Images size={15} aria-hidden="true" />
            {poolOpen ? "Hide library" : "Pick from library"}
          </button>
          {image ? (
            <button
              type="button"
              onClick={() => {
                onChange("");
                onError(null);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-radiant-rose/20 bg-white px-3.5 py-2 font-outfit text-[12.5px] font-semibold text-radiant-rose transition hover:bg-radiant-rose/8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
            >
              <Trash2 size={15} aria-hidden="true" />
              Remove
            </button>
          ) : null}
        </div>
      ) : null}

      {editable ? (
        <p className="font-outfit text-[12px] text-midnight-party/45">
          JPEG, PNG or WebP up to {formatProductImageMaxSize()}. Mock uploads
          stay in this browser session only.
        </p>
      ) : null}

      {editable && poolOpen ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {MOCK_PARTNER_SERVICE_IMAGE_POOL.map((url) => {
            const selected = image === url;
            return (
              <button
                key={url}
                type="button"
                onClick={() => {
                  onChange(url);
                  onError(null);
                  setPoolOpen(false);
                }}
                className={`relative aspect-square overflow-hidden rounded-xl border transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster ${
                  selected
                    ? "border-lilac-luster ring-2 ring-lilac-luster/30"
                    : "border-black/5 hover:border-lilac-luster/40"
                }`}
              >
                <Image
                  src={url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
