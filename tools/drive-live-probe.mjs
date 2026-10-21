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
export function evaluateRange(response,requestedStart=0,maxBytes=4096){
  if(!response||response.status!==206)return {ok:false,reason:response?.kind||'unconfirmed'};
  const parsed=parseContentRange(response.range);
  if(!parsed)return {ok:false,reason:'invalid-range'};
  if(parsed.start!==requestedStart)return {ok:false,reason:'wrong-offset'};
  if(parsed.end-parsed.start+1>maxBytes)return {ok:false,reason:'oversized-range'};
  if(response.length&&Number.isFinite(Number(response.length))&&
     Number(response.length)!==parsed.end-parsed.start+1)
     return {ok:false,reason:'length-mismatch'};
  return {ok:true,total:parsed.total,start:parsed.start,end:parsed.end};
}
export async function probeDrive(fileId,fetcher=fetch,resourceKey=''){
  if(!/^[A-Za-z0-9_-]{8,200}$/.test(String(fileId)))throw new Error('ID público inválido');
  const url=new URL('https://drive.usercontent.google.com/download');
  url.searchParams.set('id',fileId);
  url.searchParams.set('export','download');
  if(resourceKey)url.searchParams.set('resourcekey',resourceKey);
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
  const inspect=async(method,headers={})=>{
    const response=await fetcher(url,{method,headers,signal:controller.signal,redirect:'follow',cache:'no-store'});
    const host=new URL(response.url||url).hostname;
    const data={status:response.status,contentType:response.headers?.get?.('content-type')||'',
      range:response.headers?.get?.('content-range')||'',
      length:response.headers?.get?.('content-length')||'',
      redirectHost:host};
    try{await response.body?.cancel?.()}catch{}
    data.kind=classifyProbe(data.status,data.contentType,data.range,host);
    return data;
  };
  try{
    let head=null,headError='';
    try{head=await inspect('HEAD')}catch(error){
      headError=error?.name==='AbortError'?'timeout':'unavailable';
      // HEAD não é obrigatório: alguns servidores o rejeitam, apesar do GET funcionar.
    }
    const first=await inspect('GET',{Range:'bytes=0-4095'});
    const firstValid=evaluateRange(first,0);
    let distant=null,distantValid=null;
    if(firstValid.ok&&firstValid.total!==null&&firstValid.total>2*1024*1024){
      // A segunda sondagem verifica se o servidor aceita uma posição distante.
      // Evita baixar um filme inteiro e nunca depende de conhecer duração/metadados.
      const start=Math.floor((firstValid.total/2)/4096)*4096;
      const end=Math.min(firstValid.total-1,start+4095);
      distant=await inspect('GET',{Range:`bytes=${start}-${end}`});
      distantValid=evaluateRange(distant,start);
    }
    return {
      head,headError,range:first,distant,
      usable:firstValid.ok,
      distantSeek:firstValid.ok&&(distant===null?null:!!distantValid?.ok),
      verifiedRange:firstValid.ok?(distantValid?.ok??true):false,
      rangeReason:firstValid.ok?(distantValid&&!distantValid.ok?distantValid.reason:'ok'):firstValid.reason
    };
  }finally{clearTimeout(timer);controller.abort()}
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  const id=String(process.argv[2]||process.env.DRIVE_QA_PUBLIC_FILE_ID||'').trim();
  const key=String(process.env.DRIVE_QA_RESOURCE_KEY||'').trim();
  if(!id){
    console.log('::notice::Teste do Drive real NÃO executado: informe um ID público com permissão de acesso.');
  }else{
    try{
      const result=await probeDrive(id,fetch,key);
      console.log('Drive público — resposta HEAD:',JSON.stringify(result.head));
      console.log('Drive público — amostra com Range:',JSON.stringify(result.range));
      if(result.distant)console.log('Drive público — amostra distante:',JSON.stringify(result.distant));
      console.log('Drive público — validação Range:',result.rangeReason);
      if(!result.usable){
        console.log('::warning::Arquivo não comprovadamente acessível pelo endpoint de download. Não inferir acesso ao player iframe ou ao codec.');
        process.exitCode=1;
      }else if(!result.verifiedRange){
        console.log('::warning::Origem não confirmou HTTP 206 e Content-Range; busca para pontos distantes pode falhar.');
      }else{
        console.log('::notice::HTTP 206 e Content-Range verificados'+(result.distantSeek===true?' também em trecho distante':' no trecho inicial')+'. Reprodução e áudio requerem teste em navegador.');
      }
    }catch(error){
      console.log('::error::Teste real indisponível: '+(error?.name||'Error')+' — '+(error?.message||'erro de rede'));
      process.exitCode=1;
    }
  }
}
