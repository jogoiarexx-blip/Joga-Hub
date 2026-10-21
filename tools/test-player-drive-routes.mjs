import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';

const window={};
vm.runInNewContext(await readFile('js/player-drive-routes.js','utf8'),{window,URL,Date});
const planner=window.JOGAHUB_PLAYER_DRIVE_ROUTES;
function store(){
  const map=new Map();
  return {getItem:key=>map.get(key)||null,setItem:(key,val)=>map.set(key,val),
    removeItem:key=>map.delete(key),data:map};
}
const key='jogahub.drive.route.qa-video-123',id='qa-video-123';
const now=1900000000000;

test('rotas são calculadas a partir de ID e chave atual, sem confiar em URL antiga',()=>{
  const items=planner.candidates(id,'new.key');
  assert.equal(items.length,2);
  assert.equal(items[0].route,'usercontent');
  assert.equal(items[1].route,'uc');
  assert.equal(new URL(items[0].url).searchParams.get('resourcekey'),'new.key');
  assert.equal(new URL(items[1].url).searchParams.get('resourcekey'),'new.key');
  assert.equal(planner.candidates('../bad','secret').length,0);
});

test('preferência válida prioriza rota conhecida e mantém alternativa como fallback',()=>{
  const storage=store();
  assert.equal(planner.savePreference(storage,key,'uc',1234,now),true);
  const raw=storage.getItem(key);
  assert.ok(!raw.includes('https://'));
  assert.ok(!raw.includes('resourcekey'));
  assert.equal(planner.readPreference(storage,key,now+1000).route,'uc');
  assert.deepEqual(Array.from(planner.candidates(id,'current-key',planner.readPreference(storage,key,now+1000)),x=>x.route),['uc','usercontent']);
});

test('migração apaga URL legada e não mantém parâmetros privados',()=>{
  const storage=store();
  storage.setItem(key,JSON.stringify({
    url:'https://drive.google.com/uc?export=download&id='+id+'&resourcekey=private-key',
    updatedAt:now-10000,elapsed:450
  }));
  const read=planner.readPreference(storage,key,now);
  assert.equal(read.route,'uc');
  assert.equal(read.elapsed,450);
  const saved=storage.getItem(key);
  assert.ok(!saved.includes('private-key'));
  assert.ok(!saved.includes('https://'));
  const plans=planner.candidates(id,'rotated-key',read);
  assert.equal(new URL(plans[0].url).searchParams.get('resourcekey'),'rotated-key');
});

test('entradas inválidas e expiradas são removidas do navegador',()=>{
  const storage=store();
  storage.setItem(key,'{invalid');
  assert.equal(planner.readPreference(storage,key,now),null);
  assert.equal(storage.getItem(key),null);
  storage.setItem(key,JSON.stringify({route:'uc',updatedAt:now-40*86400000}));
  assert.equal(planner.readPreference(storage,key,now),null);
  assert.equal(storage.getItem(key),null);
});

test('nunca aceitar URL de outra origem como preferência armazenada',()=>{
  const storage=store();
  storage.setItem(key,JSON.stringify({url:'https://evil.example/uc?resourcekey=private',updatedAt:now}));
  assert.equal(planner.readPreference(storage,key,now),null);
  assert.equal(storage.getItem(key),null);
});

test('falha no armazenamento não impede reprodução',()=>{
  const broken={getItem:()=>{throw Error('blocked')},setItem:()=>{throw Error('blocked')}};
  assert.equal(planner.readPreference(broken,key,now),null);
  assert.equal(planner.savePreference(broken,key,'usercontent',200,now),false);
  assert.equal(planner.candidates(id).length,2);
});

test('HTML de player carrega CSS, planejador e controlador nesta ordem',async()=>{
  const html=await readFile('link-player.html','utf8');
  const stylesheet=html.indexOf('css/player.css?v=1');
  const plannerIndex=html.indexOf('js/player-drive-routes.js?v=1');
  const controller=html.indexOf('js/player-app.js?v=2');
  assert.ok(stylesheet>=0&&plannerIndex>=0&&controller>plannerIndex);
  assert.ok(!/<style[\s>]/i.test(html));
  assert.ok(!/<script>([\s\S]*?)<\/script>/i.test(html));
  const code=await readFile('js/player-app.js','utf8');
  assert.ok(code.length>30000);
  assert.ok(code.includes('JOGAHUB_PLAYER_DRIVE_ROUTES'));
  const sw=await readFile('sw.js','utf8');
  assert.ok(sw.includes('js/player-drive-routes.js?v=1'));
  assert.ok(sw.includes('js/player-app.js?v=2'));
  assert.ok(sw.includes('css/player.css?v=1'));
});
