import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : q.trim() ? 8 : 50;

  if (!q.trim()) {
    // Return published catalog specimens (used by Plant Finder, catalog widgets, etc.)
    const products = await getProducts({ limit });
    return NextResponse.json({ products });
  }

  const products = await getProducts({ search: q, limit });
  return NextResponse.json({ products });
}

