import { getSessionFromCookie } from '@/app/actions/auth/get-session';
import { redirect } from 'next/navigation';
import ProductForm from '@/components/products/ProductForm';
import { getAllCategories } from '@/app/actions/admin/categories';
import { getVendorProductById } from '@/app/actions/vendor/products';
import BackButton from '@/components/ui/BackButton';

export default async function EditVendorProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const session = await getSessionFromCookie();
  if (!session || typeof session !== 'object' || session.role !== 'VENDOR') {
    redirect('/not-authorized');
  }

  const { product, success, error } = await getVendorProductById(id);
  const { categories } = await getAllCategories();

  if (!success || !product) {
    return (
      <div className="p-8 text-red-600">{error || 'Product not found'}</div>
    );
  }
  return (
        <div className="p-8">
      <BackButton />
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Edit Product</h2>
        <p className="text-gray-500">Update your product</p>
      </div>
      <div className="max-w-2xl">
        <ProductForm
          initialData={product}
          vendorId={session.id as string}
          categories={categories?.map(c => ({ id: c.id, name: c.name })) || []}
        />
      </div>
    </div>
  );
}
