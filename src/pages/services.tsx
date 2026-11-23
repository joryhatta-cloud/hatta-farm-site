import { Link } from 'react-router';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle, Shield, CreditCard, Plane, Sparkles, Truck, Map, Package } from 'lucide-react';
import { services } from 'virtual:content';
import { useLang } from '@/lib/lang-context';

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
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function getServiceIcon(icon: string) {
  const cls = 'w-7 h-7';
  if (icon === 'shield') return <Shield className={cls} />;
  if (icon === 'credit-card') return <CreditCard className={cls} />;
  if (icon === 'plane') return <Plane className={cls} />;
  if (icon === 'whatsapp') return <WhatsAppIcon className={cls} />;
  if (icon === 'sparkles') return <Sparkles className={cls} />;
  if (icon === 'truck') return <Truck className={cls} />;
  if (icon === 'map') return <Map className={cls} />;
  return <Package className={cls} />;
}

export default function ServicesPage() {
  const { lang } = useLang();
  return (
    <>
      <Helmet>
        <title>Guest Services — Hatta Farm</title>
        <meta name="description" content="Discover all guest services at Hatta Farm: secure payment, Tabby installments, airport transfers, 24/7 WhatsApp support, daily cleaning, Hatta delivery, tourist guidance and more." />
        <meta property="og:title" content="Guest Services — Hatta Farm" />
        <meta property="og:description" content="Everything you need for a seamless mountain escape in Hatta and Masfout." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <main>
        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative h-72 sm:h-96 overflow-hidden flex items-center justify-center">
          <img
            src="/airo-assets/images/pages/services/hero"
            alt="Hatta Farm guest services"
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
                {lang === 'ar' ? services.hero.titleAr : services.hero.titleEn}
              </h1>
              <GoldDivider />
              <p className="text-white/70 mt-4 text-sm sm:text-base max-w-xl mx-auto">
                {lang === 'ar' ? services.hero.subtitleAr : services.hero.subtitleEn}
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── BREADCRUMB ───────────────────────────────────────────────────── */}
        <nav aria-label="Breadcrumb" className="bg-[hsl(var(--muted))] border-b border-[hsl(var(--border))] px-4 py-3">
          <div className="max-w-[1400px] mx-auto flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
            <Link to="/" className="hover:text-[hsl(var(--primary))] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[hsl(var(--primary))] font-medium">Services</span>
          </div>
        </nav>

        {/* ── INTRO ────────────────────────────────────────────────────────── */}
        <section className="bg-[hsl(var(--background))] py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <p className="text-[hsl(var(--muted-foreground))] text-base sm:text-lg leading-relaxed mb-3">
                At Hatta Farm, we go beyond accommodation. Our dedicated guest services team is committed to making every aspect of your stay effortless — from the moment you book to the moment you check out.
              </p>
              <p className="text-[hsl(var(--muted-foreground))] text-sm leading-relaxed" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
                في حتا فارم، نتجاوز مجرد الإقامة. فريق خدمة الضيوف المخصص لدينا ملتزم بجعل كل جانب من جوانب إقامتك سهلاً — من لحظة الحجز حتى لحظة المغادرة.
              </p>
            </FadeIn>
          </div>
        </section>

        <div className="h-px bg-[hsl(var(--accent))]/30" />

        {/* ── SERVICES GRID ────────────────────────────────────────────────── */}
        <section className="bg-[hsl(var(--background))] py-16 px-4">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.services.map((svc, i) => (
                <FadeIn key={svc.id} delay={i * 0.07}>
                  <div className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] p-7 hover:border-[hsl(var(--accent))]/50 hover:shadow-lg transition-all duration-300 group h-full">
                    {/* Icon + title */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-[hsl(var(--primary))]/10 group-hover:bg-[hsl(var(--primary))] flex items-center justify-center text-[hsl(var(--primary))] group-hover:text-white transition-colors duration-300 flex-shrink-0">
                        {getServiceIcon(svc.icon)}
                      </div>
                      <div>
                        <h2
                          className="text-xl sm:text-2xl font-semibold text-[hsl(var(--primary))] leading-tight"
                          style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                          {lang === 'ar' ? svc.titleAr : svc.titleEn}
                        </h2>
                      </div>
                    </div>

                    {/* Gold divider */}
                    <div className="h-px bg-[hsl(var(--accent))]/30 mb-4" />

                    {/* Description */}
                    <p className="text-[hsl(var(--muted-foreground))] text-sm leading-relaxed mb-2">
                      {lang === 'ar' ? svc.descriptionAr : svc.descriptionEn}
                    </p>

                    {/* Feature bullets */}
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {svc.features.map((feat) => (
                        <li key={feat.id} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-[hsl(var(--accent))] flex-shrink-0" />
                          <span className="text-[hsl(var(--foreground))] text-sm">{lang === 'ar' ? feat.ar : feat.en}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <div className="h-px bg-[hsl(var(--accent))]/30" />

        {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
        <section className="bg-[hsl(var(--primary))] py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <p className="text-[hsl(var(--accent))] text-xs font-semibold uppercase tracking-widest mb-4">Get in Touch</p>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-light text-white mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {services.cta.titleEn}
              </h2>
              <p
                className="text-white/70 text-2xl mb-6"
                dir="rtl"
                style={{ fontFamily: "'Amiri', serif" }}
              >
                {services.cta.titleAr}
              </p>
              <GoldDivider />
              <p className="text-white/70 mt-6 mb-2 text-base">{services.cta.subtitleEn}</p>
              <p className="text-white/50 text-sm mb-10" dir="rtl">{services.cta.subtitleAr}</p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://wa.me/971501848844"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp-hover))] text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 text-base"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  <span>{services.cta.buttonEn}</span>
                  <span className="text-white/70 text-sm" dir="rtl">{services.cta.buttonAr}</span>
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 border-2 border-white/40 hover:border-white text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 text-base hover:bg-white/10"
                >
                  Send an Enquiry
                  <span className="text-white/60 text-sm" dir="rtl">أرسل استفساراً</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
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
