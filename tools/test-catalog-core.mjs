import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile('js/catalog-core.js', 'utf8');
const frameQueue = [];
const hostWindow = {};
vm.runInNewContext(source, {
  window: hostWindow,
  requestAnimationFrame: callback => frameQueue.push(callback)
}, { filename: 'js/catalog-core.js' });

const core = hostWindow.JOGAHUB_CATALOG_CORE;

test('carrega categorias e normaliza português sem perder compatibilidade', () => {
  assert.ok(core);
  assert.equal(core.types.filme.label, 'Filmes');
  assert.equal(core.gameCategories.rpg.label, 'RPG & Aventura');
  assert.ok(core.typeOrder.includes('serie'));
  assert.equal(core.normalize('Asas de Brumária'), 'asas de brumaria');
});

test('preserva ordem do acervo, elimina IDs duplicados e exemplos', () => {
  const state = core.createState();
  const original = { id: 'jogo-1', title: 'Original' };
  const merged = state.rebuild([original, {id: 'jogo-1', title: 'Duplicado'}, {id: 'exemplo'}, {}, {id:'filme-1'}]);
  assert.deepEqual(Array.from(merged, item => item.id), ['jogo-1', 'filme-1']);
  assert.equal(merged[0], original);
});

test('índice localiza acentos, categorias e dados do Drive', () => {
  const state = core.createState();
  const item = {
    id: 'drive-1', title: 'Profundezas', seriesTitle: 'Série Profundezas',
    type: 'filme', genre: 'Ficção científica', _drivePath: 'filmes e série',
    nostalgiaTags: ['Áudio português']
  };
  const result = state.searchIndex(item);
  assert.ok(result.includes('serie profundezas'));
  assert.ok(result.includes('ficcao cientifica'));
  assert.ok(result.includes('audio portugues'));
  assert.equal(state.searchIndex(item), result);
});

test('limpa índice ao sincronizar novo snapshot do Drive', () => {
  const state = core.createState();
  const original = { id:'drive-1', title:'Episódio antigo' };
  assert.ok(state.searchIndex(original).includes('episodio antigo'));
  state.rebuild([{ id:'drive-1', title:'Episódio atualizado' }]);
  const updated = state.searchIndex({ id:'drive-1', title:'Episódio atualizado' });
  assert.ok(updated.includes('episodio atualizado'));
  assert.ok(!updated.includes('antigo'));
});

test('contenção de conteúdos externos repetidos por ID, Archive e YouTube', () => {
  let triggered = 0;
  const state = core.createState({
    requestFrame: callback => frameQueue.push(callback),
    onChange: () => { triggered++; }
  });
  const current = [{id:'original',archiveId:'arch-1'}];
  assert.equal(state.registerRuntimeItems([
    {id:'original',title:'duplicado'},
    {id:'novo',archiveId:'arch-1'},
    {id:'youtube-a',youtubeId:'yt-1'},
    {id:'youtube-b',youtubeId:'yt-1'},
    {id:'novo-filme'}
  ], current), true);
  assert.equal(state.registerRuntimeItems([{id:'novo-filme'}], current), false);
  assert.equal(frameQueue.length, 1, 'Uma única atualização de tela deve ser agendada');
  assert.equal(triggered, 0);
  frameQueue.shift()();
  assert.equal(triggered, 1);
  const merged = state.rebuild(current);
  assert.deepEqual(Array.from(merged, item=>item.id), ['original','youtube-a','novo-filme']);
});

test('lotes de atualizações compartilham um único frame', () => {
  let rendered = 0;
  const queue = [];
  const state = core.createState({onChange:()=>rendered++,requestFrame:cb=>queue.push(cb)});
  state.registerRuntimeItems([{id:'1'}], []);
  state.registerRuntimeItems([{id:'2'}], []);
  assert.equal(queue.length, 1);
  queue.shift()();
  assert.equal(rendered, 1);
  assert.equal(state.rebuild([]).length, 2);
  state.registerRuntimeItems([{id:'3'}], []);
  assert.equal(queue.length, 1);
});

test('cada instância mantém seu próprio estado', () => {
  const a = core.createState({requestFrame: cb => frameQueue.push(cb)});
  const b = core.createState({requestFrame: cb => frameQueue.push(cb)});
  a.registerRuntimeItems([{id:'apenas-a'}], []);
  assert.equal(a.rebuild([]).length, 1);
  assert.equal(b.rebuild([]).length, 0);
});
