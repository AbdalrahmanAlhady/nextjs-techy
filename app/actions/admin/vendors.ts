"use server";
import { db, users } from '@/packages/db';
import { eq, or } from 'drizzle-orm';

// Fetch vendor applications or vendors
export async function getAllVendorApplications() {
  try {
    const vendors = await db.select().from(users).where(
      or(
        eq(users.role, 'VENDOR'),
        eq(users.vendorStatus, 'PENDING'),
        eq(users.vendorStatus, 'REJECTED')
      )
    );
    return { vendors, success: true };
  } catch (error) {
    return { vendors: [], success: false, error: (error as Error).message };
  }
}

export async function getAllVendors() {
  try {
    const vendors = await db.select().from(users).where(eq(users.role, 'VENDOR'));
    return { vendors, success: true };
  } catch (error) {
    return { vendors: [], success: false, error: (error as Error).message };
  }
}

import { sendEmail } from '../../utils/send-email';

export async function approveVendor(userId: string) {
  try {
    await db.update(users).set({ vendorStatus: 'APPROVED', role: 'VENDOR' }).where(eq(users.id, userId));
    const user = await db.select().from(users).where(eq(users.id, userId)).then(res => res[0]);
    if (user?.email) {
      await sendEmail({
        to: user.email,
        subject: 'Your Vendor Application Has Been Approved',
        text: `Congratulations, ${user.name || user.email}! Your vendor application has been approved. You can now access vendor features.`,
        html: `<p>Congratulations, <b>${user.name || user.email}</b>!<br>Your vendor application has been <b>approved</b>. You can now access vendor features.</p>`
      });
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getVendorById(userId: string) {
  try {
    const result = await db.select().from(users).where(eq(users.id, userId));
    if (result.length === 0) {
      return { success: false, error: 'Vendor not found' };
    }
    return { success: true, vendor: result[0] };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function denyVendor(userId: string) {
  try {
    await db.update(users).set({ vendorStatus: 'REJECTED' }).where(eq(users.id, userId));
    const user = await db.select().from(users).where(eq(users.id, userId)).then(res => res[0]);
    if (user?.email) {
      await sendEmail({
        to: user.email,
        subject: 'Your Vendor Application Has Been Rejected',
        text: `Hello, ${user.name || user.email}. Unfortunately, your vendor application was not approved. Contact support for details.`,
        html: `<p>Hello, <b>${user.name || user.email}</b>.<br>Unfortunately, your vendor application was <b>not approved</b>. Contact support for details.</p>`
      });
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
