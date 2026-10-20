/* Diagnóstico do player Google Drive — regras sem DOM e sem acesso a dados privados.
 * Um <video> cross-origin não revela códigos HTTP. O HEAD é apenas uma
 * sondagem opcional; falha de CORS NÃO prova falta de permissão.
 */
(function(root){
  'use strict';
  const ISSUES=Object.freeze({
    access:{title:'Acesso ao arquivo restrito',detail:'O Google Drive não autorizou o acesso direto a este arquivo. Confira o compartilhamento e abra a fonte original com sua conta Google.',action:'Abrir o vídeo no Google Drive e conferir permissões.'},
    missing:{title:'Arquivo não encontrado',detail:'O endereço fornecido pelo Drive não encontrou este arquivo. Ele pode ter sido movido, apagado ou ter um link antigo.',action:'Conferir o arquivo no Drive ou atualizar o catálogo.'},
    limited:{title:'Limite temporário do Google Drive',detail:'O Drive limitou temporariamente as solicitações. Repetir imediatamente não costuma resolver.',action:'Usar o player compatível e tentar novamente mais tarde.'},
    offline:{title:'Sem conexão com a internet',detail:'O navegador está offline. O Google Drive exige conexão para reproduzir arquivos não baixados.',action:'Restabelecer a internet ou usar um vídeo salvo offline.'},
    network:{title:'Falha de conexão',detail:'A transmissão foi interrompida pela rede ou pelo servidor. Não foi possível confirmar se existe restrição de acesso.',action:'Verificar a conexão e tentar novamente, ou usar o player compatível.'},
    codec:{title:'Formato ou codec incompatível',detail:'O navegador não conseguiu decodificar o arquivo diretamente. Isso não significa que o arquivo esteja corrompido.',action:'Usar o player compatível do Drive; converter o vídeo se ele também não reproduzir.'},
    response:{title:'O Drive retornou uma página em vez de vídeo',detail:'A rota direta forneceu HTML ou outro conteúdo não reproduzível. Pode ser uma página de login, confirmação ou erro; a causa exata não foi confirmada.',action:'Abrir a fonte original e usar o player compatível.'},
    timeout:{title:'Tempo de carregamento excedido',detail:'O vídeo não apresentou metadados dentro do prazo. A conexão pode estar lenta ou a rota pode não estar respondendo.',action:'Tentar novamente com uma conexão estável ou usar o player do Drive.'},
    unknown:{title:'Reprodução direta indisponível',detail:'O navegador não forneceu informações suficientes para identificar a causa. Bloqueios de CORS também impedem ler o status HTTP.',action:'Usar o modo compatível ou abrir o arquivo original no Drive.'}
  });
  function classify({status=0,contentType='',mediaCode=0,online=true,timedOut=false}={}){
    if(online===false)return 'offline';
    const code=Number(status)||0;
    if(code===401||code===403)return 'access';
    if(code===404||code===410)return 'missing';
    if(code===429||code===503)return 'limited';
    const type=String(contentType).split(';')[0].trim().toLowerCase();
    if(type==='text/html'||type==='application/xhtml+xml'||type==='application/json'||type==='text/plain')return 'response';
    if(Number(mediaCode)===3)return 'codec';
    // MEDIA_ERR_SRC_NOT_SUPPORTED (4) também ocorre para login HTML e 403.
    // Só é codec comprovado se o HEAD revelar uma resposta de mídia válida.
    if(Number(mediaCode)===4&&code>=200&&code<300&&type.startsWith('video/'))return 'codec';
    if(Number(mediaCode)===2)return 'network';
    if(timedOut)return 'timeout';
    if(code>=500)return 'network';
    return 'unknown';
  }
  function ttl(issue){
    switch(issue){
      case 'access':case 'missing':return 30*60*1000;
      case 'codec':return 60*60*1000;
      case 'limited':return 5*60*1000;
      case 'response':return 10*60*1000;
      default:return 0; // Rede, timeout e origem desconhecida não devem bloquear o retry.
    }
  }
  function cached(failure,now=Date.now()){
    if(!failure||!ISSUES[failure.code])return null;
    const age=Number(now)-Number(failure.updatedAt||0);
    return age>=0&&age<ttl(failure.code)?failure:null;
  }
  function stopTrying(issue){
    // Rotas secundárias não corrigem bloqueio explícito de arquivo,
    // limite de cota nem decoder/codec incompatível.
    return ['access','missing','limited','codec','offline'].includes(issue);
  }
  function info(code){
    return {code:ISSUES[code]?code:'unknown',...ISSUES[code]||ISSUES.unknown};
  }
  function directCapability(video,mime){
    // A ausência de resposta de canPlayType só autoriza pular formatos
    // com contêiner explicitamente conhecido; MP4 sem codec é ambíguo.
    if(!video||typeof video.canPlayType!=='function')return true;
    return !['video/webm','video/ogg'].includes(mime)||!!video.canPlayType(mime);
  }
  async function probe(url,fetcher,{timeoutMs=1500}={}){
    const controller=typeof AbortController==='function'?new AbortController():null;
    const timer=controller?setTimeout(()=>controller.abort(),timeoutMs):null;
    try{
      const response=await fetcher(url,{method:'HEAD',mode:'cors',cache:'no-store',redirect:'follow',...(controller?{signal:controller.signal}:{})});
      return {status:response.status||0,contentType:response.headers?.get?.('content-type')||'',available:true};
    }catch(error){
      // Falha de CORS e erro de rede são indistinguíveis num fetch cross-origin.
      return {status:0,contentType:'',available:false,reason:error?.name==='AbortError'?'timeout':'unavailable'};
    }finally{if(timer)clearTimeout(timer)}
  }
  root.JOGAHUB_DRIVE_DIAGNOSTICS=Object.freeze({ISSUES,classify,ttl,cached,stopTrying,info,directCapability,probe});
})(window);
