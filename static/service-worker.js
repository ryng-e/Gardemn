const CACHE_NAME = 'offline';
const OFFLINE_URL = './offline.html';

self.addEventListener('install', event => {
  console.log('Installing...');

  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.add(
        new Request(OFFLINE_URL, { cache: 'reload' }),
      );
    })()
  );

  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Activating...');
});

self.addEventListener('fetch', event => {
  if(event.request.mode === "navigate") {
    
    event.respondWith(
      (async () => {
        try {
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }
  
          const networkResponse = await fetch(event.request);
          return networkResponse;
  
        } catch (error) {
          console.log('Fetch failed; returning offline page instead.', error);
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(OFFLINE_URL);
          return cachedResponse;
        }
      })()
    );

  }
});
