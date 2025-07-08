"use server";

import { revalidatePath } from 'next/cache';
import { db } from '@/packages/db';
import { categories } from '@/packages/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

// Helper function to generate a URL-friendly slug
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-');    // Replace multiple - with single -
};

// Zod schema for category validation
const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long.'),
  description: z.string().optional(),
});

// --- CRUD ACTIONS ---

/**
 * Get all categories from the database.
 */
export async function getAllCategories() {
  try {
    const allCategories = await db.select().from(categories).orderBy(categories.name);
    return { success: true, categories: allCategories };
  } catch (error) {
    return { success: false, error: 'Failed to fetch categories.' };
  }
}

/**
 * Get a single category by its ID.
 */
export async function getCategoryById(id: string) {
  try {
    const result = await db.select().from(categories).where(eq(categories.id, id));
    if (result.length === 0) {
      return { success: false, error: 'Category not found.' };
    }
    return { success: true, category: result[0] };
  } catch (error) {
    return { success: false, error: 'Failed to fetch category.' };
  }
}

/**
 * Create a new category.
 */
export async function createCategory(formData: FormData) {
  const validatedFields = categorySchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return { success: false, error: 'Invalid fields.', details: validatedFields.error.flatten().fieldErrors };
  }

  const { name, description } = validatedFields.data;
  const slug = slugify(name);

  try {
    await db.insert(categories).values({ name, slug, description });
    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to create category. The category name or slug might already exist.' };
  }
}

/**
 * Update an existing category.
 */
export async function updateCategory(id: string, formData: FormData) {
  const validatedFields = categorySchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return { success: false, error: 'Invalid fields.', details: validatedFields.error.flatten().fieldErrors };
  }

  const { name, description } = validatedFields.data;
  const slug = slugify(name);

  try {
    await db.update(categories).set({ name, slug, description }).where(eq(categories.id, id));
    revalidatePath('/admin/categories');
    revalidatePath(`/admin/categories/edit/${id}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update category.' };
  }
}

/**
 * Delete a category by its ID.
 */
export async function deleteCategory(id: string) {
  try {
    await db.delete(categories).where(eq(categories.id, id));
    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete category.' };
  }
}
