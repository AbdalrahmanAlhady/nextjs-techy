"use server";
import { db, products } from '@/packages/db';
import { eq, and } from 'drizzle-orm';
import { getSessionFromCookie } from '@/app/actions/get-session';

// Get all products for the current vendor
export async function getVendorProducts() {
  const session = await getSessionFromCookie();
  if (!session || typeof session !== 'object' || session.role !== 'VENDOR') {
    return { success: false, error: 'Not authorized', products: [] };
  }
  const vendorId = (session as any).id;
  try {
    const result = await db.select().from(products).where(eq(products.vendorId, vendorId));
    return { success: true, products: result };
  } catch (error) {
    return { success: false, error: (error as Error).message, products: [] };
  }
}

export type ProductStatus = 'ACTIVE' | 'DRAFT' | 'ARCHIVED';

export async function addVendorProduct(product: {
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  status?: ProductStatus;
  categoryId?: string;
}) {
  const session = await getSessionFromCookie();
  if (!session || typeof session !== 'object' || session.role !== 'VENDOR') {
    return { success: false, error: 'Not authorized' };
  }
  const vendorId = (session as any).id;
  try {
    await db.insert(products).values({ ...product, vendorId });
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function editVendorProduct(productId: string, updates: {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  image?: string;
  status?: ProductStatus;
  categoryId?: string;
}) {
  const session = await getSessionFromCookie();
  if (!session || typeof session !== 'object' || session.role !== 'VENDOR') {
    return { success: false, error: 'Not authorized' };
  }
  const vendorId = (session as any).id;
  try {
    // ensure ownership
    const existing = await db.select().from(products).where(eq(products.id, productId));
    if (!existing[0] || existing[0].vendorId !== vendorId) {
      return { success: false, error: 'Forbidden' };
    }
    await db.update(products).set(updates).where(eq(products.id, productId));
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getVendorProductById(productId: string) {
  const session = await getSessionFromCookie();
  if (!session || typeof session !== 'object' || session.role !== 'VENDOR') {
    return { success: false, error: 'Not authorized' };
  }
  const vendorId = (session as any).id;
  try {
    const result = await db.select().from(products).where(eq(products.id, productId));
    if (!result[0] || result[0].vendorId !== vendorId) {
      return { success: false, error: 'Product not found' };
    }
    return { success: true, product: result[0] };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function archiveVendorProduct(productId: string) {
  const session = await getSessionFromCookie();
  if (!session || typeof session !== 'object' || session.role !== 'VENDOR') {
    return { success: false, error: 'Not authorized' };
  }
  const vendorId = (session as any).id;
  try {
    await db.update(products)
      .set({ status: 'ARCHIVED' })
      .where(and(eq(products.id, productId), eq(products.vendorId, vendorId)));
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function unarchiveVendorProduct(productId: string) {
  const session = await getSessionFromCookie();
  if (!session || typeof session !== 'object' || session.role !== 'VENDOR') {
    return { success: false, error: 'Not authorized' };
  }
  const vendorId = (session as any).id;
  try {
    await db.update(products)
      .set({ status: 'ACTIVE' })
      .where(and(eq(products.id, productId), eq(products.vendorId, vendorId)));
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// Hard delete kept for admin use if needed
export async function deleteVendorProduct(productId: string) {
  const session = await getSessionFromCookie();
  if (!session || typeof session !== 'object' || session.role !== 'VENDOR') {
    return { success: false, error: 'Not authorized' };
  }
  const vendorId = (session as any).id;
  try {
    await db.delete(products).where(and(eq(products.id, productId), eq(products.vendorId, vendorId)));
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
