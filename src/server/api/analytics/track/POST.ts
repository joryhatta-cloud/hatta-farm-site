import type { Request, Response } from 'express';
import { db } from '@/server/db/client';
import { pageViews } from '@/server/db/schema';

export default async function handler(req: Request, res: Response) {
  try {
    const { path, referrer, sessionId } = req.body as {
      path: string;
      referrer?: string;
      sessionId?: string;
    };
    if (!path) return res.status(400).json({ error: 'path required' });

    const ua = req.headers['user-agent'] ?? null;
    await db.insert(pageViews).values({
      path: path.slice(0, 500),
      referrer: referrer ? referrer.slice(0, 500) : null,
      userAgent: ua ? ua.slice(0, 500) : null,
      sessionId: sessionId ? sessionId.slice(0, 64) : null,
    });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Failed to track' });
  }
}
