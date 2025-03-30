// Service Worker for Designers Directory PWA
const CACHE_NAME = 'designers-directory-cache-v1';

// Assets to cache - fixed to remove duplicates and empty strings
const ASSETS_TO_CACHE = [
  '/',
  '/favicon.png',
  '/manifest.json'
  // Not caching service-worker.js to avoid self-caching issues
];

// Install event - cache static assets with improved error handling
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Cache each asset individually to prevent one failure from breaking the entire process
        return Promise.allSettled(
          ASSETS_TO_CACHE.map(url => 
            cache.add(url).catch(error => {
              console.warn(`Failed to cache asset: ${url}`, error);
            })
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => {
          return name !== CACHE_NAME;
        }).map((name) => {
          return caches.delete(name);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache if available, fall back to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  
  // Skip caching of the service worker itself to avoid circular references
  if (url.pathname.endsWith('service-worker.js')) {
    return;
  }
  
  // Network-first strategy for API requests - with better error handling
  if (url.pathname.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Only cache successful responses
          if (!response || response.status !== 200) {
            return response;
          }
          
          // Clone the response to store in cache
          const clonedResponse = response.clone();
          
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          }).catch(err => {
            console.warn('Cache put error:', err);
          });
          
          return response;
        })
        .catch((error) => {
          console.error('API fetch error in service worker:', error);
          // If network fails, try to serve from cache
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // If nothing in cache, let the error propagate
              throw error;
            });
        })
    );
    return;
  }
  
  // Cache-first strategy for static assets and SvelteKit routes
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return from cache if found
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Otherwise fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-success responses
            if (!response || response.status !== 200) {
              return response;
            }
            
            // Clone the response to store in cache
            const clonedResponse = response.clone();
            
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clonedResponse);
            });
            
            return response;
          });
      })
  );
}); 