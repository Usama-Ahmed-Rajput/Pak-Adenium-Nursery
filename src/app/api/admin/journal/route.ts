import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { getAllArticlesAdmin, saveArticle, deleteArticle } from "@/lib/db";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const articles = await getAllArticlesAdmin();
  return NextResponse.json({ articles });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.title || !body.content) {
      return NextResponse.json({ error: "Article title and content required" }, { status: 400 });
    }

    const saved = await saveArticle(body);

    try {
      revalidatePath("/", "layout");
      revalidatePath("/journal");
      revalidatePath(`/journal/${saved.slug}`);
      revalidatePath("/admin/journal");
    } catch (revErr) {
      console.warn("Journal revalidate warning:", revErr);
    }

    return NextResponse.json({ success: true, article: saved });
  } catch (error) {
    console.error("Save article error:", error);
    return NextResponse.json({ error: "Failed to save article" }, { status: 500 });
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
    return NextResponse.json({ error: "Article ID required" }, { status: 400 });
  }

  const deleted = await deleteArticle(id);
  if (!deleted) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  try {
    revalidatePath("/", "layout");
    revalidatePath("/journal");
    revalidatePath("/admin/journal");
  } catch (revErr) {
    console.warn("Journal revalidate warning:", revErr);
  }

  return NextResponse.json({ success: true });
}

