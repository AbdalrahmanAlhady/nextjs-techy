'use server';

import { db } from '@/packages/db';
import { orders, orderItems } from '@/packages/db/schema';
import { FLAT_RATE_SHIPPING_COST } from '@/config/shipping';
import { eq } from 'drizzle-orm';
import { CartItem } from '@/types';
import { getSessionFromCookie } from './get-session';

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createOrderAndPaymentIntent(
  cartItems: CartItem[],
  shippingAddress: ShippingAddress
) {
  const session = await getSessionFromCookie();
  if (!session?.id) {
    return { success: false, error: 'User not authenticated' };
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = FLAT_RATE_SHIPPING_COST;
  const total = subtotal + shippingCost;

  try {
    const newOrder = await db
      .insert(orders)
      .values({
        userId: session.id,
        total,
        shippingCost,
        shippingAddress,
        status: 'PENDING',
      })
      .returning({ id: orders.id });

    const orderId = newOrder[0].id;

    const newOrderItems = cartItems.map((item) => ({
      orderId,
      productId: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    await db.insert(orderItems).values(newOrderItems);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: 'usd',
      metadata: { orderId },
    });

    await db.update(orders).set({ stripePaymentIntentId: paymentIntent.id }).where(eq(orders.id, orderId));

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      orderId,
      subtotal,
      shipping: shippingCost,
      total,
    };
  } catch (error) {
    console.error('Error creating order and payment intent:', error);
    return { success: false, error: 'Failed to create order' };
  }
}

export async function confirmOrder(orderId: string, paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status === 'succeeded') {
      await db.update(orders).set({ status: 'PROCESSING' }).where(eq(orders.id, orderId));
      // Fetch order details for confirmation page
      const order = await db.select().from(orders).where(eq(orders.id, orderId)).then(res => res[0]);
      if (!order) return { success: false, error: 'Order not found' };
      return {
        success: true,
        order: {
          shippingCost: order.shippingCost,
          total: order.total,
          shippingAddress: order.shippingAddress,
        }
      };
    } else {
      return { success: false, error: 'Payment not successful' };
    }
  } catch (error) {
    console.error('Error confirming order:', error);
    return { success: false, error: 'Failed to confirm order' };
  }
}
