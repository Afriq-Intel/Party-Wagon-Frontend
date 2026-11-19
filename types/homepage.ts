export type CategoryItem = {
  id: string;
  name: string;
  slug: string;
};

export type ProductItem = {
  id: string;
  name: string;
  slug: string;
  image: string;
  /** Demo / catalogue category label shown on the card. */
  category: string;
  priceLabel: string;
  rating: number;
  /**
   * Optional discount copy. Only set when real discount data exists —
   * do not invent promotional badges for mock catalogue items.
   */
  discountLabel?: string;
  /** Optional compare-at price shown when a real discount exists. */
  compareAtPriceLabel?: string;
};

export type TestimonialItem = {
  id: string;
  name: string;
  quote: string;
  rating: number;
  avatar: string;
};
