import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { getAllProductsAdmin, saveProduct, deleteProduct } from "@/lib/db";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await getAllProductsAdmin();
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.name || (body.price === undefined || body.price === null)) {
      return NextResponse.json({ error: "Product name and price are required" }, { status: 400 });
    }

    const saved = await saveProduct(body);

    // Refresh Next.js cache so changes immediately appear across storefront and admin
    try {
      revalidatePath("/", "layout");
      revalidatePath("/shop");
      revalidatePath(`/shop/${saved.slug}`);
      revalidatePath("/admin/products");
      revalidatePath("/admin/inventory");
      revalidatePath("/admin");
    } catch (revErr) {
      console.warn("Revalidation warning:", revErr);
    }

    return NextResponse.json({ success: true, product: saved });
  } catch (error) {
    console.error("Save product error:", error);
    return NextResponse.json({ error: "Failed to save product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Product ID required" }, { status: 400 });
  }

  const deleted = await deleteProduct(id);
  if (!deleted) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  try {
    revalidatePath("/", "layout");
    revalidatePath("/shop");
    revalidatePath("/admin/products");
    revalidatePath("/admin/inventory");
    revalidatePath("/admin");
  } catch (revErr) {
    console.warn("Revalidation warning:", revErr);
  }

  return NextResponse.json({ success: true });
}

