'use client';
import React, { useState } from 'react';
import SimplePagination from '@/components/ui/simple-pagination';
import Link from 'next/link';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import StatusChip from '@/components/ui/StatusChip';

interface OrderRow {
  orderId: string;
  createdAt: Date;
  buyerId: string;
  status: string;
}

interface Props {
  orders: OrderRow[];
}

export default function OrdersTable({ orders }: Props) {
  const ITEMS_PER_PAGE = 5;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(orders.length / ITEMS_PER_PAGE));
  const paginated = orders.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <>
      <div className="bg-white rounded-lg border shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow><TableCell colSpan={3} className="h-24 text-center">No orders found</TableCell></TableRow>
            ) : (
              paginated.map(o => (
                <TableRow key={o.orderId} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium text-blue-600">
                    <Link href={`/vendor/orders/${o.orderId}`}>{o.orderId}</Link>
                  </TableCell>
                  <TableCell>{new Date(o.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell><StatusChip status={o.status as any} /></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <SimplePagination page={page} totalPages={totalPages} onChange={setPage} />
    </>
  );
}
