import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Helmet } from '@dr.pogodin/react-helmet';
import { signIn } from '@/lib/auth/auth-client';
import { admin_login as t } from 'virtual:content';
import { Eye, EyeOff, Lock, Mail, Leaf } from 'lucide-react';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await signIn.email({ email, password });
      if (result.error) {
        setError('{t.errorMsg}');
      } else {
        navigate('/admin');
      }
    } catch {
      setError('{t.errorGeneric}');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>{t.title} — {t.subtitle} | {t.brandName}</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="description" content="Admin login for Hatta Farm property management." />
      </Helmet>
      <div className="min-h-screen bg-[hsl(var(--primary))] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[hsl(var(--accent))] rounded-2xl mb-4 shadow-lg">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-light text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Hatta Farm
            </h1>
            <p className="text-white/60 text-sm mt-1">{t.subtitle}</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-xl font-semibold text-[hsl(var(--primary))] mb-6 text-center">
              تسجيل الدخول
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1.5">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder={t.emailPlaceholder}
                    className="w-full pl-10 pr-4 py-3 border border-[hsl(var(--border))] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30 focus:border-[hsl(var(--primary))] bg-[hsl(var(--background))]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1.5">
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 border border-[hsl(var(--border))] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30 focus:border-[hsl(var(--primary))] bg-[hsl(var(--background))]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 mt-2"
              >
                {loading ? t.loadingBtn : t.submitBtn}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
