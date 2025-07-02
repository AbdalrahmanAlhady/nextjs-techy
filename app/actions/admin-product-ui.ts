'use server';

import { revalidatePath } from 'next/cache';
import { addProduct, editProduct, deleteProduct } from './admin-products';

export type ProductFormData = {
  name: string;
  description: string;
  price: number;
  stock: number;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  categoryId?: string;
  image?: string;
  vendorId: string;
};

export async function handleAddProduct(data: ProductFormData) {
  try {
    const result = await addProduct(data);
    if (result.success) {
      revalidatePath('/admin/products');
      return { success: true };
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    return { 
      success: false, 
      error: (error as Error).message 
    };
  }
}

export async function handleEditProduct(productId: string, data: ProductFormData) {
  try {
    // vendorId should not be part of update columns – remove it before sending to editProduct
    const { vendorId, ...updates } = data;
    const result = await editProduct(productId, updates);
    if (result.success) {
      revalidatePath('/admin/products');
      return { success: true };
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    return { 
      success: false, 
      error: (error as Error).message 
    };
  }
}

export async function handleDeleteProduct(productId: string) {
  try {
    const result = await deleteProduct(productId);
    if (result.success) {
      revalidatePath('/admin/products');
      return { success: true };
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    return { 
      success: false, 
      error: (error as Error).message 
    };
  }
} 