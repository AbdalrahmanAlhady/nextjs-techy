'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FLAT_RATE_SHIPPING_COST } from '@/config/shipping';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { createOrderAndPaymentIntent } from '@/app/actions/orderActions';
import OrderSummary from '@/components/OrderSummary';
import ShippingAddressForm from '@/components/ShippingAddressForm';
import PaymentForm from '@/components/PaymentForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CheckoutClient() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [shipping, setShipping] = useState(FLAT_RATE_SHIPPING_COST);
  const [total, setTotal] = useState<number>(0);

  const cartItems = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    const calculatedSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setSubtotal(calculatedSubtotal);
  }, [cartItems]);

  useEffect(() => {
    setTotal(subtotal + shipping);
  }, [subtotal, shipping]);

  const handleAddressSubmit = async (data: any) => {
    // Server-side calculation will use the same flat rate
    const result = await createOrderAndPaymentIntent(cartItems, data);
    if (result.success && result.clientSecret && result.orderId) {
      setClientSecret(result.clientSecret);
      setOrderId(result.orderId);
    } else {
      setError(result.error || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Secure Checkout</h1>
                        <p className="mt-4 text-xl text-gray-500">Complete your purchase with confidence.</p>
            <div className="mt-6">
              <Link href="/cart" passHref>
                <Button variant="outline">← Back to Cart</Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16">
            <div className="lg:col-span-1">
              {!clientSecret ? (
                <ShippingAddressForm onSubmit={handleAddressSubmit} />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Payment Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PaymentForm clientSecret={clientSecret} orderId={orderId!} />
                  </CardContent>
                </Card>
              )}
              {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
            </div>
            <div className="lg:col-span-1">
              <OrderSummary 
                cartItems={cartItems} 
                subtotal={subtotal} 
                shipping={shipping} 
                total={total} 
                showReviews={false}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
