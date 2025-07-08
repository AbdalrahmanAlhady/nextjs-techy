"use server";
import { db } from "@/packages/db";
import { users } from "@/packages/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  if (!email || !password) {
    return { success: false, error: "All fields are required." };
  }
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .then((res) => res[0]);
  if (!existing) {
    return { success: false, error: "User not found." };
  }
  const valid = await bcrypt.compare(password, existing.password);
  if (!valid) {
    return { success: false, error: "Invalid password." };
  }
  const jwt = await import("jsonwebtoken");
  const token = jwt.sign(
    { id: existing.id, email: existing.email, name: existing.name, role: existing.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );
  return {
    success: true,
    token,
    user: { id: existing.id, email: existing.email, name: existing.name, role: existing.role },
  };
}
