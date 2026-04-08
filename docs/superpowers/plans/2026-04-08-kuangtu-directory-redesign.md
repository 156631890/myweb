# KUANGTU Directory Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand the storefront as KUANGTU and reshape the public shopping experience into an English-first luxury directory-resale site with inquiry-gated catalog packs.

**Architecture:** Keep the existing product data and shareable detail-page machinery, but shift the homepage and catalog surface to a denser directory layout with stronger taxonomy, brand-first browsing, and clearer trade controls. Add a lightweight unlock state on the wholesale page so inquiry submission reveals additional catalog packs without requiring a separate auth system.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, Zustand, local API routes.

---

### Task 1: Rebrand the public shell to KUANGTU

**Files:**
- Modify: `app/layout.tsx`
- Modify: `components/layout/navbar.tsx`
- Modify: `components/layout/footer.tsx`
- Modify: `app/(shop)/about/page.tsx`
- Modify: `app/(shop)/page.tsx`

- [ ] **Step 1: Replace visible brand strings and metadata**

```tsx
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: "KUANGTU | Luxury Directory",
    template: "%s | KUANGTU",
  },
  description:
    "KUANGTU is an English-first luxury directory for retail discovery and trade inquiry across sunglasses, women’s wear, men’s wear, bags, shoes, and jewelry.",
  openGraph: {
    type: "website",
    siteName: "KUANGTU",
    title: "KUANGTU | Luxury Directory",
    description: "An English-first luxury directory for retail discovery and trade inquiry.",
  },
  twitter: {
    card: "summary_large_image",
    title: "KUANGTU | Luxury Directory",
    description: "An English-first luxury directory for retail discovery and trade inquiry.",
  },
};

// components/layout/navbar.tsx
<div className="text-[10px] tracking-[0.34em] uppercase text-text-muted">
  KUANGTU
</div>
<div className="font-serif text-lg">Luxury Directory</div>

// components/layout/footer.tsx
mailto:trade@kuangtu.com

// app/(shop)/about/page.tsx
<Badge variant="outline">About KUANGTU</Badge>
```

- [ ] **Step 2: Reframe homepage copy away from editorial fashion language**

```tsx
// app/(shop)/page.tsx
export const metadata: Metadata = {
  title: "KUANGTU | Luxury Directory",
  description:
    "Browse KUANGTU’s luxury directory by brand, category, and buying mode. Public product pages stay shareable for retail and trade discovery.",
};
```

- [ ] **Step 3: Run a targeted string search to confirm no old brand remains**

Run:
```powershell
rg -n "Atelier Meridian|Luxury Fashion Edit|Mytheresa-style|trade@ateliermeridian" C:\Users\Administrator\worktrees\luxury-sunglasses-store\mytheresa-redesign
```

Expected: no matches in app-facing files.

---

### Task 2: Rebuild the homepage and catalog surface into a directory-style browse experience

**Files:**
- Modify: `app/(shop)/page.tsx`
- Modify: `app/(shop)/products/page.tsx`
- Modify: `components/product/category-card.tsx`
- Modify: `components/product/product-grid.tsx` if density or card spacing needs adjustment

- [ ] **Step 1: Turn the home hero into a concise directory-first intro**

```tsx
// app/(shop)/page.tsx
<section className="border-b border-border">
  <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-start lg:py-14">
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="text-[10px] tracking-[0.34em] uppercase text-text-muted">KUANGTU / Luxury directory</p>
        <h1 className="max-w-xl text-4xl leading-[1.05] sm:text-5xl lg:text-[4.75rem]">
          A directory built for retail discovery and trade inquiry.
        </h1>
        <p className="max-w-lg text-base leading-8 text-text-muted">
          Browse by brand, category, and buying mode. Public product pages stay easy to share,
          while inquiries unlock deeper catalog packs.
        </p>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Make `/products` feel like a long directory rather than a fashion edit**

```tsx
// app/(shop)/products/page.tsx
<div className="grid gap-8 lg:grid-cols-[300px_1fr]">
  <aside className="sticky top-24 space-y-6 rounded-[28px] border border-border bg-card/80 p-5 backdrop-blur-sm">
    <div className="flex items-center justify-between">
      <h2 className="text-[10px] tracking-[0.28em] uppercase text-text-muted">Filter directory</h2>
      <button className="text-xs text-gold">Reset</button>
    </div>
    <div className="space-y-3">
      <button className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-left text-sm">
        Women
      </button>
    </div>
  </aside>
