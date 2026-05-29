import { boolean, integer, numeric, pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull(),
    image: text('image'),
    isAdmin: boolean('is_admin').default(false).notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull()
});

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' })
});

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at', { mode: 'date' }),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at', { mode: 'date' }),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull()
});

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull()
});

export const postsTable = pgTable('posts', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    price: numeric('price', { precision: 10, scale: 2 }),
    url: text('url'),
    aspect: text('aspect').$type<'horizontal' | 'vertical'>().default('horizontal').notNull(),
    // Legacy single image (kept for backward compat, prefer thumbnails array)
    imageUrl: text('image_url'),
    // New: downloadable zip file URL
    fileUrl: text('file_url'),
    // New: array of up to 4 thumbnail image URLs
    thumbnails: text('thumbnails').array().default([]).notNull(),
    // New: index of the active/primary thumbnail (0-based)
    activeThumbnailIndex: integer('active_thumbnail_index').default(0).notNull(),
    // New: Asset type to distinguish between Power BI and UI/UX templates
    assetType: text('asset_type').$type<'powerbi' | 'uiux'>().default('powerbi').notNull(),
    // New: Optional source link for UI/UX (e.g., Figma edit link)
    sourceLink: text('source_link'),
    // New: tags for categorization and filtering
    tags: text('tags').array().default([]).notNull(),
    // New: resource links for client reference and learning
    references: jsonb('references').$type<{ label: string; url: string }[]>().default([]).notNull(),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    views: integer('views').default(0).notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(() => new Date()),
});

export const ordersTable = pgTable('orders', {
    id: text('id').primaryKey(), // Razorpay order id
    userId: text('user_id').references(() => user.id),
    postId: uuid('post_id').notNull().references(() => postsTable.id),
    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    status: text('status').default('created').notNull(),
    paymentId: text('payment_id'),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(() => new Date()),
});

export const systemSettingsTable = pgTable('system_settings', {
    key: text('key').primaryKey(),
    value: text('value').notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
});



export type InsertUser = typeof user.$inferInsert;
export type SelectUser = typeof user.$inferSelect;

export type InsertSession = typeof session.$inferInsert;
export type SelectSession = typeof session.$inferSelect;

export type InsertAccount = typeof account.$inferInsert;
export type SelectAccount = typeof account.$inferSelect;

export type InsertVerification = typeof verification.$inferInsert;
export type SelectVerification = typeof verification.$inferSelect;

export type InsertPost = typeof postsTable.$inferInsert;
export type SelectPost = typeof postsTable.$inferSelect;

export type InsertOrder = typeof ordersTable.$inferInsert;
export type SelectOrder = typeof ordersTable.$inferSelect;
