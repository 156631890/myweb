"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Product } from "@/types";
import { useCartStore } from "@/lib/store";
import { Badge, Price } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = React.useState(false);

  const handleQuickAdd = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    addItem(product, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  return (
    <Link href={`/products/${product.slug}`} className={className}>
      <article className="group overflow-hidden border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-gold/25 hover:shadow-[0_16px_60px_rgba(0,0,0,0.08)]">
        <div className="relative aspect-[4/5] overflow-hidden bg-surface">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="absolute left-4 top-4 flex flex-col gap-2">
            {product.isNew && <Badge variant="primary">New</Badge>}
            {product.isBestseller && <Badge variant="outline">Bestseller</Badge>}
          </div>

          <button
            onClick={handleQuickAdd}
            className="absolute bottom-4 left-4 right-4 inline-flex items-center justify-center gap-2 rounded-full bg-background/95 px-4 py-3 text-[10px] tracking-[0.22em] uppercase text-foreground opacity-0 transition-all group-hover:opacity-100"
          >
            {added ? (
              "Added"
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Quick add
              </>
            )}
          </button>
        </div>

        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <p className="text-[10px] tracking-[0.22em] uppercase text-text-muted">
              {product.brand} / {product.categoryLabel}
            </p>
            <h3 className="max-w-[14ch] font-serif text-[1.45rem] leading-[1.08] group-hover:text-gold">
              {product.name}
            </h3>
            <p className="line-clamp-2 text-sm leading-6 text-text-muted">
              {product.shortDescription}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <Price price={product.price} comparePrice={product.comparePrice} size="md" />
            <span className="text-[10px] tracking-[0.2em] uppercase text-text-muted">
              View
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
