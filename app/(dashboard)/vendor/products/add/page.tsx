import { getSessionFromCookie } from '@/app/actions/auth/get-session';
import { redirect } from 'next/navigation';
import ProductForm from '@/components/products/ProductForm';
import { getAllCategories } from '@/app/actions/admin/categories';
import BackButton from '@/components/ui/BackButton';

export default async function AddVendorProductPage() {
  const session = await getSessionFromCookie();
  if (!session || typeof session !== 'object' || session.role !== 'VENDOR') {
    redirect('/not-authorized');
  }
  const { categories } = await getAllCategories();
  return (
        <div className="p-8">
      <BackButton />
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Add New Product</h2>
        <p className="text-gray-500">Create a product listing</p>
      </div>
      <div className="max-w-2xl">
        <ProductForm
          categories={categories?.map(c => ({ id: c.id, name: c.name })) || []}
          vendorId={session.id as string}
        />
      </div>
    </div>
  );
}
