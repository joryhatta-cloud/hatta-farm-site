import type { Request, Response } from 'express';
import { getAuth } from '@/lib/auth/auth';

export async function requireAdmin(req: Request, res: Response): Promise<boolean> {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: req.headers as Record<string, string> });
    if (!session?.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return false;
    }
    if (!(session.user as { isAdmin?: boolean }).isAdmin) {
      res.status(403).json({ error: 'Forbidden — admin only' });
      return false;
    }
    return true;
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
}
