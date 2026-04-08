/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const PROJECT_ROOT = 'C:\\Users\\Administrator\\worktrees\\luxury-sunglasses-store\\mytheresa-redesign';
const DATA_FILE = path.join(PROJECT_ROOT, 'data', 'catalog-products.ts');
const SOURCE_URLS = [
  {
    url: 'https://www.mytheresa.com/us/en/women/new-arrivals/current-week',
    category: 'women-clothes',
    label: 'Mytheresa',
  },
  {
    url: 'https://www.mytheresa.com/us/en/women/bags',
    category: 'bags',
    label: 'Mytheresa',
  },
  {
    url: 'https://www.mytheresa.com/us/en/women/shoes',
    category: 'shoes',
    label: 'Mytheresa',
  },
  {
    url: 'https://www.mytheresa.com/us/en/women/jewelry',
    category: 'jewelry',
    label: 'Mytheresa',
  },
  {
    url: 'https://www.mytheresa.com/us/en/men/new-arrivals/current-week',
    category: 'men-clothes',
    label: 'Mytheresa',
  },
];

const categoryLabels = {
  sunglasses: 'Sunglasses',
  'women-clothes': 'Designer Women',
  'men-clothes': 'Designer Men',
  bags: 'Bags',
  shoes: 'Shoes',
  jewelry: 'Jewelry',
};

const categoryAudience = {
  sunglasses: 'unisex',
  'women-clothes': 'women',
  'men-clothes': 'men',
  bags: 'unisex',
  shoes: 'unisex',
  jewelry: 'unisex',
};

const priceFloor = {
  sunglasses: 240,
  'women-clothes': 360,
  'men-clothes': 320,
  bags: 540,
  shoes: 280,
  jewelry: 180,
};

const priceStep = {
  sunglasses: 18,
  'women-clothes': 26,
  'men-clothes': 22,
  bags: 42,
  shoes: 20,
  jewelry: 16,
};

const minimumOrderQty = {
  sunglasses: 6,
  'women-clothes': 5,
  'men-clothes': 5,
  bags: 4,
  shoes: 6,
  jewelry: 8,
};

function slugify(value) {
  return String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function cleanText(value) {
  return String(value).replace(/\s+/g, ' ').trim();
}

function estimatePrice(category, index) {
  return priceFloor[category] + index * priceStep[category];
}

function estimateWholesalePrice(price) {
  return Math.max(60, Math.round(price * 0.56));
}

function inferCategory(sourceCategory, href, name) {
  const text = `${href} ${name}`.toLowerCase();
  if (/sunglass|eyewear/.test(text)) return 'sunglasses';
  if (/bag|shopper|clutch|tote|pouch|wallet|satchel|bucket bag|shoulder bag|crossbody/.test(text)) return 'bags';
  if (/shoe|sandal|pump|boot|loafer|slide|mule|espadrille|sneaker|thong|wedge/.test(text)) return 'shoes';
  if (/ring|bracelet|necklace|earring|bangle|jewelry|jewellery/.test(text)) return 'jewelry';
  if (/shirt|dress|gown|jacket|coat|pants|trousers|skirt|blouse|jeans|top|sweater|cardigan|blazer|shorts/.test(text)) return sourceCategory;
  return sourceCategory;
}

function parsePrice(priceText, category, index) {
  const match = String(priceText).match(/(?:US)?\$\s*([0-9][0-9,]*(?:\.[0-9]+)?)/i);
  if (match?.[1]) {
    const parsed = Number(match[1].replace(/,/g, ''));
    if (Number.isFinite(parsed)) return parsed;
  }
  return estimatePrice(category, index);
}

function normalizeNameFromSlug(slugPart) {
  return cleanText(slugPart)
    .replace(/-p\d+$/i, '')
    .replace(/-/g, ' ')
    .replace(/\b([a-z])/g, (m) => m.toUpperCase());
}

function resolveBrowserWebSocketUrl() {
  const explicitUrl = process.env.MYTHERESA_BROWSER_WS_URL || process.env.CHROME_DEVTOOLS_WS_URL;
  if (explicitUrl) return explicitUrl;

  const activePortPath = process.env.CHROME_DEVTOOLS_ACTIVE_PORT
    ? path.resolve(process.env.CHROME_DEVTOOLS_ACTIVE_PORT)
    : path.join(process.env.LOCALAPPDATA || '', 'Google', 'Chrome', 'User Data', 'DevToolsActivePort');

  const raw = fs.readFileSync(activePortPath, 'utf8');
  const [portLine, browserPathLine] = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!portLine || !browserPathLine) {
    throw new Error('Unable to resolve the live Chrome DevTools websocket endpoint.');
  }

  return `ws://127.0.0.1:${portLine}${browserPathLine}`;
}

