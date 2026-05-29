import { postsTable } from "@/db/schema";
import { desc, asc } from "drizzle-orm";

/** Shared select fields for post queries — single source of truth */
export const POST_SELECT_FIELDS = {
    id: postsTable.id,
    title: postsTable.title,
    description: postsTable.description,
    price: postsTable.price,
    url: postsTable.url,
    aspect: postsTable.aspect,
    imageUrl: postsTable.imageUrl,
    fileUrl: postsTable.fileUrl,
    thumbnails: postsTable.thumbnails,
    activeThumbnailIndex: postsTable.activeThumbnailIndex,
    assetType: postsTable.assetType,
    sourceLink: postsTable.sourceLink,
    tags: postsTable.tags,
    references: postsTable.references,
    userId: postsTable.userId,
    views: postsTable.views,
    createdAt: postsTable.createdAt,
    updatedAt: postsTable.updatedAt,
};

/** Public queries exclude sensitive fields */
export const POST_PUBLIC_FIELDS = {
    id: postsTable.id,
    title: postsTable.title,
    description: postsTable.description,
    price: postsTable.price,
    url: postsTable.url,
    aspect: postsTable.aspect,
    imageUrl: postsTable.imageUrl,
    thumbnails: postsTable.thumbnails,
    activeThumbnailIndex: postsTable.activeThumbnailIndex,
    assetType: postsTable.assetType,
    sourceLink: postsTable.sourceLink,
    tags: postsTable.tags,
    references: postsTable.references,
    userId: postsTable.userId,
    views: postsTable.views,
    createdAt: postsTable.createdAt,
    updatedAt: postsTable.updatedAt,
};

/** Resolve sort string to Drizzle order-by clause */
export function getOrderByClause(sort: string) {
    switch (sort) {
        case 'newest':
            return desc(postsTable.createdAt);
        case 'oldest':
            return asc(postsTable.createdAt);
        case 'atoz':
            return asc(postsTable.title);
        case 'views':
        default:
            return desc(postsTable.views);
    }
}
