import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { db } from "@/db/drizzle";
import { ordersTable, postsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const { postId } = await req.json();

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    // Fetch the post to get the price
    const [post] = await db.select().from(postsTable).where(eq(postsTable.id, postId)).limit(1);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // If price is 0 or null, we shouldn't use razorpay
    const amountInCents = post.price ? Math.round(parseFloat(post.price) * 100) : 0;

    if (amountInCents <= 0) {
      return NextResponse.json({ error: "Invalid price for Razorpay" }, { status: 400 });
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // Create an order
    const options = {
      amount: amountInCents, // amount in smallest currency unit
      currency: "USD",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Save order in database
    await db.insert(ordersTable).values({
      id: order.id,
      userId: session?.user?.id || null,
      postId: post.id,
      amount: post.price || "0",
      status: "created",
    });

    return NextResponse.json({ orderId: order.id, amount: options.amount, currency: options.currency });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
