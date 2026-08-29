import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../index';
import { ThemeSwitcher } from '../ThemeSwitcher/ThemeSwitcher';
import { LanguageSwitcher, useLanguage } from '../LanguageSwitcher/LanguageSwitcher';
import { ProfileMenu } from '../ProfileMenu/ProfileMenu';
import { SearchBar } from '../SearchBar/SearchBar';
import { Dialog } from '../Dialog/Dialog';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Breadcrumb } from '../Breadcrumb/Breadcrumb';
import { Icon } from '../Icon/Icon';
import { useSidebarStore, useNotificationsStore, useAuthStore } from '../../context/GlobalStore';
import { useFeatureFlagsConfig } from '../../context/FeatureFlag';
import { PORTAL_ROUTES, RouteDefinition } from '../../config/routes';

export interface PortalLayoutProps {
  role: 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN';
  children: React.ReactNode;
  pageTitle?: string;
  pageDescription?: string;
  headerActions?: React.ReactNode;
  footerLinks?: { label: string; href: string }[];
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({
  role,
  children,
  pageTitle,
  pageDescription,
  headerActions,
  footerLinks,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { dir } = useLanguage();
  
  // Connect to Global Stores
  const { isOpen: mobileMenuOpen, setOpen: setMobileMenuOpen } = useSidebarStore();
  const { notifications } = useNotificationsStore();
  const { user, logout } = useAuthStore();
  const { flags } = useFeatureFlagsConfig();

  // Close mobile drawer on route transition
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  // Load centralized navigation configuration for the role
  const navigationItems = React.useMemo(() => {
    return PORTAL_ROUTES[role] || [];
  }, [role]);

  // Filter navigation items by permissions & feature flags
  const filteredNav = React.useMemo(() => {
    const isVisible = (item: RouteDefinition) => {
      // 1. Permission lock validation
      if (item.permissions && user) {
        const hasPerm = item.permissions.every((p) => user.permissions.includes(p));
        if (!hasPerm) return false;
      }
      // 2. Feature Flag validation
      if (item.featureFlag) {
        const flagKey = item.featureFlag as keyof typeof flags;
        if (flags[flagKey] === false) return false;
      }
      return true;
    };

    return navigationItems
      .filter(isVisible)
      .map((item) => {
        if (item.children) {
          return {
            ...item,
            children: item.children.filter(isVisible),
          };
        }
        return item;
      });
  }, [navigationItems, user, flags]);

  const activeRouteCheck = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  // Generate dynamic breadcrumbs automatically based on the pathname
  const pageBreadcrumbs = React.useMemo(() => {
    if (!pathname) return [];
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((seg, idx) => {
      const href = '/' + segments.slice(0, idx + 1).join('/');
      const label = seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ');
      return {
        label,
        href: idx === segments.length - 1 ? undefined : href,
      };
    });
  }, [pathname]);

  const [notifOpen, setNotifOpen] = React.useState(false);
  const [quickActionOpen, setQuickActionOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans transition-colors duration-150">
      {/* Skip Navigation accessibility helper */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-60 focus:bg-primary focus:text-primary-foreground focus:p-4 focus:rounded-md focus:m-4 focus:shadow-lg focus:outline-none"
      >
        Skip to Main Content
      </a>

      {/* SIDEBAR - DESKTOP */}
      <aside className="hidden lg:flex flex-col w-[260px] border-r border-border/60 bg-card select-none">
        {/* Logo and branding */}
        <div className="h-16 px-6 border-b border-border/40 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black font-heading text-lg">
            EV
          </div>
          <div>
            <h1 className="text-sm font-bold font-heading leading-tight tracking-tight">EduVerse</h1>
            <span className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase leading-none block">
              {role} Portal
            </span>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 py-4 px-4 overflow-y-auto flex flex-col gap-1.5" aria-label="Sidebar Navigation">
          {filteredNav.map((item) => {
            const isActive = activeRouteCheck(item.path);
            return (
              <div key={item.path}>
                <Link
                  href={item.path}
                  className={cn(
                    'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary text-primary-foreground font-semibold shadow'
                      : 'hover:bg-muted/50 text-foreground/80'
                  )}
                >
                  <div className="flex items-center gap-3">
                    {item.icon && <Icon name={item.icon} size="sm" className="shrink-0" />}
                    <span>{item.title}</span>
                  </div>
                </Link>
                {/* Nested sub-menus */}
                {item.children && isActive && (
                  <div className={cn('mt-1 flex flex-col gap-1 pl-6 border-l border-border/60', dir === 'rtl' && 'pl-0 pr-6 border-l-0 border-r')}>
                    {item.children.map((sub) => (
                      <Link
                        key={sub.path}
                        href={sub.path}
                        className={cn(
                          'px-3 py-1.5 rounded-md text-xs font-medium transition-colors block',
                          activeRouteCheck(sub.path)
                            ? 'text-primary font-semibold'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {sub.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer switches */}
        <div className="p-4 border-t border-border/40 flex flex-col gap-3">
          <ThemeSwitcher className="w-full justify-around" />
          <LanguageSwitcher className="w-full justify-around" />
        </div>
      </aside>

      {/* MOBILE DRAWER SIDEBAR */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: dir === 'rtl' ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: dir === 'rtl' ? '100%' : '-100%' }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className={cn(
                'relative z-50 w-full max-w-[280px] bg-card p-6 border-border shadow-xl h-full flex flex-col',
                dir === 'rtl' ? 'mr-0 border-l' : 'ml-0 border-r'
              )}
            >
              <div className="flex items-center justify-between pb-6 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black text-lg">
                    EV
                  </div>
                  <h1 className="text-sm font-bold font-heading">EduVerse</h1>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded hover:bg-muted text-muted-foreground"
                  aria-label="Close menu"
                >
                  <Icon name="x" size="sm" />
                </button>
              </div>

              <nav className="flex-1 py-4 flex flex-col gap-1.5 overflow-y-auto">
                {filteredNav.map((item) => {
                  const isActive = activeRouteCheck(item.path);
                  return (
                    <div key={item.path}>
                      <Link
                        href={item.path}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all block',
                          isActive ? 'bg-primary text-primary-foreground shadow' : 'hover:bg-muted/50 text-foreground/80'
                        )}
                      >
                        {item.icon && <Icon name={item.icon} size="sm" className="shrink-0" />}
                        <span>{item.title}</span>
                      </Link>
                    </div>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-border/40 flex flex-col gap-3">
                <ThemeSwitcher className="w-full justify-around" />
                <LanguageSwitcher className="w-full justify-around" />
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP NAVBAR */}
        <header className="h-16 border-b border-border/60 bg-card/80 backdrop-blur-md px-6 flex items-center justify-between select-none z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-md border border-border bg-muted/20 text-muted-foreground hover:text-foreground hover:bg-muted/50 focus:outline-none"
              aria-label="Open menu drawer"
            >
              <Icon name="menu" size="sm" />
            </button>
            <SearchBar className="hidden md:flex w-64 lg:w-80" showShortcut />
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Actions Portal Trigger */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuickActionOpen(true)}
              className="text-xs font-semibold"
            >
              Quick Action
            </Button>

            {/* Notifications panel dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 rounded-full border border-border bg-muted/20 text-muted-foreground hover:text-foreground hover:bg-muted/50 focus:outline-none relative"
                aria-label="View notifications drawer"
              >
                <Icon name="bell" size="sm" />
                {notifications.some((n) => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-red-500" />
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setNotifOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={cn(
                        'absolute mt-2 w-80 rounded-lg border border-border bg-card p-4 shadow-xl z-30 focus:outline-none',
                        dir === 'rtl' ? 'left-0 origin-top-left' : 'right-0 origin-top-right'
                      )}
                    >
                      <h4 className="text-sm font-semibold font-heading border-b border-border/50 pb-2 mb-2">
                        Portal Notifications
                      </h4>
                      <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="text-xs text-muted-foreground text-center py-4">No notifications.</p>
                        ) : (
                          notifications.map((n) => (
                            <div key={n.id} className="p-2 rounded bg-muted/40 text-xs border border-border/20">
                              <div className="flex justify-between font-semibold font-heading">
                                <span>{n.title}</span>
                                {!n.read && <Badge variant="primary" className="text-[8px] px-1 py-0.2">New</Badge>}
                              </div>
                              <p className="text-muted-foreground text-[10px] mt-0.5">{n.description}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile menu dropdown */}
            <ProfileMenu
              name={user?.name || 'Portal User'}
              email={user?.email || 'user@eduverse.com'}
              role={role}
              onSignOut={() => {
                logout();
                router.push('/');
              }}
            />
          </div>
        </header>

        {/* MAIN BODY CONTENT AREA */}
        <main id="main-content" className="flex-grow p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto">
          {/* Automatically Generated Breadcrumbs */}
          {pageBreadcrumbs.length > 0 && <Breadcrumb items={pageBreadcrumbs} />}

          {/* Dynamic Page Header */}
          {(pageTitle || pageDescription || headerActions) && (
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border/40 pb-5 gap-3 select-none">
              <div>
                {pageTitle && (
                  <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight font-heading text-foreground">
                    {pageTitle}
                  </h2>
                )}
                {pageDescription && (
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed max-w-2xl">
                    {pageDescription}
                  </p>
                )}
              </div>
              {headerActions && <div className="flex items-center gap-3">{headerActions}</div>}
            </div>
          )}

          {/* Render children workspace screens */}
          <div className="flex-1 flex flex-col gap-6">
            {children}
          </div>
        </main>

        {/* FOOTER BAR */}
        <footer className="h-14 border-t border-border/60 bg-card px-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-muted-foreground select-none gap-2 shrink-0">
          <span>&copy; {new Date().getFullYear()} EduVerse Enterprise Ecosystem. All rights reserved.</span>
          <div className="flex items-center gap-4">
            {footerLinks ? (
              footerLinks.map((fl) => (
                <Link key={fl.href} href={fl.href} className="hover:underline">
                  {fl.label}
                </Link>
              ))
            ) : (
              <>
                <a href="#accessibility" className="hover:underline">Accessibility Statement</a>
                <a href="#terms" className="hover:underline">Terms of Service</a>
              </>
            )}
          </div>
        </footer>
      </div>

      {/* QUICK ACTIONS MODAL DIALOG */}
      <Dialog
        isOpen={quickActionOpen}
        onClose={() => setQuickActionOpen(false)}
        title="Quick Operations Console"
        description="Trigger standard transactional shortcuts."
        footerActions={
          <>
            <Button variant="ghost" onClick={() => setQuickActionOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setQuickActionOpen(false)}>
              Execute Task
            </Button>
          </>
        }
      >
        <div className="p-4 bg-muted/40 rounded border border-border/40 text-xs text-muted-foreground leading-relaxed">
          Please select a system command parameters from your role permission profiles to submit transaction records.
        </div>
      </Dialog>
    </div>
  );
};

(PortalLayout as any).metadata = {
  name: 'PortalLayout',
  version: '1.1.0',
  accessibilityLevel: 'AA',
  themeSupport: true,
  rtlSupport: true,
  dependencies: ['framer-motion', 'clsx', 'next/navigation'],
  supportedVariants: ['STUDENT', 'TEACHER', 'PARENT', 'ADMIN'],
};
export default PortalLayout;
