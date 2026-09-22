/* JOGAHUB — sincronizador Google Drive 1.2.40 */
(function(){
const CONFIG_KEY='jogahub_drive_sync_url';
const ROOTS=[
{id:'1QmY3xIAk4AWVgRzcaTzAuKPdVrL9k6H_',name:'Acervo Drive 1'},
{id:'1XiSyDV7cLNMaLDjbCdeR-VCP_KWK9C3W',name:'Acervo Drive 2'},
{id:'1FpJ__h7dTKpD-VOTl3WUIgpBBUc4vhut',name:'Filmes e Séries'},
{id:'1F2_t5aERWvGfOL_4VxWMgEDiwoBbZRc1',name:'Clássicos'}];
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const clean=s=>String(s||'').replace(/\.(mp4|mkv|webm|mov|avi|m4v|ogv)$/i,'').replace(/[._]+/g,' ').replace(/\s+/g,' ').trim();
function parse(name,path){
 const full=norm((path||'')+'/'+name);let m=full.match(/\bs(\d{1,2})e(\d{1,3})\b/i)||full.match(/\bt(\d{1,2})e(\d{1,3})\b/i)||full.match(/\b(\d{1,2})x(\d{1,3})\b/i);
 let season=m?Number(m[1]):0,episode=m?Number(m[2]):0;
 if(!season){const sm=full.match(/(?:temporada|season|temp)[\s._-]*(\d{1,2})/i);season=sm?Number(sm[1]):0}
 if(!episode){const em=full.match(/(?:epis[oó]dio|episode|ep)[\s._-]*(\d{1,3})/i);episode=em?Number(em[1]):0}
 const parts=String(path||'').split('/').filter(Boolean),seasonIdx=parts.findIndex(x=>/(?:temporada|season|temp)[\s._-]*\d+/i.test(x));
 const seriesTitle=seasonIdx>0?clean(parts[seasonIdx-1]):(parts.length>1?clean(parts[parts.length-2]):clean(name));
 const serie=!!(season||episode||seasonIdx>=0||/(?:series|epis[oó]d|temporada|season)/i.test(full));
 return {serie,season:season||1,episode,title:clean(name),seriesTitle:serie?seriesTitle:''};
}
function add(files,root){
 if(typeof FILMES_CATALOGO==='undefined')return 0;const existing=new Set(FILMES_CATALOGO.map(x=>x.driveFileId).filter(Boolean));let added=0;
 for(const f of(Array.isArray(files)?files:[])){if(!f?.id||existing.has(f.id))continue;const p=parse(f.name,f.path||''),seriesKey=p.serie?norm(p.seriesTitle).replace(/[^a-z0-9]+/g,'-'):'';
 FILMES_CATALOGO.push({id:'drive-auto-'+f.id,type:'filme',title:p.serie&&p.episode?'E'+String(p.episode).padStart(2,'0')+' — '+p.seriesTitle:p.title,year:'Google Drive',genre:p.serie?'Série • Google Drive':'Filme • Google Drive',mediaType:p.serie?'serie':'filme',language:'Conforme o arquivo',portuguese:true,colorContent:true,accent:'var(--brand-blue)',thumb:p.serie?'assets/banner-cat-series.webp':'assets/banner-cat-filmes.webp',...(p.serie?{seriesId:seriesKey,seriesTitle:p.seriesTitle,season:p.season,episode:p.episode}:{}),driveFileId:f.id,driveFileSize:Number(f.size)||0,driveMime:f.mime,sourceUrl:f.url,url:f.url,sourceLabel:'Google Drive',sourceCollection:root.name,embed:false,desc:'Conteúdo sincronizado automaticamente do Google Drive.',nostalgiaTags:['Google Drive',p.serie?'série':'filme']});existing.add(f.id);added++}
 return added;
}
async function sync(){
 const base=localStorage.getItem(CONFIG_KEY);if(!base||typeof FILMES_CATALOGO==='undefined'){window.JOGAHUB_DRIVE_SYNC_COUNT=0;return 0}
 let total=0,success=0;for(const root of ROOTS){try{const u=new URL(base);u.searchParams.set('folderId',root.id);const r=await fetch(u.toString(),{cache:'no-store'});if(!r.ok)continue;const j=await r.json();if(!j.ok||!Array.isArray(j.files))continue;total+=add(j.files,root);success++}catch(e){console.warn('JogaHub Drive',root.name,e)}}
 window.JOGAHUB_DRIVE_SYNC_COUNT=total;window.JOGAHUB_DRIVE_SYNC_ROOTS_OK=success;return total;
}
window.JOGAHUB_DRIVE_SYNC={configure:function(url){const cleanUrl=String(url||'').trim();if(cleanUrl)localStorage.setItem(CONFIG_KEY,cleanUrl);else localStorage.removeItem(CONFIG_KEY);return sync()},clear:function(){localStorage.removeItem(CONFIG_KEY)},sync:sync};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(sync,0)});else setTimeout(sync,0);
})();