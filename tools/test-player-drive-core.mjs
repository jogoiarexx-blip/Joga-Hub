import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const window = {};
vm.runInNewContext(await readFile('js/player-drive-core.js','utf8'),{window,Date}, {filename:'js/player-drive-core.js'});
const core=window.JOGAHUB_PLAYER_DRIVE_CORE;

test('formatos não suportados usam modo compatibilidade',()=>{
  for(const name of ['Episode.MKV','Filme.avi','x.wmv','x.FLV','video.mov']){
    assert.equal(core.needsCompatiblePlayer(name,''),true,name);
  }
  assert.equal(core.needsCompatiblePlayer('filme.mp4','video/mp4'),false);
  assert.equal(core.needsCompatiblePlayer('','video/x-matroska'),true);
  assert.equal(core.needsCompatiblePlayer('','video/quicktime'),true);
});

test('identifica corretamente formatos diretos MP4, WebM e Ogg',()=>{
  assert.equal(core.directMime('video.webm',''), 'video/webm');
  assert.equal(core.directMime('arquivo.WEBM','application/octet-stream'), 'video/webm');
  assert.equal(core.directMime('filme.mp4','video/mp4'), 'video/mp4');
  assert.equal(core.directMime('filme.ogv','video/ogg'), 'video/ogg');
  assert.equal(core.directMime('filme.m4v','video/x-m4v'), 'video/mp4');
});

test('trocar para o Drive cancela sucesso atrasado de rota direta',()=>{
  const state=core.makeSession();
  const token=state.beginDirect();
  assert.equal(state.isCurrent(token),true);
  state.switchToCompatible();
  assert.equal(state.getMode(),'compatible');
  assert.equal(state.isCurrent(token),false);
  assert.equal(state.confirmDirect(token),false);
  assert.equal(state.failDirect(token),false);
});

test('iniciar outra tentativa invalida a anterior',()=>{
  const state=core.makeSession();
  const old=state.beginDirect();
  const fresh=state.beginDirect();
  assert.equal(state.confirmDirect(old),false);
  assert.equal(state.confirmDirect(fresh),true);
  assert.equal(state.getMode(),'direct');
});

test('não executa recuperação duplicada',()=>{
  const state=core.makeSession();
  assert.equal(state.beginRecovery(),null);
  const token=state.beginDirect();
  state.confirmDirect(token);
  assert.equal(state.beginRecovery(),token);
  assert.equal(state.beginRecovery(),null);
  assert.equal(state.endRecovery(token),true);
  assert.equal(state.beginRecovery(),token);
});

test('recuperação obsoleta não pode voltar após compatibilidade',()=>{
  const state=core.makeSession();
  const token=state.beginDirect();
  state.confirmDirect(token);
  state.beginRecovery();
  state.switchToCompatible();
  assert.equal(state.isCurrent(token),false);
  assert.equal(state.endRecovery(token),false);
});

test('tempo exato salvo não é trocado por episodeOnly do iframe',()=>{
  const existing={time:126.5,duration:1200,updatedAt:1,provider:'enhanced',finished:false};
  const newer=core.episodeProgress(existing,{seriesId:'teste',season:2,episode:3});
  assert.equal(newer,existing);
  assert.equal(core.hasExactProgress(existing),true);
});

test('episódio sem tempo continua registrado ao trocar para iframe',()=>{
  const marker=core.episodeProgress(null,{seriesId:'serie',season:1,episode:6});
  assert.equal(marker.episodeOnly,true);
  assert.equal(marker.episode,6);
  assert.equal(marker.season,1);
  assert.equal(marker.seriesId,'serie');
  assert.ok(marker.updatedAt>0);
  const again=core.episodeProgress(marker,{seriesId:'serie',season:1,episode:6});
  assert.equal(again.episodeOnly,true);
});

test('apenas travamento em reprodução ativa aciona recuperação',()=>{
  assert.equal(core.shouldTrackStall({paused:true,readyState:4,buffer:0}),false);
  assert.equal(core.shouldTrackStall({seeking:true,readyState:4,buffer:0}),false);
  assert.equal(core.shouldTrackStall({ended:true,readyState:4,buffer:0}),false);
  assert.equal(core.shouldTrackStall({paused:false,readyState:0,buffer:0}),false);
  assert.equal(core.shouldTrackStall({paused:false,readyState:4,buffer:5}),false);
  assert.equal(core.shouldTrackStall({paused:false,readyState:3,buffer:0}),true);
});


test('rede lenta aumenta prazo, respeita economia de dados e bloqueia prefetch',()=>{
  const slow=core.connectionPolicy({effectiveType:'2g',saveData:true,deviceMemory:1,downlink:.4});
  assert.equal(slow.preload,'metadata');
  assert.equal(slow.timeout,16000);
  assert.equal(slow.warmNext,false);
  const normal=core.connectionPolicy({effectiveType:'4g',downlink:10,deviceMemory:8});
  assert.equal(normal.timeout,8500);
  assert.equal(normal.warmNext,true);
  assert.equal(normal.preload,'metadata');
  assert.equal(core.connectionPolicy({effectiveType:'4g',downlink:10,online:false}).warmNext,false);
  assert.equal(core.connectionPolicy({effectiveType:'4g',downlink:10,hidden:true}).warmNext,false);
  assert.equal(core.connectionPolicy({effectiveType:'4g',downlink:10,dataSaver:true}).warmNext,false);
});

test('política de recuperação limita duas tentativas e respeita cooldown',()=>{
  const gate=core.makeRecoveryBudget({maxAttempts:2,windowMs:120000,cooldownMs:15000});
  assert.equal(gate.begin(1000),true);
  assert.equal(gate.begin(2000),false);
  assert.equal(gate.status(2000).cooling,true);
  assert.equal(gate.begin(16001),true);
  assert.equal(gate.status(33000).exhausted,true);
  assert.equal(gate.begin(33000),false);
  assert.equal(gate.begin(121001),true);
  gate.reset();
  assert.equal(gate.status(122000).count,0);
});

test('posição de recuperação nunca passa do final e ignora valores inválidos',()=>{
  assert.equal(core.resumeTarget(120,240),120);
  assert.equal(core.resumeTarget(300,240),239.75);
  assert.equal(core.resumeTarget(NaN,100),0);
  assert.equal(core.resumeTarget(-3,100),0);
  assert.equal(core.resumeTarget(120,NaN),120);
  assert.equal(core.resumeTarget(0,100),0);
});
