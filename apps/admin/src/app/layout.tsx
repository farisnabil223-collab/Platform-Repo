import type { Metadata } from 'next';
import ClientProviders from '../components/ClientProviders';
import './globals.css';

export const metadata: Metadata = {
  title: 'EduVerse - Admin Engine',
  description: 'Enterprise-grade administrative management console.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('eduverse-theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark = saved === 'dark' || ((!saved || saved === 'system') && prefersDark);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}

                if (typeof window !== 'undefined') {
                  var clean = function() {
                    document.querySelectorAll('[bis_skin_checked],[bis_size],[bis_id]').forEach(function(el) {
                      el.removeAttribute('bis_skin_checked');
                      el.removeAttribute('bis_size');
                      el.removeAttribute('bis_id');
                    });
                  };
                  clean();
                  window.addEventListener('DOMContentLoaded', clean);
                }
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
