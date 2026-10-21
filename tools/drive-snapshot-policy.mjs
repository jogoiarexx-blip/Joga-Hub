/* Validação conservadora para snapshots do acervo de filmes e séries.
 * Uma varredura incompleta não deve substituir o catálogo publicado.
 */
export function readDrivePayload(payload) {
  if (!payload || typeof payload !== 'object') throw new Error('Resposta inválida do Drive');
  if (payload.ok === false || payload.sucesso === false) {
    throw new Error(String(payload.error || payload.erro || 'Apps Script informou falha'));
  }
  if (Array.isArray(payload.errors) && payload.errors.length) {
    throw new Error('Varredura incompleta (' + payload.errors.length + ' erro(s) reportado(s))');
  }
  const raw = Array.isArray(payload.files) ? payload.files
    : Array.isArray(payload.itens) ? payload.itens
    : Array.isArray(payload.items) ? payload.items : null;
  if (!raw) throw new Error('Lista de vídeos ausente no retorno do Drive');
  if (!raw.length) throw new Error('Apps Script retornou catálogo vazio');

  const ids = raw.map(file => String(file?.id || '').trim());
  if (ids.some(id => !id)) throw new Error('Um ou mais arquivos do Drive não têm identificador');
  if (payload.total !== undefined && payload.total !== null) {
    const expected = Number(payload.total);
    if (!Number.isSafeInteger(expected) || expected !== new Set(ids).size) {
      throw new Error('Total informado pelo Drive não confere com os IDs recebidos');
    }
  }
  return raw;
}

export function missingFileIds(previousFiles, nextFiles) {
  const oldIds = new Set((previousFiles || []).map(file => String(file?.id || '').trim()).filter(Boolean));
  const newIds = new Set((nextFiles || []).map(file => String(file?.id || '').trim()).filter(Boolean));
  return [...oldIds].filter(id => !newIds.has(id));
}

/* Mesma regra final aplicada no navegador e no Apps Script. */
export function isSubtitleFile(file) {
  const name=String(file?.name??file?.nome??'').trim();
  const mime=String(file?.mime||'').toLowerCase().split(';')[0].trim();
  return /\.(?:srt|vtt|ass|ssa|sub|ttml|sbv)$/i.test(name)||
    mime==='application/x-subrip'||mime==='text/vtt';
}
export function isVideoFile(file) {
  const name=String(file?.name??file?.nome??'').trim();
  const mime=String(file?.mime||'').toLowerCase().split(';')[0].trim();
  if(!name||isSubtitleFile(file)||/\.(?:website|html?|json|txt|pdf|zip|rar|7z|exe|url|lnk)$/i.test(name))return false;
  if(/\.(?:mp4|m4v|mkv|webm|mov|avi|wmv|flv|ogv|mpeg|mpg|3gp|ts|m2ts)$/i.test(name))return true;
  return !/\.[a-z0-9]{1,8}$/i.test(name)&&mime.startsWith('video/');
}
