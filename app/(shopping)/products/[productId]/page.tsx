import { db } from '@/packages/db';
import { products } from '@/packages/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/ProductDetailClient';
import Layout from '@/components/Layout';

interface ProductPageProps {
  params: {
    productId: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Next.js may provide `params` as a Promise in recent versions, so await it defensively
  const { productId } = (await params as any);
  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
  });

  if (!product) {
    notFound();
  }

  return (
    <Layout>
      <ProductDetailClient product={product} />
    </Layout>
  );
}
