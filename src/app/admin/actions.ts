"use server";

import { db } from "@/db/drizzle";
import { postsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq, desc } from "drizzle-orm";
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

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
    const imageFile = formData.get("image") as File | null;

    if (!title) {
         throw new Error("Title is required");
    }

    let imageUrl: string | null = null;

    if (imageFile && imageFile.size > 0) {
        try {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const filename = `${uuidv4()}-${imageFile.name}`;
            const uploadDir = path.join(process.cwd(), 'public', 'uploads');
            
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            
            fs.writeFileSync(path.join(uploadDir, filename), buffer);
            imageUrl = `/uploads/${filename}`;
        } catch (error) {
            console.error("Failed to upload image:", error);
            throw new Error("Failed to upload image");
        }
    }

    await db.insert(postsTable).values({
        title,
        description: description || null,
        price: price ? price : null,
        url: url || null,
        aspect: aspect || 'horizontal',
        imageUrl: imageUrl,
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
    const imageFile = formData.get("image") as File | null;

    if (!id || !title) {
         throw new Error("ID and Title are required");
    }

    const updateData: any = {
        title,
        description: description || null,
        price: price ? price : null,
        url: url || null,
        aspect: aspect || 'horizontal',
    };

    if (imageFile && imageFile.size > 0) {
        try {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const filename = `${uuidv4()}-${imageFile.name}`;
            const uploadDir = path.join(process.cwd(), 'public', 'uploads');
            
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            
            fs.writeFileSync(path.join(uploadDir, filename), buffer);
            updateData.imageUrl = `/uploads/${filename}`;
        } catch (error) {
            console.error("Failed to upload image:", error);
            throw new Error("Failed to upload image");
        }
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

    const posts = await db.select().from(postsTable).orderBy(desc(postsTable.createdAt));
    return posts;
}

export async function getPublicPostsAction() {
    const posts = await db.select().from(postsTable).orderBy(desc(postsTable.createdAt));
    return posts;
}

export async function getPublicPostByIdAction(id: string) {
    const posts = await db.select().from(postsTable).where(eq(postsTable.id, id));
    return posts[0] || null;
}
