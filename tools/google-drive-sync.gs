/**
 * JogaHub — Google Drive Sync
 * Cole este arquivo em Google Apps Script.
 *
 * Publicação:
 * 1. Novo projeto em script.google.com
 * 2. Cole este arquivo.
 * 3. Implantar > Nova implantação > Aplicativo da Web.
 * 4. Executar como: você.
 * 5. Quem tem acesso: qualquer pessoa.
 * 6. Copie a URL /exec para o JogaHub.
 *
 * A pasta compartilhada precisa permitir acesso por link.
 */
const ROOT_FOLDERS = [
  '1QmY3xIAk4AWVgRzcaTzAuKPdVrL9k6H_',
  '1XiSyDV7cLNMaLDjbCdeR-VCP_KWK9C3W',
  '1FpJ__h7dTKpD-VOTl3WUIgpBBUc4vhut',
  '1F2_t5aERWvGfOL_4VxWMgEDiwoBbZRc1'
];

function doGet(e) {
  try {
    const requested = String(e?.parameter?.folderId || '').trim();
    const roots = requested ? [requested] : ROOT_FOLDERS;
    const files = [];
    roots.forEach(id => scanFolder_(DriveApp.getFolderById(id), '', files));
    return json_({ok:true, files:files});
  } catch (err) {
    return json_({ok:false,error:String(err)});
  }
}

function scanFolder_(folder, path, out) {
  const current = path ? path + '/' + folder.getName() : folder.getName();
  const it = folder.getFiles();
  while (it.hasNext()) {
    const f = it.next();
    const mime = f.getMimeType();
    if (!/^video\//i.test(mime) && mime !== 'application/octet-stream') continue;
    out.push({
      id:f.getId(),
      name:f.getName(),
      mime:mime,
      size:f.getSize(),
      path:current,
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
