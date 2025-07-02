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

  // Check if user exists
  const existing = await db.select().from(users).where(eq(users.email, email)).then(res => res[0]);
  if (!existing) {
    return { success: false, error: "User not found." };
  }

  // Verify password
  const valid = await bcrypt.compare(password, existing.password);
  console.log(valid, password, existing.password);
  if (!valid) {
    return { success: false, error: "Invalid password." };
  }

  // Generate JWT for session
  const jwt = await import("jsonwebtoken");
  const token = jwt.sign(
    { id: existing.id, email: existing.email, name: existing.name, role: existing.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  // Set auth cookie
  const { setAuthCookie } = await import("./set-cookie");
  await setAuthCookie(token);
  return { success: true, token, user: { id: existing.id, email: existing.email, name: existing.name, role: existing.role } };
}

export async function signUpAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { success: false, error: "All fields are required." };
  }

  // Check if user already exists
  const existing = await db.select().from(users).where(eq(users.email, email)).then(res => res[0]);
  if (existing) {
    return { success: false, error: "Email is already registered." };
  }

  // Hash password
  const bcrypt = await import("bcryptjs");
  const hashed = await bcrypt.hash(password, 10);
  // Generate cuid for id
  const { createId } = await import("@paralleldrive/cuid2");
  const id = createId();

  // Insert user
  await db.insert(users).values({
    id,
    email,
    password: hashed,
    name,
    role: "BUYER",
    vendorStatus: "NONE",
  });

  return { success: true };
}


  