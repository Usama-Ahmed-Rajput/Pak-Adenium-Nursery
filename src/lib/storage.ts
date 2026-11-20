import fs from "fs";
import path from "path";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase/server";

const BUCKET_NAME = "product-media";

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "image/gif": ".gif",
};

export interface StoredMediaFile {
  filename: string;
  url: string;
  size: number;
  createdAt: string;
  isCloudStorage: boolean;
}

/**
 * Checks if cloud storage credentials are configured.
 */
export function isCloudStorageConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(url && key && key.trim() !== "" && key !== '""' && key !== "''");
}

/**
 * Uploads an image file to Supabase Storage (if configured) or local disk (development fallback).
 */
export async function uploadMediaFile(
  file: File,
  originalFilename: string
): Promise<{ success: boolean; url: string; filename: string; size: number; isCloud: boolean }> {
  const mimeType = file.type.toLowerCase();
  const ext = MIME_TO_EXT[mimeType];

  if (!ext) {
    throw new Error(`Unsupported image format: ${file.type}`);
  }

  // Sanitize filename base to alphanumeric + hyphens/underscores
  const sanitizedBase = path
    .basename(originalFilename, path.extname(originalFilename))
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .substring(0, 30);
  const uniqueSuffix = crypto.randomBytes(6).toString("hex");
  const filename = `adenium-${sanitizedBase}-${uniqueSuffix}${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (isCloudStorageConfigured()) {
    // Cloud storage path in Supabase via supabaseAdmin
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filename, buffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) {
      console.error("[Storage] Supabase upload failed:", error);
      throw new Error(`Supabase Storage upload error: ${error.message}`);
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filename);

    return {
      success: true,
      url: publicUrlData.publicUrl,
      filename,
      size: file.size,
      isCloud: true,
    };
  }

  // Local filesystem fallback
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, buffer);

  return {
    success: true,
    url: `/uploads/${filename}`,
    filename,
    size: file.size,
    isCloud: false,
  };
}

/**
 * Lists all uploaded media files from either Supabase Storage or local directory.
 */
export async function listMediaFiles(): Promise<StoredMediaFile[]> {
  if (isCloudStorageConfigured()) {
    const { data, error } = await supabaseAdmin.storage.from(BUCKET_NAME).list("", {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" },
    });

    if (error) {
      console.error("[Storage] Failed to list Supabase files:", error);
      return [];
    }

    return (data || [])
      .filter((item) => !item.name.startsWith("."))
      .map((item) => {
        const { data: urlData } = supabaseAdmin.storage.from(BUCKET_NAME).getPublicUrl(item.name);
        return {
          filename: item.name,
          url: urlData.publicUrl,
          size: item.metadata?.size || 0,
          createdAt: item.created_at || new Date().toISOString(),
          isCloudStorage: true,
        };
      });
  }

  // Local storage listing
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    return [];
  }

  const files = fs.readdirSync(uploadsDir);
  return files
    .filter((file) => !file.startsWith("."))
    .map((file) => {
      const fullPath = path.join(uploadsDir, file);
      const stats = fs.statSync(fullPath);
      return {
        filename: file,
        url: `/uploads/${file}`,
        size: stats.size,
        createdAt: stats.birthtime.toISOString(),
        isCloudStorage: false,
      };
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Deletes a media file from Supabase Storage or local disk.
 */
export async function deleteMediaFile(filename: string): Promise<boolean> {
  const sanitized = path.basename(filename);

  if (isCloudStorageConfigured()) {
    const { error } = await supabaseAdmin.storage.from(BUCKET_NAME).remove([sanitized]);
    if (error) {
      console.error("[Storage] Failed to delete from Supabase:", error);
      return false;
    }
    return true;
  }

  // Local storage deletion
  const filePath = path.join(process.cwd(), "public", "uploads", sanitized);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }

  return false;
}
