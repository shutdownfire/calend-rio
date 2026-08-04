// Este arquivo PRECISA se chamar exatamente "OneSignalSDKWorker.js"
// e ficar na RAIZ do site (mesma pasta do index.html).
// A OneSignal procura esse nome automaticamente para registrar o push.

// 1. Importa o Service Worker oficial da OneSignal (necessário para push funcionar)
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

// 2. Lógica de cache/offline do site (a mesma que já existia, agora num arquivo real
//    em vez de um Blob, para não conflitar com o worker da OneSignal)
const CACHE_NAME = 'vovo-maria-conga-v1';
self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => { self.clients.claim(); });
self.addEventListener('fetch', (e) => {
    if (e.request.method !== 'GET') return;
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
