
// Service Worker for HappyDonation PWA
const CACHE_NAME = 'happydonation-cache-v1';
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
console.log('Service Worker initializing');

// Install event - cache assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Skip waiting');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Install failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
          return null;
        }).filter(Boolean)
      );
    })
    .then(() => {
      console.log('Service Worker: Claiming clients');
      return self.clients.claim();
    })
    .catch(error => {
      console.error('Service Worker: Activation failed:', error);
    })
  );
});

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
  
  console.log('Service Worker: Fetching', event.request.url);
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          console.log('Service Worker: Using cached version of', event.request.url);
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

            caches.open(CACHE_NAME)
              .then((cache) => {
                console.log('Service Worker: Caching new resource', event.request.url);
                // Don't cache API calls or external resources
                if (!event.request.url.includes('/api/') && 
                    event.request.url.startsWith(self.location.origin)) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          })
          .catch((error) => {
            console.error('Service Worker: Fetch failed', error);
            // You could return a custom offline page here
            return caches.match('/');
          });
      })
      .catch(error => {
        console.error('Service Worker: Cache match failed:', error);
        return fetch(event.request);
      })
  );
});

// Handle push notifications (if we add them later)
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received');
  
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
  console.log('Service Worker: Notification click received');
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

// Log errors
self.addEventListener('error', function(event) {
  console.error('Service Worker error:', event.message, event.filename, event.lineno);
});
