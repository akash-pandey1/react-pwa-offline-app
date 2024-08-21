/// <reference lib="webworker" />
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { getAllRequests, saveRequest } from './idb'

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

self.addEventListener('fetch', event => {
  const { request } = event;

  if (request.method === 'POST') {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request.clone());
          return response;
        } catch (error) {
          const clonedRequest = request.clone();
          const body = await clonedRequest.json(); // Assuming JSON body, adapt if needed

          // Save the POST request data in IndexedDB
          await saveRequest({
            url: clonedRequest.url,
            method: clonedRequest.method,
            headers: [...clonedRequest.headers],
            body,
          });

          return new Response(
            JSON.stringify({ success: false, message: 'Request saved offline and will be sent when online.' }),
            { status: 503, headers: { 'Content-Type': 'application/json' } }
          );
        }
      })()
    );
  }
});



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