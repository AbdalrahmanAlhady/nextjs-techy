"use client";
import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import SimplePagination from '@/components/ui/simple-pagination';
import { Pencil, Archive, RotateCcw, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import StatusChip from '@/components/ui/StatusChip';
import { handleArchiveVendorProduct, handleUnarchiveVendorProduct, handleDeleteVendorProduct } from '@/app/actions/vendor/product-ui';
import { handleDeleteProduct as handleDeleteAdminProduct } from '@/app/actions/admin/product-ui';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import StockBadge from '../ui/StockBadge';
import SummaryCard from '../ui/SummaryCard';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  vendorId?: string; // Optional for vendor view
  updatedAt: Date;
}

interface Props {
  products: Product[];
  view: 'admin' | 'vendor';
}

export default function ProductTable({ products, view }: Props) {
  const ITEMS_PER_PAGE = 5;
  const [page, setPage] = useState(1);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));
  const paginated = products.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const { toast } = useToast();
  const router = useRouter();

  const handleArchive = async (productId: string) => {
    setActionLoadingId(productId);
    const res = await handleArchiveVendorProduct(productId);
    if (res.success) {
      toast({ title: 'Archived', description: 'Product archived.' });
      router.refresh();
    } else {
      toast({ title: 'Error', description: res.error, variant: 'destructive' });
    }
    setActionLoadingId(null);
  };

  const handleUnarchive = async (productId: string) => {
    setActionLoadingId(productId);
    const res = await handleUnarchiveVendorProduct(productId);
    if (res.success) {
      toast({ title: 'Restored', description: 'Product is active again.' });
      router.refresh();
    } else {
      toast({ title: 'Error', description: res.error, variant: 'destructive' });
    }
    setActionLoadingId(null);
  };

  const handleDelete = async (productId: string) => {
    setActionLoadingId(productId);
    const res = view === 'admin' ? await handleDeleteAdminProduct(productId) : await handleDeleteVendorProduct(productId);
    if (res.success) {
      toast({ title: 'Deleted', description: 'Product permanently removed.' });
      router.refresh();
    } else {
      toast({ title: 'Error', description: res.error, variant: 'destructive' });
    }
    setActionLoadingId(null);
  };

  const active = products.filter(p => p.status === 'ACTIVE').length;
  const draft = products.filter(p => p.status === 'DRAFT').length;
  const lowStock = products.filter(p => p.stock < 10).length;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard label="Total Products" value={products.length} />
        <SummaryCard label="Active" value={active} classNameValue="text-green-600" />
        <SummaryCard label="Draft" value={draft} classNameValue="text-yellow-600" />
        <SummaryCard label="Low Stock" value={lowStock} classNameValue="text-red-600" />
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Products List</h2>
        <Link href={`/${view}/products/add`}><Button>Add New Product</Button></Link>
      </div>

      <div className="bg-white rounded-lg border shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              {view === 'admin' && <TableHead>Vendor</TableHead>}
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow><TableCell colSpan={view === 'admin' ? 7 : 6} className="h-24 text-center">No products.</TableCell></TableRow>
            ) : (
              paginated.map(p => (
                <TableRow key={p.id}>
                  <TableCell>{p.name}</TableCell>
                  {view === 'admin' && <TableCell>{p.vendorId}</TableCell>}
                  <TableCell>${p.price.toFixed(2)}</TableCell>
                  <TableCell><StockBadge stock={p.stock} /></TableCell>
                  <TableCell><StatusChip status={p.status} /></TableCell>
                  <TableCell>{new Date(p.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <TooltipProvider><Tooltip><TooltipTrigger asChild>
                        <Link href={`/${view}/products/edit/${p.id}`}>
                          <Button className="h-8 w-8 p-0" title="Edit">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TooltipTrigger><TooltipContent>Edit</TooltipContent></Tooltip></TooltipProvider>
                      {view === 'vendor' && p.status !== 'ARCHIVED' && (
                        <TooltipProvider><Tooltip><TooltipTrigger asChild>
                          <Button disabled={actionLoadingId === p.id} onClick={() => handleArchive(p.id)} className="h-8 w-8 p-0 text-orange-600" title="Archive">
                            {actionLoadingId === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Archive className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger><TooltipContent>Archive</TooltipContent></Tooltip></TooltipProvider>
                      )}
                      {view === 'vendor' && p.status === 'ARCHIVED' && (
                        <TooltipProvider><Tooltip><TooltipTrigger asChild>
                          <Button disabled={actionLoadingId === p.id} onClick={() => handleUnarchive(p.id)} className="h-8 w-8 p-0 text-green-600" title="Unarchive">
                            {actionLoadingId === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger><TooltipContent>Unarchive</TooltipContent></Tooltip></TooltipProvider>
                      )}
                      <TooltipProvider><Tooltip><TooltipTrigger asChild>
                        <Button disabled={actionLoadingId === p.id} onClick={() => handleDelete(p.id)} className="h-8 w-8 p-0 text-red-600" title="Delete">
                          {actionLoadingId === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </TooltipTrigger><TooltipContent>Delete</TooltipContent></Tooltip></TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <SimplePagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
