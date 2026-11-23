import { useRef } from 'react';
import { Link } from 'react-router';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion, useScroll, useTransform } from 'motion/react';
import { Users, BedDouble, Waves, ArrowRight, MapPin, Star, CheckCircle, Utensils, Landmark, Mountain, Cross } from 'lucide-react';
import { home } from 'virtual:content';
import { useLang } from '@/lib/lang-context';

// ─── Fade-in wrapper ───────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: 'easeOut' as const }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Gold divider ──────────────────────────────────────────────────────────────
function GoldDivider() {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="h-px w-16 bg-[hsl(var(--accent))]/40" />
      <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent))] mx-3" />
      <div className="h-px w-16 bg-[hsl(var(--accent))]/40" />
    </div>
  );
}

// ─── WhatsApp icon ─────────────────────────────────────────────────────────────
function WhatsAppIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}


function getCategorySlot(id: string): string {
  if (id === 'cat-1') return '/airo-assets/images/pages/home/resort-aerial';
  if (id === 'cat-2') return '/airo-assets/images/pages/home/chalet-exterior';
  if (id === 'cat-3') return '/airo-assets/images/pages/home/farm-landscape';
  if (id === 'cat-4') return '/airo-assets/images/pages/home/holiday-home';
  if (id === 'cat-5') return '/airo-assets/images/pages/home/luxury-bedroom';
  return '/airo-assets/images/pages/home/event-celebration';
}

function getPropertySlot(id: string): string {
  if (id === 'prop-1') return '/airo-assets/images/pages/home/resort-aerial';
  if (id === 'prop-2') return '/airo-assets/images/pages/home/pool-mountain';
  return '/airo-assets/images/pages/home/farm-landscape';
}

// ─── Guide icons map ─────────────────────────────────────────────────────────
const guideIcons: Record<string, React.ReactNode> = {
  utensils: <Utensils className="w-5 h-5" />,
  landmark: <Landmark className="w-5 h-5" />,
  mountain: <Mountain className="w-5 h-5" />,
  cross: <Cross className="w-5 h-5" />,
};

