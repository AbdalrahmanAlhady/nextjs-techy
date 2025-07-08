"use server";

import { db } from "@/packages/db";
import { users } from "@/packages/db/schema";
import { eq } from "drizzle-orm";
import { getSessionFromCookie } from "@/app/actions/auth/get-session";

export async function adminUpdateUserRoleAction({
  userId,
  newRole,
}: {
  userId: string;
  newRole: "ADMIN" | "VENDOR" | "BUYER";
}) {
  const session = await getSessionFromCookie();
  if (!session || typeof session !== "object" || session === null || !("role" in session) || (session as any).role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  const result = await db.update(users).set({ role: newRole }).where(eq(users.id, userId));
  return { success: true, result };
}
