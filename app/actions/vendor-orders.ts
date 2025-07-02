"use server";

import { db, orders, orderItems, products, users } from "@/packages/db";
import { and, eq } from "drizzle-orm";
import { getSessionFromCookie } from "./get-session";
import { sendEmail } from "@/app/utils/send-email";

export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELED";

export async function getVendorOrders() {
  const session = await getSessionFromCookie();
  if (!session || typeof session !== "object" || session.role !== "VENDOR") {
    return { success: false, error: "Not authorized" };
  }
  const vendorId = (session as any).id;
  try {
    // Join orders -> orderItems -> products filtered by vendor
    const result = await db
      .select({
        orderId: orders.id,
        createdAt: orders.createdAt,
        buyerId: orders.userId,
        status: orders.status,
      })
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
      .select({
        itemId: orderItems.id,
        productName: products.name,
        quantity: orderItems.quantity,
        price: orderItems.price,
        status: orderItems.status as any,
      })
      .from(orderItems)
      .innerJoin(products, eq(products.id, orderItems.productId))
      .where(
        and(eq(orderItems.orderId, orderId), eq(products.vendorId, vendorId))
      );
    

    const orderMeta = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId));
    if (!orderMeta.length) return { success: false, error: "Order not found" };

    return { success: true, order: { ...orderMeta[0], items } };
  } catch (error) {
    console.log(error);
    return { success: false, error: (error as Error).message };
  }
}

export async function updateOrderItemStatus(
  itemId: string,
  status: OrderStatus
) {
  const session = await getSessionFromCookie();
  if (!session || typeof session !== "object" || session.role !== "VENDOR") {
    return { success: false, error: "Not authorized" };
  }
  const vendorId = (session as any).id;
  try {
    // Verify item belongs to vendor
    const item = await db
      .select({ productId: orderItems.productId })
      .from(orderItems)
      .where(eq(orderItems.id, itemId));
    

    if (!item.length) return { success: false, error: "Item not found" };

    const product = await db
      .select({ vendorId: products.vendorId })
      .from(products)
      .where(eq(products.id, item[0].productId));
    if (!product.length || product[0].vendorId !== vendorId) {
      return { success: false, error: "Not authorized" };
    }

    // Update the order item status
    await db
      .update(orderItems)
      .set({ status })
      .where(eq(orderItems.id, itemId));

    // Get order and buyer details for email
    const orderDetails = await db
      .select({
        orderId: orders.id,
        buyerEmail: users.email,
        buyerName: users.name,
        productName: products.name,
        orderDate: orders.createdAt,
      })
      .from(orders)
      .innerJoin(users, eq(users.id, orders.userId))
      .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
      .innerJoin(products, eq(products.id, orderItems.productId))
      .where(and(
        eq(orderItems.id, itemId),
        eq(products.vendorId, vendorId)
      ))
      .limit(1);

    if (orderDetails.length > 0) {
      const { buyerEmail, buyerName, productName, orderId, orderDate } = orderDetails[0];
      const formattedDate = new Date(orderDate).toLocaleDateString();
      
      // Helper function to get status-specific message
      const getStatusMessage = (status: OrderStatus, productName: string) => {
        switch (status) {
          case 'PROCESSING':
            return `Your ${productName} is being prepared for shipping.`;
          case 'SHIPPED':
            return `Your ${productName} is on its way!`;
          case 'DELIVERED':
            return `Your ${productName} has been delivered. We hope you enjoy it!`;
          case 'CANCELED':
            return `Your order for ${productName} has been canceled.`;
          default:
            return `The status of your order has been updated.`;
        }
      };

      // Prepare email content based on status
      const statusText = {
        'PROCESSING': 'is being processed',
        'SHIPPED': 'has been shipped',
        'DELIVERED': 'has been delivered',
        'CANCELED': 'has been canceled',
        'PENDING': 'status has been updated'
      }[status] || 'status has been updated';

      const emailSubject = `Order #${orderId} Update: ${productName} ${statusText}`;
      const emailText = `
        Hello ${buyerName || 'Customer'},

        Your order #${orderId} (placed on ${formattedDate}) has been updated:
        
        Product: ${productName}
        New Status: ${status}
        
        Thank you for shopping with us!
        
        Best regards,
        The Vendor Team
      `;

      const emailHtml = `
        <p>Hello ${buyerName || 'Customer'},</p>
        
        <p>Your order <strong>#${orderId}</strong> (placed on ${formattedDate}) has been updated:</p>
        
        <p>
          <strong>Product:</strong> ${productName}<br>
          <strong>New Status:</strong> ${status}
        </p>
        
        <p>${getStatusMessage(status, productName)}</p>
        
        <p>Thank you for shopping with us!</p>
        
        <p>Best regards,<br>The Vendor Team</p>
      `;

      try {
        await sendEmail({
          to: buyerEmail,
          subject: emailSubject,
          text: emailText,
          html: emailHtml
        });
      } catch (emailError) {
        console.error('Failed to send order status email:', emailError);
        // Don't fail the whole operation if email fails
      }
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
