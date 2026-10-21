import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';

const w={};
vm.runInNewContext(await readFile('js/player-drive-reconnect.js','utf8'),{window:w});
const gate=w.JOGAHUB_PLAYER_DRIVE_RECONNECT.makeGate();

test('reconexão consome cada solicitação só uma vez',()=>{
  gate.clear();
  assert.equal(gate.status().armed,false);
  assert.equal(gate.arm('loading'),true);
  assert.equal(gate.status().pending,'loading');
  assert.equal(gate.take(),'loading');
  assert.equal(gate.take(),null);
  assert.equal(gate.status().armed,false);
});

test('falha de carregamento tem prioridade sobre recuperação de reprodução',()=>{
  gate.clear();
  gate.arm('playback');
  gate.arm('loading');
  gate.arm('playback');
  assert.equal(gate.take(),'loading');
});

test('cancelamento por modo compatível limpa tentativa pendente',()=>{
  gate.clear();
  gate.arm('playback');
  const epoch=gate.status().epoch;
  gate.clear();
  assert.equal(gate.take(),null);
  assert.ok(gate.status().epoch>epoch);
});

test('tipo inválido não registra reconexão',()=>{
  gate.clear();
  assert.equal(gate.arm('codec'),false);
  assert.equal(gate.arm(''),false);
  assert.equal(gate.status().pending,null);
});

test('ordem de carregamento do HTML e versões PWA incluem reconexão',async()=>{
  const html=await readFile('link-player.html','utf8');
  const sw=await readFile('sw.js','utf8');
  const app=await readFile('js/player-app.js','utf8');
  assert.ok(html.includes('js/player-drive-reconnect.js?v=1'));
  assert.ok(html.indexOf('js/player-drive-reconnect.js?v=1')<html.indexOf('js/player-app.js?v=6'));
  assert.ok(sw.includes('js/player-drive-reconnect.js?v=1'));
  assert.ok(sw.includes('js/player-app.js?v=6'));
  assert.ok(app.includes("window.addEventListener('offline'"));
  assert.ok(app.includes("window.addEventListener('online'"));
});
