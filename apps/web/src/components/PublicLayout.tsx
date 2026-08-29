'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import { analytics } from '../utils/analytics';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  useEffect(() => {
    analytics.trackPageView(pathname);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between select-none font-sans antialiased selection:bg-primary/20 selection:text-primary transition-colors">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-12 py-10">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
