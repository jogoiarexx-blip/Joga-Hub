/**
 * JogaHub — Google Drive Sync 1.2.49
 * Sem Drive API / sem API key: usa DriveApp do Google Apps Script.
 * Varre recursivamente a pasta principal e todas as subpastas.
 * Inclui cache curto e trava para evitar varreduras simultâneas.
 */
const ROOT_FOLDER_ID = '1FpJ__h7dTKpD-VOTl3WUIgpBBUc4vhut';
const CACHE_SECONDS = 120;
const CACHE_KEY = 'jogahub-drive-catalog-v2';

function doGet(e) {
  const requested = String((e && e.parameter && e.parameter.folderId) || '').trim();
  if (requested && requested !== ROOT_FOLDER_ID) {
    return output_(e, {ok:false,sucesso:false,error:'folderId não autorizado',erro:'folderId não autorizado',files:[],itens:[]});
  }

  const force = String((e && e.parameter && e.parameter.refresh) || '') === '1';
  const cache = CacheService.getScriptCache();
  if (!force) {
    const cached = cache.get(CACHE_KEY);
    if (cached) {
      try {
        const payload = JSON.parse(cached);
        payload.cached = true;
        return output_(e, payload);
      } catch (_) {}
    }
  }

  const lock = LockService.getScriptLock();
  let locked = false;
  const started = Date.now();
  try {
    locked = lock.tryLock(5000);

    // Outro acesso pode ter terminado a varredura enquanto aguardávamos a trava.
    if (!force) {
      const cachedAfterWait = cache.get(CACHE_KEY);
      if (cachedAfterWait) {
        const payload = JSON.parse(cachedAfterWait);
        payload.cached = true;
        return output_(e, payload);
      }
    }

    const root = DriveApp.getFolderById(ROOT_FOLDER_ID);
    const itens = [];
    scanFolder_(root, [], itens);
    itens.sort((a,b) => String(b.atualizado||'').localeCompare(String(a.atualizado||'')) || Number(b.tamanho||0)-Number(a.tamanho||0));

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

    const now = new Date().toISOString();
    const payload = {
      sucesso:true,
      ok:true,
      version:'1.2.49',
      atualizado:now,
      updatedAt:now,
      pastaRaiz:root.getName(),
      total:itens.length,
      scanMs:Date.now()-started,
      cached:false,
      itens,
      files,
      errors:[]
    };

    const json = JSON.stringify(payload);
    // CacheService aceita valores relativamente pequenos. Acervos maiores
    // continuam funcionando normalmente, apenas sem o cache intermediário.
    if (json.length < 90000) cache.put(CACHE_KEY, json, CACHE_SECONDS);
    return output_(e, payload);
  } catch (err) {
    return output_(e, {
      sucesso:false,
      ok:false,
      erro:String(err && err.message ? err.message : err),
      error:String(err && err.message ? err.message : err),
      itens:[],
      files:[]
    });
  } finally {
    if (locked) {
      try { lock.releaseLock(); } catch (_) {}
    }
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
      id,
      nome:name,
      titulo:cleanTitle_(name),
      mime,
      pasta:folder.getName(),
      caminho:currentPath,
      tamanho:file.getSize(),
      atualizado:file.getLastUpdated().toISOString(),
      player:'https://drive.google.com/file/d/' + id + '/preview',
      link:'https://drive.google.com/file/d/' + id + '/view'
    });
  }

  const folders = folder.getFolders();
  while (folders.hasNext()) scanFolder_(folders.next(), currentParts, out);
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

  if (callback && /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(callback)) {
    return ContentService
      .createTextOutput(callback + '(' + json + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}
