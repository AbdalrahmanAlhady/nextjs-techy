'use server';

import { db } from '@/packages/db';
import { orders, orderItems, products } from '@/packages/db/schema';
import { FLAT_RATE_SHIPPING_COST } from '@/config/shipping';
import { eq, inArray, sql } from 'drizzle-orm';
import { getSessionFromCookie } from './auth/get-session';
import Stripe from 'stripe';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export async function createOrderAndPaymentIntent(
  cartItems: CartItem[],
  shippingAddress: ShippingAddress
): Promise<{
  success: boolean;
  error?: string;
  clientSecret: string | null;
  orderId: string | null;
  subtotal: number | null;
  shipping: number | null;
  total: number | null;
}> {
  const session = await getSessionFromCookie();
  if (!session?.id) {
    return { 
      success: false, 
      error: 'User not authenticated',
      clientSecret: null,
      orderId: null,
      subtotal: null,
      shipping: null,
      total: null
    };
  }

  try {
    // Verify stock availability
    const productIds = cartItems.map(item => item.id);
    const productStocks = await db
      .select({
        productId: products.id,
        currentStock: products.stock
      })
      .from(products)
      .where(inArray(products.id, productIds));

    for (const { productId, currentStock } of productStocks) {
      const item = cartItems.find(item => item.id === productId);
      if (!item) continue;
      
      if (currentStock < item.quantity) {
        return { 
          success: false, 
          error: `Insufficient stock for product ${productId}. Available: ${currentStock}, Required: ${item.quantity}`,
          clientSecret: null,
          orderId: null,
          subtotal: null,
          shipping: null,
          total: null
        };
      }
    }

    // Reserve stock by updating product quantities
    const tx = await db.transaction(async (tx: any) => {
      try {
        const subtotal = cartItems.reduce((sum: number, item: CartItem) => {
          return (sum + (item.price * item.quantity)) as number;
        }, 0) as number;
        const shippingCost = FLAT_RATE_SHIPPING_COST;
        const total = (subtotal + shippingCost) as number;

        // Create order
        const newOrder = await tx
          .insert(orders)
          .values({
            userId: session.id,
            total: total,
            shippingCost,
            shippingAddress,
            status: 'PENDING',
          })
          .returning({ id: orders.id });

        const orderId = newOrder[0].id;

        // Create order items
        const newOrderItems = cartItems.map((item) => ({
          orderId: orderId,
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        }));

        await tx.insert(orderItems).values(newOrderItems);

        // Reserve stock
        for (const item of cartItems) {
          await tx.update(products)
            .set({ stock: sql`${products.stock} - ${item.quantity}` })
            .where(eq(products.id, item.id));
        }

        const paymentIntent = await stripe.paymentIntents.create({
          amount: total,
          currency: 'usd',
          metadata: { orderId },
        });

        await tx.update(orders).set({ stripePaymentIntentId: paymentIntent.id }).where(eq(orders.id, orderId));

        return {
          success: true,
          clientSecret: paymentIntent.client_secret ?? null,
          orderId: orderId,
          subtotal: subtotal,
          shipping: shippingCost,
          total: total,
        };
      } catch (error) {
        console.error('Error during transaction:', error);
        throw error;
      }
    });

    return tx;
  } catch (error) {
    console.error('Error creating order and payment intent:', error);
    return { 
      success: false, 
      error: 'Failed to create order',
      clientSecret: null,
      orderId: null,
      subtotal: null,
      shipping: null,
      total: null
    };
  }
}

export async function confirmOrder(orderId: string, paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status === 'succeeded') {
      await db.update(orders).set({ status: 'PROCESSING' }).where(eq(orders.id, orderId));
      // Fetch order details for confirmation page
      const order = await db.select().from(orders).where(eq(orders.id, orderId)).then(res => res[0]);
      if (!order) {
        return { 
          success: false, 
          error: 'Transaction failed',
          clientSecret: null,
          orderId: null,
          subtotal: null,
          shipping: null,
          total: null
        };
      }

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
