"use server";
import { db, reviews, users } from '@/packages/db';
import { eq } from 'drizzle-orm';

export async function getProductReviews(productId: string) {
  // Fetch reviews and reviewer info
  const reviewRows = await db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      comment: reviews.comment,
      createdAt: reviews.createdAt,
      userId: reviews.userId,
      userName: users.name,
    })
    .from(reviews)
    .leftJoin(users, eq(users.id, reviews.userId))
    .where(eq(reviews.productId, productId));

  // Calculate average rating
  const ratings = reviewRows.map(r => r.rating);
  const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

  return {
    reviews: reviewRows,
    average: avgRating,
    count: ratings.length,
  };
}
