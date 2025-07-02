'use client';
import { useEffect, useState } from 'react';
import { getVendorOrders } from '@/app/actions/vendor-orders';
import OrdersTable from '@/components/orders/OrdersTable';
import HomeButton from '@/components/ui/HomeButton';

interface OrderRow {
  orderId: string;
  createdAt: Date;
  buyerId: string;
  status: string;
}

export default function OrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderRow[]>([]);

  useEffect(() => {
    getVendorOrders().then(res => {
      if (res.success) setOrders(res.orders ?? []);
      setLoading(false);
    });
  }, []);

  // route-level skeleton handles loading
  if (loading) {
    return null;
  }

  const pending = orders.filter(o => o.status === 'PENDING').length;
  const processing = orders.filter(o => o.status === 'PROCESSING').length;
  const shipped = orders.filter(o => o.status === 'SHIPPED').length;
  const delivered = orders.filter(o => o.status === 'DELIVERED').length;

  return (
    <div className="p-8 space-y-8">
      <HomeButton />
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-lg p-4 text-center"><div className="text-2xl font-bold">{pending}</div><div className="text-sm text-gray-500">Pending</div></div>
        <div className="bg-white shadow rounded-lg p-4 text-center"><div className="text-2xl font-bold">{processing}</div><div className="text-sm text-gray-500">Processing</div></div>
        <div className="bg-white shadow rounded-lg p-4 text-center"><div className="text-2xl font-bold">{shipped}</div><div className="text-sm text-gray-500">Shipped</div></div>
        <div className="bg-white shadow rounded-lg p-4 text-center"><div className="text-2xl font-bold">{delivered}</div><div className="text-sm text-gray-500">Delivered</div></div>
      </div>

      <h1 className="text-2xl font-bold">Orders</h1>

      <OrdersTable orders={orders} />
    </div>
  );
}
