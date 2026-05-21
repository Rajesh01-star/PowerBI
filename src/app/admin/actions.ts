"use server";

import { db } from "@/db/drizzle";
import { postsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq, desc, asc } from "drizzle-orm";

export async function createPostAction(formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || !session.user || !session.user.isAdmin) {
        throw new Error("Unauthorized: Only admins can perform this action");
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const url = formData.get("url") as string;
    const aspect = formData.get("aspect") as 'horizontal' | 'vertical';
    const activeThumbnailIndex = parseInt(formData.get("activeThumbnailIndex") as string || "0");
    
    const tagsData = formData.get("tags") as string;
    const tags = tagsData ? JSON.parse(tagsData) : [];

    const thumbnailsData = formData.get("thumbnails") as string;
    const thumbnails = thumbnailsData ? JSON.parse(thumbnailsData) : [];

    if (!title) {
         throw new Error("Title is required");
    }

    let fileUrl: string | null = null;
    const zipFile = formData.get("file") as File | null;
    if (zipFile && zipFile.size > 0) {
        const buffer = Buffer.from(await zipFile.arrayBuffer());
        fileUrl = `data:${zipFile.type || 'application/zip'};base64,${buffer.toString('base64')}`;
    }

    await db.insert(postsTable).values({
        title,
        description: description || null,
        price: price ? price : null,
        url: url || null,
        aspect: aspect || 'horizontal',
        thumbnails,
        activeThumbnailIndex,
        tags,
        fileUrl,
        userId: session.user.id
    });

    revalidatePath("/");
    revalidatePath("/marketplace");
    revalidatePath("/admin");

    return { success: true };
}

export async function updatePostAction(formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || !session.user || !session.user.isAdmin) {
        throw new Error("Unauthorized: Only admins can perform this action");
    }

    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const url = formData.get("url") as string;
    const aspect = formData.get("aspect") as 'horizontal' | 'vertical';
    const activeThumbnailIndex = parseInt(formData.get("activeThumbnailIndex") as string || "0");
    
    const tagsData = formData.get("tags") as string;
    const tags = tagsData ? JSON.parse(tagsData) : [];

    const thumbnailsData = formData.get("thumbnails") as string;
    const thumbnails = thumbnailsData ? JSON.parse(thumbnailsData) : [];

    if (!id || !title) {
         throw new Error("ID and Title are required");
    }

    const updateData: any = {
        title,
        description: description || null,
        price: price ? price : null,
        url: url || null,
        aspect: aspect || 'horizontal',
        thumbnails,
        activeThumbnailIndex,
        tags,
    };

    const zipFile = formData.get("file") as File | null;
    if (zipFile && zipFile.size > 0) {
        const buffer = Buffer.from(await zipFile.arrayBuffer());
        updateData.fileUrl = `data:${zipFile.type || 'application/zip'};base64,${buffer.toString('base64')}`;
    }

    await db.update(postsTable).set(updateData).where(eq(postsTable.id, id));

    revalidatePath("/");
    revalidatePath("/marketplace");
    revalidatePath("/admin");

    return { success: true };
}

export async function getPostsAction() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || !session.user || !session.user.isAdmin) {
        throw new Error("Unauthorized: Only admins can perform this action");
    }

    const posts = await db.select({
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
        userId: postsTable.userId,
        views: postsTable.views,
        createdAt: postsTable.createdAt,
        updatedAt: postsTable.updatedAt
    }).from(postsTable).orderBy(desc(postsTable.createdAt));
    return posts;
}

export async function getPublicPostsAction(sort: string = 'views') {
    let orderByClause;
    switch (sort) {
        case 'newest':
            orderByClause = desc(postsTable.createdAt);
            break;
        case 'oldest':
            orderByClause = asc(postsTable.createdAt);
            break;
        case 'atoz':
            orderByClause = asc(postsTable.title);
            break;
        case 'views':
        default:
            orderByClause = desc(postsTable.views);
            break;
    }
    const posts = await db.select({
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
        userId: postsTable.userId,
        views: postsTable.views,
        createdAt: postsTable.createdAt,
        updatedAt: postsTable.updatedAt
    }).from(postsTable).orderBy(orderByClause);
    return posts;
}

export async function getPublicPostByIdAction(id: string) {
    const posts = await db.select({
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
        userId: postsTable.userId,
        views: postsTable.views,
        createdAt: postsTable.createdAt,
        updatedAt: postsTable.updatedAt
    }).from(postsTable).where(eq(postsTable.id, id));
    return posts[0] || null;
}

import { ordersTable } from "@/db/schema";
import { and } from "drizzle-orm";

export async function getPostFileUrlAction(id: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }

    if (!session.user.isAdmin) {
        const purchases = await db.select().from(ordersTable).where(
            and(
                eq(ordersTable.userId, session.user.id),
                eq(ordersTable.postId, id),
                eq(ordersTable.status, "paid")
            )
        );

        if (purchases.length === 0) {
            // Also check if the post is free?
            const post = await db.select({ price: postsTable.price }).from(postsTable).where(eq(postsTable.id, id));
            const isFree = !post[0]?.price || parseFloat(post[0].price) <= 0;
            if (!isFree) {
                throw new Error("You have not purchased this template");
            }
        }
    }

    const posts = await db.select({ fileUrl: postsTable.fileUrl }).from(postsTable).where(eq(postsTable.id, id));
    return posts[0]?.fileUrl || null;
}

