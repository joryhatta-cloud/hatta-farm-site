import type { Request, Response } from 'express';
import { db } from '../../db/client.js';
import { properties } from '../../db/schema.js';
import { eq, and, asc } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const { category, featured } = req.query as Record<string, string>;
    const conditions = [eq(properties.active, true)];
    if (category) conditions.push(eq(properties.category, category));
    if (featured === 'true') conditions.push(eq(properties.featured, true));
    const rows = await db.select().from(properties).where(and(...conditions)).orderBy(asc(properties.id));
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties', message: String(error) });
  }
}
