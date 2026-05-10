import { db } from "@/db/drizzle";
import { postsTable } from "@/db/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const posts = await db.select().from(postsTable).orderBy(desc(postsTable.createdAt));
        
        return NextResponse.json({
            success: true,
            data: posts
        }, { status: 200 });
        
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message || "Failed to fetch posts"
        }, { status: 500 });
    }
}
