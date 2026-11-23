/**
 * MOCK DATA — Operations catalogue categories for visual development only.
 * Replace with confirmed Operations category APIs later.
 */
import type {
  OperationsCatalogueCategory,
  OperationsCategoryStatus,
} from "@/types/operations-products";

export const OPERATIONS_CATEGORY_STATUSES: OperationsCategoryStatus[] = [
  "active",
  "inactive",
];

export const OPERATIONS_CATEGORIES_PAGE_SIZE = 8;

export function categoryStatusLabel(status: OperationsCategoryStatus): string {
  switch (status) {
    case "active":
      return "Active";
    case "inactive":
      return "Inactive";
  }
}

export function categoryStatusHint(status: OperationsCategoryStatus): string {
  switch (status) {
    case "active":
      return "Visible for product assignment and catalogue browsing";
    case "inactive":
      return "Hidden from new product assignment";
  }
}

export function cloneOperationsCategory(
  category: OperationsCatalogueCategory,
): OperationsCatalogueCategory {
  return { ...category };
}

export function createMockOperationsCategories(): OperationsCatalogueCategory[] {
  return [
    {
      id: "cat-champagne",
      name: "Champagne",
      description:
        "Sparkling celebration bottles for toasts, receptions and premium party tables.",
      image: "/assets/products/catalogue/moet-chandon.jpg",
      status: "active",
      updatedAt: "2026-11-18T09:00:00.000Z",
    },
    {
      id: "cat-soft-drinks",
      name: "Soft Drinks",
      description:
        "Mixers, coolers and crowd-favourite sodas for self-serve drink stations.",
      image: "/assets/products/catalogue/coca-cola-classic.jpg",
      status: "active",
      updatedAt: "2026-11-16T11:00:00.000Z",
    },
    {
      id: "cat-cocktails",
      name: "Cocktails",
      description:
        "Ready-to-pour mixes and signature cocktail kits for late-night service.",
      image: "/assets/products/catalogue/espresso-martini.jpg",
      status: "active",
      updatedAt: "2026-11-18T08:00:00.000Z",
    },
    {
      id: "cat-beer",
      name: "Beer",
      description:
        "Lagers, stouts and multipacks for chill zones and outdoor setups.",
      image: "/assets/products/catalogue/heineken-bottle.jpg",
      status: "active",
      updatedAt: "2026-11-18T12:00:00.000Z",
    },
    {
      id: "cat-vodka",
      name: "Vodka",
      description:
        "Clean spirits for cocktails, shots and bartender stations.",
      image: "/assets/products/catalogue/absolut-bottle.jpg",
      status: "active",
      updatedAt: "2026-11-17T07:00:00.000Z",
    },
    {
      id: "cat-party-food",
      name: "Party Food",
      description:
        "Platters, wings and grazing options sized for mid to large celebrations.",
      image: "/assets/products/catalogue/finger-foods.jpg",
      status: "active",
      updatedAt: "2026-11-18T15:00:00.000Z",
    },
    {
      id: "cat-spirits",
      name: "Spirits",
      description:
        "Whiskey, gin and premium spirit bottles for neat pours and classic serves.",
      image: "/assets/products/catalogue/whiskey-bottle.jpg",
      status: "inactive",
      updatedAt: "2026-11-08T21:00:00.000Z",
    },
    {
      id: "cat-wine",
      name: "Wine",
      description:
        "Red, white and easy celebration bottles for dinners and gift add-ons.",
      image: "/assets/products/catalogue/red-wine.jpg",
      status: "active",
      updatedAt: "2026-11-15T08:00:00.000Z",
    },
  ];
}

/** Images available for mock category image selection. */
export const MOCK_CATEGORY_IMAGE_POOL = [
  "/assets/products/catalogue/moet-chandon.jpg",
  "/assets/products/catalogue/veuve-clicquot.jpg",
  "/assets/products/catalogue/champagne-glasses.jpg",
  "/assets/products/catalogue/prosecco.jpg",
  "/assets/products/catalogue/coca-cola-classic.jpg",
  "/assets/products/catalogue/fanta-orange.jpg",
  "/assets/products/catalogue/soft-drink-cans.jpg",
  "/assets/products/catalogue/espresso-martini.jpg",
  "/assets/products/catalogue/berry-cocktail.jpg",
  "/assets/products/catalogue/cocktail-blue.jpg",
  "/assets/products/catalogue/heineken-bottle.jpg",
  "/assets/products/catalogue/guinness-style.jpg",
  "/assets/products/catalogue/beer-cans.jpg",
  "/assets/products/catalogue/absolut-bottle.jpg",
  "/assets/products/catalogue/smirnoff-alt.jpg",
  "/assets/products/catalogue/finger-foods.jpg",
  "/assets/products/catalogue/chicken-wings.jpg",
  "/assets/products/catalogue/cheese-board.jpg",
  "/assets/products/catalogue/whiskey-bottle.jpg",
  "/assets/products/catalogue/gin-bottle.jpg",
  "/assets/products/catalogue/red-wine.jpg",
  "/assets/products/catalogue/white-wine.jpg",
] as const;
