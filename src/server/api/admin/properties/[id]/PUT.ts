import type { Request, Response } from 'express';
import { db } from '@/server/db/client';
import { properties } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/server/admin-guard';

export default async function handler(req: Request<{ id: string }>, res: Response) {
  const guard = await requireAdmin(req, res);
  if (!guard) return;
  try {
    const { id: _id, createdAt: _c, ...body } = req.body;
    await db.update(properties).set(body).where(eq(properties.id, Number(req.params.id)));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed', message: String(err) });
  }
}
