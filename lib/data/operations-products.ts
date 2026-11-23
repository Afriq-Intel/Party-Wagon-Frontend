/**
 * MOCK DATA — Operations Products & Catalogue visual development only.
 * Not live Party Wagon inventory or backend records.
 * Replace with confirmed Operations products APIs later.
 */
import type {
  OperationsAgeRestriction,
  OperationsProduct,
  OperationsProductCategory,
  OperationsProductImage,
  OperationsProductStatus,
  OperationsProductUom,
  OperationsProductVariant,
} from "@/types/operations-products";

export const OPERATIONS_PRODUCT_UOM_LABELS: Record<
  OperationsProductUom,
  string
> = {
  unit: "Unit",
  bottle: "Bottle",
  can: "Can",
  pack: "Pack",
  case: "Case",
  platter: "Platter",
};

export const OPERATIONS_PRODUCT_CATEGORIES: OperationsProductCategory[] = [
  "Champagne",
  "Soft Drinks",
  "Cocktails",
  "Beer",
  "Vodka",
  "Party Food",
  "Spirits",
  "Wine",
];

export const OPERATIONS_PRODUCT_STATUSES: OperationsProductStatus[] = [
  "published",
  "draft",
  "inactive",
];

export const OPERATIONS_PRODUCTS_PAGE_SIZE = 8;

/** Extra catalogue images available for mock “add image” interactions. */
export const MOCK_PRODUCT_IMAGE_POOL = [
  "/assets/products/catalogue/champagne-glasses.jpg",
  "/assets/products/catalogue/champagne-ice.jpg",
  "/assets/products/catalogue/sparkling-packshot.jpg",
  "/assets/products/catalogue/soft-drink-cans.jpg",
  "/assets/products/catalogue/soft-drink-packshot.jpg",
  "/assets/products/catalogue/coca-cola-bottle.jpg",
  "/assets/products/catalogue/coca-cola-packshot.jpg",
  "/assets/products/catalogue/cocktail-blue.jpg",
  "/assets/products/catalogue/cocktail-packshot.jpg",
  "/assets/products/catalogue/mojito.jpg",
  "/assets/products/catalogue/margarita.jpg",
  "/assets/products/catalogue/beer-lager.jpg",
  "/assets/products/catalogue/beer-cans.jpg",
  "/assets/products/catalogue/heineken-packshot.jpg",
  "/assets/products/catalogue/vodka-ice.jpg",
  "/assets/products/catalogue/absolut-clear.jpg",
  "/assets/products/catalogue/absolut-packshot.jpg",
  "/assets/products/catalogue/smirnoff-packshot.jpg",
  "/assets/products/catalogue/whiskey-packshot.jpg",
  "/assets/products/catalogue/party-platter.jpg",
] as const;

const VARIANT_DEFS: {
  label: string;
  packSize: number;
  uom: OperationsProductUom;
  multiplier: number;
}[] = [
  { label: "Single", packSize: 1, uom: "unit", multiplier: 1 },
  { label: "Twin pack", packSize: 2, uom: "pack", multiplier: 1.85 },
  { label: "Case of 6", packSize: 6, uom: "case", multiplier: 5.2 },
  { label: "Case of 12", packSize: 12, uom: "case", multiplier: 9.5 },
];

function ageForCategory(
  category: OperationsProductCategory,
): OperationsAgeRestriction {
  if (category === "Soft Drinks" || category === "Party Food") return "none";
  if (category === "Spirits" || category === "Vodka") return "18+";
  return "18+";
}

function tagsFor(
  category: OperationsProductCategory,
  brand: string,
): string[] {
  const base = [category.toLowerCase().replace(/\s+/g, "-"), "party-ready"];
  if (brand.toLowerCase().includes("party wagon")) {
    base.push("house");
  } else {
    base.push("branded");
  }
  if (category === "Champagne" || category === "Wine") base.push("celebration");
  if (category === "Cocktails") base.push("ready-to-pour");
  return base;
}

function buildImages(
  productId: string,
  primary: string,
  extras: string[] = [],
): OperationsProductImage[] {
  const urls = [primary, ...extras.filter((url) => url !== primary)];
  return urls.map((url, index) => ({
    id: `${productId}-img-${index + 1}`,
    url,
    isPrimary: index === 0,
  }));
}

