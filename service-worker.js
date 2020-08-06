/* eslint-disable no-undef */

self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

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
    cacheName: "css",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 2 * 60 * 60 // 2 hours
      })
    ]
  })
);

const bgSyncPlugin = new workbox.backgroundSync.Plugin("apiQueue", {
  maxRetentionTime: 24 * 60 // Retry for max of 24 Hours
});

workbox.routing.registerRoute(
  new RegExp("https://api.dndearall.com/.*"),
  workbox.strategies.networkFirst({
    cacheName: "api",
    plugins: [bgSyncPlugin]
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
