/* Smoke de um arquivo PUBLICAMENTE compartilhado do Google Drive.
 * Um máximo de duas requisições GET Range de 4 KiB; nunca faz download completo.
 * Não registra URLs ou resourcekeys nem comprova reprodução, áudio ou codec.
 */
import {pathToFileURL} from 'node:url';

export function parseContentRange(header){
  const match=/^bytes\s+(\d+)-(\d+)\/(\d+|\*)$/i.exec(String(header||'').trim());
  if(!match)return null;
  const start=Number(match[1]),end=Number(match[2]),total=match[3]==='*'?null:Number(match[3]);
  if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||end<start||
     (total!==null&&(!Number.isSafeInteger(total)||total<=end)))return null;
  return {start,end,total};
}
export function classifyProbe(status,contentType='',range='',host=''){
  const mime=String(contentType).split(';')[0].trim().toLowerCase();
  if(status===401||status===403)return 'access';
  if(status===404||status===410)return 'missing';
  if(status===429||status===503)return 'limited';
  if(/(^|\.)accounts\.google\.com$/i.test(host)||['text/html','application/json','text/plain'].includes(mime))
    return 'login-or-response';
  if(status===416)return 'range-rejected';
  if(status===206)return parseContentRange(range)?'byte-range':'invalid-range';
  if(status===200&&mime.startsWith('video/'))return 'media-headers-no-range';
  return 'unconfirmed';
}
export function evaluateRange(response,requestedStart=0,maxBytes=4096,requestedEnd=null){
  if(!response||response.status!==206)return {ok:false,reason:response?.kind||'unconfirmed'};
  if(response.kind&&response.kind!=='byte-range')return {ok:false,reason:response.kind};
  const parsed=parseContentRange(response.range);
  if(!parsed)return {ok:false,reason:'invalid-range'};
  if(parsed.start!==requestedStart)return {ok:false,reason:'wrong-offset'};
  if(parsed.end-parsed.start+1>maxBytes)return {ok:false,reason:'oversized-range'};
  if(requestedEnd!==null){
    const expected=parsed.total===null?requestedEnd:Math.min(requestedEnd,parsed.total-1);
    if(parsed.end!==expected)return {ok:false,reason:'wrong-end'};
  }
  if(response.length&&Number.isFinite(Number(response.length))&&
     Number(response.length)!==parsed.end-parsed.start+1)
    return {ok:false,reason:'length-mismatch'};
  return {ok:true,total:parsed.total,start:parsed.start,end:parsed.end};
}
export function planRangeChecks(total,chunk=4096){
  if(!Number.isSafeInteger(total)||total<=2*1024*1024)return [];
  const seen=new Set([0]);
  return [.25,.5,.9].map(percent=>{
    const start=Math.floor((total*percent)/chunk)*chunk;
    const end=Math.min(total-1,start+chunk-1);
    return {percent:Math.round(percent*100),start,end};
  }).filter(entry=>{
    if(seen.has(entry.start))return false;
    seen.add(entry.start);return true;
  });
}
export async function probeDrive(fileId,fetcher=fetch,resourceKey=''){
  if(!/^[A-Za-z0-9_-]{8,200}$/.test(String(fileId)))throw new Error('ID público inválido');
  const url=new URL('https://drive.usercontent.google.com/download');
  url.searchParams.set('id',fileId);
  url.searchParams.set('export','download');
  if(resourceKey)url.searchParams.set('resourcekey',resourceKey);
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),26000);
  const inspect=async(method,headers={})=>{
    const response=await fetcher(url,{method,headers,signal:controller.signal,redirect:'follow',cache:'no-store'});
    const host=new URL(response.url||url).hostname;
    const data={status:response.status,contentType:response.headers?.get?.('content-type')||'',
      range:response.headers?.get?.('content-range')||'',
      length:response.headers?.get?.('content-length')||'',
      redirectHost:host};
    // Nunca ler o corpo. A solicitação Range pede no máximo 4 KiB,
    // mas a origem pode ignorá-la. Cancelar imediatamente nesses casos.
    try{await response.body?.cancel?.()}catch{}
    data.kind=classifyProbe(data.status,data.contentType,data.range,host);
    return data;
  };
  try{
    let head=null,headError='';
    try{head=await inspect('HEAD')}catch(error){
      headError=error?.name==='AbortError'?'timeout':'unavailable';
      // Alguns provedores não respondem a HEAD, mas respondem a GET Range.
    }
    const first=await inspect('GET',{Range:'bytes=0-4095'});
    const firstValid=evaluateRange(first,0,4096,4095);
    const checks=[],plan=firstValid.ok?planRangeChecks(firstValid.total):[];
    for(const check of plan){
      const response=await inspect('GET',{Range:'bytes='+check.start+'-'+check.end});
      let result=evaluateRange(response,check.start,4096,check.end);
      if(result.ok&&firstValid.total!==null&&result.total!==firstValid.total)
        result={ok:false,reason:'size-changed'};
      checks.push({percent:check.percent,start:check.start,end:check.end,
        response,ok:result.ok,reason:result.ok?'ok':result.reason});
      // Permissão ou limitação após um seek é condição terminal; não repetir.
      if(!result.ok)break;
    }
    const fail=checks.find(c=>!c.ok);
    const allChecked=checks.length===plan.length;
    const verified=firstValid.ok&&allChecked&&!fail;
    const middle=checks.find(c=>c.percent===50)||null;
    return {
      head,headError,range:first,distant:middle?.response||null,
      checks,plannedPercents:plan.map(p=>p.percent),
      usable:firstValid.ok,
      distantSeek:plan.length?(verified?true:false):null,
      verifiedRange:!!verified,
      rangeReason:firstValid.ok?(fail?.reason||(!allChecked?'incomplete':'ok')):firstValid.reason
    };
  }finally{clearTimeout(timer);controller.abort()}
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  const id=String(process.argv[2]||process.env.DRIVE_QA_PUBLIC_FILE_ID||'').trim();
  const key=String(process.env.DRIVE_QA_RESOURCE_KEY||'').trim();
  if(!id){
    console.log('::error::Informe um ID público para executar o teste real; nenhum arquivo foi verificado.');
    process.exitCode=2;
  }else{
    try{
      const result=await probeDrive(id,fetch,key);
      console.log('Drive público — resposta HEAD:',JSON.stringify(result.head));
      console.log('Drive público — amostra com Range:',JSON.stringify(result.range));
      for(const entry of result.checks)console.log('Drive público — '+entry.percent+'% dos bytes:',JSON.stringify({status:entry.response.status,kind:entry.response.kind,range:entry.response.range,ok:entry.ok,reason:entry.reason}));
      console.log('Drive público — validação Range:',result.rangeReason);
      if(!result.usable){
        console.log('::warning::Arquivo não comprovadamente acessível pelo endpoint de download. Não inferir acesso ao player iframe ou ao codec.');
        process.exitCode=1;
      }else if(!result.verifiedRange){
        console.log('::warning::Origem não confirmou HTTP Range em todos os pontos solicitados; seek pode falhar.');
      }else{
        console.log('::notice::HTTP Range validado para posições de bytes: '+(result.plannedPercents.join(', ')||'início')+'. Esses percentuais NÃO são posições temporais. Decodificação, áudio e retomada requerem teste em navegador.');
      }
    }catch(error){
      console.log('::error::Teste real indisponível: '+(error?.name||'Error')+' — '+(error?.message||'erro de rede'));
      process.exitCode=1;
    }
  }
}
