import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { getOrders, updateOrderStatus } from "@/lib/db";
import { OrderStatus, PaymentStatus } from "@/types";

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const orders = await getOrders(status);
  return NextResponse.json({ orders });
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { orderId, orderStatus, paymentStatus, adminNotes, trackingNumber, courierName } = body;

    if (!orderId || !orderStatus) {
      return NextResponse.json({ error: "orderId and orderStatus are required" }, { status: 400 });
    }

    const updated = await updateOrderStatus(
      orderId,
      orderStatus as OrderStatus,
      paymentStatus as PaymentStatus | undefined,
      adminNotes,
      trackingNumber,
      courierName
    );

    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    try {
      revalidatePath("/admin/orders");
      revalidatePath("/admin");
      revalidatePath("/order-lookup");
    } catch (revErr) {
      console.warn("Revalidation warning:", revErr);
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Order status update error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

