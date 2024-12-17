// src/service-worker.ts
/// <reference lib="webworker" />

import { clientsClaim } from 'workbox-core'
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'

// Claim clients as soon as the service worker is activated
self.skipWaiting()
clientsClaim()

// Precache assets
precacheAndRoute(self.__WB_MANIFEST || [])

// Cache API requests
registerRoute(
    ({ url }) => url.origin === 'https://api.example.com', // Update with your API URL
    new StaleWhileRevalidate({
        cacheName: 'api-cache',
        plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
    }),
)

// Cache images with a Cache First strategy
registerRoute(
    ({ request }) => request.destination === 'image',
    new CacheFirst({
        cacheName: 'image-cache',
        plugins: [
            new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 7 * 24 * 60 * 60 }), // 1 week
        ],
    }),
)
