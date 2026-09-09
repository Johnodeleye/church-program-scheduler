// Service Worker for PWA
const CACHE_NAME = 'rccg-schedule-v3'; // Change version

// Check if in development mode
const isDevelopment = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

if (isDevelopment) {
  console.log('🔧 Service Worker disabled in development mode');
  self.skipWaiting();
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request));
  });
} else {
  // PRODUCTION - Only cache static assets, NOT API
  const urlsToCache = [
    '/',
    '/manifest.json',
    '/rccg.png',
    '/icons/icon-48x48.png',
    '/icons/icon-72x72.png',
    '/icons/icon-96x96.png',
    '/icons/icon-144x144.png',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
  ];

  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      }).then(() => {
        return caches.open(CACHE_NAME)
          .then((cache) => {
            console.log('📦 Caching static assets only');
            return cache.addAll(urlsToCache);
          });
      }).then(() => self.skipWaiting())
    );
  });

  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      }).then(() => self.clients.claim())
    );
  });

  self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // SKIP caching for API calls
    if (url.pathname.startsWith('/api/')) {
      event.respondWith(fetch(event.request));
      return;
    }
    
    // Only cache static assets (images, icons, manifest)
    const isStaticAsset = 
      url.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp)$/) ||
      url.pathname === '/manifest.json' ||
      url.pathname === '/';
    
    if (isStaticAsset) {
      event.respondWith(
        caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
            return fetch(event.request).then(
              (response) => {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                  return response;
                }
                const responseToCache = response.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(event.request, responseToCache);
                  });
                return response;
              }
            );
          })
      );
    } else {
      // For everything else (HTML, JS, CSS) - ALWAYS fetch from network
      event.respondWith(fetch(event.request));
    }
  });
}