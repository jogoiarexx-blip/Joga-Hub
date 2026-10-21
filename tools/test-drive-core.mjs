import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const [snapshotCode, syncCode, catalogCode, mediaPolicyCode] = await Promise.all([
  readFile('js/drive-snapshot.js', 'utf8'),
  readFile('js/drive-sync.js', 'utf8'),
  readFile('js/app.js', 'utf8'),
  readFile('js/drive-media-policy.js', 'utf8')
]);

const snapshotMatch = snapshotCode.match(/window\.JOGAHUB_DRIVE_SNAPSHOT\s*=\s*(\[[\s\S]*\]);?\s*$/);
if (!snapshotMatch) throw new Error('Snapshot do Drive inválido');
const rawFiles = JSON.parse(snapshotMatch[1]);

const storage = new Map();
const context = {
  console,
  FILMES_CATALOGO: [],
  localStorage: {
    getItem: key => storage.has(key) ? storage.get(key) : null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: key => storage.delete(key)
  },
  navigator: { onLine: false },
  document: {
    readyState: 'loading',
    addEventListener() {},
    head: { appendChild() {} },
    createElement() { return { remove() {}, async: false }; }
  },
  CustomEvent: class {
    constructor(type, options = {}) { this.type = type; this.detail = options.detail; }
  },
  setTimeout() { return 0; },
  clearTimeout() {},
  URL
};
context.window = {
  JOGAHUB_DRIVE_SYNC_URL: 'https://example.invalid/exec',
  JOGAHUB_DRIVE_SNAPSHOT: rawFiles,
  addEventListener() {},
  dispatchEvent() {},
  JOGAHUB_REFRESH_ITEMS() {}
};

vm.runInNewContext(mediaPolicyCode, context, {filename:'js/drive-media-policy.js'});
vm.runInNewContext(syncCode, context, { filename: 'js/drive-sync.js' });

const items = context.FILMES_CATALOGO.filter(item => String(item.id || '').startsWith('drive-auto-'));
if (!items.length) throw new Error('Nenhum item do Drive foi montado');
const mediaPolicy=context.window.JOGAHUB_DRIVE_MEDIA_POLICY;
if(items.some(item=>!mediaPolicy.isVideo({name:item._driveName,mime:item.driveMime})))
  throw new Error('Arquivo que não é vídeo foi incluído no catálogo');
if(rawFiles.some(file=>!mediaPolicy.isVideo(file))&&items.length>=rawFiles.length)
  throw new Error('O catálogo não removeu os SRT/atalhos do snapshot antigo');

