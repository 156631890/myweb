/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = "C:\\Users\\Administrator\\worktrees\\luxury-sunglasses-store\\mytheresa-redesign";
const DATA_FILE = path.join(PROJECT_ROOT, "data", "catalog-products.ts");
const PRICE_SCALE = 100;

function parseCatalogModule(sourceText) {
  const match = sourceText.match(/export const products: Product\[] = ([\s\S]*);\s*$/);
  if (!match) {
    throw new Error("Unable to parse data/catalog-products.ts");
  }
  return JSON.parse(match[1]);
}

function serializeCatalogModule(catalog) {
  return `import type { Product } from "@/types";\n\nexport const products: Product[] = ${JSON.stringify(catalog, null, 2)};\n`;
}

function scalePriceValue(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return value;
  }

  return Number((value / PRICE_SCALE).toFixed(2));
}

function scaleProduct(product) {
  return {
    ...product,
    price: scalePriceValue(product.price),
    comparePrice: scalePriceValue(product.comparePrice),
    wholesalePrice: scalePriceValue(product.wholesalePrice),
  };
}

const sourceText = fs.readFileSync(DATA_FILE, "utf8");
const products = parseCatalogModule(sourceText);
const scaled = products.map(scaleProduct);

fs.writeFileSync(DATA_FILE, serializeCatalogModule(scaled), "utf8");
console.log(JSON.stringify({ writtenCount: scaled.length, writtenPath: DATA_FILE }, null, 2));
