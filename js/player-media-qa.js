/* JogaHub — evidências de reprodução e controle de busca temporal.
 * Um navegador não garante que a saída de áudio física esteja funcionando.
 * seekable é informativo; um intervalo vazio não prova falha de HTTP Range.
 */
(function(root){
  'use strict';
  function finite(value){const n=Number(value);return Number.isFinite(n)?n:NaN}
  function targetTime(value,duration){
    const t=finite(value),d=finite(duration);
    if(!Number.isFinite(t)||t<0)return null;
    return Number.isFinite(d)&&d>0?Math.min(t,Math.max(0,d-.05)):t;
  }
  function finishedByProgress(time,duration,ended=false){
    const t=Number(time),d=Number(duration);
    if(ended===true)return true;
    if(!Number.isFinite(t)||!Number.isFinite(d)||d<=0||t<0)return false;
    // Para conteúdos curtos, não marcar como assistido só porque
    // faltam 20 segundos. Para filmes, manter margem máxima de 20s.
    const threshold=Math.max(d*.95,d-20);
    return t>=threshold;
  }
  function isNoopSeek(target,currentTime,tolerance=.2){
    const t=Number(target),actual=Number(currentTime);
    return Number.isFinite(t)&&Number.isFinite(actual)&&t>=0&&Math.abs(t-actual)<=tolerance;
  }
  function frameClockDelta(currentTime,mediaTime){
    const a=Number(currentTime),b=Number(mediaTime);
    if(!Number.isFinite(a)||!Number.isFinite(b)||a<0||b<0)return null;
    // Diferença entre relógio do vídeo e o tempo do quadro apresentado.
    // NÃO mede sincronização entre áudio e vídeo.
    return Math.max(-10,Math.min(10,a-b));
  }
  function rangeInfo(ranges,target){
    let count=0,start=null,end=null,includesTarget=false;
    try{
      count=Math.min(100,ranges?.length||0);
      for(let i=0;i<count;i++){
        const a=Number(ranges.start(i)),b=Number(ranges.end(i));
        if(!Number.isFinite(a)||!Number.isFinite(b)||b<a)continue;
        start=start===null?a:Math.min(start,a);
        end=end===null?b:Math.max(end,b);
        if(Number.isFinite(target)&&target>=a-.15&&target<=b+.15)includesTarget=true;
      }
    }catch{return {count:0,start:null,end:null,includesTarget:false}}
    return {count,start,end,includesTarget};
  }
  function audioEvidence({muted=false,volume=1,audioTrackCount=null,mozHasAudio=null,decodedAudioBytes=null}={}){
    if(muted||Number(volume)===0)return {state:'muted',label:'Silenciado pelo player'};
    if(Number.isFinite(decodedAudioBytes)&&decodedAudioBytes>0)return {state:'decoded',label:'Bytes de áudio decodificados (saída não verificada)'};
    if(Number.isInteger(audioTrackCount)&&audioTrackCount>0)return {state:'track',label:audioTrackCount+' faixa(s) de áudio detectada(s); som não verificado'};
    if(mozHasAudio===true)return {state:'track',label:'Áudio indicado pelo navegador; som não verificado'};
    if(mozHasAudio===false)return {state:'absent',label:'Navegador informou ausência de áudio'};
    // audioTracks.length=0 em Chromium/Safari pode significar API incompleta.
    return {state:'unknown',label:'Faixas/saída de áudio não verificáveis neste navegador'};
  }
  function playbackEvidence({readyState=0,width=0,height=0,currentTime=0,decodedFrames=0}={}){
    if(Number(decodedFrames)>0)return {state:'frames',label:'Frames decodificados'};
    if(Number(currentTime)>0&&Number(readyState)>=2&&Number(width)>0&&Number(height)>0)
      return {state:'progress',label:'Relógio do vídeo avançou; frames não confirmados'};
    if(Number(readyState)>=1)return {state:'metadata',label:'Só metadados carregados'};
    return {state:'unloaded',label:'Vídeo ainda não carregado'};
  }
  function seekResult({target,actual,seeked=false,seeking=false,elapsedMs=0,timeoutMs=8500,tolerance=1.3,seekable=null}={}){
    const t=finite(target),a=finite(actual);
    if(!Number.isFinite(t)||t<0)return {state:'invalid',label:'Posição solicitada inválida'};
    if(seeked&&Number.isFinite(a)&&Math.abs(t-a)<=tolerance&&!seeking)
      return {state:'ok',label:'Avanço confirmado pelo relógio do vídeo'};
    if(elapsedMs<timeoutMs)return {state:'pending',label:'Aguardando resposta da busca'};
    const ranges=seekable||{count:0,includesTarget:false};
    if(ranges.count>0&&!ranges.includesTarget)
      return {state:'unavailable',label:'Posição fora dos intervalos navegáveis informados'};
    return {state:'timeout',label:'Busca não concluída no prazo; pode ser conexão ou origem'};
  }
  function mediaSnapshot(video){
    if(!video)return {audio:audioEvidence(),playback:playbackEvidence(),seekable:rangeInfo(null)};
    let decodedAudioBytes=null,decodedFrames=0,audioTrackCount=null,mozHasAudio=null;
    try{if(Number.isFinite(video.webkitAudioDecodedByteCount))decodedAudioBytes=video.webkitAudioDecodedByteCount}catch{}
    try{if(video.audioTracks&&Number.isInteger(video.audioTracks.length))audioTrackCount=video.audioTracks.length}catch{}
    try{if(typeof video.mozHasAudio==='boolean')mozHasAudio=video.mozHasAudio}catch{}
    try{decodedFrames=video.getVideoPlaybackQuality?.()?.totalVideoFrames||0}catch{}
    return {
      audio:audioEvidence({muted:video.muted,volume:video.volume,audioTrackCount,mozHasAudio,decodedAudioBytes}),
      playback:playbackEvidence({readyState:video.readyState,width:video.videoWidth,height:video.videoHeight,currentTime:video.currentTime,decodedFrames}),
      seekable:rangeInfo(video.seekable,video.currentTime)
    };
  }
  root.JOGAHUB_PLAYER_MEDIA_QA=Object.freeze({
    targetTime,finishedByProgress,isNoopSeek,frameClockDelta,rangeInfo,audioEvidence,playbackEvidence,seekResult,mediaSnapshot
  });
})(window);
