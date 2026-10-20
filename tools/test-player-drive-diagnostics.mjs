import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const w={};
vm.runInNewContext(await readFile('js/player-drive-diagnostics.js','utf8'),{window:w,AbortController,Date,setTimeout,clearTimeout});
const diagnostic=w.JOGAHUB_DRIVE_DIAGNOSTICS;

test('403/401 revelados pelo HEAD são acesso restrito; 404 é arquivo ausente',()=>{
  assert.equal(diagnostic.classify({status:403,mediaCode:4}),'access');
  assert.equal(diagnostic.classify({status:401}),'access');
  assert.equal(diagnostic.classify({status:404}),'missing');
  assert.equal(diagnostic.classify({status:410}),'missing');
});
test('limite de Drive, offline e falhas de rede não são confundidos',()=>{
  assert.equal(diagnostic.classify({status:429}),'limited');
  assert.equal(diagnostic.classify({status:503}),'limited');
  assert.equal(diagnostic.classify({online:false,mediaCode:4}),'offline');
  assert.equal(diagnostic.classify({mediaCode:2}),'network');
  assert.equal(diagnostic.classify({timedOut:true}),'timeout');
});
test('resposta HTML 200 indica conteúdo não reproduzível, não prova acesso negado',()=>{
  assert.equal(diagnostic.classify({status:200,contentType:'text/html; charset=utf-8',mediaCode:4}),'response');
  assert.equal(diagnostic.classify({status:200,contentType:'application/json',mediaCode:4}),'response');
  assert.equal(diagnostic.classify({mediaCode:4,status:0}),'unknown');
});
test('codec só é declarado quando há prova suficiente',()=>{
  assert.equal(diagnostic.classify({mediaCode:3}),'codec');
  assert.equal(diagnostic.classify({mediaCode:4,status:200,contentType:'video/mp4'}),'codec');
  assert.equal(diagnostic.classify({mediaCode:4,status:403}),'access');
  assert.equal(diagnostic.classify({mediaCode:4}),'unknown');
});
test('não repete rotas para bloqueios definitivos mas permite falhas temporárias',()=>{
  for(const code of ['access','missing','limited','codec','offline'])
    assert.equal(diagnostic.stopTrying(code),true,code);
  for(const code of ['unknown','network','response','timeout'])
    assert.equal(diagnostic.stopTrying(code),false,code);
});
test('cache de falhas tem TTL por causa e não persiste offline/timeout',()=>{
  const now=1500000;
  const mk=(code,age)=>({code,updatedAt:now-age});
  assert.equal(diagnostic.cached(mk('access',1000),now).code,'access');
  assert.equal(diagnostic.cached(mk('access',31*60*1000),now),null);
  assert.equal(diagnostic.cached(mk('limited',6*60*1000),now),null);
  assert.equal(diagnostic.cached(mk('network',1000),now),null);
  assert.equal(diagnostic.cached(mk('unknown',1000),now),null);
  assert.equal(diagnostic.cached({reason:'erro legado',updatedAt:now},now),null);
});
test('HEAD lê status e tipo mas nunca usa GET nem baixa o vídeo',async()=>{
  let method='';
  const result=await diagnostic.probe('https://drive.google.com/uc?id=test',async(url,opts)=>{
    method=opts.method;
    assert.equal(opts.mode,'cors');
    return {status:403,headers:{get:()=> 'text/html; charset=utf-8'}};
  });
  assert.equal(method,'HEAD');
  assert.equal(result.available,true);
  assert.equal(result.status,403);
  assert.equal(diagnostic.classify({status:result.status,contentType:result.contentType}),'access');
});
test('CORS bloqueado não é classificado indevidamente como acesso restrito',async()=>{
  const result=await diagnostic.probe('https://drive.google.com/uc?id=x',async()=>{throw new TypeError('Failed to fetch')});
  assert.equal(result.available,false);
  assert.equal(result.status,0);
  assert.equal(diagnostic.classify({status:result.status,mediaCode:4}),'unknown');
});
test('pula somente contêineres declaradamente incompatíveis; MP4 genérico é tentado',()=>{
  const video={canPlayType:()=>''};
  assert.equal(diagnostic.directCapability(video,'video/webm'),false);
  assert.equal(diagnostic.directCapability(video,'video/ogg'),false);
  assert.equal(diagnostic.directCapability(video,'video/mp4'),true);
  assert.equal(diagnostic.directCapability(null,'video/webm'),true);
});
