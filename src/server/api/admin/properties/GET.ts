import type { Request, Response } from 'express';
import { db } from '@/server/db/client';
import { properties } from '@/server/db/schema';
import { desc, like, eq, and, SQL } from 'drizzle-orm';
import { requireAdmin } from '@/server/admin-guard';

export default async function handler(req: Request, res: Response) {
  const guard = await requireAdmin(req, res);
  if (!guard) return;
  try {
    const { category, search, featured } = req.query as Record<string, string>;
    const conditions: SQL[] = [];
    if (category && category !== 'all') conditions.push(eq(properties.category, category));
    if (featured === 'true') conditions.push(eq(properties.featured, true));
    if (search) conditions.push(like(properties.nameEn, `%${search}%`));
    const rows = await db.select().from(properties)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(properties.id));
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed', message: String(err) });
  }
}
