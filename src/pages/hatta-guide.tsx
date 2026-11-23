import { useState } from 'react';
import { Link } from 'react-router';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion, AnimatePresence } from 'motion/react';
import {
  Utensils, Landmark, Mountain, ShoppingCart, Store, Cross,
  Siren, Truck, Phone, MapPin, ArrowRight, ExternalLink
} from 'lucide-react';
import { hatta_guide } from 'virtual:content';
import { useLang } from '@/lib/lang-context';

// ── Helpers ────────────────────────────────────────────────────────────────────

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' as const }}
      className={className}
    >
      {children}
    </motion.div>
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

function WhatsAppIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function getCategoryIcon(icon: string, cls = 'w-5 h-5') {
  if (icon === 'utensils') return <Utensils className={cls} />;
  if (icon === 'landmark') return <Landmark className={cls} />;
  if (icon === 'mountain') return <Mountain className={cls} />;
  if (icon === 'shopping-cart') return <ShoppingCart className={cls} />;
  if (icon === 'store') return <Store className={cls} />;
  if (icon === 'cross') return <Cross className={cls} />;
  if (icon === 'siren') return <Siren className={cls} />;
  return <Truck className={cls} />;
}

function getCategoryAccent(icon: string): string {
  if (icon === 'utensils') return 'bg-orange-50 text-orange-700 border-orange-200';
  if (icon === 'landmark') return 'bg-blue-50 text-blue-700 border-blue-200';
  if (icon === 'mountain') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (icon === 'shopping-cart') return 'bg-purple-50 text-purple-700 border-purple-200';
  if (icon === 'store') return 'bg-yellow-50 text-yellow-700 border-yellow-200';
  if (icon === 'cross') return 'bg-red-50 text-red-700 border-red-200';
  if (icon === 'siren') return 'bg-red-50 text-red-700 border-red-200';
  return 'bg-sky-50 text-sky-700 border-sky-200';
}

