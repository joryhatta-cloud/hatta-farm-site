import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Lang = 'en' | 'ar';

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (en: string, ar: string) => string;
  isAr: boolean;
}

const LangContext = createContext<LangContextValue>({
  lang: 'ar',
  setLang: () => {},
  t: (_en, ar) => ar,
  isAr: true,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ar');

  // Persist choice and apply dir + font to <html>
  useEffect(() => {
    const saved = localStorage.getItem('hf-lang') as Lang | null;
    if (saved === 'en' || saved === 'ar') {
      setLangState(saved);
      applyToDocument(saved);
    } else {
      applyToDocument('ar');
    }
  }, []);

  function applyToDocument(l: Lang) {
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
    if (l === 'ar') {
      document.documentElement.style.fontFamily = "'Amiri', 'Cormorant Garamond', serif";
    } else {
      document.documentElement.style.fontFamily = '';
    }
  }

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem('hf-lang', l);
    applyToDocument(l);
  }

  const t = (en: string, ar: string) => lang === 'ar' ? ar : en;

  return (
    <LangContext.Provider value={{ lang, setLang, t, isAr: lang === 'ar' }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
