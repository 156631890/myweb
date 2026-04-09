/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

const PROJECT_ROOT = "C:\\Users\\Administrator\\worktrees\\luxury-sunglasses-store\\mytheresa-redesign";
const DATA_FILE = path.join(PROJECT_ROOT, "data", "catalog-products.ts");
const PRICE_SCALE = 100;

function cleanText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function normalizeHeading(value) {
  return cleanText(value).replace(/[^a-z0-9]+/gi, " ").trim().toUpperCase();
}

function splitLines(value) {
  return String(value ?? "")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => cleanText(line))
    .filter(Boolean);
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  return [value];
}

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

function resolveBrowserWebSocketUrl() {
  const explicitUrl = process.env.MYTHERESA_BROWSER_WS_URL || process.env.CHROME_DEVTOOLS_WS_URL;
  if (explicitUrl) return explicitUrl;

  const activePortPath = process.env.CHROME_DEVTOOLS_ACTIVE_PORT
    ? path.resolve(process.env.CHROME_DEVTOOLS_ACTIVE_PORT)
    : path.join(process.env.LOCALAPPDATA || "", "Google", "Chrome", "User Data", "DevToolsActivePort");

  const raw = fs.readFileSync(activePortPath, "utf8");
  const [portLine, browserPathLine] = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!portLine || !browserPathLine) {
    throw new Error("Unable to resolve the live Chrome DevTools websocket endpoint.");
  }

  return `ws://127.0.0.1:${portLine}${browserPathLine}`;
}

function createBrowserClient() {
  const browserWebSocketUrl = resolveBrowserWebSocketUrl();
  const ws = new WebSocket(browserWebSocketUrl);
  const pending = new Map();
  let nextId = 1;

  function send(method, params = {}, sessionId) {
    return new Promise((resolve, reject) => {
      const id = nextId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    });
  }

  const ready = new Promise((resolve, reject) => {
    ws.once("open", () => resolve({ send, close: () => ws.close() }));
    ws.once("error", reject);
  });

  ws.on("message", (data) => {
    const message = JSON.parse(data.toString());
    if (typeof message.id !== "number") return;
    const call = pending.get(message.id);
    if (!call) return;
    pending.delete(message.id);
    if (message.error) {
      call.reject(new Error(message.error.message || "CDP request failed"));
      return;
    }
    call.resolve(message);
  });

  ws.on("close", () => {
    for (const call of pending.values()) {
      call.reject(new Error("Chrome DevTools websocket closed."));
    }
    pending.clear();
  });

  return ready;
}

