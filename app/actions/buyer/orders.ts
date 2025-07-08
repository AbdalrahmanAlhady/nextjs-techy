"use server";
import { db, orders, orderItems, products } from "@/packages/db";
import { eq } from "drizzle-orm";
import { getSessionFromCookie } from "../auth/get-session";

export async function getBuyerOrders() {
  const session = await getSessionFromCookie();
  if (!session || typeof session !== "object" || !("id" in session)) {
    return { success: false, error: "Not authorized" };
  }
  const userId = (session as any).id;
  try {
    const ordersResult = await db.select().from(orders).where(eq(orders.userId, userId));
    return { success: true, orders: ordersResult };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getBuyerOrdersWithItems() {
  const session = await getSessionFromCookie();
  if (!session || typeof session !== "object" || !("id" in session)) {
    return { success: false, error: "Not authorized" };
  }
  const userId = (session as any).id;
  try {
    const ordersResult = await db.select().from(orders).where(eq(orders.userId, userId));
    const ordersWithItems = await Promise.all(
      ordersResult.map(async (o: any) => {
        const items = await db
          .select({
            itemId: orderItems.id,
            productId: orderItems.productId,
            productName: products.name,
            quantity: orderItems.quantity,
            price: orderItems.price,
            status: orderItems.status as any,
            image: products.image,
          })
          .from(orderItems)
          .innerJoin(products, eq(products.id, orderItems.productId))
          .where(eq(orderItems.orderId, o.id));
        return { ...o, items };
      })
    );
    return { success: true, orders: ordersWithItems };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getBuyerOrderById(orderId: string) {
  const session = await getSessionFromCookie();
  if (!session || typeof session !== "object" || !("id" in session)) {
    return { success: false, error: "Not authorized" };
  }
  const userId = (session as any).id;
  try {
    const orderMeta = await db.select().from(orders).where(eq(orders.id, orderId));
    if (!orderMeta.length || orderMeta[0].userId !== userId) {
      return { success: false, error: "Order not found" };
    }
    const items = await db
      .select({
        itemId: orderItems.id,
        productId: orderItems.productId,
        productName: products.name,
        quantity: orderItems.quantity,
        price: orderItems.price,
        status: orderItems.status as any,
        image: products.image,
      })
      .from(orderItems)
      .innerJoin(products, eq(products.id, orderItems.productId))
      .where(eq(orderItems.orderId, orderId));
    return { success: true, order: { ...orderMeta[0], items } };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
