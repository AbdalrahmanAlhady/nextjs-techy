"use server";
import { db, products } from '@/packages/db';
import { eq } from 'drizzle-orm';

// Product status type
export type ProductStatus = 'ACTIVE' | 'DRAFT' | 'ARCHIVED';

// Fetch all products
export async function getAllProducts() {
  try {
    const result = await db.select().from(products);
    return { success: true, products: result };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// Fetch a single product by ID
export async function getProductById(productId: string) {
  try {
    const result = await db.select().from(products).where(eq(products.id, productId));
    if (result.length === 0) {
      return { success: false, error: 'Product not found' };
    }
    return { success: true, product: result[0] };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// Add a product
export async function addProduct(product: {
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  status?: ProductStatus;
  vendorId: string;
  categoryId?: string;
}) {
  try {
    await db.insert(products).values(product);
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: (error as Error).message };
  }
}

// Edit a product
export async function editProduct(productId: string, updates: {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  image?: string;
  status?: ProductStatus;
  categoryId?: string;
}) {
  try {
    await db.update(products).set(updates).where(eq(products.id, productId));
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// Delete a product
export async function deleteProduct(productId: string) {
  try {
    await db.delete(products).where(eq(products.id, productId));
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
