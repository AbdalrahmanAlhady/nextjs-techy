import React from 'react';
import { getAllCategories } from '@/app/actions/admin/categories';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import CategoryTable from '@/components/categories/CategoryTable';
import HomeButton from '@/components/ui/HomeButton';

export default async function AdminCategoriesPage() {
  const { categories = [], success, error } = await getAllCategories();

  if (!success) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Error loading categories: {error}
        </div>
      </div>
    );
  }

  return (
        <div className="p-8 space-y-8">
      <HomeButton />
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Category Management</h2>
          <p className="text-gray-500">Organize your products by category</p>
        </div>
        <Link href="/admin/categories/add">
          <Button>Add New Category</Button>
        </Link>
      </div>
      
      <CategoryTable categories={categories} />
    </div>
  );
}
