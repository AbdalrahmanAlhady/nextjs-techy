import type { NextApiRequest, NextApiResponse } from 'next';
import { hasPurchasedProduct } from '@/app/actions/buyer-has-purchased-product';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { productId } = req.query;
  if (!productId || typeof productId !== 'string') {
    return res.status(400).json({ error: 'Missing productId' });
  }
  try {
    const result = await hasPurchasedProduct(productId);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
