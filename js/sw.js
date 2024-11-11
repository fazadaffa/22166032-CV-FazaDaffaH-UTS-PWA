// Nama cache
const CACHE_NAME = 'portfolio-cache-v1';

// Daftar file yang akan di-cache
const CACHE_ASSETS = [
    '/',
    '/index.html',
    '/indexdb.js',
    '/css/style.css',
    '/js/index.js',
    '/js/main.js',
    '/assets/begeh2.jpg',
    '/assets/bg2.jpg',
    '/assets/bgmobile.png',
    '/assets/faza.jpg',
    '/assets/icon-192x192.png',
    '/assets/icon-512x512.png',
    '/manifest.json'
];

// Event Install - Menyimpan aset ke cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching assets');
                return cache.addAll(CACHE_ASSETS);
            })
            .catch(error => {
                console.error('Failed to cache assets:', error);
            })
            .then(() => self.skipWaiting())
    );
});

// Event Activate - Menghapus cache lama jika ada
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Deleting old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Event Fetch - Menyajikan konten dari cache saat offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Jika ada di cache, sajikan dari cache
                if (response) {
                    return response;
                }

                // Jika tidak ada di cache, lakukan fetch ke jaringan
                return fetch(event.request)
                    .then(networkResponse => {
                        // Jika permintaan berhasil, cache responnya
                        if (networkResponse && networkResponse.status === 200) {
                            const responseClone = networkResponse.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => cache.put(event.request, responseClone))
                                .catch(error => console.error('Failed to cache new response:', error));
                        }
                        return networkResponse;
                    });
            })
            .catch(() => {
                // Kembali ke halaman fallback jika tidak ada koneksi
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
            })
    );
});
