"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { Price } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug}`} className={className}>
      <article className="group overflow-hidden border border-border bg-card">
        <div className="relative aspect-[5/6] overflow-hidden bg-surface">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.015]"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          />

          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/10 to-transparent opacity-60" />
        </div>

        <div className="space-y-3 p-4">
          <div className="space-y-2">
            <p className="text-[10px] tracking-[0.22em] uppercase text-text-muted">
              {product.brand} / {product.categoryLabel}
            </p>
            <h3 className="max-w-[18ch] text-[1rem] leading-[1.35] text-foreground">
              {product.name}
            </h3>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
            <Price price={product.price} comparePrice={product.comparePrice} size="md" />
            <span className="text-[10px] tracking-[0.2em] uppercase text-text-muted">View</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
