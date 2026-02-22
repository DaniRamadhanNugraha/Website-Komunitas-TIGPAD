const CACHE_NAME = "tigpad-cache-v4";

const STATIC_ASSETS = [
    "./",
    "./index.html",
    "./tentang.html",
    "./profile.html",
    "./pendaftaran.html",
    "./divisi.html",
    "./assets/css/style.css",
    "./assets/js/main.js",
    "./assets/img/logo2.png",
    "./favicon.ico"
];

// =========================
// INSTALL
// =========================
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache =>
            Promise.allSettled(STATIC_ASSETS.map(asset => cache.add(asset)))
        )
    );
    self.skipWaiting();
});

// =========================
// ACTIVATE (bersihkan cache lama)
// =========================
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );

    // 🔥 Kirim sinyal ke semua tab
    self.clients.matchAll({ type: "window" }).then(clients => {
        clients.forEach(client => {
            client.postMessage({ type: "SW_UPDATED" });
        });
    });

    self.clients.claim();
});

// =========================
// FETCH (cache-first, lalu network)
// =========================
self.addEventListener("fetch", event => {
    const request = event.request;

    if (request.method !== "GET") return;

    // HTML → Network First
    if (request.headers.get("accept")?.includes("text/html")) {
        event.respondWith(networkFirst(request));
        return;
    }

    // Asset → Stale While Revalidate
    event.respondWith(staleWhileRevalidate(request));
});

// =========================
// STRATEGY FUNCTIONS
// =========================
// Network First untuk HTML
async function networkFirst(request) {
    try {
        const fresh = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, fresh.clone());
        return fresh;
    } catch {
        return await caches.match(request) || caches.match("./index.html");
    }
}

// Stale While Revalidate untuk asset statis (CSS, JS, gambar, dll)
async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);

    const fetchPromise = fetch(request)
        .then(response => {
            cache.put(request, response.clone());
            return response;
        })
        .catch(() => cached);

    return cached || fetchPromise;
}
