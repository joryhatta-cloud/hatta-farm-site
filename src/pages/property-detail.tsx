import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import {
  MapPin, Users, BedDouble, Bath, Waves, Coffee, Flame,
  CheckCircle, Phone, ArrowLeft, ExternalLink, Star
} from 'lucide-react';
import type { Property } from '@/lib/property-types';
import { useLang } from '@/lib/lang-context';
import { getPropertyImage, buildWhatsAppUrl, CATEGORY_LABELS } from '@/lib/property-types';
import { property_detail as lbl } from 'virtual:content';

function WhatsAppIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function AmenityBadge({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-sm bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] px-3 py-1.5 rounded-full border border-[hsl(var(--border))]">
      <CheckCircle className="w-3.5 h-3.5 text-[hsl(var(--accent))]" />
      {label}
    </span>
  );
}

export default function PropertyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useLang();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch('/api/properties/' + slug)
      .then((r) => { if (r.status === 404) { setNotFound(true); setLoading(false); return null; } return r.json(); })
      .then((data: Property | null) => { if (data) setProperty(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[hsl(var(--primary))]/20 border-t-[hsl(var(--primary))] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[hsl(var(--muted-foreground))]">Loading property...</p>
        </div>
      </main>
    );
  }

  if (notFound || !property) {
    return (
      <main className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-light text-[hsl(var(--primary))] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{lbl.labels.notFoundTitle}</h1>
          <p className="text-[hsl(var(--muted-foreground))] mb-6">{lbl.labels.notFoundDesc}</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-[hsl(var(--primary))] text-white px-6 py-3 rounded-full text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> {lbl.labels.backHome}
          </Link>
        </div>
      </main>
    );
  }

  const cat = CATEGORY_LABELS[property.category];
  const waUrl = buildWhatsAppUrl(property.whatsappNumber, property.nameEn);
  const heroImg = getPropertyImage(property.slug);

  return (
    <>
      <Helmet>
        <title>{property.nameEn} — Hatta Farm</title>
        <meta name="description" content={property.descriptionEn ?? `${property.nameEn} in ${property.locationEn ?? 'Hatta'}. ${property.bedrooms} bedrooms, up to ${property.maxGuests} guests.`} />
        <meta property="og:title" content={`${property.nameEn} — Hatta Farm`} />
        <meta property="og:description" content={property.descriptionEn ?? ''} />
        <meta property="og:image" content={heroImg} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <main>
        {/* ── HERO IMAGE ───────────────────────────────────────────────────── */}
        <section className="relative h-72 sm:h-[480px] overflow-hidden">
          <img
            src={heroImg}
            alt={property.nameEn}
            className="w-full h-full object-cover"
            fetchPriority="high"
            loading="eager"
            width={1920}
            height={600}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

          {/* Back button */}
          <div className="absolute top-4 left-4 z-10">
            <Link
              to={cat ? '/' + cat.slug : '/'}
              className="inline-flex items-center gap-2 bg-black/40 hover:bg-black/60 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {cat ? cat.en : 'Back'}
            </Link>
          </div>

          {/* Bottom overlay info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
            <div className="max-w-[1200px] mx-auto">
              {cat && (
                <span className="inline-block bg-[hsl(var(--accent))] text-white text-xs font-medium px-3 py-1 rounded-full mb-2">
                  {cat.en} · {cat.ar}
                </span>
              )}
              <h1 className="text-3xl sm:text-5xl font-light text-white mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {lang === 'ar' ? property.nameAr : property.nameEn}
              </h1>
            </div>
          </div>
        </section>

        {/* ── BREADCRUMB ───────────────────────────────────────────────────── */}
        <nav aria-label="Breadcrumb" className="bg-[hsl(var(--muted))] border-b border-[hsl(var(--border))] px-4 py-3">
          <div className="max-w-[1200px] mx-auto flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))] flex-wrap">
            <Link to="/" className="hover:text-[hsl(var(--primary))] transition-colors">Home</Link>
            <span>/</span>
            {cat && <><Link to={'/' + cat.slug} className="hover:text-[hsl(var(--primary))] transition-colors">{cat.en}</Link><span>/</span></>}
            <span className="text-[hsl(var(--primary))] font-medium">{property.nameEn}</span>
          </div>
        </nav>

        {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
        <section className="bg-[hsl(var(--background))] py-10 px-4">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── LEFT: Details ─────────────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-8">

              {/* Quick stats */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' as const }}
                className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] p-6"
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center">
                    <BedDouble className="w-6 h-6 text-[hsl(var(--accent))] mx-auto mb-1" />
                    <p className="text-2xl font-semibold text-[hsl(var(--primary))]">{property.bedrooms}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">Bedrooms · غرف</p>
                  </div>
                  <div className="text-center">
                    <Bath className="w-6 h-6 text-[hsl(var(--accent))] mx-auto mb-1" />
                    <p className="text-2xl font-semibold text-[hsl(var(--primary))]">{property.bathrooms}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">Bathrooms · حمامات</p>
                  </div>
                  <div className="text-center">
                    <Users className="w-6 h-6 text-[hsl(var(--accent))] mx-auto mb-1" />
                    <p className="text-2xl font-semibold text-[hsl(var(--primary))]">{property.maxGuests}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">Max Guests · ضيوف</p>
                  </div>
                  <div className="text-center">
                    <Star className="w-6 h-6 text-[hsl(var(--accent))] mx-auto mb-1" />
                    <p className="text-2xl font-semibold text-[hsl(var(--primary))]">5★</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">Rating · تقييم</p>
                  </div>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' as const }}
                className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] p-6"
              >
                <h2 className="text-2xl font-semibold text-[hsl(var(--primary))] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {lbl.labels.aboutEn}
                </h2>
                <div className="h-px bg-[hsl(var(--accent))]/30 mb-4" />
                {property.descriptionEn && (
                  <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-3">{lang === 'ar' ? (property.descriptionAr ?? property.descriptionEn) : property.descriptionEn}</p>
                )}
              </motion.div>

              {/* Amenities */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' as const }}
                className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] p-6"
              >
                <h2 className="text-2xl font-semibold text-[hsl(var(--primary))] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {lbl.labels.amenitiesEn}
                </h2>
                <div className="h-px bg-[hsl(var(--accent))]/30 mb-4" />
                <div className="flex flex-wrap gap-2 mb-4">
                  {property.hasPool && <AmenityBadge label="Private Pool · مسبح خاص" />}
                  {property.hasBreakfast && <AmenityBadge label="Breakfast Included · فطور شامل" />}
                  {property.hasKitchen && <AmenityBadge label="Full Kitchen · مطبخ كامل" />}
                  {property.hasBbq && <AmenityBadge label="BBQ Area · منطقة شواء" />}
                  {property.hasHousekeeping && <AmenityBadge label="Daily Cleaning · تنظيف يومي" />}
                  {(property.amenities as string[]).map((a) => (
                    <AmenityBadge key={a} label={a} />
                  ))}
                </div>
              </motion.div>

              {/* Location */}
              {property.locationEn && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' as const }}
                  className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] p-6"
                >
                  <h2 className="text-2xl font-semibold text-[hsl(var(--primary))] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {lbl.labels.locationEn}
                  </h2>
                  <div className="h-px bg-[hsl(var(--accent))]/30 mb-4" />
                  <div className="flex items-start gap-3 mb-4">
                    <MapPin className="w-5 h-5 text-[hsl(var(--accent))] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[hsl(var(--foreground))] font-medium">{lang === 'ar' ? (property.locationAr ?? property.locationEn) : property.locationEn}</p>
                    </div>
                  </div>
                  {property.mapsUrl && (
                    <a
                      href={property.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-[hsl(var(--primary))]/30 hover:border-[hsl(var(--primary))] text-[hsl(var(--primary))] text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
                    >
                      <MapPin className="w-4 h-4" />
                      {lbl.labels.openMaps}
                      <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                    </a>
                  )}
                </motion.div>
              )}
            </div>

            {/* ── RIGHT: Booking sidebar ────────────────────────────────────── */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-4">
                {/* Price card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' as const }}
                  className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] p-6"
                >
                  {property.pricePerNight && (
                    <div className="mb-4">
                      <p className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wide mb-1">{lbl.labels.startingFrom}</p>
                      <p className="text-3xl font-semibold text-[hsl(var(--primary))]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {property.pricePerNight}
                      </p>
                    </div>
                  )}

                  <div className="h-px bg-[hsl(var(--accent))]/30 mb-4" />

                  {/* Quick facts */}
                  <div className="space-y-2 mb-5 text-sm text-[hsl(var(--muted-foreground))]">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><BedDouble className="w-4 h-4 text-[hsl(var(--accent))]" />Bedrooms</span>
                      <span className="font-medium text-[hsl(var(--foreground))]">{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-[hsl(var(--accent))]" />Max guests</span>
                      <span className="font-medium text-[hsl(var(--foreground))]">{property.maxGuests}</span>
                    </div>
                    {property.hasPool && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5"><Waves className="w-4 h-4 text-blue-500" />Pool</span>
                        <span className="font-medium text-green-600">✓ Included</span>
                      </div>
                    )}
                    {property.hasBreakfast && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5"><Coffee className="w-4 h-4 text-amber-500" />Breakfast</span>
                        <span className="font-medium text-green-600">✓ Included</span>
                      </div>
                    )}
                    {property.hasBbq && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5"><Flame className="w-4 h-4 text-orange-500" />BBQ</span>
                        <span className="font-medium text-green-600">✓ Available</span>
                      </div>
                    )}
                  </div>

                  {/* WhatsApp booking */}
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp-hover))] text-white font-semibold py-4 rounded-xl transition-colors text-base mb-3"
                  >
                    <WhatsAppIcon />
                    {lbl.labels.bookWhatsApp}
                  </a>
                  <p className="text-center text-xs text-[hsl(var(--muted-foreground))]" dir="rtl">{lbl.labels.bookWhatsAppAr}</p>

                  <div className="mt-4 pt-4 border-t border-[hsl(var(--border))]">
                    <a
                      href={'tel:+' + property.whatsappNumber}
                      className="w-full flex items-center justify-center gap-2 border border-[hsl(var(--primary))]/30 hover:border-[hsl(var(--primary))] text-[hsl(var(--primary))] font-medium py-3 rounded-xl transition-colors text-sm"
                    >
                      <Phone className="w-4 h-4" />
                      {lbl.labels.callEnquire}
                    </a>
                  </div>
                </motion.div>

                {/* Tabby note */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' as const }}
                  className="bg-[hsl(var(--muted))] rounded-xl border border-[hsl(var(--border))] p-4 text-center"
                >
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    💳 Pay in 4 interest-free instalments with <strong>Tabby</strong>
                  </p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1" dir="rtl">ادفع على 4 أقساط بدون فوائد مع تابي</p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Floating WhatsApp */}
        <motion.a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={lbl.labels.bookWhatsApp}
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