const rawRootVideos = rawFiles.filter(file => context.window.JOGAHUB_DRIVE_MEDIA_POLICY.isVideo(file) && String(file.path || '').split('/').filter(Boolean).length === 1);
const normalizeMovieKey = name => {
  let value = String(name || '')
    .replace(/\.(mp4|mkv|webm|mov|avi|m4v|ogv|mpeg|mpg|3gp)$/i, '')
    .replace(/[._]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const cut = value.search(/\b(?:19|20)\d{2}\b|\b(?:2160p|1440p|1080p|720p|576p|480p|4k|uhd|hdr|webrip|web[- ]?dl|bluray|brrip|dvdrip|hdtv|camrip|cam|telesync|x264|x265|h\.264|h\.265|hevc|aac|dts|dual|dublado|legendado|multi)\b/i);
  if (cut > 1) value = value.slice(0, cut);
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
};
for (const file of rawRootVideos) {
  const direct = items.find(entry => entry.driveFileId === file.id);
  if (direct) {
    if (direct.mediaType !== 'filme') throw new Error('Filme da raiz classificado como série: ' + file.name);
    continue;
  }
  // O catálogo deduplica versões do mesmo filme (ex.: CAM/TELESYNC) e pode
  // manter apenas o arquivo preferido. Nesse caso, valide pela identidade lógica.
  const key = normalizeMovieKey(file.name);
  const equivalent = rawRootVideos
    .filter(other => other.id !== file.id && normalizeMovieKey(other.name) === key)
    .some(other => items.some(entry => entry.driveFileId === other.id && entry.mediaType === 'filme'));
  if (!equivalent) throw new Error('Filme da raiz ausente sem equivalente deduplicado: ' + file.name);
}

const logical = new Set();
for (const item of items) {
  if (item.mediaType !== 'serie' || !Number(item.episode)) continue;
  const key = String(item.seriesId || item.seriesTitle) + ':S' + Number(item.season || 1) + ':E' + Number(item.episode);
  if (logical.has(key)) throw new Error('Episódio duplicado no catálogo: ' + key);
  logical.add(key);
}

const knownSeries = items.filter(item => item.seriesTitle === 'Breaking Bad');
if (knownSeries.length) {
  const seasons = [...new Set(knownSeries.map(item => Number(item.season)))].sort((a,b) => a-b);
  // Exige as temporadas já conhecidas, mas não falha quando uma nova temporada é adicionada.
  const requiredSeasons = [1, 2, 3, 4, 5];
  const missingSeasons = requiredSeasons.filter(season => !seasons.includes(season));
  if (missingSeasons.length) throw new Error('Temporadas de Breaking Bad ausentes ou interpretadas incorretamente: ' + missingSeasons.join(',') + ' (encontradas: ' + seasons.join(',') + ')');
}

// A lista de novidades não pode tirar episódios dos agrupamentos de séries.
for (const groupName of ['driveSeriesItems', 'youtubeSeriesItems', 'remainingSeries']) {
  const line = catalogCode.split('\n').find(line => line.includes('const ' + groupName + '='));
  if (!line) throw new Error('Agrupamento de séries ausente: ' + groupName);
  if (/used\.has\(/.test(line)) throw new Error('Agrupamento dependente dos destaques, causando temporadas incompletas: ' + groupName);
}

// Valida a nova série pelo conteúdo real do snapshot, sem inventar episódios.
const profundezasFiles = rawFiles.filter(file => /Profundezas\s+S01/i.test(String(file.path || '')));
if (profundezasFiles.length) {
  const expected = new Set(profundezasFiles.map(file => file.id));
  const actual = items.filter(item => expected.has(item.driveFileId));
  if (actual.length !== expected.size || actual.some(item => item.mediaType !== 'serie' || Number(item.season) !== 1)) {
    throw new Error('Profundezas não foi registrada corretamente como série da 1ª temporada');
  }
  const episodes = actual.map(item => Number(item.episode)).sort((a,b) => a-b);
  if (new Set(episodes).size !== episodes.length || episodes.some(episode => episode < 1)) {
    throw new Error('Episódios inválidos ou repetidos em Profundezas: ' + episodes);
  }
}

const directPreferred = items.filter(item => /\.mp4$/i.test(item._driveName || '') && /x264|h[ ._-]?264/i.test(item._driveName || ''));
if (!directPreferred.length) throw new Error('Nenhum MP4/H.264 reconhecido para reprodução direta');

// Exercita o núcleo de sincronização HTTP com resposta truncada e depois completa.
// A leitura incompleta deve manter as entradas carregadas do snapshot.
const idsBefore = new Set(context.FILMES_CATALOGO.filter(item => item.driveFileId).map(item => item.driveFileId));
context.fetch = async () => ({ok:true,json:async()=>({ok:true,files:[rawFiles[0]],total:1,errors:[]})});
await context.window.JOGAHUB_DRIVE_SYNC.sync();
const afterPartial = new Set(context.FILMES_CATALOGO.filter(item => item.driveFileId).map(item => item.driveFileId));
if (afterPartial.size !== idsBefore.size || [...idsBefore].some(id => !afterPartial.has(id))) {
  throw new Error('Uma sincronização incompleta apagou arquivos previamente carregados');
}
if (context.window.JOGAHUB_DRIVE_SYNC.getStatus().success) {
  throw new Error('Resposta truncada foi aceita como sincronização bem-sucedida');
}

context.fetch = async () => ({ok:true,json:async()=>({ok:true,files:rawFiles,total:rawFiles.length,errors:[]})});
await context.window.JOGAHUB_DRIVE_SYNC.sync();
if (!context.window.JOGAHUB_DRIVE_SYNC.getStatus().success) {
  throw new Error('Leitura completa do Drive não foi aceita');
}

// Chaves de recurso precisam sobreviver ao sincronizador mesmo quando
// chegam apenas no link original, pois alguns compartilhamentos as exigem.
const sharedKeyFile={
  ...rawFiles[0],
  id:'qa-resourcekey-file',
  name:'Arquivo de teste resourcekey 2026.mp4',
  path:'Arquivo de teste resourcekey 2026.mp4',
  resourceKey:'chave-de-teste',
  url:'https://drive.google.com/file/d/qa-resourcekey-file/view?resourcekey=chave-de-teste',
  player:'https://drive.google.com/file/d/qa-resourcekey-file/preview?resourcekey=chave-de-teste'
};
const urlOnlyFile={
  ...sharedKeyFile,id:'qa-resourcekey-url-only',
  name:'Arquivo de teste somente link 2026.mp4',
  resourceKey:'',
  url:'https://drive.google.com/file/d/qa-resourcekey-url-only/view?resourcekey=chave-somente-url',
  player:'https://drive.google.com/file/d/qa-resourcekey-url-only/preview?resourcekey=chave-somente-url'
};
const keyedFiles=[...rawFiles,sharedKeyFile,urlOnlyFile];
context.fetch=async()=>({ok:true,json:async()=>({ok:true,files:keyedFiles,total:keyedFiles.length,errors:[]})});
await context.window.JOGAHUB_DRIVE_SYNC.sync();
const keyedItem=context.FILMES_CATALOGO.find(item=>item.driveFileId===sharedKeyFile.id);
if(keyedItem?.driveResourceKey!=='chave-de-teste'){
  throw new Error('Chave de recurso compartilhado foi perdida durante a sincronização');
}
const cachedFile=JSON.parse(storage.get('jogahub_drive_catalog_cache_v6_compact')||'[]')
  .find(item=>item.id===sharedKeyFile.id);
if(cachedFile?.resourceKey!=='chave-de-teste')
  throw new Error('Chave de recurso não persistiu no cache local sem URL');
const urlOnly=context.FILMES_CATALOGO.find(item=>item.driveFileId===urlOnlyFile.id);
const urlOnlyCached=JSON.parse(storage.get('jogahub_drive_catalog_cache_v6_compact')||'[]')
  .find(item=>item.id===urlOnlyFile.id);
if(urlOnly?.driveResourceKey!=='chave-somente-url'||urlOnlyCached?.resourceKey!=='chave-somente-url')
  throw new Error('Recurso somente na URL perdeu a chave no cache local');


console.log(JSON.stringify({
  rawFiles: rawFiles.length,
  catalogItems: items.length,
  rootFilms: rawRootVideos.length,
  seriesEpisodes: items.filter(item => item.mediaType === 'serie').length,
  directPreferred: directPreferred.length
}, null, 2));
