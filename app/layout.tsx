import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RCCG David's Pavilion - Bible Study Schedule",
  description: "Bible Study - Digging Deep Schedule Manager",
  manifest: "/manifest.json",
  themeColor: "#1a3a6b",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Bible Study Scheduler",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    apple: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Bible Study Scheduler" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#1a3a6b" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512x512.png" />
        
        {/* Force clear old cache and service workers */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Force clear old service workers
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for (let registration of registrations) {
                    registration.unregister();
                    console.log('Unregistered old service worker');
                  }
                });
              }
              
              // Clear cache
              if ('caches' in window) {
                caches.keys().then(function(names) {
                  for (let name of names) {
                    caches.delete(name);
                    console.log('Deleted cache:', name);
                  }
                });
              }
              
              // Reload after 1 second
              setTimeout(function() {
                window.location.reload();
              }, 1000);
            `,
          }}
        />

        {/* Register Service Worker - Only in production */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Only register service worker in production
              const isDevelopment = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
              if (!isDevelopment && 'serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/service-worker.js')
                    .then(function(reg) {
                      console.log('Service Worker registered successfully!');
                    })
                    .catch(function(err) {
                      console.log('Service Worker registration failed:', err);
                    });
                });
              } else {
                console.log('🔧 Service Worker disabled in development mode');
                // Unregister any existing service workers in development
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    for (let registration of registrations) {
                      registration.unregister();
                      console.log('Unregistered service worker');
                    }
                  });
                }
              }
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-50/50">
        {children}
      </body>
    </html>
  );
}