"use server";

import { db } from "@/db/drizzle";
import { postsTable, ordersTable, systemSettingsTable } from "@/db/schema";
import { POST_SELECT_FIELDS, POST_PUBLIC_FIELDS, getOrderByClause } from "@/db/queries";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq, desc, sql, arrayContains, and } from "drizzle-orm";
import { getUploadPresignedUrl, getDownloadPresignedUrl } from "@/lib/r2";
import { v4 as uuidv4 } from "uuid";

async function requireAdmin() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session || !session.user || !session.user.isAdmin) {
        throw new Error("Unauthorized: Only admins can perform this action");
    }
    return session;
}

async function requireAuth() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }
    return session;
}

function parseFormFields(formData: FormData) {
    return {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        price: formData.get("price") as string,
        url: formData.get("url") as string,
        aspect: formData.get("aspect") as 'horizontal' | 'vertical',
        activeThumbnailIndex: parseInt(formData.get("activeThumbnailIndex") as string || "0"),
        assetType: (formData.get("assetType") as 'powerbi' | 'uiux') || 'powerbi',
        sourceLink: formData.get("sourceLink") as string,
        tags: JSON.parse(formData.get("tags") as string || "[]"),
        thumbnails: JSON.parse(formData.get("thumbnails") as string || "[]"),
        references: JSON.parse(formData.get("references") as string || "[]"),
        fileUrl: formData.get("fileUrl") as string | null,
    };
}

export async function getUploadUrlAction(fileName: string, fileType: string, isPublic = false, postId?: string) {
    await requireAdmin();

    const folderId = postId || uuidv4();
    const subFolder = isPublic ? "images" : "zip";
    const fileKey = `templates/${folderId}/${subFolder}/${uuidv4()}-${fileName}`;
    const uploadUrl = await getUploadPresignedUrl(fileKey, fileType, isPublic);

    return { uploadUrl, fileKey };
}

export async function createPostAction(formData: FormData) {
    const session = await requireAdmin();
    const fields = parseFormFields(formData);

    if (!fields.title) {
         throw new Error("Title is required");
    }

    await db.insert(postsTable).values({
        title: fields.title,
        description: fields.description || null,
        price: fields.price ? fields.price : null,
        url: fields.url || null,
        aspect: fields.aspect || 'horizontal',
        thumbnails: fields.thumbnails,
        activeThumbnailIndex: fields.activeThumbnailIndex,
        assetType: fields.assetType,
        sourceLink: fields.sourceLink || null,
        tags: fields.tags,
        fileUrl: fields.fileUrl,
        references: fields.references,
        userId: session.user.id
    });

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin");

    return { success: true };
}

export async function updatePostAction(formData: FormData) {
    await requireAdmin();
    const fields = parseFormFields(formData);
    const id = formData.get("id") as string;

    if (!id || !fields.title) {
         throw new Error("ID and Title are required");
    }

    const updateData: any = {
        title: fields.title,
        description: fields.description || null,
        price: fields.price ? fields.price : null,
        url: fields.url || null,
        aspect: fields.aspect || 'horizontal',
        thumbnails: fields.thumbnails,
        activeThumbnailIndex: fields.activeThumbnailIndex,
        assetType: fields.assetType,
        sourceLink: fields.sourceLink || null,
        tags: fields.tags,
        references: fields.references,
    };

    if (fields.fileUrl) {
        updateData.fileUrl = fields.fileUrl;
    }

    await db.update(postsTable).set(updateData).where(eq(postsTable.id, id));

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin");

    return { success: true };
}

export async function getPostsAction() {
    await requireAdmin();

    const posts = await db.select(POST_SELECT_FIELDS)
        .from(postsTable)
        .orderBy(desc(postsTable.createdAt));
    return posts;
}

export async function getPublicPostsAction(sort: string = 'views', tags: string[] = []) {
    const orderByClause = getOrderByClause(sort);
    const whereClause = tags && tags.length > 0 ? arrayContains(postsTable.tags, tags) : undefined;

    const posts = await db.select(POST_PUBLIC_FIELDS)
        .from(postsTable)
        .where(whereClause)
        .orderBy(orderByClause);
    return posts;
}

