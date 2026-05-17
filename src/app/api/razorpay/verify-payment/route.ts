import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db/drizzle";
import { ordersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET!;

    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Payment is verified
    // Update order status in the database
    await db
      .update(ordersTable)
      .set({ status: "paid", paymentId: razorpay_payment_id })
      .where(eq(ordersTable.id, razorpay_order_id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}
