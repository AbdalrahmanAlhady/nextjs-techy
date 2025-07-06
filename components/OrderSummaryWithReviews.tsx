import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import StarRating from '@/components/StarRating';
import OrderItemReviewForm from './OrderItemReviewForm';
import { CartItem } from '@/types';
import { getProductReviews } from '@/app/actions/get-reviews';
import { getSessionFromCookie } from '@/app/actions/get-session';

interface OrderSummaryWithReviewsProps {
  cartItems: CartItem[];
  subtotal: number;
  shipping?: number;
  total?: number;
}

export default function OrderSummaryWithReviews({ cartItems, subtotal, shipping, total }: OrderSummaryWithReviewsProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchUserAndReviews() {
      // Get user id from session
      const session = await getSessionFromCookie();
      if (!session || typeof session !== 'object' || !('id' in session)) return;
      setUserId(session.id);
      // For each product, check if user has reviewed
      const result: Record<string, boolean> = {};
      for (const item of cartItems) {
        const reviewsRes = await getProductReviews(item.id);
        result[item.id] = Array.isArray(reviewsRes.reviews) && reviewsRes.reviews.some((r: any) => r.userId === session.id);
      }
      setReviewed(result);
    }
    fetchUserAndReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems.length]);

  const handleReviewSubmit = (productId: string) => {
    setReviewed(prev => ({ ...prev, [productId]: true }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul role="list" className="divide-y divide-gray-200">
          {cartItems.map((item: CartItem) => (
            <li key={item.id} className="flex py-6 px-6 flex-col md:flex-row">
              <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                <img
                  src={item.image || '/placeholder.svg'}
                  alt={item.name}
                  className="w-full h-full object-center object-cover"
                />
              </div>
              <div className="ml-4 flex-1 flex flex-col">
                <div>
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <h3>{item.name}</h3>
                    <p className="ml-4">${(item.price / 100).toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex-1 flex items-end justify-between text-sm">
                  <p className="text-gray-500">Qty {item.quantity}</p>
                </div>
                {/* Review Form */}
                <OrderItemReviewForm
                  productId={item.id}
                  productName={item.name}
                  alreadyReviewed={!!reviewed[item.id]}
                  onReviewSubmit={() => handleReviewSubmit(item.id)}
                />
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex-col items-start space-y-4 bg-gray-50 p-6">
        <div className="flex justify-between w-full text-base font-medium text-gray-900">
          <p>Subtotal</p>
          <p>${(subtotal / 100).toFixed(2)}</p>
        </div>
        {shipping !== undefined ? (
          <div className="flex justify-between w-full text-base font-medium text-gray-900">
            <p>Shipping</p>
            <p>${(shipping / 100).toFixed(2)}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Enter your address to see shipping costs.</p>
        )}
        {total !== undefined && (
          <div className="border-t border-gray-200 pt-4 mt-4 w-full">
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <p>Total</p>
              <p>${(total / 100).toFixed(2)}</p>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
