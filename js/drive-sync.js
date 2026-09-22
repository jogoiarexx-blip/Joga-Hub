/* JOGAHUB — sincronizador Google Drive */
(function(){
  const CONFIG_KEY='jogahub_drive_sync_url';
  const ROOTS=[
    {id:'1QmY3xIAk4AWVgRzcaTzAuKPdVrL9k6H_',name:'Acervo Drive 1'},
    {id:'1XiSyDV7cLNMaLDjbCdeR-VCP_KWK9C3W',name:'Acervo Drive 2'},
    {id:'1FpJ__h7dTKpD-VOTl3WUIgpBBUc4vhut',name:'Filmes e Séries'},
    {id:'1F2_t5aERWvGfOL_4VxWMgEDiwoBbZRc1',name:'Clássicos'}
  ];
  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  function parse(name,path){
    const full=norm(path+'/'+name);
    const s=full.match(/(?:s|temporada)[\s._-]*(\d{1,2})/);
    const e=full.match(/(?:e|ep|episodio)[\s._-]*(\d{1,3})/);
    const season=s?Number(s[1]):0, episode=e?Number(e[1]):0;
    const serie=!!(season||episode||/series|temporada|episod/i.test(full));
    const title=serie ? name.replace(/\.(mp4|mkv|webm|mov|avi)$/i,'').replace(/[._-]+/g,' ').trim() : name.replace(/\.[^.]+$/,'').replace(/[._-]+/g,' ').trim();
    return {serie,season,episode,title};
  }
  function add(files,root){
    if(typeof FILMES_CATALOGO==='undefined') return;
    const existing=new Set(FILMES_CATALOGO.map(x=>x.driveFileId).filter(Boolean));
    files.forEach(f=>{
      if(!f?.id || existing.has(f.id)) return;
      const p=parse(f.name,f.path||'');
      const seriesId=p.serie ? norm((f.path||'').split('/').slice(-1)[0]||p.title).replace(/[^a-z0-9]+/g,'-') : '';
      FILMES_CATALOGO.push({
        id:'drive-auto-'+f.id,
        type:'filme',
        title:p.serie && p.episode ? 'E'+String(p.episode).padStart(2,'0')+' — '+p.title : p.title,
        year:'Google Drive',
        genre:p.serie?'Série • Google Drive':'Filme • Google Drive',
        mediaType:p.serie?'serie':'filme',
        language:'Conforme o arquivo',
        portuguese:true,colorContent:true,accent:'var(--brand-blue)',
        thumb:p.serie?'assets/banner-cat-series.webp':'assets/banner-cat-filmes.webp',
        ...(p.serie?{seriesId,seriesTitle:(f.path||'').split('/').slice(-1)[0]||p.title,season:p.season||1,episode:p.episode||0}:{}),
        driveFileId:f.id,driveFileSize:Number(f.size)||0,driveMime:f.mime,
        sourceUrl:f.url,url:f.url,sourceLabel:'Google Drive',
        sourceCollection:root.name,embed:false,
        desc:'Conteúdo sincronizado automaticamente do Google Drive.',
        nostalgiaTags:['Google Drive',p.serie?'série':'filme']
      });
      existing.add(f.id);
    });
  }
  async function sync(){
    const base=localStorage.getItem(CONFIG_KEY);
    if(!base || typeof FILMES_CATALOGO==='undefined') return;
    let total=0;
    for(const root of ROOTS){
      try{
        const u=new URL(base);u.searchParams.set('folderId',root.id);
        const r=await fetch(u.toString(),{cache:'no-store'}); if(!r.ok) continue;
        const j=await r.json(); if(!j.ok||!Array.isArray(j.files)) continue;
        add(j.files,root); total+=j.files.length;
      }catch(_){}
    }
    window.JOGAHUB_DRIVE_SYNC_COUNT=total;
  }
  window.JOGAHUB_DRIVE_SYNC={
    configure(url){localStorage.setItem(CONFIG_KEY,String(url||'').trim());return sync();},
    clear(){localStorage.removeItem(CONFIG_KEY);},
    sync
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(sync,0)); else setTimeout(sync,0);
})();