async function collectDetailPayload(browser, sessionId, url) {
  await browser.send("Page.navigate", { url }, sessionId);

  let lastTitle = "";
  let stableCount = 0;

  for (let attempt = 0; attempt < 16; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const state = await browser.send(
      "Runtime.evaluate",
      {
        expression: `JSON.stringify({
          title: document.title || "",
          bodyReady: Boolean(document.body && document.body.innerText && document.body.innerText.length > 1000),
          detailsReady: Boolean(Array.from(document.querySelectorAll("script[type='application/ld+json']")).some((script) => {
            try {
              const parsed = JSON.parse(script.textContent || "null");
              const items = Array.isArray(parsed) ? parsed : [parsed];
              return items.some((item) => item && (item["@type"] === "Product" || (Array.isArray(item["@type"]) && item["@type"].includes("Product"))));
            } catch {
              return false;
            }
          }))
        })`,
        returnByValue: true,
      },
      sessionId
    );

    const payload = state.result.result.value ? JSON.parse(state.result.result.value) : {};
    const title = typeof payload.title === "string" ? payload.title : "";
    if (title && title === lastTitle) stableCount += 1;
    else stableCount = 0;
    lastTitle = title;

    if (payload.detailsReady && payload.bodyReady && stableCount >= 1) {
      break;
    }
  }

  const result = await browser.send(
    "Runtime.evaluate",
    {
      expression: `(() => {
        const clean = (value) => String(value ?? "").replace(/\\s+/g, " ").trim();
        const headingKey = (value) => clean(value).replace(/[^a-z0-9]+/gi, " ").trim().toUpperCase();
        const lines = clean(document.body?.innerText || "")
          .split("\\n")
          .map((line) => line.trim())
          .filter(Boolean);

        const findHeadingIndex = (heading) => {
          const target = headingKey(heading);
          return lines.findIndex((line) => headingKey(line) === target);
        };

        const extractSection = (startHeading, endHeadings = []) => {
          const startIndex = findHeadingIndex(startHeading);
          if (startIndex < 0) return [];
          const endIndexCandidates = endHeadings
            .map((heading) => findHeadingIndex(heading))
            .filter((index) => index > startIndex);
          const endIndex = endIndexCandidates.length > 0 ? Math.min(...endIndexCandidates) : lines.length;
          return lines.slice(startIndex + 1, endIndex);
        };

        const parseJsonLd = () => {
          const scripts = Array.from(document.querySelectorAll("script[type='application/ld+json']"));
          for (const script of scripts) {
            try {
              const parsed = JSON.parse(script.textContent || "null");
              const items = Array.isArray(parsed) ? parsed : [parsed];
              const product = items.find((item) => item && (item["@type"] === "Product" || (Array.isArray(item["@type"]) && item["@type"].includes("Product"))));
              if (product) return product;
            } catch {
              // Ignore malformed JSON-LD blocks.
            }
          }
          return null;
        };

        return {
          title: document.title || null,
          h1: document.querySelector("h1")?.textContent?.trim() || null,
          metaDescription: document.querySelector("meta[name='description']")?.content || null,
          productLd: parseJsonLd(),
          sections: {
            productDetails: extractSection("PRODUCT DETAILS", ["SIZE & FIT", "DELIVERY & FREE RETURNS", "SEE MORE FROM", "STYLE WITH", "YOU MAY ALSO LIKE"]),
            sizeAndFit: extractSection("SIZE & FIT", ["DELIVERY & FREE RETURNS", "SEE MORE FROM", "STYLE WITH", "YOU MAY ALSO LIKE"]),
            delivery: extractSection("DELIVERY & FREE RETURNS", ["SEE MORE FROM", "STYLE WITH", "YOU MAY ALSO LIKE"]),
          },
        };
      })()`,
      returnByValue: true,
    },
    sessionId
  );

  return result.result.result.value || {};
}

function splitCsvList(value) {
  return cleanText(value)
    .split(/\s*,\s*/)
    .map((item) => cleanText(item))
    .filter(Boolean);
}

