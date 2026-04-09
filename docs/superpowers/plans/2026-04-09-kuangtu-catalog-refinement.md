# KUANGTU Catalog Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make KUANGTU read like a polished, client-facing luxury directory pack with stronger cover presentation, denser category browsing, cleaner detail-page summaries, and a clearer inquiry path.

**Architecture:** Keep the existing storefront structure and enrich the highest-traffic surfaces rather than rebuilding routing. The homepage becomes a catalog cover, the product directory becomes an index-first browsing surface, the product detail page gains a shareable summary block, and the wholesale page becomes the primary action for unlocking deeper packs.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, existing catalog and wholesale helpers.

---

### Task 1: Make the homepage feel like a directory cover

**Files:**
- Modify: `app/(shop)/page.tsx`

- [ ] **Step 1: Rewrite the hero hierarchy**

```tsx
// Keep the same data sources, but condense the copy and make the cover feel more like a catalog front page.
// Promote brand index, category count, and inquiry unlock as the primary story.
```

- [ ] **Step 2: Add a compact editorial masthead block**

```tsx
// Add a small "KUANGTU DIRECTORY / ISSUE 01" style block above the H1.
// Reduce the hero text width and push supporting stats into a tighter grid.
```

- [ ] **Step 3: Verify the homepage still renders the existing category, brand, and featured sections**

Run: `cmd /c npm run build`
Expected: success with the homepage route included in the static output.

### Task 2: Turn the directory page into an index-first catalog

**Files:**
- Modify: `components/product/products-page-client.tsx`
- Modify: `app/(shop)/products/page.tsx`

- [ ] **Step 1: Tighten the top bar and brand index**

```tsx
// Keep the sticky filter bar, but make the directory feel denser:
// - stronger brand count label
// - shorter intro copy
// - clearer retail/trade switch
// - visible active-filter summary
```

- [ ] **Step 2: Add a compact "directory summary" row above the grid**

```tsx
// Show result count, selected brands, selected categories, and price range in one line.
// This makes the page feel like a working catalog sheet, not a casual shopping browse.
```

- [ ] **Step 3: Improve the brand index affordance**

```tsx
// Keep alphabet anchors, but make each brand row denser and add a subtle "open" cue.
// Preserve the existing ASCII-safe bucketing to avoid hydration issues.
```

- [ ] **Step 4: Verify directory interactions still work**

Run: `cmd /c npm run lint`
Run: `cmd /c npm run build`
Expected: no hydration mismatch and no regressions in filtering, sorting, or brand anchors.

### Task 3: Make product detail pages more client-forward

**Files:**
- Modify: `components/product/product-detail-client.tsx`

- [ ] **Step 1: Add a forwardable summary card**

```tsx
// Add a compact summary block near the top that includes:
// - brand
// - product title
// - item number
// - source label
// - one-line product story
// This block should be easy to screenshot or forward to a client.
```

- [ ] **Step 2: Convert the detail panel into a cleaner spec sheet**

```tsx
// Group materials, origin, size/fit, MOQ, and manufacturer details into a tighter sheet layout.
// Use shorter labels and reduce visual noise from repeated decorative sections.
```

- [ ] **Step 3: Verify share and cart actions still function**

Run: `cmd /c npm run lint`
Run: `cmd /c npm run build`
Expected: product detail route still builds and the share/add-to-cart buttons remain usable.

### Task 4: Strengthen the inquiry path

**Files:**
- Modify: `app/(shop)/wholesale/page.tsx`
- Modify: `components/wholesale/unlocked-pack-list.tsx`
- Modify: `app/api/wholesale-inquiries/route.ts` only if the response payload needs a new field

- [ ] **Step 1: Make the CTA language more direct**

```tsx
// Reframe the page as "request access to deeper catalog packs".
// Make the unlock action more prominent than the form itself.
```

- [ ] **Step 2: Surface the unlocked packs more clearly**

```tsx
// After submission, reveal a stronger confirmation block and an obvious list of unlocked packs.
// Keep localStorage persistence so the unlocked state survives refresh.
```

- [ ] **Step 3: Verify form submission and unlock persistence**

Run: `cmd /c npm run lint`
Run: `cmd /c npm run build`
Expected: inquiry POST still succeeds and the unlocked pack list persists across reloads.

### Task 5: Final validation

**Files:**
- No code changes; run repository checks

- [ ] **Step 1: Confirm the workspace is clean or note any intentional diffs**

Run: `git status --short`

- [ ] **Step 2: Run the full build one more time**

Run: `cmd /c npm run build`

- [ ] **Step 3: Push if the user asks for publication**

Run: `git push`
Expected: branch updates on the remote without losing the catalog data.
