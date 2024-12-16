const CACHE_NAME = 'my-cache-v1';
const FILES_TO_CACHE = ['/', '/manifest.json', '/icon.png'];

// Install Event
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            console.log('[Service Worker] Caching files');
            try {
                await cache.addAll(FILES_TO_CACHE);
                console.log('[Service Worker] All files cached successfully');
            } catch (error) {
                console.error('[Service Worker] Error caching files:', error);
            }
        }),
    );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
    if (event.request.method === 'GET') {
        event.respondWith(
            caches.match(event.request).then((response) => {
                if (response) {
                    console.log(`[Service Worker] Found in cache: ${event.request.url}`);
                    return response;
                }

                console.log(`[Service Worker] Fetching: ${event.request.url}`);
                return fetch(event.request)
                    .then((networkResponse) => {
                        if (networkResponse.ok) {
                            return caches.open(CACHE_NAME).then((cache) => {
                                cache.put(event.request, networkResponse.clone());
                                console.log(`[Service Worker] Cached new resource: ${event.request.url}`);
                                return networkResponse;
                            });
                        } else {
                            console.error(`[Service Worker] Failed to fetch: ${event.request.url}`);
                            return networkResponse;
                        }
                    })
                    .catch((error) => {
                        console.error(`[Service Worker] Fetch failed for: ${event.request.url}`, error);

                        // Fallback for offline requests
                        if (event.request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                    });
            }),
        );
    }
});

// Activate Event
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log(`[Service Worker] Deleting old cache: ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                }),
            );
        }),
    );
    // Take control immediately
    return self.clients.claim();
});
