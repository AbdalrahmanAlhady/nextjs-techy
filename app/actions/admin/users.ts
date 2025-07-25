"use server";
import { db, users } from '@/packages/db';
import { eq } from 'drizzle-orm';

export async function getAllUsers() {
  try {
    const result = await db.select().from(users);
    return { success: true, users: result };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function suspendUser(userId: string) {
  try {
    await db.update(users).set({ status: 'SUSPENDED' }).where(eq(users.id, userId));
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function reinstateUser(userId: string) {
  try {
    await db.update(users).set({ status: 'ACTIVE' }).where(eq(users.id, userId));
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getUserById(userId: string) {
  try {
    const result = await db.select().from(users).where(eq(users.id, userId));
    if (result.length === 0) {
      return { success: false, error: 'User not found' };
    }
    return { success: true, user: result[0] };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteUser(userId: string) {
  try {
    await db.delete(users).where(eq(users.id, userId));
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
