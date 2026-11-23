import type { Request, Response } from 'express';
import { db } from '@/server/db/client';
import { user } from '@/server/db/schema';
import { eq, count } from 'drizzle-orm';
import { getAuth } from '@/lib/auth/auth';

export default async function handler(req: Request, res: Response) {
  try {
    // Only allow if no admin exists yet
    const [existing] = await db.select({ count: count() }).from(user);
    if (existing.count > 0) {
      return res.status(403).json({ error: 'Setup already complete. Use /admin/login.' });
    }
    const { email, password, name } = req.body as { email: string; password: string; name: string };
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'email, password, name required' });
    }
    // Temporarily enable signup to create the first admin
    const auth = getAuth();
    const result = await auth.api.signUpEmail({
      body: { email, password, name },
      headers: req.headers as Record<string, string>,
    });
    if (!result) {
      return res.status(400).json({ error: 'Signup failed' });
    }
    // Mark as admin
    await db.update(user).set({ isAdmin: true }).where(eq(user.email, email));
    res.json({ ok: true, message: 'Admin account created. You can now log in at /admin/login.' });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
