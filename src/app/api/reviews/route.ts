import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { submitReview } from "@/lib/db";

const reviewSchema = z.object({
  product_id: z.string().uuid("Valid product ID is required"),
  customer_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5, "Review comment must be at least 5 characters").max(1500),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = reviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.errors[0]?.message || "Invalid review submission",
        },
        { status: 400 }
      );
    }

    const review = await submitReview({
      product_id: parsed.data.product_id,
      customer_name: parsed.data.customer_name,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
    });

    return NextResponse.json({
      success: true,
      review: {
        id: review.id,
        product_id: review.product_id,
        customer_name: review.customer_name,
        rating: review.rating,
        is_approved: review.is_approved,
        created_at: review.created_at,
      },
      message: "Thank you! Your review has been submitted for moderation.",
    });
  } catch (error) {
    console.error("Review submission error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit review" },
      { status: 500 }
    );
  }
}

