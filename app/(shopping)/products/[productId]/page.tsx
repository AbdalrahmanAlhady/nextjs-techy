import { db } from '@/packages/db';
import { products } from '@/packages/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/ProductDetailClient';

interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;

  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
  });

  if (!product) {
    notFound();
  }

  return (
    <ProductDetailClient product={product} />
  );
}
