import { db } from "@/db/drizzle";
import { postsTable } from "@/db/schema";
import { desc, asc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const sort = searchParams.get("sort") || "views";

        let orderByClause;
        switch (sort) {
            case "newest":
                orderByClause = desc(postsTable.createdAt);
                break;
            case "oldest":
                orderByClause = asc(postsTable.createdAt);
                break;
            case "atoz":
                orderByClause = asc(postsTable.title);
                break;
            case "views":
            default:
                orderByClause = desc(postsTable.views);
                break;
        }

        const posts = await db
            .select()
            .from(postsTable)
            .orderBy(orderByClause);

        return NextResponse.json({
            success: true,
            data: posts,
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message || "Failed to fetch posts",
        }, { status: 500 });
    }
}
