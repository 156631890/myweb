"use client";

import React, { useMemo, useState } from "react";
import { Filter, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/product/product-grid";
import { Select, Input } from "@/components/ui/input";
import { categories, getProductsForView } from "@/lib/products";
import type { CategorySlug, SortOption, ViewMode } from "@/types";

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: "newest", label: "Newest first" },
  { value: "popular", label: "Most viewed" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
];

export default function ProductsPageClient() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as CategorySlug | null;
  const categoryIds = useMemo(() => categories.map((category) => category.id), []);

  const [activeCategories, setActiveCategories] = useState<CategorySlug[]>(
    initialCategory && categoryIds.includes(initialCategory) ? [initialCategory] : []
  );
  const [mode, setMode] = useState<ViewMode>("retail");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const catalog = useMemo(() => getProductsForView(mode), [mode]);

  const filteredProducts = useMemo(() => {
    let result = [...catalog];

    if (activeCategories.length > 0) {
      result = result.filter((product) => activeCategories.includes(product.category));
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter((product) => {
        const haystack = [
          product.name,
          product.brand,
          product.categoryLabel,
          product.description,
          product.shortDescription,
          product.origin,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(q);
      });
    }

    result = result.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1]);

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        result.sort((a, b) => Number(Boolean(b.isBestseller)) - Number(Boolean(a.isBestseller)));
        break;
      case "newest":
      default:
        result.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)));
        break;
    }

    return result;
  }, [activeCategories, catalog, priceRange, query, sortBy]);

  const hasActiveFilters =
    activeCategories.length > 0 ||
    query.trim() !== "" ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 1000;

  const toggleCategory = (category: CategorySlug) => {
    setActiveCategories((current) =>
      current.includes(category) ? current.filter((item) => item !== category) : [...current, category]
    );
  };

  const clearFilters = () => {
    setActiveCategories([]);
    setQuery("");
    setPriceRange([0, 1000]);
    setSortBy("newest");
  };

  return (
    <div className="mx-auto max-w-[88rem] px-4 py-8 sm:px-6 lg:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
        <div className="space-y-2">
          <p className="text-[10px] tracking-[0.34em] uppercase text-text-muted">Products</p>
          <h1 className="text-[2rem] leading-[0.96] sm:text-[2.8rem]">
            {mode === "trade" ? "Trade inventory" : "Directory listings"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-full border border-border bg-card p-1">
            {[
              { label: "Retail", value: "retail" as ViewMode },
              { label: "Trade", value: "trade" as ViewMode },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setMode(tab.value)}
                className={`rounded-full px-4 py-2 text-[10px] tracking-[0.24em] uppercase transition-colors ${
                  mode === tab.value
                    ? "bg-foreground text-background"
                    : "text-text-muted hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="rounded-full border border-border bg-card px-4 py-2 text-[10px] tracking-[0.24em] uppercase text-text-muted">
            {filteredProducts.length} items
          </div>
        </div>
      </div>

      <div className="mb-5 rounded-[20px] border border-border bg-card p-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-wrap gap-2">
            {categories.map((category) => {
              const active = activeCategories.includes(category.id);
              return (
                <button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={`inline-flex items-center justify-between rounded-full border px-4 py-2 text-[10px] tracking-[0.22em] uppercase transition-colors ${
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background text-text-muted hover:border-foreground/25 hover:text-foreground"
                  }`}
                >
                  <span>{category.name}</span>
                  <span className="ml-3 text-[10px] tracking-[0.2em] uppercase">
                    {String(category.productCount).padStart(2, "0")}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="rounded-full border border-border bg-background px-4 py-2 text-[10px] tracking-[0.24em] uppercase text-text-muted">
            {filteredProducts.length} items
          </div>
        </div>
      </div>

      <div className="sticky top-20 z-20 mb-8 rounded-[20px] border border-border bg-card/95 p-4 backdrop-blur-md">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <Input
              aria-label="Search products"
              placeholder="Search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <div className="sm:w-52">
              <Select
                aria-label="Sort products"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortOption)}
                options={sortOptions}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex rounded-full border border-border bg-background p-1">
              {[
                { label: "Retail", value: "retail" as ViewMode },
                { label: "Trade", value: "trade" as ViewMode },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setMode(tab.value)}
                  className={`rounded-full px-3 py-2 text-[10px] tracking-[0.22em] uppercase transition-colors ${
                    mode === tab.value
                      ? "bg-foreground text-background"
                      : "text-text-muted hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowFilters((value) => !value)}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-[10px] tracking-[0.22em] uppercase lg:hidden"
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && <span className="h-2 w-2 rounded-full bg-gold" />}
            </button>

            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-[10px] tracking-[0.24em] uppercase text-text-muted">
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className={`space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
          <div className="sticky top-40 rounded-[20px] border border-border bg-card p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] tracking-[0.28em] uppercase text-text-muted">Filters</p>
              </div>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-gold lg:hidden">
                  Reset
                </button>
              )}
            </div>

            <div className="border-t border-border pt-5">
              <p className="mb-3 text-[10px] tracking-[0.24em] uppercase text-text-muted">
                Price range
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  type="number"
                  value={priceRange[0]}
                  onChange={(event) => setPriceRange([Number(event.target.value), priceRange[1]])}
                  placeholder="0"
                />
                <Input
                  type="number"
                  value={priceRange[1]}
                  onChange={(event) => setPriceRange([priceRange[0], Number(event.target.value)])}
                  placeholder="1000"
                />
              </div>
            </div>
          </div>
        </aside>

        <section className="space-y-6">
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {activeCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-[10px] tracking-[0.2em] uppercase text-foreground"
                >
                  {categories.find((item) => item.id === category)?.name}
                  <X className="h-3 w-3" />
                </button>
              ))}
              {query.trim() && (
                <button
                  onClick={() => setQuery("")}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-[10px] tracking-[0.2em] uppercase text-foreground"
                >
                  {query}
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          )}

          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="rounded-[28px] border border-border bg-card px-8 py-16 text-center">
              <p className="text-lg text-text-muted">No products match the current filters.</p>
              <button
                onClick={clearFilters}
                className="mt-4 text-[10px] tracking-[0.24em] uppercase text-gold"
              >
                Reset filters
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
