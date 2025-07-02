'use client';
import { useState } from 'react';
import { handleUpdateOrderItemStatus } from '@/app/actions/vendor-order-ui';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface Props { item: any }

export default function OrderItemRow({ item }: Props) {
  const [status, setStatus] = useState(item.status);
  const [loading, setLoading] = useState(false);

  const nextStatusMap: any = {
    PENDING: 'PROCESSING',
    PROCESSING: 'SHIPPED',
    SHIPPED: 'DELIVERED'
  };

  const handleAdvance = async () => {
    const next = nextStatusMap[status];
    if (!next) return;
    setLoading(true);
    const res = await handleUpdateOrderItemStatus(item.itemId, next);
    if (res.success) setStatus(next);
    setLoading(false);
  };

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">{item.productName}</td>
      <td className="px-6 py-4">{item.quantity}</td>
      <td className="px-6 py-4">${item.price}</td>
      <td className="px-6 py-4">{status}</td>
      <td className="px-6 py-4 text-right">
        {status !== 'DELIVERED' && (
          <Button onClick={handleAdvance} disabled={loading} className="h-8">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Advance'}
          </Button>
        )}
      </td>
    </tr>
  );
}
