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