function buildVariants(
  productId: string,
  sku: string,
  basePrice: number,
  count: number,
  productStatus: OperationsProductStatus,
): OperationsProductVariant[] {
  return Array.from({ length: count }, (_, index) => {
    const def = VARIANT_DEFS[index % VARIANT_DEFS.length];
    const variantStatus: OperationsProductStatus =
      productStatus === "inactive"
        ? "inactive"
        : index === count - 1 && count > 2
          ? "draft"
          : "published";

    return {
      id: `${productId}-var-${index + 1}`,
      label: def.label,
      sku: `${sku}-${String(index + 1).padStart(2, "0")}`,
      packSize: def.packSize,
      uom: def.uom,
      priceGhs: Math.round(basePrice * def.multiplier),
      status: variantStatus,
    };
  });
}

type SeedProduct = {
  id: string;
  name: string;
  brand: string;
  description: string;
  sku: string;
  category: OperationsProductCategory;
  priceGhs: number;
  variantsCount: number;
  status: OperationsProductStatus;
  image: string;
  extraImages?: string[];
  updatedAt: string;
};

const PRODUCT_SEEDS: SeedProduct[] = [
  {
    id: "prod-001",
    name: "Moët & Chandon Impérial",
    brand: "Moët & Chandon",
    description:
      "Signature brut champagne with bright citrus, white flowers and toasted brioche, ready for the toast.",
    sku: "PW-CHAMP-001",
    category: "Champagne",
    priceGhs: 850,
    variantsCount: 3,
    status: "published",
    image: "/assets/products/catalogue/moet-chandon.jpg",
    extraImages: [
      "/assets/products/catalogue/champagne-glasses.jpg",
      "/assets/products/catalogue/sparkling-packshot.jpg",
    ],
    updatedAt: "2026-11-18T09:20:00.000Z",
  },
  {
    id: "prod-002",
    name: "Veuve Clicquot Yellow Label",
    brand: "Veuve Clicquot",
    description:
      "Bold, structured champagne with ripe fruit and a clean finish for celebration tables.",
    sku: "PW-CHAMP-002",
    category: "Champagne",
    priceGhs: 920,
    variantsCount: 2,
    status: "published",
    image: "/assets/products/catalogue/veuve-clicquot.jpg",
    extraImages: ["/assets/products/catalogue/champagne-ice.jpg"],
    updatedAt: "2026-11-17T14:05:00.000Z",
  },
  {
    id: "prod-003",
    name: "Coca-Cola Classic 1.5L",
    brand: "Coca-Cola",
    description:
      "Chilled crowd favourite for mixers, coolers and self-serve drink stations.",
    sku: "PW-SOFT-014",
    category: "Soft Drinks",
    priceGhs: 18,
    variantsCount: 4,
    status: "published",
    image: "/assets/products/catalogue/coca-cola-classic.jpg",
    extraImages: [
      "/assets/products/catalogue/coca-cola-bottle.jpg",
      "/assets/products/catalogue/coca-cola-packshot.jpg",
    ],
    updatedAt: "2026-11-16T11:40:00.000Z",
  },
  {
    id: "prod-004",
    name: "Fanta Orange 1.5L",
    brand: "Fanta",
    description:
      "Bright orange soda for kids’ tables, mix stations and high-volume parties.",
    sku: "PW-SOFT-021",
    category: "Soft Drinks",
    priceGhs: 16,
    variantsCount: 3,
    status: "draft",
    image: "/assets/products/catalogue/fanta-orange.jpg",
    extraImages: ["/assets/products/catalogue/soft-drink-cans.jpg"],
    updatedAt: "2026-11-15T16:22:00.000Z",
  },
  {
    id: "prod-005",
    name: "Espresso Martini Pack",
    brand: "Party Wagon Mix",
    description:
      "Ready-to-pour espresso martini kit with rich coffee notes for late-night service.",
    sku: "PW-COCK-008",
    category: "Cocktails",
    priceGhs: 240,
    variantsCount: 2,
    status: "published",
    image: "/assets/products/catalogue/espresso-martini.jpg",
    extraImages: ["/assets/products/catalogue/cocktail-packshot.jpg"],
    updatedAt: "2026-11-18T08:10:00.000Z",
  },
  {
    id: "prod-006",
    name: "Berry Cocktail Mixer",
    brand: "Party Wagon Mix",
    description:
      "Berry-forward mixer base for spritzes and batch cocktails. Currently inactive.",
    sku: "PW-COCK-011",
    category: "Cocktails",
    priceGhs: 185,
    variantsCount: 1,
    status: "inactive",
    image: "/assets/products/catalogue/berry-cocktail.jpg",
    extraImages: ["/assets/products/catalogue/cocktail-blue.jpg"],
    updatedAt: "2026-11-10T19:00:00.000Z",
  },
  {
    id: "prod-007",
    name: "Heineken Lager 6-Pack",
    brand: "Heineken",
    description:
      "Crisp lager six-pack for chill zones, outdoor setups and casual gatherings.",
    sku: "PW-BEER-003",
    category: "Beer",
    priceGhs: 72,
    variantsCount: 5,
    status: "published",
    image: "/assets/products/catalogue/heineken-bottle.jpg",
    extraImages: [
      "/assets/products/catalogue/heineken-packshot.jpg",
      "/assets/products/catalogue/beer-cans.jpg",
    ],
    updatedAt: "2026-11-18T12:45:00.000Z",
  },
  {
    id: "prod-008",
    name: "Guinness Stout Can Pack",
    brand: "Guinness",
    description:
      "Smooth stout multipack for classic Ghanaian party tables and late pours.",
    sku: "PW-BEER-009",
    category: "Beer",
    priceGhs: 68,
    variantsCount: 3,
    status: "published",
    image: "/assets/products/catalogue/guinness-style.jpg",
    extraImages: ["/assets/products/catalogue/beer-lager.jpg"],
    updatedAt: "2026-11-14T10:15:00.000Z",
  },
  {
    id: "prod-009",
    name: "Absolut Vodka 750ml",
    brand: "Absolut",
    description:
      "Clean Swedish vodka for cocktails, shots and bartender stations.",
    sku: "PW-VODK-001",
    category: "Vodka",
    priceGhs: 310,
    variantsCount: 4,
    status: "published",
    image: "/assets/products/catalogue/absolut-bottle.jpg",
    extraImages: [
      "/assets/products/catalogue/absolut-clear.jpg",
      "/assets/products/catalogue/absolut-packshot.jpg",
    ],
    updatedAt: "2026-11-17T07:55:00.000Z",
  },
  {
    id: "prod-010",
    name: "Smirnoff Red Label",
    brand: "Smirnoff",
    description:
      "Reliable vodka staple for high-volume bars. Draft pending catalogue review.",
    sku: "PW-VODK-004",
    category: "Vodka",
    priceGhs: 195,
    variantsCount: 3,
    status: "draft",
    image: "/assets/products/catalogue/smirnoff-alt.jpg",
    extraImages: ["/assets/products/catalogue/smirnoff-packshot.jpg"],
    updatedAt: "2026-11-12T13:30:00.000Z",
  },
  {
    id: "prod-011",
    name: "Party Finger Foods Platter",
    brand: "Party Wagon Kitchen",
    description:
      "Assorted finger foods platter sized for mid-size celebrations and office parties.",
    sku: "PW-FOOD-002",
    category: "Party Food",
    priceGhs: 280,
    variantsCount: 6,
    status: "published",
    image: "/assets/products/catalogue/finger-foods.jpg",
    extraImages: ["/assets/products/catalogue/party-platter.jpg"],
    updatedAt: "2026-11-18T15:05:00.000Z",
  },
  {
    id: "prod-012",
    name: "Chicken Wings Party Box",
    brand: "Party Wagon Kitchen",
    description:
      "Spiced chicken wings box with dipping sauces. High demand weekend SKU.",
    sku: "PW-FOOD-007",
    category: "Party Food",
    priceGhs: 220,
    variantsCount: 2,
    status: "published",
    image: "/assets/products/catalogue/chicken-wings.jpg",
    extraImages: ["/assets/products/catalogue/party-platter.jpg"],
    updatedAt: "2026-11-16T18:20:00.000Z",
  },
  {
    id: "prod-013",
    name: "Jack Daniel's Tennessee Whiskey",
    brand: "Jack Daniel's",
    description:
      "Charcoal-mellowed Tennessee whiskey for neat pours and classic cocktails.",
    sku: "PW-SPIR-002",
    category: "Spirits",
    priceGhs: 420,
    variantsCount: 2,
    status: "published",
    image: "/assets/products/catalogue/whiskey-bottle.jpg",
    extraImages: ["/assets/products/catalogue/whiskey-packshot.jpg"],
    updatedAt: "2026-11-13T09:00:00.000Z",
  },
  {
    id: "prod-014",
    name: "Premium Gin Selection",
    brand: "Party Wagon Spirits",
    description:
      "Curated gin bottle for botanicals-forward service. Currently inactive.",
    sku: "PW-SPIR-015",
    category: "Spirits",
    priceGhs: 360,
    variantsCount: 3,
    status: "inactive",
    image: "/assets/products/catalogue/gin-bottle.jpg",
    updatedAt: "2026-11-08T21:10:00.000Z",
  },
  {
    id: "prod-015",
    name: "Red Wine Celebration Bottle",
    brand: "Party Wagon Cellar",
    description:
      "Approachable red for dinners, receptions and gift add-ons.",
    sku: "PW-WINE-006",
    category: "Wine",
    priceGhs: 145,
    variantsCount: 2,
    status: "published",
    image: "/assets/products/catalogue/red-wine.jpg",
    updatedAt: "2026-11-15T08:40:00.000Z",
  },
  {
    id: "prod-016",
    name: "Crisp White Wine",
    brand: "Party Wagon Cellar",
    description:
      "Fresh white wine draft listing awaiting merchandising copy approval.",
    sku: "PW-WINE-010",
    category: "Wine",
    priceGhs: 130,
    variantsCount: 2,
    status: "draft",
    image: "/assets/products/catalogue/white-wine.jpg",
    updatedAt: "2026-11-11T12:00:00.000Z",
  },
  {
    id: "prod-017",
    name: "Prosecco Sparkling Pack",
    brand: "Party Wagon Bubbles",
    description:
      "Easy sparkling pack for brunch tables and welcome drinks.",
    sku: "PW-CHAMP-018",
    category: "Champagne",
    priceGhs: 390,
    variantsCount: 1,
    status: "published",
    image: "/assets/products/catalogue/prosecco.jpg",
    extraImages: ["/assets/products/catalogue/sparkling-packshot.jpg"],
    updatedAt: "2026-11-18T17:25:00.000Z",
  },
  {
    id: "prod-018",
    name: "Cheese Board Platter",
    brand: "Party Wagon Kitchen",
    description:
      "Cheese and accompaniments board for grazing tables. Inactive pending supplier refresh.",
    sku: "PW-FOOD-019",
    category: "Party Food",
    priceGhs: 260,
    variantsCount: 3,
    status: "inactive",
    image: "/assets/products/catalogue/cheese-board.jpg",
    extraImages: ["/assets/products/catalogue/finger-foods.jpg"],
    updatedAt: "2026-11-09T14:50:00.000Z",
  },
];

