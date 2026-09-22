/**
 * JogaHub — Google Drive Sync 1.2.41
 * Varre recursivamente todos os acervos configurados.
 */
const ROOT_FOLDERS = [
  {id:'1QmY3xIAk4AWVgRzcaTzAuKPdVrL9k6H_', name:'Acervo Drive 1'},
  {id:'1XiSyDV7cLNMaLDjbCdeR-VCP_KWK9C3W', name:'Acervo Drive 2'},
  {id:'1FpJ__h7dTKpD-VOTl3WUIgpBBUc4vhut', name:'Filmes e Séries'},
  {id:'1F2_t5aERWvGfOL_4VxWMgEDiwoBbZRc1', name:'Clássicos / DC'},
  {id:'1NCDe9l_-S_XAd8LYIxoarKqdkHJu8sse', name:'O Cavaleiro dos Sete Reinos'}
];

function doGet(e) {
  const requested = String(e && e.parameter && e.parameter.folderId || '').trim();
  const roots = requested
    ? ROOT_FOLDERS.filter(r => r.id === requested).concat(ROOT_FOLDERS.every(r => r.id !== requested) ? [{id:requested,name:'Pasta solicitada'}] : [])
    : ROOT_FOLDERS;
  const files = [];
  const folders = [];
  const errors = [];
  roots.forEach(root => {
    try {
      const folder = DriveApp.getFolderById(root.id);
      const before = files.length;
      scanFolder_(folder, '', files);
      folders.push({id:root.id,name:root.name,files:files.length-before,ok:true});
    } catch (err) {
      errors.push({id:root.id,name:root.name,error:String(err)});
    }
  });
  return json_({ok:true,files:files,folders:folders,errors:errors,total:files.length,updatedAt:new Date().toISOString()});
}

function scanFolder_(folder, path, out) {
  const current = path ? path + '/' + folder.getName() : folder.getName();
  const it = folder.getFiles();
  while (it.hasNext()) {
    const f = it.next();
    const mime = f.getMimeType();
    const name = f.getName();
    const isVideo = /^video\//i.test(mime) || mime === 'application/octet-stream' ||
      /\.(mp4|mkv|webm|mov|avi|m4v|ogv|mpeg|mpg|3gp)$/i.test(name);
    if (!isVideo) continue;
    out.push({
      id:f.getId(), name:name, mime:mime, size:f.getSize(), path:current,
      url:'https://drive.google.com/file/d/' + f.getId() + '/view?usp=sharing',
      updated:f.getLastUpdated().toISOString()
    });
  }
  const dirs = folder.getFolders();
  while (dirs.hasNext()) scanFolder_(dirs.next(), current, out);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}