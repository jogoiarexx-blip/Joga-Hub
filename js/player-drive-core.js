/* JogaHub Player — regras isoladas para Drive, fallback e retomada.
 * Não faz requisições: as tentativas de mídia continuam no player HTML.
 */
(function(root) {
  'use strict';
  const COMPATIBLE_NAME = /\.(?:mkv|avi|wmv|flv|mov|ts|m2ts|mpeg|mpg|3gp)(?:$|[?#])/i;
  const COMPATIBLE_MIME = /matroska|x-msvideo|quicktime|x-ms-wmv|x-flv|mp2t|mp2p|mpeg|3gpp/i;

  function needsCompatiblePlayer(name='', mime='') {
    return COMPATIBLE_NAME.test(String(name || '')) || COMPATIBLE_MIME.test(String(mime || ''));
  }

  function directMime(name='',mime='') {
    const reported=String(mime||'').toLowerCase().split(';')[0].trim();
    if(['video/mp4','video/webm','video/ogg','video/x-m4v'].includes(reported))
      return reported==='video/x-m4v'?'video/mp4':reported;
    const ext=String(name||'').split(/[?#]/)[0].toLowerCase();
    if(/\.webm$/.test(ext))return 'video/webm';
    if(/\.og[vg]$/.test(ext))return 'video/ogg';
    if(/\.(mp4|m4v)$/.test(ext))return 'video/mp4';
    // Não presumir MP4 quando o arquivo não declara um formato reconhecido.
    return '';
  }

  function makeSession() {
    let revision = 0;
    let mode = 'idle';
    let recovering = false;

    function beginDirect() {
      revision += 1;
      mode = 'loading';
      recovering = false;
      return revision;
    }
    function isCurrent(rev) {
      return revision === rev && mode !== 'compatible';
    }
    function confirmDirect(rev) {
      if (!isCurrent(rev)) return false;
      mode = 'direct';
      return true;
    }
    function switchToCompatible() {
      revision += 1;
      mode = 'compatible';
      recovering = false;
      return revision;
    }
    function failDirect(rev) {
      if (!isCurrent(rev)) return false;
      mode = 'failed';
      return true;
    }
    function beginRecovery() {
      if (mode !== 'direct' || recovering) return null;
      recovering = true;
      return revision;
    }
    function endRecovery(rev) {
      if (revision !== rev) return false;
      recovering = false;
      return mode === 'direct';
    }
    return Object.freeze({
      beginDirect,isCurrent,confirmDirect,switchToCompatible,failDirect,
      beginRecovery,endRecovery,getMode:() => mode
    });
  }

  function hasExactProgress(value) {
    return !!value && !value.episodeOnly &&
      Number.isFinite(Number(value.time)) && Number(value.time) >= 0 &&
      Number.isFinite(Number(value.duration)) && Number(value.duration) > 0;
  }
  function episodeProgress(previous,episode) {
    // Nunca substitua um tempo válido por uma marca imprecisa do iframe.
    if (hasExactProgress(previous)) return previous;
    return {
      episodeOnly:true,
      updatedAt:Date.now(),
      provider:'drive',
      seriesId:episode?.seriesId||'',
      season:episode?.season||1,
      episode:episode?.episode||0
    };
  }

  // Pré-carregar somente metadados reduz o consumo antecipado de dados.
  // O navegador pode ignorar a dica; não controla o buffer real do Drive.
  function mediaPreload(){
    return 'metadata';
  }
  function connectionPolicy({effectiveType='',saveData=false,dataSaver=false,downlink=0,deviceMemory=0,online=true,hidden=false}={}){
    const slow=['slow-2g','2g','3g'].includes(String(effectiveType));
    const lowMemory=Number(deviceMemory)>0&&Number(deviceMemory)<=2;
    const constrained=!!dataSaver||!!saveData||slow||lowMemory||(Number(downlink)>0&&Number(downlink)<1.5);
    const timeout=slow?16000:constrained?12000:8500;
    return {
      preload:mediaPreload(),
      timeout,
      warmNext:online!==false&&!hidden&&!constrained
    };
  }
  function resumeTarget(time,duration){
    const t=Number(time),d=Number(duration);
    if(!Number.isFinite(t)||t<=0)return 0;
    if(Number.isFinite(d)&&d>0)return Math.min(t,Math.max(0,d-0.25));
    return t;
  }
  function makeRecoveryBudget({maxAttempts=2,windowMs=120000,cooldownMs=15000}={}){
    let attempts=[];
    function prune(now){attempts=attempts.filter(t=>now-t<windowMs&&now>=t)}
    function status(now=Date.now()){
      prune(now);
      return {count:attempts.length,exhausted:attempts.length>=maxAttempts,
        cooling:attempts.length>0&&now-attempts[attempts.length-1]<cooldownMs};
    }
    function begin(now=Date.now()){
      const s=status(now);
      if(s.exhausted||s.cooling)return false;
      attempts.push(now);
      return true;
    }
    function reset(){attempts=[]}
    return Object.freeze({begin,status,reset});
  }

  function shouldTrackStall({paused=false,ended=false,seeking=false,readyState=0,buffer=0}={}) {
    return !paused && !ended && !seeking && readyState > 0 && buffer < 3;
  }

  root.JOGAHUB_PLAYER_DRIVE_CORE=Object.freeze({
    needsCompatiblePlayer,directMime,makeSession,hasExactProgress,episodeProgress,shouldTrackStall,
    mediaPreload,connectionPolicy,resumeTarget,makeRecoveryBudget
  });
})(window);
