import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { getCategories, saveCategory, deleteCategory } from "@/lib/db";

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const saved = await saveCategory(body);

    try {
      revalidatePath("/", "layout");
      revalidatePath("/shop");
      revalidatePath("/admin/categories");
      revalidatePath("/admin/products");
    } catch (revErr) {
      console.warn("Category revalidate warning:", revErr);
    }

    return NextResponse.json({ success: true, category: saved });
  } catch (error) {
    console.error("Save category error:", error);
    return NextResponse.json({ error: "Failed to save category" }, { status: 500 });
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
    return NextResponse.json({ error: "Category ID required" }, { status: 400 });
  }

  const deleted = await deleteCategory(id);
  if (!deleted) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  try {
    revalidatePath("/", "layout");
    revalidatePath("/shop");
    revalidatePath("/admin/categories");
  } catch (revErr) {
    console.warn("Category revalidate warning:", revErr);
  }

  return NextResponse.json({ success: true });
}

