import { writeFile } from "node:fs/promises";
import path from "node:path";
import sourceFeedsData from "@/data/catalog-sources.json";
import { products as currentProducts } from "@/lib/products";
import type { CategorySlug, Product } from "@/types";

export interface SourceFeed {
  id: string;
  label: string;
  category: CategorySlug;
  url: string;
  password?: string;
  note?: string;
}

export interface SourceSnapshot {
  id: string;
  label: string;
  category: CategorySlug;
  url: string;
  status: number;
  title: string | null;
  description: string | null;
  image: string | null;
  fetchedAt: string;
}

interface AlbumCard {
  id: string;
  title: string;
  url: string;
  coverImage: string | null;
}

interface ImportedProductResult {
  feedId: string;
  importedCount: number;
  products: Product[];
  locked?: boolean;
}

export const sourceFeeds: SourceFeed[] = sourceFeedsData as SourceFeed[];

const categoryLabels: Record<CategorySlug, string> = {
  sunglasses: "Sunglasses",
  "women-clothes": "Designer Women",
  "men-clothes": "Designer Men",
  bags: "Bags",
  shoes: "Shoes",
  jewelry: "Jewelry",
};

const categoryPriceFloor: Record<CategorySlug, number> = {
  sunglasses: 240,
  "women-clothes": 360,
  "men-clothes": 320,
  bags: 540,
  shoes: 280,
  jewelry: 180,
};

const categoryPriceStep: Record<CategorySlug, number> = {
  sunglasses: 18,
  "women-clothes": 26,
  "men-clothes": 22,
  bags: 42,
  shoes: 20,
  jewelry: 16,
};

const categoryMinimumOrderQty: Record<CategorySlug, number> = {
  sunglasses: 6,
  "women-clothes": 5,
  "men-clothes": 5,
  bags: 4,
  shoes: 6,
  jewelry: 8,
};

const categoryAudience: Record<CategorySlug, "women" | "men" | "unisex"> = {
  sunglasses: "unisex",
  "women-clothes": "women",
  "men-clothes": "men",
  bags: "unisex",
  shoes: "unisex",
  jewelry: "unisex",
};

function extractMeta(html: string, property: string) {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const metaMatch = html.match(
    new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["']`, "i")
  );
  return metaMatch?.[1] ?? null;
}

function extractTitle(html: string) {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return titleMatch?.[1]?.trim() ?? null;
}

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function cleanVisibleText(value: string) {
  return normalizeText(
    value
      .replace(/[💰$¥]/g, " ")
      .replace(/\[(?:[^\\\]]|\\.)*\]/g, " ")
      .replace(/(?:实价|配盒|尺码|尺寸|size|标准码|官网|新款|原版|原厂|高端|官方|现货)/gi, " ")
      .replace(/[|/\\]+/g, " ")
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function matchAttribute(tag: string, attribute: string) {
  const match = tag.match(new RegExp(`${attribute}=["']([^"']+)["']`, "i"));
  return match?.[1] ?? null;
}

async function fetchRemoteText(url: string, rendered = false) {
  const targetUrl = rendered ? `https://r.jina.ai/http://${url.replace(/^https?:\/\//i, "")}` : url;
  const response = await fetch(targetUrl, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
    },
    cache: "no-store",
  });

  return response.text();
}

