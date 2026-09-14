/* JogaHub 1.2.29 — painel lateral + layouts dedicados PC / Tablet / Celular */
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

  function installResponsiveStyle(){
    if(qs('#jogahubResponsive129')) return;
    const style=document.createElement('style');
    style.id='jogahubResponsive129';
    style.textContent=`
      body.hud-pro.layout-desktop,body.hud-pro.layout-tablet,body.hud-pro.layout-mobile{overflow-x:hidden}
      body.hud-pro .catalog-main{min-width:0}
      @media(min-width:1200px){
        body.hud-pro.layout-desktop{--desktop-max:1840px;--desktop-gutter:30px;--catalog-side:330px;padding-left:0!important;padding-top:92px!important}
        body.hud-pro.layout-desktop .main-nav{display:none!important}
        body.hud-pro.layout-desktop .site-header{height:82px!important}
        body.hud-pro.layout-desktop .topbar{width:min(100%,var(--desktop-max));max-width:var(--desktop-max)!important;margin:0 auto!important;padding:0 var(--desktop-gutter)!important}
        body.hud-pro.layout-desktop .site-header .brand-logo{width:208px!important}
        body.hud-pro.layout-desktop #banner,body.hud-pro.layout-desktop .movie-notice,body.hud-pro.layout-desktop footer{width:min(calc(100% - (var(--desktop-gutter)*2)),var(--desktop-max));max-width:var(--desktop-max)!important;margin-left:auto!important;margin-right:auto!important;padding-left:0!important;padding-right:0!important}
        body.hud-pro.layout-desktop #banner{margin-top:14px!important}
        body.hud-pro.layout-desktop .featured-banner{min-height:460px!important;max-height:560px;border-radius:28px!important;background-position:center right!important}
        body.hud-pro.layout-desktop .featured-copy{max-width:700px!important;padding:54px 48px!important}
        body.hud-pro.layout-desktop .featured-copy h1{font-size:clamp(48px,4.2vw,78px)!important}
        body.hud-pro.layout-desktop .featured-copy p{font-size:17px!important;line-height:1.58!important;max-width:620px!important}
        body.hud-pro.layout-desktop .catalog-shell{width:min(calc(100% - (var(--desktop-gutter)*2)),var(--desktop-max));max-width:var(--desktop-max)!important;margin:24px auto 80px!important;padding:0!important;grid-template-columns:var(--catalog-side) minmax(0,1fr)!important;gap:28px!important}
        body.hud-pro.layout-desktop.sidebar-collapsed .catalog-shell{grid-template-columns:94px minmax(0,1fr)!important;gap:22px!important}
        body.hud-pro.layout-desktop .catalog-sidebar{position:sticky!important;top:102px!important}
        body.hud-pro.layout-desktop .type-tabs{display:none!important}
        body.hud-pro.layout-desktop .catalog-main .home-dashboard,body.hud-pro.layout-desktop .catalog-main .results-meta,body.hud-pro.layout-desktop .catalog-main #games{width:100%!important;max-width:none!important;padding-left:0!important;padding-right:0!important;margin-left:0!important;margin-right:0!important}
        body.hud-pro.layout-desktop .launcher-hero-panel{grid-template-columns:minmax(0,1.45fr) minmax(340px,.7fr)!important;padding:30px!important;min-height:330px}
        body.hud-pro.layout-desktop .launcher-feature-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important}
        body.hud-pro.layout-desktop .launcher-genre-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important}
        body.hud-pro.layout-desktop .home-track{grid-auto-columns:minmax(240px,300px)!important}
        body.hud-pro.layout-desktop .main-grid,body.hud-pro.layout-desktop .game-category-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:20px!important}
      }
      @media(min-width:1200px) and (max-width:1499px){
        body.hud-pro.layout-desktop{--catalog-side:300px;--desktop-gutter:22px}
        body.hud-pro.layout-desktop .main-grid,body.hud-pro.layout-desktop .game-category-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important}
        body.hud-pro.layout-desktop .launcher-feature-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important}
        body.hud-pro.layout-desktop .featured-banner{min-height:420px!important}
      }
      @media(min-width:1700px){
        body.hud-pro.layout-desktop .main-grid,body.hud-pro.layout-desktop .game-category-grid{grid-template-columns:repeat(5,minmax(0,1fr))!important}
        body.hud-pro.layout-desktop .launcher-genre-grid{grid-template-columns:repeat(5,minmax(0,1fr))!important}
      }
      @media(min-width:768px) and (max-width:1199px){
        body.hud-pro.layout-tablet{padding-left:0!important;padding-top:76px!important}
        body.hud-pro.layout-tablet .main-nav{display:none!important}
        body.hud-pro.layout-tablet .topbar{padding:0 18px!important;max-width:none!important}
        body.hud-pro.layout-tablet #banner{padding:0 18px!important;margin-top:16px!important;max-width:none!important}
        body.hud-pro.layout-tablet .featured-banner{min-height:360px!important;border-radius:22px!important}
        body.hud-pro.layout-tablet .catalog-shell{grid-template-columns:1fr!important;padding:0 18px 86px!important;margin-top:18px!important;max-width:none!important}
        body.hud-pro.layout-tablet .catalog-sidebar{position:static!important}
        body.hud-pro.layout-tablet .sidebar-view-tabs{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important}
        body.hud-pro.layout-tablet .catalog-sidebar .filters{max-height:none!important;flex-direction:row!important;overflow:auto!important;flex-wrap:nowrap!important}
        body.hud-pro.layout-tablet .main-grid,body.hud-pro.layout-tablet .game-category-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important}
      }
      @media(max-width:767px){
        body.hud-pro.layout-mobile{padding-left:0!important;padding-top:64px!important;padding-bottom:84px!important}
        body.hud-pro.layout-mobile .site-header{height:58px!important}
        body.hud-pro.layout-mobile .topbar{padding:0 12px!important;gap:8px!important;max-width:none!important}
        body.hud-pro.layout-mobile .brand-button:after{display:none!important}
        body.hud-pro.layout-mobile .site-header .brand-logo{width:126px!important}
        body.hud-pro.layout-mobile .main-nav{display:none!important}
        body.hud-pro.layout-mobile #banner{width:100%!important;max-width:none!important;margin:10px 0 0!important;padding:0 10px!important}
        body.hud-pro.layout-mobile .featured-banner{min-height:0!important;height:auto!important;aspect-ratio:16/10!important;border-radius:18px!important;background-position:62% center!important}
        body.hud-pro.layout-mobile .featured-banner:after{display:block!important;width:100%!important;background:linear-gradient(180deg,rgba(4,8,16,.12),rgba(4,8,16,.28) 35%,rgba(4,8,16,.90) 100%)!important}
        body.hud-pro.layout-mobile .featured-copy{align-self:flex-end!important;max-width:none!important;width:100%!important;padding:18px 18px 20px!important;justify-content:flex-end!important}
        body.hud-pro.layout-mobile .featured-copy h1{font-size:clamp(28px,9vw,40px)!important;line-height:1!important;max-width:92%!important}
        body.hud-pro.layout-mobile .featured-copy p{font-size:13px!important;line-height:1.45!important;max-width:94%!important;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        body.hud-pro.layout-mobile .hero-pills{display:none!important}
        body.hud-pro.layout-mobile .type-tabs{display:none!important}
        body.hud-pro.layout-mobile .catalog-shell{display:block!important;width:100%!important;max-width:none!important;margin:14px 0 0!important;padding:0 10px 90px!important}
        body.hud-pro.layout-mobile .catalog-sidebar{position:static!important}
        body.hud-pro.layout-mobile .catalog-sidebar-panel{display:flex!important;gap:10px!important}
        body.hud-pro.layout-mobile .catalog-sidebar-head{padding:10px 12px!important;border-radius:16px!important;align-items:center!important}
        body.hud-pro.layout-mobile .catalog-sidebar-head p{display:none!important}
        body.hud-pro.layout-mobile .catalog-sidebar-head strong{font-size:18px!important}
        body.hud-pro.layout-mobile .sidebar-toggle{display:none!important}
        body.hud-pro.layout-mobile .sidebar-view-tabs{display:flex!important;flex-direction:row!important;gap:8px!important;overflow-x:auto!important;padding:10px!important;border-radius:16px!important;scrollbar-width:none}
        body.hud-pro.layout-mobile .sidebar-view-btn{flex:0 0 108px!important;min-width:108px!important;min-height:68px!important;padding:9px 8px!important;border-radius:13px!important;flex-direction:column!important;justify-content:center!important;gap:5px!important;text-align:center!important}
        body.hud-pro.layout-mobile .sidebar-view-btn>span{width:30px!important;height:30px!important;font-size:16px!important}
        body.hud-pro.layout-mobile .sidebar-view-btn>div{display:block!important;max-width:100%!important;opacity:1!important;transform:none!important}
        body.hud-pro.layout-mobile .sidebar-view-btn b{font-size:12px!important;white-space:nowrap!important}
        body.hud-pro.layout-mobile .sidebar-view-btn small{display:none!important}
        body.hud-pro.layout-mobile .catalog-sidebar .controls{display:flex!important;max-height:none!important;opacity:1!important;transform:none!important;position:static!important;padding:10px!important;border-radius:16px!important;gap:10px!important}
        body.hud-pro.layout-mobile .catalog-sidebar .filters{display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;gap:8px!important;max-height:none!important;overflow-x:auto!important;padding:0!important;scrollbar-width:none}
        body.hud-pro.layout-mobile .catalog-sidebar .filter-btn{flex:0 0 auto!important;min-width:auto!important;width:auto!important;min-height:40px!important;padding:9px 12px!important;border-radius:12px!important;white-space:nowrap!important}
        body.hud-pro.layout-mobile.sidebar-collapsed .catalog-shell{display:block!important}
        body.hud-pro.layout-mobile.sidebar-collapsed .catalog-sidebar .controls{display:flex!important;max-height:none!important;opacity:1!important;padding:10px!important;pointer-events:auto!important}
        body.hud-pro.layout-mobile .catalog-main{margin-top:14px!important}
        body.hud-pro.layout-mobile .catalog-main .home-dashboard,body.hud-pro.layout-mobile .catalog-main .results-meta,body.hud-pro.layout-mobile .catalog-main #games{padding:0!important;margin-left:0!important;margin-right:0!important;max-width:none!important;width:100%!important}
        body.hud-pro.layout-mobile .launcher-hero-panel{display:block!important;padding:16px!important;border-radius:18px!important}
        body.hud-pro.layout-mobile .launcher-hero-copy h2{font-size:27px!important}
        body.hud-pro.layout-mobile .launcher-side-panels{margin-top:14px!important;display:block!important}
        body.hud-pro.layout-mobile .launcher-stats{grid-template-columns:repeat(2,minmax(0,1fr))!important}
        body.hud-pro.layout-mobile .launcher-genre-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}
        body.hud-pro.layout-mobile .launcher-feature-grid{grid-template-columns:1fr!important;gap:10px!important}
        body.hud-pro.layout-mobile .home-track{grid-auto-columns:minmax(190px,78vw)!important;gap:10px!important}
        body.hud-pro.layout-mobile .game-category{padding:10px!important;border-radius:18px!important;margin:18px 0 28px!important}
        body.hud-pro.layout-mobile .main-grid,body.hud-pro.layout-mobile .game-category-grid{grid-template-columns:1fr!important;gap:12px!important}
        body.hud-pro.layout-mobile .card{border-radius:16px!important}
        body.hud-pro.layout-mobile .mobile-nav{left:7px!important;right:7px!important;bottom:7px!important;height:60px!important;grid-template-columns:repeat(5,1fr)!important;overflow:hidden!important}
        body.hud-pro.layout-mobile .mobile-nav button:nth-child(n+6){display:none!important}
        body.hud-pro.layout-mobile footer{padding:16px 12px 88px!important;max-width:none!important}
      }
      @media(min-width:520px) and (max-width:767px){
        body.hud-pro.layout-mobile .main-grid,body.hud-pro.layout-mobile .game-category-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
        body.hud-pro.layout-mobile .featured-banner{aspect-ratio:16/8.5!important}
      }
    `;
    document.head.appendChild(style);
  }
  function applyLayout(){
    const w=window.innerWidth||document.documentElement.clientWidth||1280;
    const layout=w<=767?'mobile':w<=1199?'tablet':'desktop';
    document.body.classList.remove('layout-mobile','layout-tablet','layout-desktop');
    document.body.classList.add(`layout-${layout}`);
    document.body.dataset.layout=layout;
    document.documentElement.dataset.layout=layout;
  }
  let resizeRaf=0;
  function scheduleLayout(){cancelAnimationFrame(resizeRaf);resizeRaf=requestAnimationFrame(applyLayout)}

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
    installResponsiveStyle();
    applyLayout();
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
  window.addEventListener('resize',scheduleLayout,{passive:true});
  window.addEventListener('orientationchange',()=>setTimeout(applyLayout,120),{passive:true});
  document.addEventListener('DOMContentLoaded',()=>setTimeout(init,0));
  window.addEventListener('pageshow',()=>{setTimeout(syncSidebar,0);setTimeout(applyLayout,0)});
})();