const serviceIcons: Record<string, React.ReactNode> = {
  'svc-1': <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
  'svc-2': <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>,
  'svc-3': <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>,
  'svc-4': <WhatsAppIcon className="w-6 h-6" />,
  'svc-5': <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>,
  'svc-6': <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>,
};

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 120]);
  const { lang } = useLang();

  return (
    <>
      <Helmet>
        <title>Hatta Farm — Luxury Chalets, Resorts & Farm Stays in Hatta</title>
        <meta name="description" content="Discover luxury chalets, resorts, farm stays and holiday homes in Hatta and Masfout. Book your perfect mountain escape with Hatta Farm." />
        <meta property="og:title" content="Hatta Farm — Luxury Accommodation in Hatta" />
        <meta property="og:description" content="Premium resorts, chalets, farm stays and event-friendly accommodation in the Hajar Mountains." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.hattafarm.com" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <main>
        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section ref={heroRef} className="relative h-screen min-h-[600px] overflow-hidden flex items-center justify-center">
          <motion.div style={{ y: heroY }} className="absolute inset-0 scale-110">
            <img
              src="/airo-assets/images/pages/home/hero"
              alt="Panoramic view of the Hatta mountains"
              className="w-full h-full object-cover"
              fetchPriority="high"
              loading="eager"
              width={1920}
              height={1080}
            />
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/75 pointer-events-none" />

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' as const }}
            >
              <h1
                className="font-light text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight tracking-tight mb-6"
                style={{ fontFamily: lang === 'ar' ? "'Amiri', serif" : "'Cormorant Garamond', 'Playfair Display', serif" }}
              >
                {lang === 'ar' ? home.hero.headlineAr : home.hero.headlineEn}
              </h1>

              <GoldDivider />

              <p className="text-white/80 text-base sm:text-lg mt-5 mb-8 max-w-2xl mx-auto leading-relaxed">
                {lang === 'ar' ? home.hero.subheadlineAr : home.hero.subheadlineEn}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/resorts"
                  className="inline-flex items-center gap-2 bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-300 text-sm sm:text-base"
                >
                  <span>{home.hero.ctaPrimaryEn}</span>
                  <span className="text-white/70 text-xs" dir="rtl">{home.hero.ctaPrimaryAr}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="https://wa.me/971000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border-2 border-white/60 hover:border-white text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-300 text-sm sm:text-base hover:bg-white/10"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  <span>{home.hero.ctaSecondaryEn}</span>
                  <span className="text-white/60 text-xs" dir="rtl">{home.hero.ctaSecondaryAr}</span>
                </a>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const }}
          >
            <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center pt-2">
              <div className="w-1 h-2 bg-white/60 rounded-full" />
            </div>
          </motion.div>
        </section>

        {/* ── SEARCH BAR ───────────────────────────────────────────────────── */}
        <section className="bg-[hsl(var(--primary))] py-6 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

                <div className="flex flex-col gap-1">
                  <label className="text-white/60 text-xs font-medium uppercase tracking-wider">Check-in / الوصول</label>
                  <input type="date" className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[hsl(var(--accent))] transition-colors" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-white/60 text-xs font-medium uppercase tracking-wider">Check-out / المغادرة</label>
                  <input type="date" className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[hsl(var(--accent))] transition-colors" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-white/60 text-xs font-medium uppercase tracking-wider">Guests / الضيوف</label>
                  <div className="flex gap-2">
                    <select className="flex-1 bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[hsl(var(--accent))] transition-colors">
                      {[1,2,3,4,5,6,7,8,9,10].map(n => (
                        <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                    <button className="bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-white font-semibold px-5 rounded-lg transition-colors text-sm whitespace-nowrap">
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="h-px bg-[hsl(var(--accent))]/30" />

        {/* ── ACCOMMODATION CATEGORIES ─────────────────────────────────────── */}
        <section className="bg-[hsl(var(--background))] py-20 px-4">
          <div className="max-w-[1400px] mx-auto">
            <FadeIn className="text-center mb-12">
              <p className="text-[hsl(var(--accent))] text-xs font-semibold uppercase tracking-widest mb-3">Our Accommodation</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-[hsl(var(--primary))]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Find Your Perfect Stay
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] mt-2 text-sm" dir="rtl">اعثر على إقامتك المثالية</p>
              <div className="mt-4"><GoldDivider /></div>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ gridAutoRows: '260px' }}>
              {home.categories.map((cat, i) => (
                <FadeIn
                  key={cat.id}
                  delay={i * 0.08}
                  className={cat.size === 'large' ? 'lg:row-span-2' : ''}
                >
                  <Link
                    to={cat.id === "cat-1" ? "/resorts" : cat.id === "cat-2" ? "/chalets" : cat.id === "cat-3" ? "/farm-stays" : cat.id === "cat-4" ? "/holiday-homes" : cat.id === "cat-5" ? "/rooms" : "/events"}
                    className="group relative w-full h-full rounded-2xl overflow-hidden block"
                  >
                    <img
                      src={getCategorySlot(cat.id)}
                      alt={lang === 'ar' ? cat.nameAr : cat.nameEn}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      width={600}
                      height={400}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <div className="flex items-end justify-between">
                        <div>
                          <h3 className="text-white font-semibold text-lg sm:text-xl leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                            {lang === 'ar' ? cat.nameAr : cat.nameEn}
                          </h3>
                          <p className="text-white/60 text-xs mt-1.5 hidden sm:block">{lang === 'ar' ? (cat.taglineAr ?? cat.taglineEn) : cat.taglineEn}</p>
                        </div>
                        <div className="w-9 h-9 rounded-full border border-[hsl(var(--accent))]/60 group-hover:bg-[hsl(var(--accent))] flex items-center justify-center transition-all duration-300 flex-shrink-0 ml-3">
                          <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <div className="h-px bg-[hsl(var(--accent))]/30" />

        {/* ── FEATURED PROPERTIES ──────────────────────────────────────────── */}
        <section className="bg-[hsl(var(--muted))] py-20 px-4">
          <div className="max-w-[1400px] mx-auto">
            <FadeIn className="text-center mb-12">
              <p className="text-[hsl(var(--accent))] text-xs font-semibold uppercase tracking-widest mb-3">Featured Stays</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-[hsl(var(--primary))]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Handpicked for You
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] mt-2 text-sm" dir="rtl">مختارة خصيصاً لك</p>
              <div className="mt-4"><GoldDivider /></div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {home.featuredProperties.map((prop, i) => (
                <FadeIn key={prop.id} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3, ease: 'easeOut' as const }}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={getPropertySlot(prop.id)}
                        alt={lang === 'ar' ? prop.nameAr : prop.nameEn}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        width={600}
                        height={400}
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-[hsl(var(--primary))] text-white text-xs font-semibold px-3 py-1 rounded-full capitalize">
                          {prop.type}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                        <Star className="w-3 h-3 fill-[hsl(var(--accent))] text-[hsl(var(--accent))]" />
                        <span>5.0</span>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="mb-1">
                        <h3 className="font-semibold text-[hsl(var(--primary))] text-lg leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          {lang === 'ar' ? prop.nameAr : prop.nameEn}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1 text-[hsl(var(--muted-foreground))] text-xs mb-3">
                        <MapPin className="w-3 h-3 text-[hsl(var(--accent))]" />
                        <span>{prop.locationEn}</span>
                        <span className="text-[hsl(var(--muted-foreground))]/50 mx-1">·</span>
                        <span dir="rtl">{prop.locationAr}</span>
                      </div>

                      <div className="flex items-center gap-4 text-[hsl(var(--muted-foreground))] text-xs mb-4 pb-4 border-b border-[hsl(var(--border))]">
                        <span className="flex items-center gap-1">
                          <BedDouble className="w-3.5 h-3.5 text-[hsl(var(--accent))]" />
                          {prop.bedrooms} Beds
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-[hsl(var(--accent))]" />
                          {prop.guests} Guests
                        </span>
                        {prop.hasPool && (
                          <span className="flex items-center gap-1">
                            <Waves className="w-3.5 h-3.5 text-[hsl(var(--accent))]" />
                            Pool
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[hsl(var(--muted-foreground))] text-xs">From</span>
                          <p className="text-[hsl(var(--primary))] font-bold text-lg">
                            AED {prop.priceFrom}
                            <span className="text-[hsl(var(--muted-foreground))] text-xs font-normal">/night</span>
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            to="/resorts"
                            className="text-[hsl(var(--primary))] border border-[hsl(var(--primary))]/30 hover:border-[hsl(var(--primary))] text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                          >
                            Details
                          </Link>
                          <a
                            href="https://wa.me/971000000000"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5" />
                            Book
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </FadeIn>
              ))}
            </div>

            <FadeIn className="text-center mt-10">
              <Link
                to="/resorts"
                className="inline-flex items-center gap-2 border-2 border-[hsl(var(--primary))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))] hover:text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 text-sm"
              >
                View All Properties
                <span className="text-xs opacity-70" dir="rtl">عرض جميع العقارات</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </FadeIn>
          </div>
        </section>

        <div className="h-px bg-[hsl(var(--accent))]/30" />

        {/* ── EVENT-FRIENDLY STAYS ─────────────────────────────────────────── */}
        <section className="relative py-24 px-4 overflow-hidden">
          <img
            src="/airo-assets/images/pages/home/event-celebration"
            alt="Luxury event celebration"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            width={1920}
            height={800}
          />
          <div className="absolute inset-0 bg-[hsl(var(--primary))]/90 pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <FadeIn>
              <p className="text-[hsl(var(--accent))] text-xs font-semibold uppercase tracking-widest mb-4">Private Events</p>
              <h2
                className="text-4xl sm:text-5xl md:text-6xl font-light text-white mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {home.events.headlineEn}
              </h2>
              <p
                className="text-white/70 text-2xl sm:text-3xl mb-6"
                dir="rtl"
                style={{ fontFamily: "'Amiri', serif" }}
              >
                {home.events.headlineAr}
              </p>
              <GoldDivider />
              <p className="text-white/70 mt-6 mb-2 text-base sm:text-lg">{home.events.subheadlineEn}</p>
              <p className="text-white/50 text-sm mb-10" dir="rtl">{home.events.subheadlineAr}</p>

              <div className="flex flex-wrap justify-center gap-3 mb-10">
                {home.events.types.map((type) => (
                  <div key={type.id} className="flex items-center gap-2 border border-[hsl(var(--accent))]/40 rounded-full px-4 py-2">
                    <CheckCircle className="w-4 h-4 text-[hsl(var(--accent))]" />
                    <span className="text-white text-sm">{type.en}</span>
                    <span className="text-white/50 text-xs" dir="rtl">{type.ar}</span>
                  </div>
                ))}
              </div>

              <a
                href="https://wa.me/971000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-white font-semibold px-10 py-4 rounded-full transition-all duration-300 text-base"
              >
                {home.events.ctaEn}
                <span className="text-white/70 text-sm" dir="rtl">{home.events.ctaAr}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </FadeIn>
          </div>
        </section>

        <div className="h-px bg-[hsl(var(--accent))]/30" />

        {/* ── GUEST SERVICES ───────────────────────────────────────────────── */}
        <section className="bg-[hsl(var(--background))] py-20 px-4">
          <div className="max-w-[1400px] mx-auto">
            <FadeIn className="text-center mb-12">
              <p className="text-[hsl(var(--accent))] text-xs font-semibold uppercase tracking-widest mb-3">Guest Services</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-[hsl(var(--primary))]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Everything You Need
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] mt-2 text-sm" dir="rtl">كل ما تحتاجه</p>
              <div className="mt-4"><GoldDivider /></div>
            </FadeIn>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {home.services.map((svc, i) => (
                <FadeIn key={svc.id} delay={i * 0.07}>
                  <div className="flex flex-col items-center text-center p-5 rounded-2xl border border-[hsl(var(--border))] hover:border-[hsl(var(--accent))]/50 hover:bg-[hsl(var(--muted))] transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-full bg-[hsl(var(--primary))]/10 group-hover:bg-[hsl(var(--primary))] flex items-center justify-center mb-3 transition-colors duration-300 text-[hsl(var(--primary))] group-hover:text-white">
                      {serviceIcons[svc.id]}
                    </div>
                    <p className="text-[hsl(var(--primary))] font-medium text-sm leading-tight">{svc.en}</p>
                    <p className="text-[hsl(var(--muted-foreground))] text-xs mt-1" dir="rtl">{svc.ar}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <div className="h-px bg-[hsl(var(--accent))]/30" />

        {/* ── HATTA LOCAL GUIDE ────────────────────────────────────────────── */}
        <section className="bg-[hsl(var(--muted))] py-20 px-4">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <FadeIn>
                <div className="relative rounded-2xl overflow-hidden h-80 lg:h-[480px]">
                  <img
                    src="/airo-assets/images/pages/home/hatta-town"
                    alt="Hatta heritage village"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width={800}
                    height={600}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--primary))]/60 to-transparent pointer-events-none" />
                  <div className="absolute bottom-6 left-6">
                    <p className="text-white font-semibold text-xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Hatta Heritage Village</p>
                    <p className="text-white/70 text-sm" dir="rtl">قرية حتا التراثية</p>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.15}>
                <div>
                  <p className="text-[hsl(var(--accent))] text-xs font-semibold uppercase tracking-widest mb-3">Hatta Local Guide</p>
                  <h2
                    className="text-3xl sm:text-4xl md:text-5xl font-light text-[hsl(var(--primary))] mb-2"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {home.guide.headlineEn}
                  </h2>
                  <p className="text-[hsl(var(--muted-foreground))] text-sm mb-2" dir="rtl">{home.guide.headlineAr}</p>
                  <p className="text-[hsl(var(--muted-foreground))] text-sm mb-6 leading-relaxed">{home.guide.subheadlineEn}</p>

                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {home.guide.categories.map((cat, i) => (
                      <motion.div
                        key={cat.id}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.4, ease: 'easeOut' as const }}
                        className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[hsl(var(--border))] hover:border-[hsl(var(--accent))]/50 hover:shadow-md transition-all duration-300 group cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-full bg-[hsl(var(--primary))]/10 group-hover:bg-[hsl(var(--primary))] flex items-center justify-center text-[hsl(var(--primary))] group-hover:text-white transition-colors duration-300 flex-shrink-0">
                          {guideIcons[cat.icon]}
                        </div>
                        <div>
                          <p className="text-[hsl(var(--primary))] font-medium text-sm leading-tight">{cat.en}</p>
                          <p className="text-[hsl(var(--muted-foreground))] text-xs mt-0.5" dir="rtl">{cat.ar}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <Link
                    to="/hatta-guide"
                    className="inline-flex items-center gap-2 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-300 text-sm"
                  >
                    {home.guide.ctaEn}
                    <span className="text-white/70 text-xs" dir="rtl">{home.guide.ctaAr}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ── FLOATING WHATSAPP ────────────────────────────────────────────── */}
        <motion.a
          href="https://wa.me/971000000000"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp-hover))] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.4, ease: 'easeOut' as const }}
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
