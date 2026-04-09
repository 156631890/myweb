import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
    "Shop KUANGTU's luxury storefront by category, with public product pages built for retail browsing and trade inquiry.",
};

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();
  const newProducts = getNewProducts();
  const tradeSelections = getTradeSelections();

  return (
    <div className="pb-8">
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:py-8">
          <div className="space-y-5">
            <div className="space-y-3">
              <p className="text-[10px] tracking-[0.34em] uppercase text-text-muted">
                KUANGTU / new season
              </p>
              <Badge variant="outline">Luxury storefront</Badge>
              <h1 className="max-w-[12ch] text-[2.4rem] leading-[0.94] sm:text-[3.35rem]">
                Shop luxury fashion by category.
              </h1>
              <p className="max-w-md text-sm leading-6 text-text-muted">
                A cleaner public storefront for browsing, forwarding, and inquiry-led buying.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary bg-primary px-5 py-3 text-[10px] tracking-[0.26em] uppercase text-primary-foreground transition-colors hover:bg-muted"
              >
                Shop now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/wholesale"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-[10px] tracking-[0.26em] uppercase text-foreground transition-colors hover:border-primary"
              >
                Trade access
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { value: `${categories.length}`, label: "Categories" },
                { value: `${featuredProducts.length}`, label: "Featured" },
                { value: `${tradeSelections.length}`, label: "Trade picks" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-border bg-card px-4 py-3">
                  <p className="text-xl leading-none">{stat.value}</p>
                  <p className="mt-2 text-[10px] tracking-[0.22em] uppercase text-text-muted">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative overflow-hidden border border-border bg-card">
              <div className="relative aspect-[16/10]">
                <Image
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=90"
                  alt="KUANGTU directory"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white">
                  <div className="space-y-2">
                    <p className="text-[10px] tracking-[0.3em] uppercase text-white/75">
                      Womenswear / bags / shoes / jewelry
                    </p>
                    <h2 className="max-w-md text-2xl leading-tight sm:text-[2rem]">
                      A monochrome storefront built around quick product discovery.
                    </h2>
                  </div>
                  <Link
                    href="/products"
                    className="hidden rounded-full border border-white/35 px-4 py-2 text-[10px] tracking-[0.24em] uppercase text-white transition-colors hover:bg-white hover:text-primary sm:inline-flex"
                  >
                    Browse
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-6">
          <div>
            <p className="text-[10px] tracking-[0.34em] uppercase text-text-muted">Categories</p>
            <h2 className="mt-2 text-3xl sm:text-[2.3rem]">Shop by category</h2>
          </div>
          <Link href="/products" className="hidden text-sm text-foreground transition-colors hover:text-text-muted sm:inline-flex">
            View all
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[10px] tracking-[0.34em] uppercase text-text-muted">Featured</p>
            <h2 className="mt-2 text-3xl sm:text-[2.3rem]">Featured products</h2>
          </div>
          <Link href="/products" className="text-sm text-foreground transition-colors hover:text-text-muted">
            Shop all
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[10px] tracking-[0.34em] uppercase text-text-muted">New arrivals</p>
            <h2 className="mt-2 text-3xl sm:text-[2.3rem]">New arrivals</h2>
          </div>
          <Link href="/products" className="text-sm text-foreground transition-colors hover:text-text-muted">
            View all
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:grid lg:grid-cols-[0.82fr_1.18fr] lg:gap-12">
          <div className="space-y-3">
            <p className="text-[10px] tracking-[0.34em] uppercase text-text-muted">Trade access</p>
            <h2 className="max-w-md text-3xl sm:text-[2.3rem]">Request deeper catalog access.</h2>
            <p className="max-w-xl text-sm leading-6 text-text-muted">
              Public product pages stay visible. Larger buyers can request pricing guidance and
              additional catalog packs.
            </p>
            <Link
              href="/wholesale"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-[10px] tracking-[0.24em] uppercase text-foreground transition-colors hover:border-primary"
            >
              Request access
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
