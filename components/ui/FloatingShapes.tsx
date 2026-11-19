type FloatingShapesProps = {
  variant?: "lilac" | "lemon" | "mixed";
  className?: string;
};

/** Decorative blobs/stars — Joy Rush organic shape energy, Party Wagon palette. */
export function FloatingShapes({
  variant = "mixed",
  className = "",
}: FloatingShapesProps) {
  const tones =
    variant === "lilac"
      ? ["bg-lilac-luster/25", "bg-blue-lagoon/20", "bg-lemon-twist/30"]
      : variant === "lemon"
        ? ["bg-lemon-twist/35", "bg-radiant-rose/20", "bg-lilac-luster/20"]
        : ["bg-lilac-luster/20", "bg-lemon-twist/30", "bg-blue-lagoon/25"];

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <span
        className={`absolute -left-6 top-8 h-24 w-24 rounded-[40%] ${tones[0]} blur-xl animate-float`}
      />
      <span
        className={`absolute right-8 top-16 h-16 w-16 rounded-full ${tones[1]} blur-lg animate-soft-pulse`}
      />
      <span
        className={`absolute bottom-10 left-1/3 h-20 w-28 rounded-[45%] ${tones[2]} blur-xl animate-float`}
        style={{ animationDelay: "1.2s" }}
      />
      <span className="absolute right-16 bottom-16 text-lemon-twist opacity-70 animate-spin-slow">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1.5 13.8 8.2 20.5 10 13.8 11.8 12 18.5 10.2 11.8 3.5 10 10.2 8.2 12 1.5Z" />
        </svg>
      </span>
    </div>
  );
}
