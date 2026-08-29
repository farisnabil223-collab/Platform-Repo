import * as React from 'react';
import { cn } from '../../index';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = React.useState<Language>('en');
  const [dir, setDir] = React.useState<'ltr' | 'rtl'>('ltr');

  const setLanguage = (l: Language) => {
    setLanguageState(l);
    localStorage.setItem('eduverse-lang', l);
  };

  React.useEffect(() => {
    const saved = localStorage.getItem('eduverse-lang') as Language;
    if (saved) setLanguageState(saved);
  }, []);

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute('lang', language);
    
    const direction = language === 'ar' ? 'rtl' : 'ltr';
    setDir(direction);
    root.setAttribute('dir', direction);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = React.useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={cn('inline-flex rounded-lg border border-border bg-muted/40 p-0.5 select-none text-xs gap-0.5', className)}>
      <button
        onClick={() => setLanguage('en')}
        className={cn(
          'px-2.5 py-1 rounded-md font-medium transition-all duration-150',
          language === 'en' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        English
      </button>
      <button
        onClick={() => setLanguage('ar')}
        className={cn(
          'px-2.5 py-1 rounded-md font-medium transition-all duration-150',
          language === 'ar' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        العربية (AR)
      </button>
    </div>
  );
};