export async function getPublicPostsByTypeAction(type: 'powerbi' | 'uiux', sort: string = 'views') {
    const orderByClause = getOrderByClause(sort);

    const posts = await db.select(POST_PUBLIC_FIELDS)
        .from(postsTable)
        .where(eq(postsTable.assetType, type))
        .orderBy(orderByClause);
    return posts;
}

export async function getPublicPostByIdAction(id: string) {
    const posts = await db.select(POST_PUBLIC_FIELDS)
        .from(postsTable)
        .where(eq(postsTable.id, id));
    return posts[0] || null;
}

export async function getPostFileUrlAction(id: string) {
    const session = await requireAuth();

    if (!session.user.isAdmin) {
        const purchases = await db.select().from(ordersTable).where(
            and(
                eq(ordersTable.userId, session.user.id),
                eq(ordersTable.postId, id),
                eq(ordersTable.status, "paid")
            )
        );

        if (purchases.length === 0) {
            // Also check if the post is free
            const post = await db.select({ price: postsTable.price }).from(postsTable).where(eq(postsTable.id, id));
            const isFree = !post[0]?.price || parseFloat(post[0].price) <= 0;
            if (!isFree) {
                throw new Error("You have not purchased this template");
            }
        }
    }

    const posts = await db.select({ fileUrl: postsTable.fileUrl, title: postsTable.title }).from(postsTable).where(eq(postsTable.id, id));
    const fileUrl = posts[0]?.fileUrl;
    if (!fileUrl) return null;

    // If it is a legacy base64 URI, return it directly
    if (fileUrl.startsWith("data:")) {
        return fileUrl;
    }

    // Otherwise, it is an R2 key. Generate a temporary download URL.
    try {
        const signedUrl = await getDownloadPresignedUrl(fileUrl, `${posts[0].title || 'template'}.zip`);
        return signedUrl;
    } catch (error) {
        console.error("Failed to generate download URL from R2:", error);
        throw new Error("Failed to generate download link.");
    }
}

export async function getMarketplaceStatsAction() {
    try {
        // 1. Total templates count in DB
        const postsCountResult = await db.select({ count: sql<number>`count(*)` }).from(postsTable);
        const templatesCount = Number(postsCountResult[0]?.count || 0);

        // 2. Unique creators count
        const creatorsCountResult = await db.select({ count: sql<number>`count(distinct ${postsTable.userId})` }).from(postsTable);
        const creatorsCount = Number(creatorsCountResult[0]?.count || 0);

        // 3. New templates in last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newReportsResult = await db.select({ count: sql<number>`count(*)` }).from(postsTable).where(
            sql`${postsTable.createdAt} >= ${thirtyDaysAgo}`
        );
        const newMonthlyReports = Number(newReportsResult[0]?.count || 0);

        // 4. Sum of all views across all posts
        const totalViewsResult = await db.select({ totalViews: sql<number>`sum(${postsTable.views})` }).from(postsTable);
        const reportViews = Number(totalViewsResult[0]?.totalViews || 0);

        return {
            templatesCount,
            creatorsCount,
            newMonthlyReports,
            reportViews,
        };
    } catch (err) {
        console.error("Failed to fetch products stats:", err);
        return {
            templatesCount: 0,
            creatorsCount: 0,
            newMonthlyReports: 0,
            reportViews: 0,
        };
    }
}

export async function getSystemSettingsAction() {
    try {
        const settings = await db.select().from(systemSettingsTable);
        const hidePowerbi = settings.find(s => s.key === "hide_powerbi")?.value === "true";
        const hideUiux = settings.find(s => s.key === "hide_uiux")?.value === "true";
        return {
            hide_powerbi: hidePowerbi,
            hide_uiux: hideUiux,
        };
    } catch (error) {
        console.error("Failed to fetch system settings:", error);
        return {
            hide_powerbi: false,
            hide_uiux: false,
        };
    }
}

export async function updateSystemSettingAction(key: string, value: string) {
    await requireAdmin();

    const existing = await db.select().from(systemSettingsTable).where(eq(systemSettingsTable.key, key));
    if (existing.length > 0) {
        await db.update(systemSettingsTable).set({ value }).where(eq(systemSettingsTable.key, key));
    } else {
        await db.insert(systemSettingsTable).values({ key, value });
    }

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/products/power-bi");
    revalidatePath("/products/ui-ux");
    revalidatePath("/admin");

    return { success: true };
}
