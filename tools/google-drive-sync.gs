/**
 * JogaHub — Google Drive Sync 1.3.2
 * Sem Drive API / sem API key: usa apenas DriveApp do Google Apps Script.
 * Varre recursivamente a pasta principal e todas as subpastas.
 */
const ROOT_FOLDER_ID = '1FpJ__h7dTKpD-VOTl3WUIgpBBUc4vhut';

function doGet(e) {
  try {
    const root = DriveApp.getFolderById(ROOT_FOLDER_ID);
    const itens = [];
    scanFolder_(root, [], itens);
    const vistos = {};
    const unicos = itens.filter(function(item) {
      if (vistos[item.id]) return false;
      vistos[item.id] = true;
      return true;
    });

    // Mantém os dois formatos para compatibilidade com versões antigas e novas
    // do JogaHub.
    const files = unicos.map(item => ({
      id: item.id,
      name: item.nome,
      mime: item.mime,
      size: item.tamanho,
      path: item.caminho,
      url: item.link,
      player: item.player,
      resourceKey: item.resourceKey || '',
      updated: item.atualizado
    }));

    return output_(e, {
      sucesso: true,
      ok: true,
      atualizado: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pastaRaiz: root.getName(),
      total: unicos.length,
      duplicadosIgnorados: itens.length - unicos.length,
      itens: unicos,
      files: files,
      errors: []
    });
  } catch (err) {
    return output_(e, {
      sucesso: false,
      ok: false,
      erro: String(err && err.message ? err.message : err),
      error: String(err && err.message ? err.message : err),
      itens: [],
      files: []
    });
  }
}

function scanFolder_(folder, pathParts, out) {
  const currentParts = pathParts.concat(folder.getName());
  const currentPath = currentParts.join('/');

  const files = folder.getFiles();
  while (files.hasNext()) {
    const file = files.next();
    const name = file.getName();
    const mime = file.getMimeType();

    // 'application/octet-stream' sozinho inclui SRT e atalhos: nunca é suficiente.
    const supportedName=/\.(mp4|mkv|webm|mov|avi|m4v|ogv|wmv|flv|mpeg|mpg|3gp|ts|m2ts)$/i.test(name);
    const knownNonVideo=/\.(srt|vtt|ass|ssa|sub|ttml|sbv|website|html?|txt|json|pdf|zip|url)$/i.test(name);
    const hasOtherExtension=/\.[a-z0-9]{1,8}$/i.test(name);
    const isVideo=!knownNonVideo&&(supportedName||(!hasOtherExtension&&/^video\//i.test(mime)));

    if (!isVideo) continue;

    const id = file.getId();
    let resourceKey='';
    try {
      // Apenas chaves de arquivos intencionalmente compartilhados por link.
      // Nunca publicar chaves de arquivos restritos no endpoint acessível a visitantes.
      const sharing=file.getSharingAccess();
      if (sharing===DriveApp.Access.ANYONE_WITH_LINK || sharing===DriveApp.Access.ANYONE) {
        resourceKey=String(file.getResourceKey()||'');
      }
    } catch (_) { /* Metadados de compartilhamento podem estar indisponíveis. */ }
    const sharedSuffix=resourceKey?'?resourcekey='+encodeURIComponent(resourceKey):'';
    out.push({
      id: id,
      nome: name,
      titulo: cleanTitle_(name),
      mime: mime,
      pasta: folder.getName(),
      caminho: currentPath,
      tamanho: file.getSize(),
      atualizado: file.getLastUpdated().toISOString(),
      resourceKey: resourceKey,
      player: 'https://drive.google.com/file/d/' + id + '/preview' + sharedSuffix,
      link: 'https://drive.google.com/file/d/' + id + '/view' + sharedSuffix
    });
  }

  const folders = folder.getFolders();
  while (folders.hasNext()) {
    scanFolder_(folders.next(), currentParts, out);
  }
}

function cleanTitle_(name) {
  return String(name || '')
    .replace(/\.(mp4|mkv|webm|mov|avi|m4v|ogv|mpeg|mpg|3gp)$/i, '')
    .replace(/[._]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function output_(e, obj) {
  const callback = String(
    (e && e.parameter && (e.parameter.callback || e.parameter.prefix)) || ''
  ).trim();

  const json = JSON.stringify(obj);

  // JSONP é um fallback útil quando o navegador bloquear fetch/CORS.
  // Só aceita um identificador simples para não permitir injeção de código.
  if (callback && /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(callback)) {
    return ContentService
      .createTextOutput(callback + '(' + json + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}