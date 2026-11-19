import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createOrder } from "@/lib/db";

const orderSchema = z.object({
  customer_name: z.string().min(2, "Full name is required (minimum 2 letters)"),
  customer_phone: z.string().min(10, "Valid Pakistani phone number required (e.g. 03001234567)"),
  customer_whatsapp: z.string().min(10, "WhatsApp number is required"),
  customer_email: z.string().email().optional().or(z.literal("")),
  province: z.string().min(2, "Province is required"),
  city: z.string().min(2, "City is required"),
  area: z.string().optional(),
  shipping_address: z.string().min(8, "Complete delivery address is required"),
  order_notes: z.string().optional(),
  payment_method: z.enum(["Cash on Delivery", "Bank Transfer", "EasyPaisa/JazzCash"]),
  items: z.array(
    z.object({
      product_id: z.string(),
      quantity: z.number().int().positive(),
    })
  ).min(1, "Shopping bag must contain at least 1 item"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = orderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const result = await createOrder(parsed.data);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to place order" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      order: result.order,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error("Order creation route error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while placing your order" },
      { status: 500 }
    );
  }
}

