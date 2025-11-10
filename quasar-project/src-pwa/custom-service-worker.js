/* eslint-env serviceworker */

/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.config file > pwa > workboxMode is set to "InjectManifest"
 */

import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'

self.skipWaiting()
clientsClaim()

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST)

cleanupOutdatedCaches()

// Dentro de src-pwa/custom-service-worker.js

self.addEventListener('push', event => {
  console.log('[Service Worker] Push Recebido.');
  
  // O texto vem do seu backend
  const data = event.data.json(); // Presume que o backend enviou JSON
  const title = data.title || 'Minhas Tarefas';
  const options = {
    body: data.body, // Ex: "A tarefa 'Fazer Trab...' está atrasada."
    icon: 'icons/icon-128x128.png', // Ícone do seu app
    badge: 'icons/badge.png' // Ícone pequeno da barra de status
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Non-SSR fallbacks to index.html
// Production SSR fallbacks to offline.html (except for dev)
if (process.env.MODE !== 'ssr' || process.env.PROD) {
  registerRoute(
    new NavigationRoute(
      createHandlerBoundToURL(process.env.PWA_FALLBACK_HTML),
      { denylist: [new RegExp(process.env.PWA_SERVICE_WORKER_REGEX), /workbox-(.)*\.js$/] }
    )
  )
}