function extractDetailFields(detail, currentProduct) {
  const productLd = detail.productLd || {};
  const sections = detail.sections || {};
  const productDetailLines = splitLines(Array.isArray(sections.productDetails) ? sections.productDetails.join("\n") : sections.productDetails);
  const sizeAndFitLines = splitLines(Array.isArray(sections.sizeAndFit) ? sections.sizeAndFit.join("\n") : sections.sizeAndFit);
  const deliveryLines = splitLines(Array.isArray(sections.delivery) ? sections.delivery.join("\n") : sections.delivery);

  const attributeStartIndex = productDetailLines.findIndex((line) =>
    /^(Material|Made in|Stone|Color|Item number|Manufacturer Details)\b/i.test(line)
  );

  const storyLines =
    attributeStartIndex > 0 ? productDetailLines.slice(0, attributeStartIndex) : productDetailLines.slice(0, 1);
  const attributeLines = attributeStartIndex >= 0 ? productDetailLines.slice(attributeStartIndex) : [];
  const story = cleanText(
    storyLines.length > 0
      ? storyLines.join(" ")
      : cleanText(productLd.description || currentProduct.description || "")
  );

  const title = cleanText(detail.title || "");
  const pageTitle = title || currentProduct.seo.title || currentProduct.name;
  const name = cleanText(productLd.name || detail.h1 || currentProduct.name);
  const brand = cleanText(productLd.brand?.name || currentProduct.brand);
  const sku = cleanText(productLd.sku || "");
  const rawPrice = Number(productLd?.offers?.PriceSpecification?.price);
  const price = Number.isFinite(rawPrice) && rawPrice > 0 ? Number((rawPrice / PRICE_SCALE).toFixed(2)) : currentProduct.price;
  const productImages = unique([
    ...toArray(productLd.image).flatMap((image) => (typeof image === "string" ? [image] : [])),
    ...currentProduct.images,
  ]);
  const sizeValues = unique(
    toArray(productLd.size).map((size) => cleanText(size)).filter(Boolean)
  );

  const materialLines = attributeLines.filter((line) => /^Material:/i.test(line));
  const stoneLines = attributeLines.filter((line) => /^Stone\b/i.test(line));
  const originLine = attributeLines.find((line) => /^Made in\b/i.test(line));
  const itemNumberLine = attributeLines.find((line) => /^Item number:/i.test(line));
  const manufacturerIndex = productDetailLines.findIndex((line) => normalizeHeading(line) === "MANUFACTURER DETAILS");
  const manufacturerDetails =
    manufacturerIndex >= 0
      ? cleanText(productDetailLines.slice(manufacturerIndex + 1).filter((line) => !/^SIZE & FIT$/i.test(line)).join(" "))
      : "";
  const sizeAndFitText = cleanText(sizeAndFitLines.join(" "));
  const deliveryText = cleanText(deliveryLines.join(" "));
  const fitText =
    sizeAndFitText ||
    (sizeValues.length > 0 ? `Available sizes: ${sizeValues.join(", ")}` : "") ||
    currentProduct.fit ||
    "";

  const materials = unique([
    ...materialLines.flatMap((line) => splitCsvList(line.replace(/^Material:\s*/i, ""))),
    ...stoneLines.map((line) => cleanText(line.replace(/^Stone[^:]*:\s*/i, "Stone: "))),
  ]);

  const details = unique([
    ...materialLines,
    ...stoneLines,
    originLine,
    itemNumberLine,
    fitText ? `Size & fit: ${fitText}` : "",
    deliveryText ? `Delivery: ${deliveryText.slice(0, 180)}` : "",
  ]);

  return {
    pageTitle,
    name,
    brand,
    description: story || cleanText(productLd.description || currentProduct.description),
    shortDescription: story || cleanText(productLd.description || currentProduct.shortDescription || currentProduct.description).slice(0, 180),
    price,
    images: productImages.length > 0 ? productImages : currentProduct.images,
    sizes: sizeValues.length > 0 ? sizeValues : currentProduct.sizes,
    materials: materials.length > 0 ? materials : currentProduct.materials,
    origin: originLine ? cleanText(originLine.replace(/^Made in\s*/i, "")) : currentProduct.origin,
    fit: fitText || currentProduct.fit,
    itemNumber: itemNumberLine ? cleanText(itemNumberLine.replace(/^Item number:\s*/i, "")) : currentProduct.itemNumber,
    manufacturerDetails: manufacturerDetails || currentProduct.manufacturerDetails,
    productDetails: story || currentProduct.productDetails,
    features: unique([
      ...(currentProduct.features || []),
      ...details,
      "Captured from authenticated Mytheresa product detail page",
    ]),
    source: {
      ...currentProduct.source,
      note: unique([currentProduct.source?.note, "Captured through authenticated browser detail session"]).join(" | "),
    },
    shareText: `${brand} ${name} | Mytheresa`,
    seo: {
      title: pageTitle,
      description: cleanText(productLd.description || story || currentProduct.seo.description),
      keywords: unique([
        brand,
        name,
        currentProduct.categoryLabel,
        "Mytheresa",
        currentProduct.category,
        sku,
      ]),
    },
  };
}

function mergeDetailIntoProduct(product, detail) {
  return {
    ...product,
    ...detail,
    id: product.id,
    slug: product.slug,
    category: product.category,
    categoryLabel: product.categoryLabel,
    audience: product.audience,
    wholesalePrice: product.wholesalePrice,
    minimumOrderQty: product.minimumOrderQty,
    inStock: product.inStock,
    isNew: product.isNew,
    isBestseller: product.isBestseller,
    highlight: product.highlight,
    comparePrice: product.comparePrice,
    colors: product.colors,
  };
}

