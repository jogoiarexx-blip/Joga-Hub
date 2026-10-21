import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const window={};
vm.runInNewContext(await readFile('js/player-browser-core.js','utf8'),{window});
const compat=window.JOGAHUB_PLAYER_BROWSER_CORE;

test('API padrão de fullscreen tem prioridade sobre a legada',async()=>{
  let native=0,legacy=0;
  const target={requestFullscreen:async()=>{native++}};
  const video={webkitEnterFullscreen:()=>{legacy++}};
  assert.equal(await compat.requestFullscreen(target,video),'document');
  assert.equal(native,1);
  assert.equal(legacy,0);
});

test('WebKit usa fullscreen de vídeo quando não há API no contêiner',async()=>{
  let count=0;
  const video={webkitEnterFullscreen:()=>{count++}};
  assert.equal(compat.fullscreenAvailable({},video),true);
  assert.equal(await compat.requestFullscreen({},video),'video');
  assert.equal(count,1);
});

test('API não suportada não produz falso sucesso',async()=>{
  assert.equal(compat.fullscreenAvailable({},{}),false);
  assert.equal(await compat.requestFullscreen({},{}),'unavailable');
  assert.equal(await compat.requestFullscreen({requestFullscreen:()=>{throw Error('rejeitado')}},{}),'unavailable');
});

test('PiP padrão alterna entrada e saída',async()=>{
  let entered=0,left=0;
  const video={requestPictureInPicture:async()=>{entered++}};
  const doc={pictureInPictureEnabled:true,pictureInPictureElement:null,exitPictureInPicture:async()=>{left++}};
  assert.equal(compat.pictureInPictureAvailable(doc,video),true);
  assert.equal(await compat.togglePictureInPicture(doc,video),true);
  assert.equal(entered,1);
  doc.pictureInPictureElement=video;
  assert.equal(await compat.togglePictureInPicture(doc,video),true);
  assert.equal(left,1);
});

test('Safari com modo de apresentação WebKit mantém opção PiP',async()=>{
  const modes=[];
  const video={
    webkitPresentationMode:'inline',
    webkitSupportsPresentationMode:mode=>mode==='picture-in-picture',
    webkitSetPresentationMode:mode=>{modes.push(mode)}
  };
  assert.equal(compat.pictureInPictureAvailable({},video),true);
  assert.equal(await compat.togglePictureInPicture({},video),true);
  video.webkitPresentationMode='picture-in-picture';
  assert.equal(await compat.togglePictureInPicture({},video),true);
  assert.deepEqual(modes,['picture-in-picture','inline']);
});

test('PiP sem suporte ou bloqueado não dispara exceção',async()=>{
  assert.equal(compat.pictureInPictureAvailable({},{}),false);
  assert.equal(await compat.togglePictureInPicture({},{}),false);
  const video={requestPictureInPicture:async()=>{throw Error('Bloqueado')}};
  assert.equal(await compat.togglePictureInPicture({pictureInPictureEnabled:true},video),false);
});

test('capacidade de codec é derivada do navegador, nunca do User-Agent',()=>{
  assert.equal(compat.canPlayVideo({canPlayType:()=>''},'video/mp4'),false);
  assert.equal(compat.canPlayVideo({canPlayType:()=> 'maybe'},'video/webm'),true);
  assert.equal(compat.canPlayVideo({},'video/mp4'),false);
});
