"use server";
import { db, orders, orderItems, products, users } from "@/packages/db";
import { and, eq } from "drizzle-orm";
import { getSessionFromCookie } from "../auth/get-session";
import { sendEmail } from "@/app/utils/send-email";

export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELED";

export async function getVendorOrders() {
  const session = await getSessionFromCookie();
  if (!session || typeof session !== "object" || session.role !== "VENDOR") {
    return { success: false, error: "Not authorized" };
  }
  const vendorId = (session as any).id;
  try {
    const result = await db
      .select({ orderId: orders.id, createdAt: orders.createdAt, buyerId: orders.userId, status: orders.status })
      .from(orders)
      .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
      .innerJoin(products, eq(products.id, orderItems.productId))
      .where(eq(products.vendorId, vendorId))
      .groupBy(orders.id);
    return { success: true, orders: result };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getVendorOrderById(orderId: string) {
  const session = await getSessionFromCookie();
  if (!session || typeof session !== "object" || session.role !== "VENDOR") {
    return { success: false, error: "Not authorized" };
  }
  const vendorId = (session as any).id;
  try {
    const items = await db
      .select({ itemId: orderItems.id, productName: products.name, quantity: orderItems.quantity, price: orderItems.price, status: orderItems.status as any })
      .from(orderItems)
      .innerJoin(products, eq(products.id, orderItems.productId))
      .where(and(eq(orderItems.orderId, orderId), eq(products.vendorId, vendorId)));

    const orderMeta = await db.select().from(orders).where(eq(orders.id, orderId));
    if (!orderMeta.length) return { success: false, error: "Order not found" };

    return { success: true, order: { ...orderMeta[0], items } };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function updateOrderItemStatus(itemId: string, status: OrderStatus) {
  const session = await getSessionFromCookie();
  if (!session || typeof session !== "object" || session.role !== "VENDOR") {
    return { success: false, error: "Not authorized" };
  }
  const vendorId = (session as any).id;
  try {
    const item = await db.select({ productId: orderItems.productId }).from(orderItems).where(eq(orderItems.id, itemId));
    if (!item.length) return { success: false, error: "Item not found" };

    const product = await db.select({ vendorId: products.vendorId }).from(products).where(eq(products.id, item[0].productId));
    if (!product.length || product[0].vendorId !== vendorId) {
      return { success: false, error: "Not authorized" };
    }

    await db.update(orderItems).set({ status }).where(eq(orderItems.id, itemId));

    const orderDetails = await db
      .select({ orderId: orders.id, buyerEmail: users.email, buyerName: users.name, productName: products.name, orderDate: orders.createdAt })
      .from(orders)
      .innerJoin(users, eq(users.id, orders.userId))
      .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
      .innerJoin(products, eq(products.id, orderItems.productId))
      .where(and(eq(orderItems.id, itemId), eq(products.vendorId, vendorId)))
      .limit(1);

    if (orderDetails.length > 0) {
      const { buyerEmail, buyerName, productName, orderId, orderDate } = orderDetails[0];
      const formattedDate = new Date(orderDate).toLocaleDateString();

      const getStatusMessage = (s: OrderStatus, p: string) => {
        switch (s) {
          case "PROCESSING":
            return `Your ${p} is being prepared for shipping.`;
          case "SHIPPED":
            return `Your ${p} is on its way!`;
          case "DELIVERED":
            return `Your ${p} has been delivered. We hope you enjoy it!`;
          case "CANCELED":
            return `Your order for ${p} has been canceled.`;
          default:
            return `The status of your order has been updated.`;
        }
      };

      const statusText: Record<OrderStatus, string> = {
        PROCESSING: "is being processed",
        SHIPPED: "has been shipped",
        DELIVERED: "has been delivered",
        CANCELED: "has been canceled",
        PENDING: "status has been updated",
      } as any;

      const subject = `Order #${orderId} Update: ${productName} ${statusText[status] ?? ''}`;
      const text = `Hello ${buyerName || 'Customer'},\n\nYour order #${orderId} (placed on ${formattedDate}) has been updated:\n\nProduct: ${productName}\nNew Status: ${status}\n\nThank you for shopping with us!\n\nBest regards,\nThe Vendor Team`;
      const html = `<p>Hello ${buyerName || 'Customer'},</p><p>Your order <strong>#${orderId}</strong> (placed on ${formattedDate}) has been updated:</p><p><strong>Product:</strong> ${productName}<br><strong>New Status:</strong> ${status}</p><p>${getStatusMessage(status, productName)}</p><p>Thank you for shopping with us!</p><p>Best regards,<br>The Vendor Team</p>`;

      try {
        await sendEmail({ to: buyerEmail, subject, text, html });
      } catch (e) {
        console.error('Failed to send order email', e);
      }
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
