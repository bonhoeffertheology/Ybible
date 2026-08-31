const CACHE_NAME = 'ybible-offline-v4';
const ASSETS_TO_CACHE = [
  '/Ybible/',
  '/Ybible/index.html',
  '/Ybible/manifest.json',
  '/Ybible/icon-192.png',
  '/Ybible/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // 오프라인 상태일 때 기본 페이지 반환
        return caches.match('/Ybible/index.html');
      });
    })
  );
});
