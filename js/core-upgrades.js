/* JogaHub 1.3.2 — navegação, desempenho e acessibilidade */
(function(){
'use strict';
const $=s=>document.querySelector(s);
const status=$('#catalogStatus');
const search=$('#search');
const topButton=$('#backToTop');
let searchTimer=0;
let restoringHistory=false;

function safeStore(key,value){try{localStorage.setItem(key,value)}catch{}}
function safeRead(key){try{return localStorage.getItem(key)||''}catch{return ''}}
function formatSync(time){
  if(!time)return 'Catálogo local pronto';
  const date=new Date(Number(time));
  return Number.isNaN(date.getTime())?'Catálogo local pronto':'Drive atualizado em '+date.toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
}
function paintStatus(extra=''){
  if(!status)return;
  const sync=window.JOGAHUB_DRIVE_SYNC?.getStatus?.()||{};
  const drive=(window.JOGAHUB_ITEMS||[]).filter(x=>x.driveFileId);
  const errors=Array.isArray(sync.errors)?sync.errors.length:0;
  status.innerHTML='<span class="catalog-status-dot" aria-hidden="true"></span><span>'+
    (navigator.onLine?'Online':'Modo offline')+'</span><span>'+drive.length+' vídeos do Drive</span><span>'+formatSync(sync.lastSync||safeRead('jogahub_drive_last_sync'))+'</span>'+
    (errors?'<span class="catalog-status-error">'+errors+' falha(s) na sincronização</span>':'')+(extra?'<span>'+extra+'</span>':'');
}
function updateUrl(mode='replace'){
  const view=(typeof activeType==='string'?activeType:document.body.dataset.view)||'todos';
  const params=new URLSearchParams(location.search);
  view==='todos'?params.delete('view'):params.set('view',view);
  const query=(search?.value||'').trim();query?params.set('q',query):params.delete('q');
  const url=location.pathname+(params.toString()?'?'+params:'')+location.hash;
  if(url===location.pathname+location.search+location.hash){safeStore('jogahub.lastView',view);return}
  history[mode==='push'?'pushState':'replaceState']({view,query},'',url);
  safeStore('jogahub.lastView',view);
}
function enhanceImages(root=document){
  root.querySelectorAll('img').forEach((img,index)=>{
    img.decoding='async';
    if(!img.closest('#banner')&&index>1)img.loading='lazy';
    if(img.complete&&img.naturalWidth)img.classList.add('is-loaded');
    else img.addEventListener('load',()=>img.classList.add('is-loaded'),{once:true});
  });
}
function enhanceRenderedContent(){
  const games=$('#games');if(!games)return;
  enhanceImages(games);
  games.querySelectorAll('a[href],button').forEach(el=>{if(!el.getAttribute('aria-label')&&!el.textContent.trim())el.setAttribute('aria-label','Abrir conteúdo')});
}
function installSearchClear(){
  const wrap=search?.closest('.search-wrap');if(!wrap||$('#clearSearch'))return;
  const button=document.createElement('button');button.id='clearSearch';button.className='clear-search';button.type='button';button.textContent='×';button.setAttribute('aria-label','Limpar busca');
  button.onclick=()=>{search.value='';search.dispatchEvent(new Event('input',{bubbles:true}));search.focus()};wrap.appendChild(button);
  const paint=()=>button.hidden=!search.value;search.addEventListener('input',paint);paint();
}
function installObserver(){
  const games=$('#games');if(!games)return;
  let pending=false;
  new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;enhanceRenderedContent()})}).observe(games,{childList:true,subtree:true});
  enhanceImages(document);
  enhanceRenderedContent();
}
function installModalFocus(){
  document.querySelectorAll('[role="dialog"]').forEach(dialog=>{
    const overlay=dialog.parentElement;
    new MutationObserver(()=>{if(!overlay.hidden){const focusable=dialog.querySelector('button,input,select,a[href]');requestAnimationFrame(()=>focusable?.focus())}}).observe(overlay,{attributes:true,attributeFilter:['hidden']});
    dialog.addEventListener('keydown',event=>{
      if(event.key!=='Tab')return;const list=[...dialog.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),a[href]')].filter(x=>x.offsetParent!==null);if(!list.length)return;
      const first=list[0],last=list.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
    });
  });
}
function installUpdateNotice(){
  if(!('serviceWorker'in navigator))return;
  navigator.serviceWorker.ready.then(reg=>{
    reg.update().catch(()=>{});
    reg.addEventListener('updatefound',()=>{const worker=reg.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)paintStatus('Nova versão pronta; atualize a página')})});
  }).catch(()=>{});
}
window.addEventListener('jogahub:viewchange',()=>{if(!restoringHistory)updateUrl('push');setTimeout(enhanceRenderedContent,0)});
window.addEventListener('jogahub:drivesync',event=>{
  const d=event.detail||{};
  let message=!d.success?'Falha ao atualizar o Drive':d.added?d.added+' novo(s) item(ns)':d.removed?d.removed+' item(ns) removido(s)':d.duplicates?d.duplicates+' duplicado(s) ocultado(s)':'Catálogo conferido';
  paintStatus(message);setTimeout(enhanceRenderedContent,0);
});
window.addEventListener('online',()=>paintStatus('Conexão restaurada'));
window.addEventListener('offline',()=>paintStatus('Alguns recursos online ficam indisponíveis'));
window.addEventListener('popstate',()=>{const params=new URLSearchParams(location.search);const view=params.get('view')||'todos';if(search)search.value=params.get('q')||'';if(typeof setView==='function'){restoringHistory=true;setView(view,{noScroll:true});restoringHistory=false}});
search?.addEventListener('input',()=>{clearTimeout(searchTimer);searchTimer=setTimeout(()=>updateUrl('replace'),180)});
window.addEventListener('scroll',()=>topButton?.classList.toggle('show',scrollY>650),{passive:true});
topButton?.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

installSearchClear();installObserver();installModalFocus();installUpdateNotice();paintStatus();
document.documentElement.classList.add('jh-enhanced');
})();
