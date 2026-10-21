import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {isVideoFile,isSubtitleFile,missingFileIds} from './drive-snapshot-policy.mjs';

const window={};
vm.runInNewContext(await readFile('js/drive-media-policy.js','utf8'),{window});
const browser=window.JOGAHUB_DRIVE_MEDIA_POLICY;
const fixture=[
  {name:'S01E01.mkv',mime:'application/octet-stream',kind:'video'},
  {name:'filme.mp4',mime:'video/mp4',kind:'video'},
  {name:'filme.webm',mime:'video/webm',kind:'video'},
  {name:'filme sem extensão',mime:'video/mp4',kind:'video'},
  {name:'S03E01.srt',mime:'application/octet-stream',kind:'subtitle'},
  {name:'episodio.vtt',mime:'text/vtt',kind:'subtitle'},
  {name:'subs.ass',mime:'application/octet-stream',kind:'subtitle'},
  {name:'Atalho.website',mime:'application/octet-stream',kind:'other'},
  {name:'README.txt',mime:'application/octet-stream',kind:'other'},
  {name:'documento.pdf',mime:'application/pdf',kind:'other'},
  {name:'arquivo desconhecido.xyz',mime:'application/octet-stream',kind:'other'}
];
for(const f of fixture){
  test('classificação '+f.name,()=>{
    assert.equal(isVideoFile(f),f.kind==='video');
    assert.equal(browser.isVideo(f),f.kind==='video');
    assert.equal(isSubtitleFile(f),f.kind==='subtitle');
    assert.equal(browser.isSubtitle(f),f.kind==='subtitle');
  });
}

test('snapshot não contém legendas nem atalhos classificados como vídeos',async()=>{
  const text=await readFile('js/drive-snapshot.js','utf8');
  const match=text.match(/window\.JOGAHUB_DRIVE_SNAPSHOT\s*=\s*(\[[\s\S]*\]);?\s*$/);
  assert.ok(match,'snapshot deve ser JSON válido');
  const entries=JSON.parse(match[1]);
  assert.ok(entries.length>0,'acervo de filmes não deve desaparecer');
  const invalid=entries.filter(f=>!isVideoFile(f));
  assert.deepEqual(invalid.map(f=>f.name),[],'snapshot deve conter apenas vídeos');
  assert.ok(entries.some(f=>/\.mkv$/i.test(f.name)));
  assert.ok(entries.some(f=>/\.mp4$/i.test(f.name)));
  assert.equal(/resourcekey=/i.test(text),false,'snapshot público não pode conter chave em URLs');
});

test('a proteção de exclusão ignora SRT mas preserva filmes perdidos',()=>{
  const before=[{id:'filme-1',name:'filme-1.mp4'},{id:'legenda-1',name:'episodio.srt'}];
  const after=[{id:'filme-2',name:'filme-2.mp4'}];
  const missing=missingFileIds(before.filter(isVideoFile),after);
  assert.deepEqual(missing,['filme-1']);
});

test('Apps Script exporta chaves somente de links compartilhados e não aceita octet genérico',async()=>{
  const source=await readFile('tools/google-drive-sync.gs','utf8');
  assert.match(source,/getSharingAccess\(\)/);
  assert.match(source,/getResourceKey\(\)/);
  assert.match(source,/supportedName/);
  assert.doesNotMatch(source,/mime === 'application\/octet-stream' \|\|/);
});