function getCategoryIconActive(icon: string): string {
  if (icon === 'utensils') return 'bg-orange-600 text-white';
  if (icon === 'landmark') return 'bg-blue-600 text-white';
  if (icon === 'mountain') return 'bg-emerald-600 text-white';
  if (icon === 'shopping-cart') return 'bg-purple-600 text-white';
  if (icon === 'store') return 'bg-yellow-600 text-white';
  if (icon === 'cross') return 'bg-red-600 text-white';
  if (icon === 'siren') return 'bg-red-600 text-white';
  return 'bg-sky-600 text-white';
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function HattaGuidePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const { lang, t } = useLang();

  return (
    <>
      <Helmet>
        <title>Hatta Local Guide — Hatta Farm</title>
        <meta name="description" content="Your complete bilingual guide to Hatta: restaurants, tourist attractions, adventure activities, supermarkets, shops, hospitals, emergency services and delivery." />
        <meta property="og:title" content="Hatta Local Guide — Hatta Farm" />
        <meta property="og:description" content="Explore the best of Hatta and Masfout with our curated local guide." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <main>
        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative h-72 sm:h-96 overflow-hidden flex items-center justify-center">
          <img
            src="/airo-assets/images/pages/hatta-guide/hero"
            alt="Hatta heritage village and mountains"
            className="absolute inset-0 w-full h-full object-cover"
            fetchPriority="high"
            loading="eager"
            width={1920}
            height={600}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--primary))]/70 via-[hsl(var(--primary))]/60 to-[hsl(var(--primary))]/80 pointer-events-none" />
          <div className="relative z-10 text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' as const }}
            >
              <p className="text-[hsl(var(--accent))] text-xs font-semibold uppercase tracking-widest mb-3">Hatta Farm</p>
              <h1
                className="text-4xl sm:text-5xl md:text-6xl font-light text-white mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {lang === 'ar' ? hatta_guide.hero.titleAr : hatta_guide.hero.titleEn}
              </h1>
              <GoldDivider />
              <p className="text-white/70 mt-4 text-sm sm:text-base max-w-xl mx-auto">{lang === 'ar' ? hatta_guide.hero.subtitleAr : hatta_guide.hero.subtitleEn}</p>
            </motion.div>
          </div>
        </section>

        {/* ── BREADCRUMB ───────────────────────────────────────────────────── */}
        <nav aria-label="Breadcrumb" className="bg-[hsl(var(--muted))] border-b border-[hsl(var(--border))] px-4 py-3">
          <div className="max-w-[1400px] mx-auto flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
            <Link to="/" className="hover:text-[hsl(var(--primary))] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[hsl(var(--primary))] font-medium">Hatta Guide</span>
          </div>
        </nav>

        {/* ── CATEGORY FILTER TABS ─────────────────────────────────────────── */}
        <section className="bg-[hsl(var(--background))] sticky top-0 z-30 border-b border-[hsl(var(--border))] shadow-sm">
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
              {/* All tab */}
              <button
                onClick={() => setActiveCategory('all')}
                className={[
                  'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border flex-shrink-0',
                  activeCategory === 'all'
                    ? 'bg-[hsl(var(--primary))] text-white border-[hsl(var(--primary))]'
                    : 'bg-white text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]/50 hover:text-[hsl(var(--primary))]'
                ].join(' ')}
              >
                {t('All', 'الكل')}
                <span className="text-xs opacity-60 ml-1">({hatta_guide.places.length})</span>
              </button>

              {hatta_guide.categories.map((cat) => {
                const count = hatta_guide.places.filter((p) => p.category === cat.id).length;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={[
                      'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border flex-shrink-0',
                      isActive
                        ? getCategoryIconActive(cat.icon) + ' border-transparent'
                        : 'bg-white text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]/50 hover:text-[hsl(var(--primary))]'
                    ].join(' ')}
                  >
                    {getCategoryIcon(cat.icon, 'w-4 h-4')}
                    <span>{lang === 'ar' ? cat.ar : cat.en}</span>
                    <span className="text-xs opacity-60 ml-1">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── PLACES GRID ──────────────────────────────────────────────────── */}
        <section className="bg-[hsl(var(--background))] py-12 px-4">
          <div className="max-w-[1400px] mx-auto">

            {/* Active category heading */}
            {activeCategory !== 'all' && (() => {
              const cat = hatta_guide.categories.find((c) => c.id === activeCategory);
              if (!cat) return null;
              return (
                <FadeIn className="mb-8">
                  <div className="flex items-center gap-3">
                    <div className={['w-10 h-10 rounded-xl flex items-center justify-center border', getCategoryAccent(cat.icon)].join(' ')}>
                      {getCategoryIcon(cat.icon)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-[hsl(var(--primary))]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {cat.en}
                      </h2>
                      <p className="text-[hsl(var(--muted-foreground))] text-sm" dir="rtl">{cat.ar}</p>
                    </div>
                  </div>
                </FadeIn>
              );
            })()}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: 'easeOut' as const }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {hatta_guide.places.map((place, i) => {
                  const cat = hatta_guide.categories.find((c) => c.id === place.category);
                  return (
                    <motion.div
                      key={place.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.4, ease: 'easeOut' as const }}
                      className={[
                        "bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] p-6 hover:border-[hsl(var(--accent))]/50 hover:shadow-lg transition-all duration-300 flex flex-col",
                        activeCategory !== 'all' && place.category !== activeCategory ? 'hidden' : ''
                      ].join(' ')}
                    >
                      {/* Category badge + name */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1">
                          {cat && (
                            <div className={['inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border mb-2', getCategoryAccent(cat.icon)].join(' ')}>
                              {getCategoryIcon(cat.icon, 'w-3 h-3')}
                              <span>{cat.en}</span>
                            </div>
                          )}
                          <h3
                            className="text-lg font-semibold text-[hsl(var(--primary))] leading-tight"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                          >
                            {lang === 'ar' ? place.nameAr : place.nameEn}
                          </h3>
                        </div>
                      </div>

                      {/* Gold rule */}
                      <div className="h-px bg-[hsl(var(--accent))]/25 mb-3" />

                      {/* Description */}
                      <p className="text-[hsl(var(--muted-foreground))] text-sm leading-relaxed mb-2 flex-1">
                        {lang === 'ar' ? place.descriptionAr : place.descriptionEn}
                      </p>

                      {/* Location + phone */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-start gap-2 text-xs text-[hsl(var(--muted-foreground))]">
                          <MapPin className="w-3.5 h-3.5 text-[hsl(var(--accent))] flex-shrink-0 mt-0.5" />
                          <span>{place.locationEn}</span>
                        </div>
                        {place.phone && (
                          <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
                            <Phone className="w-3.5 h-3.5 text-[hsl(var(--accent))] flex-shrink-0" />
                            <a href={'tel:' + place.phone} className="hover:text-[hsl(var(--primary))] transition-colors font-medium">
                              {place.phone}
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {place.tags.map((tag) => (
                          <span key={tag} className="text-xs bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-auto">
                        {place.mapsUrl && (
                          <a
                            href={place.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 border border-[hsl(var(--primary))]/30 hover:border-[hsl(var(--primary))] text-[hsl(var(--primary))] text-xs font-medium py-2 rounded-lg transition-colors"
                          >
                            <MapPin className="w-3.5 h-3.5" />
                            Directions
                            <ExternalLink className="w-3 h-3 opacity-50" />
                          </a>
                        )}
                        {place.phone && (
                          <a
                            href={'tel:' + place.phone}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white text-xs font-medium py-2 rounded-lg transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            Call
                          </a>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {hatta_guide.places.filter((p) => activeCategory === 'all' || p.category === activeCategory).length === 0 && (
              <div className="text-center py-20 text-[hsl(var(--muted-foreground))]">
                <p className="text-lg">No places found in this category.</p>
              </div>
            )}
          </div>
        </section>

        <div className="h-px bg-[hsl(var(--accent))]/30" />

        {/* ── EMERGENCY QUICK-DIAL ─────────────────────────────────────────── */}
        <section className="bg-[hsl(var(--primary))] py-14 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <p className="text-[hsl(var(--accent))] text-xs font-semibold uppercase tracking-widest mb-4">Emergency Numbers</p>
              <h2
                className="text-3xl sm:text-4xl font-light text-white mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Important UAE Numbers
              </h2>
              <p className="text-white/60 text-sm mb-8" dir="rtl">أرقام الإمارات الهامة</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
                {[
                  { label: 'Police', labelAr: 'الشرطة', number: '999' },
                  { label: 'Ambulance', labelAr: 'الإسعاف', number: '998' },
                  { label: 'Fire', labelAr: 'الإطفاء', number: '997' },
                  { label: 'Hatta Hospital', labelAr: 'مستشفى حتا', number: '+971 4 852 1000' },
                ].map((item) => (
                  <a
                    key={item.number}
                    href={'tel:' + item.number}
                    className="flex flex-col items-center gap-1 border border-white/20 hover:border-[hsl(var(--accent))]/60 hover:bg-white/5 rounded-xl p-4 transition-all duration-200 group"
                  >
                    <Phone className="w-5 h-5 text-[hsl(var(--accent))] mb-1" />
                    <span className="text-white font-bold text-lg">{item.number}</span>
                    <span className="text-white/70 text-xs">{item.label}</span>
                    <span className="text-white/40 text-xs" dir="rtl">{item.labelAr}</span>
                  </a>
                ))}
              </div>

              <a
                href="https://wa.me/971501848844"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp-hover))] text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 text-base"
              >
                <WhatsAppIcon className="w-5 h-5" />
                Need help? WhatsApp us
                <span className="text-white/70 text-sm" dir="rtl">تحتاج مساعدة؟</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </FadeIn>
          </div>
        </section>

        {/* ── FLOATING WHATSAPP ────────────────────────────────────────────── */}
        <motion.a
          href="https://wa.me/971501848844"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp-hover))] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4, ease: 'easeOut' as const }}
          whileHover={{ scale: 1.1 }}
        >
          <span className="absolute inset-0 rounded-full bg-[hsl(var(--whatsapp))] animate-ping opacity-30" />
          <WhatsAppIcon className="w-7 h-7 text-white relative z-10" />
          <span className="absolute right-16 bg-[hsl(var(--primary))] text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Chat with us · <span dir="rtl">تواصل معنا</span>
          </span>
        </motion.a>
      </main>
    </>
  );
}
