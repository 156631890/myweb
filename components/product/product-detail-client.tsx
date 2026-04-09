"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Copy, Minus, Plus, Share2, ShoppingBag } from "lucide-react";
import type { Product } from "@/types";
import { useCartStore } from "@/lib/store";
import { Badge, Price } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name ?? "");
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] ?? "");
  const [copied, setCopied] = useState(false);
  const forwardSummary = product.productDetails ?? product.highlight ?? product.shortDescription;
  const detailRows = [
    { label: "Source", value: product.source.label },
    { label: "Materials", value: product.materials?.join(", ") ?? "See product page" },
    { label: "Audience", value: product.audience ? product.audience : "Unisex" },
    { label: "Origin", value: product.origin ?? "Selected sourcing" },
    {
      label: "MOQ",
      value: product.minimumOrderQty ? `${product.minimumOrderQty} units` : "Retail ready",
    },
    product.itemNumber ? { label: "Item number", value: product.itemNumber } : null,
    product.wholesalePrice ? { label: "Trade price", value: formatPrice(product.wholesalePrice) } : null,
    product.manufacturerDetails ? { label: "Manufacturer", value: product.manufacturerDetails } : null,
    product.sizeAndFit ? { label: "Size & fit", value: product.sizeAndFit } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  const handleShare = async () => {
    const url = `${window.location.origin}/products/${product.slug}`;

    if (navigator.share) {
      await navigator.share({ title: product.name, text: product.shareText, url });
      return;
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-24 px-4 py-10 sm:px-6 lg:py-14">
      <section className="grid gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
        <div className="space-y-4 lg:sticky lg:top-24">
          <div className="relative overflow-hidden border border-border bg-card">
            <div className="relative aspect-[4/5]">
              <Image src={product.images[selectedImage]} alt={product.name} fill priority className="object-cover" />
            </div>
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-[4/5] overflow-hidden border transition-colors ${
                    selectedImage === index ? "border-gold" : "border-border hover:border-gold/30"
                  }`}
                >
                  <Image src={image} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{product.categoryLabel}</Badge>
            {product.isNew && <Badge variant="primary">New</Badge>}
            {product.isBestseller && <Badge variant="outline">Bestseller</Badge>}
          </div>

          <div className="space-y-4">
            <p className="text-[10px] tracking-[0.34em] uppercase text-text-muted">
              Editorial view / Product story / Trade note
            </p>
            <p className="text-[10px] tracking-[0.24em] uppercase text-text-muted">
              {product.brand} / {product.origin}
            </p>
            <h1 className="max-w-xl text-4xl sm:text-5xl lg:text-6xl">{product.name}</h1>
            <p className="max-w-lg text-base leading-8 text-text-muted">{product.description}</p>
          </div>

          <div className="rounded-[28px] border border-border bg-card p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[10px] tracking-[0.24em] uppercase text-text-muted">
                Forwardable summary
              </p>
              <p className="text-[10px] tracking-[0.24em] uppercase text-text-muted">
                {product.source.label}
              </p>
            </div>
            <div className="mt-4 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-3">
                <p className="text-[10px] tracking-[0.22em] uppercase text-text-muted">
                  {product.brand}
                </p>
                <h2 className="text-3xl leading-tight sm:text-[2.6rem]">{product.name}</h2>
                {product.itemNumber && (
                  <p className="text-[10px] tracking-[0.22em] uppercase text-text-muted">
                    Item no. {product.itemNumber}
                  </p>
                )}
              </div>
              <div className="space-y-4 border-t border-border pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                <div>
                  <p className="text-[10px] tracking-[0.22em] uppercase text-text-muted">
                    One-line story
                  </p>
                  <p className="mt-2 text-sm leading-7 text-text-muted">{forwardSummary}</p>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.22em] uppercase text-text-muted">
                    Share copy
                  </p>
                  <p className="mt-2 text-sm leading-7 text-text-muted">{product.shareText}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-end justify-between gap-4 border-y border-border py-5">
            <Price price={product.price} comparePrice={product.comparePrice} size="lg" />
            {product.wholesalePrice && (
              <p className="text-right text-sm text-text-muted">
                Trade <span className="text-gold">{formatPrice(product.wholesalePrice)}</span>
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <p className="mb-3 text-[10px] tracking-[0.24em] uppercase text-text-muted">Color</p>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => {
                  const active = selectedColor === color.name;
                  return (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${
                        active ? "border-gold bg-gold/10" : "border-border"
                      }`}
                    >
                      <span className="h-3 w-3 rounded-full border border-border" style={{ backgroundColor: color.hex }} />
                      {color.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {product.sizes && product.sizes.length > 0 && (
              <div>
                <p className="mb-3 text-[10px] tracking-[0.24em] uppercase text-text-muted">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-12 rounded-full border px-4 py-2 text-sm ${
                        selectedSize === size ? "border-gold bg-gold text-primary-foreground" : "border-border"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-[auto_1fr]">
            <div className="inline-flex items-center rounded-full border border-border">
              <button onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="flex h-12 w-12 items-center justify-center text-text-muted">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-14 text-center">{quantity}</span>
              <button onClick={() => setQuantity((value) => value + 1)} className="flex h-12 w-12 items-center justify-center text-text-muted">
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button size="lg" onClick={() => addItem(product, quantity)} fullWidth>
              <ShoppingBag className="h-4 w-4" />
              Add to cart
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href={`/wholesale?product=${product.slug}`}
              className="inline-flex items-center justify-center rounded-full border border-gold/30 px-5 py-4 text-[10px] tracking-[0.26em] uppercase text-gold"
            >
              Wholesale inquiry
            </Link>
            <button
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-4 text-[10px] tracking-[0.26em] uppercase"
            >
              {copied ? "Copied" : "Share product"}
              {copied ? <Copy className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            </button>
          </div>

          <div className="rounded-[28px] border border-border bg-card p-6 text-sm leading-7 text-text-muted">
            <p className="text-[10px] tracking-[0.24em] uppercase text-text-muted">Source</p>
            <p className="mt-2">{product.source.label}</p>
            <a href={product.source.url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs tracking-[0.18em] uppercase text-gold">
              View source
            </a>
          </div>
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <p className="text-[10px] tracking-[0.34em] uppercase text-text-muted">Highlights</p>
          <h2 className="max-w-md text-3xl sm:text-4xl">Why this item is in the edit</h2>
          <p className="text-sm leading-7 text-text-muted">{product.shortDescription}</p>
          <div className="space-y-3">
            {product.features.map((feature) => (
              <div key={feature} className="rounded-2xl border border-border bg-card px-4 py-3 text-sm">
                {feature}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-border bg-card p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h3 className="text-2xl">Product details</h3>
            <p className="text-[10px] tracking-[0.24em] uppercase text-text-muted">Spec sheet</p>
          </div>
          <dl className="mt-5 divide-y divide-border">
            {detailRows.map((row) => (
              <div key={row.label} className="grid gap-2 py-4 sm:grid-cols-[180px_1fr] sm:gap-5">
                <dt className="text-[10px] tracking-[0.24em] uppercase text-text-muted">{row.label}</dt>
                <dd className="text-sm leading-7 text-text-muted">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="space-y-8">
          <div>
            <p className="text-[10px] tracking-[0.34em] uppercase text-text-muted">Related</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">More from this category</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((item) => (
              <Link key={item.id} href={`/products/${item.slug}`} className="group overflow-hidden border border-border bg-card">
                <div className="relative aspect-[4/5]">
                  <Image src={item.images[0]} alt={item.name} fill className="object-cover transition-transform group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <p className="text-[10px] tracking-[0.22em] uppercase text-text-muted">{item.brand}</p>
                  <h3 className="mt-2 text-2xl group-hover:text-gold">{item.name}</h3>
                  <Price price={item.price} comparePrice={item.comparePrice} className="mt-3" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
