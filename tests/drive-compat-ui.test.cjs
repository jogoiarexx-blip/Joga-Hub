const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync('link-player.html','utf8');
const app=fs.readFileSync('js/player-app.js','utf8');
test('modo compatível oferece opção oficial e recarregamento',()=>{
  assert.match(html,/id="driveCompatHelp"/);
  assert.match(html,/id="driveCompatOpen"/);
  assert.match(html,/id="driveCompatRetry"/);
  assert.match(app,/setTimeout\(showCompatibleHelp,12000\)/);
});
test('iframe incorpora preview e link externo usa view com identificador validado',()=>{
  assert.match(app,/DRIVE_ROUTES\.isValidFileId\(fileId\)/);
  assert.match(app,/\+'\/preview'\+resource/);
  assert.match(app,/\+'\/view'\+resource/);
});
test('carregamento de documento não é declarado reprodução confirmada',()=>{
  assert.match(app,/evento load do iframe confirma somente o documento/);
  assert.doesNotMatch(app,/frame\.addEventListener\('load',[^\n]*video\.play/);
});
