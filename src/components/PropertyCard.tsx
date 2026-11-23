import { Link } from 'react-router';
import { motion } from 'motion/react';
import { MapPin, Users, BedDouble, Bath, Waves, Coffee, Flame, CheckCircle } from 'lucide-react';
import type { Property } from '@/lib/property-types';
import { getPropertyImage, buildWhatsAppUrl, CATEGORY_LABELS } from '@/lib/property-types';
import { useLang } from '@/lib/lang-context';

function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

interface PropertyCardProps {
  property: Property;
  index?: number;
}

export default function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const { lang } = useLang();
  const cat = CATEGORY_LABELS[property.category];
  const waUrl = buildWhatsAppUrl(property.whatsappNumber, property.nameEn);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: 'easeOut' as const }}
      className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] overflow-hidden hover:shadow-xl hover:border-[hsl(var(--accent))]/50 transition-all duration-300 group flex flex-col"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={getPropertyImage(property.slug)}
          alt={lang === 'ar' ? property.nameAr : property.nameEn}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          width={600}
          height={400}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
        {/* Category badge */}
        {cat && (
          <div className="absolute top-3 left-3 bg-[hsl(var(--primary))]/90 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            {cat.en}
          </div>
        )}
        {/* Price */}
        {property.pricePerNight && (
          <div className="absolute bottom-3 right-3 bg-[hsl(var(--accent))] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {property.pricePerNight}
          </div>
        )}
        {/* Pool badge */}
        {property.hasPool && (
          <div className="absolute top-3 right-3 bg-blue-500/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Waves className="w-3 h-3" /> Pool
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3
          className="text-xl font-semibold text-[hsl(var(--primary))] leading-tight mb-0.5"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {lang === 'ar' ? property.nameAr : property.nameEn}
        </h3>

        {/* Location */}
        {(property.locationEn || property.locationAr) && (
          <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))] mb-3">
            <MapPin className="w-3.5 h-3.5 text-[hsl(var(--accent))] flex-shrink-0" />
            <span>{lang === 'ar' ? (property.locationAr ?? property.locationEn) : property.locationEn}</span>
          </div>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-3 text-xs text-[hsl(var(--muted-foreground))] mb-3 flex-wrap">
          <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5 text-[hsl(var(--accent))]" />{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
          <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5 text-[hsl(var(--accent))]" />{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-[hsl(var(--accent))]" />Up to {property.maxGuests}</span>
        </div>

        {/* Quick amenity icons */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {property.hasBreakfast && <span className="flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full"><Coffee className="w-3 h-3" />Breakfast</span>}
          {property.hasBbq && <span className="flex items-center gap-1 text-xs bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full"><Flame className="w-3 h-3" />BBQ</span>}
          {property.hasHousekeeping && <span className="flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full"><CheckCircle className="w-3 h-3" />Cleaning</span>}
        </div>

        {/* Description */}
        <p className="text-[hsl(var(--muted-foreground))] text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
          {lang === 'ar' ? (property.descriptionAr ?? property.descriptionEn) : property.descriptionEn}
        </p>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <Link
            to={'/property/' + property.slug}
            className="flex-1 text-center border border-[hsl(var(--primary))]/40 hover:border-[hsl(var(--primary))] text-[hsl(var(--primary))] text-sm font-medium py-2.5 rounded-xl transition-colors"
          >
            View Details
          </Link>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp-hover))] text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
          >
            <WhatsAppIcon />
            Book
          </a>
        </div>
      </div>
    </motion.div>
  );
}
