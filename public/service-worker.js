// Service Worker for PWA - DISABLED IN DEVELOPMENT
const CACHE_NAME = 'rccg-schedule-v1';

// Check if in development mode
const isDevelopment = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

if (isDevelopment) {
  console.log('🔧 Service Worker disabled in development mode');
  // Immediately unregister any existing service workers
  self.skipWaiting();
  
  // Override fetch to always go to network
  self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request));
  });
} else {
  // PRODUCTION - Normal caching
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
      caches.open(CACHE_NAME)
        .then((cache) => {
          console.log('📦 Caching assets');
          return cache.addAll(urlsToCache);
        })
        .then(() => self.skipWaiting())
    );
  });

  self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      }).then(() => self.clients.claim())
    );
  });

  self.addEventListener('fetch', (event) => {
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
  });
}