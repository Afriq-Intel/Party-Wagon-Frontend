"use client";

import Image from "next/image";
import { isLocalPreviewUrl } from "@/lib/operations/product-images";

export function ProductImageThumb({
  src,
  size,
  className = "h-full w-full object-cover",
}: {
  src: string;
  size: number;
  className?: string;
}) {
  if (isLocalPreviewUrl(src)) {
    return (
      // Mock uploaded previews use data URLs outside next/image optimisation.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt="" width={size} height={size} className={className} />
    );
  }

  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      className={className}
    />
  );
}
