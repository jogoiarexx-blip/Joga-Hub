/* JogaHub Player — controlador da página (catálogo, UI, episódios e mídia). */
(() => {
  const q=new URLSearchParams(location.search), raw=q.get('url')||'', rawExternal=q.get('external')||raw, queryTitle=q.get('title')||'Conteúdo online', type=q.get('type')||'jogo', provider=q.get('provider')||'', playlistId=q.get('playlistId')||'', youtubeId=q.get('youtubeId')||'', driveFileId=q.get('driveFileId')||'', itemId=q.get('id')||'', querySeriesId=q.get('seriesId')||'', querySeriesTitle=q.get('seriesTitle')||'', querySeason=Number(q.get('season')||0), queryEpisode=Number(q.get('episode')||0), queryDriveName=q.get('driveName')||'', queryDriveMime=q.get('driveMime')||'';
  const archiveId=q.get('archiveId')||(()=>{try{const u=new URL(raw),m=u.pathname.match(/\/embed\/([^/]+)/);return m?decodeURIComponent(m[1]):''}catch{return''}})();
  const $=id=>document.getElementById(id), stage=$('stage'), stageShell=$('stageShell'), video=$('video'), frame=$('frame'), loading=$('loading'), loadingText=$('loadingText'), modeChip=$('modeChip');
  let u=null,external=null,currentItem=null,mode='fallback',saveTimer=0,lastProgressWrite=0,ytPlayer=null,ytTicker=0,nextItem=null,prevItem=null,nextTimer=0,nextSeconds=10,currentSeason=null,driveMode='auto',driveFallbackTimer=0,wakeLock=null,autoNextSuppressed=false;
  const DRIVE_FAIL_TTL=10*60*1000;
  const MEDIA_QA=window.JOGAHUB_PLAYER_MEDIA_QA;
  if(!MEDIA_QA)throw new Error('Diagnóstico de mídia não carregado');
  const DRIVE_ROUTES=window.JOGAHUB_PLAYER_DRIVE_ROUTES;
  if(!DRIVE_ROUTES)throw new Error('Planejador de rotas do Drive não carregado');
  const PLAYER_DRIVE_CORE=window.JOGAHUB_PLAYER_DRIVE_CORE;
  if(!PLAYER_DRIVE_CORE)throw new Error('Núcleo do player Drive não carregado');
  const driveSession=PLAYER_DRIVE_CORE.makeSession();
  const RECONNECT=window.JOGAHUB_PLAYER_DRIVE_RECONNECT;
  if(!RECONNECT)throw new Error('Módulo de recuperação de rede do Drive não carregado');
  const driveReconnect=RECONNECT.makeGate();
  let driveReconnectTimer=0;
  const recoveryBudget=PLAYER_DRIVE_CORE.makeRecoveryBudget();
  let driveAttemptController=null, recoveryController=null;
  const driveHealth=window.JOGAHUB_DRIVE_HEALTH?.createStore();
  const DRIVE_DIAGNOSTICS=window.JOGAHUB_DRIVE_DIAGNOSTICS;
  if(!DRIVE_DIAGNOSTICS)throw new Error('Módulo de diagnóstico do Drive não carregado');
  const BROWSER_CORE=window.JOGAHUB_PLAYER_BROWSER_CORE;
  if(!BROWSER_CORE)throw new Error('Compatibilidade do player não carregada');
  const EPISODE_CORE=window.JOGAHUB_PLAYER_EPISODE_CORE;
  if(!EPISODE_CORE)throw new Error('Núcleo de episódios não carregado');
  try{u=new URL(raw);if(!/^https?:$/.test(u.protocol))u=null}catch{} try{external=new URL(rawExternal);if(!/^https?:$/.test(external.protocol))external=null}catch{}
  const movies=typeof FILMES!=='undefined'?FILMES:[];
  currentItem=movies.find(x=>(itemId&&x.id===itemId)||(archiveId&&x.archiveId===archiveId)||(playlistId&&x.youtubePlaylistId===playlistId)||(youtubeId&&x.youtubeId===youtubeId)||(driveFileId&&x.driveFileId===driveFileId))||null;
  // O link do episódio carrega os IDs essenciais para sobreviver a cache antigo.
  // Se o catálogo ainda não atualizou no navegador, reconstrói o item mínimo
  // para o vídeo abrir em vez de cair em "conteúdo não encontrado".
  if(!currentItem&&(youtubeId||driveFileId)){
    currentItem={
      id:itemId||(driveFileId?'drive-auto-'+driveFileId:'youtube-'+youtubeId),
      type:'filme',
      title:queryTitle,
      mediaType:querySeriesId?'serie':'filme',
      seriesId:querySeriesId,
      seriesTitle:querySeriesTitle||queryTitle,
      season:querySeason||1,
      episode:queryEpisode||0,
      youtubeId,
      driveFileId,
      _driveName:queryDriveName,
      driveMime:queryDriveMime,
      sourceUrl:rawExternal,
      drivePlayerUrl:raw
    };
  }
  function driveResourceKeyFor(item,allowCurrentQuery=false){
    if(item?.driveResourceKey)return String(item.driveResourceKey).trim();
    if(allowCurrentQuery&&q.get('driveResourceKey'))return String(q.get('driveResourceKey')).trim();
    for(const link of [item?.sourceUrl,item?.drivePlayerUrl,...(allowCurrentQuery?[rawExternal,raw]:[])]){
      try{const url=new URL(link);if(url.hostname==='drive.google.com'||url.hostname==='drive.usercontent.google.com'){
        const key=url.searchParams.get('resourcekey');if(key)return key;
      }}catch{}
    }
    return '';
  }
  const driveResourceKey=driveResourceKeyFor(currentItem,true);
  if(provider==='iframe'&&driveResourceKey){
    for(const field of ['u','external']){
      const address=field==='u'?u:external;
      if(address&&(address.hostname==='drive.google.com'||address.hostname==='drive.usercontent.google.com')){
        address.searchParams.set('resourcekey',driveResourceKey);
      }
    }
  }
  const OFFLINE=window.JOGAHUB_PLAYER_OFFLINE;
  if(!OFFLINE)throw new Error('Gerenciador de mídia offline não carregado');
  const offlineManager=OFFLINE.createManager();
  const MEDIA_CACHE=OFFLINE.CACHE_NAME;
  const id=currentItem?.id||itemId||archiveId||youtubeId||queryTitle;
  let directMediaUrl='',directMediaSize=0,directMediaMime='',offlineObjectUrl=null;
  function loadMediaRegistry(){return offlineManager.registry()}
  function formatBytes(value){let n=Number(value)||0;if(!n)return 'tamanho desconhecido';const units=['B','KB','MB','GB'];let i=0;while(n>=1024&&i<units.length-1){n/=1024;i++}return `${n>=10||i===0?n.toFixed(0):n.toFixed(1)} ${units[i]}`}
  const title=currentItem?.title||queryTitle, progressId=archiveId||itemId||youtubeId||currentItem?.id||(driveFileId?'drive-auto-'+driveFileId:title), baseProgressKey=`jogahub.movie.progress.${progressId}`, settingsKey='jogahub.movie.player.settings'; let archiveEpisodeKey='',archivePlaylistFiles=[],archivePlaylistIndex=0; const progressKeyNow=()=>archiveEpisodeKey?`${baseProgressKey}:${archiveEpisodeKey}`:baseProgressKey;
  let settings={};try{settings=JSON.parse(localStorage.getItem(settingsKey)||'{}')}catch{};settings={autoplayNext:settings.autoplayNext!==false,autoSkipIntro:!!settings.autoSkipIntro,autoSkipRecap:!!settings.autoSkipRecap,dataSaver:!!settings.dataSaver,autoRecoverDrive:settings.autoRecoverDrive!==false,captionSize:Number(settings.captionSize)||100,captionBg:Number(settings.captionBg)||.72,...settings}
  $('topTitle').textContent=title;$('title').textContent=title;document.title=`${title} — JogaHub`;
  const sourceHref=(external||u)?.href||'#';$('external').href=sourceHref;$('fallback').href=sourceHref;
  $('sourceLabel').textContent=currentItem?.sourceLabel?`${currentItem.sourceLabel} `:(provider==='youtube'?'YouTube ':(provider==='iframe'?'Google Drive ':'Internet Archive '));
  if(currentItem){$('meta').innerHTML=[currentItem.genre,currentItem.year,currentItem.language].filter(Boolean).map(v=>`<span class="pill">${safe(v)}</span>`).join('');$('desc').textContent=currentItem.desc||''}else $('desc').textContent=type==='filme'?'Reprodução online.':'';
  function safe(v=''){return String(v).replace(/[&<>"']/g,'')}
  function readProgress(){try{return JSON.parse(localStorage.getItem(progressKeyNow())||'null')}catch{return null}}
  function getTime(){if(mode==='enhanced')return video.currentTime||0;if(mode==='youtube'&&ytPlayer?.getCurrentTime)return ytPlayer.getCurrentTime()||0;return 0}
  function getDuration(){if(mode==='enhanced')return video.duration||0;if(mode==='youtube'&&ytPlayer?.getDuration)return ytPlayer.getDuration()||0;return 0}
  function writeProgressPayload(payload){try{localStorage.setItem(progressKeyNow(),JSON.stringify(payload));lastProgressWrite=Date.now()}catch(e){console.warn('Não foi possível salvar o progresso',e)}}
  function saveProgress(force=false){if(playlistId||recoveryPending)return;const dur=getDuration(),time=getTime();if(!isFinite(dur)||dur<=0)return;const payload={time,duration:dur,updatedAt:Date.now(),finished:MEDIA_QA.finishedByProgress(time,dur,video.ended&&mode==='enhanced'),provider:mode,itemId:currentItem?.id||itemId||'',seriesId:currentItem?.seriesId||'',season:currentItem?.season||0,episode:currentItem?.episode||0};if(force||Date.now()-lastProgressWrite>=4000){clearTimeout(saveTimer);writeProgressPayload(payload);return}clearTimeout(saveTimer);saveTimer=setTimeout(()=>writeProgressPayload({...payload,updatedAt:Date.now()}),Math.max(250,4000-(Date.now()-lastProgressWrite)))}
  function formatTime(sec){sec=Math.max(0,Math.floor(Number(sec)||0));const h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=sec%60;return h?`${h}h ${m}min`:`${m}min ${String(s).padStart(2,'0')}s`}
  function updateContinueText(){const p=readProgress();$('continueText').textContent=p?.episodeOnly?'▶ O JogaHub lembrou este como seu último episódio aberto no Google Drive. O tempo exato continua sendo controlado pelo próprio Drive.':p&&p.time>20&&!p.finished?`▶ Você parou em ${formatTime(p.time)}. O JogaHub continuará desse ponto automaticamente.`:p?.finished?'✓ Você já assistiu este conteúdo.':''}
  updateContinueText();
  function markDriveResume(){
    if(provider!=='iframe'||!currentItem?.id)return;
    const seriesKey=currentItem.seriesId||currentItem.id;
    const resumeKey=`jogahub.drive.resume.${seriesKey}`;
    let prev=null;try{prev=JSON.parse(localStorage.getItem(resumeKey)||'null')}catch{}
    if(prev?.id&&prev.id!==currentItem.id){try{const old=JSON.parse(localStorage.getItem(`jogahub.movie.progress.${prev.id}`)||'null');if(old?.episodeOnly)localStorage.removeItem(`jogahub.movie.progress.${prev.id}`)}catch{}}
    const payload=PLAYER_DRIVE_CORE.episodeProgress(readJson('jogahub.movie.progress.'+currentItem.id),currentItem);
    localStorage.setItem(`jogahub.movie.progress.${currentItem.id}`,JSON.stringify(payload));
    localStorage.setItem(resumeKey,JSON.stringify({...payload,id:currentItem.id}));
    updateContinueText();
  }
  function saveSettings(patch){settings={...settings,...patch};localStorage.setItem(settingsKey,JSON.stringify(settings))}
  function setMode(newMode,label){mode=newMode;modeChip.className='mode-chip '+(newMode==='enhanced'||newMode==='youtube'?'good':'warn');modeChip.textContent=label;setTimeout(()=>{try{updateQualityChip()}catch{}},0);stage.classList.remove('enhanced','fallback','youtube');stage.classList.add(newMode);const direct=newMode==='enhanced',controlled=direct||newMode==='youtube';if(typeof pc!=='undefined'){pc.hidden=!direct;if(direct){syncCustomControls();showControls(3200)}}['rewindBtn','forwardBtn','speed','restartBtn'].forEach(id=>$(id).disabled=!controlled);$('pipBtn').disabled=!direct;const tip=$('driveTip');if(provider==='iframe'&&tip){tip.classList.add('show');tip.classList.toggle('compat',newMode==='fallback');$('driveTipText').innerHTML=newMode==='enhanced'?'<b>Drive Engine 5.3 ativo.</b> Controles próprios, retomada exata, gestos, velocidade, PiP e próximo episódio.':'<b>Player oficial do Google Drive.</b> Reprodução direta indisponível ou incompatível neste navegador. Use os controles do Drive acima. Se o vídeo não abrir, toque em Fonte ↗ para assistir no Drive e verificar o acesso ao arquivo.'}}
  function fallback(reason=''){
    loading.classList.add('hide');
    const fileId=currentItem?.driveFileId;
    const isDrive=provider==='iframe';
    const safeId=DRIVE_ROUTES.isValidFileId(fileId)?fileId:null;
    const resource=driveResourceKey?'?resourcekey='+encodeURIComponent(driveResourceKey):'';
    const preview=safeId?'https://drive.google.com/file/d/'+encodeURIComponent(safeId)+'/preview'+resource:null;
    const view=safeId?'https://drive.google.com/file/d/'+encodeURIComponent(safeId)+'/view'+resource:null;
    const target=isDrive?preview:u?.href;
    if(target){
      frame.src=target;
      setMode('fallback',isDrive?'Google Drive • compatibilidade':(provider==='youtube'?'YouTube':'player Internet Archive'));
      if(isDrive){
        markDriveResume();
        const open=$('external'),fallbackLink=$('fallback');
        if(open&&view){open.href=view;open.target='_blank';open.rel='noopener noreferrer';}
        if(fallbackLink&&view){fallbackLink.href=view;fallbackLink.target='_blank';fallbackLink.rel='noopener noreferrer';}
      }
    }else{
      $('notice').classList.add('show');
      stageShell.style.display='none';
    }
    if(reason)console.warn('JogaHub Player:',reason);
  }
  function movieHref(item){if(item.youtubePlaylistId){const embed=`https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(item.youtubePlaylistId)}`;const src=item.sourceUrl||`https://www.youtube.com/playlist?list=${encodeURIComponent(item.youtubePlaylistId)}`;return `link-player.html?url=${encodeURIComponent(embed)}&external=${encodeURIComponent(src)}&title=${encodeURIComponent(item.title||'')}&type=filme&provider=youtube&playlistId=${encodeURIComponent(item.youtubePlaylistId)}&id=${encodeURIComponent(item.id||'')}`;}if(item.youtubeId){const start=Number(item.startSeconds)||0,embed=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(item.youtubeId)}`,src=item.sourceUrl||`https://www.youtube.com/watch?v=${encodeURIComponent(item.youtubeId)}`;return `link-player.html?url=${encodeURIComponent(embed)}&external=${encodeURIComponent(src)}&title=${encodeURIComponent(item.title||'')}&type=filme&provider=youtube&youtubeId=${encodeURIComponent(item.youtubeId)}&start=${start}&id=${encodeURIComponent(item.id||'')}&seriesId=${encodeURIComponent(item.seriesId||'')}&seriesTitle=${encodeURIComponent(item.seriesTitle||'')}&season=${encodeURIComponent(item.season||'')}&episode=${encodeURIComponent(item.episode||'')}`;}if(item.driveFileId){const key=driveResourceKeyFor(item),embed=`https://drive.google.com/file/d/${encodeURIComponent(item.driveFileId)}/preview${key?'?resourcekey='+encodeURIComponent(key):''}`,src=item.sourceUrl||`https://drive.google.com/file/d/${encodeURIComponent(item.driveFileId)}/view`;return `link-player.html?url=${encodeURIComponent(embed)}&external=${encodeURIComponent(src)}&title=${encodeURIComponent(item.title||'')}&type=filme&provider=iframe&id=${encodeURIComponent(item.id||'')}&driveFileId=${encodeURIComponent(item.driveFileId||'')}&driveName=${encodeURIComponent(item._driveName||'')}&driveMime=${encodeURIComponent(item.driveMime||'')}&driveResourceKey=${encodeURIComponent(key)}&seriesId=${encodeURIComponent(item.seriesId||'')}&seriesTitle=${encodeURIComponent(item.seriesTitle||'')}&season=${encodeURIComponent(item.season||'')}&episode=${encodeURIComponent(item.episode||'')}`;}if(item.driveFolderId)return item.sourceUrl||`https://drive.google.com/drive/folders/${encodeURIComponent(item.driveFolderId)}`;const embed=`https://archive.org/embed/${encodeURIComponent(item.archiveId)}`,src=item.sourceUrl||`https://archive.org/details/${encodeURIComponent(item.archiveId)}`;return `link-player.html?url=${encodeURIComponent(embed)}&external=${encodeURIComponent(src)}&title=${encodeURIComponent(item.title||'')}&type=filme&archiveId=${encodeURIComponent(item.archiveId||'')}&id=${encodeURIComponent(item.id||'')}`}
  function playNextEpisode(){if(currentItem?.archivePlaylist&&archivePlaylistFiles.length&&archivePlaylistIndex<archivePlaylistFiles.length-1){selectArchiveEpisode(archivePlaylistIndex+1,true);return true}if(nextItem){saveProgress(true);cancelCountdown();location.href=movieHref(nextItem);return true}return false}
  function playPrevEpisode(){if(currentItem?.archivePlaylist&&archivePlaylistFiles.length&&archivePlaylistIndex>0){selectArchiveEpisode(archivePlaylistIndex-1,true);return true}if(prevItem){saveProgress(true);cancelCountdown();location.href=movieHref(prevItem);return true}return false}
  function syncQuickEpisodeNav(){const box=$('episodeQuickNav'),next=$('quickNextEpisode'),prev=$('quickPrevEpisode');if(!box||!next||!prev)return;const hasArchive=!!(currentItem?.archivePlaylist&&archivePlaylistFiles.length),hasNext=hasArchive?archivePlaylistIndex<archivePlaylistFiles.length-1:!!nextItem,hasPrev=hasArchive?archivePlaylistIndex>0:!!prevItem;next.disabled=!hasNext;prev.disabled=!hasPrev;box.classList.toggle('show',hasNext||hasPrev)}
  $('quickNextEpisode')?.addEventListener('click',playNextEpisode);$('quickPrevEpisode')?.addEventListener('click',playPrevEpisode);
  function renderEpisodes(){prevItem=null;nextItem=null;$('prevBtn').disabled=true;$('nextBtn').disabled=true;if(currentItem?.archivePlaylist){$('episodes').hidden=true;$('seriesBox').hidden=true;$('prevBtn').disabled=true;$('nextBtn').disabled=true;syncQuickEpisodeNav();return}if(type!=='filme'||!movies.length||currentItem?.youtubePlaylistId){$('episodes').hidden=true;$('seriesBox').hidden=true;$('prevBtn').disabled=true;$('nextBtn').disabled=true;return}const isSeries=currentItem?.mediaType==='serie'&&currentItem?.seriesId;let related,seriesSequence=null;if(isSeries){seriesSequence=EPISODE_CORE.episodeOrder(movies.filter(m=>m.seriesId===currentItem.seriesId));related=seriesSequence;const seasons=[...new Set(related.map(m=>m.season||1))];currentSeason=currentSeason||currentItem.season||seasons[0];const seasonItems=related.filter(m=>(m.season||1)===currentSeason);$('seriesBox').hidden=false;$('seriesTitle').textContent=currentItem.seriesTitle||currentItem.title;$('seriesSummary').textContent=`${related.length} ${related.length===1?'episódio disponível':'episódios disponíveis'} no JogaHub${seasons.length>1?` em ${seasons.length} temporadas`:''}. Ao terminar uma temporada, o JogaHub continua automaticamente na próxima. Seu progresso é salvo neste aparelho.`;$('seasonChips').innerHTML=seasons.map(s=>`<button class="season-chip${s===currentSeason?' active':''}" data-season="${s}">Temporada ${s}</button>`).join('');$('seasonChips').querySelectorAll('[data-season]').forEach(b=>b.onclick=()=>{currentSeason=Number(b.dataset.season);renderEpisodes()});related=seasonItems;$('episodesTitle').textContent=`📺 ${currentItem.seriesTitle||currentItem.title} · Temporada ${currentSeason}`;$('episodeCount').textContent=`${related.length} ${related.length===1?'episódio':'episódios'}`;}else{related=movies.filter(m=>m.mediaType!=='serie');$('seriesBox').hidden=true;$('episodesTitle').textContent='🎞️ Mais filmes clássicos';$('episodeCount').textContent=`${related.length} filmes`}
    if(!related.length){$('episodes').hidden=true;syncQuickEpisodeNav();return}$('episodes').hidden=false;$('episodeList').innerHTML=related.map((m,i)=>{let p=null;try{p=JSON.parse(localStorage.getItem(`jogahub.movie.progress.${m.archiveId||m.id}`)||'null')}catch{}const status=p?.finished?'✓ assistido':p?.episodeOnly?'▶ continuar':p&&p.duration&&p.time>20?`${Math.round(p.time/p.duration*100)}% visto`:m.id===currentItem?.id?'reproduzindo':'assistir ›';return `<a class="episode-row${m.id===currentItem?.id?' current':''}" href="${movieHref(m)}"><span class="episode-index">${isSeries?(m.episode||i+1):(i+1)}</span><span class="episode-copy"><b>${safe(m.title||'')}</b><span>${isSeries?`Temporada ${m.season||1} • Episódio ${m.episode||i+1}`:[m.genre,m.year].filter(Boolean).join(' • ')}</span></span><span class="episode-action">${status}</span></a>`}).join('');let navList=isSeries&&seriesSequence?seriesSequence:related;const neighbors=EPISODE_CORE.episodeNeighbors(navList,currentItem);prevItem=neighbors.previous;nextItem=neighbors.next;$('prevBtn').disabled=!prevItem;$('nextBtn').disabled=!nextItem;$('prevBtn').onclick=playPrevEpisode;$('nextBtn').onclick=playNextEpisode;syncQuickEpisodeNav();prefetchNextEpisode()}
  renderEpisodes();
  function cancelCountdown(){clearInterval(nextTimer);nextTimer=0;$('nextOverlay').classList.remove('show')}
  function hideUpNext(){cancelCountdown()}
  function updateUpNextPreview(){
    if(!settings.autoplayNext||autoNextSuppressed||!nextItem||playlistId)return;
    const dur=getDuration(),t=getTime();
    if(!dur||!Number.isFinite(dur)||!Number.isFinite(t))return;
    const remain=Math.max(0,dur-t);
    if(remain<=20&&remain>0){
      const epMeta=nextItem?.mediaType==='serie'?`T${nextItem.season||1} • E${nextItem.episode||''} — `:'';
      $('nextTitle').textContent=epMeta+(nextItem.title||'Próximo episódio');
      $('nextCount').textContent=`Próximo episódio em ${Math.ceil(remain)}s`;
      $('nextOverlay').classList.add('show');
    }else if(remain>22){$('nextOverlay').classList.remove('show')}
  }
  function prefetchNextEpisode(){
    if(!nextItem||!driveConnectionPolicy().warmNext)return;
    try{
      const href=movieHref(nextItem);
      if(!href||document.querySelector('link[data-next-episode-prefetch]'))return;
      const link=document.createElement('link');
      link.rel='prefetch';link.href=href;link.as='document';
      link.dataset.nextEpisodePrefetch='1';document.head.appendChild(link);
    }catch{}
  }
  function startCountdown(){
    const hasArchive=!!(currentItem?.archivePlaylist&&archivePlaylistFiles.length&&archivePlaylistIndex<archivePlaylistFiles.length-1);
    const nextEpisode=hasArchive?{title:archiveEpisodeLabel(archivePlaylistFiles[archivePlaylistIndex+1],archivePlaylistIndex+1)}:nextItem;
    if(!EPISODE_CORE.mayAutoAdvance({autoplayNext:settings.autoplayNext,suppressed:autoNextSuppressed,nextItem:nextEpisode,currentItem,archivePlaylist:hasArchive,playlistId}))return false;
    if(nextTimer)return true;
    nextSeconds=8;
    const epMeta=nextEpisode?.mediaType==='serie'?`T${nextEpisode.season||1} • E${nextEpisode.episode||''} — `:'';
    $('nextTitle').textContent=epMeta+(nextEpisode.title||'Próximo episódio');
    $('nextCount').textContent=`Reproduzindo automaticamente em ${nextSeconds}s`;
    $('nextOverlay').classList.add('show');
    nextTimer=setInterval(()=>{
      nextSeconds--;
      $('nextCount').textContent=`Reproduzindo automaticamente em ${nextSeconds}s`;
      if(nextSeconds<=0){cancelCountdown();playNextEpisode()}
    },1000);
    return true;
  }
  $('cancelNext').onclick=()=>{autoNextSuppressed=true;cancelCountdown();toast('Reprodução automática cancelada para este episódio')};$('playNext').onclick=()=>{autoNextSuppressed=false;playNextEpisode()};
  async function loadOfflineCopy(){
    const mediaKey=currentItem?.id||id;
    const saved=loadMediaRegistry()[mediaKey];
    if(!saved?.url||!('caches'in window))return false;
    try{
      const cache=await caches.open(MEDIA_CACHE),res=await cache.match(saved.url);
      if(!res){
        // Se o navegador removeu o arquivo do Cache API por falta de espaço,
        // limpar o índice antigo para permitir baixar novamente.
        await offlineManager.remove(mediaKey);
        return false;
      }
      let playableUrl='';
      if(navigator.serviceWorker?.controller){
        const route=new URL('./offline-media',location.href);
        route.searchParams.set('src',saved.url);
        route.searchParams.set('size',String(saved.size||Number(res.headers.get('content-length'))||0));
        playableUrl=route.href;
      }else{
        // O fallback em Blob é reservado a vídeos pequenos até o SW controlar esta página.
        if(Number(saved.size||0)>64*1024*1024)return false;
        const blob=await res.blob();
        offlineObjectUrl=URL.createObjectURL(blob);
        playableUrl=offlineObjectUrl;
      }
      video.poster=saved.thumb||currentItem?.thumb||'';
      video.src=playableUrl;
      directMediaUrl=saved.url;
      directMediaSize=Number(saved.size)||Number(res.headers.get('content-length'))||0;
      directMediaMime=saved.mime||res.headers.get('content-type')||'video/mp4';
      video.addEventListener('loadedmetadata',()=>{
        const p=readProgress();
        const resume=MEDIA_QA.resumeTime(p,video.duration);if(resume!==null)video.currentTime=resume;
        loading.classList.add('hide');setMode('enhanced','✓ offline');
        $('downloadBtn').hidden=false;$('downloadBtn').textContent='✓ salvo offline';$('downloadBtn').dataset.saved='1';
        const info=[currentItem?.genre,currentItem?.year,'Offline',formatBytes(directMediaSize)].filter(Boolean);
        $('meta').innerHTML=info.map(v=>`<span class="pill">${safe(v)}</span>`).join('');
      },{once:true});
      video.load();return true;
    }catch(error){console.warn('Vídeo offline:',error);return false}
  }
  function archiveEpisodeLabel(f,i){const configured=currentItem?.episodeTitles?.[i];if(configured)return configured;let name=String(f?.title||f?.name||`Episódio ${i+1}`);name=name.split('/').pop().replace(/\.[^.]+$/,'').replace(/[_-]+/g,' ').replace(/\b(512kb|h264|mpeg4|webm|ia)\b/ig,' ').replace(/\s+/g,' ').trim();return name||`Episódio ${i+1}`}
  function archiveCanonical(f){const original=String(f?.original||'').trim();if(original)return original.toLowerCase();return String(f?.name||'').toLowerCase().replace(/\.[^.]+$/,'').replace(/([._ -])(512kb|h\.?264|mpeg4|webm|derivative|ia)$/i,'')}
  function archiveFileUrl(f){const path=String(f.name||'').split('/').map(encodeURIComponent).join('/');return `https://archive.org/download/${encodeURIComponent(archiveId)}/${path}`}
  function renderArchiveEpisodes(){if(!archivePlaylistFiles.length)return;$('seriesBox').hidden=false;$('episodes').hidden=false;$('seriesTitle').textContent=currentItem?.seriesTitle||currentItem?.title||'Série';$('seriesSummary').textContent=`${archivePlaylistFiles.length} ${archivePlaylistFiles.length===1?'episódio encontrado':'episódios encontrados'} diretamente neste item do Internet Archive. A lista é montada automaticamente pelo JogaHub.`;$('seasonChips').innerHTML='<span class="season-chip active">Temporada 1</span>';$('episodesTitle').textContent=`📺 ${currentItem?.seriesTitle||currentItem?.title||'Série'} · Temporada 1`;$('episodeCount').textContent=`${archivePlaylistFiles.length} ${archivePlaylistFiles.length===1?'episódio':'episódios'}`;$('episodeList').innerHTML=archivePlaylistFiles.map((f,i)=>{let p=null;try{p=JSON.parse(localStorage.getItem(`${baseProgressKey}:${archiveCanonical(f)}`)||'null')}catch{}const status=p?.finished?'✓ assistido':p&&p.duration&&p.time>20?`${Math.round(p.time/p.duration*100)}% visto`:i===archivePlaylistIndex?'reproduzindo':'assistir ›';return `<button type="button" class="episode-row${i===archivePlaylistIndex?' current':''}" data-archive-episode="${i}" style="width:100%;border-left:0;border-right:0;border-top:0;text-align:left"><span class="episode-index">${i+1}</span><span class="episode-copy"><b>${safe(archiveEpisodeLabel(f,i))}</b><span>Temporada 1 • Episódio ${i+1}</span></span><span class="episode-action">${status}</span></button>`}).join('');$('episodeList').querySelectorAll('[data-archive-episode]').forEach(btn=>btn.onclick=()=>selectArchiveEpisode(Number(btn.dataset.archiveEpisode),true));$('prevBtn').disabled=archivePlaylistIndex<=0;$('nextBtn').disabled=archivePlaylistIndex>=archivePlaylistFiles.length-1;$('prevBtn').onclick=playPrevEpisode;$('nextBtn').onclick=playNextEpisode;syncQuickEpisodeNav()}
  let driveSubtitleObjectUrl='',driveSubtitleAbort=null;
  function cleanDriveSubtitle(){
    driveSubtitleAbort?.abort();driveSubtitleAbort=null;
    if(driveSubtitleObjectUrl){URL.revokeObjectURL(driveSubtitleObjectUrl);driveSubtitleObjectUrl=''}
    video.querySelectorAll('track[data-drive-subtitle]').forEach(t=>t.remove());
  }
  function showSubtitleInfo(message){
    const notice=$('driveSubtitleNotice'),link=$('driveSubtitleLink'),text=$('driveSubtitleText');
    const sub=currentItem?.driveSubtitles?.[0];
    if(!notice||!link||!text)return;
    notice.hidden=!sub;if(!sub)return;
    text.textContent=message;
    const url=window.JOGAHUB_DRIVE_SUBTITLE_CORE?.externalUrl(sub);
    link.hidden=!url;if(url)link.href=url;
  }
  async function loadDriveSubtitles(){
    cleanDriveSubtitle();
    const sub=currentItem?.driveSubtitles?.[0];
    if(!sub||mode!=='enhanced'||provider!=='iframe'){showSubtitleInfo('');return}
    showSubtitleInfo('Legenda externa encontrada. Preparando faixa CC…');
    const core=window.JOGAHUB_DRIVE_SUBTITLE_CORE;
    const url=core?.downloadUrl(sub);if(!url)return;
    const controller=new AbortController();driveSubtitleAbort=controller;
    const timer=setTimeout(()=>controller.abort(),6500);
    try{
      const response=await fetch(url,{mode:'cors',signal:controller.signal,cache:'no-store'});
      if(!response.ok)throw new Error('HTTP '+response.status);
      if(Number(response.headers.get('content-length')||0)>2*1024*1024)throw new Error('Legenda maior que 2 MB');
      const raw=await response.text();
      if(raw.length>2*1024*1024)throw new Error('Legenda muito grande');
      const vtt=core.toVtt(raw);
      if(!vtt||controller.signal.aborted||mode!=='enhanced')throw new Error('Formato ou acesso incompatível');
      const blob=URL.createObjectURL(new Blob([vtt],{type:'text/vtt'}));
      driveSubtitleObjectUrl=blob;
      const track=document.createElement('track');track.dataset.driveSubtitle='1';
      track.kind='subtitles';track.label='Legenda externa (Drive)';
      track.srclang='pt';track.src=blob;video.appendChild(track);
      refreshTrackControls();
      showSubtitleInfo('Legenda disponível no seletor CC. Se não aparecer, abra o arquivo original.');
    }catch(error){
      if(driveSubtitleAbort===controller)showSubtitleInfo('Não foi possível carregar a legenda diretamente (CORS, tempo de espera, rede ou permissão).');
    }finally{clearTimeout(timer);if(driveSubtitleAbort===controller)driveSubtitleAbort=null}
  }
    function clearVideoTracks(){video.querySelectorAll('track').forEach(t=>t.remove())}
  function selectArchiveEpisode(index,autoplay=false){if(index<0||index>=archivePlaylistFiles.length)return;saveProgress(true);archivePlaylistIndex=index;const f=archivePlaylistFiles[index];archiveEpisodeKey=archiveCanonical(f);directMediaUrl=archiveFileUrl(f);directMediaSize=Number(f.size)||0;directMediaMime=(f.format||'').toLowerCase().includes('webm')?'video/webm':'video/mp4';video.pause();clearVideoTracks();video.src=directMediaUrl;video.poster=`https://archive.org/services/img/${encodeURIComponent(archiveId)}`;$('topTitle').textContent=`${currentItem?.seriesTitle||'Pole Position'} — ${archiveEpisodeLabel(f,index)}`;$('title').textContent=`${currentItem?.seriesTitle||currentItem?.title||'Série'} — ${archiveEpisodeLabel(f,index)}`;$('downloadBtn').hidden=false;loading.classList.remove('hide');loadingText.textContent=`Carregando episódio ${index+1} de ${archivePlaylistFiles.length}…`;renderArchiveEpisodes();video.addEventListener('loadedmetadata',()=>{const p=readProgress();const resume=MEDIA_QA.resumeTime(p,video.duration);if(resume!==null)video.currentTime=resume;video.playbackRate=Number(settings.speed)||1;if(typeof settings.volume==='number')video.volume=Math.max(0,Math.min(1,settings.volume));$('speed').value=String(video.playbackRate);loading.classList.add('hide');setMode('enhanced',`episódio ${index+1}/${archivePlaylistFiles.length}`);const info=[currentItem?.genre,currentItem?.year,currentItem?.language,`Episódio ${index+1}/${archivePlaylistFiles.length}`,formatTime(video.duration),directMediaSize?formatBytes(directMediaSize):''].filter(Boolean);$('meta').innerHTML=info.map(v=>`<span class="pill">${safe(v)}</span>`).join('');if(autoplay)video.play().catch(()=>{})},{once:true});video.load()}
  function refreshTrackControls(){
    const audioSel=$('audioTrack'), subSel=$('subtitleTrack');
    if(!audioSel||!subSel)return;
    audioSel.hidden=true; subSel.hidden=true;
    try{
      const ats=video.audioTracks;
      if(ats&&ats.length>1){
        audioSel.innerHTML='';
        for(let i=0;i<ats.length;i++){const tr=ats[i],o=document.createElement('option');o.value=String(i);o.textContent=`🎧 ${tr.label||tr.language||`Áudio ${i+1}`}`;if(tr.enabled)o.selected=true;audioSel.appendChild(o)}
        audioSel.hidden=false;
      }
    }catch{}
    try{
      const tts=video.textTracks;
      if(tts&&tts.length){
        subSel.innerHTML='<option value="off">CC desligada</option>';
        for(let i=0;i<tts.length;i++){const tr=tts[i],o=document.createElement('option');o.value=String(i);o.textContent=`CC ${tr.label||tr.language||`Legenda ${i+1}`}`;if(tr.mode==='showing')o.selected=true;subSel.appendChild(o)}
        subSel.hidden=false;
      }
    }catch{}
  }
  $('audioTrack')?.addEventListener('change',()=>{try{const ats=video.audioTracks,idx=Number($('audioTrack').value);for(let i=0;i<ats.length;i++)ats[i].enabled=i===idx}catch{}});
  $('subtitleTrack')?.addEventListener('change',()=>{try{const tts=video.textTracks,val=$('subtitleTrack').value;for(let i=0;i<tts.length;i++)tts[i].mode=(val!=='off'&&i===Number(val))?'showing':'disabled'}catch{}});
  video.addEventListener('loadedmetadata',()=>setTimeout(refreshTrackControls,150));
  video.addEventListener('loadeddata',()=>setTimeout(refreshTrackControls,300));
  function driveRouteKey(fileId){return `jogahub.drive.route.${fileId}`}
  function driveFailKey(fileId){return `jogahub.drive.fail.${fileId}`}
  function driveModeKey(){return `jogahub.drive.mode.${currentItem?.seriesId||currentItem?.id||'global'}`}
  function armDriveReconnect(kind){
    if(provider!=='iframe'||!currentItem?.driveFileId||settings.autoRecoverDrive===false||
      localStorage.getItem(driveModeKey())==='compat')return false;
    return driveReconnect.arm(kind);
  }
  function cancelDriveReconnect(){
    clearTimeout(driveReconnectTimer);driveReconnectTimer=0;
    driveReconnect.clear();
  }
  function readJson(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}}
  function writeJson(key,val){try{localStorage.setItem(key,JSON.stringify(val))}catch{}}
  function clearDriveFail(fileId){try{localStorage.removeItem(driveFailKey(fileId))}catch{}}
  function clearDriveEpisodeOnly(){
    const progress=readProgress();
    if(progress?.episodeOnly){try{localStorage.removeItem(progressKeyNow())}catch{}}
  }
  function rememberDriveSuccess(fileId,url,elapsed){
    DRIVE_ROUTES.savePreference(localStorage,driveRouteKey(fileId),url,elapsed);
    clearDriveFail(fileId);
    driveHealth?.recordSuccess(fileId);
  }
  function rememberDriveFailure(fileId,issue){
    const code=DRIVE_DIAGNOSTICS.info(issue?.code).code;
    driveHealth?.recordFailure(fileId,code,Number(issue?.status)||0);
    if(DRIVE_DIAGNOSTICS.ttl(code)){
      writeJson(driveFailKey(fileId),{updatedAt:Date.now(),code,status:issue?.status||0});
    }else clearDriveFail(fileId);
  }
  function recentDriveFailure(fileId){
    return DRIVE_DIAGNOSTICS.cached(readJson(driveFailKey(fileId)));
  }
  function showDriveDiagnostic(code){
    const details=DRIVE_DIAGNOSTICS.info(code);
    const box=$('driveDiagnostic');
    if(!box)return;
    box.hidden=false;
    box.dataset.reason=details.code;
    $('driveDiagnosticTitle').textContent=details.title;
    $('driveDiagnosticDetail').textContent=details.detail;
    $('driveDiagnosticAction').textContent=details.action;
  }
  function hideDriveDiagnostic(){
    const box=$('driveDiagnostic');
    if(box){box.hidden=true;delete box.dataset.reason}
  }
  function driveDirectCandidates(fileId){
    const preferred=DRIVE_ROUTES.readPreference(localStorage,driveRouteKey(fileId));
    return DRIVE_ROUTES.candidates(fileId,driveResourceKey,preferred).map(candidate=>candidate.url);
  }
  function driveConnectionPolicy(){
    const c=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
    return PLAYER_DRIVE_CORE.connectionPolicy({
      dataSaver:settings.dataSaver,saveData:!!c?.saveData,
      effectiveType:c?.effectiveType||'',downlink:c?.downlink||0,
      deviceMemory:navigator.deviceMemory||0,online:navigator.onLine,hidden:document.hidden
    });
  }
  function driveTimeoutMs(){return driveConnectionPolicy().timeout}
  // Registra os eventos antes do load; rotas em cache podem carregar imediatamente.
  function waitForDriveVideo(timeout=driveTimeoutMs(),start=()=>{},signal=null){
    return new Promise((resolve,reject)=>{
      let done=false, timer=0;
      const cleanup=()=>{clearTimeout(timer);video.removeEventListener('loadedmetadata',ok);video.removeEventListener('canplay',ok);video.removeEventListener('error',bad);signal?.removeEventListener('abort',abort)};
      const ok=()=>{if(done)return;done=true;cleanup();resolve(true)};
      const bad=error=>{if(done)return;done=true;cleanup();reject(error instanceof Error?error:(video.error||new Error('vídeo não carregou')))};
      const abort=()=>bad(new DOMException('Carregamento cancelado','AbortError'));
      if(signal?.aborted){abort();return}
      signal?.addEventListener('abort',abort,{once:true});
      video.addEventListener('loadedmetadata',ok);
      video.addEventListener('canplay',ok);
      video.addEventListener('error',bad);
      timer=setTimeout(()=>bad(new Error('tempo limite da rota direta')),timeout);
      try{start();if(video.readyState>=1&&!video.error)ok()}catch(error){bad(error)}
    });
  }
  async function useDriveDirect(autoplay=false,force=false){
    const fileId=currentItem?.driveFileId;
    if(!fileId)throw new Error('driveFileId ausente');
    if(navigator.onLine===false){
      armDriveReconnect('loading');
      const offline=new Error('Conexão indisponível para iniciar reprodução');
      offline.driveIssue='offline';
      throw offline;
    }
    const cachedFailure=!force&&recentDriveFailure(fileId);
    if(cachedFailure){
      const error=new Error('Falha direta recente: '+cachedFailure.code);
      error.driveIssue=cachedFailure.code;
      throw error;
    }
    driveAttemptController?.abort();
    driveAttemptController=new AbortController();
    const signal=driveAttemptController.signal;
    const token=driveSession.beginDirect();
    $('driveModeBtn').hidden=false;
    $('driveModeBtn').textContent='☁ usar modo Drive';
    hideDriveDiagnostic();
    loading.classList.remove('hide');
    loadingText.textContent='Drive Engine: escolhendo a melhor rota…';
    frame.removeAttribute('src');
    video.pause();video.removeAttribute('src');
    video.poster=currentItem?.thumb||'';
    const candidates=driveDirectCandidates(fileId);
    let lastError=null,lastIssue=null,lastStatus=0;
    for(let i=0;i<candidates.length;i++){
      if(!driveSession.isCurrent(token))return false;
      const candidate=candidates[i],started=performance.now();
      try{
        loadingText.textContent=`Drive Engine: testando rota ${i+1}/${candidates.length}…`;
        directMediaUrl=candidate;directMediaMime=PLAYER_DRIVE_CORE.directMime(currentItem?._driveName||queryDriveName,currentItem?.driveMime||queryDriveMime);
        video.preload=driveConnectionPolicy().preload;
        await waitForDriveVideo(driveTimeoutMs(),()=>{video.src=candidate;video.load()},signal);
        if(!driveSession.confirmDirect(token))return false;
        clearDriveEpisodeOnly();
        rememberDriveSuccess(fileId,candidate,performance.now()-started);
        const p=readProgress();
        const resume=MEDIA_QA.resumeTime(p,video.duration);
        if(resume!==null)video.currentTime=resume;
        video.playbackRate=Number(settings.speed)||1;
        if(typeof settings.volume==='number')video.volume=Math.max(0,Math.min(1,settings.volume));
        $('speed').value=String(video.playbackRate);
        loading.classList.add('hide');pc.hidden=false;
        setMode('enhanced','Google Drive • reprodução direta');
        hideDriveDiagnostic();
        syncCustomControls();showControls(3500);
        $('audioTrack').hidden=true;$('subtitleTrack').hidden=true;
        loadDriveSubtitles().catch(error=>console.warn('Legenda externa:',error));
        const routeSaved=DRIVE_ROUTES.readPreference(localStorage,driveRouteKey(fileId));
        const routeNote=routeSaved?.route===DRIVE_ROUTES.routeId(candidate)?'rota otimizada memorizada':'rota direta';
        const info=[currentItem?.genre,currentItem?.year,currentItem?.language,formatTime(video.duration),'Google Drive',routeNote].filter(Boolean);
        $('meta').innerHTML=info.map(v=>`<span class="pill">${safe(v)}</span>`).join('');
        $('driveTipText').innerHTML=`<b>Drive Engine ativo.</b> ${safe(routeNote)} • retomada exata e recuperação automática.`;
        if(autoplay)video.play().catch(()=>{});
        warmNextDriveEpisode();return true;
      }catch(error){
        if(!driveSession.isCurrent(token))return false;
        lastError=error;
        const mediaCode=Number(error?.code)||Number(video.error?.code)||0;
        const timedOut=/tempo limite/i.test(String(error?.message||''));
        console.warn('Falha na rota direta do Drive (tentativa)',i+1);
        // MediaError não fornece status HTTP; HEAD só é consultado APÓS
        // falha e pode ser bloqueado por CORS. Nunca baixar o vídeo inteiro
        // para fazer diagnóstico.
        const observation=navigator.onLine===false
          ? {status:0,contentType:''}
          : await DRIVE_DIAGNOSTICS.probe(candidate,fetch,{timeoutMs:1500});
        if(!driveSession.isCurrent(token))return false;
        const code=DRIVE_DIAGNOSTICS.classify({
          status:observation.status,contentType:observation.contentType,
          mediaCode,online:navigator.onLine,timedOut
        });
        if(code==='offline')armDriveReconnect('loading');
        lastIssue=code;
        lastStatus=observation.status||0;
        video.pause();video.removeAttribute('src');video.load();
        if(DRIVE_DIAGNOSTICS.stopTrying(code))break;
      }
    }
    if(!driveSession.failDirect(token))return false;
    directMediaUrl='';
    rememberDriveFailure(fileId,{code:lastIssue||'unknown',status:lastStatus});
    const failure=new Error(String(lastError?.message||'reprodução direta indisponível'));
    failure.driveIssue=lastIssue||'unknown';
    throw failure;
  }
  function useDriveFallback(persist=true){
    if(persist)cancelDriveReconnect();
    resetSeekWatch();stopVideoFrameMonitor();
    const seekNotice=$('seekHealthNotice');if(seekNotice)seekNotice.hidden=true;
    if(provider!=='iframe')return fallback();
    cleanDriveSubtitle();
    showSubtitleInfo('Legenda externa disponível no Drive. O iframe controla suas próprias faixas.');
    saveProgress(true);
    driveAttemptController?.abort();driveAttemptController=null;
    recoveryController?.abort();recoveryController=null;
    driveSession.switchToCompatible();
    if(persist)localStorage.setItem(driveModeKey(),'compat');
    fallback(persist?'modo compatibilidade solicitado':'fallback automático do Drive Engine');
    video.pause();video.removeAttribute('src');video.load();
    directMediaUrl='';$('downloadBtn').hidden=true;
  }
  function warmNextDriveEpisode(){if(!driveConnectionPolicy().warmNext||!nextItem?.driveFileId)return;const c=navigator.connection||navigator.mozConnection||navigator.webkitConnection;if(c?.saveData||c?.effectiveType==='2g'||c?.effectiveType==='slow-2g')return;try{const host=document.head;['https://drive.usercontent.google.com','https://drive.google.com'].forEach(h=>{if(document.querySelector(`link[data-jh-preconnect="${h}"]`))return;const l=document.createElement('link');l.rel='preconnect';l.href=h;l.crossOrigin='anonymous';l.dataset.jhPreconnect=h;host.appendChild(l)})}catch{}}
  async function initDrive(){
    if(await loadOfflineCopy())return;
    if(!currentItem?.driveFileId){useDriveFallback(false);return}
    if(PLAYER_DRIVE_CORE.needsCompatiblePlayer(currentItem._driveName||queryDriveName,currentItem.driveMime||queryDriveMime)){
      diagnoseDriveError('codec');
      driveHealth?.recordCompatible(currentItem.driveFileId,'codec');
      useDriveFallback(false);
      return;
    }
    const mime=PLAYER_DRIVE_CORE.directMime(currentItem?._driveName||queryDriveName,currentItem?.driveMime||queryDriveMime);
    if(!DRIVE_DIAGNOSTICS.directCapability(video,mime)){
      diagnoseDriveError('codec');
      driveHealth?.recordCompatible(currentItem.driveFileId,'codec');
      useDriveFallback(false);
      return;
    }
    driveMode=localStorage.getItem(driveModeKey())||localStorage.getItem('jogahub.drive.playerMode')||'auto';
    $('driveModeBtn').hidden=false;
    if(driveMode==='compat'){useDriveFallback();return}
    try{
      await useDriveDirect(false,false);
    }catch(error){
      console.warn('JogaHub Drive Engine:',error);
      diagnoseDriveError(error?.driveIssue||'unknown');
      if(driveSession.getMode()!=='compatible')useDriveFallback(false);
    }
  }
  async function initArchive(){if(type!=='filme'||!archiveId||!u){fallback('sem archiveId');return}if(!currentItem?.archivePlaylist&&await loadOfflineCopy())return;try{loadingText.textContent='Consultando os arquivos do Internet Archive…';const res=await fetch(`https://archive.org/metadata/${encodeURIComponent(archiveId)}`,{mode:'cors'});if(!res.ok)throw new Error(`metadata ${res.status}`);const data=await res.json(),files=Array.isArray(data.files)?data.files:[],allPlayable=files.filter(f=>f?.name&&/\.(mp4|webm|ogv|ogg)$/i.test(f.name)&&!/thumb|sample/i.test(f.name));const score=f=>{const n=(f.name||'').toLowerCase(),fmt=(f.format||'').toLowerCase();let s=0;if(/\.mp4$/i.test(n))s+=100;if(/h\.264|mpeg4|512kb/.test(fmt+n))s+=40;if((f.source||'')==='original')s+=20;if((Number(f.size)||0)>20e6)s+=10;return s};if(!allPlayable.length)throw new Error('nenhum vídeo direto');const grouped=new Map();for(const f of allPlayable){const key=archiveCanonical(f);const prev=grouped.get(key);if(!prev||score(f)>score(prev))grouped.set(key,f)}archivePlaylistFiles=[...grouped.values()].sort((a,b)=>String(a.name||'').localeCompare(String(b.name||''),'pt-BR',{numeric:true,sensitivity:'base'}));if(currentItem?.archivePlaylist&&archivePlaylistFiles.length>1){const requested=Math.max(0,Math.min(archivePlaylistFiles.length-1,Number(q.get('ep')||0)));selectArchiveEpisode(requested,false);return}archivePlaylistFiles.sort((a,b)=>score(b)-score(a));const f=archivePlaylistFiles[0];archiveEpisodeKey='';directMediaUrl=archiveFileUrl(f);directMediaSize=Number(f.size)||0;directMediaMime=(f.format||'').toLowerCase().includes('webm')?'video/webm':'video/mp4';video.poster=`https://archive.org/services/img/${encodeURIComponent(archiveId)}`;video.src=directMediaUrl;$('downloadBtn').hidden=false;files.filter(f=>f?.name&&/\.vtt$/i.test(f.name)).slice(0,8).forEach((f,i)=>{const tr=document.createElement('track');tr.kind='subtitles';tr.label=f.title||f.language||`Legenda ${i+1}`;tr.srclang=(f.language||'pt').toString().slice(0,2);tr.src=`https://archive.org/download/${encodeURIComponent(archiveId)}/${f.name.split('/').map(encodeURIComponent).join('/')}`;video.appendChild(tr)});video.addEventListener('loadedmetadata',()=>{const p=readProgress();const resume=MEDIA_QA.resumeTime(p,video.duration);if(resume!==null)video.currentTime=resume;video.playbackRate=Number(settings.speed)||1;if(typeof settings.volume==='number')video.volume=Math.max(0,Math.min(1,settings.volume));$('speed').value=String(video.playbackRate);loading.classList.add('hide');setMode('enhanced','player aprimorado');const info=[currentItem?.genre,currentItem?.year,currentItem?.language,formatTime(video.duration),directMediaSize?formatBytes(directMediaSize):''].filter(Boolean);$('meta').innerHTML=info.map(v=>`<span class="pill">${safe(v)}</span>`).join('')},{once:true});video.addEventListener('error',()=>fallback('falha no vídeo direto'),{once:true});video.load()}catch(e){fallback(e)}}
  function loadYTApi(){return new Promise((resolve,reject)=>{if(window.YT?.Player)return resolve();window.onYouTubeIframeAPIReady=resolve;const s=document.createElement('script');s.src='https://www.youtube.com/iframe_api';s.onerror=reject;document.head.appendChild(s);setTimeout(()=>window.YT?.Player?resolve():reject(new Error('YouTube API timeout')),10000)})}
  async function initYouTube(){try{await loadYTApi();const vars={playsinline:1,rel:0,modestbranding:1};if(playlistId){vars.listType='playlist';vars.list=playlistId}const cfg={width:'100%',height:'100%',playerVars:vars,events:{onReady:e=>{loading.classList.add('hide');setMode('youtube',playlistId?'playlist YouTube':'YouTube');const p=readProgress();if(!playlistId&&p&&p.time>20)e.target.seekTo(p.time,true);if(settings.speed&&e.target.setPlaybackRate)e.target.setPlaybackRate(Number(settings.speed));if(typeof settings.volume==='number'&&e.target.setVolume)e.target.setVolume(Math.round(settings.volume*100));clearInterval(ytTicker);ytTicker=setInterval(()=>{saveProgress(false);updateUpNextPreview()},1000)},onStateChange:e=>{if(e.data===0){saveProgress(true);updateContinueText();startCountdown()}if(e.data===2)saveProgress(true)},onError:e=>{loading.classList.add('hide');const code=Number(e?.data)||0;console.warn('YouTube embed error',code);$('notice').classList.add('show');$('notice').innerHTML=`<h3>Este vídeo não abriu dentro do JogaHub</h3><p>O YouTube bloqueou ou não conseguiu iniciar esta incorporação (erro ${code||'desconhecido'}).</p><p><a class="btn primary" href="${safe(sourceHref)}" target="_blank" rel="noopener noreferrer">Abrir este episódio no YouTube</a></p>`;stageShell.style.display='none';}}};if(youtubeId)cfg.videoId=youtubeId;ytPlayer=new YT.Player('ytHost',cfg)}catch(e){fallback(e)}}

  // Player 2.0 — controles próprios, gestos e diagnóstico
  const pc=$('playerControls'),seekBar=$('seekBar'),volumeBar=$('volumeBar'),timeLabel=$('timeLabel'),playPauseBtn=$('playPauseBtn'),centerPlay=$('centerPlay'),muteBtn=$('muteBtn'),quickSpeedBtn=$('quickSpeedBtn'),bufferBadge=$('bufferBadge');
  let controlsTimer=0,gestureStartY=0,gestureStartVolume=1,gestureMoved=false;
  let scrubActive=false,seekTicket=0,pendingSeek=null,seekHealthLabel='Nenhuma busca avaliada';
  function fmt2(v){v=Math.max(0,Number(v)||0);const h=Math.floor(v/3600),m=Math.floor((v%3600)/60),sec=Math.floor(v%60);return h?`${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`:`${m}:${String(sec).padStart(2,'0')}`}
  function showControls(ms=2600){stage.classList.add('controls-visible');clearTimeout(controlsTimer);controlsTimer=setTimeout(()=>{if(!video.paused&&!video.seeking)stage.classList.remove('controls-visible')},ms)}
  function syncCustomControls(){if(mode!=='enhanced')return;const d=video.duration||0,t=video.currentTime||0;if(!scrubActive)seekBar.value=d?String(Math.round((t/d)*1000)):'0';timeLabel.textContent=`${fmt2(t)} / ${fmt2(d)}`;const paused=video.paused;stage.classList.toggle('paused',paused);playPauseBtn.textContent=paused?'▶':'❚❚';centerPlay.textContent=paused?'▶':'❚❚';muteBtn.textContent=video.muted||video.volume===0?'🔇':video.volume<.5?'🔉':'🔊';volumeBar.value=String(video.muted?0:video.volume);quickSpeedBtn.textContent=`${video.playbackRate||1}×`;const introEnd=Number(currentItem?.introEnd||0),recapEnd=Number(currentItem?.recapEnd||0);$('skipIntroBtn').hidden=!(introEnd>0&&t<introEnd&&t>3);$('skipRecapBtn').hidden=!(recapEnd>0&&t<recapEnd&&t>1);if(settings.autoSkipRecap&&recapEnd>0&&t>1&&t<recapEnd-1&&!video.dataset.recapSkipped){video.dataset.recapSkipped='1';video.currentTime=recapEnd;toast('Recapitulação pulada automaticamente')}if(settings.autoSkipIntro&&introEnd>0&&t>3&&t<introEnd-1&&!video.dataset.introSkipped){video.dataset.introSkipped='1';video.currentTime=introEnd;toast('Abertura pulada automaticamente')}}
  function togglePlay(){if(mode!=='enhanced')return;video.paused?video.play().catch(()=>{}):video.pause();showControls();}
  playPauseBtn.onclick=togglePlay;centerPlay.onclick=togglePlay;$('back10Btn').onclick=()=>seek(-10);$('fwd10Btn').onclick=()=>seek(10);
  function resetSeekWatch(){
    seekTicket++;if(pendingSeek){clearTimeout(pendingSeek.timer);pendingSeek=null}
  }
  function finishSeekWatch(event){
    if(!pendingSeek)return;
    if(event?.type==='seeked')pendingSeek.confirmed=true;
    const elapsed=performance.now()-pendingSeek.started;
    const result=MEDIA_QA.seekResult({target:pendingSeek.target,actual:video.currentTime,seeked:pendingSeek.confirmed,
      seeking:video.seeking,elapsedMs:elapsed,timeoutMs:pendingSeek.timeout,
      seekable:MEDIA_QA.rangeInfo(video.seekable,pendingSeek.target)});
    if(result.state==='pending')return;
    seekHealthLabel=result.label;
    const notice=$('seekHealthNotice');
    if(notice){
      notice.hidden=result.state==='ok'||result.state==='invalid';
      if(!notice.hidden)notice.textContent='Busca no vídeo: '+result.label+'. Se persistir, use o modo Drive.';
    }
    clearTimeout(pendingSeek.timer);pendingSeek=null;
    updateStats();
    if((result.state==='timeout'||result.state==='unavailable')&&mode==='enhanced'&&provider==='iframe')
      showRecovery('O avanço não foi confirmado. A origem pode não oferecer busca temporal estável. Experimente o modo Drive.');
  }
  function seekToChecked(seconds){
    if(mode!=='enhanced')return;
    const target=MEDIA_QA.targetTime(seconds,video.duration);
    if(target===null||video.readyState<1)return;
    resetSeekWatch();
    if(MEDIA_QA.isNoopSeek(target,video.currentTime)){
      seekHealthLabel='Posição já selecionada — nenhuma nova busca necessária';
      const notice=$('seekHealthNotice');if(notice)notice.hidden=true;
      updateStats();return;
    }
    const token=seekTicket;
    pendingSeek={target,confirmed:false,started:performance.now(),timeout:driveConnectionPolicy().timeout,
      timer:setTimeout(()=>{if(token===seekTicket)finishSeekWatch()},driveConnectionPolicy().timeout+60)};
    seekHealthLabel='Verificando avanço…';
    const notice=$('seekHealthNotice');if(notice)notice.hidden=true;
    try{video.currentTime=target}catch(error){
      clearTimeout(pendingSeek.timer);pendingSeek=null;
      seekHealthLabel='Navegador rejeitou o avanço';
      if(notice){notice.hidden=false;notice.textContent='O navegador rejeitou a posição solicitada.'}
    }
    // seeked pode disparar antes de a imagem estar pronta; confirmamos só o relógio,
    // sem afirmar que todos os frames ou o áudio foram decodificados.
    // Alterar currentTime sozinho não confirma uma busca; o evento seeked confirma.
  }
  ['seeked','timeupdate','playing'].forEach(ev=>video.addEventListener(ev,finishSeekWatch));
  seekBar.addEventListener('input',()=>{
    if(mode!=='enhanced'||!Number.isFinite(video.duration)||video.duration<=0)return;
    scrubActive=true;
    const t=Number(seekBar.value)/1000*video.duration;
    timeLabel.textContent=fmt2(t)+' / '+fmt2(video.duration);
    showControls(5000);
  });
  seekBar.addEventListener('change',()=>{
    if(mode!=='enhanced'){scrubActive=false;return}
    const target=(Number(seekBar.value)/1000)*video.duration;
    seekToChecked(target);
    scrubActive=false;
  });
  seekBar.addEventListener('blur',()=>{scrubActive=false});
  volumeBar.addEventListener('input',()=>{video.muted=false;video.volume=Number(volumeBar.value);saveSettings({volume:video.volume});syncCustomControls()});
  muteBtn.onclick=()=>{video.muted=!video.muted;syncCustomControls();showControls()};
  const speeds=[0.75,1,1.25,1.5,1.75,2];quickSpeedBtn.onclick=()=>{const i=speeds.findIndex(x=>Math.abs(x-video.playbackRate)<.01);video.playbackRate=speeds[(i+1)%speeds.length];$('speed').value=String(video.playbackRate);saveSettings({speed:video.playbackRate});syncCustomControls();showControls(4000)};
  $('nativeFullBtn').onclick=()=>$('fullBtn').click();
  $('episodesBtn').onclick=()=>{const ep=$('episodes');if(ep.hidden)return;ep.scrollIntoView({behavior:'smooth',block:'start'});ep.classList.add('highlight');setTimeout(()=>ep.classList.remove('highlight'),1200)};
  $('skipIntroBtn').onclick=()=>{const t=Number(currentItem?.introEnd||0);if(t>0)video.currentTime=t};$('skipRecapBtn').onclick=()=>{const t=Number(currentItem?.recapEnd||0);if(t>0)video.currentTime=t};
  ['mousemove','pointerdown','touchstart'].forEach(ev=>stage.addEventListener(ev,()=>showControls(),{passive:true}));
  video.addEventListener('click',togglePlay);video.addEventListener('dblclick',e=>{const r=video.getBoundingClientRect();seek(e.clientX<r.left+r.width/2?-10:10)});
  ['timeupdate','durationchange','play','pause','ratechange','volumechange','seeked'].forEach(ev=>video.addEventListener(ev,syncCustomControls));
  video.addEventListener('waiting',()=>bufferBadge.hidden=false);video.addEventListener('stalled',()=>bufferBadge.hidden=false);['playing','canplay','seeked'].forEach(ev=>video.addEventListener(ev,()=>bufferBadge.hidden=true));
  let flashFeedback=null,flashTimer=0;
  function flashSeek(txt,x){
    // Um só indicador por gesto: não criar dezenas de nós DOM por segundo.
    if(!flashFeedback){flashFeedback=document.createElement('div');flashFeedback.className='tap-feedback';stage.appendChild(flashFeedback)}
    flashFeedback.textContent=txt;flashFeedback.style.left=x;
    clearTimeout(flashTimer);
    flashTimer=setTimeout(()=>{flashFeedback?.remove();flashFeedback=null},520);
  }
  let playerBrightness=Math.max(.35,Math.min(1.35,Number(settings.brightness)||1));
  let gestureStartBrightness=playerBrightness,lastGestureDraw=0;
  function applyBrightness(){video.style.filter='brightness('+playerBrightness+')'}
  applyBrightness();
  function bindGesture(el,dir){
    let last=0;
    el.addEventListener('pointerup',e=>{
      if(e.pointerType==='mouse')return;
      const now=Date.now();
      if(!gestureMoved&&now-last<320){
        seek(dir*10);flashSeek(dir<0?'↶ 10s':'10s ↷',dir<0?'25%':'75%');last=0;
      }else last=now;
    });
    el.addEventListener('pointerdown',e=>{
      gestureStartY=e.clientY;gestureStartVolume=video.volume;
      gestureStartBrightness=playerBrightness;gestureMoved=false;lastGestureDraw=0;
    });
    el.addEventListener('pointermove',e=>{
      if(e.pointerType==='mouse'||!e.buttons)return;
      const delta=(gestureStartY-e.clientY)/180;
      if(Math.abs(delta)<=.04)return;
      gestureMoved=true;
      if(dir<0){
        playerBrightness=Math.max(.35,Math.min(1.35,gestureStartBrightness+delta));applyBrightness();
      }else{
        video.muted=false;video.volume=Math.max(0,Math.min(1,gestureStartVolume+delta));
      }
      // No máximo ~30 atualizações visuais/s no gesto.
      const now=performance.now();
      if(now-lastGestureDraw>=32){
        lastGestureDraw=now;
        flashSeek(dir<0?'☀ '+Math.round(playerBrightness*100)+'%':'🔊 '+Math.round(video.volume*100)+'%',dir<0?'25%':'75%');
        syncCustomControls();showControls(1800);
      }
    });
    const commit=()=>{
      if(!gestureMoved)return;
      if(dir<0)saveSettings({brightness:playerBrightness});
      // Volume persistido pelo listener debounce de volumechange.
      gestureMoved=false;
    };
    el.addEventListener('pointerup',commit);el.addEventListener('pointercancel',commit);
  }
  bindGesture($('gestureLeft'),-1);bindGesture($('gestureRight'),1);

  let sleepTimer=0,sleepEndsAt=0,sleepTick=0,toastTimer=0;
  function toast(msg){const el=$('toast');if(!el)return;el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2200)}
  function savePlayerPrefs(){saveSettings({autoplayNext:settings.autoplayNext,autoSkipIntro:settings.autoSkipIntro,autoSkipRecap:settings.autoSkipRecap,dataSaver:settings.dataSaver,autoRecoverDrive:settings.autoRecoverDrive,captionSize:settings.captionSize,captionBg:settings.captionBg})}
  function syncSettingsUI(){const a=$('autoplayNextToggle'),i=$('autoIntroToggle'),r=$('autoRecapToggle'),d=$('dataSaverToggle'),ar=$('autoRecoverToggle');if(a)a.checked=!!settings.autoplayNext;if(i)i.checked=!!settings.autoSkipIntro;if(r)r.checked=!!settings.autoSkipRecap;if(d)d.checked=!!settings.dataSaver;if(ar)ar.checked=settings.autoRecoverDrive!==false;if($('captionSizeSelect'))$('captionSizeSelect').value=String(Number(settings.captionSize)||100);if($('captionBgSelect'))$('captionBgSelect').value=String(Number(settings.captionBg)||.72);document.querySelectorAll('[data-sleep]').forEach(b=>b.classList.toggle('active',Number(b.dataset.sleep)===sleepTimer))}
  function setSleep(minutes){clearInterval(sleepTick);sleepTimer=Number(minutes)||0;sleepEndsAt=sleepTimer?Date.now()+sleepTimer*60000:0;syncSettingsUI();updateSleepStatus();if(!sleepTimer){toast('Temporizador desligado');return}toast(`Player vai pausar em ${sleepTimer} min`);sleepTick=setInterval(()=>{updateSleepStatus();if(sleepEndsAt&&Date.now()>=sleepEndsAt){clearInterval(sleepTick);sleepTick=0;sleepTimer=0;sleepEndsAt=0;if(mode==='enhanced')video.pause();else if(mode==='youtube'&&ytPlayer?.pauseVideo)ytPlayer.pauseVideo();updateSleepStatus();syncSettingsUI();toast('Temporizador finalizado — reprodução pausada')}},1000)}
  function updateSleepStatus(){const el=$('sleepStatus');if(!el)return;if(!sleepEndsAt){el.textContent='';return}const left=Math.max(0,sleepEndsAt-Date.now()),m=Math.floor(left/60000),sec=Math.floor((left%60000)/1000);el.textContent=`⏲ pausa em ${m}:${String(sec).padStart(2,'0')}`}
  $('settingsBtn')?.addEventListener('click',()=>{$('settingsSheet').classList.add('show');syncSettingsUI()});$('closeSettings')?.addEventListener('click',()=>$('settingsSheet').classList.remove('show'));$('settingsSheet')?.addEventListener('click',e=>{if(e.target===$('settingsSheet'))$('settingsSheet').classList.remove('show')});
  $('autoplayNextToggle')?.addEventListener('change',e=>{settings.autoplayNext=e.target.checked;savePlayerPrefs();if(!settings.autoplayNext)cancelCountdown();toast(settings.autoplayNext?'Próximo episódio automático ativado':'Próximo episódio automático desativado')});
  $('autoIntroToggle')?.addEventListener('change',e=>{settings.autoSkipIntro=e.target.checked;savePlayerPrefs()});$('autoRecapToggle')?.addEventListener('change',e=>{settings.autoSkipRecap=e.target.checked;savePlayerPrefs()});$('dataSaverToggle')?.addEventListener('change',e=>{settings.dataSaver=e.target.checked;savePlayerPrefs();video.preload=driveConnectionPolicy().preload;toast(settings.dataSaver?'Economia de dados ativada':'Pré-carregamento controlado por metadados')});document.querySelectorAll('[data-sleep]').forEach(b=>b.addEventListener('click',()=>setSleep(Number(b.dataset.sleep))));syncSettingsUI();video.preload=driveConnectionPolicy().preload;
  function updateNetworkChip(){const c=navigator.connection||navigator.mozConnection||navigator.webkitConnection,el=$('networkChip');if(!el)return;const online=navigator.onLine;if(!online){el.textContent='offline';el.className='network-chip warn';return}const t=c?.effectiveType||'',down=Number(c?.downlink||0);el.textContent=t?`${t}${down?` • ${down.toFixed(1)} Mb/s`:''}`:'online';el.className='network-chip '+((t==='2g'||t==='slow-2g'||(down&&down<1.2))?'warn':'good')}
  updateNetworkChip();window.addEventListener('online',updateNetworkChip);window.addEventListener('offline',updateNetworkChip);navigator.connection?.addEventListener?.('change',updateNetworkChip);
  function updateBuffered(){const el=$('bufferFill');if(!el||mode!=='enhanced'||!video.duration){if(el)el.style.width='0';return}let end=0;for(let i=0;i<video.buffered.length;i++){if(video.buffered.start(i)<=video.currentTime+1)end=Math.max(end,video.buffered.end(i))}el.style.width=`${Math.max(0,Math.min(100,end/video.duration*100))}%`}
  video.addEventListener('progress',updateBuffered);video.addEventListener('timeupdate',()=>{updateBuffered();updateUpNextPreview()});video.addEventListener('loadedmetadata',updateBuffered);
  function mediaMetadata(){if(!('mediaSession'in navigator))return;try{navigator.mediaSession.metadata=new MediaMetadata({title:currentItem?.title||title,artist:currentItem?.seriesTitle||'JogaHub',album:currentItem?.genre||'JogaHub',artwork:currentItem?.thumb?[{src:new URL(currentItem.thumb,location.href).href,sizes:'512x512'}]:[]})}catch{}}
  function setupMediaSession(){if(!('mediaSession'in navigator))return;mediaMetadata();const handlers={play:()=>mode==='enhanced'?video.play().catch(()=>{}):ytPlayer?.playVideo?.(),pause:()=>mode==='enhanced'?video.pause():ytPlayer?.pauseVideo?.(),seekbackward:d=>seek(-(d.seekOffset||10)),seekforward:d=>seek(d.seekOffset||10),previoustrack:()=>prevItem&&(location.href=movieHref(prevItem)),nexttrack:()=>nextItem&&(location.href=movieHref(nextItem))};for(const [a,h] of Object.entries(handlers)){try{navigator.mediaSession.setActionHandler(a,h)}catch{}}try{navigator.mediaSession.setActionHandler('seekto',d=>{if(mode==='enhanced'&&Number.isFinite(d.seekTime))seekToChecked(d.seekTime);else if(mode==='youtube'&&ytPlayer?.seekTo)ytPlayer.seekTo(d.seekTime||0,true)})}catch{}}
  setupMediaSession();video.addEventListener('timeupdate',()=>{try{if('mediaSession'in navigator&&video.duration>0&&Number.isFinite(video.duration))navigator.mediaSession.setPositionState({duration:video.duration,playbackRate:video.playbackRate||1,position:Math.min(video.currentTime,video.duration)})}catch{}});
  function markWatched(){const p={time:getDuration()||getTime(),duration:getDuration()||getTime(),finished:true,updatedAt:Date.now()};try{localStorage.setItem(progressKeyNow(),JSON.stringify(p))}catch{}$('watchedBtn')?.classList.add('done');$('watchedBtn').textContent='✓ assistido';updateContinueText();renderEpisodes();toast('Marcado como assistido')}
  $('watchedBtn')?.addEventListener('click',markWatched);try{if(readProgress()?.finished){$('watchedBtn').classList.add('done');$('watchedBtn').textContent='✓ assistido'}}catch{}
  let holdTimer=0,holdPrevRate=1;stage.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'||mode!=='enhanced')return;holdPrevRate=video.playbackRate||1;holdTimer=setTimeout(()=>{video.playbackRate=2;$('playerControls').classList.add('hold-speed');toast('2× enquanto segurar')},650)},{passive:true});function endHold(){clearTimeout(holdTimer);holdTimer=0;if(mode==='enhanced'&&$('playerControls')?.classList.contains('hold-speed')){video.playbackRate=holdPrevRate;$('playerControls').classList.remove('hold-speed');syncCustomControls()}}stage.addEventListener('pointerup',endHold);stage.addEventListener('pointercancel',endHold);stage.addEventListener('pointerleave',endHold);
  document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement){try{screen.orientation?.unlock?.()}catch{}}});

  // Player 5.0 — diagnóstico, Drive Engine, scrub preview, recuperação inteligente e transmissão remota
  const stallTracker=PLAYER_DRIVE_CORE.makeStallTracker();let statsTicker=0,lastVideoFrames={total:0,dropped:0};
  let frameTiming=null,frameWatchHandle=0,frameWatchActive=false;
  function applyCaptionStyle(){document.documentElement.style.setProperty('--cue-size',`${Number(settings.captionSize)||100}%`);document.documentElement.style.setProperty('--cue-bg',String(Number(settings.captionBg)||.72));if($('captionSizeSelect'))$('captionSizeSelect').value=String(Number(settings.captionSize)||100);if($('captionBgSelect'))$('captionBgSelect').value=String(Number(settings.captionBg)||.72)}
  applyCaptionStyle();
  $('captionSizeSelect')?.addEventListener('change',()=>{saveSettings({captionSize:Number($('captionSizeSelect').value)||100});settings.captionSize=Number($('captionSizeSelect').value)||100;applyCaptionStyle()});
  $('captionBgSelect')?.addEventListener('change',()=>{saveSettings({captionBg:Number($('captionBgSelect').value)||.72});settings.captionBg=Number($('captionBgSelect').value)||.72;applyCaptionStyle()});
  function qualityLabel(){if(mode!=='enhanced'||!video.videoHeight)return mode==='fallback'?'Drive':'—';const h=video.videoHeight,w=video.videoWidth;let q=h>=2160?'4K':h>=1440?'1440p':h>=1080?'1080p':h>=720?'720p':h>=480?'480p':`${h}p`;return `${q} • ${w}×${h}`}
  function bufferAhead(){try{const t=video.currentTime||0,b=video.buffered;for(let i=0;i<b.length;i++)if(t>=b.start(i)&&t<=b.end(i))return Math.max(0,b.end(i)-t)}catch{}return 0}
  function updateQualityChip(){const el=$('qualityChip');if(!el)return;el.textContent=qualityLabel();el.hidden=mode==='youtube'&&!ytPlayer}
  function updateStats(){if(!$('statsPanel')?.classList.contains('show'))return;let frames='—';try{const q=video.getVideoPlaybackQuality?.();if(q){lastVideoFrames={total:q.totalVideoFrames||0,dropped:q.droppedVideoFrames||0};frames=`${lastVideoFrames.dropped}/${lastVideoFrames.total} descartados`}}catch{}const conn=navigator.connection||navigator.mozConnection||navigator.webkitConnection;const rows=[['Modo',mode],['Fonte',provider==='iframe'?'Google Drive':provider==='youtube'?'YouTube':'Internet Archive'],['Resolução',qualityLabel()],['Buffer',mode==='enhanced'?`${bufferAhead().toFixed(1)} s`:'—'],['Rede',conn?`${conn.effectiveType||''}${conn.downlink?` • ${conn.downlink} Mb/s`:''}`:'não disponível'],['Frames',frames],['Velocidade',mode==='enhanced'?`${video.playbackRate||1}×`:`${settings.speed||1}×`],['Tempo',`${fmt2(getTime())} / ${fmt2(getDuration())}`],['Áudio (evidência)',MEDIA_QA.mediaSnapshot(video).audio.label],['Decodificação',MEDIA_QA.mediaSnapshot(video).playback.label],['Intervalos navegáveis',(()=>{const v=MEDIA_QA.mediaSnapshot(video).seekable;return v.count&&v.end!==null?fmt2(v.start)+' a '+fmt2(v.end):'Não informado pelo navegador'})()],['Última busca',seekHealthLabel],['Relógio × quadro',frameTiming===null?'Não medido (não prova sincronização de áudio)':`${(frameTiming*1000).toFixed(0)} ms (não mede áudio)`]];$('statsGrid').innerHTML=rows.map(([a,b])=>`<span>${safe(a)}</span><b>${safe(b)}</b>`).join('')}
  function stopVideoFrameMonitor(){
    frameWatchActive=false;
    if(frameWatchHandle&&video.cancelVideoFrameCallback)try{video.cancelVideoFrameCallback(frameWatchHandle)}catch{}
    frameWatchHandle=0;
  }
  function samplePresentedFrame(){
    if(!frameWatchActive||!video.requestVideoFrameCallback)return;
    frameWatchHandle=video.requestVideoFrameCallback((now,meta)=>{
      if(!frameWatchActive)return;
      frameTiming=MEDIA_QA.frameClockDelta(video.currentTime,meta?.mediaTime);
      if(!document.hidden&&$('statsPanel')?.classList.contains('show'))samplePresentedFrame();
      else frameWatchHandle=0;
    });
  }
  $('statsBtn')?.addEventListener('click',()=>{
    const on=$('statsPanel').classList.toggle('show');
    $('statsBtn').textContent=on?'📊 fechar stats':'📊 stats';
    if(on){
      updateStats();clearInterval(statsTicker);statsTicker=setInterval(updateStats,1000);
      stopVideoFrameMonitor();frameWatchActive=true;samplePresentedFrame();
    }else{clearInterval(statsTicker);stopVideoFrameMonitor()}
  });
  function renderChapterMarks(){const host=$('chapterMarks');if(!host)return;host.innerHTML='';const d=getDuration();const ch=Array.isArray(currentItem?.chapters)?currentItem.chapters:[];if(!d||!ch.length)return;host.style.position='absolute';host.style.inset='0';for(const c of ch){const t=Number(c.time??c.start??0);if(t<=0||t>=d)continue;const m=document.createElement('i');m.className='chapter-mark';m.style.left=`${(t/d)*100}%`;m.title=c.title||formatTime(t);host.appendChild(m)}}
  function scrubPreviewAt(ev){if(mode!=='enhanced'||!video.duration)return;const r=$('seekBar').getBoundingClientRect(),x=Math.max(0,Math.min(r.width,ev.clientX-r.left)),pct=x/r.width,t=pct*video.duration,sp=$('scrubPreview');sp.textContent=fmt2(t);sp.style.left=`${r.left-stage.getBoundingClientRect().left+x}px`;sp.classList.add('show')}
  $('seekBar')?.addEventListener('pointermove',scrubPreviewAt);$('seekBar')?.addEventListener('pointerleave',()=>$('scrubPreview')?.classList.remove('show'));$('seekBar')?.addEventListener('pointerup',()=>setTimeout(()=>$('scrubPreview')?.classList.remove('show'),400));
  function showRecovery(msg='A reprodução está instável.'){$('recoveryText').textContent=msg;$('recoveryCard').classList.add('show')}
  function hideRecovery(){$('recoveryCard').classList.remove('show')}
  let recoveryPending=false,healthyPlaybackSince=0;
  async function recoverPlayback(){
    if(mode!=='enhanced'||recoveryPending)return;
    if(provider==='iframe'&&navigator.onLine===false){
      armDriveReconnect('playback');
      showRecovery('A conexão caiu. O JogaHub preservou o ponto atual e tentará recuperar quando a internet voltar.');
      return;
    }
    const isDrive=provider==='iframe'&&driveSession.getMode()==='direct';
    const token=isDrive?driveSession.beginRecovery():null;
    if(isDrive&&token===null)return;
    const position=PLAYER_DRIVE_CORE.resumeTarget(video.currentTime,video.duration);
    const wasPlaying=!video.paused,src=video.currentSrc||video.src;
    // Checkpoint ANTES de alterar src: pause/load/seek podem emitir timeupdate em 0.
    saveProgress(true);
    clearTimeout(saveTimer);
    const controller=new AbortController();
    recoveryController=controller;
    recoveryPending=true;hideRecovery();stage.classList.add('recovering');
    try{
      if(!src)throw new Error('origem de vídeo ausente');
      video.pause();video.removeAttribute('src');video.load();
      await waitForDriveVideo(driveTimeoutMs(),()=>{video.src=src;video.load()},controller.signal);
      if(controller.signal.aborted||(isDrive&&!driveSession.isCurrent(token))||mode!=='enhanced')return;
      if(position>0){
        video.currentTime=PLAYER_DRIVE_CORE.resumeTarget(position,video.duration);
        if(video.seeking){
          await new Promise(resolve=>{
            let done=false, timer=0;
            const finish=()=>{if(done)return;done=true;clearTimeout(timer);video.removeEventListener('seeked',finish);controller.signal.removeEventListener('abort',finish);resolve()};
            video.addEventListener('seeked',finish,{once:true});
            controller.signal.addEventListener('abort',finish,{once:true});
            timer=setTimeout(finish,1800);
          });
        }
      }
      if(controller.signal.aborted||(isDrive&&!driveSession.isCurrent(token))||mode!=='enhanced')return;
      if(wasPlaying)await video.play().catch(()=>{});
      toast('Reprodução recuperada');stallTracker.reset();healthyPlaybackSince=Date.now();
    }catch(error){
      if(controller.signal.aborted||(isDrive&&!driveSession.isCurrent(token)))return;
      console.warn('recuperação falhou',error);
      if(provider==='iframe'&&navigator.onLine===false)armDriveReconnect('loading');
      if(provider==='iframe'&&currentItem?.driveFileId)useDriveFallback(false);
      else toast('Não foi possível recuperar automaticamente');
    }finally{
      if(recoveryController===controller)recoveryController=null;
      if(isDrive)driveSession.endRecovery(token);
      recoveryPending=false;stage.classList.remove('recovering');
    }
  }
  function autoRecoverPlayback(){
    if(mode!=='enhanced'||recoveryPending||provider!=='iframe'||driveSession.getMode()!=='direct')return;
    if(navigator.onLine===false){
      armDriveReconnect('playback');
      showRecovery('Sem conexão. A reprodução será recuperada quando a internet voltar.');
      return;
    }
    const now=Date.now(), state=recoveryBudget.status(now);
    if(state.exhausted){
      showRecovery('A recuperação automática já foi tentada. Alternando para o modo Drive para evitar travamentos repetidos.');
      useDriveFallback(false);
      return;
    }
    if(recoveryBudget.begin(now))recoverPlayback();
  }
  // Quando a rede cai, não gasta o orçamento de recuperação nem reinicia
  // desnecessariamente a mídia; o usuário pode optar pelo modo Drive.
  window.addEventListener('offline',()=>{
    if(provider!=='iframe'||!currentItem?.driveFileId)return;
    if(mode==='enhanced'&&driveSession.getMode()==='direct'){
      if(armDriveReconnect('playback'))
        showRecovery('Sem internet. O ponto atual foi preservado; a recuperação poderá continuar ao reconectar.');
    }else if(driveSession.getMode()==='loading'){
      armDriveReconnect('loading');
    }
  });
  window.addEventListener('online',()=>{
    if(!driveReconnect.status().armed)return;
    clearTimeout(driveReconnectTimer);
    driveReconnectTimer=setTimeout(async()=>{
      driveReconnectTimer=0;
      if(navigator.onLine===false)return;
      const kind=driveReconnect.take();
      if(!kind||provider!=='iframe'||!currentItem?.driveFileId||
        settings.autoRecoverDrive===false||localStorage.getItem(driveModeKey())==='compat')return;
      try{
        if(kind==='playback'&&mode==='enhanced'&&driveSession.getMode()==='direct')
          await recoverPlayback();
        else
          await useDriveDirect(true,true);
        if(mode==='enhanced')hideRecovery();
      }catch(error){
        if(driveSession.getMode()==='compatible')return;
        diagnoseDriveError(error?.driveIssue||'unknown');
        useDriveFallback(false);
      }
    },900);
  });
  video.addEventListener('timeupdate',()=>{
    if(mode==='enhanced'&&!video.paused&&!recoveryPending&&healthyPlaybackSince&&Date.now()-healthyPlaybackSince>90000){
      recoveryBudget.reset();healthyPlaybackSince=Date.now();
    }
  });
  $('retryPlaybackBtn')?.addEventListener('click',recoverPlayback);$('compatPlaybackBtn')?.addEventListener('click',()=>{hideRecovery();if(provider==='iframe')useDriveFallback()});$('dismissRecoveryBtn')?.addEventListener('click',hideRecovery);
  function onPlaybackStall(){
    if(mode!=='enhanced'||recoveryPending)return;
    if(!PLAYER_DRIVE_CORE.shouldTrackStall({paused:video.paused,ended:video.ended,seeking:video.seeking,readyState:video.readyState,buffer:bufferAhead()}))return;
    const result=stallTracker.mark();
    if(!result.accepted)return;
    if(result.count>=3){
      showRecovery(`O vídeo travou ${result.count} vezes nos últimos 30 segundos. Você pode tentar recuperar sem perder o ponto atual.`);
      if(settings.autoRecoverDrive&&provider==='iframe'&&result.count>=5)autoRecoverPlayback();
    }
  }
  video.addEventListener('stalled',onPlaybackStall);video.addEventListener('waiting',()=>{if(bufferAhead()<.8)onPlaybackStall()});video.addEventListener('error',()=>{if(mode==='enhanced'&&provider==='iframe'&&driveSession.getMode()==='direct'&&!recoveryPending){showRecovery('Ocorreu um erro ao reproduzir o arquivo diretamente.');if(settings.autoRecoverDrive)autoRecoverPlayback()}});video.addEventListener('playing',()=>{healthyPlaybackSince=Date.now();stallTracker.reset();updateQualityChip()});video.addEventListener('loadedmetadata',()=>{updateQualityChip();renderChapterMarks()});video.addEventListener('durationchange',renderChapterMarks);
  const autoRecoverToggle=$('autoRecoverToggle');if(autoRecoverToggle){autoRecoverToggle.checked=settings.autoRecoverDrive!==false;autoRecoverToggle.addEventListener('change',()=>{settings.autoRecoverDrive=autoRecoverToggle.checked;saveSettings({autoRecoverDrive:settings.autoRecoverDrive})})}
  async function setupRemotePlayback(){const btn=$('remoteBtn');if(!btn)return;try{if(video.remote&&typeof video.remote.prompt==='function'){btn.hidden=false;btn.onclick=async()=>{try{await video.remote.prompt()}catch(e){if(e?.name!=='AbortError')toast('Nenhum dispositivo disponível para transmitir')}};video.remote.addEventListener?.('connect',()=>{btn.textContent='📺 conectado';toast('Transmissão conectada')});video.remote.addEventListener?.('disconnect',()=>btn.textContent='📺 transmitir')}else if('WebKitPlaybackTargetAvailabilityEvent'in window){btn.hidden=false;video.setAttribute('x-webkit-airplay','allow');btn.textContent='📺 AirPlay';btn.onclick=()=>video.webkitShowPlaybackTargetPicker?.()}}catch{}}
  setupRemotePlayback();

  function diagnoseDriveError(reason='unknown'){
    showDriveDiagnostic(reason);
  }

  async function init(){if(provider==='youtube'&&(youtubeId||playlistId)){await initYouTube();return}if(provider==='iframe'&&u){await initDrive();return}await initArchive()}init();
  async function removeCurrentDownload(){
    const key=currentItem?.id||id;
    await offlineManager.remove(key);
    const btn=$('downloadBtn');
    btn.dataset.saved='';
    btn.textContent='⬇ baixar offline';
  }
  async function downloadCurrent(){
    const btn=$('downloadBtn'),key=currentItem?.id||id;
    if(offlineManager.isBusy()){
      offlineManager.cancel();
      $('downloadText').textContent='Cancelando…';
      return;
    }
    if(!directMediaUrl||!key)return;
    if(loadMediaRegistry()[key]){
      if(confirm('Remover este vídeo dos downloads offline?')){
        try{await removeCurrentDownload()}catch{toast('Não foi possível remover o vídeo offline')}
      }
      return;
    }
    if(navigator.onLine===false){toast('Conecte-se à internet para fazer o download.');return}
    const meter=$('downloadMeter'),bar=$('downloadBar'),pct=$('downloadPct');
    try{
      btn.classList.add('downloading');
      btn.textContent='✕ cancelar download';
      meter.classList.add('show');
      $('downloadText').textContent='Baixando vídeo…';
      bar.style.width='0%';pct.textContent='0%';
      const record=await offlineManager.download({
        key,url:directMediaUrl,
        meta:{
          title:currentItem?.title||title,year:currentItem?.year||'',genre:currentItem?.genre||'',
          thumb:currentItem?.thumb||video.poster||'',mime:directMediaMime,archiveId,
          playerHref:location.pathname.split('/').pop()+location.search
        },
        onProgress({done,total,percent}){
          pct.textContent=total?percent+'%':formatBytes(done);
          bar.style.width=total?percent+'%':'35%';
        }
      });
      btn.dataset.saved='1';
      btn.textContent='✓ salvo offline';
      $('downloadText').textContent='Download concluído • '+formatBytes(record.size);
      pct.textContent='100%';bar.style.width='100%';
      toast('Vídeo salvo para uso offline');
    }catch(error){
      const canceled=error?.name==='AbortError'||/cancelad|abort/i.test(String(error?.message||''));
      btn.textContent='⬇ tentar novamente';
      $('downloadText').textContent=canceled?'Download cancelado':'Falha ao salvar vídeo offline';
      toast(canceled?'Download cancelado':'Não foi possível baixar o vídeo; verifique acesso, rede e espaço livre');
    }finally{
      btn.classList.remove('downloading');
      setTimeout(()=>{if(!offlineManager.isBusy())meter.classList.remove('show')},1700);
    }
  }
  $('downloadBtn').onclick=downloadCurrent;
  $('driveModeBtn').onclick=async()=>{if(provider!=='iframe')return;if(mode==='enhanced'){localStorage.setItem(driveModeKey(),'compat');useDriveFallback()}else{localStorage.setItem(driveModeKey(),'auto');localStorage.setItem('jogahub.drive.playerMode','auto');clearDriveFail(currentItem?.driveFileId||'');$('driveModeBtn').disabled=true;try{await useDriveDirect(true,true)}catch(e){diagnoseDriveError(e?.driveIssue||'unknown');useDriveFallback(false)}finally{$('driveModeBtn').disabled=false}}};
  $('speed').value=String(settings.speed||1);$('speed').addEventListener('change',()=>{const rate=Number($('speed').value)||1;if(mode==='enhanced')video.playbackRate=rate;if(mode==='youtube'&&ytPlayer?.setPlaybackRate)ytPlayer.setPlaybackRate(rate);saveSettings({speed:rate})});let volumeSaveTimer=0;video.addEventListener('volumechange',()=>{clearTimeout(volumeSaveTimer);volumeSaveTimer=setTimeout(()=>saveSettings({volume:video.volume}),350)});video.addEventListener('timeupdate',()=>saveProgress(false));video.addEventListener('pause',()=>saveProgress(true));video.addEventListener('ended',()=>{saveProgress(true);updateContinueText();startCountdown()});async function requestWake(){try{if('wakeLock'in navigator&&!wakeLock)wakeLock=await navigator.wakeLock.request('screen')}catch{}}function releaseWake(){try{wakeLock?.release?.()}catch{}wakeLock=null}video.addEventListener('play',requestWake);video.addEventListener('pause',releaseWake);video.addEventListener('ended',releaseWake);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&mode==='enhanced'&&!video.paused)requestWake();else if(document.visibilityState==='hidden'){saveProgress(true);releaseWake()}});document.addEventListener('freeze',()=>saveProgress(true));window.addEventListener('beforeunload',()=>saveProgress(true));window.addEventListener('pagehide',()=>{saveProgress(true);clearInterval(ytTicker);clearInterval(statsTicker);cancelDriveReconnect();driveAttemptController?.abort();recoveryController?.abort();offlineManager.cancel();stopVideoFrameMonitor();resetSeekWatch();clearTimeout(volumeSaveTimer);saveSettings({volume:video.volume});releaseWake();if(offlineObjectUrl)URL.revokeObjectURL(offlineObjectUrl);cleanDriveSubtitle()});
  function seek(delta){if(mode==='enhanced')seekToChecked(Math.max(0,(video.currentTime||0)+delta));else if(mode==='youtube'&&ytPlayer?.seekTo)ytPlayer.seekTo(Math.max(0,getTime()+delta),true)}
  $('rewindBtn').onclick=()=>seek(-10);$('forwardBtn').onclick=()=>seek(10);$('restartBtn').onclick=()=>{localStorage.removeItem(progressKeyNow());if(mode==='enhanced'){video.currentTime=0;video.play().catch(()=>{})}else if(mode==='youtube'&&ytPlayer){ytPlayer.seekTo(0,true);ytPlayer.playVideo()}updateContinueText()};$('fullBtn').onclick=async()=>{
    const result=await BROWSER_CORE.requestFullscreen(stage,video);
    if(result==='document'&&screen.orientation?.lock){
      try{await screen.orientation.lock('landscape')}catch{}
    }
    if(result==='unavailable')toast('Tela cheia indisponível neste navegador');
  };
  $('pipBtn').onclick=async()=>{
    if(mode!=='enhanced')return;
    if(!await BROWSER_CORE.togglePictureInPicture(document,video)){
      toast('Picture-in-Picture indisponível neste navegador');
    }
  };
  if(!BROWSER_CORE.pictureInPictureAvailable(document,video))$('pipBtn').style.display='none';
  if(!BROWSER_CORE.fullscreenAvailable(stage,video))$('fullBtn').disabled=true;
  const morePlayerControls=$('morePlayerControls');
  morePlayerControls?.addEventListener('click',()=>{
    const opened=$('toolbar').classList.toggle('show-advanced');
    morePlayerControls.setAttribute('aria-expanded',String(opened));
    morePlayerControls.textContent=opened?'⋯ menos opções':'⋯ mais opções';
  });
  $('miniBtn').onclick=()=>{const on=stageShell.classList.toggle('mini');$('miniBtn').textContent=on?'▱ fechar mini':'▱ mini';if(on)document.body.classList.remove('cinema')};$('cinemaBtn').onclick=()=>{const on=document.body.classList.toggle('cinema');stageShell.classList.remove('mini');$('miniBtn').textContent='▱ mini';$('cinemaBtn').textContent=on?'◑ sair cinema':'◐ cinema'};$('backBtn').onclick=()=>{if(history.length>1)history.back();else location.href='index.html'};
  let controlsLocked=false;
  const lockBtn=$('lockBtn'); if(lockBtn) lockBtn.onclick=()=>{controlsLocked=!controlsLocked;document.body.classList.toggle('controls-locked',controlsLocked);lockBtn.textContent=controlsLocked?'🔓 desbloquear':'🔒 bloquear'};
  let lastTap=0,lastX=0;
  stage.addEventListener('pointerup',e=>{if(e.pointerType==='mouse')return;const now=Date.now();if(now-lastTap<330&&Math.abs(e.clientX-lastX)<90){const r=stage.getBoundingClientRect();seek(e.clientX<r.left+r.width/2?-10:10);const f=document.createElement('div');f.className='tap-feedback';f.textContent=e.clientX<r.left+r.width/2?'↶ 10s':'10s ↷';f.style.left=(e.clientX-r.left)+'px';stage.appendChild(f);setTimeout(()=>f.remove(),520);lastTap=0}else{lastTap=now;lastX=e.clientX}});
  let swipeStartX=0,swipeStartY=0,swipeStartAt=0;stage.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')return;swipeStartX=e.clientX;swipeStartY=e.clientY;swipeStartAt=Date.now()},{capture:true,passive:true});stage.addEventListener('pointerup',e=>{if(e.pointerType==='mouse'||!swipeStartAt)return;const dx=e.clientX-swipeStartX,dy=e.clientY-swipeStartY,dt=Date.now()-swipeStartAt;swipeStartAt=0;if(dt<800&&Math.abs(dx)>=95&&Math.abs(dx)>Math.abs(dy)*1.35){e.preventDefault();e.stopImmediatePropagation();if(dx<0){if(playNextEpisode())toast('Próximo episódio')}else{if(playPrevEpisode())toast('Episódio anterior')}}},{capture:true});
  const help=$('help');$('helpBtn').onclick=()=>help.classList.add('show');$('closeHelp').onclick=()=>help.classList.remove('show');help.onclick=e=>{if(e.target===help)help.classList.remove('show')};document.addEventListener('keydown',e=>{if(help.classList.contains('show')){if(e.key==='Escape')help.classList.remove('show');return}if(['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName))return;const k=e.key.toLowerCase();if(/^Digit[0-9]$/.test(e.code)&&mode==='enhanced'&&video.duration){video.currentTime=(Number(e.code.slice(-1))/10)*video.duration;showControls(2500);return}if(k==='j'){seek(-10);return}else if(k==='k'){if(mode==='enhanced')video.paused?video.play():video.pause();return}else if(k==='l'){seek(10);return}else if(k==='d'){$('statsBtn')?.click();return}else if(k==='n'){e.preventDefault();playNextEpisode();return}else if(k==='b'){e.preventDefault();playPrevEpisode();return}else if(e.key==='PageDown'){e.preventDefault();playNextEpisode();return}else if(e.key==='PageUp'){e.preventDefault();playPrevEpisode();return}if(e.code==='Space'){e.preventDefault();if(mode==='enhanced')video.paused?video.play():video.pause();else if(mode==='youtube'&&ytPlayer){ytPlayer.getPlayerState()===1?ytPlayer.pauseVideo():ytPlayer.playVideo()}}else if(e.key==='ArrowLeft'){e.preventDefault();seek(-10)}else if(e.key==='ArrowRight'){e.preventDefault();seek(10)}else if(e.key==='ArrowUp'){e.preventDefault();if(mode==='enhanced')video.volume=Math.min(1,video.volume+.1);else if(mode==='youtube'&&ytPlayer){const v=Math.min(100,ytPlayer.getVolume()+10);ytPlayer.setVolume(v);saveSettings({volume:v/100})}}else if(e.key==='ArrowDown'){e.preventDefault();if(mode==='enhanced')video.volume=Math.max(0,video.volume-.1);else if(mode==='youtube'&&ytPlayer){const v=Math.max(0,ytPlayer.getVolume()-10);ytPlayer.setVolume(v);saveSettings({volume:v/100})}}else if(k==='m'){if(mode==='enhanced')video.muted=!video.muted;else if(mode==='youtube'&&ytPlayer)(ytPlayer.isMuted()?ytPlayer.unMute():ytPlayer.mute())}else if(k==='f')$('fullBtn').click();else if(k==='p')$('pipBtn').click();else if(k==='c')$('cinemaBtn').click();else if(k==='i')$('miniBtn').click();else if(k==='s')$('settingsBtn').click();else if(k==='v')$('watchedBtn').click();else if(e.key==='Escape'&&document.body.classList.contains('cinema'))$('cinemaBtn').click()});
})();
