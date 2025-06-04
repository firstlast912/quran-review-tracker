// sw.js - Safe Service Worker for Quran Memorization Tracker
const CACHE_NAME = 'quran-tracker-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: App shell cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Cache failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache when offline, update cache when online
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip Chrome extensions and other unsupported schemes
  if (url.protocol === 'chrome-extension:' || 
      url.protocol === 'moz-extension:' ||
      url.protocol === 'ms-browser-extension:' ||
      url.protocol === 'webkit:' ||
      url.protocol === 'about:') {
    return;
  }
  
  // Skip Firebase and external API requests
  if (url.origin.includes('firebase') || 
      url.origin.includes('googleapis') ||
      url.origin.includes('gstatic') ||
      url.origin.includes('firebaseapp') ||
      url.origin.includes('google')) {
    return;
  }
  
  // Only handle requests from our own domain
  if (url.origin !== location.origin) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }
        
        // Fetch from network
        return fetch(request)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response for caching
            const responseToCache = response.clone();
            
            // Cache the response safely
            caches.open(CACHE_NAME)
              .then((cache) => {
                try {
                  cache.put(request, responseToCache);
                } catch (error) {
                  console.log('Service Worker: Failed to cache request:', request.url, error);
                }
              });
            
            return response;
          })
          .catch((error) => {
            console.log('Service Worker: Fetch failed:', error);
            
            // Fallback for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/');
            }
            
            throw error;
          });
      })
  );
});

console.log('Service Worker: Script loaded');