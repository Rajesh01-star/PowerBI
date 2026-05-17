import { db } from "@/db/drizzle";
import { postsTable } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Post ID is required" },
                { status: 400 }
            );
        }

        // Atomically increment the views count
        const result = await db
            .update(postsTable)
            .set({ views: sql`${postsTable.views} + 1` })
            .where(eq(postsTable.id, id))
            .returning({ views: postsTable.views });

        if (result.length === 0) {
            return NextResponse.json(
                { success: false, error: "Post not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, views: result[0].views },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message || "Failed to update views" },
            { status: 500 }
        );
    }
}
