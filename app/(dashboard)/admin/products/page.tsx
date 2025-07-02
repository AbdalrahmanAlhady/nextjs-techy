import React from 'react';
import { getAllProducts } from '@/app/actions/admin-products';
import ProductTable from '@/components/products/ProductTable';
import HomeButton from '@/components/ui/HomeButton';

export default async function AdminProductsPage() {
  const { products = [], success, error } = await getAllProducts();

  if (!success) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Error loading products: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
            <HomeButton />
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Management</h2>
        <p className="text-gray-500">Manage your product catalog</p>
      </div>

      <ProductTable products={products} view="admin" />
    </div>
  );
} 