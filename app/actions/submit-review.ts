"use server";
import { db, reviews } from "@/packages/db";
import { getSessionFromCookie } from "./auth/get-session";

export async function submitReview({ productId, rating, comment }: { productId: string; rating: number; comment: string }) {
  const session = await getSessionFromCookie();
  if (!session || typeof session !== "object" || !('id' in session)) {
    return { success: false, error: "Not authenticated" };
  }
  const userId = session.id;
  try {
    await db.insert(reviews).values({
      userId,
      productId,
      rating,
      comment,
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
