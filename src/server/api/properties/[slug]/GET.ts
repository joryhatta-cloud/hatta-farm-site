import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { properties } from '../../../db/schema.js';
import { eq, and } from 'drizzle-orm';

export default async function handler(req: Request<{ slug: string }>, res: Response) {
  try {
    const { slug } = req.params;
    const rows = await db.select().from(properties)
      .where(and(eq(properties.slug, slug), eq(properties.active, true)))
      .limit(1);
    if (!rows.length) return res.status(404).json({ error: 'Property not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch property', message: String(error) });
  }
}
