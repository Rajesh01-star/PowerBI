import { db } from "@/db/drizzle";
import { postsTable } from "@/db/schema";
import { POST_PUBLIC_FIELDS, getOrderByClause } from "@/db/queries";
import { arrayContains } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const sort = searchParams.get("sort") || "views";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const tagsParam = searchParams.get("tags");
        const tags = tagsParam ? tagsParam.split(",").map(t => t.trim()).filter(Boolean) : [];

        const orderByClause = getOrderByClause(sort);
        const offset = (page - 1) * limit;
        const whereClause = tags.length > 0 ? arrayContains(postsTable.tags, tags) : undefined;

        const posts = await db
            .select(POST_PUBLIC_FIELDS)
            .from(postsTable)
            .where(whereClause)
            .orderBy(orderByClause)
            .limit(limit)
            .offset(offset);

        return NextResponse.json({
            success: true,
            data: posts,
            page,
            limit
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message || "Failed to fetch posts",
        }, { status: 500 });
    }
}
