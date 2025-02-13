// pages/api/catalog.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { fetchCatalog } from '@/lib/actions/redis/catalog.actions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Fetch the catalog data, caching it in the response
    const filtredProducts = await fetchCatalog();

    // Set cache headers (Cache-Control is important here)
    res.setHeader('Cache-Control', 'public, max-age=600, stale-while-revalidate=300'); // Cache for 10 minutes

    // Return the data
    res.status(200).json(filtredProducts);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch catalog', error: error.message });
  }
}
