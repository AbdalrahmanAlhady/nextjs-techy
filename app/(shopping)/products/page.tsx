import { getApprovedProducts } from '@/lib/actions/product.actions';
import { getCategories } from '@/lib/actions/category.actions';
import ProductCard from '@/components/ProductCard';
import { Pagination } from '@/components/Pagination';
import CategoryFilter from '@/components/CategoryFilter';
import SortDropdown from '@/components/SortDropdown';
import { Product } from '@/types';

export default async function ProductsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const category = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : undefined;
  const sortBy = typeof resolvedSearchParams.sortBy === 'string' ? resolvedSearchParams.sortBy : undefined;

  const { products, total } = await getApprovedProducts({ page: currentPage, category, sortBy });
  const categories = await getCategories();

  const sortOptions = [
    { value: 'date-desc', label: 'Newest' },
    { value: 'date-asc', label: 'Oldest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
  ];

  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (sortBy) params.set('sortBy', sortBy);
  const baseUrl = `/products?${params.toString()}`;

  return (
      <div className="bg-secondary min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral mb-2">All Products</h1>
            <p className="text-neutral-muted">Discover premium tech products from trusted vendors</p>
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <CategoryFilter categories={categories} />
            <main className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <p className="text-neutral-muted">Showing {products.length} of {total} products</p>
                <SortDropdown sortOptions={sortOptions} />
              </div>
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product: Product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <p>No products found.</p>
              )}
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(total / 20)}
                  baseUrl={baseUrl}
                />
              </div>
            </main>
          </div>
        </div>
      </div>

  );
}

