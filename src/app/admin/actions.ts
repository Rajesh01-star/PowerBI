"use server";

import { db } from "@/db/drizzle";
import { postsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

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
