import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const storeData=new Map();
const storage={
  getItem:key=>storeData.get(key)||null,
  setItem:(key,value)=>storeData.set(key,value),
  removeItem:key=>storeData.delete(key)
};
const root={localStorage:storage,dispatchEvent(){}};
vm.runInNewContext(await readFile('js/drive-health-core.js','utf8'),{window:root,Event}, {filename:'drive-health-core.js'});
const api=root.JOGAHUB_DRIVE_HEALTH;
let clock=1_700_000_000_000;
const fresh=()=>{storeData.clear();return api.createStore(storage,()=>clock)};

test('falha HTTP fica no aparelho sem salvar título, URL, token ou chave',()=>{
  const s=fresh();
  assert.equal(s.recordFailure('arquivo-101','access',403),true);
  const serialized=storeData.get(api.KEY);
  assert.equal(serialized.includes('https://'),false);
  assert.equal(serialized.includes('resourcekey'),false);
  assert.deepEqual(Array.from(Object.keys(JSON.parse(serialized)[0])).sort(),
    ['code','failures','fileId','state','status','updatedAt'].sort());
  assert.equal(s.read()[0].status,403);
});

test('sucesso posterior substitui falha; iframe não representa reprodução comprovada',()=>{
  const s=fresh();
  s.recordFailure('video-1','network');
  s.recordSuccess('video-1');
  assert.equal(s.read()[0].state,'direct');
  assert.equal(s.read()[0].code,'');
  s.recordCompatible('video-2','codec');
  const row=s.read().find(item=>item.fileId==='video-2');
  assert.equal(row.state,'compatible');
  assert.equal(row.code,'codec');
  const summary=s.summarize([{driveFileId:'video-1'},{driveFileId:'video-2'},{driveFileId:'video-3'}]);
  assert.deepEqual([summary.total,summary.failed,summary.compatible,summary.direct,summary.untested],[3,0,1,1,1]);
});

test('falhas repetidas incrementam contador sem duplicar registros',()=>{
  const s=fresh();
  s.recordFailure('dup','timeout');
  s.recordFailure('dup','access',401);
  assert.equal(s.read().length,1);
  assert.equal(s.read()[0].failures,2);
  assert.equal(s.read()[0].code,'access');
  s.remove('dup');
  assert.equal(s.read().length,0);
});

test('IDs, URLs, chaves e estados ilegítimos nunca são persistidos',()=>{
  const s=fresh();
  assert.equal(s.recordFailure('https://drive.google.com/a?resourcekey=secret','access'),false);
  assert.equal(s.recordFailure('../file','access'),false);
  assert.equal(s.recordFailure('','access'),false);
  assert.equal(s.read().length,0);
  s.recordFailure('ok-12','unknown',9999);
  assert.equal(s.read()[0].status,0);
});

test('capacidade limitada e registros expirados automaticamente',()=>{
  const s=fresh();
  for(let i=0;i<175;i++)s.recordFailure('id-'+i,'network');
  assert.equal(s.read().length,120);
  clock+=46*24*60*60*1000;
  assert.equal(s.read().length,0);
});

test('histórico legado malformado não quebra o painel',()=>{
  storeData.set(api.KEY,'{broken');
  assert.equal(api.createStore(storage,()=>clock).read().length,0);
  storeData.set(api.KEY,JSON.stringify([{fileId:'bad',state:'failed',code:'access',updatedAt:clock+1}]));
  assert.equal(api.createStore(storage,()=>clock).read().length,0);
});

test('limpar histórico não altera chaves de progresso nem permissões',()=>{
  const s=fresh();
  storage.setItem('jogahub.movie.progress.video-1','{"time":250}');
  storage.setItem('jogahub.drive.mode.serie-1','compat');
  s.recordFailure('video-1','missing',404);
  s.clear();
  assert.equal(s.read().length,0);
  assert.equal(storage.getItem('jogahub.movie.progress.video-1'),'{"time":250}');
  assert.equal(storage.getItem('jogahub.drive.mode.serie-1'),'compat');
});
