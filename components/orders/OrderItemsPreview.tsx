import React, { useState } from 'react';
import type { OrderItem } from '@/types/order';

interface OrderItemsPreviewProps {
  items: OrderItem[];
}

export default function OrderItemsPreview({ items }: OrderItemsPreviewProps) {
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? items : items.slice(0, 5);
  return (
    <div>
      <div className="flex -space-x-4">
        {visibleItems.map((item, idx) => (
          <div
            key={item.productId || idx}
            className="w-14 h-14 border rounded-md overflow-hidden bg-gray-100 relative z-10"
            style={{ marginLeft: idx === 0 ? 0 : '-1rem' }}
          >
            <img
              src={item.image}
              alt={item.productName}
              className="w-full h-full object-cover object-center"
            />
          </div>
        ))}
        {items.length > 5 && !expanded && (
          <div className="w-14 h-14 flex items-center justify-center bg-gray-200 text-gray-600 text-sm font-semibold rounded-md relative z-20 border" style={{ marginLeft: '-1rem' }}>
            +{items.length - 5}
          </div>
        )}
      </div>
      {items.length > 5 && (
        <button
          className="mt-2 text-xs text-blue-600 underline"
          onClick={() => setExpanded((e) => !e)}
        >
          {expanded ? 'Show Less' : 'Show All'}
        </button>
      )}
    </div>
  );
}
