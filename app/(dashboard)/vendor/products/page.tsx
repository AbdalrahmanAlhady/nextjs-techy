import { getVendorProducts } from '@/app/actions/vendor-products';
import ProductTable from '@/components/products/ProductTable';
import { getSessionFromCookie } from '@/app/actions/get-session';
import { redirect } from 'next/navigation';
import HomeButton from '@/components/ui/HomeButton';

export default async function VendorProductsPage() {
  const session = await getSessionFromCookie();
  if (!session || typeof session !== 'object' || session.role !== 'VENDOR') {
    redirect('/not-authorized');
  }
  const { products = [], success, error } = await getVendorProducts();
  if (!success) {
    return <div className="p-8 text-red-600">Error loading products: {error}</div>;
  }
  return (
        <div className="p-8">
      <HomeButton />
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">My Products</h2>
        <p className="text-gray-500">Manage your catalogue</p>
      </div>
      <ProductTable products={products} view="vendor" />
    </div>
  );
}
