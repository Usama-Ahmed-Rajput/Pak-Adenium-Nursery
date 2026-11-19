import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { getSiteSettings, updateSiteSettings } from "@/lib/db";

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await updateSiteSettings(body);

    try {
      revalidatePath("/", "layout");
      revalidatePath("/about");
      revalidatePath("/contact");
      revalidatePath("/shop");
      revalidatePath("/admin/settings");
    } catch (revErr) {
      console.warn("Settings revalidate warning:", revErr);
    }

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}