function createBrowserClient() {
  const ws = new WebSocket(resolveBrowserWebSocketUrl());
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
    ws.once('open', () => resolve({ send, close: () => ws.close() }));
    ws.once('error', reject);
  });

  ws.on('message', (data) => {
    const message = JSON.parse(data.toString());
    if (typeof message.id !== 'number') return;
    const call = pending.get(message.id);
    if (!call) return;
    pending.delete(message.id);
    if (message.error) {
      call.reject(new Error(message.error.message || 'CDP request failed'));
      return;
    }
    call.resolve(message);
  });

  ws.on('close', () => {
    for (const call of pending.values()) {
      call.reject(new Error('Chrome DevTools websocket closed.'));
    }
    pending.clear();
  });

  return ready;
}

async function scrapeCards(url) {
  const browser = await createBrowserClient();
  try {
    const created = await browser.send('Target.createTarget', { url: 'about:blank' });
    const attached = await browser.send('Target.attachToTarget', {
      targetId: created.result.targetId,
      flatten: true,
    });
    const sessionId = attached.result.sessionId;

    await browser.send('Page.enable', {}, sessionId);
    await browser.send('Runtime.enable', {}, sessionId);
    await browser.send('Network.enable', {}, sessionId);
    await browser.send('Page.navigate', { url }, sessionId);

    let lastCount = 0;
    let stableCount = 0;
    for (let attempt = 0; attempt < 12; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const state = await browser.send(
        'Runtime.evaluate',
        {
          expression: "JSON.stringify({ count: document.querySelectorAll('.item').length, title: document.title, href: location.href })",
          returnByValue: true,
        },
        sessionId
      );
      const payload = state.result.result.value ? JSON.parse(state.result.result.value) : null;
      const count = typeof payload?.count === 'number' ? payload.count : 0;
      if (count > 0 && count === lastCount) stableCount += 1;
      else stableCount = 0;
      lastCount = count;
      if (count >= 24 || stableCount >= 2) break;
    }

    const cards = await browser.send(
      'Runtime.evaluate',
      {
        expression: `(() => Array.from(document.querySelectorAll('.item')).map((card) => {
          const link = card.querySelector('a.item__link');
          const brand = card.querySelector('.item__info__header__designer')?.textContent?.trim() || '';
          const name = card.querySelector('.item__info__name a')?.textContent?.trim() || link?.querySelector('img')?.alt?.split('|')?.[0]?.trim() || '';
          const priceText = card.querySelector('.pricing__prices__price')?.textContent?.replace(/\\s+/g, ' ').trim() || '';
          const images = Array.from(card.querySelectorAll('.item__images img')).map((img) => img.src).filter(Boolean);
          const labels = Array.from(card.querySelectorAll('.labels__label')).map((label) => label.textContent?.trim()).filter(Boolean);
          const sizes = Array.from(card.querySelectorAll('.item__sizes__size')).map((size) => size.textContent?.replace(/\\s+/g, ' ').trim()).filter(Boolean);
          return { href: link?.href || '', brand, name, priceText, image: images[0] || '', secondaryImage: images[1] || '', labels, sizes };
        }))()`,
        returnByValue: true,
      },
      sessionId
    );

    return cards.result.result.value || [];
  } finally {
    browser.close();
  }
}

