# Cettire Visual Rebuild Design

## Goal
Rebuild the KUANGTU storefront so it reads and behaves like a Cettire-style luxury ecommerce site:

- minimal, monochrome presentation
- product-first homepage
- dense but controlled listing pages
- large product imagery with strong price hierarchy
- utility-led filters and checkout cues
- premium, editorial-neutral typography and spacing

The brand remains KUANGTU. The objective is visual and interaction parity in feel, not a brand rename.

## Scope
This is a full visual-system refresh across the public storefront:

- homepage
- category and product directory pages
- product detail pages
- navigation and footer chrome
- cart and checkout surfaces
- shared button, badge, price, card, and filter UI primitives

The catalog data model, wholesale inquiry flow, and SEO structure stay in place unless a UI change requires a small supporting adjustment.

## Design Principles

1. Product first
- Always keep product imagery and price visible early.
- Avoid large branding blocks or editorial marketing sections above product discovery.

2. Neutral and restrained
- Black, white, grey, and very light accent usage only.
- Reduce gradients, decorative panels, and heavyweight shadows.
- Use thin borders and soft spacing rather than visual ornament.

3. Utility over storytelling
- Filters, category entry points, sort controls, and trade actions should feel functional.
- Any "brand story" content must sit below shopping intent, not above it.

4. Dense but breathable
- Lists should feel information-rich without feeling crowded.
- Increase image scale while tightening redundant copy.

5. Strong price hierarchy
- Sale/retail price, compare-at price, and trade price should be the most legible text after the product name.
- Currency formatting stays consistent across the app.

## Visual System

### Color
- Primary surfaces: white and near-white.
- Typography: near-black.
- Secondary text: cool grey tones.
- Accent: a restrained gold only for active states, sale, inquiry, and cart affordances.
- Remove warm editorial gradients and visible colored panels where they do not serve shopping intent.

### Typography
- Headings: high-contrast serif or serif-like display treatment, but smaller and tighter than the current editorial build.
- Body: clean sans-serif with slightly tighter line-height.
- Buttons and metadata: uppercase micro-labels with consistent letter spacing.
- Price text should read louder than surrounding metadata.

### Layout
- Homepage uses a compact hero, then moves quickly into categories and product sections.
- Directory page uses a large product grid with a narrow, functional filter area.
- Product detail page uses a dominant image column and a concise right-side commerce column.
- Mobile layouts should stack naturally without losing the utility hierarchy.

## Page-Level Design

### 1. Homepage
The homepage should feel like a premium storefront landing page, not a campaign page.

Required changes:
- replace large hero storytelling with a compact product-first intro
- show one strong image area and one short text block
- move categories and product grids close to the top
- reduce the size and prominence of any editorial masthead
- remove secondary brand index style content

Desired hierarchy:
1. concise hero
2. category entry points
3. featured products
4. new arrivals
5. wholesale/inquiry CTA

### 2. Directory Page
The directory should feel closer to Cettire's category browsing:

- large, consistent product cards
- minimal filter chrome
- category filter placed prominently at the top
- no brand list or alphabetical index
- search and sorting remain present but visually subdued

The page should prioritize scanning product images and prices over reading text blocks.

### 3. Product Detail Page
The product detail page should be a standard luxury ecommerce detail layout:

- large left gallery
- concise right-side commerce panel
- price and trade price prominent
- add-to-cart and wholesale inquiry immediately accessible
- spec sheet and shipping/returns style utility blocks below the fold

The detail page should avoid long magazine-style editorial sections and instead emphasize purchase decision support.

### 4. Cart and Checkout
These pages should stay simple, functional, and consistent with the rest of the system:

- remove any editorial excess
- keep summary cards clean
- keep totals and CTA hierarchy obvious
- preserve current purchase flows

### 5. Navigation and Footer
The nav and footer should be simplified to match the new visual language:

- reduce visible chrome
- simplify link groups
- keep the top utility bar minimal
- preserve search, cart, and trade inquiry actions

## Component Changes

### Shared UI primitives
Update the shared UI so every page inherits the same tone:

- buttons
- badges
- inputs
- select controls
- price display
- cards and section containers

### Product card
Product cards should become larger and more image-led:

- bigger primary image
- cleaner text stack
- reduced decorative hover treatment
- stronger price visibility

### Filters
Filters should read like a utility rail rather than a content block:

- compact
- border-led
- minimal explanatory text
- category filter first
- no alphabetical or brand listing

## Data and Content Rules

- Keep KUANGTU as the brand name.
- Keep the current catalog structure and product routing.
- Preserve shareable product URLs and social metadata.
- Preserve wholesale inquiry and locked-pack behavior.
- Price values remain scaled by the existing `1/100` rule.

## Responsive Behavior

Desktop:
- more horizontal structure
- image-forward cards
- compact but legible type scale

Mobile:
- single-column stacks
- filter controls collapse predictably
- product cards retain large image presence
- CTA buttons stay full width or near-full width

## Accessibility

- Maintain visible focus states.
- Keep contrast strong on text and prices.
- Preserve semantic buttons, headings, labels, and forms.
- Ensure cards and filters remain keyboard accessible.

## Verification

The rebuilt UI is considered complete when:

- homepage visually reads as a Cettire-style storefront landing page
- directory page feels product-first and utility-led
- product detail page shows a large gallery and strong price hierarchy
- cart and checkout remain simple and coherent
- no hydration errors or build regressions are introduced
- `npm run lint` and `npm run build` pass

## Open Questions

None for the current pass. The intent is to apply the Cettire-like visual system across the whole storefront while preserving KUANGTU branding and the existing commerce flow.
