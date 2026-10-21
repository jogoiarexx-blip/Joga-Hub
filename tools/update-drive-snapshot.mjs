import { readFile, writeFile } from 'node:fs/promises';
import { readDrivePayload, missingFileIds, isVideoFile } from './drive-snapshot-policy.mjs';

const CONFIG_PATH = 'js/data-drive-filmes.js';
const SNAPSHOT_PATH = 'js/drive-snapshot.js';

function stripResourceKey(raw) {
  if (!raw) return '';
  try {
    const url=new URL(raw);
    url.searchParams.delete('resourcekey');
    return url.toString();
  } catch {return raw}
}

function normalizeFile(file) {
  if (!file?.id) return null;
  return {
    id: String(file.id),
    name: String(file.name ?? file.nome ?? ''),
    mime: String(file.mime || ''),
    size: String(file.size ?? file.tamanho ?? '0'),
    path: String(file.path ?? file.caminho ?? file.pasta ?? ''),
    // O repositório/site é público: nunca persistir resourceKey de compartilhamento
    // no snapshot versionado. O cliente recebe a chave no sync ao vivo.
    url: stripResourceKey(String(file.url ?? file.link ?? '')),
    player: stripResourceKey(String(file.player || '')),
    updated: String(file.updated ?? file.atualizado ?? '')
  };
}

function preserveSnapshot(reason) {
  console.log('::warning::Google Drive não pôde ser atualizado automaticamente: ' + reason);
  console.log('Snapshot existente preservado; a execução termina sem erro para não apagar o catálogo nem enviar alerta falso.');
  process.exit(0);
}

const config = await readFile(CONFIG_PATH, 'utf8');
const urlMatch = config.match(/const\s+SYNC_URL\s*=\s*['"]([^'"]+)['"]/);
const configuredUrl = String(process.env.DRIVE_SYNC_URL || urlMatch?.[1] || '').trim();
if (!configuredUrl) throw new Error('SYNC_URL não encontrado em ' + CONFIG_PATH + ' e DRIVE_SYNC_URL não foi definido.');

const endpoint = new URL(configuredUrl);
endpoint.searchParams.set('refresh', '1');
endpoint.searchParams.set('_', String(Date.now()));

let response;
try {
  response = await fetch(endpoint, {
    redirect: 'follow',
    headers: { accept: 'application/json,text/plain;q=0.9,*/*;q=0.1' },
    signal: AbortSignal.timeout(30000)
  });
} catch (error) {
  preserveSnapshot('falha de rede: ' + (error?.message || error));
}

const contentType = String(response.headers.get('content-type') || '').toLowerCase();
const finalUrl = String(response.url || '');
const body = await response.text();

if (!response.ok) preserveSnapshot('Apps Script respondeu HTTP ' + response.status);
if (/accounts\.google\.com/i.test(finalUrl) || /text\/html/i.test(contentType) || /^\s*<!doctype html/i.test(body) || /^\s*<html/i.test(body)) {
  preserveSnapshot('a implantação do Apps Script redirecionou para login do Google. Reimplante o Web App com acesso "Qualquer pessoa".');
}

let payload;
try { payload = JSON.parse(body); }
catch { preserveSnapshot('resposta não era JSON válido'); }

let raw;
try {
  raw = readDrivePayload(payload);
} catch (error) {
  preserveSnapshot(error?.message || String(error));
}

const byId = new Map();
for (const source of raw) {
  const file = normalizeFile(source);
  if (!file || !isVideoFile(file)) continue;
  const previous = byId.get(file.id);
  const currentTime = Date.parse(file.updated) || 0;
  const previousTime = Date.parse(previous?.updated || '') || 0;
  if (!previous || currentTime > previousTime || (currentTime === previousTime && Number(file.size) > Number(previous.size))) {
    byId.set(file.id, file);
  }
}

const files = [...byId.values()].sort((a, b) =>
  (Date.parse(b.updated) || 0) - (Date.parse(a.updated) || 0) ||
  a.path.localeCompare(b.path, 'pt-BR', { numeric: true, sensitivity: 'base' }) ||
  a.name.localeCompare(b.name, 'pt-BR', { numeric: true, sensitivity: 'base' })
);

if (!files.length) preserveSnapshot('Apps Script retornou zero arquivos de vídeo válidos');

const output =
  '/* JogaHub — snapshot automático do Google Drive. Gerado por GitHub Actions/Drive sync. */\n' +
  'window.JOGAHUB_DRIVE_SNAPSHOT = ' + JSON.stringify(files, null, 2) + ';\n';

let previous = '';
try { previous = await readFile(SNAPSHOT_PATH, 'utf8'); } catch (error) {
  if (error?.code !== 'ENOENT') preserveSnapshot('não foi possível ler o snapshot anterior: ' + error);
}

if (previous) {
  const previousMatch = previous.match(/window\.JOGAHUB_DRIVE_SNAPSHOT\s*=\s*(\[[\s\S]*\]);?\s*$/);
  if (!previousMatch) preserveSnapshot('formato do snapshot anterior inválido');
  let previousFiles;
  try { previousFiles = JSON.parse(previousMatch[1]); }
  catch { preserveSnapshot('JSON do snapshot anterior inválido'); }
  // SRT, atalhos e anexos que vazaram em versões antigas não contam como
  // vídeos apagados; a proteção contra perda de filmes/episódios continua.
  const removedIds = missingFileIds(previousFiles.filter(isVideoFile), files);
  if (removedIds.length && process.env.DRIVE_ALLOW_REMOVALS !== '1') {
    preserveSnapshot(
      'a nova leitura omitiu ' + removedIds.length +
      ' arquivo(s) já publicados. Snapshot preservado para evitar perda de catálogo. ' +
      'Se as exclusões forem intencionais, defina DRIVE_ALLOW_REMOVALS=1 no repositório.'
    );
  }
}

if (previous !== output) {
  await writeFile(SNAPSHOT_PATH, output, 'utf8');
  console.log('Snapshot atualizado:', files.length, 'arquivos');
} else {
  console.log('Snapshot já está atualizado:', files.length, 'arquivos');
}
