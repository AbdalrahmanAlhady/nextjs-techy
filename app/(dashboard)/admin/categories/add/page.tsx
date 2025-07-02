import React from 'react';
import CategoryForm from '@/components/categories/CategoryForm';
import BackButton from '@/components/ui/BackButton';

export default function AddCategoryPage() {
  return (
        <div className="p-8">
      <BackButton />
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Add New Category</h2>
        <p className="text-gray-500">Create a new category to organize your products.</p>
      </div>
      <CategoryForm />
    </div>
  );
}
