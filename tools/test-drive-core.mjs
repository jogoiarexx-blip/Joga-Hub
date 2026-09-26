import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const [snapshotCode, syncCode] = await Promise.all([
  readFile('js/drive-snapshot.js', 'utf8'),
  readFile('js/drive-sync.js', 'utf8')
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
  JOGAHUB_DRIVE_SNAPSHOT: rawFiles,
  addEventListener() {},
  dispatchEvent() {},
  JOGAHUB_REFRESH_ITEMS() {}
};

vm.runInNewContext(syncCode, context, { filename: 'js/drive-sync.js' });

const items = context.FILMES_CATALOGO.filter(item => String(item.id || '').startsWith('drive-auto-'));
if (!items.length) throw new Error('Nenhum item do Drive foi montado');

const rawRootVideos = rawFiles.filter(file => String(file.path || '').split('/').filter(Boolean).length === 1);
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
  if (seasons.join(',') !== '1,2,3,4') throw new Error('Temporadas de Breaking Bad não foram interpretadas corretamente: ' + seasons.join(','));
}

const directPreferred = items.filter(item => /\.mp4$/i.test(item._driveName || '') && /x264|h[ ._-]?264/i.test(item._driveName || ''));
if (!directPreferred.length) throw new Error('Nenhum MP4/H.264 reconhecido para reprodução direta');

console.log(JSON.stringify({
  rawFiles: rawFiles.length,
  catalogItems: items.length,
  rootFilms: rawRootVideos.length,
  seriesEpisodes: items.filter(item => item.mediaType === 'serie').length,
  directPreferred: directPreferred.length
}, null, 2));
