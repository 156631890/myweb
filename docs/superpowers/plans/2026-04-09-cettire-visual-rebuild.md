# Cettire Visual Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the KUANGTU storefront into a Cettire-style luxury ecommerce experience with a monochrome, product-first visual system and denser commerce-oriented pages.

**Architecture:** Keep the existing routing and catalog data flow. Rebuild the visual system through focused updates to shared primitives, then apply that system to the homepage, directory page, product detail page, and commerce surfaces. The result should feel like one coherent storefront rather than a set of edited pages.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, existing shared UI components and catalog helpers.

---

### Task 1: Establish the Cettire-style visual system

**Files:**
- Modify: `app/globals.css`
- Modify: `tailwind.config.ts`
- Modify: `components/ui/badge.tsx`
- Modify: `components/ui/button.tsx`
- Modify: `components/ui/input.tsx`
- Modify: `lib/utils.ts` if shared formatting helpers need to support the new visual rhythm

- [ ] **Step 1: Tighten the global palette and typography**

Replace the current editorial-leaning surface treatment with a monochrome system: white/near-white page surfaces, near-black text, subtle grey separators, and only restrained gold for active and commerce states. Reduce decorative gradients and soften or remove elevated shadows.

- [ ] **Step 2: Normalize shared controls**

Update buttons, badges, inputs, and select controls so they all share the same thin-border, compact, utility-first look. Keep the controls functional and understated rather than decorative.

- [ ] **Step 3: Verify the UI primitives still render cleanly**

Run: `cmd /c npm run lint`
Expected: no new style or type errors from the shared UI updates.

---

### Task 2: Rebuild the homepage as a product-first storefront landing page

**Files:**
- Modify: `app/(shop)/page.tsx`
- Modify: `components/product/category-card.tsx` if the category cards need visual simplification

- [ ] **Step 1: Compress the hero into a storefront intro**

Remove the large editorial feel and keep the opening section compact: short headline, one concise supporting paragraph, one strong image area, and direct entry buttons to browse or inquire. Avoid brand-index style content or long marketing copy above discovery.

- [ ] **Step 2: Move shopping entry points up**

Keep the category grid close to the top and make it read like the first real shopping choice. Reduce any secondary messaging blocks that compete with product browsing.

- [ ] **Step 3: Align featured and new-arrival sections with the new visual system**

Make the product sections lighter, more monochrome, and more image-forward. Keep the hierarchy focused on product image, name, and price.

- [ ] **Step 4: Verify the homepage still renders**

Run: `cmd /c npm run build`
Expected: `/` builds successfully and the homepage remains on the static output list.

---

### Task 3: Rebuild the directory page around a larger product grid and utility-first filtering

**Files:**
- Modify: `components/product/products-page-client.tsx`
- Modify: `components/product/product-grid.tsx`
- Modify: `components/product/product-card.tsx`
- Modify: `components/ui/input.tsx` only if the search/sort controls need a tighter visual treatment

- [ ] **Step 1: Promote the category filter to the top of the directory page**

Keep category selection highly visible at the top of `/products`. Remove any brand index or alphabet index concepts entirely. Preserve search, sort, retail/trade mode, and price range as supporting controls.

- [ ] **Step 2: Make the directory feel denser and more product-led**

Increase the visual weight of the product grid and reduce any explanatory copy that competes with scanning the cards. The page should feel like a luxury ecommerce category shelf rather than a content block.

- [ ] **Step 3: Update product card layout to match Cettire-like browsing**

Make the card more image-dominant, reduce the amount of metadata, and keep price prominent. The hover treatment should be restrained and the image area should feel large enough to drive browsing.

- [ ] **Step 4: Verify filtering and sorting still work**

Run: `cmd /c npm run lint`
Run: `cmd /c npm run build`
Expected: no hydration mismatch, no broken filtering, and no regressions in query, sort, category toggles, or retail/trade mode.

---

### Task 4: Rework product detail pages into a standard luxury ecommerce layout

**Files:**
- Modify: `components/product/product-detail-client.tsx`
- Modify: `components/ui/badge.tsx` if price or tag treatment needs alignment

- [ ] **Step 1: Emphasize the gallery and commerce panel**

Keep the left gallery dominant and make the right side concise: brand, title, price, trade price, purchase CTA, and inquiry CTA should be immediately visible. Reduce long editorial blocks above the fold.

- [ ] **Step 2: Convert supporting content into practical spec blocks**

Keep product details, size/fit, material, MOQ, manufacturer details, and source info, but present them as a clean utility-driven spec sheet rather than a magazine article.

- [ ] **Step 3: Preserve social sharing and wholesale actions**

Keep the share button, cart action, and wholesale inquiry path working exactly as before, but within the new visual language.

- [ ] **Step 4: Verify the detail route still renders**

Run: `cmd /c npm run lint`
Run: `cmd /c npm run build`
Expected: `/products/[slug]` still builds successfully and shared actions remain functional.

---

### Task 5: Simplify navigation, footer, cart, and checkout to match the new system

**Files:**
- Modify: `components/layout/navbar.tsx`
- Modify: `components/layout/footer.tsx`
- Modify: `app/(shop)/cart/page.tsx`
- Modify: `app/(shop)/checkout/page.tsx`
- Modify: `app/(shop)/checkout/success/page.tsx`

- [ ] **Step 1: Simplify the top and bottom chrome**

Reduce decorative text, keep the navigation utility-led, and preserve only the actions that matter: browse, search, cart, and inquiry.

- [ ] **Step 2: Make cart and checkout visually quieter**

Strip out any lingering editorial tone in summary cards and make totals, shipping, and CTA hierarchy obvious. Keep the surface treatment consistent with the directory and detail pages.

- [ ] **Step 3: Verify the purchase flow still works**

Run: `cmd /c npm run lint`
Run: `cmd /c npm run build`
Expected: cart and checkout routes still compile and preserve the current commerce flow.

---

### Task 6: Final validation and publish

**Files:**
- No code changes; run repository checks

- [ ] **Step 1: Confirm the workspace is clean or note intended diffs**

Run: `git status --short`

- [ ] **Step 2: Run a final production build**

Run: `cmd /c npm run build`

- [ ] **Step 3: Push when ready**

Run: `git push`
Expected: the `feature/mytheresa-redesign` branch updates on the remote without losing the catalog data.

## Coverage Check

- Homepage coverage: Task 2
- Directory coverage: Task 3
- Product detail coverage: Task 4
- Navigation/footer/cart/checkout coverage: Task 5
- Shared visual system coverage: Task 1
- Validation and publish coverage: Task 6

## Self-Review

- No placeholders remain.
- The plan stays focused on one UI/system redesign.
- File responsibilities are separated so each task can be implemented and verified independently.
- Price scaling and catalog data are preserved; only the visual presentation changes.