function cardToProduct(card, sourceCategory, index) {
  const slugPart = card.href.split('/').pop() || `mytheresa-${index + 1}`;
  const brand = cleanText(card.brand || 'Mytheresa');
  const name = cleanText(card.name || normalizeNameFromSlug(slugPart));
  const category = inferCategory(sourceCategory, card.href, `${brand} ${name}`);
  const categoryLabel = categoryLabels[category];
  const price = parsePrice(card.priceText, category, index);
  const images = [card.image, card.secondaryImage].filter(Boolean);
  const sizes = card.sizes
    .map((size) => size.replace(/^Available sizes:?/i, '').trim())
    .filter((size) => size && size !== 'Available sizes:');
  const labels = card.labels.length > 0 ? card.labels : ['New Arrival'];

  return {
    id: `mytheresa-${slugify(slugPart) || `${slugify(brand)}-${index + 1}`}`,
    name,
    slug: slugify(slugPart) || `mytheresa-${index + 1}`,
    brand,
    category,
    categoryLabel,
    description: `${brand} ${name} from Mytheresa. ${labels.join(', ')}.`,
    shortDescription: `${labels.join(', ')} via Mytheresa.`,
    price,
    wholesalePrice: estimateWholesalePrice(price),
    minimumOrderQty: minimumOrderQty[category],
    images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&q=90'],
    colors: [{ name: 'Default', hex: '#1a1a1a' }],
    sizes: sizes.length > 0 ? sizes.slice(0, 12) : undefined,
    features: [
      ...labels,
      'Imported from an authenticated Mytheresa browser session',
      'Public product page with social sharing',
    ],
    materials: ['See Mytheresa product page'],
    origin: 'Mytheresa',
    audience: categoryAudience[category],
    inStock: true,
    isNew: labels.some((label) => /new arrival/i.test(label)) || index < 2,
    isBestseller: index === 0,
    highlight: 'Mytheresa authenticated browser capture',
    source: {
      label: 'Mytheresa',
      url: card.href,
      note: 'Captured through authenticated browser session',
    },
    shareText: `${brand} ${name} | Mytheresa`,
    seo: {
      title: `${brand} ${name} | Mytheresa`,
      description: `${brand} ${name} from Mytheresa. ${labels.join(', ')}.`,
      keywords: [brand, name, categoryLabel, 'Mytheresa', 'luxury catalog'],
    },
  };
}

function parseCatalogModule(sourceText) {
  const match = sourceText.match(/export const products: Product\[] = ([\s\S]*);\s*$/);
  if (!match) {
    throw new Error('Unable to parse data/catalog-products.ts');
  }
  return JSON.parse(match[1]);
}

function serializeCatalogModule(catalog) {
  return `import type { Product } from "@/types";\n\nexport const products: Product[] = ${JSON.stringify(catalog, null, 2)};\n`;
}

function dedupeProducts(products) {
  const seen = new Set();
  return products.filter((product) => {
    const key = `${product.id}:${product.slug}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

(async () => {
  const sourceText = fs.readFileSync(DATA_FILE, 'utf8');
  const currentProducts = parseCatalogModule(sourceText);
  const imported = [];

  for (const source of SOURCE_URLS) {
    const cards = await scrapeCards(source.url);
    console.log(`Captured ${cards.length} cards from ${source.url}`);
    for (const [index, card] of cards.entries()) {
      imported.push(cardToProduct(card, source.category, index));
    }
  }

  const merged = dedupeProducts([...imported, ...currentProducts]);
  fs.writeFileSync(DATA_FILE, serializeCatalogModule(merged), 'utf8');
  console.log(JSON.stringify({ importedCount: imported.length, writtenCount: merged.length, writtenPath: DATA_FILE }, null, 2));
})().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exit(1);
});

