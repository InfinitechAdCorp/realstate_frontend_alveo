const CACHE_NAME = "alveo-pwa-v1";
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/icon512_maskable.png",
  "/icon512_rounded.png",
  "/styles.css", // Add your global styles file if needed
];

// ✅ Install event - Pre-cache essential assets
self.addEventListener("install", (event) => {
  console.log("🔧 Service Worker: Installing...");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("📦 Caching static assets...");
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// ✅ Activate event - Clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          console.log("🗑️ Clearing old cache:", cache);
          return caches.delete(cache); // ✅ Delete old caches
        })
      );
    })
  );
  self.clients.claim();
});

// ✅ Fetch event - Serve cached assets first, fallback to network
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
      );
    })
  );
});

// ✅ Push Notifications (if needed)
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "You have a new notification!",
    icon: "/icon512_maskable.png",
    badge: "/icon512_maskable.png",
    actions: [{ action: "open", title: "View", icon: "/icon512_rounded.png" }],
  };

  event.waitUntil(
    self.registration.showNotification("📢 Alveo Land Update", options)
  );
});

// ✅ Handle Notification Clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
