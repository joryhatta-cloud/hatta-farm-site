import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router';
import { Helmet } from '@dr.pogodin/react-helmet';
import { useSession } from '@/lib/auth/auth-client';
import { admin_properties as t } from 'virtual:content';
import type { Property } from '@/lib/property-types';
import {
  Plus, Search, Pencil, Trash2, Star, CheckCircle,
  XCircle, BedDouble, Users, ArrowLeft, X, Leaf, Save
} from 'lucide-react';

const CATEGORIES = [
  { value: 'resort', label: 'منتجع' },
  { value: 'chalet', label: 'شاليه' },
  { value: 'farm-stay', label: 'إقامة مزرعة' },
  { value: 'holiday-home', label: 'بيت عطلة' },
  { value: 'room', label: 'غرفة' },
  { value: 'event-stay', label: 'إقامة مناسبات' },
];

const EMPTY_FORM = {
  nameEn: '', nameAr: '', slug: '', category: 'resort',
  descriptionEn: '', descriptionAr: '',
  locationEn: '', locationAr: '', mapsUrl: '',
  bedrooms: 1, bathrooms: 1, maxGuests: 2,
  pricePerNight: '', whatsappNumber: '971501848844',
  hasPool: false, hasBreakfast: false, hasKitchen: true,
  hasBbq: false, hasHousekeeping: false,
  featured: false, active: true,
  amenities: [] as string[], images: [] as string[],
};

