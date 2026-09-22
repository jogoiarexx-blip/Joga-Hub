/**
 * JogaHub — Google Drive Sync 1.2.45
 * Sem Drive API / sem API key: usa apenas DriveApp do Google Apps Script.
 * Varre recursivamente a pasta principal e todas as subpastas.
 */
const ROOT_FOLDER_ID = '1FpJ__h7dTKpD-VOTl3WUIgpBBUc4vhut';

function doGet(e) {
  try {
    const root = DriveApp.getFolderById(ROOT_FOLDER_ID);
    const itens = [];
    scanFolder_(root, [], itens);

    // Mantém os dois formatos para compatibilidade com versões antigas e novas
    // do JogaHub.
    const files = itens.map(item => ({
      id: item.id,
      name: item.nome,
      mime: item.mime,
      size: item.tamanho,
      path: item.caminho,
      url: item.link,
      player: item.player,
      updated: item.atualizado
    }));

    return output_(e, {
      sucesso: true,
      ok: true,
      atualizado: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pastaRaiz: root.getName(),
      total: itens.length,
      itens: itens,
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

    const isVideo = /^video\//i.test(mime) ||
      mime === 'application/octet-stream' ||
      /\.(mp4|mkv|webm|mov|avi|m4v|ogv|mpeg|mpg|3gp)$/i.test(name);

    if (!isVideo) continue;

    const id = file.getId();
    out.push({
      id: id,
      nome: name,
      titulo: cleanTitle_(name),
      mime: mime,
      pasta: folder.getName(),
      caminho: currentPath,
      tamanho: file.getSize(),
      atualizado: file.getLastUpdated().toISOString(),
      player: 'https://drive.google.com/file/d/' + id + '/preview',
      link: 'https://drive.google.com/file/d/' + id + '/view'
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