function dedupeProducts(products: Product[]) {
  const seen = new Set<string>();

  return products.filter((product) => {
    const key = `${product.id}:${product.slug}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function estimatePrice(category: CategorySlug, index: number) {
  return categoryPriceFloor[category] + index * categoryPriceStep[category];
}

function estimateWholesalePrice(price: number) {
  return Math.max(60, Math.round(price * 0.56));
}

function estimateMinimumOrderQty(category: CategorySlug) {
  return categoryMinimumOrderQty[category];
}

function extractAlbumCards(html: string, baseUrl: string): AlbumCard[] {
  const tags = html.match(/<a\b[^>]*class=["'][^"']*album3__main[^"']*["'][^>]*>/gi) ?? [];

  return tags
    .map((tag) => {
      const href = matchAttribute(tag, "href");
      const title = matchAttribute(tag, "title");
      const id = matchAttribute(tag, "data-album-id") ?? href?.match(/albums\/(\d+)/)?.[1] ?? null;
      const coverImage = matchAttribute(tag, "data-origin-src") ?? matchAttribute(tag, "data-src");

      if (!href || !title || !id) return null;

      return {
        id,
        title: normalizeText(title),
        url: new URL(href, baseUrl).toString(),
        coverImage,
      };
    })
    .filter((item): item is AlbumCard => item !== null);
}

async function fetchAlbumImages(url: string, fallbackImage: string | null) {
  try {
    const html = await fetchRemoteText(url);
    const matches = [...html.matchAll(/data-(?:origin-)?src=["'](https?:\/\/[^"']+\.(?:jpe?g|png|webp)(?:\?[^"']*)?)["']/gi)];
    const images = matches.map((match) => match[1]).filter(Boolean);

    if (images.length > 0) {
      return Array.from(new Set(images));
    }
  } catch {
    // Fall back to the cover image when the album page is unavailable.
  }

  return fallbackImage ? [fallbackImage] : [];
}

function inferBrandFromText(text: string, fallback: string) {
  const cleaned = cleanVisibleText(text);
  const candidate = cleaned
    .replace(/^P\d+\s*/i, "")
    .replace(/\b(?:实价|配盒|尺寸|size|标准码|官网|新款|原版|原厂|高端|官方|现货)\b/gi, " ")
    .trim();

  const tokens = candidate.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return fallback;

  const compact = tokens.slice(0, 3).join(" ").trim();
  return compact.length > 2 ? compact : fallback;
}

function extractPriceFromText(text: string) {
  const matches = [
    ...text.matchAll(/(?:💰|\$|¥|RMB\s*)\s*([0-9]+(?:\.[0-9]+)?)/gi),
    ...text.matchAll(/P\s*([0-9]+(?:\.[0-9]+)?)/gi),
  ];

  const raw = matches[0]?.[1];
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function extractRenderParagraphs(markdown: string) {
  return markdown
    .split(/\n{2,}/)
    .map((segment) => segment.replace(/\r/g, "").trim())
    .filter(Boolean);
}

interface RenderedBlock {
  images: string[];
  text: string[];
}

function parseRenderedMarkdownBlocks(markdown: string) {
  const paragraphs = extractRenderParagraphs(markdown);
  const blocks: RenderedBlock[] = [];
  let current: RenderedBlock | null = null;

  const flush = () => {
    if (!current || (current.images.length === 0 && current.text.length === 0)) return;
    blocks.push(current);
    current = null;
  };

  for (const paragraph of paragraphs) {
    const imageUrls = [...paragraph.matchAll(/!\[[^\]]*\]\((https?:\/\/[^)]+)\)/g)].map((match) => match[1]);
    const text = cleanVisibleText(paragraph.replace(/!\[[^\]]*\]\((https?:\/\/[^)]+)\)/g, " "));
    const hasPrice = /(?:💰|\$|¥|P\s*\d)/i.test(paragraph);

    if (imageUrls.length > 0) {
      if (current && current.images.length > 0 && current.text.length > 0 && hasPrice === false) {
        // Continue the same block while the source is still stacking images for one post.
      } else if (current && current.images.length > 0 && current.text.length > 0 && hasPrice) {
        flush();
      }

      if (!current) {
        current = { images: [], text: [] };
      }

      current.images.push(...imageUrls);
      if (text) current.text.push(text);
      if (hasPrice) flush();
      continue;
    }

    if (!current) {
      current = { images: [], text: [] };
    }

    if (text) {
      current.text.push(text);
    }

    if (hasPrice) {
      flush();
    }
  }

  flush();
  return blocks.filter((block) => block.images.length > 0 || block.text.length > 0);
}

function buildProductFromBlock(
  feed: SourceFeed,
  block: RenderedBlock,
  index: number,
  sourceUrl: string
): Product {
  const text = block.text.join(" ");
  const price = extractPriceFromText(text) ?? estimatePrice(feed.category, index);
  const name = (() => {
    const cleaned = cleanVisibleText(text);
    const firstStrongPhrase = cleaned
      .split(/[.!?。！？]/)
      .map((part) => part.trim())
      .find((part) => part.length > 6) ?? cleaned.slice(0, 60);
    return firstStrongPhrase || `${feed.label} ${index + 1}`;
  })();
  const brand = inferBrandFromText(name, feed.label);
  const categoryLabel = categoryLabels[feed.category];
  const description = text
    ? `${name}. ${text}`
    : `${name} sourced from ${feed.label}. Built as a public catalog page for retail browsing, wholesale inquiry, and social sharing.`;
  const imageFallback = "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&q=90";

  return {
    id: `${feed.id}-${slugify(name) || index + 1}`,
    name,
    slug: `${slugify(name) || feed.id}-${feed.id}-${index + 1}`,
    brand,
    category: feed.category,
    categoryLabel,
    description,
    shortDescription: text ? cleanVisibleText(text).slice(0, 180) : `Imported from ${feed.label} source catalog.`,
    price,
    wholesalePrice: estimateWholesalePrice(price),
    minimumOrderQty: estimateMinimumOrderQty(feed.category),
    images: block.images.length > 0 ? block.images : [imageFallback],
    colors: [{ name: "Default", hex: "#1a1a1a" }],
    features: [
      "Imported from the provided source catalog",
      "Public product page with social sharing",
      feed.note ?? "Trade-ready edit",
    ],
    materials: ["See source album"],
    origin: feed.label,
    audience: categoryAudience[feed.category],
    inStock: true,
    isNew: index < 2,
    isBestseller: index === 0,
    highlight: feed.note ?? `Imported from ${feed.label}`,
    source: {
      label: feed.label,
      url: sourceUrl,
      note: feed.note,
    },
    shareText: `${name} by ${feed.label}`,
    seo: {
      title: `${name} | ${feed.label}`,
      description,
      keywords: [feed.label, categoryLabel, name, "luxury catalog"],
    },
  };
}

async function fetchImportedProducts(feed: SourceFeed): Promise<ImportedProductResult> {
  try {
    const host = new URL(feed.url).hostname;

    if (host.includes("wsxc.cn") || host.includes("szwego.com")) {
      const markdown = await fetchRemoteText(feed.url, true);
      const blocks = parseRenderedMarkdownBlocks(markdown).slice(0, 24);
      const products = blocks.map((block, index) => buildProductFromBlock(feed, block, index, feed.url));

      return {
        feedId: feed.id,
        importedCount: products.length,
        products,
      };
    }

    const html = await fetchRemoteText(feed.url);
    const albumCards = extractAlbumCards(html, feed.url);

    if (albumCards.length === 0 && /password|encrypted|加密/i.test(html)) {
      return {
        feedId: feed.id,
        importedCount: 0,
        products: [],
        locked: true,
      };
    }

    const importedAlbums = await Promise.all(
      albumCards.map(async (album, index) => {
        const images = await fetchAlbumImages(album.url, album.coverImage);
        const name = normalizeText(album.title || `${feed.label} ${index + 1}`);
        const slug = `${slugify(name) || feed.id}-${feed.id}-${album.id}`;
        const price = estimatePrice(feed.category, index);
        const categoryLabel = categoryLabels[feed.category];
        const brand = inferBrandFromText(name, feed.label);
        const description = `${name} sourced from ${feed.label}. Built as a public catalog page for retail browsing, wholesale inquiry, and social sharing.`;
        const sourceImage = images[0] ?? "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&q=90";

        return {
          id: `${feed.id}-${album.id}`,
          name,
          slug,
          brand,
          category: feed.category,
          categoryLabel,
          description,
          shortDescription: `Imported from ${feed.label} source catalog.`,
          price,
          wholesalePrice: estimateWholesalePrice(price),
          minimumOrderQty: estimateMinimumOrderQty(feed.category),
          images: images.length > 0 ? images : [sourceImage],
          colors: [{ name: "Default", hex: "#1a1a1a" }],
          features: [
            "Imported from the provided source catalog",
            "Public product page with social sharing",
            feed.note ?? "Trade-ready edit",
          ],
          materials: ["See source album"],
          origin: feed.label,
          audience: categoryAudience[feed.category],
          inStock: true,
          isNew: index < 2,
          isBestseller: index === 0,
          highlight: feed.note ?? `Imported from ${feed.label}`,
          source: {
            label: feed.label,
            url: album.url,
            note: feed.note,
          },
          shareText: `${name} by ${feed.label}`,
          seo: {
            title: `${name} | ${feed.label}`,
            description,
            keywords: [feed.label, categoryLabel, name, "luxury catalog"],
          },
        } satisfies Product;
      })
    );

    return {
      feedId: feed.id,
      importedCount: importedAlbums.length,
      products: importedAlbums,
    };
  } catch {
    return {
      feedId: feed.id,
      importedCount: 0,
      products: [],
    };
  }
}

function serializeCatalogModule(catalog: Product[]) {
  return `import type { Product } from "@/types";\n\nexport const products: Product[] = ${JSON.stringify(catalog, null, 2)};\n`;
}

async function writeCatalogProducts(products: Product[]) {
  const filePath = path.join(process.cwd(), "data", "catalog-products.ts");
  await writeFile(filePath, serializeCatalogModule(products), "utf8");
  return filePath;
}

export async function fetchSourceSnapshot(feed: SourceFeed): Promise<SourceSnapshot> {
  try {
    const response = await fetch(feed.url, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
      },
      cache: "no-store",
    });

    const html = await response.text();

    return {
      id: feed.id,
      label: feed.label,
      category: feed.category,
      url: feed.url,
      status: response.status,
      title: extractTitle(html),
      description: extractMeta(html, "description"),
      image: extractMeta(html, "og:image"),
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return {
      id: feed.id,
      label: feed.label,
      category: feed.category,
      url: feed.url,
      status: 0,
      title: null,
      description: null,
      image: null,
      fetchedAt: new Date().toISOString(),
    };
  }
}

export async function refreshCatalogSnapshots() {
  const snapshots = await Promise.all(sourceFeeds.map((feed) => fetchSourceSnapshot(feed)));
  return {
    refreshedAt: new Date().toISOString(),
    count: snapshots.length,
    snapshots,
  };
}

export async function refreshCatalogProducts() {
  const [snapshots, importedResults] = await Promise.all([
    Promise.all(sourceFeeds.map((feed) => fetchSourceSnapshot(feed))),
    Promise.all(sourceFeeds.map((feed) => fetchImportedProducts(feed))),
  ]);

  const importedProducts = importedResults.flatMap((result) => result.products);
  const lockedFeeds = importedResults.filter((result) => result.locked).map((result) => result.feedId);
  const mergedProducts = dedupeProducts([...importedProducts, ...currentProducts]);
  const writtenPath = await writeCatalogProducts(mergedProducts);

  return {
    refreshedAt: new Date().toISOString(),
    count: snapshots.length,
    snapshots,
    importedCount: importedProducts.length,
    writtenCount: mergedProducts.length,
    writtenPath,
    lockedFeeds,
  };
}
