"use server";
import { db } from "@/packages/db";
import { users } from "@/packages/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function signUpAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { success: false, error: "All fields are required." };
  }
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .then((res) => res[0]);
  if (existing) {
    return { success: false, error: "Email is already registered." };
  }
  const hashed = await bcrypt.hash(password, 10);
  const { createId } = await import("@paralleldrive/cuid2");
  const id = createId();
  await db.insert(users).values({
    id,
    email,
    password: hashed,
    name,
    role: "BUYER",
    vendorStatus: "NONE",
  });

  // Redirect to sign-in page after successful signup
  redirect("/sign-in");
}
