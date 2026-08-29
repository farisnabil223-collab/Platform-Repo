import type { Metadata } from 'next';
import ClientProviders from '../components/ClientProviders';
import './globals.css';

export const metadata: Metadata = {
  title: 'EduVerse - Educational Platform',
  description: 'Enterprise-grade educational learning portal.',
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
                  var isDark = saved === 'dark';
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}

                if (typeof window !== 'undefined') {
                  var ignoreError = function(msg, filename) {
                    var sMsg = String(msg || '');
                    var sFile = String(filename || '');
                    return sMsg.indexOf('MetaMask') !== -1 || sFile.indexOf('chrome-extension:') !== -1 || sMsg.indexOf('nkbihfbeogaeaoehlefnkodbefgpggknn') !== -1;
                  };

                  window.addEventListener('error', function(event) {
                    if (ignoreError(event.message, event.filename)) {
                      event.stopImmediatePropagation();
                      event.preventDefault();
                    }
                  }, true);

                  window.addEventListener('unhandledrejection', function(event) {
                    var reason = event.reason ? (event.reason.message || String(event.reason)) : '';
                    if (ignoreError(reason, '')) {
                      event.stopImmediatePropagation();
                      event.preventDefault();
                    }
                  }, true);

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
