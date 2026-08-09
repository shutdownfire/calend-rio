// Este arquivo PRECISA se chamar exatamente "OneSignalSDKWorker.js"
// e ficar na RAIZ do site (mesma pasta do index.html).
// A OneSignal procura esse nome automaticamente para registrar o push.

// 1. Importa o Service Worker oficial da OneSignal (necessário para push funcionar)
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

// 2. Lógica de cache/offline do site (a mesma que já existia, agora num arquivo real
//    em vez de um Blob, para não conflitar com o worker da OneSignal)
//    AUMENTE ESSE NÚMERO SEMPRE QUE PUBLICAR UMA ATUALIZAÇÃO (isso força o navegador
//    a perceber que o worker mudou e trocar pra versão nova sozinho).
const CACHE_NAME = 'vovo-maria-conga-v2';

self.addEventListener('install', (e) => { self.skipWaiting(); });

self.addEventListener('activate', (e) => {
    // Limpa qualquer cache de versões antigas assim que o worker novo assume
    e.waitUntil(
        caches.keys().then((nomes) => Promise.all(
            nomes.filter((nome) => nome !== CACHE_NAME).map((nome) => caches.delete(nome))
        )).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (e) => {
    if (e.request.method !== 'GET') return;

    // A página principal (index.html / navegação) NUNCA deve vir do cache do navegador.
    // Sempre busca a versão mais nova na rede, e só usa o cache como último recurso
    // se o celular estiver sem internet.
    var ehPaginaPrincipal = e.request.mode === 'navigate' || e.request.url.indexOf('index.html') !== -1;
    if (ehPaginaPrincipal) {
        e.respondWith(
            fetch(e.request, { cache: 'reload' })
                .catch(() => caches.match(e.request))
        );
        return;
    }

    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
