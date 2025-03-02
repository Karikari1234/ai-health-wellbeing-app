self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("weight-tracker-v1").then((cache) => {
      return cache.addAll([
        "/",
        "/manifest.json",
        "/icons/icon-192x192.png",
        "/icons/icon-512x512.png",
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).then((fetchResponse) => {
          // Don't cache API calls or auth requests
          if (
            event.request.url.includes("/api/") ||
            event.request.url.includes("/auth/")
          ) {
            return fetchResponse;
          }

          return caches.open("weight-tracker-v1").then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        })
      );
    })
  );
});
