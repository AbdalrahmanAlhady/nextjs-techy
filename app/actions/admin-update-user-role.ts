"use server";

import { db } from "@/packages/db";
import { users } from "@/packages/db/schema";
import { eq } from "drizzle-orm";
import { getSessionFromCookie } from "@/app/actions/get-session";

export async function adminUpdateUserRoleAction({ userId, newRole }: { userId: string; newRole: "ADMIN" | "VENDOR" | "BUYER" }) {
  // Only allow admins to update roles
  const session = await getSessionFromCookie();
  if (
    !session ||
    typeof session !== "object" ||
    session === null ||
    !('role' in session) ||
    (session as any).role !== "ADMIN"
  ) {
    return { success: false, error: "Unauthorized" };
  }

  // Update user role
  const result = await db.update(users)
    .set({ role: newRole })
    .where(eq(users.id, userId));

  return { success: true, result };
}
