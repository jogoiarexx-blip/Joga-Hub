/* JOGAHUB — sincronizador Google Drive 1.3.2 */
(function(){
'use strict';

const CONFIG_KEY='jogahub_drive_sync_url';
const DATA_KEY='jogahub_drive_catalog_cache_v6_compact';
const LEGACY_DATA_KEYS=['jogahub_drive_catalog_cache_v5_deduplicated','jogahub_drive_catalog_cache_v4_single_root','jogahub_drive_catalog_cache_v3_single_root','jogahub_drive_catalog_cache_v2'];
const LAST_SYNC_KEY='jogahub_drive_last_sync';
const CLIENT_TTL=10*60*1000;
const OBSOLETE_URLS=['https://script.google.com/macros/s/AKfycbxXQk9M6_VLSyspyNfTvXqGioOhmIE1vRMw6bZtV5GBx8hlrYx3Qnqr7tXmFsfKQeC1TQ/exec'];
const DEFAULT_URL=String(window.JOGAHUB_DRIVE_SYNC_URL||'').trim();
const root=window.JOGAHUB_DRIVE_ROOT||{id:'1FpJ__h7dTKpD-VOTl3WUIgpBBUc4vhut',name:'Filmes e Séries'};
const ROOTS=[{id:root.id,name:root.name}];
let syncPromise=null;
let lastSuccess=false;

const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const clean=s=>String(s||'').replace(/\.(mp4|mkv|webm|mov|avi|m4v|ogv|mpeg|mpg|3gp)$/i,'').replace(/[._]+/g,' ').replace(/\s+/g,' ').trim();
const safeGet=key=>{try{return localStorage.getItem(key)||''}catch{return ''}};
const safeSet=(key,value)=>{try{localStorage.setItem(key,value);return true}catch{return false}};
const safeRemove=key=>{try{localStorage.removeItem(key)}catch{}};

function getConfiguredUrl(){
  const saved=String(safeGet(CONFIG_KEY)||'').trim();
  if(saved&&OBSOLETE_URLS.includes(saved)){safeRemove(CONFIG_KEY);return DEFAULT_URL}
  return saved||DEFAULT_URL;
}
function seasonFromText(s){
  const x=norm(s);let m=x.match(/\b(?:s|t)\s*0*(\d{1,2})\b/i);
  if(m)return Number(m[1]);
  m=x.match(/\b(?:temporada|season|temp)\s*0*(\d{1,2})\b/i);
  if(m)return Number(m[1]);
  m=x.match(/\b0*(\d{1,2})\s*[ªa]?\s*(?:temporada|season)\b/i);
  return m?Number(m[1]):0;
}
function yearFromText(s){const m=String(s||'').match(/\b((?:19|20)\d{2})\b/);return m?Number(m[1]):0}
function movieTitleFromName(name){
  let s=clean(name);
  const cut=s.search(/\b(?:19|20)\d{2}\b|\b(?:2160p|1440p|1080p|720p|576p|480p|4k|uhd|hdr|webrip|web[- ]?dl|bluray|brrip|dvdrip|hdtv|camrip|cam|x264|x265|h\.264|h\.265|hevc|aac|dts|dual|dublado|legendado)\b/i);
  if(cut>1)s=s.slice(0,cut);
  return s.replace(/[\s._-]+$/,'').trim()||clean(name);
}
function isGenericContainer(s){return /^(?:series?|seriados?|filmes?|movies?|videos?|temporadas?|seasons?|acervo|catalogo)$/i.test(norm(clean(s)))}
function stripSeriesDecorations(value){
  let s=clean(value);
  s=s.replace(/\s*[-–—]?\s*(?:\d{1,2}\s*[ªa]?\s*(?:temporada|season)|\b(?:s|t)\s*0*\d{1,2})\b.*$/i,'');
  s=s.replace(/\s*[-–—]?\s*(?:19|20)\d{2}\b.*$/i,'');
  s=s.replace(/\s*[-–—]\s*$/,'').trim();
  return s;
}
function parse(name,path){
  const rawParts=String(path||'').split('/').filter(Boolean);
  const parts=rawParts.length>1?rawParts.slice(1):[];
  const full=norm(parts.join('/')+'/'+name);
  let m=full.match(/\bs(\d{1,2})e(\d{1,3})\b/i)||full.match(/\bt(\d{1,2})e(\d{1,3})\b/i)||full.match(/\b(\d{1,2})x(\d{1,3})\b/i);
  let season=m?Number(m[1]):0,episode=m?Number(m[2]):0;
  if(!season)season=seasonFromText(full);
  if(!episode){const em=full.match(/(?:epis[oó]dio|episode|ep)\s*0*(\d{1,3})\b/i);episode=em?Number(em[1]):0}
  if(!episode&&season){const em=clean(name).match(/^\s*0*(\d{1,3})\s*(?:[-–—:.]|\s)\s*/);if(em)episode=Number(em[1])}
  const seasonIdx=parts.findIndex(x=>seasonFromText(x)>0);
  let seriesTitle='';
  if(seasonIdx>=0){
    const own=stripSeriesDecorations(parts[seasonIdx]);
    if(own&&!isGenericContainer(own))seriesTitle=own;
    else for(let i=seasonIdx-1;i>=0;i--){if(!isGenericContainer(parts[i])){seriesTitle=stripSeriesDecorations(parts[i]);break}}
  }
  if(!seriesTitle&&(season||episode)){
    for(let i=parts.length-1;i>=0;i--){if(!isGenericContainer(parts[i])){seriesTitle=stripSeriesDecorations(parts[i]);break}}
  }
  const serie=!!(season||episode||seriesTitle);
  return {serie,season:season||1,episode,year:yearFromText(parts.join(' ')+' '+name),title:serie?clean(name):movieTitleFromName(name),seriesTitle:serie?(seriesTitle||clean(name)):''};
}
function normalizeFile(f){
  if(!f||!f.id)return null;
  return {id:String(f.id),name:String(f.name??f.nome??''),mime:String(f.mime||''),size:Number(f.size??f.tamanho??0)||0,path:String(f.path??f.caminho??f.pasta??''),url:String(f.url??f.link??''),player:String(f.player??''),updated:String(f.updated??f.atualizado??'')};
}
function normalizeResponse(j){
  if(!j||typeof j!=='object')throw new Error('Resposta vazia do Apps Script');
  if(j.ok===false||j.sucesso===false)throw new Error(j.error||j.erro||'O Apps Script informou uma falha');
  const raw=Array.isArray(j.files)?j.files:(Array.isArray(j.itens)?j.itens:(Array.isArray(j.items)?j.items:null));
  if(!raw)throw new Error('Resposta inválida: lista de arquivos não encontrada');
  return {files:raw.map(normalizeFile).filter(Boolean),errors:Array.isArray(j.errors)?j.errors:[],rootName:String(j.pastaRaiz||j.rootName||root.name||'Google Drive')};
}
function preferred(a,b){
  const ta=Date.parse(a.updated)||0,tb=Date.parse(b.updated)||0;
  if(tb!==ta)return tb>ta?b:a;
  if(b.size!==a.size)return b.size>a.size?b:a;
  return String(b.id)>String(a.id)?b:a;
}
function semanticKey(f){
  const p=parse(f.name,f.path);
  if(p.serie&&p.episode)return 'episode|'+norm(p.seriesTitle)+'|'+p.season+'|'+p.episode;
  if(p.serie)return 'series-file|'+norm(p.seriesTitle)+'|'+p.season+'|'+norm(clean(f.name));
  return 'movie|'+norm(p.title)+'|'+(p.year||'');
}
function deduplicateFiles(files){
  const byId=new Map(),byMeaning=new Map();let duplicates=0;
  for(const raw of files||[]){
    const f=normalizeFile(raw);if(!f)continue;
    if(byId.has(f.id)){byId.set(f.id,preferred(byId.get(f.id),f));duplicates++}else byId.set(f.id,f);
  }
  for(const f of byId.values()){
    const key=semanticKey(f);
    if(byMeaning.has(key)){byMeaning.set(key,preferred(byMeaning.get(key),f));duplicates++}else byMeaning.set(key,f);
  }
  return {files:[...byMeaning.values()],duplicates,received:(files||[]).length};
}
function compactForCache(file){
  const f=normalizeFile(file);if(!f)return null;
  return {id:f.id,name:f.name,mime:f.mime,size:f.size,path:f.path,updated:f.updated};
}
function latestUpdated(files){let latest=0;for(const f of files||[])latest=Math.max(latest,Date.parse(f?.updated)||0);return latest}
function readCache(){try{const value=JSON.parse(safeGet(DATA_KEY)||'[]');return Array.isArray(value)?value.map(normalizeFile).filter(Boolean):[]}catch{return []}}
function writeCache(files){
  const compact=(files||[]).map(compactForCache).filter(Boolean);
  if(!safeSet(DATA_KEY,JSON.stringify(compact))){safeRemove(DATA_KEY);return false}
  return true;
}
function clientCacheFresh(){
  const cached=readCache(),last=Number(safeGet(LAST_SYNC_KEY)||0);
  return cached.length>0&&last>0&&(Date.now()-last)<CLIENT_TTL;
}
function removeAutoEntries(){
  if(typeof FILMES_CATALOGO==='undefined')return [];
  const old=[];for(let i=FILMES_CATALOGO.length-1;i>=0;i--){const item=FILMES_CATALOGO[i];if(String(item?.id||'').startsWith('drive-auto-')){old.push(item);FILMES_CATALOGO.splice(i,1)}}
  return old;
}
function addFiles(files,sourceRoot,options={}){
  if(typeof FILMES_CATALOGO==='undefined')return {added:0,removed:0,total:0,duplicates:0,received:0};
  const unique=deduplicateFiles(Array.isArray(files)?files:[]);
  const old=options.replace?removeAutoEntries():[];
  const oldIds=new Set(old.map(x=>x.driveFileId).filter(Boolean)),existing=new Set(FILMES_CATALOGO.map(x=>x.driveFileId).filter(Boolean)),newIds=new Set();let added=0;
  for(const f of unique.files){
    if(existing.has(f.id))continue;
    const p=parse(f.name,f.path||''),seriesKey=p.serie?norm(p.seriesTitle).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''):'';
    const displayTitle=p.serie&&p.episode?'E'+String(p.episode).padStart(2,'0')+' — '+(p.seriesTitle||p.title):p.title;
    FILMES_CATALOGO.push({id:'drive-auto-'+f.id,type:'filme',title:displayTitle,year:p.year||'Google Drive',genre:p.serie?'Série • Google Drive':'Filme • Google Drive',mediaType:p.serie?'serie':'filme',language:'Conforme o arquivo',portuguese:true,colorContent:true,accent:'var(--brand-blue)',thumb:p.serie?'assets/banner-cat-series.webp':'assets/banner-cat-filmes.webp',...(p.serie?{seriesId:seriesKey,seriesTitle:p.seriesTitle||p.title,season:p.season,episode:p.episode}:{}),driveFileId:f.id,driveFileSize:f.size,driveMime:f.mime,drivePlayerUrl:f.player||('https://drive.google.com/file/d/'+f.id+'/preview'),sourceUrl:f.url||('https://drive.google.com/file/d/'+f.id+'/view?usp=sharing'),url:f.url||('https://drive.google.com/file/d/'+f.id+'/view?usp=sharing'),sourceLabel:'Google Drive',sourceCollection:sourceRoot?.name||'Google Drive',embed:false,desc:'Conteúdo sincronizado automaticamente da pasta principal do Google Drive.',nostalgiaTags:['Google Drive',p.serie?'série':'filme'],_driveName:f.name||'',_drivePath:f.path||'',_driveUpdated:f.updated||''});
    existing.add(f.id);newIds.add(f.id);if(!oldIds.has(f.id))added++;
  }
  const removed=options.replace?[...oldIds].filter(id=>!newIds.has(id)).length:0;
  if(options.persist!==false)writeCache(unique.files);
  return {added,removed,total:unique.files.length,duplicates:unique.duplicates,received:unique.received};
}
function jsonp(baseUrl,folderId){
  return new Promise((resolve,reject)=>{
    const cb='__jogaHubDriveCb_'+Date.now()+'_'+Math.random().toString(36).slice(2),script=document.createElement('script');let done=false;
    const timer=setTimeout(()=>finish(new Error('JSONP timeout')),12000);
    function finish(error,data){if(done)return;done=true;clearTimeout(timer);script.remove();try{delete window[cb]}catch{window[cb]=undefined}error?reject(error):resolve(data)}
    window[cb]=data=>finish(null,data);
    try{const u=new URL(baseUrl);if(folderId)u.searchParams.set('folderId',folderId);u.searchParams.set('callback',cb);u.searchParams.set('_',Date.now());script.src=u.toString();script.async=true;script.onerror=()=>finish(new Error('Falha no carregamento JSONP'));document.head.appendChild(script)}catch(e){finish(e)}
  });
}
async function requestCatalog(baseUrl,folderId){
  const u=new URL(baseUrl);if(folderId)u.searchParams.set('folderId',folderId);u.searchParams.set('_',Date.now());
  const controller=typeof AbortController==='function'?new AbortController():null;
  const timer=controller?setTimeout(()=>controller.abort(),15000):0;
  try{
    const r=await fetch(u.toString(),{cache:'no-store',redirect:'follow',...(controller?{signal:controller.signal}:{})});
    if(!r.ok)throw new Error('HTTP '+r.status);return await r.json();
  }catch(fetchError){
    try{return await jsonp(baseUrl,folderId)}catch(jsonpError){const err=new Error('Não foi possível ler o Apps Script. fetch: '+fetchError+'; JSONP: '+jsonpError);err.cause=fetchError;throw err}
  }finally{if(timer)clearTimeout(timer)}
}
function hydrateInitial(){
  LEGACY_DATA_KEYS.forEach(safeRemove);
  const cached=readCache();
  const snapshot=Array.isArray(window.JOGAHUB_DRIVE_SNAPSHOT)?window.JOGAHUB_DRIVE_SNAPSHOT.map(normalizeFile).filter(Boolean):[];
  const cacheLatest=latestUpdated(cached),snapshotLatest=latestUpdated(snapshot);
  const useSnapshot=snapshot.length>0&&(!cached.length||snapshotLatest>cacheLatest||(snapshotLatest===cacheLatest&&snapshot.length>cached.length));
  const initial=useSnapshot?snapshot:cached;
  if(initial.length){
    const r=addFiles(initial,useSnapshot?ROOTS[0]:{name:'Google Drive (cache local)'},{replace:true,persist:false});
    window.JOGAHUB_DRIVE_SYNC_DUPLICATES=r.duplicates;
    if(useSnapshot)writeCache(snapshot);
    return r.total;
  }
  return 0;
}
async function performSync(){
  const base=getConfiguredUrl();
  if(!base||typeof FILMES_CATALOGO==='undefined'){window.JOGAHUB_DRIVE_SYNC_COUNT=0;window.JOGAHUB_DRIVE_SYNC_FOUND=0;return 0}
  let totalAdded=0,totalRemoved=0,totalFound=0,totalDuplicates=0,errors=[],folderStats=[],successes=0;
  for(const sourceRoot of ROOTS){
    try{
      const payload=normalizeResponse(await requestCatalog(base,sourceRoot.id));
      const result=addFiles(payload.files,{...sourceRoot,name:payload.rootName||sourceRoot.name},{replace:true,persist:true});
      successes++;totalAdded+=result.added;totalRemoved+=result.removed;totalFound+=result.total;totalDuplicates+=result.duplicates;
      folderStats.push({name:sourceRoot.name,found:result.total,received:result.received,added:result.added,removed:result.removed,duplicates:result.duplicates});
      if(payload.errors.length)errors=errors.concat(payload.errors);
    }catch(e){errors.push({name:sourceRoot.name,error:String(e)});folderStats.push({name:sourceRoot.name,found:0,added:0,removed:0,duplicates:0,error:String(e)});console.warn('JogaHub Drive',sourceRoot.name,e)}
  }
  lastSuccess=successes>0;
  window.JOGAHUB_DRIVE_SYNC_COUNT=totalAdded;window.JOGAHUB_DRIVE_SYNC_REMOVED=totalRemoved;window.JOGAHUB_DRIVE_SYNC_FOUND=totalFound;window.JOGAHUB_DRIVE_SYNC_DUPLICATES=totalDuplicates;window.JOGAHUB_DRIVE_SYNC_ERRORS=errors;window.JOGAHUB_DRIVE_SYNC_FOLDERS=folderStats;
  if(successes){window.JOGAHUB_DRIVE_SYNC_LAST_SYNC=Date.now();safeSet(LAST_SYNC_KEY,String(window.JOGAHUB_DRIVE_SYNC_LAST_SYNC))}
  if(successes&&typeof window.JOGAHUB_RENDER_CURRENT==='function')window.JOGAHUB_RENDER_CURRENT();
  window.dispatchEvent(new CustomEvent('jogahub:drivesync',{detail:{found:totalFound,added:totalAdded,removed:totalRemoved,duplicates:totalDuplicates,success:successes>0,errors}}));
  return totalAdded;
}
function sync(){
  if(syncPromise)return syncPromise;
  syncPromise=performSync().finally(()=>{syncPromise=null});
  return syncPromise;
}
window.JOGAHUB_DRIVE_SYNC={
  configure:function(url){const value=String(url||'').trim();if(value)safeSet(CONFIG_KEY,value);else safeRemove(CONFIG_KEY);return sync()},
  clearCache:function(){safeRemove(DATA_KEY);safeRemove(LAST_SYNC_KEY);LEGACY_DATA_KEYS.forEach(safeRemove);removeAutoEntries();if(Array.isArray(window.JOGAHUB_DRIVE_SNAPSHOT))addFiles(window.JOGAHUB_DRIVE_SNAPSHOT,ROOTS[0],{replace:false,persist:false});if(typeof window.JOGAHUB_REFRESH_ITEMS==='function')window.JOGAHUB_REFRESH_ITEMS()},
  clear:function(){safeRemove(CONFIG_KEY);this.clearCache()},
  sync,roots:ROOTS,getUrl:getConfiguredUrl,
  getStatus:function(){const last=Number(window.JOGAHUB_DRIVE_SYNC_LAST_SYNC||safeGet(LAST_SYNC_KEY)||0);return {configured:!!getConfiguredUrl(),usingDefault:!safeGet(CONFIG_KEY)&&!!DEFAULT_URL,url:getConfiguredUrl(),cached:readCache().length,cacheFresh:clientCacheFresh(),success:lastSuccess,cacheAgeMs:last?Date.now()-last:null,found:Number(window.JOGAHUB_DRIVE_SYNC_FOUND||0),added:Number(window.JOGAHUB_DRIVE_SYNC_COUNT||0),removed:Number(window.JOGAHUB_DRIVE_SYNC_REMOVED||0),duplicates:Number(window.JOGAHUB_DRIVE_SYNC_DUPLICATES||0),syncing:!!syncPromise,errors:window.JOGAHUB_DRIVE_SYNC_ERRORS||[],folders:window.JOGAHUB_DRIVE_SYNC_FOLDERS||[],lastSync:last}}
};
hydrateInitial();
function startLiveSync(){if(getConfiguredUrl()&&!clientCacheFresh())setTimeout(sync,0)}
window.addEventListener('online',()=>{if(getConfiguredUrl()&&!clientCacheFresh())setTimeout(sync,250)});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',startLiveSync,{once:true});else startLiveSync();
})();
