import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const scope={};
vm.runInNewContext(await readFile('js/player-media-qa.js','utf8'),{window:scope});
const qa=scope.JOGAHUB_PLAYER_MEDIA_QA;
test('busca temporal é limitada pelo vídeo e rejeita alvo inválido',()=>{
  assert.equal(qa.targetTime(5,120),5);
  assert.equal(qa.targetTime(999,120),119.95);
  assert.equal(qa.targetTime(0,120),0);
  assert.equal(qa.targetTime(-1,120),null);
  assert.equal(qa.targetTime(Infinity,120),null);
  assert.equal(qa.targetTime(NaN,120),null);
});
test('intervalos buscáveis descontínuos são informativos, não sobrepostos',()=>{
  const ranges={length:2,start:i=>i?50:0,end:i=>i?120:12};
  const info=qa.rangeInfo(ranges,55);
  assert.equal(info.count,2);
  assert.equal(info.start,0);
  assert.equal(info.end,120);
  assert.equal(info.includesTarget,true);
  assert.equal(qa.rangeInfo(ranges,25).includesTarget,false);
  assert.equal(qa.rangeInfo(null,80).count,0);
});
test('diagnóstico separa busca confirmada, pendente e sem confirmação',()=>{
  assert.equal(qa.seekResult({target:90,actual:90.1,seeked:true}).state,'ok');
  assert.equal(qa.seekResult({target:90,actual:90.1}).state,'pending');
  assert.equal(qa.seekResult({target:90,actual:0,seeking:true,elapsedMs:100}).state,'pending');
  assert.equal(qa.seekResult({target:90,actual:0,elapsedMs:9000,timeoutMs:8500,seekable:{count:0}}).state,'timeout');
  assert.equal(qa.seekResult({target:90,actual:0,elapsedMs:9000,timeoutMs:8500,seekable:{count:1,includesTarget:false}}).state,'unavailable');
  assert.equal(qa.seekResult({target:NaN,actual:20}).state,'invalid');
});
test('não confunde ausência de API de áudio com ausência de áudio',()=>{
  assert.equal(qa.audioEvidence({audioTrackCount:0}).state,'unknown');
  assert.equal(qa.audioEvidence({mozHasAudio:false}).state,'absent');
  assert.equal(qa.audioEvidence({audioTrackCount:2}).state,'track');
  assert.equal(qa.audioEvidence({decodedAudioBytes:400}).state,'decoded');
  assert.equal(qa.audioEvidence({muted:true,audioTrackCount:1}).state,'muted');
});
test('metadados não são confundidos com vídeo decodificado',()=>{
  assert.equal(qa.playbackEvidence({readyState:1,width:1920,height:1080}).state,'metadata');
  assert.equal(qa.playbackEvidence({readyState:3,width:1920,height:1080,currentTime:40}).state,'progress');
  assert.equal(qa.playbackEvidence({readyState:3,width:1920,height:1080,currentTime:40,decodedFrames:230}).state,'frames');
});
test('snapshot do elemento não causa exceções quando APIs opcionais faltam',()=>{
  const media={readyState:2,currentTime:1,videoWidth:32,videoHeight:32,
    volume:1,muted:false,seekable:{length:0},audioTracks:{length:0}};
  const state=qa.mediaSnapshot(media);
  assert.equal(state.audio.state,'unknown');
  assert.equal(state.playback.state,'progress');
  assert.equal(state.seekable.count,0);
  assert.equal(qa.mediaSnapshot(null).playback.state,'unloaded');
});
