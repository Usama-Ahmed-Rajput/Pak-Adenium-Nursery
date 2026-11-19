import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { listMediaFiles, deleteMediaFile } from "@/lib/storage";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const media = await listMediaFiles();
    return NextResponse.json({ media });
  } catch (error) {
    console.error("List media error:", error);
    return NextResponse.json({ error: "Failed to list media" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("filename");

  if (!filename) {
    return NextResponse.json({ error: "Filename is required" }, { status: 400 });
  }

  try {
    const deleted = await deleteMediaFile(filename);
    if (deleted) {
      return NextResponse.json({ success: true, message: "File removed from storage" });
    } else {
      return NextResponse.json({ error: "File not found or could not be removed" }, { status: 404 });
    }
  } catch (error) {
    console.error("Delete media error:", error);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
