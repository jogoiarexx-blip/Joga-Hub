/* JogaHub 1.2.28 — painel lateral retrátil + abas por tipo + banner dinâmico */
(() => {
  const KEY='jogahub.sidebar.collapsed.v1';
  const qs=(s,r=document)=>r.querySelector(s);
  const qsa=(s,r=document)=>[...r.querySelectorAll(s)];
  const viewMeta={
    todos:['⌂','Início','visão geral'],
    jogo:['🎮','Jogos','biblioteca gamer'],
    filme:['🎬','Filmes','catálogo para assistir'],
    serie:['📺','Séries','maratonar agora'],
    anime:['🍥','Animes','coleção otaku'],
    emulador:['🕹️','Emuladores','retrô e clássicos']
  };
  const filterTitles={todos:'Explorar',jogo:'Categorias de jogos',filme:'Filtros de filmes',serie:'Filtros de séries',anime:'Filtros de animes',emulador:'Emuladores'};

  function currentView(){
    return (typeof activeType!=='undefined'&&activeType)||document.body.dataset.view||'todos';
  }
  function bannerTransitionStart(){
    const b=qs('#banner'); if(!b)return;
    b.classList.remove('banner-switching'); void b.offsetWidth; b.classList.add('banner-switching');
  }
  function bannerTransitionEnd(view){
    const b=qs('#banner'),f=qs('#featuredLink');
    if(f)f.dataset.bannerView=view||currentView();
    if(b)setTimeout(()=>b.classList.remove('banner-switching'),120);
  }
  function makeSidebar(){
    if(qs('.catalog-shell'))return;
    const controls=qs('body > .controls')||qs('.controls');
    const banner=qs('#banner'),notice=qs('#movieNotice'),home=qs('#homeDashboard'),meta=qs('#resultsMeta'),games=qs('#games'),empty=qs('#emptyState');
    if(!controls||!banner||!home||!meta||!games)return;
    const shell=document.createElement('section'); shell.className='catalog-shell';
    const aside=document.createElement('aside'); aside.className='catalog-sidebar'; aside.setAttribute('aria-label','Navegação e filtros do catálogo');
    const panel=document.createElement('div'); panel.className='catalog-sidebar-panel';
    const head=document.createElement('div'); head.className='catalog-sidebar-head';
    head.innerHTML='<div><span class="eyebrow">Launcher</span><strong>Catálogo</strong><p>Abas laterais com submenus organizados.</p></div><button id="sidebarToggle" class="sidebar-toggle" type="button" aria-expanded="true" aria-label="Retrair painel lateral">⇤</button>';
    const tabs=document.createElement('div'); tabs.className='sidebar-view-tabs'; tabs.id='sidebarViewTabs';
    tabs.innerHTML=Object.entries(viewMeta).map(([view,[icon,label,small]])=>`<button class="sidebar-view-btn" data-sidebar-view="${view}" type="button"><span>${icon}</span><div><b>${label}</b><small>${small}</small></div></button>`).join('');
    const fhead=document.createElement('div'); fhead.className='sidebar-filter-head'; fhead.id='sidebarFilterHead'; fhead.innerHTML='<span>Submenu</span><strong>Explorar</strong>';
    controls.insertBefore(fhead,qs('#filters',controls));
    panel.append(head,tabs,controls); aside.append(panel);
    const main=document.createElement('div'); main.className='catalog-main';
    banner.parentNode.insertBefore(shell,banner); shell.append(aside,main);
    [banner,notice,home,meta,games,empty].filter(Boolean).forEach(el=>main.append(el));
  }
  function setCollapsed(collapsed){
    document.body.classList.toggle('sidebar-collapsed',!!collapsed);
    const btn=qs('#sidebarToggle');
    if(btn){btn.textContent=collapsed?'⇥':'⇤';btn.setAttribute('aria-expanded',String(!collapsed));btn.setAttribute('aria-label',collapsed?'Expandir painel lateral':'Retrair painel lateral');}
    try{localStorage.setItem(KEY,collapsed?'1':'0')}catch{}
  }
  function syncSidebar(){
    const view=currentView(); document.body.dataset.view=view;
    qsa('.sidebar-view-btn').forEach(b=>b.classList.toggle('active',b.dataset.sidebarView===view));
    const h=qs('#sidebarFilterHead strong'); if(h)h.textContent=filterTitles[view]||'Explorar';
    const f=qs('#featuredLink'); if(f)f.dataset.bannerView=view;
  }
  function openView(view){
    bannerTransitionStart();
    if(typeof setView==='function')setView(view);
    setTimeout(()=>{syncSidebar();bannerTransitionEnd(view)},70);
  }
  function observeFilters(){
    const filters=qs('#filters'); if(!filters)return;
    const obs=new MutationObserver(()=>syncSidebar()); obs.observe(filters,{childList:true,subtree:true});
  }
  function init(){
    makeSidebar();
    let collapsed=false; try{collapsed=localStorage.getItem(KEY)==='1'}catch{}
    setCollapsed(collapsed); syncSidebar(); observeFilters();
    qs('#sidebarToggle')?.addEventListener('click',()=>setCollapsed(!document.body.classList.contains('sidebar-collapsed')));
    qs('#sidebarViewTabs')?.addEventListener('click',e=>{const b=e.target.closest('[data-sidebar-view]');if(!b)return;openView(b.dataset.sidebarView)});
  }
  document.addEventListener('click',e=>{
    const nav=e.target.closest('[data-view],.type-btn,[data-launch-view]');
    if(!nav||nav.closest('#sidebarViewTabs'))return;
    const view=nav.dataset.view||nav.dataset.type||nav.dataset.launchView;
    if(!view)return;
    bannerTransitionStart(); setTimeout(()=>{syncSidebar();bannerTransitionEnd(view)},90);
  },true);
  document.addEventListener('DOMContentLoaded',()=>setTimeout(init,0));
  window.addEventListener('pageshow',()=>setTimeout(syncSidebar,0));
})();
