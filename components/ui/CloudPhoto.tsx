import Image from "next/image";

type CloudPhotoProps = {
  src: string;
  alt: string;
  objectPosition?: string;
  className?: string;
  priority?: boolean;
};

/** Photo clipped to the Joy Rush four-lobe cloud, with the orange stroke on top. */
export function CloudPhoto({
  src,
  alt,
  objectPosition = "center",
  className = "",
  priority = false,
}: CloudPhotoProps) {
  return (
    <div className={className}>
      <div className="relative aspect-[1099/769]">
        <div className="joy-cloud-photo absolute inset-0">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 42vw, 80vw"
            className="object-cover"
            style={{ objectPosition }}
          />
        </div>
        <img
          src="/assets/shapes/joy-cloud-stroke.svg?v=midnight"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}
