import React from 'react';

import type { Order } from '@/types/order';
import OrderItemsPreview from './OrderItemsPreview';

interface UserOrderCardProps {
  order: Order;
  onExpand: (orderId: string) => void;
  expanded: boolean;
}

export default function UserOrderCard({ order, onExpand, expanded }: UserOrderCardProps & { order: Order & { detailsContent?: React.ReactNode } }) {

  return (
    <div className="border rounded-lg bg-white shadow-sm mb-6 overflow-hidden">
      <button
        className="w-full flex flex-col md:flex-row items-center justify-between p-6 hover:bg-gray-50 transition text-left"
        onClick={() => onExpand(order.id)}
        aria-expanded={expanded}
        aria-controls={`order-details-${order.id}`}
      >
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Show up to 3 product images from the order */}
          <OrderItemsPreview items={order.items} />
          <div>
            <div className="font-semibold text-lg">Order #{order.id}</div>
            <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
            <div className="text-sm text-gray-700 mt-1">{order.items?.length || 0} item(s)</div>
          </div>
        </div>
        <div className="flex flex-col md:items-end gap-2 mt-4 md:mt-0">
          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            {order.status}
          </span>
          <div className="text-base font-semibold text-gray-900 mt-2 md:mt-0">
            ${((order.total || 0) / 100).toFixed(2)}
          </div>
        </div>
      </button>
      {expanded && (
        <div id={`order-details-${order.id}`} className="border-t bg-gray-50 p-6 animate-fade-in">
          {/* Order details go here (OrderSummary, address, etc.) */}
          {order.detailsContent}
        </div>
      )}
    </div>
  );
}
