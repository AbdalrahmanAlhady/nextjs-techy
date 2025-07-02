'use server';

import { db } from '@/packages/db';
import { categories } from '@/packages/db/schema';

/**
 * Fetches all product categories from the database.
 * @returns A promise that resolves to an array of categories.
 */
export async function getCategories() {
  try {
    const allCategories = await db.select().from(categories);
    return allCategories;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw new Error('Failed to fetch categories.');
  }
}
