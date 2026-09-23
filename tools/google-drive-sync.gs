/**
 * JogaHub — Google Drive Sync 1.3.1
 * Sem API key. Usa DriveApp e funciona como Web App do Apps Script.
 * Varre a pasta principal e subpastas, com cache em blocos e trava real.
 */
const ROOT_FOLDER_ID = '1FpJ__h7dTKpD-VOTl3WUIgpBBUc4vhut';
const CACHE_SECONDS = 180;
const CACHE_PREFIX = 'jogahub-drive-v3';
const CACHE_META_KEY = CACHE_PREFIX + ':meta';
const CACHE_CHUNK_CHARS = 70000;

function doGet(e) {
  const requested = String((e && e.parameter && e.parameter.folderId) || '').trim();
  if (requested && requested !== ROOT_FOLDER_ID) {
    return output_(e, {
      ok:false,
      sucesso:false,
      error:'folderId não autorizado',
      erro:'folderId não autorizado',
      files:[]
    });
  }

  const force = String((e && e.parameter && e.parameter.refresh) || '') === '1';
  const cache = CacheService.getScriptCache();

  if (!force) {
    const cached = readCachedPayload_(cache);
    if (cached) {
      cached.cached = true;
      return output_(e, cached);
    }
  }

  const lock = LockService.getScriptLock();
  const started = Date.now();
  let locked = false;

  try {
    locked = lock.tryLock(5000);

    if (!locked) {
      const cachedWhileBusy = readCachedPayload_(cache);
      if (cachedWhileBusy) {
        cachedWhileBusy.cached = true;
        cachedWhileBusy.busy = true;
        return output_(e, cachedWhileBusy);
      }
      return output_(e, {
        ok:false,
        sucesso:false,
        busy:true,
        error:'Sincronização do Drive já está em andamento. Tente novamente em instantes.',
        erro:'Sincronização do Drive já está em andamento. Tente novamente em instantes.',
        files:[]
      });
    }

    if (!force) {
      const cachedAfterLock = readCachedPayload_(cache);
      if (cachedAfterLock) {
        cachedAfterLock.cached = true;
        return output_(e, cachedAfterLock);
      }
    }

    const root = DriveApp.getFolderById(ROOT_FOLDER_ID);
    const files = [];
    const visited = {};
    scanFolder_(root, [], files, visited, 0);

    files.sort(function(a,b) {
      const byUpdated = String(b.updated || '').localeCompare(String(a.updated || ''));
      if (byUpdated) return byUpdated;
      return Number(b.size || 0) - Number(a.size || 0);
    });

    const now = new Date().toISOString();
    const payload = {
      sucesso:true,
      ok:true,
      version:'1.3.1',
      atualizado:now,
      updatedAt:now,
      pastaRaiz:root.getName(),
      total:files.length,
      scanMs:Date.now()-started,
      cached:false,
      files:files,
      errors:[]
    };

    writeCachedPayload_(cache, payload);
    return output_(e, payload);
  } catch (err) {
    return output_(e, {
      sucesso:false,
      ok:false,
      erro:String(err && err.message ? err.message : err),
      error:String(err && err.message ? err.message : err),
      files:[]
    });
  } finally {
    if (locked) {
      try { lock.releaseLock(); } catch (_) {}
    }
  }
}

function scanFolder_(folder, pathParts, out, visited, depth) {
  if (depth > 40) return;

  const folderId = folder.getId();
  if (visited[folderId]) return;
  visited[folderId] = true;

  const currentParts = pathParts.concat(folder.getName());
  const currentPath = currentParts.join('/');

  const fileIterator = folder.getFiles();
  while (fileIterator.hasNext()) {
    const file = fileIterator.next();
    const name = file.getName();
    const mime = file.getMimeType();

    if (!isVideo_(name, mime)) continue;

    const id = file.getId();
    out.push({
      id:id,
      name:name,
      mime:mime,
      size:file.getSize(),
      path:currentPath,
      url:'https://drive.google.com/file/d/' + id + '/view',
      player:'https://drive.google.com/file/d/' + id + '/preview',
      updated:file.getLastUpdated().toISOString()
    });
  }

  const folderIterator = folder.getFolders();
  while (folderIterator.hasNext()) {
    scanFolder_(folderIterator.next(), currentParts, out, visited, depth + 1);
  }
}

function isVideo_(name, mime) {
  return /^video\//i.test(mime) ||
    mime === 'application/octet-stream' ||
    /\.(mp4|mkv|webm|mov|avi|m4v|ogv|mpeg|mpg|3gp)$/i.test(name);
}

function splitFilesIntoChunks_(files) {
  const chunks = [];
  let current = [];
  let currentChars = 2;

  for (let i = 0; i < files.length; i++) {
    const item = files[i];
    const itemText = JSON.stringify(item);
    const extra = itemText.length + (current.length ? 1 : 0);

    if (current.length && currentChars + extra > CACHE_CHUNK_CHARS) {
      chunks.push(current);
      current = [];
      currentChars = 2;
    }

    current.push(item);
    currentChars += extra;
  }

  if (current.length || !chunks.length) chunks.push(current);
  return chunks;
}

function writeCachedPayload_(cache, payload) {
  try {
    const chunks = splitFilesIntoChunks_(payload.files || []);
    const values = {};

    for (let i = 0; i < chunks.length; i++) {
      values[CACHE_PREFIX + ':chunk:' + i] = JSON.stringify(chunks[i]);
    }

    cache.putAll(values, CACHE_SECONDS);
    cache.put(CACHE_META_KEY, JSON.stringify({
      version:payload.version,
      updatedAt:payload.updatedAt,
      pastaRaiz:payload.pastaRaiz,
      total:payload.total,
      scanMs:payload.scanMs,
      chunks:chunks.length
    }), CACHE_SECONDS);
  } catch (err) {
    console.warn('Falha ao gravar cache do catálogo: ' + err);
  }
}

function readCachedPayload_(cache) {
  try {
    const metaText = cache.get(CACHE_META_KEY);
    if (!metaText) return null;

    const meta = JSON.parse(metaText);
    const count = Number(meta.chunks || 0);
    if (count <= 0) return null;

    const keys = [];
    for (let i = 0; i < count; i++) keys.push(CACHE_PREFIX + ':chunk:' + i);

    const values = cache.getAll(keys);
    const files = [];

    for (let i = 0; i < keys.length; i++) {
      const chunkText = values[keys[i]];
      if (!chunkText) return null;
      const chunk = JSON.parse(chunkText);
      if (!Array.isArray(chunk)) return null;
      for (let j = 0; j < chunk.length; j++) files.push(chunk[j]);
    }

    return {
      sucesso:true,
      ok:true,
      version:String(meta.version || '1.3.1'),
      atualizado:String(meta.updatedAt || ''),
      updatedAt:String(meta.updatedAt || ''),
      pastaRaiz:String(meta.pastaRaiz || 'Google Drive'),
      total:Number(meta.total || files.length),
      scanMs:Number(meta.scanMs || 0),
      cached:true,
      files:files,
      errors:[]
    };
  } catch (err) {
    console.warn('Falha ao ler cache do catálogo: ' + err);
    return null;
  }
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
