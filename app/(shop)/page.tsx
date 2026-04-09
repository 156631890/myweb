import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { CategoryCard } from "@/components/product/category-card";
import { ProductCard } from "@/components/product/product-card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import {
  categories,
  getFeaturedProducts,
  getNewProducts,
  getTradeSelections,
} from "@/lib/products";

export const metadata: Metadata = {
  title: "KUANGTU | Luxury Directory",
  description:
    "Browse KUANGTU's luxury directory by brand, category, and buying mode. Public product pages stay shareable for retail and trade discovery.",
};

const brandStrip = [
  "Issue 01 / client-ready edit",
  "Retail + trade / one directory",
  "Inquiry unlocks deeper packs",
];

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();
  const newProducts = getNewProducts();
  const tradeSelections = getTradeSelections();

  return (
    <div className="pb-8">
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.86fr_1.14fr] lg:items-start lg:py-10">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-[10px] tracking-[0.34em] uppercase text-text-muted">
                <span>KUANGTU / directory</span>
                <span className="h-px w-8 bg-border" />
                <span>Issue 01</span>
              </div>
              <Badge variant="outline">Client-facing luxury directory</Badge>
              <h1 className="max-w-[13ch] text-[2.9rem] leading-[0.96] sm:text-5xl lg:text-[4.6rem]">
                A concise luxury directory built for forwarding.
              </h1>
              <p className="max-w-xl text-sm leading-7 text-text-muted sm:text-base">
                KUANGTU reads like a client pack: public listings are clean and sharable, while
                inquiry unlocks deeper catalog groups for buyers who need more context, pricing,
                and sourcing detail.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-[10px] tracking-[0.26em] uppercase text-primary-foreground transition-colors hover:bg-black/90"
              >
                Browse directory
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/wholesale"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gold/30 px-5 py-3.5 text-[10px] tracking-[0.26em] uppercase text-gold transition-colors hover:bg-gold hover:text-primary-foreground"
              >
                Unlock more packs
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {brandStrip.map((item) => (
                <div key={item} className="rounded-2xl border border-border bg-card px-4 py-3">
                  <p className="text-[10px] tracking-[0.22em] uppercase text-text-muted">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative overflow-hidden border border-border bg-card shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
              <div className="relative aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=90"
                  alt="KUANGTU directory"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/8 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <div className="max-w-md space-y-3">
                    <p className="text-[10px] tracking-[0.34em] uppercase text-white/80">
                      Public directory / trade ready
                    </p>
                    <h2 className="text-2xl leading-tight sm:text-3xl">
                      Dense listings with a clean buyer-facing presentation.
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { value: `${featuredProducts.length + newProducts.length + tradeSelections.length}`, label: "Shown" },
                { value: `${categories.length}`, label: "Categories" },
                { value: `${tradeSelections.length}`, label: "Trade picks" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-border bg-card p-4">
                  <div className="text-2xl leading-none">{stat.value}</div>
                  <p className="mt-2 text-[10px] tracking-[0.22em] uppercase text-text-muted">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card/60">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 sm:px-6 md:grid-cols-4">
          {[
            {
              icon: Truck,
              title: "International delivery",
              text: "Retail-ready fulfillment cues and shipping guidance.",
            },
            {
              icon: ShieldCheck,
              title: "Source-aware listings",
              text: "Each page shows origin and source context for buyers.",
            },
            {
              icon: Sparkles,
              title: "Directory merchandising",
              text: "Lists are dense, structured, and easy to scan.",
            },
            {
              icon: ArrowRight,
              title: "Inquiry unlock packs",
              text: "Submit an inquiry to reveal deeper catalog groups.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-2xl border border-border bg-background p-5">
                <Icon className="h-5 w-5 text-gold" strokeWidth={1.6} />
                <h3 className="mt-4 text-lg">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-text-muted">{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-[10px] tracking-[0.34em] uppercase text-text-muted">Categories</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">Browse the directory by category</h2>
          </div>
          <Link href="/products" className="hidden text-sm text-gold transition-colors hover:text-foreground sm:inline-flex">
            View all listings
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[10px] tracking-[0.34em] uppercase text-text-muted">Featured</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">Highlighted listings</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-text-muted">
            Selected for first-page prominence, forwardability, and buyer-facing product storytelling.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[10px] tracking-[0.34em] uppercase text-text-muted">New arrivals</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">Fresh directory additions</h2>
          </div>
          <Link href="/search" className="text-sm text-gold transition-colors hover:text-foreground">
            Search the directory
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:grid lg:grid-cols-[0.88fr_1.12fr] lg:gap-12">
          <div className="space-y-4">
            <p className="text-[10px] tracking-[0.34em] uppercase text-text-muted">Wholesale</p>
            <h2 className="max-w-md text-3xl sm:text-4xl">Inquiry unlocks additional packs</h2>
            <p className="max-w-xl text-sm leading-7 text-text-muted">
              Buyers can browse the public directory, then submit a structured inquiry to receive
              trade pricing, MOQ guidance, and deeper catalog packs.
            </p>
            <Link
              href="/wholesale"
              className="inline-flex items-center gap-2 rounded-full border border-gold/30 px-5 py-3 text-[10px] tracking-[0.24em] uppercase text-gold transition-colors hover:bg-gold hover:text-primary-foreground"
            >
              Start an inquiry
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-0">
            {tradeSelections.map((product) => (
              <div key={product.id} className="rounded-2xl border border-border bg-background p-5">
                <p className="text-[10px] tracking-[0.22em] uppercase text-text-muted">
                  {product.brand}
                </p>
                <h3 className="mt-3 text-2xl">{product.name}</h3>
                <p className="mt-2 text-sm leading-6 text-text-muted">{product.shortDescription}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-gold">{formatPrice(product.wholesalePrice ?? 0)}</span>
                  <span className="text-text-muted">MOQ {product.minimumOrderQty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
