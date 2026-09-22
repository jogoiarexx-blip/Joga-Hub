/* JOGAHUB — sincronizador Google Drive 1.2.45 */
(function(){
'use strict';

const CONFIG_KEY='jogahub_drive_sync_url';
const DATA_KEY='jogahub_drive_catalog_cache_v4_single_root';
const LEGACY_DATA_KEYS=['jogahub_drive_catalog_cache_v3_single_root','jogahub_drive_catalog_cache_v2'];
const DEFAULT_URL=String(window.JOGAHUB_DRIVE_SYNC_URL||'').trim();
const root=window.JOGAHUB_DRIVE_ROOT||{
  id:'1FpJ__h7dTKpD-VOTl3WUIgpBBUc4vhut',name:'Filmes e Séries'
};
const ROOTS=[{id:root.id,name:root.name}];

const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const clean=s=>String(s||'')
  .replace(/\.(mp4|mkv|webm|mov|avi|m4v|ogv|mpeg|mpg|3gp)$/i,'')
  .replace(/[._]+/g,' ').replace(/\s+/g,' ').trim();

function getConfiguredUrl(){
  return String(localStorage.getItem(CONFIG_KEY)||DEFAULT_URL||'').trim();
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

function parse(name,path){
  // O Apps Script inclui o nome da raiz no caminho. A raiz contém "Séries",
  // por isso ela precisa ser descartada antes de classificar filmes/episódios.
  const rawParts=String(path||'').split('/').filter(Boolean);
  const parts=rawParts.length>1?rawParts.slice(1):[];
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
  let seriesTitle='';
  if(seasonIdx>0) seriesTitle=clean(parts[seasonIdx-1]);
  else if(parts.length&&(season||episode)) seriesTitle=clean(parts[parts.length-1]);
  else if(/(?:series|epis[oó]d|temporada|season|\bs\d{1,2}\b)/i.test(full)&&parts.length) seriesTitle=clean(parts[parts.length-1]);

  if(seriesTitle){
    seriesTitle=seriesTitle
      .replace(/(?:\s*[-–]?\s*(?:\d{1,2}\s*[ªa]?\s*Temporada|\b(?:S|T)\s*0*\d{1,2}\b|\d{1,2}\s*[ªa]?\s*Season)).*$/i,'')
      .replace(/\s*\(?\b(?:19|20)\d{2}\b\)?\s*$/,'')
      .replace(/\s*[-–]\s*$/,'').trim()||seriesTitle;
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
  const files=raw.map(normalizeFile).filter(Boolean);
  return {
    files,
    errors:Array.isArray(j.errors)?j.errors:[],
    rootName:String(j.pastaRaiz||j.rootName||root.name||'Google Drive')
  };
}

function readCache(){
  try{
    const value=JSON.parse(localStorage.getItem(DATA_KEY)||'[]');
    return Array.isArray(value)?value.map(normalizeFile).filter(Boolean):[];
  }catch{return []}
}

function writeCache(files){
  try{localStorage.setItem(DATA_KEY,JSON.stringify((files||[]).map(normalizeFile).filter(Boolean)))}
  catch(e){console.warn('JogaHub Drive cache',e)}
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

function addFiles(files,sourceRoot,options={}){
  if(typeof FILMES_CATALOGO==='undefined')return {added:0,removed:0,total:0};
  const normalized=(Array.isArray(files)?files:[]).map(normalizeFile).filter(Boolean);
  const old=options.replace?removeAutoEntries():[];
  const oldIds=new Set(old.map(x=>x.driveFileId).filter(Boolean));
  const existing=new Set(FILMES_CATALOGO.map(x=>x.driveFileId).filter(Boolean));
  const newIds=new Set();
  let added=0;

  for(const f of normalized){
    if(existing.has(f.id))continue;
    const p=parse(f.name,f.path||'');
    const seriesKey=p.serie?norm(p.seriesTitle).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''):'';
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
  return {added,removed,total:normalized.length};
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
  try{
    const r=await fetch(u.toString(),{cache:'no-store',redirect:'follow'});
    if(!r.ok)throw new Error('HTTP '+r.status);
    return await r.json();
  }catch(fetchError){
    try{return await jsonp(baseUrl,folderId)}
    catch(jsonpError){
      const err=new Error('Não foi possível ler o Apps Script. fetch: '+fetchError+'; JSONP: '+jsonpError);
      err.cause=fetchError;
      throw err;
    }
  }
}

function hydrateInitial(){
  LEGACY_DATA_KEYS.forEach(key=>localStorage.removeItem(key));
  const cached=readCache();
  if(cached.length){
    addFiles(cached,{name:'Google Drive (cache local)'},{replace:true,persist:false});
    return cached.length;
  }
  if(Array.isArray(window.JOGAHUB_DRIVE_SNAPSHOT)&&window.JOGAHUB_DRIVE_SNAPSHOT.length){
    const snap=window.JOGAHUB_DRIVE_SNAPSHOT.map(normalizeFile).filter(Boolean);
    addFiles(snap,ROOTS[0],{replace:true,persist:false});
    return snap.length;
  }
  return 0;
}

async function sync(){
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
  if(typeof window.JOGAHUB_REFRESH_ITEMS==='function')window.JOGAHUB_REFRESH_ITEMS();
  return totalAdded;
}

window.JOGAHUB_DRIVE_SYNC={
  configure:function(url){
    const cleanUrl=String(url||'').trim();
    if(cleanUrl)localStorage.setItem(CONFIG_KEY,cleanUrl);else localStorage.removeItem(CONFIG_KEY);
    return sync();
  },
  clearCache:function(){
    localStorage.removeItem(DATA_KEY);
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

function startLiveSync(){
  if(getConfiguredUrl())setTimeout(sync,0);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',startLiveSync,{once:true});
else startLiveSync();
})();
