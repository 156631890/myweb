import { NextResponse } from "next/server";
import { refreshCatalogProducts } from "@/lib/catalog-ingest";

export async function POST() {
  const result = await refreshCatalogProducts();

  return NextResponse.json({
    ok: true,
    ...result,
  });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "POST to import source feeds and regenerate the catalog data module.",
  });
}
