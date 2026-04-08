import { readFile } from "node:fs/promises";
import path from "node:path";
import WebSocket from "ws";

export interface BrowserCard {
  href: string;
  brand: string;
  name: string;
  priceText: string;
  image: string;
  secondaryImage: string;
  labels: string[];
  sizes: string[];
}

async function resolveBrowserWebSocketUrl() {
  const explicitUrl = process.env.MYTHERESA_BROWSER_WS_URL || process.env.CHROME_DEVTOOLS_WS_URL;
  if (explicitUrl) return explicitUrl;

  const activePortPath = process.env.CHROME_DEVTOOLS_ACTIVE_PORT
    ? path.resolve(process.env.CHROME_DEVTOOLS_ACTIVE_PORT)
    : path.join(
        process.env.LOCALAPPDATA ?? "",
        "Google",
        "Chrome",
        "User Data",
        "DevToolsActivePort"
      );

  const [portLine, browserPathLine] = (await readFile(activePortPath, "utf8"))
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!portLine || !browserPathLine) {
    throw new Error("Unable to resolve the live Chrome DevTools websocket endpoint.");
  }

  return `ws://127.0.0.1:${portLine}${browserPathLine}`;
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connectBrowserDevtools() {
  const browserWebSocketUrl = await resolveBrowserWebSocketUrl();
  const ws = new WebSocket(browserWebSocketUrl);
  const pending = new Map<
    number,
    {
      resolve: (value: unknown) => void;
      reject: (reason?: unknown) => void;
    }
  >();
  let nextId = 1;

  await new Promise<void>((resolve, reject) => {
    ws.once("open", () => resolve());
    ws.once("error", reject);
  });

  ws.on("message", (data) => {
    const message = JSON.parse(data.toString()) as {
      id?: number;
      error?: { message?: string };
      result?: unknown;
    };

    if (typeof message.id !== "number") return;

    const pendingCall = pending.get(message.id);
    if (!pendingCall) return;
    pending.delete(message.id);

    if (message.error) {
      pendingCall.reject(new Error(message.error.message ?? "CDP request failed"));
      return;
    }

    pendingCall.resolve(message);
  });

  ws.on("close", () => {
    for (const pendingCall of pending.values()) {
      pendingCall.reject(new Error("Chrome DevTools websocket closed."));
    }
    pending.clear();
  });

  return {
    async send(method: string, params: Record<string, unknown> = {}, sessionId?: string) {
      const id = nextId++;
      return await new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        ws.send(
          JSON.stringify({
            id,
            method,
            params,
            ...(sessionId ? { sessionId } : {}),
          })
        );
      });
    },
    close() {
      ws.close();
    },
  };
}

export async function scrapeBrowserCards(url: string): Promise<BrowserCard[]> {
  const browser = await connectBrowserDevtools();
  try {
    const createTarget = (await browser.send("Target.createTarget", { url: "about:blank" })) as {
      result: { targetId: string };
    };
    const attach = (await browser.send("Target.attachToTarget", {
      targetId: createTarget.result.targetId,
      flatten: true,
    })) as { result: { sessionId: string } };
    const sessionId = attach.result.sessionId;

    await browser.send("Page.enable", {}, sessionId);
    await browser.send("Runtime.enable", {}, sessionId);
    await browser.send("Network.enable", {}, sessionId);
    await browser.send("Page.navigate", { url }, sessionId);

    let lastCount = 0;
    let stableCount = 0;
    for (let attempt = 0; attempt < 12; attempt += 1) {
      await wait(1500);
      const state = (await browser.send(
        "Runtime.evaluate",
        {
          expression:
            "JSON.stringify({ count: document.querySelectorAll('.item').length, title: document.title, href: location.href })",
          returnByValue: true,
        },
        sessionId
      )) as { result: { result: { value?: string } } };

      const payload = state.result.result.value ? JSON.parse(state.result.result.value) : null;
      const count = typeof payload?.count === "number" ? payload.count : 0;

      if (count > 0 && count === lastCount) {
        stableCount += 1;
      } else {
        stableCount = 0;
      }

      lastCount = count;
      if (count >= 24 || stableCount >= 2) break;
    }

    const cardsResult = (await browser.send(
      "Runtime.evaluate",
      {
        expression: `(() => Array.from(document.querySelectorAll('.item')).map((card) => {
          const link = card.querySelector('a.item__link');
          const brand = card.querySelector('.item__info__header__designer')?.textContent?.trim() || '';
          const name = card.querySelector('.item__info__name a')?.textContent?.trim() || link?.querySelector('img')?.alt?.split('|')?.[0]?.trim() || '';
          const priceText = card.querySelector('.pricing__prices__price')?.textContent?.replace(/\\s+/g, ' ').trim() || '';
          const images = Array.from(card.querySelectorAll('.item__images img')).map((img) => img.src).filter(Boolean);
          const labels = Array.from(card.querySelectorAll('.labels__label')).map((label) => label.textContent?.trim()).filter(Boolean);
          const sizes = Array.from(card.querySelectorAll('.item__sizes__size')).map((size) => size.textContent?.replace(/\\s+/g, ' ').trim()).filter(Boolean);

          return {
            href: link?.href || '',
            brand,
            name,
            priceText,
            image: images[0] || '',
            secondaryImage: images[1] || '',
            labels,
            sizes,
          };
        }))()`,
        returnByValue: true,
      },
      sessionId
    )) as { result: { result: { value?: BrowserCard[] } } };

    return cardsResult.result.result.value ?? [];
  } finally {
    browser.close();
  }
}