(async () => {
  const sourceText = fs.readFileSync(DATA_FILE, "utf8");
  const currentProducts = parseCatalogModule(sourceText);
  const mytheresaProducts = currentProducts.filter((product) =>
    /mytheresa\.com/i.test(String(product?.source?.url || "")) || String(product?.source?.label || "").toLowerCase() === "mytheresa"
  );
  const limit = Number(process.env.MYTHERESA_LIMIT || "");
  const pendingProducts = mytheresaProducts.filter((product) => !product.pageTitle || !product.productDetails);
  const targetsBase = Number.isFinite(limit) && limit > 0 ? pendingProducts.slice(0, limit) : pendingProducts;
  const batchSize = Math.max(1, Number(process.env.MYTHERESA_BATCH_SIZE || "25"));

  if (targetsBase.length === 0) {
    console.log("No pending Mytheresa products found in data/catalog-products.ts");
    return;
  }

  const updatedById = new Map();
  let successCount = 0;
  let failureCount = 0;

  async function processBatch(batch, batchNumber) {
    const browser = await createBrowserClient();
    let sessionId = "";
    let targetId = "";

    try {
      const created = await browser.send("Target.createTarget", { url: "about:blank" });
      targetId = created.result.targetId;
      const attached = await browser.send("Target.attachToTarget", {
        targetId,
        flatten: true,
      });
      sessionId = attached.result.sessionId;

      await browser.send("Page.enable", {}, sessionId);
      await browser.send("Runtime.enable", {}, sessionId);
      await browser.send("Network.enable", {}, sessionId);

      for (const [index, product] of batch.entries()) {
        try {
          const detail = await collectDetailPayload(browser, sessionId, product.source.url);
          const merged = mergeDetailIntoProduct(product, extractDetailFields(detail, product));
          updatedById.set(product.id, merged);
          successCount += 1;
          console.log(`[batch ${batchNumber}] ${index + 1}/${batch.length} enriched ${product.brand} / ${product.name}`);
        } catch (error) {
          failureCount += 1;
          console.warn(
            `[batch ${batchNumber}] ${index + 1}/${batch.length} failed ${product.brand} / ${product.name}:`,
            error instanceof Error ? error.message : String(error)
          );
        }
      }
    } finally {
      try {
        if (targetId) {
          await browser.send("Target.closeTarget", { targetId }).catch(() => {});
        }
      } catch {
        // Ignore close errors.
      }
      browser.close();
    }
  }

  for (let offset = 0; offset < targetsBase.length; offset += batchSize) {
    const batch = targetsBase.slice(offset, offset + batchSize);
    await processBatch(batch, Math.floor(offset / batchSize) + 1);

    const mergedCatalog = currentProducts.map((product) => updatedById.get(product.id) || product);
    fs.writeFileSync(DATA_FILE, serializeCatalogModule(mergedCatalog), "utf8");
    console.log(
      JSON.stringify(
        {
          savedAfterBatch: Math.floor(offset / batchSize) + 1,
          totalProducts: currentProducts.length,
          mytheresaProducts: mytheresaProducts.length,
          enrichedCount: successCount,
          failedCount: failureCount,
          pendingCount: targetsBase.length - (offset + batch.length),
          writtenPath: DATA_FILE,
        },
        null,
        2
      )
    );
  }

  const mergedCatalog = currentProducts.map((product) => updatedById.get(product.id) || product);
  fs.writeFileSync(DATA_FILE, serializeCatalogModule(mergedCatalog), "utf8");
  console.log(
    JSON.stringify(
      {
        totalProducts: currentProducts.length,
        mytheresaProducts: mytheresaProducts.length,
        enrichedCount: successCount,
        failedCount: failureCount,
        writtenPath: DATA_FILE,
      },
      null,
      2
    )
  );
  process.exit(0);
})().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exit(1);
});
