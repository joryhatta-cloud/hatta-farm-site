import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import { SlidersHorizontal, Search, Users, BedDouble, Waves, Coffee } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import { useLang } from '@/lib/lang-context';
import type { Property } from '@/lib/property-types';
import { CATEGORY_LABELS, SLUG_TO_CATEGORY } from '@/lib/property-types';
import { category as pageCopy } from 'virtual:content';

function WhatsAppIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function GoldDivider() {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="h-px w-16 bg-[hsl(var(--accent))]/40" />
      <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent))] mx-3" />
      <div className="h-px w-16 bg-[hsl(var(--accent))]/40" />
    </div>
  );
}

export default function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { lang } = useLang();
  const categoryKey = SLUG_TO_CATEGORY[categorySlug ?? ''] ?? categorySlug ?? '';
  const catLabel = CATEGORY_LABELS[categoryKey];

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterPool, setFilterPool] = useState(false);
  const [filterBreakfast, setFilterBreakfast] = useState(false);
  const [filterGuests, setFilterGuests] = useState(0);

  useEffect(() => {
    setLoading(true);
    const params = categoryKey ? `?category=${encodeURIComponent(categoryKey)}` : '';
    fetch('/api/properties' + params)
      .then((r) => r.json())
      .then((data: unknown) => { setProperties(Array.isArray(data) ? (data as Property[]) : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [categoryKey]);

  const filtered = properties.filter((p) => {
    if (search && !p.nameEn.toLowerCase().includes(search.toLowerCase()) && !p.nameAr.includes(search)) return false;
    if (filterPool && !p.hasPool) return false;
    if (filterBreakfast && !p.hasBreakfast) return false;
    if (filterGuests > 0 && p.maxGuests < filterGuests) return false;
    return true;
  });

  const title = catLabel ? catLabel.en : 'All Accommodations';
  const titleAr = catLabel ? catLabel.ar : 'جميع الإقامات';

  return (
    <>
      <Helmet>
        <title>{title} — Hatta Farm</title>
        <meta name="description" content={`Browse ${title.toLowerCase()} in Hatta and Masfout. Luxury mountain accommodation with stunning views, private pools, and world-class amenities.`} />
        <meta property="og:title" content={`${title} — Hatta Farm`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <main>
        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative h-56 sm:h-72 overflow-hidden flex items-center justify-center bg-[hsl(var(--primary))]">
          <img
            src="/airo-assets/images/pages/home/hero"
            alt={title}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
            loading="eager"
            fetchPriority="high"
            width={1920}
            height={400}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--primary))]/60 to-[hsl(var(--primary))]/80 pointer-events-none" />
          <div className="relative z-10 text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' as const }}
            >
              <p className="text-[hsl(var(--accent))] text-xs font-semibold uppercase tracking-widest mb-2">Hatta Farm</p>
              <h1 className="text-3xl sm:text-5xl font-light text-white mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {lang === 'ar' ? titleAr : title}
              </h1>
              <GoldDivider />
            </motion.div>
          </div>
        </section>

        {/* ── BREADCRUMB ───────────────────────────────────────────────────── */}
        <nav aria-label="Breadcrumb" className="bg-[hsl(var(--muted))] border-b border-[hsl(var(--border))] px-4 py-3">
          <div className="max-w-[1400px] mx-auto flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
            <Link to="/" className="hover:text-[hsl(var(--primary))] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[hsl(var(--primary))] font-medium">{title}</span>
          </div>
        </nav>

        {/* ── FILTERS ──────────────────────────────────────────────────────── */}
        <section className="bg-[hsl(var(--background))] border-b border-[hsl(var(--border))] px-4 py-4 sticky top-0 z-20 shadow-sm">
          <div className="max-w-[1400px] mx-auto flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
              <input
                type="text"
                  placeholder={pageCopy.filters.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-[hsl(var(--border))] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <SlidersHorizontal className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />

              {/* Pool filter */}
              <button
                onClick={() => setFilterPool(!filterPool)}
                className={['flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border transition-colors', filterPool ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))] hover:border-blue-400'].join(' ')}
              >
                <Waves className="w-3.5 h-3.5" /> Pool
              </button>

              {/* Breakfast filter */}
              <button
                onClick={() => setFilterBreakfast(!filterBreakfast)}
                className={['flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border transition-colors', filterBreakfast ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))] hover:border-amber-400'].join(' ')}
              >
                <Coffee className="w-3.5 h-3.5" /> Breakfast
              </button>

              {/* Guests filter */}
              <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
                <Users className="w-3.5 h-3.5" />
                <select
                  value={filterGuests}
                  onChange={(e) => setFilterGuests(Number(e.target.value))}
                  className="text-xs border border-[hsl(var(--border))] rounded-lg px-2 py-2 bg-white focus:outline-none"
                >
                  <option value={0}>{pageCopy.filters.anyGuests}</option>
                  <option value={2}>2+</option>
                  <option value={4}>4+</option>
                  <option value={6}>6+</option>
                  <option value={10}>10+</option>
                </select>
              </div>

              {/* Bedroom filter */}
              <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
                <BedDouble className="w-3.5 h-3.5" />
                <span className="text-xs text-[hsl(var(--muted-foreground))]">{filtered.length} found</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── GRID ─────────────────────────────────────────────────────────── */}
        <section className="bg-[hsl(var(--background))] py-12 px-4">
          <div className="max-w-[1400px] mx-auto">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] h-96 animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-[hsl(var(--muted-foreground))] text-lg">{pageCopy.filters.noResults}</p>
                <p className="text-[hsl(var(--muted-foreground))] text-sm mt-2" dir="rtl">{pageCopy.filters.noResultsAr}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((p, i) => (
                  <PropertyCard key={p.id} property={p} index={i} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section className="bg-[hsl(var(--primary))] py-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-[hsl(var(--accent))] text-xs font-semibold uppercase tracking-widest mb-3">Need Help?</p>
            <h2 className="text-3xl font-light text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {pageCopy.cta.titleEn}
            </h2>
            <p className="text-white/60 text-sm mb-8" dir="rtl">{pageCopy.cta.titleAr}</p>
            <a
              href="https://wa.me/971501848844"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp-hover))] text-white font-semibold px-8 py-4 rounded-full transition-all duration-300"
            >
              <WhatsAppIcon />
              {pageCopy.cta.buttonEn} · <span dir="rtl">{pageCopy.cta.buttonAr}</span>
            </a>
          </div>
        </section>

        {/* Floating WhatsApp */}
        <motion.a
          href="https://wa.me/971501848844"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp-hover))] rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4, ease: 'easeOut' as const }}
          whileHover={{ scale: 1.1 }}
        >
          <span className="absolute inset-0 rounded-full bg-[hsl(var(--whatsapp))] animate-ping opacity-30" />
          <WhatsAppIcon className="w-7 h-7 text-white relative z-10" />
        </motion.a>
      </main>
    </>
  );
}
