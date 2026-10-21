import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';

function harness({responseFactory,storageFails=false}={}){
  const storage=new Map(),blobs=new Map(),events=[];
  const store={
    getItem:k=>storage.get(k)||null,
    setItem(k,v){if(storageFails)throw Error('quota exceeded');storage.set(k,String(v))},
    removeItem:k=>storage.delete(k)
  };
  const cache={
    async put(key,response){const body=new Uint8Array(await response.arrayBuffer());blobs.set(key,body)},
    async match(key){const body=blobs.get(key);return body?new Response(body):undefined},
    async delete(key){return blobs.delete(key)}
  };
  const fetcher=responseFactory|| (async()=>{
    const bytes=new Uint8Array([1,2,3,4,5,6]);
    return new Response(bytes,{status:200,headers:{'content-type':'video/mp4','content-length':'6'}});
  });
  const root={TransformStream,localStorage:store,caches:{open:async()=>cache},fetch:fetcher};
  return {root,events,storage,blobs,cache,store,fetcher};
}
const source=await readFile('js/player-offline-manager.js','utf8');
function manager(h){vm.runInNewContext(source,{window:h.root,URL,AbortController,DOMException,Headers,Response,Date,Object});return h.root.JOGAHUB_PLAYER_OFFLINE.createManager()}
const url='https://drive.usercontent.google.com/download?id=qa-video&export=download';
const key='qa-offline-test';

test('download completo grava bytes e registro apenas após consumir o fluxo',async()=>{
  const h=harness(),m=manager(h);
  const snapshots=[];
  const saved=await m.download({key,url,meta:{title:'Filme QA',mime:'video/mp4'},onProgress:p=>snapshots.push(p)});
  assert.equal(saved.size,6);
  assert.equal(saved.title,'Filme QA');
  assert.equal(m.isBusy(),false);
  assert.deepEqual(Array.from(h.blobs.get(url)),[1,2,3,4,5,6]);
  assert.ok(snapshots.some(p=>p.done===6&&p.percent===100));
  assert.equal(m.registry()[key].url,url);
  assert.equal(await m.remove(key),true);
  assert.equal(h.blobs.has(url),false);
  assert.equal(m.registry()[key],undefined);
});

test('resposta parcial HTTP 206 é rejeitada sem criar registro',async()=>{
  const h=harness({responseFactory:async()=>new Response(new Uint8Array([1,2]),
    {status:206,headers:{'content-range':'bytes 0-1/100000','content-type':'video/mp4'}})});
  const m=manager(h);
  await assert.rejects(m.download({key,url}),/completo/);
  assert.equal(h.blobs.size,0);
  assert.equal(Object.keys(m.registry()).length,0);
});

test('corpo truncado não é registrado, mesmo com status HTTP 200',async()=>{
  const h=harness({responseFactory:async()=>new Response(new Uint8Array([1,2,3]),
    {status:200,headers:{'content-length':'6','content-type':'video/mp4'}})});
  const m=manager(h);
  await assert.rejects(m.download({key,url}),/incompleto/);
  assert.equal(h.blobs.has(url),false);
  assert.equal(m.registry()[key],undefined);
});

test('falha de localStorage após cache.put remove mídia órfã',async()=>{
  const h=harness({storageFails:true}),m=manager(h);
  await assert.rejects(m.download({key,url}),/quota exceeded/);
  assert.equal(h.blobs.has(url),false);
  assert.equal(m.isBusy(),false);
});

test('cancelamento aborta fluxo e evita mídia parcial',async()=>{
  let release=null;
  const h=harness({responseFactory:async()=>new Response(new ReadableStream({
    start(c){c.enqueue(new Uint8Array([1,2]));},
    async pull(c){await new Promise(resolve=>{release=resolve});c.enqueue(new Uint8Array([3]));c.close()}
  }),{status:200,headers:{'content-type':'video/mp4'}})});
  const m=manager(h);
  let first=null;
  const start=m.download({key,url,onProgress:p=>{
    if(!first&&p.done===2){first=p;m.cancel();if(release)release()}
  }});
  await assert.rejects(start,error=>error?.name==='AbortError');
  assert.equal(m.isBusy(),false);
  assert.equal(h.blobs.has(url),false);
  assert.equal(m.registry()[key],undefined);
});

test('nunca baixar duas mídias simultaneamente no mesmo controlador',async()=>{
  let release;
  const h=harness({responseFactory:async()=>new Promise(resolve=>release=resolve)}),m=manager(h);
  const pending=m.download({key,url});
  await assert.rejects(m.download({key:'qa-other',url}),/andamento/);
  m.cancel();
  release(new Response(new Uint8Array([1]),{status:200}));
  await assert.rejects(pending,error=>error?.name==='AbortError');
});

test('validar IDs e URLs antes de acessar rede, rejeitar chaves perigosas',async()=>{
  const h=harness(),m=manager(h);
  await assert.rejects(m.download({key:'__proto__',url}),/inválido/);
  await assert.rejects(m.download({key,url:'http://example.com/video.mp4'}),/inválido/);
  await assert.rejects(m.download({key,url:'javascript:alert(1)'}),/inválido/);
  assert.equal(h.blobs.size,0);
});
