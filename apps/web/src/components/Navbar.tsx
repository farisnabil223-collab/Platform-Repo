/* eslint-disable no-undef */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore, Button } from '@eduverse/ui';
import { Menu, X, LogOut, LayoutDashboard, Sparkles, Flame, Sun, Moon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(false);

  React.useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('eduverse-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('eduverse-theme', 'light');
    }
  };

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Courses', href: '/courses' },
    { name: 'Teachers', href: '/teachers' },
    { name: 'Subjects', href: '/subjects' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getDashboardRoute = () => {
    if (!user) return '/student/dashboard';
    switch (user.role) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'TEACHER':
        return '/teacher/dashboard';
      case 'PARENT':
        return '/parent/dashboard';
      default:
        return '/student/dashboard';
    }
  };

  return (
    <header className="h-16 px-6 lg:px-12 border-b border-border bg-card/95 backdrop-blur-xl sticky top-0 flex items-center justify-between z-navigation select-none transition-colors">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-black font-heading text-lg shadow-sm group-hover:scale-105 transition-all">
          EV
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-extrabold font-heading text-foreground tracking-wide group-hover:text-primary transition-colors flex items-center gap-1">
            EduVerse <Sparkles size={12} className="text-amber" />
          </span>
          <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest -mt-1">Educational Platform</span>
        </div>
      </Link>

      {/* Desktop Links */}
      <nav className="hidden lg:flex items-center gap-6">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`text-xs font-semibold tracking-wide transition-all relative py-1 ${
                isActive
                  ? 'text-primary font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link.name}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Desktop CTA / Profile */}
      <div className="hidden lg:flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Light/Dark Theme"
          className="p-2 rounded-xl bg-muted hover:bg-accent text-muted-foreground hover:text-foreground border border-border transition-all flex items-center justify-center"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun size={15} className="text-amber" /> : <Moon size={15} className="text-slate-700" />}
        </button>

        {isAuthenticated ? (
          <>
            <Link href={getDashboardRoute()}>
              <Button variant="ghost" size="sm" className="text-xs text-foreground bg-muted border border-border hover:bg-accent hover:text-accent-foreground flex items-center gap-1.5 py-1.5 px-3 rounded-xl transition-all">
                <LayoutDashboard size={14} className="text-teal" />
                Dashboard
              </Button>
            </Link>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="text-xs text-muted-foreground hover:text-destructive border-border hover:bg-destructive/10 py-1.5 px-3 flex items-center gap-1 rounded-xl"
            >
              <LogOut size={14} />
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href="/student/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-xs py-1.5 px-3">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold text-xs px-4 py-2 rounded-xl shadow-sm hover:scale-105 transition-all flex items-center gap-1.5">
                <Flame size={13} className="fill-primary-foreground" /> Join Quest
              </button>
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden text-muted-foreground hover:text-foreground p-1 focus:outline-none"
        aria-label="Toggle Navigation Menu"
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-card border-b border-border p-6 flex flex-col gap-4 lg:hidden shadow-2xl z-navigation animate-accordion-down">
          <nav className="flex flex-col gap-3">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-xs font-semibold py-1.5 transition-colors ${
                    isActive ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="border-t border-border pt-4 flex flex-col gap-2.5">
            <button
              onClick={() => {
                toggleTheme();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 rounded-xl bg-muted border border-border text-xs font-bold text-foreground flex items-center justify-center gap-2"
            >
              {isDark ? <Sun size={14} className="text-amber" /> : <Moon size={14} className="text-slate-700" />}
              {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>
            {isAuthenticated ? (
              <>
                <Link href={getDashboardRoute()} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full text-xs text-foreground border border-border bg-muted flex items-center justify-center gap-1.5">
                    <LayoutDashboard size={14} />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs text-muted-foreground hover:text-destructive border-border flex items-center justify-center gap-1"
                >
                  <LogOut size={14} />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/student/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full text-muted-foreground hover:text-foreground text-xs">
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full bg-primary text-primary-foreground font-extrabold text-xs py-2 rounded-xl shadow-sm flex items-center justify-center gap-1.5">
                    <Flame size={13} className="fill-primary-foreground" /> Join Quest
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

