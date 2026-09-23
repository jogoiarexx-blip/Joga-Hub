/* JOGAHUB — sincronizador Google Drive 1.2.50 */
(function(){
'use strict';

const CONFIG_KEY='jogahub_drive_sync_url';
const DATA_KEY='jogahub_drive_catalog_cache_v8_compact';
const LAST_SUCCESS_KEY='jogahub_drive_last_success_v2';
const CLIENT_TTL=2*60*1000;
const LEGACY_DATA_KEYS=['jogahub_drive_catalog_cache_v7_compact','jogahub_drive_catalog_cache_v6_single_root','jogahub_drive_catalog_cache_v5_single_root','jogahub_drive_catalog_cache_v4_single_root','jogahub_drive_catalog_cache_v3_single_root','jogahub_drive_catalog_cache_v2'];
const DEFAULT_URL=String(window.JOGAHUB_DRIVE_SYNC_URL||'').trim();
const root=window.JOGAHUB_DRIVE_ROOT||{
  id:'1FpJ__h7dTKpD-VOTl3WUIgpBBUc4vhut',name:'Filmes e Séries'
};
const ROOTS=[{id:root.id,name:root.name}];

const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const clean=s=>String(s||'')
  .replace(/\.(mp4|mkv|webm|mov|avi|m4v|ogv|mpeg|mpg|3gp)$/i,'')
  .replace(/[._]+/g,' ').replace(/\s+/g,' ').trim();

const LEGACY_SYNC_URLS=new Set(["https://script.google.com/macros/s/AKfycbxXQk9M6_VLSyspyNfTvXqGioOhmIE1vRMw6bZtV5GBx8hlrYx3Qnqr7tXmFsfKQeC1TQ/exec"]);
function getConfiguredUrl(){
  const saved=String(localStorage.getItem(CONFIG_KEY)||'').trim();
  if(saved&&LEGACY_SYNC_URLS.has(saved)){
    localStorage.removeItem(CONFIG_KEY);
    return DEFAULT_URL;
  }
  return saved||DEFAULT_URL;
}

function seasonFromText(s){
  const x=norm(s);
  let m=x.match(/\b(?:s|t)\s*0*(\d{1,2})\b/i);
  if(m)return Number(m[1]);
  m=x.match(/\b(?:temporada|season|temp)\s*0*(\d{1,2})\b/i);
  if(m)return Number(m[1]);
  m=x.match(/\b0*(\d{1,2})\s*[ªa]?\s*(?:temporada|season)\b/i);
  return m?Number(m[1]):0;
}

function yearFromText(s){
  const m=String(s||'').match(/\b((?:19|20)\d{2})\b/);
  return m?Number(m[1]):0;
}

function movieTitleFromName(name){
  let s=clean(name);
  const cut=s.search(/\b(?:19|20)\d{2}\b|\b(?:2160p|1440p|1080p|720p|576p|480p|4k|uhd|hdr|webrip|web[- ]?dl|bluray|brrip|dvdrip|hdtv|camrip|cam|x264|x265|h\.264|h\.265|hevc|aac|dts|dual|dublado|legendado)\b/i);
  if(cut>1)s=s.slice(0,cut);
  s=s.replace(/[\s._-]+$/,'').trim();
  return s||clean(name);
}

function parse(name,path,sourceRootName=''){
  const rawParts=String(path||'').split('/').filter(Boolean);
  let parts=[...rawParts];
  const compactRoot=value=>norm(clean(value)).replace(/\b(?:e|de|da|do|dos|das)\b/g,' ').replace(/\s+/g,' ').trim();
  const first=compactRoot(parts[0]||''), hint=compactRoot(sourceRootName||root.name||'');
  const looksLikeMediaRoot=/\bfilmes?\b.*\bseries?\b|\bseries?\b.*\bfilmes?\b/.test(first);
  if(parts.length>1&&(first===hint||looksLikeMediaRoot))parts=parts.slice(1);
  const full=norm(parts.join('/')+'/'+name);

  let m=full.match(/\bs(\d{1,2})e(\d{1,3})\b/i)
    ||full.match(/\bt(\d{1,2})e(\d{1,3})\b/i)
    ||full.match(/\b(\d{1,2})x(\d{1,3})\b/i);
  let season=m?Number(m[1]):0,episode=m?Number(m[2]):0;
  if(!season)season=seasonFromText(full);
  if(!episode){
    const em=full.match(/(?:epis[oó]dio|episode|ep)\s*0*(\d{1,3})\b/i);
    episode=em?Number(em[1]):0;
  }

  // Vários acervos usam "1 - Piloto.mp4", "2 - Título.mp4" dentro de uma
  // pasta de temporada. Quando a pasta já revela a temporada, o número inicial
  // do arquivo é tratado como número do episódio.
  if(!episode&&season){
    const em=clean(name).match(/^\s*0*(\d{1,3})\s*(?:[-–—:.]|\s)\s*/);
    if(em)episode=Number(em[1]);
  }

  const seasonIdx=parts.findIndex(x=>seasonFromText(x)>0);
  const stripSeasonFolder=value=>clean(value)
    .replace(/(?:\s*[-–]?\s*(?:\d{1,2}\s*[ªa]?\s*Temporada|\b(?:S|T)\s*0*\d{1,2}\b|\d{1,2}\s*[ªa]?\s*Season)).*$/i,'')
    .replace(/\s*\(?\b(?:19|20)\d{2}\b\)?\s*$/,'')
    .replace(/\s*[-–]\s*$/,'').trim();
  const genericSeriesFolder=value=>/^(?:series|serie|seriados|tv|temporadas?)$/i.test(norm(clean(value)));

  let seriesTitle='';
  if(seasonIdx>=0){
    // Quando existe uma pasta genérica "Series" acima da temporada, o nome da
    // série está na própria pasta "Breaking Bad - 4ª Temporada...", não em
    // "Series". Primeiro tenta extrair dali; só depois sobe para o pai.
    const fromSeasonFolder=stripSeasonFolder(parts[seasonIdx]);
    if(fromSeasonFolder&&!genericSeriesFolder(fromSeasonFolder)){
      seriesTitle=fromSeasonFolder;
    }else{
      for(let i=seasonIdx-1;i>=0;i--){
        const candidate=stripSeasonFolder(parts[i]);
        if(candidate&&!genericSeriesFolder(candidate)){seriesTitle=candidate;break}
      }
    }
  }else if(parts.length&&(season||episode)){
    for(let i=parts.length-1;i>=0;i--){
      const candidate=stripSeasonFolder(parts[i]);
      if(candidate&&!genericSeriesFolder(candidate)){seriesTitle=candidate;break}
    }
  }else if(/(?:series|epis[oó]d|temporada|season|\bs\d{1,2}\b)/i.test(full)&&parts.length){
    seriesTitle=stripSeasonFolder(parts[parts.length-1]);
  }

  if(seriesTitle){
    seriesTitle=stripSeasonFolder(seriesTitle)||seriesTitle;
  }

  const serie=!!(season||episode||seasonIdx>=0||seriesTitle);
  const year=yearFromText(parts.join(' ')+' '+name);
  return {
    serie,
    season:season||1,
    episode,
    year,
    title:serie?clean(name):movieTitleFromName(name),
    seriesTitle:serie?seriesTitle:''
  };
}

function normalizeFile(f){
  if(!f||!f.id)return null;
  return {
    id:String(f.id),
    name:String(f.name??f.nome??''),
    mime:String(f.mime||''),
    size:Number(f.size??f.tamanho??0)||0,
    path:String(f.path??f.caminho??f.pasta??''),
    url:String(f.url??f.link??''),
    player:String(f.player??''),
    updated:String(f.updated??f.atualizado??'')
  };
}

function normalizeResponse(j){
  if(!j||typeof j!=='object')throw new Error('Resposta vazia do Apps Script');
  if(j.ok===false||j.sucesso===false)throw new Error(j.error||j.erro||'O Apps Script informou uma falha');
  const raw=Array.isArray(j.files)?j.files:(Array.isArray(j.itens)?j.itens:(Array.isArray(j.items)?j.items:null));
  if(!raw)throw new Error('Resposta inválida: lista de arquivos não encontrada');
  const byId=new Map();
  raw.map(normalizeFile).filter(Boolean).forEach(file=>{
    const prev=byId.get(file.id);
    if(!prev){byId.set(file.id,file);return}
    const currentTime=Date.parse(file.updated)||0, prevTime=Date.parse(prev.updated)||0;
    if(currentTime>prevTime||(currentTime===prevTime&&file.size>prev.size))byId.set(file.id,file);
  });
  return {
    files:[...byId.values()],
    errors:Array.isArray(j.errors)?j.errors:[],
    rootName:String(j.pastaRaiz||j.rootName||root.name||'Google Drive'),
    updatedAt:String(j.updatedAt||j.atualizado||'')
  };
}

function latestUpdated(files){
  let latest=0;
  for(const f of files||[])latest=Math.max(latest,Date.parse(f?.updated)||0);
  return latest;
}

function compactForCache(file){
  const f=normalizeFile(file);if(!f)return null;
  return {id:f.id,name:f.name,mime:f.mime,size:f.size,path:f.path,updated:f.updated};
}

function readCacheEnvelope(){
  try{
    const value=JSON.parse(localStorage.getItem(DATA_KEY)||'null');
    if(Array.isArray(value)){
      const files=value.map(normalizeFile).filter(Boolean);
      return {files,savedAt:0,latestUpdated:latestUpdated(files)};
    }
    const files=Array.isArray(value?.files)?value.files.map(normalizeFile).filter(Boolean):[];
    return {files,savedAt:Number(value?.savedAt||0),latestUpdated:Number(value?.latestUpdated||latestUpdated(files))};
  }catch{return {files:[],savedAt:0,latestUpdated:0}}
}

function readCache(){return readCacheEnvelope().files}

function writeCache(files){
  const compact=(files||[]).map(compactForCache).filter(Boolean);
  const envelope={version:8,savedAt:Date.now(),latestUpdated:latestUpdated(compact),files:compact};
  try{localStorage.setItem(DATA_KEY,JSON.stringify(envelope))}
  catch(e){
    console.warn('JogaHub Drive cache cheio; mantendo o snapshot empacotado como fallback.',e);
    try{localStorage.removeItem(DATA_KEY)}catch{}
  }
}

function clientCacheFresh(){
  const cached=readCacheEnvelope();
  const last=Number(localStorage.getItem(LAST_SUCCESS_KEY)||0);
  return cached.files.length>0&&last>0&&(Date.now()-last)<CLIENT_TTL;
}

function removeAutoEntries(){
  if(typeof FILMES_CATALOGO==='undefined')return [];
  const old=[];
  for(let i=FILMES_CATALOGO.length-1;i>=0;i--){
    const item=FILMES_CATALOGO[i];
    if(String(item?.id||'').startsWith('drive-auto-')){
      old.push(item);
      FILMES_CATALOGO.splice(i,1);
    }
  }
  return old;
}

function filePreference(f){
  const text=norm((f?.name||'')+' '+(f?.mime||''));let score=0;
  if(/\.mp4\b|video\/mp4/.test(text))score+=50;
  else if(/\.webm\b|video\/webm/.test(text))score+=35;
  else if(/\.m4v\b/.test(text))score+=30;
  else if(/\.mkv\b|matroska/.test(text))score-=20;
  else if(/\.avi\b|avi/.test(text))score-=25;
  if(/x264|h[ ._-]?264|avc/.test(text))score+=18;
  if(/x265|h[ ._-]?265|hevc/.test(text))score-=6;
  return score;
}

function addFiles(files,sourceRoot,options={}){
  if(typeof FILMES_CATALOGO==='undefined')return {added:0,removed:0,total:0};
  const byId=new Map();
  (Array.isArray(files)?files:[]).map(normalizeFile).filter(Boolean).forEach(file=>{
    const prev=byId.get(file.id);
    if(!prev){byId.set(file.id,file);return}
    const currentTime=Date.parse(file.updated)||0, prevTime=Date.parse(prev.updated)||0;
    if(currentTime>prevTime||(currentTime===prevTime&&file.size>prev.size))byId.set(file.id,file);
  });
  const normalized=[...byId.values()].sort((a,b)=>filePreference(b)-filePreference(a)||(Date.parse(b.updated)||0)-(Date.parse(a.updated)||0)||(b.size||0)-(a.size||0));
  const old=options.replace?removeAutoEntries():[];
  const oldIds=new Set(old.map(x=>x.driveFileId).filter(Boolean));
  const existing=new Set(FILMES_CATALOGO.map(x=>x.driveFileId).filter(Boolean));
  const newIds=new Set();
  const logicalSeen=new Set();
  let added=0;

  for(const f of normalized){
    if(existing.has(f.id))continue;
    const p=parse(f.name,f.path||'',sourceRoot?.name||'');
    const seriesKey=p.serie?norm(p.seriesTitle).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''):'';
    const logicalSeriesKey=seriesKey||norm(p.seriesTitle||f.path||f.name).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    const logicalKey=p.serie&&p.episode>0?`serie:${logicalSeriesKey}:s${p.season||1}:e${p.episode}`:`file:${f.id}`;
    if(logicalSeen.has(logicalKey))continue;
    logicalSeen.add(logicalKey);
    const displayTitle=p.serie&&p.episode
      ?'E'+String(p.episode).padStart(2,'0')+' — '+(p.seriesTitle||p.title)
      :p.title;

    FILMES_CATALOGO.push({
      id:'drive-auto-'+f.id,
      type:'filme',
      title:displayTitle,
      year:p.year||'Google Drive',
      genre:p.serie?'Série • Google Drive':'Filme • Google Drive',
      mediaType:p.serie?'serie':'filme',
      language:'Conforme o arquivo',
      portuguese:true,
      colorContent:true,
      accent:'var(--brand-blue)',
      thumb:p.serie?'assets/banner-cat-series.webp':'assets/banner-cat-filmes.webp',
      ...(p.serie?{seriesId:seriesKey,seriesTitle:p.seriesTitle||p.title,season:p.season,episode:p.episode}:{}),
      driveFileId:f.id,
      driveFileSize:f.size,
      driveMime:f.mime,
      drivePlayerUrl:f.player||('https://drive.google.com/file/d/'+f.id+'/preview'),
      sourceUrl:f.url||('https://drive.google.com/file/d/'+f.id+'/view?usp=sharing'),
      url:f.url||('https://drive.google.com/file/d/'+f.id+'/view?usp=sharing'),
      sourceLabel:'Google Drive',
      sourceCollection:sourceRoot?.name||'Google Drive',
      embed:false,
      desc:'Conteúdo sincronizado automaticamente da pasta principal do Google Drive.',
      nostalgiaTags:['Google Drive',p.serie?'série':'filme'],
      _driveName:f.name||'',
      _drivePath:f.path||'',
      _driveUpdated:f.updated||''
    });
    existing.add(f.id);
    newIds.add(f.id);
    if(!oldIds.has(f.id))added++;
  }

  const removed=options.replace?[...oldIds].filter(id=>!newIds.has(id)).length:0;
  if(options.persist!==false)writeCache(normalized);
  return {added,removed,total:newIds.size};
}

function jsonp(baseUrl,folderId){
  return new Promise((resolve,reject)=>{
    const cb='__jogaHubDriveCb_'+Date.now()+'_'+Math.random().toString(36).slice(2);
    const script=document.createElement('script');
    const timer=setTimeout(()=>finish(new Error('JSONP timeout')),12000);
    let done=false;
    function finish(error,data){
      if(done)return;done=true;clearTimeout(timer);script.remove();
      try{delete window[cb]}catch{window[cb]=undefined}
      error?reject(error):resolve(data);
    }
    window[cb]=data=>finish(null,data);
    try{
      const u=new URL(baseUrl);
      if(folderId)u.searchParams.set('folderId',folderId);
      u.searchParams.set('callback',cb);
      u.searchParams.set('_',Date.now());
      script.src=u.toString();
      script.async=true;
      script.onerror=()=>finish(new Error('Falha no carregamento JSONP'));
      document.head.appendChild(script);
    }catch(e){finish(e)}
  });
}

async function requestCatalog(baseUrl,folderId){
  const u=new URL(baseUrl);
  if(folderId)u.searchParams.set('folderId',folderId);
  u.searchParams.set('_',Date.now());
  const controller=typeof AbortController!=='undefined'?new AbortController():null;
  const timeout=setTimeout(()=>controller?.abort(),9000);
  try{
    const r=await fetch(u.toString(),{cache:'no-store',redirect:'follow',signal:controller?.signal});
    if(!r.ok)throw new Error('HTTP '+r.status);
    return await r.json();
  }catch(fetchError){
    try{return await jsonp(baseUrl,folderId)}
    catch(jsonpError){
      const err=new Error('Não foi possível ler o Apps Script. fetch: '+fetchError+'; JSONP: '+jsonpError);
      err.cause=fetchError;
      throw err;
    }
  }finally{clearTimeout(timeout)}
}

function hydrateInitial(){
  LEGACY_DATA_KEYS.forEach(key=>localStorage.removeItem(key));
  const cached=readCacheEnvelope();
  const snap=Array.isArray(window.JOGAHUB_DRIVE_SNAPSHOT)?window.JOGAHUB_DRIVE_SNAPSHOT.map(normalizeFile).filter(Boolean):[];
  const snapshotLatest=latestUpdated(snap);
  const useSnapshot=snap.length&&(!cached.files.length||snapshotLatest>cached.latestUpdated);
  const initial=useSnapshot?snap:cached.files;
  if(initial.length){
    addFiles(initial,useSnapshot?ROOTS[0]:{name:'Google Drive (cache local)'},{replace:true,persist:false});
    return initial.length;
  }
  return 0;
}

async function syncOnce(){
  const base=getConfiguredUrl();
  if(!base||typeof FILMES_CATALOGO==='undefined'){
    window.JOGAHUB_DRIVE_SYNC_COUNT=0;
    window.JOGAHUB_DRIVE_SYNC_FOUND=0;
    return 0;
  }

  let totalAdded=0,totalRemoved=0,totalFound=0,errors=[],folderStats=[];
  for(const sourceRoot of ROOTS){
    try{
      const raw=await requestCatalog(base,sourceRoot.id);
      const payload=normalizeResponse(raw);
      const result=addFiles(payload.files,{...sourceRoot,name:payload.rootName||sourceRoot.name},{replace:true,persist:true});
      totalAdded+=result.added;
      totalRemoved+=result.removed;
      totalFound+=result.total;
      folderStats.push({name:sourceRoot.name,found:result.total,added:result.added,removed:result.removed});
      if(payload.errors.length)errors=errors.concat(payload.errors);
    }catch(e){
      errors.push({name:sourceRoot.name,error:String(e)});
      folderStats.push({name:sourceRoot.name,found:0,added:0,removed:0,error:String(e)});
      console.warn('JogaHub Drive',sourceRoot.name,e);
    }
  }

  window.JOGAHUB_DRIVE_SYNC_COUNT=totalAdded;
  window.JOGAHUB_DRIVE_SYNC_REMOVED=totalRemoved;
  window.JOGAHUB_DRIVE_SYNC_FOUND=totalFound;
  window.JOGAHUB_DRIVE_SYNC_ERRORS=errors;
  window.JOGAHUB_DRIVE_SYNC_FOLDERS=folderStats;
  window.JOGAHUB_DRIVE_SYNC_LAST_SYNC=Date.now();
  if(totalFound>0)try{localStorage.setItem(LAST_SUCCESS_KEY,String(Date.now()))}catch{}
  if(typeof window.JOGAHUB_REFRESH_ITEMS==='function')window.JOGAHUB_REFRESH_ITEMS();
  try{window.dispatchEvent(new CustomEvent('jogahub:drive-sync',{detail:{found:totalFound,added:totalAdded,removed:totalRemoved,errors}}))}catch{}
  return totalAdded;
}

let syncPromise=null;
function sync(){
  if(syncPromise)return syncPromise;
  syncPromise=syncOnce().finally(()=>{syncPromise=null});
  return syncPromise;
}

window.JOGAHUB_DRIVE_SYNC={
  configure:function(url){
    const cleanUrl=String(url||'').trim();
    if(cleanUrl)localStorage.setItem(CONFIG_KEY,cleanUrl);else localStorage.removeItem(CONFIG_KEY);
    return sync();
  },
  clearCache:function(){
    localStorage.removeItem(DATA_KEY);
    localStorage.removeItem(LAST_SUCCESS_KEY);
    LEGACY_DATA_KEYS.forEach(key=>localStorage.removeItem(key));
    removeAutoEntries();
    if(Array.isArray(window.JOGAHUB_DRIVE_SNAPSHOT))addFiles(window.JOGAHUB_DRIVE_SNAPSHOT,ROOTS[0],{replace:false,persist:false});
    if(typeof window.JOGAHUB_REFRESH_ITEMS==='function')window.JOGAHUB_REFRESH_ITEMS();
  },
  clear:function(){
    localStorage.removeItem(CONFIG_KEY);
    this.clearCache();
  },
  sync,
  roots:ROOTS,
  getUrl:getConfiguredUrl,
  getStatus:function(){return {
    configured:!!getConfiguredUrl(),
    usingDefault:!localStorage.getItem(CONFIG_KEY)&&!!DEFAULT_URL,
    url:getConfiguredUrl(),
    cached:readCache().length,
    cacheFresh:clientCacheFresh(),
    cacheAgeMs:(()=>{const t=Number(localStorage.getItem(LAST_SUCCESS_KEY)||0);return t?Date.now()-t:null})(),
    found:Number(window.JOGAHUB_DRIVE_SYNC_FOUND||0),
    added:Number(window.JOGAHUB_DRIVE_SYNC_COUNT||0),
    removed:Number(window.JOGAHUB_DRIVE_SYNC_REMOVED||0),
    errors:window.JOGAHUB_DRIVE_SYNC_ERRORS||[],
    folders:window.JOGAHUB_DRIVE_SYNC_FOLDERS||[],
    lastSync:Number(window.JOGAHUB_DRIVE_SYNC_LAST_SYNC||0)
  }}
};

// Hidrata imediatamente para que a home e o player encontrem os itens do Drive
// antes de seus próprios scripts iniciarem.
hydrateInitial();

function hydrateSharedCache(){
  const cached=readCache();
  if(!cached.length)return;
  addFiles(cached,{name:'Google Drive (cache compartilhado)'},{replace:true,persist:false});
  if(typeof window.JOGAHUB_REFRESH_ITEMS==='function')window.JOGAHUB_REFRESH_ITEMS();
  try{window.dispatchEvent(new CustomEvent('jogahub:drive-sync',{detail:{source:'storage',found:cached.length,added:0,removed:0,errors:[]}}))}catch{}
}
window.addEventListener('storage',e=>{if(e.key===DATA_KEY&&e.newValue)hydrateSharedCache()});
window.addEventListener('online',()=>{if(getConfiguredUrl()&&!clientCacheFresh())setTimeout(sync,250)});
function startLiveSync(){
  if(getConfiguredUrl()&&!clientCacheFresh())setTimeout(sync,0);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',startLiveSync,{once:true});
else startLiveSync();
})();
