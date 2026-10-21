// Execute: node --test tests/drive-format.test.cjs
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const root={};
vm.runInNewContext(fs.readFileSync('js/player-drive-core.js','utf8'),{window:root});
vm.runInNewContext(fs.readFileSync('js/player-drive-diagnostics.js','utf8'),{window:root,AbortController,setTimeout,clearTimeout});
const core=root.JOGAHUB_PLAYER_DRIVE_CORE;
const diagnostics=root.JOGAHUB_DRIVE_DIAGNOSTICS;
test('detecta contêineres que exigem modo compatível',()=>{
  for(const ext of ['mkv','avi','wmv','flv','mov','ts','m2ts','mpeg','mpg','3gp'])
    assert.equal(core.needsCompatiblePlayer('arquivo.'+ext,''),true,ext);
});
test('MP4/WebM/Ogg continuam reproduzíveis diretamente',()=>{
  assert.equal(core.needsCompatiblePlayer('video.mp4',''),false);
  assert.equal(core.directMime('video.mp4',''),'video/mp4');
  assert.equal(core.directMime('video.webm',''),'video/webm');
  assert.equal(core.directMime('video.ogv',''),'video/ogg');
});
test('arquivo sem tipo conhecido não é declarado MP4',()=>{
  for(const name of ['sem-extensao','video.xyz','video.mkv'])
    assert.equal(core.directMime(name,''),'',name);
});
test('MIME válido sem extensão continua reconhecido',()=>{
  assert.equal(core.directMime('arquivo','video/mp4'),'video/mp4');
});
test('tipo desconhecido exige player compatível',()=>{
  assert.equal(diagnostics.directCapability({canPlayType:()=> 'probably'},''),false);
  assert.equal(diagnostics.directCapability({canPlayType:()=> ''},'video/webm'),false);
  assert.equal(diagnostics.directCapability({canPlayType:()=> 'probably'},'video/webm'),true);
});
