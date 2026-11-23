// Shared property type matching DB schema
export interface Property {
  id: number;
  slug: string;
  category: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  locationEn: string | null;
  locationAr: string | null;
  mapsUrl: string | null;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  hasPool: boolean;
  hasBreakfast: boolean;
  hasKitchen: boolean;
  hasBbq: boolean;
  hasHousekeeping: boolean;
  pricePerNight: string | null;
  whatsappNumber: string;
  amenities: string[];
  images: string[];
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export const CATEGORY_LABELS: Record<string, { en: string; ar: string; slug: string }> = {
  resort:      { en: 'Resorts',              ar: 'المنتجعات',         slug: 'resorts' },
  chalet:      { en: 'Chalets',              ar: 'الشاليهات',         slug: 'chalets' },
  'farm-stay': { en: 'Farm Stays',           ar: 'إقامات المزارع',    slug: 'farm-stays' },
  'holiday-home': { en: 'Holiday Homes',     ar: 'بيوت العطل',        slug: 'holiday-homes' },
  room:        { en: 'Rooms & Accommodation',ar: 'الغرف والإقامة',    slug: 'rooms' },
  'event-stay':{ en: 'Event-Friendly Stays', ar: 'إقامات المناسبات',  slug: 'event-friendly-stays' },
};

export const SLUG_TO_CATEGORY: Record<string, string> = {
  resorts: 'resort',
  chalets: 'chalet',
  'farm-stays': 'farm-stay',
  'holiday-homes': 'holiday-home',
  rooms: 'room',
  'event-friendly-stays': 'event-stay',
};

// Map slug → stock image slot
export const PROPERTY_IMAGE_SLOTS: Record<string, string> = {
  'hatta-mountain-resort':  '/airo-assets/images/properties/hatta-mountain-resort',
  'al-hajar-chalets':       '/airo-assets/images/properties/al-hajar-chalets',
  'green-valley-farm-stay': '/airo-assets/images/properties/green-valley-farm-stay',
  'hatta-highland-villa':   '/airo-assets/images/properties/hatta-highland-villa',
  'mountain-view-rooms':    '/airo-assets/images/properties/mountain-view-rooms',
  'hatta-events-estate':    '/airo-assets/images/properties/hatta-events-estate',
  'masfout-mountain-chalet':'/airo-assets/images/properties/masfout-mountain-chalet',
  'hatta-farm-retreat':     '/airo-assets/images/properties/hatta-farm-retreat',
};

export function getPropertyImage(slug: string): string {
  return PROPERTY_IMAGE_SLOTS[slug] ?? '/airo-assets/images/pages/home/hero-2';
}

export function buildWhatsAppUrl(number: string, propertyName: string): string {
  const msg = encodeURIComponent(`مرحباً، أود الاستفسار عن حجز: ${propertyName}\nHello, I'd like to enquire about booking: ${propertyName}`);
  return `https://wa.me/${number}?text=${msg}`;
}
