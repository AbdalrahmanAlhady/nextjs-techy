"use server";
import { getBuyerOrdersWithItems } from "./orders";

export async function hasPurchasedProduct(productId: string) {
  const ordersResult = await getBuyerOrdersWithItems();
  if (!ordersResult.success || !Array.isArray(ordersResult.orders)) {
    return { success: false, hasPurchased: false };
  }
  for (const order of ordersResult.orders) {
    if (order.items && order.items.some((item: any) => item.productId === productId)) {
      return { success: true, hasPurchased: true };
    }
  }
  return { success: true, hasPurchased: false };
}
