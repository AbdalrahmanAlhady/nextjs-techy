'use server';
import { revalidatePath } from 'next/cache';
import { updateOrderItemStatus, OrderStatus } from './orders';

export async function handleUpdateOrderItemStatus(itemId: string, status: OrderStatus) {
  const res = await updateOrderItemStatus(itemId, status);
  if (res.success) {
    revalidatePath('/vendor/orders');
  }
  return res;
}
