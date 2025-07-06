import type { NextApiRequest, NextApiResponse } from 'next';
import { submitReview } from '@/app/actions/submit-review';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { productId, rating, comment } = req.body;
  if (!productId || !rating) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const result = await submitReview({ productId, rating: Number(rating), comment });
    if (!result.success) {
      return res.status(400).json({ error: result.error || 'Failed to submit review' });
    }
    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
