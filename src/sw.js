/// <reference lib="webworker" />
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { NavigationRoute, registerRoute } from 'workbox-routing'

// self.__WB_MANIFEST is the default injection point
precacheAndRoute(self.__WB_MANIFEST)

// clean old assets
cleanupOutdatedCaches()

/** @type {RegExp[] | undefined} */
let allowlist
// in dev mode, we disable precaching to avoid caching issues
if (import.meta.env.DEV)
  allowlist = [/^\/$/]

// to allow work offline
registerRoute(new NavigationRoute(
  createHandlerBoundToURL('index.html'),
  { allowlist },
))

self.skipWaiting()
clientsClaim()


// Handle background sync for POST requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-post-requests') {
    event.waitUntil(syncPostRequests());
  }
});

async function syncPostRequests() {
  const requests = await getAllRequests(); // Fetch all stored requests from IndexedDB

  for (const request of requests) {
    try {
      await fetch(request.url, {
        method: request.method,
        headers: request.headers,
        body: JSON.stringify(request.body),
      });
      // Clear the request from IndexedDB after successful sync
      await clearRequest(request.id);
    } catch (error) {
      console.error('Failed to sync request:', error);
      // If syncing fails, it will retry the next time the user is online
      return;
    }
  }
}

// IndexedDB utility functions (you need to implement or import the