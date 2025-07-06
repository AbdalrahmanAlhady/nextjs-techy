import React from 'react';
import { getCategoryById } from '@/app/actions/admin-categories';
import CategoryForm from '@/components/categories/CategoryForm';
import BackButton from '@/components/ui/BackButton';

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const { category, success, error } = await getCategoryById(id);

  if (!success || !category) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Error: {error || 'Category not found.'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <BackButton />
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Edit Category</h2>
        <p className="text-gray-500">Update the details for the category: {category.name}</p>
      </div>
      <CategoryForm category={category} />
    </div>
  );
}
