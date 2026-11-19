import { Star } from "lucide-react";

type StarRatingProps = {
  rating: number;
  max?: number;
  className?: string;
  size?: number;
};

export function StarRating({
  rating,
  max = 5,
  className = "",
  size = 16,
}: StarRatingProps) {
  return (
    <div
      className={`flex items-center gap-0.5 ${className}`}
      aria-label={`${rating} out of ${max} stars`}
    >
      {Array.from({ length: max }, (_, index) => {
        const filled = index < rating;
        return (
          <Star
            key={index}
            size={size}
            className={filled ? "fill-lemon-twist text-lemon-twist" : "fill-offwhite text-offwhite"}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}
