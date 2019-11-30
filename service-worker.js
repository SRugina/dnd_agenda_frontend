const workbox = import("workbox");

self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.setConfig({
  debug: false
});

workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: "images",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 4 * 60 * 60 // 4 hours
      })
    ]
  })
);

workbox.routing.registerRoute(
  /\.(?:css)$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: "images",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 2 * 60 * 60 // 2 hours
      })
    ]
  })
);

workbox.routing.registerRoute(
  new RegExp("https://api.dndearall.com/.*"),
  workbox.strategies.networkFirst({
    cacheName: "api"
  })
);

workbox.routing.registerRoute(
  /\.(?:js)$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: "js",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 1 * 60 * 60 // 1 hour
      })
    ]
  })
);
