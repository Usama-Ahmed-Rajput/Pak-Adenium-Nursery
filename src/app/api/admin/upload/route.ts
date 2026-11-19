import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { uploadMediaFile } from "@/lib/storage";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

const MAX_FILE_SIZE = 6 * 1024 * 1024; // 6MB

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized: Administrator credentials required" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided in request" }, { status: 400 });
    }

    const mimeType = file.type.toLowerCase();
    if (!ALLOWED_TYPES.has(mimeType)) {
      return NextResponse.json(
        {
          error: `Unsupported image format (${file.type}). Allowed types: JPEG, PNG, WebP, AVIF, GIF.`,
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `Image file is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed limit is 6MB.`,
        },
        { status: 400 }
      );
    }

    const uploaded = await uploadMediaFile(file, file.name);

    return NextResponse.json({
      success: true,
      url: uploaded.url,
      filename: uploaded.filename,
      size: uploaded.size,
      mimeType: file.type,
      isCloud: uploaded.isCloud,
      uploadedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Upload handler exception:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to store image file on server." },
      { status: 500 }
    );
  }
}
