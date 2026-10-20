import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const window={};
vm.runInNewContext(await readFile('js/player-episode-core.js','utf8'),{window},
  {filename:'js/player-episode-core.js'});
const core=window.JOGAHUB_PLAYER_EPISODE_CORE;
const eps=[
  {id:'s1e2',seriesId:'serie',season:1,episode:2,title:'Episódio 2',driveFileId:'drive-b'},
  {id:'s2e1',seriesId:'serie',season:2,episode:1,title:'Episódio 3',driveFileId:'drive-c'},
  {id:'s1e1',seriesId:'serie',season:1,episode:1,title:'Episódio 1',driveFileId:'drive-a'},
];

test('ordena temporadas e episódios cronologicamente sem alterar catálogo',()=>{
  const result=core.episodeOrder(eps);
  assert.deepEqual(Array.from(result,item=>item.id),['s1e1','s1e2','s2e1']);
  assert.equal(eps[0].id,'s1e2');
});

test('fim da temporada encontra episódio seguinte na próxima',()=>{
  const sequence=core.episodeOrder(eps);
  const n=core.episodeNeighbors(sequence,sequence[1]);
  assert.equal(n.found,true);
  assert.equal(n.previous.id,'s1e1');
  assert.equal(n.next.id,'s2e1');
  assert.equal(core.episodeNeighbors(sequence,sequence[2]).next,null);
});

test('identifica episódio antigo pelo ID de arquivo Drive após sincronização',()=>{
  const seq=core.episodeOrder(eps);
  const n=core.episodeNeighbors(seq,{id:'drive-auto-id-antigo',driveFileId:'drive-b'});
  assert.equal(n.found,true);
  assert.equal(n.next.id,'s2e1');
});

test('não escolhe próximo episódio arbitrário quando atual não está no catálogo',()=>{
  const seq=core.episodeOrder(eps);
  const n=core.episodeNeighbors(seq,{id:'nao-existe',driveFileId:'outro-arquivo'});
  assert.equal(n.found,false);
  assert.equal(n.previous,null);
  assert.equal(n.next,null);
});

test('IDs de vídeo ambíguos não são confundidos com episódio',()=>{
  const sequence=[...eps,{id:'duplicata',driveFileId:'drive-b'}];
  const n=core.episodeNeighbors(sequence,{id:'antigo',driveFileId:'drive-b'});
  assert.equal(n.found,false);
  assert.equal(n.next,null);
});

test('autoplay só avança séries e listas de episódios, nunca filmes aleatórios',()=>{
  const currentItem={mediaType:'serie'};
  const nextItem={id:'seguinte'};
  const args={autoplayNext:true,suppressed:false,nextItem,currentItem};
  assert.equal(core.mayAutoAdvance(args),true);
  assert.equal(core.mayAutoAdvance({...args,suppressed:true}),false);
  assert.equal(core.mayAutoAdvance({...args,autoplayNext:false}),false);
  assert.equal(core.mayAutoAdvance({...args,nextItem:null}),false);
  assert.equal(core.mayAutoAdvance({...args,playlistId:'playlist-youtube'}),false);
  assert.equal(core.mayAutoAdvance({...args,currentItem:{mediaType:'filme'}}),false);
  assert.equal(core.mayAutoAdvance({...args,currentItem:{mediaType:'filme'},archivePlaylist:true}),true);
});
