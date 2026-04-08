import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/product/product-detail-client";
import { getProductBySlug, getRelatedProducts, products } from "@/lib/products";

interface ProductPageProps {
  params: { slug: string } | Promise<{ slug: string }>;
}

async function resolveParams(params: ProductPageProps["params"]) {
  return Promise.resolve(params);
}

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await resolveParams(params);
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product not found",
    };
  }

  return {
    title: product.seo.title,
    description: product.seo.description,
    keywords: product.seo.keywords,
    openGraph: {
      title: product.seo.title,
      description: product.seo.description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: product.seo.title,
      description: product.seo.description,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await resolveParams(params);
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product.id, product.category);

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
