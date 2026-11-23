import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Helmet } from '@dr.pogodin/react-helmet';
import { useSession } from '@/lib/auth/auth-client';
import { admin_analytics as t } from 'virtual:content';
import {
  ArrowLeft, Leaf, Eye, Users, TrendingUp,
  ExternalLink, BarChart2
} from 'lucide-react';

interface AnalyticsData {
  period: number;
  totalViews: number;
  uniqueSessions: number;
  topPages: { path: string; views: number }[];
  byDay: { date: string; views: number }[];
  topReferrers: { referrer: string | null; views: number }[];
}

const PERIODS = [
  { value: 7,  label: '' },
  { value: 30, label: '' },
  { value: 90, label: '' },
];

function Bar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex-1 h-2 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
      <div
        className="h-full bg-[hsl(var(--accent))] rounded-full transition-all duration-500"
        style={{ width: pct + '%' }}
      />
    </div>
  );
}

function MiniChart({ data }: { data: { date: string; views: number }[] }) {
  if (!data.length) return null;
  const max = Math.max(...data.map(d => d.views), 1);
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map(d => (
        <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group relative">
          <div
            className="w-full bg-[hsl(var(--primary))]/20 hover:bg-[hsl(var(--accent))]/60 rounded-sm transition-colors cursor-default"
            style={{ height: Math.max(4, Math.round((d.views / max) * 56)) + 'px' }}
          />
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[hsl(var(--primary))] text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {d.views}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const { user, isPending } = useSession();
  const navigate = useNavigate();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !user) navigate('/admin/login');
  }, [user, isPending, navigate]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch('/api/admin/analytics?days=' + days, { credentials: 'include' })
      .then(r => r.json())
      .then((d: AnalyticsData) => setData(d))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [user, days]);

  if (isPending || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[hsl(var(--primary))]/20 border-t-[hsl(var(--primary))] rounded-full animate-spin" />
      </div>
    );
  }

  const periodLabels = [t.last7days, t.last30days, t.last90days];
  const maxPageViews = data ? Math.max(...data.topPages.map(p => p.views), 1) : 1;
  const maxRefViews  = data ? Math.max(...data.topReferrers.map(r => r.views), 1) : 1;

  const friendlyPath = (p: string) => {
    const map: Record<string, string> = {
      '/': 'الصفحة الرئيسية',
      '/services': 'الخدمات',
      '/hatta-guide': 'دليل حتا',
      '/resorts': 'المنتجعات',
      '/chalets': 'الشاليهات',
      '/farm-stays': 'إقامات المزارع',
      '/holiday-homes': 'بيوت العطل',
      '/rooms': 'الغرف',
      '/event-friendly-stays': 'إقامات المناسبات',
    };
    return map[p] ?? p;
  };

  return (
    <>
      <Helmet>
        <title>{t.title} — Hatta Farm Admin</title>
        <meta name="description" content="Visitor analytics dashboard for Hatta Farm." />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="min-h-screen bg-[hsl(var(--background))]">
        {/* Top bar */}
        <header className="bg-[hsl(var(--primary))] text-white px-6 py-4 flex items-center gap-4">
          <Link to="/admin" className="text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2 flex-1">
            <Leaf className="w-5 h-5 text-[hsl(var(--accent))]" />
            <h1 className="font-semibold">{t.title}</h1>
          </div>
          {/* Period selector */}
          <div className="flex items-center gap-1 bg-white/10 rounded-xl p-1">
            {PERIODS.map((p, i) => (
              <button
                key={p.value}
                onClick={() => setDays(p.value)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${days === p.value ? 'bg-white text-[hsl(var(--primary))] font-semibold' : 'text-white/70 hover:text-white'}`}
              >
                {periodLabels[i]}
              </button>
            ))}
          </div>
        </header>

        <div className="p-6 max-w-5xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-4 border-[hsl(var(--primary))]/20 border-t-[hsl(var(--primary))] rounded-full animate-spin" />
            </div>
          ) : !data ? (
            <p className="text-center py-24 text-[hsl(var(--muted-foreground))]">{t.noData}</p>
          ) : (
            <div className="space-y-6">
              {/* KPI cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">{t.totalViews}</p>
                    <Eye className="w-5 h-5 text-[hsl(var(--accent))]" />
                  </div>
                  <p className="text-4xl font-semibold text-[hsl(var(--primary))]">
                    {data.totalViews.toLocaleString('ar-AE')}
                  </p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">{periodLabels[PERIODS.findIndex(p => p.value === days)]}</p>
                </div>
                <div className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">{t.uniqueSessions}</p>
                    <Users className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-4xl font-semibold text-[hsl(var(--primary))]">
                    {Number(data.uniqueSessions).toLocaleString('ar-AE')}
                  </p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">{periodLabels[PERIODS.findIndex(p => p.value === days)]}</p>
                </div>
              </div>

              {/* Daily chart */}
              {data.byDay.length > 0 && (
                <div className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-[hsl(var(--accent))]" />
                    <h2 className="font-semibold text-[hsl(var(--primary))]">{t.dailyViews}</h2>
                  </div>
                  <MiniChart data={data.byDay} />
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-[hsl(var(--muted-foreground))]">
                      {data.byDay[0]?.date}
                    </span>
                    <span className="text-xs text-[hsl(var(--muted-foreground))]">
                      {data.byDay[data.byDay.length - 1]?.date}
                    </span>
                  </div>
                </div>
              )}

              {/* Top pages + referrers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top pages */}
                <div className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart2 className="w-4 h-4 text-[hsl(var(--accent))]" />
                    <h2 className="font-semibold text-[hsl(var(--primary))]">{t.topPages}</h2>
                  </div>
                  {data.topPages.length === 0 ? (
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">{t.noData}</p>
                  ) : (
                    <div className="space-y-3">
                      {data.topPages.map(p => (
                        <div key={p.path} className="flex items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[hsl(var(--foreground))] truncate">
                              {friendlyPath(p.path)}
                            </p>
                            <p className="text-xs text-[hsl(var(--muted-foreground))] font-mono truncate">{p.path}</p>
                          </div>
                          <Bar value={p.views} max={maxPageViews} />
                          <span className="text-sm font-semibold text-[hsl(var(--primary))] w-10 text-left shrink-0">
                            {p.views}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Top referrers */}
                <div className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <ExternalLink className="w-4 h-4 text-[hsl(var(--accent))]" />
                    <h2 className="font-semibold text-[hsl(var(--primary))]">{t.topReferrers}</h2>
                  </div>
                  {data.topReferrers.length === 0 ? (
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">{t.noData}</p>
                  ) : (
                    <div className="space-y-3">
                      {data.topReferrers.map((r, i) => {
                        let label = r.referrer ?? 'مباشر';
                        try { label = new URL(r.referrer ?? '').hostname; } catch { /* keep raw */ }
                        return (
                          <div key={i} className="flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[hsl(var(--foreground))] truncate">{label}</p>
                            </div>
                            <Bar value={r.views} max={maxRefViews} />
                            <span className="text-sm font-semibold text-[hsl(var(--primary))] w-10 text-left shrink-0">
                              {r.views}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
