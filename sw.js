const SHELL = 'jogahub-1.2.49';
const CONTENT = 'jogahub-1.2.49-content';

// Apenas a estrutura essencial entra no pré-cache. Capas e banners são
// armazenados sob demanda, evitando um download inicial de quase 9 MB.
const SHELL_FILES = [
  './',
  './index.html',
  './instalar.html',
  './link-player.html',
  './install-game.html',
  './manifest.webmanifest?v=142',
  './css/style.css?v=147',
  './css/hud-pro.css?v=125',
  './css/sidebar-upgrade.css?v=128',
  './css/responsive-layout.css?v=131',
  './css/header-upgrade.css?v=131',
  './css/player6.css?v=60',
  './js/data-jogos.js?v=40',
  './js/data-links.js?v=48',
  './js/data-arcana.js?v=3',
  './js/data-filmes.js?v=132',
  './js/data-drive-filmes.js?v=7',
  './js/drive-snapshot.js?v=1',
  './js/drive-sync.js?v=11',
  './js/site-upgrades.js?v=5',
  './js/imdb-ratings.js?v=2',
  './js/data-tv.js?v=125',
  './js/offline-assets.js?v=40',
  './js/app.js?v=154',
  './js/launcher-upgrade.js?v=127',
  './js/sidebar-upgrade.js?v=128',
  './js/responsive-layout.js?v=131',
  './js/header-upgrade.js?v=131',
  './assets/favicon.png',
  './assets/logo.webp',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil((async()=>{
    const cache=await caches.open(SHELL);
    await Promise.all(SHELL_FILES.map(async url=>{
      try{
        const response=await fetch(url,{cache:'reload'});
        if(response.ok) await cache.put(url,response);
      }catch(_){ /* Um recurso opcional não deve impedir a instalação. */ }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async()=>{
    const names=await caches.keys();
    await Promise.all(names
      .filter(name=>(name.startsWith('nexora-')||name.startsWith('linkora-')||name.startsWith('jogahub-')) && name!==SHELL && name!==CONTENT && name!=='jogahub-offline-media-v1')
      .map(name=>caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin) return;

  const isNavigation=event.request.mode==='navigate';
  const isVersionedCode=/\.(?:js|css|webmanifest)$/.test(url.pathname);
  if(isNavigation||isVersionedCode){
    event.respondWith((async()=>{
      try{
        const fresh=await fetch(event.request,{cache:'no-store'});
        if(fresh.ok){const cache=await caches.open(SHELL);await cache.put(event.request,fresh.clone());}
        return fresh;
      }catch(_){
        return (await caches.match(event.request)) || (isNavigation ? await caches.match('./index.html') : Response.error());
      }
    })());
    return;
  }

  // Imagens e fontes usam cache-first e passam a ficar offline depois do uso.
  if(/\.(?:webp|png|svg|woff2?|ttf|otf)$/.test(url.pathname)){
    event.respondWith((async()=>{
      const cached=await caches.match(event.request);
      if(cached) return cached;
      try{
        const fresh=await fetch(event.request);
        if(fresh.ok){const cache=await caches.open(SHELL);await cache.put(event.request,fresh.clone());}
        return fresh;
      }catch(_){return Response.error();}
    })());
  }
});

self.addEventListener('message', event => {
  const data=event.data||{};
  if(data.type==='DOWNLOAD') event.waitUntil((async()=>{
    try{
      const cache=await caches.open(CONTENT);let done=0;
      for(const relativeUrl of data.urls||[]){
        const absoluteUrl=new URL(relativeUrl,self.registration.scope).href;
        const request=new Request(absoluteUrl,{credentials:'same-origin'});
        if(!(await cache.match(request))){
          const response=await fetch(request,{cache:'no-store'});
          if(!response.ok) throw new Error(response.status);
          await cache.put(request,response.clone());
        }
        done++;
        if(done%8===0||done===data.urls.length) event.source?.postMessage({type:'PROGRESS',id:data.id,done,total:data.urls.length});
      }
      event.source?.postMessage({type:'DOWNLOADED',id:data.id});
    }catch(error){event.source?.postMessage({type:'DOWNLOAD_ERROR',id:data.id,error:String(error)});}
  })());
  if(data.type==='REMOVE') event.waitUntil((async()=>{
    const cache=await caches.open(CONTENT);
    for(const relativeUrl of data.urls||[]) await cache.delete(new URL(relativeUrl,self.registration.scope).href);
    event.source?.postMessage({type:'REMOVED',id:data.id});
  })());
});
