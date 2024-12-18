// src/service-worker.ts
/// <reference lib="webworker" />

import { clientsClaim } from 'workbox-core'
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'

self.skipWaiting()
clientsClaim()

precacheAndRoute(self.__WB_MANIFEST || [])

const apiUrl = import.meta.env.VITE_BACKEND_URI

registerRoute(
    ({ url }) => url.origin === apiUrl,
    new StaleWhileRevalidate({
        cacheName: 'api-cache',
        plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
    }),
)

const handler = async ({ event }: any) => {
    const cache = await caches.open('start-url-cache')
    const response = await cache.match('/index.html')
    return response || fetch(event.request)
}

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

const navigationRoute = new NavigationRoute(handler)
registerRoute(navigationRoute)