export function cloneOperationsProduct(
  product: OperationsProduct,
): OperationsProduct {
  return {
    ...product,
    tags: [...product.tags],
    images: product.images.map((image) => ({ ...image })),
    variants: product.variants.map((variant) => ({ ...variant })),
  };
}

export function createMockOperationsProducts(): OperationsProduct[] {
  return PRODUCT_SEEDS.map((seed) => {
    const images = buildImages(seed.id, seed.image, seed.extraImages);
    const variants = buildVariants(
      seed.id,
      seed.sku,
      seed.priceGhs,
      seed.variantsCount,
      seed.status,
    );
    const primary = images.find((image) => image.isPrimary)?.url ?? seed.image;

    return {
      id: seed.id,
      name: seed.name,
      brand: seed.brand,
      description: seed.description,
      sku: seed.sku,
      category: seed.category,
      ageRestriction: ageForCategory(seed.category),
      tags: tagsFor(seed.category, seed.brand),
      priceGhs: seed.priceGhs,
      variantsCount: variants.length,
      variants,
      status: seed.status,
      images,
      image: primary,
      updatedAt: seed.updatedAt,
    };
  });
}

export const MOCK_OPERATIONS_PRODUCTS: OperationsProduct[] =
  createMockOperationsProducts();

export function primaryImageUrl(
  images: OperationsProductImage[],
  fallback = "",
): string {
  return images.find((image) => image.isPrimary)?.url ?? images[0]?.url ?? fallback;
}

export function ageRestrictionLabel(
  value: OperationsAgeRestriction,
): string {
  switch (value) {
    case "none":
      return "None";
    case "18+":
      return "18+";
    case "21+":
      return "21+";
  }
}

export function formatOperationsPrice(amountGhs: number): string {
  return `GHS ${amountGhs.toLocaleString("en-GH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function formatProductUpdatedAt(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function productStatusLabel(status: OperationsProductStatus): string {
  switch (status) {
    case "published":
      return "Published";
    case "draft":
      return "Draft";
    case "inactive":
      return "Inactive";
  }
}

export function productStatusHint(status: OperationsProductStatus): string {
  switch (status) {
    case "published":
      return "Visible in the customer catalogue";
    case "draft":
      return "Unpublished: not shown to customers";
    case "inactive":
      return "Deactivated: hidden from catalogue";
  }
}
