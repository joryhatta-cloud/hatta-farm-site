import type { Request, Response } from 'express';
import { db } from '@/server/db/client';
import { properties } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/server/admin-guard';

export default async function handler(req: Request<{ id: string }>, res: Response) {
  const guard = await requireAdmin(req, res);
  if (!guard) return;
  try {
    const [row] = await db.select().from(properties).where(eq(properties.id, Number(req.params.id)));
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: 'Failed', message: String(err) });
  }
}
