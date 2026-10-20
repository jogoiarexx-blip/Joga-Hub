import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const win = {};
vm.runInNewContext(await readFile('js/navigation-core.js', 'utf8'), { window: win }, { filename: 'js/navigation-core.js' });
const nav = win.JOGAHUB_NAV_CORE;
const categories = {
  corrida: {label:'Corrida',icon:'🏁',order:3},
  acao: {label:'Ação',icon:'💥',order:2},
  outros: {label:'Outros',icon:'🎮',order:99}
};

const items = [
  {id:'jogo',type:'jogo',category:'acao',title:'Asas de Brumária'},
  {id:'jogo2',type:'jogo',category:'corrida',title:'Asfalto Brutal'},
  {id:'filme',type:'filme',mediaType:'filme',genre:'Comédia',filmGenre:'comedia',title:'Filme Cômico',year:'1998',portuguese:true},
  {id:'serie',type:'filme',mediaType:'serie',seriesId:'breaking-bad-drive',seriesTitle:'Breaking Bad',title:'Piloto',genre:'Drama'},
  {id:'profundezas',type:'filme',mediaType:'serie',seriesTitle:'Profundezas',title:'Episódio 01',genre:'Ficção científica',filmGenre:'ficcao'},
  {id:'yt',type:'filme',mediaType:'filme',youtubeId:'YT123',youtubeCurated:true,language:'Português',genre:'Infantil'},
  {id:'emulador',type:'emulador',title:'SNES'}
];
const view = i => i.type==='filme'?(i.mediaType==='serie'?'serie':'filme'):i.type;
const getSearch = i => nav.normalize([i.title,i.seriesTitle,i.genre].filter(Boolean).join(' '));
const f = ({view:activeView,genre='todos',term='',favorites=new Set(),movieProgress=()=>null}) =>
  nav.filterItems(items,{
    view:activeView,genre,term,favorites,
    searchIndex:getSearch,contentView:view,
    itemDecade:i=>(i.year==='1998'?'90':''),
    movieProgress
  });
const ids=arr=>Array.from(arr,i=>i.id);

test('metadados e normalização funcionam sem depender do DOM',()=>{
  assert.ok(nav);
  assert.equal(nav.normalize('Brumária — Ficção'), 'brumaria — ficcao');
  assert.equal(nav.normalize('ÉPISÓDIO'), 'episodio');
});

test('opções do menu de jogos mantêm ordem e categorias',()=>{
  const opts=nav.filterOptions('jogo',items.filter(i=>i.type==='jogo'),categories);
  assert.deepEqual(ids(opts.map(x=>({id:x[0]}))), ['todos','acao','corrida']);
  assert.deepEqual(opts.map(x=>x[1]), ['🎮 Todos os jogos','💥 Ação','🏁 Corrida']);
});

test('séries preservam seus filtros originais, inclusive Breaking Bad',()=>{
  const serie=nav.filterOptions('serie',items,categories);
  assert.equal(serie[0][0], 'todos');
  assert.equal(serie[1][0], 'breaking-bad');
  assert.equal(serie[2][0], 'doramas');
  assert.ok(serie.some(x=>x[0]==='favoritos'));
  assert.ok(serie.some(x=>x[0]==='continuar'));
  assert.equal(nav.filterOptions('tv',items,categories).length, 0);
  assert.equal(nav.filterOptions('radio',items,categories).length, 0);
});

test('filtros por visão não misturam jogos, filmes e séries',()=>{
  assert.deepEqual(ids(f({view:'jogo'})), ['jogo','jogo2']);
  assert.deepEqual(ids(f({view:'serie'})), ['serie','profundezas']);
  assert.deepEqual(ids(f({view:'filme'})), ['filme','yt']);
  assert.deepEqual(ids(f({view:'emulador'})), ['emulador']);
  assert.equal(f({view:'jogo',genre:'acao'}).length,1);
});

test('busca ignora acentos e mantém resultado ao mudar de área',()=>{
  assert.deepEqual(ids(f({view:'jogo',term:'brumaria'})), ['jogo']);
  assert.deepEqual(ids(f({view:'serie',term:'profundezas'})), ['profundezas']);
  assert.deepEqual(ids(f({view:'filme',term:'brumaria'})), []);
});

test('filtros de mídia por série, gênero, idioma e fonte',()=>{
  assert.deepEqual(ids(f({view:'serie',genre:'breaking-bad'})), ['serie']);
  assert.deepEqual(ids(f({view:'serie',genre:'ficcao'})), ['profundezas']);
  assert.deepEqual(ids(f({view:'filme',genre:'comedia'})), ['filme']);
  assert.deepEqual(ids(f({view:'filme',genre:'youtube-curated'})), ['yt']);
  assert.deepEqual(ids(f({view:'filme',genre:'youtube-pt'})), ['yt']);
  assert.deepEqual(ids(f({view:'filme',genre:'portugues'})), ['filme','yt']);
});

test('favoritos e continuar assistindo seguem separados',()=>{
  const favorites=new Set(['profundezas']);
  assert.deepEqual(ids(f({view:'serie',genre:'favoritos',favorites})), ['profundezas']);
  assert.deepEqual(ids(f({view:'serie',genre:'continuar',movieProgress:i=>i.id==='serie'?{time:100}:null})),['serie']);
});

test('ordenação mantém favoritos na frente sem alterar entrada',()=>{
  const source=[items[0],items[1],items[2]];
  const order=nav.sortByTypeOrder(source,new Set(['filme']),['jogo','filme']);
  assert.deepEqual(ids(order),['filme','jogo','jogo2']);
  assert.deepEqual(ids(source), ['jogo','jogo2','filme']);
});
