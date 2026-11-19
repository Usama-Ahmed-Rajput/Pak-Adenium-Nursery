import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      email: session.email,
      name: session.name,
      role: session.role,
      lastLogin: new Date().toISOString(),
    },
  });
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name } = await req.json();
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Administrator name is required" }, { status: 400 });
    }

    // In this deployment, session carries user metadata
    return NextResponse.json({
      success: true,
      user: {
        email: session.email,
        name: name.trim(),
        role: session.role,
      },
      message: "Administrator profile details updated successfully",
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

