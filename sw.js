const SHELL = 'jogahub-1.3.15-shell';
const CONTENT = 'jogahub-1.3.2-content';
const MEDIA = 'jogahub-offline-media-v1';

function isObsoleteHubCache(name){
  if(name.startsWith('nexora-') || name.startsWith('linkora-')) return true;
  // O cache compartilhado dos apps em /apps/ deve ser preservado.
  return /^jogahub-1\.\d+\.\d+(?:-.+)?$/.test(name) && name!==SHELL && name!==CONTENT && name!==MEDIA;
}

// Apenas a estrutura essencial entra no pré-cache. Capas e banners são
// armazenados sob demanda, evitando um download inicial de quase 9 MB.
const SHELL_FILES = [
  './index.html',
  './link-player.html',
  './manifest.webmanifest?v=142',
  './css/style.css?v=148',
  './css/hud-pro.css?v=125',
  './css/sidebar-upgrade.css?v=129',
  './css/responsive-layout.css?v=131',
  './css/header-upgrade.css?v=131',
  './css/player6.css?v=60',
  './css/core-upgrades.css?v=132',
  './css/tv-catalog.css?v=144',
  './js/data-jogos.js?v=40',
  './js/data-links.js?v=48',
  './js/data-arcana.js?v=3',
  './js/data-filmes.js?v=137',
  './js/data-drive-filmes.js?v=7',
  './js/drive-snapshot.js?v=4',
  './js/drive-sync.js?v=15',
  './js/site-upgrades.js?v=5',
  './js/imdb-ratings.js?v=2',
  './js/data-tv.js?v=144',
  './js/offline-assets.js?v=40',
  './js/app.js?v=145',
  './js/tv-catalog.js?v=144',
  './js/launcher-upgrade.js?v=145',
  './js/sidebar-upgrade.js?v=129',
  './js/responsive-layout.js?v=131',
  './js/header-upgrade.js?v=131',
  './js/core-upgrades.js?v=132',
  './assets/favicon.png',
  './assets/logo.webp',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil((async()=>{
    const cache=await caches.open(SHELL);
    // Limita as solicitações simultâneas, especialmente em conexões móveis.
    let next=0;
    await Promise.all(Array.from({length:Math.min(4,SHELL_FILES.length)},async()=>{
      while(next<SHELL_FILES.length){
        const url=SHELL_FILES[next++];
        try{const response=await fetch(url,{cache:'reload'});if(response.ok)await cache.put(url,response)}
        catch(_){ /* Falhas isoladas não impedem a instalação. */ }
      }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async()=>{
    const names=await caches.keys();
    await Promise.all(names
      .filter(isObsoleteHubCache)
      .map(name=>caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin) return;

  // Entrega downloads já salvos por um endereço local. O stream evita criar um
  // Blob de vários gigabytes na memória e permite que o vídeo solicite trechos.
  if(url.pathname===new URL('./offline-media',self.registration.scope).pathname){
    event.respondWith((async()=>{
      let sourceUrl;
      try{sourceUrl=new URL(url.searchParams.get('src')||'')}catch{return new Response('Vídeo inválido',{status:400})}
      if(sourceUrl.protocol!=='https:')return new Response('Vídeo inválido',{status:400});
      const saved=await (await caches.open(MEDIA)).match(sourceUrl.href);
      if(!saved)return new Response('Vídeo não encontrado no aparelho',{status:404});
      const size=Number(url.searchParams.get('size'))||Number(saved.headers.get('content-length'))||0;
      const range=event.request.headers.get('range');
      if(!range||!Number.isSafeInteger(size)||size<=0){
        const headers=new Headers({'Content-Type':saved.headers.get('content-type')||'video/mp4'});
        if(Number.isSafeInteger(size)&&size>0){
          headers.set('Content-Length',String(size));headers.set('Accept-Ranges','bytes');
        }
        return new Response(saved.body,{status:200,headers});
      }
      const match=/^bytes=(\d*)-(\d*)$/.exec(range);
      if(!match||(!match[1]&&!match[2]))return new Response(null,{status:416,headers:{'Content-Range':`bytes */${size}`}});
      const start=match[1]?Number(match[1]):Math.max(0,size-Number(match[2]));
      const end=match[1]&&match[2]?Math.min(size-1,Number(match[2])):size-1;
      if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>=size||end<start)
        return new Response(null,{status:416,headers:{'Content-Range':`bytes */${size}`}});
      const reader=saved.body.getReader();let offset=0;
      const stream=new ReadableStream({
        async pull(controller){
          try{
            while(true){
              const {value,done}=await reader.read();
              if(done){controller.close();return}
              const from=Math.max(0,start-offset),to=Math.min(value.byteLength,end-offset+1);
              offset+=value.byteLength;
              if(to>from)controller.enqueue(value.subarray(from,to));
              if(offset>end){controller.close();reader.cancel().catch(()=>{});return}
              if(to>from)return;
            }
          }catch(error){controller.error(error)}
        },
        cancel(){return reader.cancel()}
      });
      const headers=new Headers({
        'Content-Type':saved.headers.get('content-type')||'video/mp4',
        'Accept-Ranges':'bytes','Content-Range':`bytes ${start}-${end}/${size}`,
        'Content-Length':String(end-start+1)
      });
      return new Response(stream,{status:206,headers});
    })());
    return;
  }

  const isNavigation=event.request.mode==='navigate';
  const isVersionedCode=/\.(?:js|css|webmanifest)$/.test(url.pathname);
  if(isNavigation){
    event.respondWith((async()=>{
      const downloaded=await (await caches.open(CONTENT)).match(event.request);
      if(downloaded)return downloaded;
      // Em páginas estáticas, ?id= e ?view= alteram a tela, mas não o HTML.
      const pageKey=new URL(url.pathname,self.location.origin).href;
      const controller=typeof AbortController==='function'?new AbortController():null;
      const timer=controller?setTimeout(()=>controller.abort(),3500):0;
      try{
        const fresh=await fetch(event.request,{cache:'no-store',...(controller?{signal:controller.signal}:{})});
        if(fresh.ok){const cache=await caches.open(SHELL);await cache.put(pageKey,fresh.clone());}
        return fresh;
      }catch(_){
        return (await caches.match(pageKey)) || ((url.pathname===new URL('./',self.registration.scope).pathname)?await caches.match('./index.html'):null) || Response.error();
      }finally{if(timer)clearTimeout(timer)}
    })());
    return;
  }
  if(isVersionedCode){
    event.respondWith((async()=>{
      const controller=typeof AbortController==='function'?new AbortController():null;
      const timer=controller?setTimeout(()=>controller.abort(),4000):0;
      try{
        const fresh=await fetch(event.request,{cache:'no-store',...(controller?{signal:controller.signal}:{})});
        if(fresh.ok){const cache=await caches.open(SHELL);await cache.put(event.request,fresh.clone())}
        return fresh;
      }catch(_){
        return (await caches.match(event.request)) || Response.error();
      }finally{if(timer)clearTimeout(timer)}
    })());
    return;
  }

  // Downloads explícitos precisam ser encontrados também quando o aparelho está offline.
  event.respondWith((async()=>{
    const content=await caches.open(CONTENT);
    const downloaded=await content.match(event.request);
    if(downloaded)return downloaded;
    const isImage=/\.(?:webp|png|svg|woff2?|ttf|otf)$/.test(url.pathname);
    if(isImage){
      const cached=await caches.match(event.request);
      if(cached)return cached;
      try{const fresh=await fetch(event.request);if(fresh.ok){const shell=await caches.open(SHELL);await shell.put(event.request,fresh.clone())}return fresh}catch(_){return Response.error()}
    }
    return fetch(event.request);
  })());
  return;

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
