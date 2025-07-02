import { relations } from "drizzle-orm/relations";
import { orders, orderItems, products, categories, users, reviews } from "./schema";

export const orderItemsRelations = relations(orderItems, ({one}) => ({
	order: one(orders, {
		fields: [orderItems.orderId],
		references: [orders.id]
	}),
	product: one(products, {
		fields: [orderItems.productId],
		references: [products.id]
	}),
}));

export const ordersRelations = relations(orders, ({one, many}) => ({
	orderItems: many(orderItems),
	user: one(users, {
		fields: [orders.userId],
		references: [users.id]
	}),
}));

export const productsRelations = relations(products, ({one, many}) => ({
	orderItems: many(orderItems),
	category: one(categories, {
		fields: [products.categoryId],
		references: [categories.id]
	}),
	user: one(users, {
		fields: [products.vendorId],
		references: [users.id]
	}),
	reviews: many(reviews),
}));

export const categoriesRelations = relations(categories, ({many}) => ({
	products: many(products),
}));

export const usersRelations = relations(users, ({many}) => ({
	products: many(products),
	orders: many(orders),
	reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({one}) => ({
	product: one(products, {
		fields: [reviews.productId],
		references: [products.id]
	}),
	user: one(users, {
		fields: [reviews.userId],
		references: [users.id]
	}),
}));