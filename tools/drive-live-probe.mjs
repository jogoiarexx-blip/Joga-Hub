/* Teste opcional e real de um arquivo público do Google Drive.
 * Sem login, sem proxy, sem baixar mídia inteira e sem imprimir resourcekeys.
 * Não comprova decodificação de vídeo nem saída sonora no navegador.
 */
import {pathToFileURL} from 'node:url';

export function classifyProbe(status,contentType='',range='',url=''){
  const mime=String(contentType).split(';')[0].trim().toLowerCase();
  if(status===401||status===403)return 'access';
  if(status===404||status===410)return 'missing';
  if(status===429||status===503)return 'limited';
  if(/accounts\.google\.com/i.test(url)||['text/html','application/json','text/plain'].includes(mime))return 'login-or-response';
  if(status===206&&/^bytes\s+\d+-\d+\/\d+/i.test(range))return 'byte-range';
  if(status>=200&&status<300&&mime.startsWith('video/'))return 'media-headers-no-range';
  return 'unconfirmed';
}
export async function probeDrive(fileId,fetcher=fetch,resourceKey=''){
  if(!/^[A-Za-z0-9_-]{8,200}$/.test(String(fileId)))throw new Error('ID público inválido');
  const url=new URL('https://drive.usercontent.google.com/download');
  url.searchParams.set('id',fileId);
  url.searchParams.set('export','download');
  if(resourceKey)url.searchParams.set('resourcekey',resourceKey);
  const signal=AbortSignal.timeout(12000);
  const inspect=async(method,headers)=>{
    const response=await fetcher(url,{method,headers,signal,redirect:'follow',cache:'no-store'});
    const data={status:response.status,contentType:response.headers?.get?.('content-type')||'',
      range:response.headers?.get?.('content-range')||'',
      length:response.headers?.get?.('content-length')||'',
      redirectHost:new URL(response.url||url).hostname};
    // Nunca ler dados do filme inteiro, mesmo que a origem ignore Range.
    try{await response.body?.cancel?.()}catch{}
    data.kind=classifyProbe(data.status,data.contentType,data.range,data.redirectHost);
    return data;
  };
  const head=await inspect('HEAD',{});
  const range=await inspect('GET',{'Range':'bytes=0-4095'});
  return {head,range,usable:range.kind==='byte-range'||range.kind==='media-headers-no-range'};
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
      if(!result.usable){
        console.log('::warning::Arquivo não comprovadamente acessível pelo endpoint de download. Não inferir acesso ao player iframe ou ao codec.');
        process.exitCode=1;
      }else if(result.range.kind!=='byte-range'){
        console.log('::warning::Origem não confirmou HTTP 206 e Content-Range; busca para pontos distantes pode falhar.');
      }else{
        console.log('::notice::HTTP 206 confirmado para até 4096 bytes. Decodificação e áudio requerem teste em navegador.');
      }
    }catch(error){
      console.log('::error::Teste real indisponível: '+(error?.name||'Error')+' — '+(error?.message||'erro de rede'));
      process.exitCode=1;
    }
  }
}
