import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { ordersTable, postsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Join orders (status = 'paid') with posts to get template details
    const purchases = await db
      .select({
        orderId: ordersTable.id,
        paymentId: ordersTable.paymentId,
        amount: ordersTable.amount,
        purchasedAt: ordersTable.createdAt,
        postId: postsTable.id,
        title: postsTable.title,
        description: postsTable.description,
        price: postsTable.price,
        url: postsTable.url,
        aspect: postsTable.aspect,
        imageUrl: postsTable.imageUrl,
        thumbnails: postsTable.thumbnails,
        activeThumbnailIndex: postsTable.activeThumbnailIndex,
      })
      .from(ordersTable)
      .innerJoin(postsTable, eq(ordersTable.postId, postsTable.id))
      .where(
        and(
          eq(ordersTable.userId, session.user.id),
          eq(ordersTable.status, "paid")
        )
      )
      .orderBy(ordersTable.createdAt);

    return NextResponse.json({ purchases });
  } catch (error) {
    console.error("Error fetching purchases:", error);
    return NextResponse.json({ error: "Failed to fetch purchases" }, { status: 500 });
  }
}
