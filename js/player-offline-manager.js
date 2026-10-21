/* JogaHub — downloads offline em streaming, separados do controlador do player.
 * Acesso somente após ação explícita do usuário; não modifica arquivos do Drive.
 */
(function(root){
  'use strict';
  const CACHE_NAME='jogahub-offline-media-v1';
  const REGISTRY_KEY='jogahub.offline.media.registry';
  const MAX_ID=240;
  function validKey(key){return typeof key==='string'&&key.length>0&&key.length<=MAX_ID&&key!=='__proto__'&&key!=='constructor'&&key!=='prototype'}
  function validUrl(value){
    try{const u=new URL(String(value));return u.protocol==='https:'&&!!u.hostname}catch{return false}
  }
  function createManager({storage=root.localStorage,cacheApi=root.caches,fetcher=root.fetch?.bind(root)}={}){
    let current=null;
    function registry(){
      try{
        const parsed=JSON.parse(storage.getItem(REGISTRY_KEY)||'{}');
        return parsed&&typeof parsed==='object'&&!Array.isArray(parsed)?Object.assign(Object.create(null),parsed):Object.create(null);
      }catch{return Object.create(null)}
    }
    function write(value){storage.setItem(REGISTRY_KEY,JSON.stringify(value))}
    function isBusy(){return current!==null}
    function cancel(){if(current){current.controller.abort();return true}return false}
    async function remove(key){
      if(!validKey(key))return false;
      const entries=registry(),saved=Object.hasOwn(entries,key)?entries[key]:null;
      if(!saved?.url)return false;
      if(!cacheApi?.open)throw new Error('Armazenamento offline indisponível');
      const cache=await cacheApi.open(CACHE_NAME);
      await cache.delete(saved.url);
      delete entries[key];
      write(entries);
      return true;
    }
    async function download({key,url,meta={},onProgress=()=>{}}={}){
      if(current)throw new Error('Já existe um download em andamento');
      if(!validKey(key)||!validUrl(url))throw new Error('Arquivo de download inválido');
      if(!cacheApi?.open||!fetcher||!root.TransformStream)throw new Error('Download offline indisponível');
      const controller=new AbortController();
      current={controller,key};
      let cache=null,startedPut=false,complete=false;
      try{
        cache=await cacheApi.open(CACHE_NAME);
        if(controller.signal.aborted)throw new DOMException('Cancelado','AbortError');
        const response=await fetcher(url,{mode:'cors',signal:controller.signal,cache:'no-store'});
        // Guardar apenas respostas completas, não os bytes de um Range aleatório.
        if(response.status!==200||!response.ok||!response.body)
          throw new Error('O servidor não forneceu vídeo completo para download');
        const totalRaw=Number(response.headers.get('content-length'));
        const total=Number.isSafeInteger(totalRaw)&&totalRaw>0?totalRaw:0;
        let downloaded=0;
        const stream=response.body.pipeThrough(new root.TransformStream({
          transform(chunk,streamController){
            if(controller.signal.aborted)throw new DOMException('Cancelado','AbortError');
            downloaded+=chunk.byteLength;
            if(total&&downloaded>total)throw new Error('Download maior que o declarado pela origem');
            try{onProgress({done:downloaded,total,percent:total?Math.min(100,Math.floor(downloaded/total*100)):null})}catch{}
            streamController.enqueue(chunk);
          }
        }),{signal:controller.signal});
        // Cache API consome o stream; nenhum tee() com ramificação ilimitada.
        // Não persista no registro antes de receber todo o corpo.
        const headers=new Headers(response.headers);
        headers.delete('content-range');
        headers.set('content-type',headers.get('content-type')||meta.mime||'video/mp4');
        startedPut=true;
        await cache.put(url,new Response(stream,{status:200,headers}));
        if(controller.signal.aborted)throw new DOMException('Cancelado','AbortError');
        if(downloaded<=0||(total&&downloaded!==total))throw new Error('Download incompleto');
        const entries=registry();
        const record={
          id:key,title:String(meta.title||'Vídeo offline'),year:String(meta.year||''),
          genre:String(meta.genre||''),thumb:String(meta.thumb||''),
          url,size:downloaded,mime:String(meta.mime||headers.get('content-type')||'video/mp4'),
          savedAt:Date.now(),archiveId:String(meta.archiveId||''),
          playerHref:String(meta.playerHref||'')
        };
        entries[key]=record;
        write(entries);
        complete=true;
        return record;
      }finally{
        if(!complete&&startedPut&&cache){
          try{await cache.delete(url)}catch{}
        }
        if(current?.controller===controller)current=null;
      }
    }
    return Object.freeze({registry,remove,download,cancel,isBusy});
  }
  root.JOGAHUB_PLAYER_OFFLINE=Object.freeze({
    createManager,CACHE_NAME,REGISTRY_KEY,validKey,validUrl
  });
})(window);
