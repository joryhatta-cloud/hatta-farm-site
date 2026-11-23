import { useState } from 'react';
import { Link } from 'react-router';
import { Helmet } from '@dr.pogodin/react-helmet';
import { admin_setup as t } from 'virtual:content';
import { Leaf, CheckCircle } from 'lucide-react';

export default function AdminSetupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const r = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await r.json() as { ok?: boolean; error?: string };
      if (!r.ok) {
        setError(data.error ?? 'حدث خطأ');
      } else {
        setDone(true);
      }
    } catch {
      setError('حدث خطأ في الاتصال');
    }
    setLoading(false);
  }

  return (
    <>
      <Helmet>
        <title>{t.title} — Hatta Farm</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="description" content="First-time admin account setup for Hatta Farm." />
      </Helmet>
      <div className="min-h-screen bg-[hsl(var(--primary))] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[hsl(var(--accent))] rounded-2xl mb-4 shadow-lg">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-light text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Hatta Farm</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {done ? (
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-[hsl(var(--foreground))] font-medium mb-6">{t.successMsg}</p>
                <Link to="/admin/login" className="inline-block bg-[hsl(var(--primary))] text-white font-semibold px-6 py-3 rounded-xl">
                  {t.goToLogin}
                </Link>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-[hsl(var(--primary))] mb-2 text-center">{t.title}</h2>
                <p className="text-sm text-[hsl(var(--muted-foreground))] text-center mb-6">{t.subtitle}</p>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1.5">{t.nameLabel}</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required
                      className="w-full px-4 py-3 border border-[hsl(var(--border))] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30 bg-[hsl(var(--background))]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1.5">{t.emailLabel}</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                      className="w-full px-4 py-3 border border-[hsl(var(--border))] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30 bg-[hsl(var(--background))]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1.5">{t.passwordLabel}</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
                      className="w-full px-4 py-3 border border-[hsl(var(--border))] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30 bg-[hsl(var(--background))]" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 mt-2">
                    {loading ? t.loadingBtn : t.submitBtn}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
