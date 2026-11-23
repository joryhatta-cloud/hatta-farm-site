import type { Request, Response } from 'express';
import { db } from '@/server/db/client';
import { properties } from '@/server/db/schema';
import { count, eq } from 'drizzle-orm';
import { requireAdmin } from '@/server/admin-guard';

export default async function handler(req: Request, res: Response) {
  const guard = await requireAdmin(req, res);
  if (!guard) return;
  try {
    const [total] = await db.select({ count: count() }).from(properties);
    const [active] = await db.select({ count: count() }).from(properties).where(eq(properties.active, true));
    const [featured] = await db.select({ count: count() }).from(properties).where(eq(properties.featured, true));
    const byCategory = await db.select({ category: properties.category, count: count() })
      .from(properties).groupBy(properties.category);
    res.json({ total: total.count, active: active.count, featured: featured.count, byCategory });
  } catch (err) {
    res.status(500).json({ error: 'Failed', message: String(err) });
  }
}
