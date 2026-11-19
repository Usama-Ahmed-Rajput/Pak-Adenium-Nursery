import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getCustomers } from "@/lib/db";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const customers = await getCustomers();
  return NextResponse.json({ customers });
}

