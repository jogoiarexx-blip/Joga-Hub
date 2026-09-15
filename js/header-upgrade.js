/* JogaHub 1.2.31 — integração do cabeçalho com a busca do catálogo */
(() => {
  function buildHeaderSearch(){
    const topbar=document.querySelector('.topbar');
    const actions=document.querySelector('.header-actions');
    if(!topbar||!actions||document.querySelector('.header-search-shell'))return;
    const shell=document.createElement('div');
    shell.className='header-search-shell';
    shell.innerHTML=`<button class="header-global-search" type="button" aria-label="Buscar no JogaHub"><span class="search-icon">⌕</span><span class="search-copy">Buscar jogos, filmes, séries, animes...</span><span class="search-shortcut">Ctrl K</span></button>`;
    topbar.insertBefore(shell,actions);
    shell.querySelector('.header-global-search')?.addEventListener('click',()=>{
      const search=document.getElementById('search');
      if(!search)return;
      search.focus();search.select();
      (search.closest('.controls')||search).scrollIntoView({behavior:'smooth',block:'center'});
    });
  }
  function syncHeaderSearchText(){
    const copy=document.querySelector('.header-global-search .search-copy');
    const search=document.getElementById('search');
    if(!copy||!search)return;
    copy.textContent=search.value.trim()||search.placeholder||'Buscar no JogaHub...';
  }
  document.addEventListener('DOMContentLoaded',()=>{buildHeaderSearch();syncHeaderSearchText();document.getElementById('search')?.addEventListener('input',syncHeaderSearchText);});
  window.addEventListener('pageshow',()=>setTimeout(syncHeaderSearchText,0));
})();