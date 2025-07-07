'use client';

import type { Order } from '@/types/order';
import React, { useState } from 'react';
import UserOrderCard from '@/components/orders/UserOrderCard';
import OrderSummary from '@/components/OrderSummary';
import { getBuyerOrderById } from '../actions/buyer-orders';

interface UserOrdersListProps {
  orders: Order[];
}

export default function UserOrdersList({ orders }: UserOrdersListProps) {
  const ITEMS_PER_PAGE = 5;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(orders.length / ITEMS_PER_PAGE));
  const paginatedOrders = orders.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<Record<string, any>>({});

  const handleExpand = async (orderId: string) => {
    setExpandedId(expandedId === orderId ? null : orderId);
    if (!orderDetails[orderId]) {
      // Fetch order details from server
      const res = await getBuyerOrderById(orderId);
      if (res.success) {
        setOrderDetails((prev) => ({ ...prev, [orderId]: res.order }));
      }
    }
  };

  return (
    <div>
      {orders.length === 0 ? (
        <div className="text-center text-gray-500 py-12">No orders found.</div>
      ) : (
        <>
          {paginatedOrders.map((order) => {
          const details = orderDetails[order.id];
          const isLoading = expandedId === order.id && !details;
          const detailsContent = isLoading ? (
            <div className="mt-4 flex items-center gap-2 text-gray-500 text-sm">
              <span className="loader border-2 border-gray-300 border-t-blue-500 rounded-full w-5 h-5 animate-spin"></span>
              Loading order details...
            </div>
          ) : details ? (
            <>
              <OrderSummary
                cartItems={details.items.map((item: any) => ({
                  key: item.itemId,
                  id: item.productId,
                  name: item.productName,
                  price: item.price,
                  quantity: item.quantity,
                  image: item.image,
                }))}
                subtotal={details.total}
                shipping={details.shippingCost}
                total={details.total}
                showReviews={true}
              />
              <div className="mt-4 text-sm text-gray-700">
                <div className="font-semibold mb-1">Shipping Address:</div>
                <div>{details.shippingAddress?.street}, {details.shippingAddress?.city}, {details.shippingAddress?.state} {details.shippingAddress?.zip}, {details.shippingAddress?.country}</div>
              </div>
            </>
          ) : <div className="mt-4 text-sm text-gray-700">No details available</div>;
          return (
            <UserOrderCard
              key={order.id}
              order={{
                id: order.id,
                createdAt: order.createdAt,
                status: details ? details.status : order.status,
                total: order.total,
                shippingCost: order.shippingCost,
                shippingAddress: details ? details.shippingAddress : undefined,
                items: order.items,
                detailsContent,
              }}
              expanded={expandedId === order.id}
              onExpand={handleExpand}
            />
          );
        })}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              className="px-3 py-1 rounded border bg-white disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </button>
            <span className="text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              className="px-3 py-1 rounded border bg-white disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
