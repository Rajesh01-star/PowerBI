"use server";

import { db } from "@/db/drizzle";
import { postsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq, desc } from "drizzle-orm";

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

    if (!title) {
         throw new Error("Title is required");
    }

    await db.insert(postsTable).values({
        title,
        description: description || null,
        price: price ? price : null,
        url: url || null,
        aspect: aspect || 'horizontal',
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

    if (!id || !title) {
         throw new Error("ID and Title are required");
    }

    await db.update(postsTable).set({
        title,
        description: description || null,
        price: price ? price : null,
        url: url || null,
        aspect: aspect || 'horizontal',
    }).where(eq(postsTable.id, id));

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

    const posts = await db.select().from(postsTable).orderBy(desc(postsTable.createdAt));
    return posts;
}
