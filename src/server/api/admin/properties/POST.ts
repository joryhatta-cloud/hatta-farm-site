import type { Request, Response } from 'express';
import { db } from '@/server/db/client';
import { properties } from '@/server/db/schema';
import { requireAdmin } from '@/server/admin-guard';

export default async function handler(req: Request, res: Response) {
  const guard = await requireAdmin(req, res);
  if (!guard) return;
  try {
    const body = req.body;
    if (!body.slug || !body.nameEn || !body.nameAr || !body.category) {
      return res.status(400).json({ error: 'slug, nameEn, nameAr, category are required' });
    }
    const [result] = await db.insert(properties).values({
      ...body,
      amenities: body.amenities ?? [],
      images: body.images ?? [],
    });
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Failed', message: String(err) });
  }
}
