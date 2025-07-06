'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import { clearCart } from '@/app/store/cartSlice';
import { confirmOrder } from '@/app/actions/orderActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

function OrderConfirmation() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const [status, setStatus] = useState('loading');
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<{ shippingCost: number; total: number; shippingAddress?: any } | null>(null);

  useEffect(() => {
    if (!searchParams) {
      setStatus('error');
      setError('Invalid order confirmation URL.');
      return;
    }
    const orderId = searchParams.get('order_id');
    const paymentIntentId = searchParams.get('payment_intent');

    if (!orderId || !paymentIntentId) {
      setStatus('error');
      setError('Invalid order confirmation URL.');
      return;
    }

    async function verifyOrder() {
      const result = await confirmOrder(orderId!, paymentIntentId!);
      if (result.success) {
        dispatch(clearCart());
        setOrder(result.order ?? null);
        setStatus('success');
      } else {
        setStatus('error');
        setError(result.error || 'An unknown error occurred while confirming your order.');
      }
    }

    verifyOrder();
  }, [searchParams, dispatch]);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-gray-900"></div>
        <h2 className="mt-6 text-xl font-semibold text-gray-900">Verifying Your Payment</h2>
        <p className="mt-2 text-gray-500">Please wait a moment while we confirm your order.</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-red-600">Payment Error</CardTitle>
          <CardDescription>There was a problem with your purchase.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-700">{error}</p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/cart">Return to Cart</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (status === 'success') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-green-600">Order Confirmed</CardTitle>
          <CardDescription>Your payment was successful!</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-700">Thank you for your purchase.</p>
          {order && (
            <div className="mt-6 space-y-2 text-left">
              <div className="flex justify-between">
                <span className="font-medium">Shipping:</span>
                <span>${(order.shippingCost / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Paid:</span>
                <span>${(order.total / 100).toFixed(2)}</span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full" variant="outline">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md text-center">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-green-600">Order Successful!</CardTitle>
        <CardDescription>Thank you for your purchase.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Your order has been confirmed. A confirmation email has been sent to your address.</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function OrderConfirmationClient() {
  return (
    <div className="bg-gray-50 min-h-[60vh] flex items-center justify-center">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-gray-900"></div>
          <h2 className="mt-6 text-xl font-semibold text-gray-900">Loading Confirmation...</h2>
        </div>
      }>
        <OrderConfirmation />
      </Suspense>
    </div>
  );
}
