import React from 'react';
import { getSessionFromCookie } from '@/app/actions/get-session';
import { redirect } from 'next/navigation';
import ProductForm from '@/components/products/ProductForm';
import { getAllCategories } from '@/app/actions/admin-categories';
import { getAllVendors } from '@/app/actions/admin-vendors';
import { getProductById } from '@/app/actions/admin-products';
import BackButton from '@/components/ui/BackButton';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  
  const session = await getSessionFromCookie();
  if (!session || typeof session !== 'object' || session.role !== 'ADMIN') {
    redirect('/not-authorized');
  }

  const { product, success, error } = await getProductById(id);
  const { categories } = await getAllCategories();
  const { vendors } = await getAllVendors();

  if (!success || !product) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error || 'Product not found'}
        </div>
      </div>
    );
  }
  return (
    <div className="p-8">
      <BackButton />
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Edit Product</h2>
        <p className="text-gray-500">Update product details</p>
      </div>

      <div className="max-w-2xl">
        <ProductForm
          initialData={{
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            status: product.status,
            categoryId: product.categoryId,
            image: product.image,
            vendorId: product.vendorId,
          }}

            categories={categories!.map(c=>({id:c.id,name:c.name}))}
            vendors={vendors!.map((v: { id: string; name: string | null; email: string | null }) => ({ id: v.id, name: v.name ?? v.email ?? 'Unnamed' }))}
        />
      </div>
    </div>
  );
}
