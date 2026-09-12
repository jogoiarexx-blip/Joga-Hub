const SHELL = 'jogahub-1.2.15';
const CONTENT = 'jogahub-1.2.15-content';
const SHELL_FILES = [
  './', './index.html', './instalar.html', './css/style.css?v=143', './js/data-jogos.js?v=40',
  './js/data-links.js?v=45', './js/data-filmes.js?v=132', './js/imdb-ratings.js?v=1', './js/data-tv.js?v=124', './js/offline-assets.js?v=40', './js/app.js?v=143',
  './link-player.html', './install-game.html', './assets/favicon.png', './assets/logo.png', './assets/banner-games.webp', './assets/banner-breaking-bad.webp', './assets/banner-cat-jogos.webp', './assets/banner-cat-filmes.webp', './assets/banner-cat-series.webp', './assets/banner-cat-animes.webp', './assets/banner-cat-tv.webp', './assets/banner-cat-emuladores.webp', './assets/thumb-neo-nes.webp', './assets/banner-cat-radios.webp', './assets/serie-breaking-bad-s1.webp', './assets/hero-breaking-bad-s1.webp',
  './assets/thumb-jogos-destaque.webp', './assets/thumb-breakout-evolution.webp', './assets/hero-breakout-evolution.webp', './assets/thumb-dead-end-survival.webp', './assets/hero-dead-end-survival.webp', './assets/thumb-maze-hunter-core-shift.webp', './assets/hero-maze-hunter-core-shift.webp', './assets/thumb-navinha-arcade.webp', './assets/hero-navinha-arcade.webp', './assets/thumb-trilha-da-floresta.webp', './assets/hero-trilha-da-floresta.webp', './assets/thumb-pixel-frontier.webp', './assets/hero-pixel-frontier.webp', './assets/thumb-kart-racer.webp', './assets/hero-kart-racer.webp', './assets/thumb-bomber-blast.webp', './assets/hero-bomber-blast.webp', './assets/thumb-crash-fan-game.webp', './assets/hero-crash-fan-game.webp', './assets/thumb-joao-crist.webp', './assets/hero-joao-crist.webp', './assets/thumb-zeco-lendas-da-ilha.webp', './assets/hero-zeco-lendas-da-ilha.webp', './assets/thumb-ruptura.webp', './assets/hero-ruptura.webp', './assets/serie-stranger-things-historias-85.webp', './assets/hero-stranger-things-historias-85.webp', './assets/serie-o-pinguim.webp', './assets/hero-o-pinguim.webp', './assets/serie-irmaos-piologo-oficial.webp', './assets/hero-irmaos-piologo-oficial.webp', './assets/serie-irmaos-piologo-games.webp', './assets/hero-irmaos-piologo-games.webp', './assets/serie-irmaos-piologo-reacoes.webp', './assets/hero-irmaos-piologo-reacoes.webp', './assets/serie-irmaos-piologo-cortes.webp', './assets/hero-irmaos-piologo-cortes.webp', './assets/serie-irmaos-piologo-mundo-canibal.webp', './assets/hero-irmaos-piologo-mundo-canibal.webp', './assets/apple-touch-icon-180.png', './assets/icon-maskable-512.png', './assets/icon-192.png', './assets/icon-512.png', './manifest.webmanifest?v=141'
];
self.addEventListener('install', event => {
  event.waitUntil((async()=>{
    const cache=await caches.open(SHELL);
    for(const u of SHELL_FILES){ try{ const r=await fetch(u,{cache:'reload'}); if(r.ok) await cache.put(u,r.clone()); }catch(_){} }
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async()=>{
    const names=await caches.keys();
    await Promise.all(names.filter(n=>(n.startsWith('nexora-')||n.startsWith('linkora-')||n.startsWith('jogahub-')) && n!==SHELL && n!==CONTENT && n!=='jogahub-offline-media-v1').map(n=>caches.delete(n)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin) return;
  const isShell = event.request.mode==='navigate' || /\.(?:js|css|webmanifest)$/.test(url.pathname);
  if(isShell){
    event.respondWith((async()=>{
      try{
        const fresh=await fetch(event.request,{cache:'no-store'});
        if(fresh.ok){ const c=await caches.open(SHELL); c.put(event.request,fresh.clone()); }
        return fresh;
      }catch(_){ return (await caches.match(event.request)) || (event.request.mode==='navigate' ? await caches.match('./index.html') : Response.error()); }
    })());
    return;
  }
  event.respondWith((async()=>{
    const hit=await caches.match(event.request); if(hit) return hit;
    try{ const r=await fetch(event.request); if(r.ok){const c=await caches.open(SHELL); c.put(event.request,r.clone());} return r; }catch(_){return Response.error();}
  })());
});
self.addEventListener('message', event => {
  const d=event.data||{};
  if(d.type==='DOWNLOAD') event.waitUntil((async()=>{try{const c=await caches.open(CONTENT);let done=0;for(const rel of d.urls||[]){const abs=new URL(rel,self.registration.scope).href;const req=new Request(abs,{credentials:'same-origin'});if(!(await c.match(req))){const r=await fetch(req,{cache:'no-store'});if(!r.ok)throw new Error(r.status);await c.put(req,r.clone());}done++;if(done%8===0||done===d.urls.length)event.source?.postMessage({type:'PROGRESS',id:d.id,done,total:d.urls.length});}event.source?.postMessage({type:'DOWNLOADED',id:d.id});}catch(e){event.source?.postMessage({type:'DOWNLOAD_ERROR',id:d.id,error:String(e)});}})());
  if(d.type==='REMOVE') event.waitUntil((async()=>{const c=await caches.open(CONTENT);for(const rel of d.urls||[])await c.delete(new URL(rel,self.registration.scope).href);event.source?.postMessage({type:'REMOVED',id:d.id});})());
});
