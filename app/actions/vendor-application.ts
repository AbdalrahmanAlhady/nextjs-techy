"use server";

import { db } from "@/packages/db";
import { users } from "@/packages/db/schema";
import { eq } from "drizzle-orm";

import { getSessionFromCookie } from "@/app/actions/get-session";
import { redirect } from "next/navigation";

export async function applyForVendorStatus(formData?: FormData) {
  const session = await getSessionFromCookie();
  const userId =
    session && typeof session === "object" ? (session as any).id : null;

  if (!userId) {
    return;
  }
  // Set vendorStatus to 'PENDING' for this user
  await db
    .update(users)
    .set({ vendorStatus: "PENDING" })
    .where(eq(users.id, userId));
  
  // Redirect to refresh the page after update
  redirect('/vendor-application');
}
