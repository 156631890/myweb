"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { CategoryInfo } from "@/types";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: CategoryInfo;
  className?: string;
  index?: number;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <Link
      href={`/products?category=${category.id}`}
      className={cn(
        "group relative overflow-hidden border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-gold/25",
        className
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className={cn("absolute inset-0 bg-gradient-to-t", category.accent)} />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="mb-2 text-[10px] tracking-[0.22em] uppercase text-white/80">
          {String(category.productCount).padStart(2, "0")} pieces
        </p>
        <h3 className="font-serif text-2xl text-white transition-colors group-hover:text-gold-light">
          {category.name}
        </h3>
        <p className="mt-2 max-w-xs text-sm leading-6 text-white/72">
          {category.description}
        </p>
      </div>
    </Link>
  );
}
