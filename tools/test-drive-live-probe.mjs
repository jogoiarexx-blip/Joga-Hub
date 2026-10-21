import test from 'node:test';
import assert from 'node:assert/strict';
import {classifyProbe,probeDrive,parseContentRange,evaluateRange} from './drive-live-probe.mjs';

test('falhas reais do Drive são classificadas sem confundir login e codec',()=>{
  assert.equal(classifyProbe(403,'video/mp4'),'access');
  assert.equal(classifyProbe(404,'text/html'),'missing');
  assert.equal(classifyProbe(429,'text/plain'),'limited');
  assert.equal(classifyProbe(200,'text/html','','accounts.google.com'),'login-or-response');
  assert.equal(classifyProbe(206,'application/octet-stream','bytes 0-4095/9000000'),'byte-range');
  assert.equal(classifyProbe(200,'video/mp4'),'media-headers-no-range');
  assert.equal(classifyProbe(206,'application/octet-stream','','drive.google.com'),'invalid-range');
});

test('sondagem lê só HEAD e cabeçalhos de 4 KiB via GET sem baixar corpo',async()=>{
  const seen=[],cancelled=[];
  const fake=async(url,opts)=>{
    const range=opts.headers.Range||'';
    seen.push({method:opts.method,range,host:url.hostname,key:url.searchParams.get('resourcekey')});
    const requested=opts.headers.Range||'bytes=0-4095';
    const match=/^bytes=(\d+)-(\d+)$/.exec(requested);
    const start=Number(match?.[1]||0),end=Number(match?.[2]||4095);
    const headers=opts.method==='HEAD'?new Map([['content-type','video/mp4']]):new Map([
      ['content-type','application/octet-stream'],['content-range','bytes '+start+'-'+end+'/9000000'],['content-length',String(end-start+1)]]);
    return {status:opts.method==='HEAD'?200:206,headers:{get:k=>headers.get(k)||''},
      url:'https://drive.usercontent.google.com/download',
      body:{cancel:async()=>{cancelled.push(opts.method)}}};
  };
  const r=await probeDrive('qa-drive-media-test-01',fake,'hidden-resource-key');
  assert.equal(r.usable,true);
  assert.equal(r.range.kind,'byte-range');
  assert.deepEqual(seen.map(x=>x.method),['HEAD','GET','GET']);
  assert.equal(r.distantSeek,true);
  assert.equal(r.verifiedRange,true);
  assert.equal(seen[1].range,'bytes=0-4095');
  assert.equal(seen[1].key,'hidden-resource-key');
  assert.deepEqual(cancelled,['HEAD','GET','GET']);
});

test('sondagem inválida não faz requisições',async()=>{
  let hits=0;
  await assert.rejects(probeDrive('../bad',()=>{hits++;throw Error('network')}),/inválido/);
  assert.equal(hits,0);
});


test('Range valida total, início, fim e comprimento antes de confirmar seeking',()=>{
  assert.deepEqual(parseContentRange('bytes 2048-4095/9000000'),{start:2048,end:4095,total:9000000});
  assert.equal(parseContentRange('bytes 500-100/10000'),null);
  assert.equal(parseContentRange('bytes 0-900/400'),null);
  assert.equal(parseContentRange('bytes nonsense'),null);
  assert.equal(evaluateRange({status:206,range:'bytes 0-4095/9000000',length:'4096'},0).ok,true);
  assert.equal(evaluateRange({status:206,range:'bytes 0-4095/9000000',length:'4096'},4500000).reason,'wrong-offset');
  assert.equal(evaluateRange({status:206,range:'bytes 0-4095/9000000',length:'123'},0).reason,'length-mismatch');
  assert.equal(evaluateRange({status:200,kind:'media-headers-no-range'},0).ok,false);
  assert.equal(classifyProbe(206,'video/mp4','garbled'),'invalid-range');
  assert.equal(classifyProbe(416,'video/mp4'),'range-rejected');
});

test('servidor que ignora Range não é declarado seekable',async()=>{
  let gets=0;
  const fake=async(url,opts)=>{
    if(opts.method==='GET')gets++;
    return {status:200,headers:{get:k=>k==='content-type'?'video/mp4':''},url:url.href,body:{cancel:async()=>{}}};
  };
  const result=await probeDrive('qa-drive-media-test-01',fake);
  assert.equal(result.usable,false);
  assert.equal(result.verifiedRange,false);
  assert.equal(result.distantSeek,null);
  assert.equal(gets,1);
});

test('servidor sem suporte a HEAD ainda pode comprovar Range por GET',async()=>{
  const fake=async(url,opts)=>{
    if(opts.method==='HEAD')throw new Error('Method Not Allowed');
    return {status:206,headers:{get:k=>({
      'content-type':'video/mp4','content-range':'bytes 0-4095/9000000','content-length':'4096'
    })[k]||''},url:url.href,body:{cancel:async()=>{}}};
  };
  // Segundo GET em posição distante recebe Range do começo: verificação falha.
  const result=await probeDrive('qa-drive-media-test-01',fake);
  assert.equal(result.head,null);
  assert.equal(result.headError,'unavailable');
  assert.equal(result.usable,true);
  assert.equal(result.verifiedRange,false);
  assert.equal(result.rangeReason,'wrong-offset');
});

test('HTTP 403 ou 429 nunca faz sondagem distante',async()=>{
  let gets=0;
  const fake=async(url,opts)=>{
    if(opts.method==='GET')gets++;
    return {status:403,headers:{get:()=> 'text/html'},url:url.href,body:{cancel:async()=>{}}};
  };
  const result=await probeDrive('qa-drive-media-test-01',fake);
  assert.equal(gets,1);
  assert.equal(result.usable,false);
  assert.equal(result.range.kind,'access');
});
