/* JOGAHUB — sincronizador Google Drive 1.2.43 */
(function(){
'use strict';
const CONFIG_KEY='jogahub_drive_sync_url';
const DATA_KEY='jogahub_drive_catalog_cache_v3_single_root';
const LEGACY_DATA_KEYS=['jogahub_drive_catalog_cache_v2'];
const root=window.JOGAHUB_DRIVE_ROOT||{
 id:'1FpJ__h7dTKpD-VOTl3WUIgpBBUc4vhut',name:'Filmes e Séries'
};
const ROOTS=[{id:root.id,name:root.name}];

const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const clean=s=>String(s||'')
 .replace(/\.(mp4|mkv|webm|mov|avi|m4v|ogv|mpeg|mpg|3gp)$/i,'')
 .replace(/[._]+/g,' ').replace(/\s+/g,' ').trim();

function seasonFromText(s){
 const x=norm(s);
 let m=x.match(/\b(?:s|t)\s*0*(\d{1,2})\b/i);
 if(m)return Number(m[1]);
 m=x.match(/\b(?:temporada|season|temp)\s*0*(\d{1,2})\b/i);
 if(m)return Number(m[1]);
 m=x.match(/\b0*(\d{1,2})\s*[ªa]?\s*(?:temporada|season)\b/i);
 return m?Number(m[1]):0;
}
function parse(name,path){
 // O Apps Script inclui o nome da raiz no caminho. Ele contém a palavra
 // "Séries", então precisa ser removido antes da classificação para que
 // filmes comuns não sejam tratados como episódios.
 const rawParts=String(path||'').split('/').filter(Boolean);
 const parts=rawParts.length>1?rawParts.slice(1):[];
 const full=norm(parts.join('/')+'/'+name);
 let m=full.match(/\bs(\d{1,2})e(\d{1,3})\b/i)||full.match(/\bt(\d{1,2})e(\d{1,3})\b/i)||full.match(/\b(\d{1,2})x(\d{1,3})\b/i);
 let season=m?Number(m[1]):0,episode=m?Number(m[2]):0;
 if(!season)season=seasonFromText(full);
 if(!episode){
   const em=full.match(/(?:epis[oó]dio|episode|ep)\s*0*(\d{1,3})\b/i);
   episode=em?Number(em[1]):0;
 }
 const seasonIdx=parts.findIndex(x=>seasonFromText(x)>0);
 let seriesTitle='';
 if(seasonIdx>0) seriesTitle=clean(parts[seasonIdx-1]);
 else if(parts.length && (season||episode)) seriesTitle=clean(parts[parts.length-1]);
 else if(/(?:series|epis[oó]d|temporada|season|\bs\d{1,2}\b)/i.test(full) && parts.length) seriesTitle=clean(parts[parts.length-1]);
 const serie=!!(season||episode||seasonIdx>=0||seriesTitle);
 return {serie,season:season||1,episode,title:clean(name),seriesTitle:serie?seriesTitle:''};
}

function readCache(){
 try{const v=JSON.parse(localStorage.getItem(DATA_KEY)||'[]');return Array.isArray(v)?v:[]}catch{return []}
}
function writeCache(){
 try{
   const files=FILMES_CATALOGO.filter(x=>x&&x.driveFileId&&String(x.id||'').startsWith('drive-auto-'))
     .map(x=>({
       id:x.driveFileId,name:x._driveName||x.title,mime:x.driveMime,size:x.driveFileSize,
       path:x._drivePath||'',url:x.sourceUrl,updated:x._driveUpdated||''
     }));
   localStorage.setItem(DATA_KEY,JSON.stringify(files));
 }catch(e){console.warn('JogaHub Drive cache',e)}
}
function add(files,root,fromCache){
 if(typeof FILMES_CATALOGO==='undefined')return 0;
 const existing=new Set(FILMES_CATALOGO.map(x=>x.driveFileId).filter(Boolean));let added=0;
 for(const f of(Array.isArray(files)?files:[])){
   if(!f?.id||existing.has(f.id))continue;
   const p=parse(f.name,f.path||''),seriesKey=p.serie?norm(p.seriesTitle).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''):'';
   FILMES_CATALOGO.push({
     id:'drive-auto-'+f.id,type:'filme',
     title:p.serie&&p.episode?'E'+String(p.episode).padStart(2,'0')+' — '+p.seriesTitle:p.title,
     year:'Google Drive',genre:p.serie?'Série • Google Drive':'Filme • Google Drive',
     mediaType:p.serie?'serie':'filme',language:'Conforme o arquivo',portuguese:true,colorContent:true,
     accent:'var(--brand-blue)',thumb:p.serie?'assets/banner-cat-series.webp':'assets/banner-cat-filmes.webp',
     ...(p.serie?{seriesId:seriesKey,seriesTitle:p.seriesTitle,season:p.season,episode:p.episode}:{}),
     driveFileId:f.id,driveFileSize:Number(f.size)||0,driveMime:f.mime||'',
     sourceUrl:f.url||('https://drive.google.com/file/d/'+f.id+'/view?usp=sharing'),
     url:f.url||('https://drive.google.com/file/d/'+f.id+'/view?usp=sharing'),
     sourceLabel:'Google Drive',sourceCollection:root?.name||'Google Drive',embed:false,
     desc:'Conteúdo sincronizado do Google Drive.',
     nostalgiaTags:['Google Drive',p.serie?'série':'filme'],
     _driveName:f.name||'',_drivePath:f.path||'',_driveUpdated:f.updated||''
   });
   existing.add(f.id);added++;
 }
 if(!fromCache)writeCache();
 return added;
}
function hydrateCache(){
 const cached=readCache();
 if(cached.length){
   const added=add(cached,{name:'Google Drive (cache local)'},true);
   if(added&&typeof window.JOGAHUB_REFRESH_ITEMS==='function')window.JOGAHUB_REFRESH_ITEMS();
 }
 return cached.length;
}
async function sync(){
 const base=localStorage.getItem(CONFIG_KEY);
 if(!base||typeof FILMES_CATALOGO==='undefined'){
   window.JOGAHUB_DRIVE_SYNC_COUNT=0;
   window.JOGAHUB_DRIVE_SYNC_FOUND=0;
   return 0;
 }
 let total=0,found=0,errors=[],folderStats=[];
 for(const root of ROOTS){
   try{
     const u=new URL(base);u.searchParams.set('folderId',root.id);
     const r=await fetch(u.toString(),{cache:'no-store',redirect:'follow'});
     if(!r.ok)throw new Error('HTTP '+r.status);
     const j=await r.json();
     if(!j.ok||!Array.isArray(j.files))throw new Error(j.error||'Resposta inválida');
     const added=add(j.files,root,false);
     total+=added;found+=j.files.length;
     folderStats.push({name:root.name,found:j.files.length,added});
     if(Array.isArray(j.errors))errors=errors.concat(j.errors);
   }catch(e){
     errors.push({name:root.name,error:String(e)});
     folderStats.push({name:root.name,found:0,added:0,error:String(e)});
     console.warn('JogaHub Drive',root.name,e);
   }
 }
 window.JOGAHUB_DRIVE_SYNC_COUNT=total;
 window.JOGAHUB_DRIVE_SYNC_FOUND=found;
 window.JOGAHUB_DRIVE_SYNC_ERRORS=errors;
 window.JOGAHUB_DRIVE_SYNC_FOLDERS=folderStats;
 window.JOGAHUB_DRIVE_SYNC_LAST_SYNC=Date.now();
 if(typeof window.JOGAHUB_REFRESH_ITEMS==='function')window.JOGAHUB_REFRESH_ITEMS();
 return total;
}
window.JOGAHUB_DRIVE_SYNC={
 configure:function(url){
   const cleanUrl=String(url||'').trim();
   if(cleanUrl)localStorage.setItem(CONFIG_KEY,cleanUrl);else localStorage.removeItem(CONFIG_KEY);
   return sync();
 },
 clear:function(){
   localStorage.removeItem(CONFIG_KEY);
   localStorage.removeItem(DATA_KEY);
   if(typeof FILMES_CATALOGO!=='undefined'){
     for(let i=FILMES_CATALOGO.length-1;i>=0;i--)if(String(FILMES_CATALOGO[i].id||'').startsWith('drive-auto-'))FILMES_CATALOGO.splice(i,1);
   }
   if(typeof window.JOGAHUB_REFRESH_ITEMS==='function')window.JOGAHUB_REFRESH_ITEMS();
 },
 sync:sync,roots:ROOTS,
 getStatus:function(){return {
   configured:!!localStorage.getItem(CONFIG_KEY),
   cached:readCache().length,
   found:Number(window.JOGAHUB_DRIVE_SYNC_FOUND||0),
   added:Number(window.JOGAHUB_DRIVE_SYNC_COUNT||0),
   errors:window.JOGAHUB_DRIVE_SYNC_ERRORS||[],
   folders:window.JOGAHUB_DRIVE_SYNC_FOLDERS||[]
 }}
};

function boot(){
 LEGACY_DATA_KEYS.forEach(key=>localStorage.removeItem(key));
 hydrateCache();
 if(localStorage.getItem(CONFIG_KEY))setTimeout(sync,0);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
else boot();
})();
