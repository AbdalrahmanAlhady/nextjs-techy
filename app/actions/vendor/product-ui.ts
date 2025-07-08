'use server';
import { revalidatePath } from 'next/cache';
import { addVendorProduct, editVendorProduct, deleteVendorProduct, archiveVendorProduct, unarchiveVendorProduct } from './products';

export type VendorProductFormData = {
  name: string;
  description: string;
  price: number;
  stock: number;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  categoryId?: string;
  image?: string;
};

export async function handleAddVendorProduct(data: VendorProductFormData) {
  const result = await addVendorProduct(data);
  if (result.success) {
    revalidatePath('/vendor/products');
  }
  return result;
}

export async function handleEditVendorProduct(productId: string, data: VendorProductFormData) {
  const result = await editVendorProduct(productId, data);
  if (result.success) {
    revalidatePath('/vendor/products');
  }
  return result;
}

export async function handleDeleteVendorProduct(productId: string) {
  const result = await deleteVendorProduct(productId);
  if (result.success) {
    revalidatePath('/vendor/products');
  }
  return result;
}

export async function handleArchiveVendorProduct(productId: string) {
  const result = await archiveVendorProduct(productId);
  if (result.success) {
    revalidatePath('/vendor/products');
  }
  return result;
}

export async function handleUnarchiveVendorProduct(productId: string) {
  const result = await unarchiveVendorProduct(productId);
  if (result.success) {
    revalidatePath('/vendor/products');
  }
  return result;
}
