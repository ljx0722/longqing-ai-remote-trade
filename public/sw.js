/* Local offline shell only. No external requests, save data, or API responses are cached. */
const CACHE_PREFIX = 'remote-trade-shell-';
const CACHE_NAME = `${CACHE_PREFIX}v5-relief-world`;
const MAX_ENTRIES = 72;
const MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
const MAX_CACHE_BYTES = 32 * 1024 * 1024;
const APP_ROOT = new URL('./', self.location.href);
const SHELL = ['', 'index.html', 'manifest.webmanifest', 'icons/compass.svg', 'data/land.geojson', 'data/elevation.bin'].map(path => new URL(path, APP_ROOT).href);

async function trim(cache) {
  const keys = await cache.keys();
  const entries = await Promise.all(keys.map(async request => {
    const response = await cache.match(request);
    return { request, bytes: Number(response?.headers.get('content-length')) || 0 };
  }));
  let total = entries.reduce((sum, entry) => sum + entry.bytes, 0);
  let count = entries.length;
  for (const entry of entries) {
    if (total <= MAX_CACHE_BYTES && count <= MAX_ENTRIES) break;
    if (SHELL.includes(entry.request.url)) continue;
    await cache.delete(entry.request);
    total -= entry.bytes;
    count--;
  }
}

async function remember(request, response) {
  if (!response.ok || response.type === 'opaque') return;
  const sizeHeader = Number(response.headers.get('content-length'));
  if (sizeHeader > MAX_RESPONSE_BYTES) return;
  const copy = response.clone();
  // Check decoded bytes too, since content-length can describe compressed content.
  const bytes = await copy.arrayBuffer();
  if (bytes.byteLength > MAX_RESPONSE_BYTES) return;
  const cache = await caches.open(CACHE_NAME);
  const headers = new Headers(response.headers);
  headers.delete('content-encoding');
  headers.set('content-length', String(bytes.byteLength));
  await cache.put(request, new Response(bytes, { status: response.status, statusText: response.statusText, headers }));
  await trim(cache);
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(SHELL);
    const shell = await cache.match(new URL('index.html', APP_ROOT).href);
    const html = await shell.text();
    const assetURLs = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)]
      .map(match => new URL(match[1], APP_ROOT))
      .filter(url => url.origin === APP_ROOT.origin && url.pathname.startsWith(`${APP_ROOT.pathname}assets/`) && /\.(js|css)$/.test(url.pathname));
    const visited = new Set();
    const cacheModule = async url => {
      if (visited.has(url.href) || visited.size >= MAX_ENTRIES - SHELL.length) return;
      visited.add(url.href);
      const response = await fetch(url.href);
      if (!response.ok) throw new Error(`Unable to cache ${url.pathname}`);
      const source = await response.clone().text();
      await remember(new Request(url.href), response);
      if (!url.pathname.endsWith('.js')) return;
      // Include Vite's modulepreloads and lazy chunks on the first visit, before control.
      const dependencies = [...source.matchAll(/["']((?:\.{1,2}\/|\/|assets\/)[^"'\s]+\.(?:js|css))["']/g)]
        .map(match => new URL(match[1], match[1].startsWith('assets/') ? APP_ROOT : url))
        .filter(child => child.origin === APP_ROOT.origin && child.pathname.startsWith(`${APP_ROOT.pathname}assets/`));
      await Promise.all(dependencies.map(cacheModule));
    };
    await Promise.all(assetURLs.map(cacheModule));
    // Let an existing game finish naturally; activation happens on its next close/reopen.
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) {
      if (name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME) await caches.delete(name);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== APP_ROOT.origin || !url.pathname.startsWith(APP_ROOT.pathname)) return;
  const isNavigation = request.mode === 'navigate';
  const isAsset = /\.(?:js|css|svg|png|jpg|jpeg|webp|woff2|glb|webmanifest|geojson)$/.test(url.pathname);
  if (!isNavigation && !isAsset) return;
  if (url.search) return;

  event.respondWith((async () => {
    const cached = await caches.match(request);
    // Built assets have immutable names. Navigation checks for updates while online.
    if (cached && !isNavigation) return cached;
    try {
      const response = await fetch(request);
      if (response.ok) event.waitUntil(remember(request, response).catch(() => undefined));
      return response;
    } catch {
      if (cached) return cached;
      if (isNavigation) {
        const shell = await caches.match(new URL('index.html', APP_ROOT).href);
        if (shell) return shell;
      }
      return new Response('离线资源尚未缓存，请联网打开一次游戏。', { status: 503, headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
    }
  })());
});
