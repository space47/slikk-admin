// // const CACHE_NAME = 'my-cache-v1';
// // const FILES_TO_CACHE = ['/', '/manifest.json', '/icon.png'];

// // // Install Event
// // self.addEventListener('install', (event) => {
// //     console.log('[Service Worker] Installing...');
// //     event.waitUntil(
// //         caches.open(CACHE_NAME).then(async (cache) => {
// //             console.log('[Service Worker] Caching files');
// //             try {
// //                 await cache.addAll(FILES_TO_CACHE);
// //                 console.log('[Service Worker] All files cached successfully');
// //             } catch (error) {
// //                 console.error('[Service Worker] Error caching files:', error);
// //             }
// //         }),
// //     );
// // });

// // // Fetch Event
// // self.addEventListener('fetch', (event) => {
// //     if (event.request.method === 'GET') {
// //         event.respondWith(
// //             caches.match(event.request).then((response) => {
// //                 if (response) {
// //                     console.log(`[Service Worker] Found in cache: ${event.request.url}`);
// //                     return response;
// //                 }

// //                 console.log(`[Service Worker] Fetching: ${event.request.url}`);
// //                 return fetch(event.request)
// //                     .then((networkResponse) => {
// //                         if (networkResponse.ok) {
// //                             return caches.open(CACHE_NAME).then((cache) => {
// //                                 cache.put(event.request, networkResponse.clone());
// //                                 console.log(`[Service Worker] Cached new resource: ${event.request.url}`);
// //                                 return networkResponse;
// //                             });
// //                         } else {
// //                             console.error(`[Service Worker] Failed to fetch: ${event.request.url}`);
// //                             return networkResponse;
// //                         }
// //                     })
// //                     .catch((error) => {
// //                         console.error(`[Service Worker] Fetch failed for: ${event.request.url}`, error);

// //                         // Fallback for offline requests
// //                         if (event.request.destination === 'document') {
// //                             return caches.match('/index.html');
// //                         }
// //                     });
// //             }),
// //         );
// //     }
// // });

// // // Activate Event
// // self.addEventListener('activate', (event) => {
// //     console.log('[Service Worker] Activating...');
// //     event.waitUntil(
// //         caches.keys().then((cacheNames) => {
// //             return Promise.all(
// //                 cacheNames.map((cacheName) => {
// //                     if (cacheName !== CACHE_NAME) {
// //                         console.log(`[Service Worker] Deleting old cache: ${cacheName}`);
// //                         return caches.delete(cacheName);
// //                     }
// //                 }),
// //             );
// //         }),
// //     );
// //     // Take control immediately
// //     return self.clients.claim();
// // });


// /**
//  * Copyright 2018 Google Inc. All Rights Reserved.
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */

// // If the loader is already loaded, just stop.
// if (!self.define) {
//     let registry = {};
  
//     // Used for eval and importScripts where we can't get script URL by other means.
//     // In both cases, it's safe to use a global var because those functions are synchronous.
//     let nextDefineUri;
  
//     const singleRequire = (uri, parentUri) => {
//       uri = new URL(uri + ".js", parentUri).href;
//       return registry[uri] || (
        
//           new Promise(resolve => {
//             if ("document" in self) {
//               const script = document.createElement("script");
//               script.src = uri;
//               script.onload = resolve;
//               document.head.appendChild(script);
//             } else {
//               nextDefineUri = uri;
//               importScripts(uri);
//               resolve();
//             }
//           })
        
//         .then(() => {
//           let promise = registry[uri];
//           if (!promise) {
//             throw new Error(`Module ${uri} didn’t register its module`);
//           }
//           return promise;
//         })
//       );
//     };
  
//     self.define = (depsNames, factory) => {
//       const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
//       if (registry[uri]) {
//         // Module is already loading or loaded.
//         return;
//       }
//       let exports = {};
//       const require = depUri => singleRequire(depUri, uri);
//       const specialDeps = {
//         module: { uri },
//         exports,
//         require
//       };
//       registry[uri] = Promise.all(depsNames.map(
//         depName => specialDeps[depName] || require(depName)
//       )).then(deps => {
//         factory(...deps);
//         return exports;
//       });
//     };
//   }
//   define(['./workbox-e639beba'], (function (workbox) { 'use strict';
  
//     importScripts();
//     self.skipWaiting();
//     workbox.clientsClaim();
//     workbox.registerRoute("/", new workbox.NetworkFirst({
//       "cacheName": "start-url",
//       plugins: [{
//         cacheWillUpdate: async ({
//           request,
//           response,
//           event,
//           state
//         }) => {
//           if (response && response.type === 'opaqueredirect') {
//             return new Response(response.body, {
//               status: 200,
//               statusText: 'OK',
//               headers: response.headers
//             });
//           }
//           return response;
//         }
//       }]
//     }), 'GET');
//     workbox.registerRoute(/.*/i, new workbox.NetworkOnly({
//       "cacheName": "dev",
//       plugins: []
//     }), 'GET');
  
//   }));
//   //# sourceMappingURL=sw.js.map