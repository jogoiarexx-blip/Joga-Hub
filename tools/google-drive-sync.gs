/**
 * JogaHub — Google Drive Sync 1.2.43
 * Varre recursivamente somente o acervo principal configurado.
 */
const ROOT_FOLDERS = [
  {id:'1FpJ__h7dTKpD-VOTl3WUIgpBBUc4vhut', name:'Filmes e Séries'}
];

function doGet(e) {
  const roots = ROOT_FOLDERS;
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
