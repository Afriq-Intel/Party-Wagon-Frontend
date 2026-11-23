/**
 * Shared lilac-luster photo tint used on marketing hero banners.
 * Matches the Services hero stack so every photo hero reads the same.
 */
export function HeroPhotoTint() {
  return (
    <>
      <div className="absolute inset-0 bg-lilac-luster/55 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-r from-midnight-party/85 via-midnight-party/55 to-lilac-luster/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-midnight-party/70 via-transparent to-midnight-party/30" />
    </>
  );
}
