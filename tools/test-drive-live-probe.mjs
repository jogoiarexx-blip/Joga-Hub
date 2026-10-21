import test from 'node:test';
import assert from 'node:assert/strict';
import {classifyProbe,probeDrive} from './drive-live-probe.mjs';

test('falhas reais do Drive são classificadas sem confundir login e codec',()=>{
  assert.equal(classifyProbe(403,'video/mp4'),'access');
  assert.equal(classifyProbe(404,'text/html'),'missing');
  assert.equal(classifyProbe(429,'text/plain'),'limited');
  assert.equal(classifyProbe(200,'text/html','','accounts.google.com'),'login-or-response');
  assert.equal(classifyProbe(206,'application/octet-stream','bytes 0-4095/9000000'),'byte-range');
  assert.equal(classifyProbe(200,'video/mp4'),'media-headers-no-range');
  assert.equal(classifyProbe(206,'application/octet-stream','','drive.google.com'),'unconfirmed');
});

test('sondagem lê só HEAD e cabeçalhos de 4 KiB via GET sem baixar corpo',async()=>{
  const seen=[],cancelled=[];
  const fake=async(url,opts)=>{
    const range=opts.headers.Range||'';
    seen.push({method:opts.method,range,host:url.hostname,key:url.searchParams.get('resourcekey')});
    const headers=opts.method==='HEAD'?new Map([['content-type','video/mp4']]):new Map([
      ['content-type','application/octet-stream'],['content-range','bytes 0-4095/9000000'],['content-length','4096']]);
    return {status:opts.method==='HEAD'?200:206,headers:{get:k=>headers.get(k)||''},
      url:'https://drive.usercontent.google.com/download',
      body:{cancel:async()=>{cancelled.push(opts.method)}}};
  };
  const r=await probeDrive('qa-drive-media-test-01',fake,'hidden-resource-key');
  assert.equal(r.usable,true);
  assert.equal(r.range.kind,'byte-range');
  assert.deepEqual(seen.map(x=>x.method),['HEAD','GET']);
  assert.equal(seen[1].range,'bytes=0-4095');
  assert.equal(seen[1].key,'hidden-resource-key');
  assert.deepEqual(cancelled,['HEAD','GET']);
});

test('sondagem inválida não faz requisições',async()=>{
  let hits=0;
  await assert.rejects(probeDrive('../bad',()=>{hits++;throw Error('network')}),/inválido/);
  assert.equal(hits,0);
});
