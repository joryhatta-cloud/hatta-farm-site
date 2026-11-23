import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLang } from '@/lib/lang-context';

const navItems = [
  { en: 'Home', ar: 'الرئيسية', href: '/' },
  { en: 'Resorts', ar: 'المنتجعات', href: '/resorts' },
  { en: 'Chalets', ar: 'الشاليهات', href: '/chalets' },
  { en: 'Farm Stays', ar: 'إقامات المزارع', href: '/farm-stays' },
  { en: 'Holiday Homes', ar: 'بيوت العطل', href: '/holiday-homes' },
  { en: 'Rooms', ar: 'الغرف والإقامة', href: '/rooms' },
  { en: 'Events', ar: 'إقامات المناسبات', href: '/events' },
  { en: 'Services', ar: 'الخدمات', href: '/services' },
  { en: 'Hatta Guide', ar: 'دليل حتا', href: '/hatta-guide' },
  { en: 'Contact', ar: 'تواصل معنا', href: '/contact' },
];

const WhatsAppIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, setLang, t } = useLang();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const label = (item: typeof navItems[0]) => lang === 'ar' ? item.ar : item.en;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-[hsl(var(--primary))] shadow-xl' : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                src="/airo-assets/images/logo/horizontal/dark"
                alt="Hatta Farm"
                className="block h-auto max-h-10 md:max-h-12 w-auto max-w-[180px] object-contain self-center"
              />
            </Link>

            {/* Desktop Nav */}
            <nav aria-label={t('Main navigation', 'التنقل الرئيسي')} className="hidden xl:flex items-center gap-0.5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="relative px-2.5 py-2 text-white/90 hover:text-white text-sm font-medium transition-colors duration-200 group"
                >
                  {label(item)}
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[hsl(var(--accent))] transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language toggle */}
              <button
                onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                className="hidden sm:flex items-center gap-1 text-white/80 hover:text-white text-xs font-medium border border-white/30 hover:border-[hsl(var(--accent))] rounded-full px-3 py-1.5 transition-all duration-200"
                aria-label="Toggle language"
              >
                <span className={lang === 'en' ? 'text-[hsl(var(--accent))]' : 'text-white/60'}>EN</span>
                <span className="text-white/40 mx-0.5">|</span>
                <span className={lang === 'ar' ? 'text-[hsl(var(--accent))]' : 'text-white/60'}>عربي</span>
              </button>

              <a
                href="https://wa.me/9710501848844"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-2 bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200"
              >
                <WhatsAppIcon />
                {t('WhatsApp', 'واتساب')}
              </a>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="xl:hidden text-white p-2 rounded-md hover:bg-white/10 transition-colors"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.35, ease: 'easeOut' as const }}
            className="fixed inset-0 z-40 bg-[hsl(var(--primary))] flex flex-col overflow-y-auto"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <img
                src="/airo-assets/images/logo/horizontal/dark"
                alt="Hatta Farm"
                className="h-10 w-auto object-contain"
              />
              <button
                onClick={() => setMobileOpen(false)}
                className="text-white p-2 rounded-md hover:bg-white/10 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav aria-label={t('Mobile navigation', 'التنقل المحمول')} className="flex-1 px-6 py-8 flex flex-col gap-1">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: lang === 'ar' ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3, ease: 'easeOut' as const }}
                >
                  <Link
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between py-4 border-b border-white/10 text-white hover:text-[hsl(var(--accent))] transition-colors duration-200"
                  >
                    <span className="text-lg font-medium">{label(item)}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="px-6 py-6 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                className="flex items-center gap-2 text-white/70 hover:text-white text-sm border border-white/20 rounded-full px-4 py-2 transition-all"
              >
                <span className={lang === 'en' ? 'text-[hsl(var(--accent))]' : ''}>EN</span>
                <span className="text-white/30">|</span>
                <span className={lang === 'ar' ? 'text-[hsl(var(--accent))]' : ''}>عربي</span>
              </button>
              <a
                href="https://wa.me/9710501848844"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[hsl(var(--accent))] text-white text-sm font-semibold px-5 py-2.5 rounded-full"
              >
                <WhatsAppIcon />
                {t('WhatsApp', 'واتساب')}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
