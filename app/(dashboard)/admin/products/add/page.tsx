import React from 'react';
import { getSessionFromCookie } from '@/app/actions/auth/get-session';
import { redirect } from 'next/navigation';
import ProductForm from '@/components/products/ProductForm';
import { getAllCategories } from '@/app/actions/admin/categories';
import { getAllVendors } from '@/app/actions/admin/vendors';
import BackButton from '@/components/ui/BackButton';

export default async function AddProductPage() {
  const session = await getSessionFromCookie();
  if (!session || typeof session !== "object" || !("role" in session) || session.role !== "ADMIN") {
    redirect("/not-authorized");
  }

  const { categories } = await getAllCategories();
  const { vendors } = await getAllVendors();

  return (
        <div className="p-8">
      <BackButton />
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Add New Product</h2>
        <p className="text-gray-500">Create a new product in your catalog</p>
      </div>

      <div className="max-w-2xl">
        <ProductForm
            categories={categories?.map(c=>({id:c.id,name:c.name})) || []}
            vendors={vendors?.map(v=>({id:v.id,name:v.name || v.email})) || []}
          />
      </div>
    </div>
  );
} 