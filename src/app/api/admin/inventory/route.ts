import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { adjustInventory } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId, quantity, lowStockThreshold, isPublished } = await req.json();
    if (!productId || typeof quantity !== "number") {
      return NextResponse.json({ error: "productId and numeric quantity required" }, { status: 400 });
    }

    const updated = await adjustInventory(productId, quantity, lowStockThreshold, isPublished);
    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    try {
      revalidatePath("/", "layout");
      revalidatePath("/shop");
      revalidatePath(`/shop/${updated.slug}`);
      revalidatePath("/admin/inventory");
      revalidatePath("/admin/products");
      revalidatePath("/admin");
    } catch (revErr) {
      console.warn("Revalidation warning:", revErr);
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("Inventory adjust error:", error);
    return NextResponse.json({ error: "Failed to update stock" }, { status: 500 });
  }
}