</div>
```

- [ ] **Step 3: Make category cards and product grids denser and more index-like**

```tsx
// components/product/category-card.tsx and components/product/product-grid.tsx
// Use tighter padding, smaller title hierarchy, and stronger text blocks so the surface reads like a directory index.
```

- [ ] **Step 4: Run the responsive build and inspect the list view locally**

Run:
```powershell
cmd /c npm run build
```

Expected: build succeeds with no type or routing regressions.

---

### Task 3: Add inquiry-based catalog pack unlocking

**Files:**
- Modify: `app/(shop)/wholesale/page.tsx`
- Modify: `app/api/wholesale-inquiries/route.ts`
- Modify: `lib/wholesale-storage.ts`
- Add: `lib/catalog-packs.ts`
- Add: `components/wholesale/unlocked-pack-list.tsx`

- [ ] **Step 1: Define the unlock packs and the persisted inquiry response shape**

```ts
// lib/catalog-packs.ts
export interface CatalogPack {
  id: string;
  title: string;
  description: string;
  itemCount: number;
  unlockedByInquiry: boolean;
}

export const catalogPacks: CatalogPack[] = [
  { id: "starter", title: "Starter Directory", description: "Public catalog view.", itemCount: 24, unlockedByInquiry: false },
  { id: "trade", title: "Trade Pack", description: "Prices and MOQ notes for buyers.", itemCount: 48, unlockedByInquiry: true },
  { id: "extended", title: "Extended Pack", description: "Additional source groups shared after inquiry.", itemCount: 96, unlockedByInquiry: true },
];
```

- [ ] **Step 2: Return an unlock token from the inquiry API**

```ts
// app/api/wholesale-inquiries/route.ts
return NextResponse.json({
  ok: true,
  inquiryId: saved.id,
  unlock: {
    token: saved.id,
    packs: ["trade", "extended"],
  },
});
```

- [ ] **Step 3: Persist the unlock state in the wholesale page and reveal the extra packs**

```tsx
// app/(shop)/wholesale/page.tsx
const [unlockedPacks, setUnlockedPacks] = useState<string[]>([]);

const result = (await response.json()) as {
  message?: string;
  inquiryId?: string;
  unlock?: { token?: string; packs?: string[] };
};

if (result.unlock?.packs?.length) {
  setUnlockedPacks(result.unlock.packs);
}

<UnlockedPackList unlockedPacks={unlockedPacks} />
```

- [ ] **Step 4: Render the unlocked catalog packs as a clear post-submit reveal**

```tsx
// components/wholesale/unlocked-pack-list.tsx
export function UnlockedPackList({ unlockedPacks }: { unlockedPacks: string[] }) {
  if (!unlockedPacks.length) return null;
  return (
    <div className="rounded-[28px] border border-border bg-card p-6">
      <p className="text-[10px] tracking-[0.24em] uppercase text-text-muted">Unlocked catalog packs</p>
      <div className="mt-4 grid gap-3">
        {unlockedPacks.map((pack) => (
          <div key={pack} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm">
            {pack}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Verify the inquiry flow and unlock reveal work end-to-end**

Run:
```powershell
cmd /c npm run lint
cmd /c npm run build
```

Expected: both commands pass, and a successful inquiry reveals the unlock section in the UI.

---

### Task 4: Final verification and cleanup

**Files:**
- Review: all modified files from Tasks 1-3

- [ ] **Step 1: Re-run the public string search**

Run:
```powershell
rg -n "Atelier Meridian|Luxury Fashion Edit|Mytheresa-style|trade@ateliermeridian" C:\Users\Administrator\worktrees\luxury-sunglasses-store\mytheresa-redesign
```

Expected: no app-facing matches.

- [ ] **Step 2: Re-run the build and lint checks**

Run:
```powershell
cmd /c npm run lint
cmd /c npm run build
```

Expected: both pass.

- [ ] **Step 3: Commit the KUANGTU redesign**

```bash
git add app lib components data scripts docs/superpowers/plans/2026-04-08-kuangtu-directory-redesign.md
git commit -m "feat: rebrand to kuangtu and add directory unlock flow"
```
