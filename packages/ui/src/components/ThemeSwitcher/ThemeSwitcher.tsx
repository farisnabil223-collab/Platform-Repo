import * as React from 'react';
import { cn } from '../../index';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('eduverse-theme') as Theme;
        if (saved && ['light', 'dark', 'system'].includes(saved)) {
          return saved;
        }
      } catch (e) {
        // Ignore localStorage read errors
      }
    }
    return 'system';
  });

  const [resolvedTheme, setResolvedTheme] = React.useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
    return 'light';
  });

  const setTheme = React.useCallback((t: Theme) => {
    setThemeState(t);
    try {
      localStorage.setItem('eduverse-theme', t);
    } catch (e) {
      // Ignore quota errors
    }
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = () => {
      let active: 'light' | 'dark' = 'light';
      if (theme === 'system') {
        active = mediaQuery.matches ? 'dark' : 'light';
      } else {
        active = theme;
      }

      setResolvedTheme(active);

      if (active === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    updateTheme();

    if (theme === 'system') {
      mediaQuery.addEventListener('change', updateTheme);
      return () => mediaQuery.removeEventListener('change', updateTheme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

export const ThemeSwitcher: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn('inline-flex rounded-lg border border-border bg-muted/40 p-0.5 select-none text-xs gap-0.5 opacity-50', className)}>
        <span className="px-2.5 py-1 text-muted-foreground">Theme</span>
      </div>
    );
  }

  return (
    <div className={cn('inline-flex rounded-lg border border-border bg-muted/40 p-0.5 select-none text-xs gap-0.5', className)}>
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={cn(
          'px-2.5 py-1 rounded-md font-medium transition-all duration-150',
          theme === 'light' ? 'bg-background shadow-sm text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        Light
      </button>
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={cn(
          'px-2.5 py-1 rounded-md font-medium transition-all duration-150',
          theme === 'dark' ? 'bg-background shadow-sm text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        Dark
      </button>
      <button
        type="button"
        onClick={() => setTheme('system')}
        className={cn(
          'px-2.5 py-1 rounded-md font-medium transition-all duration-150',
          theme === 'system' ? 'bg-background shadow-sm text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        System
      </button>
    </div>
  );
};
