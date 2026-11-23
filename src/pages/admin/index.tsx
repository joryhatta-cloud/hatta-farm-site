import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Helmet } from '@dr.pogodin/react-helmet';
import { useSession, LogoutButton } from '@/lib/auth/auth-client';
import { admin_dashboard as t } from 'virtual:content';
import {
  LayoutDashboard, Building2, Star, Activity,
  ChevronRight, Leaf, LogOut, Users, BarChart2
} from 'lucide-react';

interface Stats {
  total: number;
  active: number;
  featured: number;
  byCategory: { category: string; count: number }[];
}

export default function AdminDashboardPage() {
  const { user, isPending } = useSession();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!isPending && !user) navigate('/admin/login');
  }, [user, isPending, navigate]);

  useEffect(() => {
    if (user) {
      fetch('/api/admin/stats', { credentials: 'include' })
        .then(r => r.json())
        .then((d: Stats) => setStats(d))
        .catch(() => null);
    }
  }, [user]);

  if (isPending || !user) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[hsl(var(--primary))]/20 border-t-[hsl(var(--primary))] rounded-full animate-spin" />
      </div>
    );
  }

  const catLabel: Record<string, string> = {
    resort: t.categories.resort,
    chalet: t.categories.chalet,
    'farm-stay': t.categories['farm-stay'],
    'holiday-home': t.categories['holiday-home'],
    room: t.categories.room,
    'event-stay': t.categories['event-stay'],
  };

  return (
    <>
      <Helmet>
        <title>{t.title} — Hatta Farm</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="description" content="Hatta Farm admin dashboard — manage properties and view statistics." />
      </Helmet>

      <div className="min-h-screen bg-[hsl(var(--background))]">
        {/* Sidebar + Main layout */}
        <div className="flex min-h-screen">

          {/* ── Sidebar ─────────────────────────────────────────────────── */}
          <aside className="w-64 bg-[hsl(var(--primary))] text-white flex flex-col hidden md:flex">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[hsl(var(--accent))] rounded-xl flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Hatta Farm</p>
                  <p className="text-white/50 text-xs">{t.title}</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              <Link
                to="/admin"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/10 text-white text-sm font-medium"
              >
                <LayoutDashboard className="w-4 h-4" />
                {t.title}
              </Link>
              <Link
                to="/admin/properties"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 text-white/70 hover:text-white text-sm transition-colors"
              >
                <Building2 className="w-4 h-4" />
                {t.manageProps}
              </Link>
              <Link
                to="/admin/analytics"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 text-white/70 hover:text-white text-sm transition-colors"
              >
                <BarChart2 className="w-4 h-4" />
                تحليلات الزوار
              </Link>
            </nav>

            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.name ?? user.email}</p>
                  <p className="text-xs text-white/50 truncate">{user.email}</p>
                </div>
              </div>
              <LogoutButton className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm py-2 rounded-xl transition-colors">
                <LogOut className="w-4 h-4" />
                {t.logoutBtn}
              </LogoutButton>
            </div>
          </aside>

          {/* ── Main ────────────────────────────────────────────────────── */}
          <main className="flex-1 p-6 md:p-8 overflow-auto">
            {/* Mobile header */}
            <div className="flex items-center justify-between mb-6 md:hidden">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[hsl(var(--accent))] rounded-lg flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-[hsl(var(--primary))]">Hatta Farm Admin</span>
              </div>
              <LogoutButton className="flex items-center gap-1.5 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]">
                <LogOut className="w-4 h-4" />
                {t.logoutBtn}
              </LogoutButton>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-light text-[hsl(var(--primary))]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {t.welcome}، {user.name ?? 'Admin'}
              </h1>
              <p className="text-[hsl(var(--muted-foreground))] mt-1 text-sm">{t.statsTitle}</p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">{t.totalProps}</p>
                  <Building2 className="w-5 h-5 text-[hsl(var(--accent))]" />
                </div>
                <p className="text-3xl font-semibold text-[hsl(var(--primary))]">{stats?.total ?? '—'}</p>
              </div>
              <div className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">{t.activeProps}</p>
                  <Activity className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-3xl font-semibold text-[hsl(var(--primary))]">{stats?.active ?? '—'}</p>
              </div>
              <div className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">{t.featuredProps}</p>
                  <Star className="w-5 h-5 text-[hsl(var(--accent))]" />
                </div>
                <p className="text-3xl font-semibold text-[hsl(var(--primary))]">{stats?.featured ?? '—'}</p>
              </div>
            </div>

            {/* By category */}
            {stats?.byCategory && stats.byCategory.length > 0 && (
              <div className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] p-6 mb-6">
                <h2 className="text-lg font-semibold text-[hsl(var(--primary))] mb-4">توزيع العقارات</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {stats.byCategory.map(c => (
                    <div key={c.category} className="flex items-center justify-between bg-[hsl(var(--background))] rounded-xl px-4 py-3 border border-[hsl(var(--border))]">
                      <span className="text-sm text-[hsl(var(--muted-foreground))]">{catLabel[c.category] ?? c.category}</span>
                      <span className="font-semibold text-[hsl(var(--primary))]">{c.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick action */}
            <Link
              to="/admin/properties"
              className="flex items-center justify-between bg-[hsl(var(--primary))] text-white rounded-2xl p-6 hover:bg-[hsl(var(--primary))]/90 transition-colors group"
            >
              <div>
                <p className="font-semibold text-lg">{t.manageProps}</p>
                <p className="text-white/60 text-sm mt-0.5">{t.managePropsDesc}</p>
              </div>
              <ChevronRight className="w-6 h-6 text-white/60 group-hover:translate-x-1 transition-transform" />
            </Link>
          </main>
        </div>
      </div>
    </>
  );
}
