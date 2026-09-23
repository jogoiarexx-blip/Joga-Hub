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

const config = await readFile(CONFIG_PATH, 'utf8');
const urlMatch = config.match(/const\s+SYNC_URL\s*=\s*['"]([^'"]+)['"]/);
if (!urlMatch) throw new Error('SYNC_URL não encontrado em ' + CONFIG_PATH);

const endpoint = new URL(urlMatch[1]);
endpoint.searchParams.set('refresh', '1');
endpoint.searchParams.set('_', String(Date.now()));

const response = await fetch(endpoint, {
  redirect: 'follow',
  headers: { 'accept': 'application/json' }
});
if (!response.ok) throw new Error('Apps Script respondeu HTTP ' + response.status);

const payload = await response.json();
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

if (!files.length) throw new Error('Apps Script retornou catálogo vazio; snapshot antigo foi preservado.');

const output =
  '/* JogaHub — snapshot automático do Google Drive. Gerado por GitHub Actions. */\n' +
  'window.JOGAHUB_DRIVE_SNAPSHOT = ' + JSON.stringify(files) + ';\n';

let previous = '';
try { previous = await readFile(SNAPSHOT_PATH, 'utf8'); } catch {}

if (previous !== output) {
  await writeFile(SNAPSHOT_PATH, output, 'utf8');
  console.log('Snapshot atualizado:', files.length, 'arquivos');
} else {
  console.log('Snapshot já está atualizado:', files.length, 'arquivos');
}
