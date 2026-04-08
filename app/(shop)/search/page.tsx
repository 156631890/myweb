"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { ProductGrid } from "@/components/product/product-grid";
import { Input } from "@/components/ui/input";
import { searchProducts } from "@/lib/products";

const suggestions = ["sunglasses", "bags", "women", "men", "jewelry"];

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => searchProducts(query), [query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-3xl space-y-8 text-center">
        <p className="text-[10px] tracking-[0.34em] uppercase text-text-muted">Search</p>
        <h1 className="text-6xl sm:text-7xl">Find the right edit faster.</h1>
        <p className="text-base leading-8 text-text-muted">
          Search by product, brand, category, or buying use case. Results are public and shareable for social promotion.
        </p>
        <div className="relative text-left">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search the catalog"
            className="pr-14"
          />
          <div className="absolute right-0 top-0 flex h-full items-center gap-2 px-3 text-text-muted">
            {query && (
              <button type="button" onClick={() => setQuery("")}>
                <X className="h-4 w-4" />
              </button>
            )}
            <Search className="h-4 w-4" />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {suggestions.map((item) => (
            <button
              key={item}
              onClick={() => setQuery(item)}
              className="rounded-full border border-border px-4 py-2 text-[10px] tracking-[0.22em] uppercase text-text-muted"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12">
        {query ? (
          results.length > 0 ? (
            <ProductGrid products={results} />
          ) : (
            <div className="rounded-[28px] border border-border bg-card px-8 py-16 text-center">
              <p className="text-lg text-text-muted">No results found for "{query}".</p>
              <Link href="/products" className="mt-4 inline-block text-[10px] tracking-[0.24em] uppercase text-gold">
                Browse all products
              </Link>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}
