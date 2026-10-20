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
