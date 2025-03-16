
// Service Worker for HappyDonation PWA
const CACHE_NAME = 'happydonation-cache-v4';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  '/lovable-uploads/b8adb940-cf0a-4902-89fd-01b317af12a5.png',
  '/lovable-uploads/dc5f60a7-e574-4624-9179-84afebf69ff9.png'
];

// Log service worker startup
console.log('Service Worker initializing - Version 4');

// Install event - cache assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  // Force waiting service worker to become active
  self.skipWaiting()
    .then(() => {
      console.log('[Service Worker] Skip Waiting successful');
    })
    .catch(err => {
      console.error('[Service Worker] Skip Waiting failed:', err);
    });
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching files');
        return cache.addAll(urlsToCache)
          .then(() => {
            console.log('[Service Worker] All files cached successfully');
          })
          .catch(err => {
            console.error('[Service Worker] Error caching files:', err);
            // Continue even if some files fail to cache
            return Promise.resolve();
          });
      })
      .catch(error => {
        console.error('[Service Worker] Install failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  // Take control of all clients immediately
  event.waitUntil(
    Promise.all([
      self.clients.claim()
        .then(() => {
          console.log('[Service Worker] Clients claimed successfully');
        })
        .catch(err => {
          console.error('[Service Worker] Error claiming clients:', err);
        }),
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[Service Worker] Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
            return Promise.resolve();
          })
        );
      })
    ])
    .catch(error => {
      console.error('[Service Worker] Activation failed:', error);
    })
  );
  
  // Notify all clients that the service worker has been updated
  self.clients.matchAll()
    .then(clients => {
      clients.forEach(client => {
        client.postMessage({ type: 'SW_UPDATED' });
      });
      console.log(`[Service Worker] Notified ${clients.length} clients about update`);
    })
    .catch(err => {
      console.error('[Service Worker] Error notifying clients:', err);
    });
});

// Helper function to determine if a request should be cached
const shouldCache = (url) => {
  // Don't cache API calls
  if (url.includes('/api/')) return false;
  
  // Don't cache external URLs
  if (!url.startsWith(self.location.origin)) return false;
  
  // Don't cache query parameters for dynamic content
  if (url.includes('?')) return false;
  
  return true;
};

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip browser-extension requests and non-http(s) requests
  if (!event.request.url.startsWith('http')) {
    return;
  }
  
  console.log('[Service Worker] Fetching', event.request.url);
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          console.log('[Service Worker] Using cached version of', event.request.url);
          return response;
        }
        
        // Clone the request because it's a one-time use stream
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response because it's a one-time use stream
            const responseToCache = response.clone();

            if (shouldCache(event.request.url)) {
              caches.open(CACHE_NAME)
                .then((cache) => {
                  console.log('[Service Worker] Caching new resource', event.request.url);
                  cache.put(event.request, responseToCache);
                })
                .catch(error => {
                  console.error('[Service Worker] Cache put failed:', error);
                });
            }

            return response;
          })
          .catch((error) => {
            console.error('[Service Worker] Fetch failed', error);
            
            // Try to return the index page for navigation requests when offline
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
            
            return new Response('Network error occurred', {
              status: 408,
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
      .catch(error => {
        console.error('[Service Worker] Cache match failed:', error);
        return fetch(event.request);
      })
  );
});

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received');
  
  const title = 'HappyDonation';
  const options = {
    body: event.data ? event.data.text() : 'New notification from HappyDonation',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png'
  };
  
  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click received');
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
      .then(() => {
        console.log('[Service Worker] Skip waiting successful from message');
      })
      .catch(err => {
        console.error('[Service Worker] Skip waiting failed from message:', err);
      });
  }
});

// Log errors
self.addEventListener('error', function(event) {
  console.error('[Service Worker] Error:', event.message, event.filename, event.lineno);
});
