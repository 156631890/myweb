"use client";

import React from "react";
import { ProductCard } from "./product-card";
import type { Product } from "@/types";
import { StaggerChildren } from "@/components/animations/index";

interface ProductGridProps {
  products: Product[];
  className?: string;
}

export function ProductGrid({ products, className }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-[28px] border border-border bg-card py-16 text-center">
        <p className="text-lg text-text-muted">No products found.</p>
      </div>
    );
  }

  return (
    <StaggerChildren className={className}>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </StaggerChildren>
  );
}
