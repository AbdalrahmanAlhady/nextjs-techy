import { pgTable, foreignKey, text, integer, timestamp, unique, jsonb, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const orderStatus = pgEnum("order_status", ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELED'])
export const productStatus = pgEnum("product_status", ['ACTIVE', 'DRAFT', 'ARCHIVED'])
export const userRole = pgEnum("user_role", ['ADMIN', 'VENDOR', 'BUYER'])
export const userStatus = pgEnum("user_status", ['ACTIVE', 'SUSPENDED'])
export const vendorStatus = pgEnum("vendor_status", ['NONE', 'PENDING', 'APPROVED', 'REJECTED'])


export const orderItems = pgTable("order_items", {
	id: text().primaryKey().notNull(),
	orderId: text("order_id").notNull(),
	productId: text("product_id").notNull(),
	quantity: integer().notNull(),
	price: integer().notNull(),
	status: orderStatus().default('PENDING').notNull(),
}, (table) => [
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [orders.id],
			name: "order_items_order_id_orders_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "order_items_product_id_products_id_fk"
		}).onDelete("cascade"),
]);

export const products = pgTable("products", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	price: integer().notNull(),
	stock: integer().default(0).notNull(),
	image: text(),
	status: productStatus().default('DRAFT').notNull(),
	vendorId: text("vendor_id").notNull(),
	categoryId: text("category_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "products_category_id_categories_id_fk"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.vendorId],
			foreignColumns: [users.id],
			name: "products_vendor_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const categories = pgTable("categories", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	description: text(),
}, (table) => [
	unique("categories_slug_unique").on(table.slug),
]);

export const orders = pgTable("orders", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	status: orderStatus().default('PENDING').notNull(),
	total: integer().notNull(),
	shippingAddress: jsonb("shipping_address"),
	stripePaymentIntentId: text("stripe_payment_intent_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "orders_user_id_users_id_fk"
		}).onDelete("cascade"),
	unique("orders_stripe_payment_intent_id_unique").on(table.stripePaymentIntentId),
]);

export const reviews = pgTable("reviews", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	productId: text("product_id").notNull(),
	rating: integer().notNull(),
	comment: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "reviews_product_id_products_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "reviews_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const users = pgTable("users", {
	id: text().primaryKey().notNull(),
	email: text().notNull(),
	name: text(),
	role: userRole().default('BUYER').notNull(),
	vendorStatus: vendorStatus("vendor_status").default('NONE').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	password: text().notNull(),
	status: userStatus().default('ACTIVE').notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);
