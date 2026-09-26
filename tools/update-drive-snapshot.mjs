import { readFile, writeFile } from 'node:fs/promises';

const CONFIG_PATH = 'js/data-drive-filmes.js';
const SNAPSHOT_PATH = 'js/drive-snapshot.js';

function normalizeFile(file) {
  if (!file?.id) return null;
  return {
    id: String(file.id),
    name: String(file.name ?? file.nome ?? ''),
    mime: String(file.mime || ''),
    size: String(file.size ?? file.tamanho ?? '0'),
    path: String(file.path ?? file.caminho ?? file.pasta ?? ''),
    url: String(file.url ?? file.link ?? ''),
    player: String(file.player || ''),
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

if (payload?.ok === false || payload?.sucesso === false) {
  throw new Error(payload.error || payload.erro || 'Apps Script informou falha');
}

const raw = Array.isArray(payload.files)
  ? payload.files
  : Array.isArray(payload.itens)
    ? payload.itens
    : [];

const byId = new Map();
for (const source of raw) {
  const file = normalizeFile(source);
  if (!file) continue;
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

if (!files.length) preserveSnapshot('Apps Script retornou catálogo vazio');

const output =
  '/* JogaHub — snapshot automático do Google Drive. Gerado por GitHub Actions/Drive sync. */\n' +
  'window.JOGAHUB_DRIVE_SNAPSHOT = ' + JSON.stringify(files, null, 2) + ';\n';

let previous = '';
try { previous = await readFile(SNAPSHOT_PATH, 'utf8'); } catch {}

if (previous !== output) {
  await writeFile(SNAPSHOT_PATH, output, 'utf8');
  console.log('Snapshot atualizado:', files.length, 'arquivos');
} else {
  console.log('Snapshot já está atualizado:', files.length, 'arquivos');
}
