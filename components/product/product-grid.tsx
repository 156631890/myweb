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
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <StaggerChildren className={className}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </StaggerChildren>
  );
}
