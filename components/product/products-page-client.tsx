"use client";

import React, { useMemo, useState } from "react";
import { ChevronRight, Filter, X } from "lucide-react";
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

function getBrandBucket(brand: string) {
  const normalized = brand
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  const letter = normalized[0]?.toUpperCase() ?? "#";
  return /^[A-Z]$/.test(letter) ? letter : "#";
}

function groupBrands(brands: string[]) {
  return brands.reduce<Record<string, string[]>>((groups, brand) => {
    const letter = getBrandBucket(brand);
    (groups[letter] ??= []).push(brand);
    return groups;
  }, {});
}

function formatPriceRange(range: [number, number]) {
  if (range[0] === 0 && range[1] === 1000) {
    return "All prices";
  }

  return `$${range[0].toFixed(0)} - $${range[1].toFixed(0)}`;
}

export default function ProductsPageClient() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as CategorySlug | null;
  const initialBrand = searchParams.get("brand") ?? "";
  const categoryIds = useMemo(() => categories.map((category) => category.id), []);

  const [activeCategories, setActiveCategories] = useState<CategorySlug[]>(
    initialCategory && categoryIds.includes(initialCategory) ? [initialCategory] : []
  );
  const [activeBrands, setActiveBrands] = useState<string[]>(initialBrand ? [initialBrand] : []);
  const [mode, setMode] = useState<ViewMode>("retail");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const catalog = useMemo(() => getProductsForView(mode), [mode]);

  const brandOptions = useMemo(
    () => Array.from(new Set(catalog.map((product) => product.brand))).sort(),
    [catalog]
  );

  const brandGroups = useMemo(() => groupBrands(brandOptions), [brandOptions]);
  const brandInitials = useMemo(() => Object.keys(brandGroups).sort((a, b) => a.localeCompare(b)), [brandGroups]);

  const brandCounts = useMemo(
    () =>
      catalog.reduce<Record<string, number>>((counts, product) => {
        counts[product.brand] = (counts[product.brand] ?? 0) + 1;
        return counts;
      }, {}),
    [catalog]
  );

  const selectedCategories = useMemo(
    () => categories.filter((category) => activeCategories.includes(category.id)),
    [activeCategories]
  );

  const filteredProducts = useMemo(() => {
    let result = [...catalog];

    if (activeCategories.length > 0) {
      result = result.filter((product) => activeCategories.includes(product.category));
    }

    if (activeBrands.length > 0) {
      result = result.filter((product) => activeBrands.includes(product.brand));
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
  }, [activeBrands, activeCategories, catalog, priceRange, query, sortBy]);

  const directorySummary = useMemo(() => {
    const brandText =
      activeBrands.length === 0
        ? "All brands"
        : activeBrands.length === 1
          ? activeBrands[0]
          : `${activeBrands.length} brands selected`;

    const categoryText =
      selectedCategories.length === 0
        ? "All categories"
        : selectedCategories.length === 1
          ? selectedCategories[0].name
          : `${selectedCategories.length} categories selected`;

    return [
      `${filteredProducts.length.toString().padStart(2, "0")} listings`,
      brandText,
      categoryText,
      formatPriceRange(priceRange),
    ];
  }, [activeBrands, filteredProducts.length, priceRange, selectedCategories]);

  const hasActiveFilters =
    activeCategories.length > 0 ||
    activeBrands.length > 0 ||
    query.trim() !== "" ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 1000;

  const toggleCategory = (category: CategorySlug) => {
    setActiveCategories((current) =>
      current.includes(category) ? current.filter((item) => item !== category) : [...current, category]
    );
  };

  const toggleBrand = (brand: string) => {
    setActiveBrands((current) =>
      current.includes(brand) ? current.filter((item) => item !== brand) : [...current, brand]
    );
  };

  const clearFilters = () => {
    setActiveCategories([]);
    setActiveBrands([]);
    setQuery("");
    setPriceRange([0, 1000]);
    setSortBy("newest");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="mb-8 grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div className="space-y-4">
          <p className="text-[10px] tracking-[0.34em] uppercase text-text-muted">Directory</p>
          <h1 className="max-w-md text-4xl sm:text-5xl">
            {mode === "trade" ? "Trade inventory" : "Directory listings"}
          </h1>
          <p className="max-w-lg text-base leading-8 text-text-muted">
            Browse the directory by brand, category, and price. Product pages stay public and
            shareable for retail customers, social forwarding, and trade follow-up.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-start gap-3 lg:justify-end">
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
                    ? "bg-gold text-primary-foreground"
                    : "text-text-muted hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="rounded-full border border-border bg-card px-5 py-3 text-[10px] tracking-[0.24em] uppercase text-text-muted">
            {filteredProducts.length} items
          </div>
        </div>
      </div>

      <div className="sticky top-20 z-20 mb-8 rounded-[28px] border border-border bg-card/90 p-4 shadow-sm backdrop-blur-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <Input
              label="Search directory"
              placeholder="Search brand, category, or product"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <div className="sm:w-56">
              <Select
                label="Sort"
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
                      ? "bg-gold text-primary-foreground"
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
              <button onClick={clearFilters} className="text-[10px] tracking-[0.24em] uppercase text-gold">
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-[24px] border border-border bg-card/75 p-4 backdrop-blur-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-text-muted">Directory summary</p>
            <p className="mt-2 text-sm leading-7 text-text-muted">
              A working catalog sheet for buyers, with active filters and range context shown up front.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-[10px] tracking-[0.24em] uppercase">
            {directorySummary.map((item) => (
              <span key={item} className="rounded-full border border-border bg-background px-3 py-2 text-text-muted">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <aside className={`space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
          <div className="sticky top-40 rounded-[32px] border border-border bg-card/80 p-5 backdrop-blur-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] tracking-[0.28em] uppercase text-text-muted">Brand index</p>
                <p className="mt-2 text-sm text-text-muted">{brandOptions.length} brands / A-Z index</p>
              </div>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-gold lg:hidden">
                  Reset
                </button>
              )}
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              {brandInitials.map((letter) => (
                <a
                  key={letter}
                  href={`#brand-${letter}`}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-[10px] tracking-[0.22em] uppercase text-text-muted transition-colors hover:border-gold/30 hover:text-gold"
                >
                  {letter}
                </a>
              ))}
            </div>

            <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
              {brandInitials.map((letter) => (
                <div key={letter} id={`brand-${letter}`} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] tracking-[0.3em] uppercase text-text-muted">{letter}</p>
                    <p className="text-[10px] tracking-[0.22em] uppercase text-text-muted">
                      {brandGroups[letter].length.toString().padStart(2, "0")} brands
                    </p>
                  </div>
                  <div className="space-y-2">
                    {brandGroups[letter].map((brand) => {
                      const active = activeBrands.includes(brand);
                      return (
                        <button
                          key={brand}
                          onClick={() => toggleBrand(brand)}
                          className={`flex w-full items-center justify-between rounded-2xl border px-3.5 py-2.5 text-left transition-colors ${
                            active
                              ? "border-gold bg-gold/10 text-foreground"
                              : "border-border bg-background text-text-muted hover:border-gold/30"
                          }`}
                        >
                          <span className="flex items-center gap-3 text-sm">
                            <span>{brand}</span>
                            <span className="hidden text-[10px] tracking-[0.18em] uppercase text-text-muted sm:inline">
                              open
                            </span>
                          </span>
                          <span className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase">
                            {String(brandCounts[brand] ?? 0).padStart(2, "0")}
                            <ChevronRight className="h-3 w-3" />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-border pt-5">
              <p className="mb-3 text-[10px] tracking-[0.24em] uppercase text-text-muted">
                Category filter
              </p>
              <div className="space-y-2">
                {categories.map((category) => {
                  const active = activeCategories.includes(category.id);
                  return (
                    <button
                      key={category.id}
                      onClick={() => toggleCategory(category.id)}
                      className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors ${
                        active
                          ? "border-gold bg-gold/10 text-foreground"
                          : "border-border bg-background text-text-muted hover:border-gold/30"
                      }`}
                    >
                      <span className="text-sm">{category.name}</span>
                      <span className="text-[10px] tracking-[0.2em] uppercase">
                        {String(category.productCount).padStart(2, "0")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 border-t border-border pt-5">
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
              {activeBrands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => toggleBrand(brand)}
                  className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-3 py-2 text-[10px] tracking-[0.2em] uppercase text-gold"
                >
                  {brand}
                  <X className="h-3 w-3" />
                </button>
              ))}
              {activeCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-3 py-2 text-[10px] tracking-[0.2em] uppercase text-gold"
                >
                  {categories.find((item) => item.id === category)?.name}
                  <X className="h-3 w-3" />
                </button>
              ))}
              {query.trim() && (
                <button
                  onClick={() => setQuery("")}
                  className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-3 py-2 text-[10px] tracking-[0.2em] uppercase text-gold"
                >
                  Search: {query}
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
