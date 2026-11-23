import type { Request, Response } from 'express';
import { db } from '@/server/db/client';
import { pageViews } from '@/server/db/schema';
import { getAuth } from '@/lib/auth/auth';
import { sql, gte, and, count } from 'drizzle-orm';

async function checkAdmin(req: Request, res: Response): Promise<boolean> {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: req.headers as Record<string, string> });
  if (!session?.user) { res.status(401).json({ error: 'Unauthorized' }); return true; }
  if (!session.user.isAdmin) { res.status(403).json({ error: 'Forbidden' }); return true; }
  return false;
}

export default async function handler(req: Request, res: Response) {
  if (await checkAdmin(req, res)) return;

  try {
    const days = Number(req.query.days ?? 7);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [totalRow] = await db
      .select({ total: count() })
      .from(pageViews)
      .where(gte(pageViews.createdAt, since));

    const [sessRow] = await db
      .select({ unique: sql<number>`COUNT(DISTINCT ${pageViews.sessionId})` })
      .from(pageViews)
      .where(and(gte(pageViews.createdAt, since)));

    const topPages = await db
      .select({ path: pageViews.path, views: count() })
      .from(pageViews)
      .where(gte(pageViews.createdAt, since))
      .groupBy(pageViews.path)
      .orderBy(sql`count(*) DESC`)
      .limit(10);

    const byDay = await db
      .select({
        date: sql<string>`DATE(${pageViews.createdAt})`,
        views: count(),
      })
      .from(pageViews)
      .where(gte(pageViews.createdAt, since))
      .groupBy(sql`DATE(${pageViews.createdAt})`)
      .orderBy(sql`DATE(${pageViews.createdAt}) ASC`);

    const topReferrers = await db
      .select({ referrer: pageViews.referrer, views: count() })
      .from(pageViews)
      .where(and(gte(pageViews.createdAt, since)))
      .groupBy(pageViews.referrer)
      .orderBy(sql`count(*) DESC`)
      .limit(8);

    res.json({
      period: days,
      totalViews: totalRow.total,
      uniqueSessions: sessRow.unique,
      topPages,
      byDay,
      topReferrers: topReferrers.filter(r => r.referrer),
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
