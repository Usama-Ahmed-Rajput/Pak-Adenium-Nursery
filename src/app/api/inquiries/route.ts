import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { submitInquiry, getInquiries } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

const inquirySchema = z.object({
  name: z.string().min(2, "Full name is required (minimum 2 letters)"),
  phone: z.string().min(7, "Valid phone/WhatsApp number is required"),
  email: z.string().email("Valid email address required").optional().or(z.literal("")),
  subject: z.string().optional(),
  message: z.string().min(5, "Message must contain at least 5 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = inquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.errors[0]?.message || "Invalid inquiry details",
        },
        { status: 400 }
      );
    }

    const inquiry = await submitInquiry({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || undefined,
      subject: parsed.data.subject || undefined,
      message: parsed.data.message,
    });

    return NextResponse.json({
      success: true,
      inquiry,
      message: "Your inquiry has been received. Our nursery team will reach out shortly.",
    });
  } catch (error: any) {
    console.error("Inquiry submission route error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to process your message. Please try again.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const inquiries = await getInquiries();
  return NextResponse.json({ inquiries });
}

