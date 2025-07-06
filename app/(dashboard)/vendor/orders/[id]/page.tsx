import { getVendorOrderById } from "@/app/actions/vendor-orders";
import { notFound } from "next/navigation";
import OrderItemRow from "@/components/orders/OrderItemRow";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import BackButton from "@/components/ui/BackButton";

export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const res = await getVendorOrderById(id);
  if (!res.success) notFound();
  const { order } = res;
  if (!order) notFound();
  return (
        <div className="p-8 space-y-6">
      <BackButton />
      <h1 className="text-2xl font-bold">Order #{order.id}</h1>
      <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>

      <div className="bg-white rounded-lg border shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.items.map((item: any) => (
              <OrderItemRow key={item.itemId} item={item} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
