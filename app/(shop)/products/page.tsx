import { Suspense } from "react";
import ProductsPageClient from "@/components/product/products-page-client";

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="text-sm text-text-muted">Loading directory listings...</p>
        </div>
      }
    >
      <ProductsPageClient />
    </Suspense>
  );
}