type FormData = typeof EMPTY_FORM;

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function AdminPropertiesPage() {
  const { user, isPending } = useSession();
  const navigate = useNavigate();
  const [props, setProps] = useState<Property[]>([]);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!isPending && !user) navigate('/admin/login');
  }, [user, isPending, navigate]);

  const fetchProps = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (catFilter !== 'all') params.set('category', catFilter);
      if (search) params.set('search', search);
      const r = await fetch('/api/admin/properties?' + params.toString(), { credentials: 'include' });
      const data = await r.json() as Property[];
      setProps(data);
    } catch { /* ignore */ }
    setLoading(false);
  }, [catFilter, search]);

  useEffect(() => { if (user) fetchProps(); }, [user, fetchProps]);

  function openAdd() {
    setEditId(null);
    setForm({ ...EMPTY_FORM });
    setFormError('');
    setShowForm(true);
  }

  function openEdit(p: Property) {
    setEditId(p.id);
    setForm({
      nameEn: p.nameEn, nameAr: p.nameAr, slug: p.slug, category: p.category,
      descriptionEn: p.descriptionEn ?? '', descriptionAr: p.descriptionAr ?? '',
      locationEn: p.locationEn ?? '', locationAr: p.locationAr ?? '',
      mapsUrl: p.mapsUrl ?? '', bedrooms: p.bedrooms ?? 1,
      bathrooms: p.bathrooms ?? 1, maxGuests: p.maxGuests ?? 2,
      pricePerNight: p.pricePerNight ?? '', whatsappNumber: p.whatsappNumber ?? '971501848844',
      hasPool: p.hasPool ?? false, hasBreakfast: p.hasBreakfast ?? false,
      hasKitchen: p.hasKitchen ?? true, hasBbq: p.hasBbq ?? false,
      hasHousekeeping: p.hasHousekeeping ?? false,
      featured: p.featured ?? false, active: p.active ?? true,
      amenities: (p.amenities as string[]) ?? [], images: (p.images as string[]) ?? [],
    });
    setFormError('');
    setShowForm(true);
  }

  async function handleDelete(id: number) {
    if (!confirm(t.deleteConfirm)) return;
    await fetch('/api/admin/properties/' + id, { method: 'DELETE', credentials: 'include' });
    fetchProps();
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      const url = editId ? '/api/admin/properties/' + editId : '/api/admin/properties';
      const method = editId ? 'PUT' : 'POST';
      const r = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      if (!r.ok) {
        const err = await r.json() as { error?: string };
        setFormError(err.error ?? 'حدث خطأ');
      } else {
        setShowForm(false);
        fetchProps();
      }
    } catch {
      setFormError('حدث خطأ في الاتصال');
    }
    setSaving(false);
  }

  function setField<K extends keyof FormData>(key: K, val: FormData[K]) {
    setForm(f => ({ ...f, [key]: val }));
    if (key === 'nameEn' && !editId) {
      setForm(f => ({ ...f, nameEn: val as string, slug: slugify(val as string) }));
    }
  }

  if (isPending || !user) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-[hsl(var(--primary))]/20 border-t-[hsl(var(--primary))] rounded-full animate-spin" /></div>;
  }

  return (
    <>
      <Helmet>
        <title>{t.title} — Hatta Farm Admin</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="description" content="Manage Hatta Farm accommodation listings — add, edit, and delete properties." />
      </Helmet>

      <div className="min-h-screen bg-[hsl(var(--background))]">
        {/* Top bar */}
        <header className="bg-[hsl(var(--primary))] text-white px-6 py-4 flex items-center gap-4">
          <Link to="/admin" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2 flex-1">
            <Leaf className="w-5 h-5 text-[hsl(var(--accent))]" />
            <h1 className="font-semibold">{t.title}</h1>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t.addBtn}
          </button>
        </header>

        <div className="p-6 max-w-6xl mx-auto">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-9 pr-4 py-2.5 border border-[hsl(var(--border))] rounded-xl text-sm bg-[hsl(var(--card))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/20"
              />
            </div>
            <select
              value={catFilter}
              onChange={e => setCatFilter(e.target.value)}
              className="px-4 py-2.5 border border-[hsl(var(--border))] rounded-xl text-sm bg-[hsl(var(--card))] focus:outline-none"
            >
              <option value="all">{t.allCategories}</option>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-[hsl(var(--primary))]/20 border-t-[hsl(var(--primary))] rounded-full animate-spin" />
            </div>
          ) : props.length === 0 ? (
            <div className="text-center py-20 text-[hsl(var(--muted-foreground))]">{t.noResults}</div>
          ) : (
            <div className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]">
                      <th className="text-right px-4 py-3 font-medium text-[hsl(var(--muted-foreground))]">العقار</th>
                      <th className="text-right px-4 py-3 font-medium text-[hsl(var(--muted-foreground))] hidden sm:table-cell">الفئة</th>
                      <th className="text-right px-4 py-3 font-medium text-[hsl(var(--muted-foreground))] hidden md:table-cell">التفاصيل</th>
                      <th className="text-right px-4 py-3 font-medium text-[hsl(var(--muted-foreground))]">الحالة</th>
                      <th className="text-right px-4 py-3 font-medium text-[hsl(var(--muted-foreground))]">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.map((p, i) => (
                      <tr key={p.id} className={`border-b border-[hsl(var(--border))] last:border-0 ${i % 2 === 0 ? '' : 'bg-[hsl(var(--background))]/40'}`}>
                        <td className="px-4 py-3">
                          <p className="font-medium text-[hsl(var(--foreground))]">{p.nameEn}</p>
                          <p className="text-xs text-[hsl(var(--muted-foreground))]" dir="rtl">{p.nameAr}</p>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] text-xs px-2 py-1 rounded-full">
                            {CATEGORIES.find(c => c.value === p.category)?.label ?? p.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <div className="flex items-center gap-3 text-[hsl(var(--muted-foreground))]">
                            <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" />{p.bedrooms}</span>
                            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{p.maxGuests}</span>
                            {p.featured && <Star className="w-3.5 h-3.5 text-[hsl(var(--accent))]" />}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {p.active
                            ? <span className="flex items-center gap-1 text-green-600 text-xs"><CheckCircle className="w-3.5 h-3.5" />{t.activeLabel}</span>
                            : <span className="flex items-center gap-1 text-[hsl(var(--muted-foreground))] text-xs"><XCircle className="w-3.5 h-3.5" />{t.inactiveLabel}</span>
                          }
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEdit(p)}
                              className="flex items-center gap-1 text-xs text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/10 px-2 py-1.5 rounded-lg transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              {t.editBtn}
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="flex items-center gap-1 text-xs text-red-500 hover:bg-red-50 px-2 py-1.5 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              {t.deleteBtn}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Slide-over form ────────────────────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="w-full max-w-xl bg-[hsl(var(--background))] h-full overflow-y-auto shadow-2xl flex flex-col">
            {/* Form header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[hsl(var(--border))] bg-[hsl(var(--primary))] text-white">
              <h2 className="font-semibold">{editId ? t.editTitle : t.addTitle}</h2>
              <button onClick={() => setShowForm(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 p-6 space-y-5">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{formError}</div>
              )}

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1">{t.fields.nameEn} *</label>
                  <input value={form.nameEn} onChange={e => setField('nameEn', e.target.value)} required
                    className="w-full px-3 py-2.5 border border-[hsl(var(--border))] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/20 bg-[hsl(var(--card))]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1">{t.fields.nameAr} *</label>
                  <input value={form.nameAr} onChange={e => setField('nameAr', e.target.value)} required dir="rtl"
                    className="w-full px-3 py-2.5 border border-[hsl(var(--border))] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/20 bg-[hsl(var(--card))]" />
                </div>
              </div>

              {/* Slug + Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1">{t.fields.slug} *</label>
                  <input value={form.slug} onChange={e => setField('slug', e.target.value)} required
                    className="w-full px-3 py-2.5 border border-[hsl(var(--border))] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/20 bg-[hsl(var(--card))] font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1">{t.fields.category} *</label>
                  <select value={form.category} onChange={e => setField('category', e.target.value)}
                    className="w-full px-3 py-2.5 border border-[hsl(var(--border))] rounded-xl text-sm focus:outline-none bg-[hsl(var(--card))]">
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1">{t.fields.descEn}</label>
                <textarea value={form.descriptionEn} onChange={e => setField('descriptionEn', e.target.value)} rows={3}
                  className="w-full px-3 py-2.5 border border-[hsl(var(--border))] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/20 bg-[hsl(var(--card))] resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1">{t.fields.descAr}</label>
                <textarea value={form.descriptionAr} onChange={e => setField('descriptionAr', e.target.value)} rows={3} dir="rtl"
                  className="w-full px-3 py-2.5 border border-[hsl(var(--border))] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/20 bg-[hsl(var(--card))] resize-none" />
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1">{t.fields.locationEn}</label>
                  <input value={form.locationEn} onChange={e => setField('locationEn', e.target.value)}
                    className="w-full px-3 py-2.5 border border-[hsl(var(--border))] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/20 bg-[hsl(var(--card))]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1">{t.fields.locationAr}</label>
                  <input value={form.locationAr} onChange={e => setField('locationAr', e.target.value)} dir="rtl"
                    className="w-full px-3 py-2.5 border border-[hsl(var(--border))] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/20 bg-[hsl(var(--card))]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1">{t.fields.mapsUrl}</label>
                <input value={form.mapsUrl} onChange={e => setField('mapsUrl', e.target.value)} type="url"
                  className="w-full px-3 py-2.5 border border-[hsl(var(--border))] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/20 bg-[hsl(var(--card))]" />
              </div>

              {/* Numbers */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1">{t.fields.bedrooms}</label>
                  <input type="number" min={1} value={form.bedrooms} onChange={e => setField('bedrooms', Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-[hsl(var(--border))] rounded-xl text-sm focus:outline-none bg-[hsl(var(--card))]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1">{t.fields.bathrooms}</label>
                  <input type="number" min={1} value={form.bathrooms} onChange={e => setField('bathrooms', Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-[hsl(var(--border))] rounded-xl text-sm focus:outline-none bg-[hsl(var(--card))]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1">{t.fields.maxGuests}</label>
                  <input type="number" min={1} value={form.maxGuests} onChange={e => setField('maxGuests', Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-[hsl(var(--border))] rounded-xl text-sm focus:outline-none bg-[hsl(var(--card))]" />
                </div>
              </div>

              {/* Price + WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1">{t.fields.pricePerNight}</label>
                  <input value={form.pricePerNight} onChange={e => setField('pricePerNight', e.target.value)} placeholder="AED 800 / night"
                    className="w-full px-3 py-2.5 border border-[hsl(var(--border))] rounded-xl text-sm focus:outline-none bg-[hsl(var(--card))]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1">{t.fields.whatsapp}</label>
                  <input value={form.whatsappNumber} onChange={e => setField('whatsappNumber', e.target.value)}
                    className="w-full px-3 py-2.5 border border-[hsl(var(--border))] rounded-xl text-sm focus:outline-none bg-[hsl(var(--card))]" />
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {([
                  ['hasPool', t.fields.hasPool],
                  ['hasBreakfast', t.fields.hasBreakfast],
                  ['hasKitchen', t.fields.hasKitchen],
                  ['hasBbq', t.fields.hasBbq],
                  ['hasHousekeeping', t.fields.hasHousekeeping],
                  ['featured', t.fields.featured],
                  ['active', t.fields.active],
                ] as [keyof FormData, string][]).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl px-3 py-2.5">
                    <input
                      type="checkbox"
                      checked={form[key] as boolean}
                      onChange={e => setField(key, e.target.checked)}
                      className="w-4 h-4 accent-[hsl(var(--primary))]"
                    />
                    <span className="text-xs text-[hsl(var(--foreground))]">{label}</span>
                  </label>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60">
                  <Save className="w-4 h-4" />
                  {saving ? '...' : t.saveBtn}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-6 border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] rounded-xl transition-colors text-sm">
                  {t.cancelBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
