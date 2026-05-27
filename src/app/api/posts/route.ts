import { db } from "@/db/drizzle";
import { postsTable } from "@/db/schema";
import { desc, asc, arrayContains } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const sort = searchParams.get("sort") || "views";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const tagsParam = searchParams.get("tags");
        const tags = tagsParam ? tagsParam.split(",").map(t => t.trim()).filter(Boolean) : [];

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

        const offset = (page - 1) * limit;
        const whereClause = tags.length > 0 ? arrayContains(postsTable.tags, tags) : undefined;

        const posts = await db
            .select({
                id: postsTable.id,
                title: postsTable.title,
                description: postsTable.description,
                price: postsTable.price,
                url: postsTable.url,
                aspect: postsTable.aspect,
                imageUrl: postsTable.imageUrl,
                thumbnails: postsTable.thumbnails,
                activeThumbnailIndex: postsTable.activeThumbnailIndex,
                tags: postsTable.tags,
                references: postsTable.references,
                userId: postsTable.userId,
                views: postsTable.views,
                createdAt: postsTable.createdAt,
                updatedAt: postsTable.updatedAt
            })
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
