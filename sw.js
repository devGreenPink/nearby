// Goodbye worker. Phones and computers that installed the old app (/nearby/) still run its
// service worker, which serves the old app from cache. Browsers check this file for updates,
// find this one, and it: drops the old app's cached copy, unregisters itself, and moves any
// open window to MooHao (keeping the room code).
// Only nearby-v* caches are touched: MooHao (same site, /moohao/) uses moohao-v* and shares
// the nearby-share / nearby-fonts caches.
const NEW_HOME = 'https://devgreenpink.github.io/moohao/'

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith('nearby-v')) await caches.delete(key)
    }
    await self.registration.unregister()
    for (const client of await self.clients.matchAll({type: 'window'})) {
      client.navigate(NEW_HOME + new URL(client.url).hash).catch(() => {})
    }
  })())
})

// Until it's gone, never serve anything from cache.
self.addEventListener('fetch', () => {})
