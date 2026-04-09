import type { CategoryInfo, CategorySlug, Product, ViewMode } from "@/types";
import { products as rawProducts } from "@/data/catalog-products";

const categoryLabels: Record<CategorySlug, string> = {
  sunglasses: "Eyewear",
  "women-clothes": "Women",
  "men-clothes": "Men",
  bags: "Bags",
  shoes: "Shoes",
  jewelry: "Jewelry",
};

const baseCategories: Omit<CategoryInfo, "productCount">[] = [
  {
    id: "sunglasses",
    name: "Eyewear",
    description: "High-contrast frames, polished silhouettes, and seasonal edit drops.",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1200&q=90",
    accent: "from-stone-950/85 via-stone-950/35 to-transparent",
  },
  {
    id: "women-clothes",
    name: "Women",
    description: "Tailored separates, elevated knitwear, and evening layers.",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200&q=90",
    accent: "from-neutral-950/80 via-neutral-950/30 to-transparent",
  },
  {
    id: "men-clothes",
    name: "Men",
    description: "Refined shirts, jackets, and directional staples for everyday dressing.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=90",
    accent: "from-zinc-950/80 via-zinc-950/25 to-transparent",
  },
  {
    id: "bags",
    name: "Bags",
    description: "Structured carryalls, compact top handles, and soft-shoulder profiles.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=90",
    accent: "from-stone-950/80 via-stone-950/30 to-transparent",
  },
  {
    id: "shoes",
    name: "Shoes",
    description: "Elegant heels, modern sneakers, and polished footwear for every edit.",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1200&q=90",
    accent: "from-neutral-950/80 via-neutral-950/25 to-transparent",
  },
  {
    id: "jewelry",
    name: "Jewelry",
    description: "Minimal chains, bright metals, and polished finishing touches.",
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1200&q=90",
    accent: "from-stone-950/85 via-stone-950/30 to-transparent",
  },
];

const categoryCounts = rawProducts.reduce<Record<CategorySlug, number>>(
  (counts, product) => {
    counts[product.category] = (counts[product.category] ?? 0) + 1;
    return counts;
  },
  {
    sunglasses: 0,
    "women-clothes": 0,
    "men-clothes": 0,
    bags: 0,
    shoes: 0,
    jewelry: 0,
  }
);

export const categories: CategoryInfo[] = baseCategories.map((category) => ({
  ...category,
  productCount: categoryCounts[category.id],
}));

export const products: Product[] = rawProducts.map((product) => ({
  ...product,
  categoryLabel: categoryLabels[product.category],
}));

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getProductsByCategory(category: CategorySlug): Product[] {
  return products.filter((product) => product.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.isBestseller).slice(0, 4);
}

export function getNewProducts(): Product[] {
  return products.filter((product) => product.isNew).slice(0, 4);
}

export function getTradeSelections(): Product[] {
  return products
    .filter((product) => typeof product.wholesalePrice === "number")
    .slice(0, 6);
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.trim().toLowerCase();

  if (!lowerQuery) return [];

  return products.filter((product) => {
    const haystack = [
      product.name,
      product.brand,
      product.categoryLabel,
      product.description,
      product.shortDescription,
      product.materials?.join(" "),
      product.origin,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(lowerQuery);
  });
}

export function getRelatedProducts(productId: string, category: CategorySlug): Product[] {
  return products
    .filter((product) => product.category === category && product.id !== productId)
    .slice(0, 4);
}

export function getProductsForView(mode: ViewMode) {
  return mode === "trade"
    ? products.filter((product) => typeof product.wholesalePrice === "number")
    : products;
}
