const CACHE_NAME = 'my-cache-v1';
const FILES_TO_CACHE = ['/', '/index.html', '/manifest.json', '/icon.png'];

// Install Event
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching files');
            return cache.addAll(FILES_TO_CACHE);
        }),
    );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
    if (event.request.method === 'GET') {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return (
                    response ||
                    fetch(event.request).catch(() => {
                        if (event.request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                    })
                );
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
});
