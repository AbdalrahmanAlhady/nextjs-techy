// File: packages/db/schema.ts

import { pgTable, text, integer, timestamp, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

// Define Enums for status and role fields for type safety.
// These are derived from the requirements in the PRD.
export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'VENDOR', 'BUYER']);
export const vendorStatusEnum = pgEnum('vendor_status', ['NONE', 'PENDING', 'APPROVED', 'REJECTED']);
export const userStatusEnum = pgEnum('user_status', ['ACTIVE', 'SUSPENDED']);
export const productStatusEnum = pgEnum('product_status', ['ACTIVE', 'DRAFT', 'ARCHIVED']);
export const orderStatusEnum = pgEnum('order_status', ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELED']);

// --- TABLES ---
// The following table definitions translate the conceptual data models from the architecture
// document into a concrete schema for PostgreSQL. [cite: 647]

/**
 * VendorApplications table.
 * Stores applications from prospective vendors for review by admin.
 */
/**
 * Users table.
 * Stores application-specific data linked to the authentication provider.
 * [cite_start]This table supports user story requirements for role-based access. [cite: 375]
 */
export const users = pgTable('users', {
  id: text('id').primaryKey(), // This ID will be synced from the NextAuth.js session provider
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name'),
  status: userStatusEnum('status').default('ACTIVE').notNull(),
  role: userRoleEnum('role').default('BUYER').notNull(),
  vendorStatus: vendorStatusEnum('vendor_status').default('NONE').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Categories table.
 * Used to organize products for Browse and filtering as required by the PRD.
 */
export const categories = pgTable('categories', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
});

/**
 * Products table.
 * Represents items for sale, fulfilling core e-commerce requirements.
 */
export const products = pgTable('products', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  description: text('description'),
  price: integer('price').notNull(), // Price in cents to avoid floating-point issues
  stock: integer('stock').default(0).notNull(),
  image: text('image'),
  status: productStatusEnum('status').default('DRAFT').notNull(),
  vendorId: text('vendor_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  categoryId: text('category_id').references(() => categories.id, { onDelete: "set null", }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Orders table.
 * Represents a customer's transaction, a key part of the buyer journey.
 */
export const orders = pgTable('orders', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: orderStatusEnum('status').default('PENDING').notNull(),
  total: integer('total').notNull(), // Total in cents
  shippingAddress: jsonb('shipping_address').$type<{ street: string; city: string; state: string; zip: string; country: string; }>(),
  stripePaymentIntentId: text('stripe_payment_intent_id').unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * OrderItems table.
 * A join table that links products to an order, specifying quantity and price.
 */
export const orderItems = pgTable('order_items', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  orderId: text('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull(),
  price: integer('price').notNull(), // Price per unit at time of purchase, in cents
  status: orderStatusEnum('status').default('PENDING').notNull(),
});

/**
 * Reviews table.
 * Stores ratings and comments from verified buyers for a specific product.
 * [cite_start]Fulfills the "Ratings & Reviews" feature from the PRD. [cite: 375]
 */
export const reviews = pgTable('reviews', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(), // 1-5
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});