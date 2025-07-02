// File: lib/actions/product.actions.ts
'use server';

import { db } from '@/packages/db';
import { products, categories } from '@/packages/db/schema';
import { count, eq, and, asc, desc } from 'drizzle-orm';

/**
 * Fetches a paginated list of active products.
 * @param page - The page number to retrieve.
 * @param limit - The number of products per page.
 * @returns A promise that resolves to the list of products.
 */

interface GetApprovedProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  sortBy?: string;
}

export async function getApprovedProducts({ page = 1, limit = 20, category, sortBy }: GetApprovedProductsParams) {
  try {
    const offset = (page - 1) * limit;

    const whereConditions = [eq(products.status, 'ACTIVE')];

    if (category && category !== 'All') {
      const categoryResult = await db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.name, category))
        .limit(1);

      if (categoryResult.length > 0) {
        whereConditions.push(eq(products.categoryId, categoryResult[0].id));
      } else {
        // If category doesn't exist, return no products
        return { products: [], total: 0 };
      }
    }

    let orderBy;
    switch (sortBy) {
      case 'price-asc':
        orderBy = asc(products.price);
        break;
      case 'price-desc':
        orderBy = desc(products.price);
        break;
      case 'date-asc':
        orderBy = asc(products.createdAt);
        break;
      case 'date-desc':
        orderBy = desc(products.createdAt);
        break;
      default:
        orderBy = desc(products.createdAt);
    }

    const productList = await db
      .select()
      .from(products)
      .where(and(...whereConditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const totalProducts = await db
      .select({ value: count() })
      .from(products)
      .where(and(...whereConditions));

    return { products: productList, total: totalProducts[0].value };
  } catch (error) {
    console.error('Failed to fetch approved products:', error);
    throw new Error('Failed to fetch approved products.');
  }
}
