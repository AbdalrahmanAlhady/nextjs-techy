'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@/types';

interface CategoryFilterProps {
  categories: Category[];
}

const CategoryFilter = ({ categories }: CategoryFilterProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category');

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category === 'All' || category === selectedCategory) {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    params.set('page', '1'); // Reset to first page

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="font-bold text-lg text-neutral mb-4">Categories</h3>
        <div className="space-y-2">
          <button
            onClick={() => handleCategoryClick('All')}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
              !selectedCategory
                ? 'bg-primary text-white'
                : 'text-neutral hover:bg-secondary'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                selectedCategory === category.name
                  ? 'bg-primary text-white'
                  : 'text-neutral hover:bg-secondary'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default CategoryFilter;
