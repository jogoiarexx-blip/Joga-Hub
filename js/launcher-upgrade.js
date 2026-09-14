/* JogaHub 1.2.25 — camada de home streaming/game launcher */
(() => {
  const esc = v => typeof escapeHTML === 'function' ? escapeHTML(v ?? '') : String(v ?? '').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const itemHrefSafe = item => typeof itemHref === 'function' ? itemHref(item) : (item.url || item.path || '#');
  const itemAttrsSafe = item => typeof itemLinkAttrs === 'function' ? itemLinkAttrs(item) : '';
  const viewItems = type => typeof itemsForView === 'function' ? itemsForView(type) : [];
  const favs = () => typeof loadFavorites === 'function' ? loadFavorites() : new Set();
  const gameMeta = item => (typeof GAME_CATEGORIES !== 'undefined' && GAME_CATEGORIES[item?.category || 'outros']) || {label:'Jogo',icon:'🎮',order:99};
  const progressFor = item => { try { return typeof movieProgress === 'function' ? movieProgress(item) : null; } catch { return null; } };
  const ratingFor = item => { try { return typeof imdbRating === 'function' ? imdbRating(item) : 0; } catch { return 0; } };

  function tile(item,label='Abrir'){
    const p=progressFor(item); const media=item.type==='filme'; const title=item.seriesTitle||item.title||'Conteúdo';
    const pct=p?.duration ? Math.max(0,Math.min(100,Math.round((p.time/p.duration)*100))) : 0;
    return `<a class="home-tile launcher-home-tile" href="${esc(itemHrefSafe(item))}"${itemAttrsSafe(item)}><div class="home-tile-art">${item.thumb?`<img src="${esc(item.thumb)}" alt="${esc(title)}" loading="lazy">`:`<span>${media?'🎬':'🎮'}</span>`}<i>${media?'▶':'🎮'}</i>${pct?`<b style="width:${pct}%"></b>`:''}</div><small>${esc(label)}</small><strong>${esc(title)}</strong>${ratingFor(item)?`<em>⭐ IMDb ${ratingFor(item).toFixed(1)}</em>`:''}</a>`;
  }

  function row(title,desc,items,label){
    if(!items.length) return '';
    return `<section class="home-row launcher-row"><div class="home-row-head"><div><h2>${title}</h2><p>${desc}</p></div><a class="launcher-inline-link" href="#games">ver tudo</a></div><div class="home-track">${items.map(i=>tile(i,label)).join('')}</div></section>`;
  }

  function render(){
    if(typeof activeType!=='undefined' && activeType!=='todos') return;
    const box=document.getElementById('homeDashboard'); if(!box) return;
    const games=viewItems('jogo'); const films=viewItems('filme'); const series=viewItems('serie'); const anime=viewItems('anime');
    const media=[...films,...series,...anime]; const favoriteSet=favs();
    const favorites=(typeof ITEMS!=='undefined'?ITEMS:[]).filter(i=>favoriteSet.has(i.id)).slice(0,10);
    const continuing=media.filter(i=>progressFor(i)).slice(0,8);
    const rated=[...media].sort((a,b)=>ratingFor(b)-ratingFor(a)).filter(i=>ratingFor(i)>0).slice(0,12);
    const featuredGames=games.slice(0,8); const heroGame=featuredGames[0]||games[0];
    const catMap=new Map(); games.forEach(i=>{const k=i.category||'outros'; if(!catMap.has(k))catMap.set(k,[]); catMap.get(k).push(i)});
    const cats=[...catMap.entries()].map(([key,items])=>({key,items,meta:gameMeta({category:key})})).sort((a,b)=>b.items.length-a.items.length || (a.meta.order||99)-(b.meta.order||99)).slice(0,8);
    const genreGrid=cats.map(g=>`<button class="launcher-genre-card" type="button" data-launch-view="jogo" data-launch-filter="${esc(g.key)}"><strong><span>${g.meta.icon}</span>${esc(g.meta.label)}</strong><small>${g.items.length} ${g.items.length===1?'jogo':'jogos'}</small></button>`).join('');
    const spotlight=featuredGames.slice(0,4).map(i=>`<a class="launcher-feature-card" href="${esc(itemHrefSafe(i))}"${itemAttrsSafe(i)}><div class="launcher-feature-art">${i.thumb?`<img src="${esc(i.thumb)}" alt="${esc(i.title)}" loading="lazy">`:''}</div><div class="launcher-feature-copy"><small>${esc(gameMeta(i).label)}</small><strong>${esc(i.title)}</strong><span>${esc(i.desc||'Abrir agora no navegador.')}</span></div></a>`).join('');

    box.innerHTML=`<section class="launcher-hero-panel premium-welcome"><div class="launcher-hero-copy"><span class="eyebrow">JogaHub 1.2.25</span><h2>Seu <em>streaming + game launcher</em> em um só lugar.</h2><p>Continue de onde parou, explore jogos por categoria e abra filmes, séries e animes com menos cliques.</p><div class="launcher-actions"><button type="button" data-launch-view="jogo">🎮 Explorar jogos</button><button type="button" data-launch-view="serie">📺 Abrir séries</button><button type="button" data-launch-view="filme">🎬 Ver filmes</button><button type="button" data-launch-view="anime">🍥 Ir para animes</button></div><div class="launcher-stats"><span><b>${games.length}</b><small>jogos</small></span><span><b>${films.length}</b><small>filmes</small></span><span><b>${series.length}</b><small>séries</small></span><span><b>${favorites.length}</b><small>favoritos</small></span></div></div><div class="launcher-side-panels"><div class="launcher-side-card launcher-highlight-card"><small class="launcher-card-eyebrow">destaque gamer</small>${heroGame?`<strong>${esc(heroGame.title)}</strong><p>${esc(heroGame.desc||'Abra e jogue agora mesmo pelo navegador.')}</p><a class="launcher-card-cta" href="${esc(itemHrefSafe(heroGame))}"${itemAttrsSafe(heroGame)}>▶ jogar agora</a>`:'<strong>Biblioteca pronta</strong><p>Seu conteúdo está organizado para acesso rápido.</p>'}</div><div class="launcher-side-card launcher-mini-grid"><button type="button" data-launch-view="todos"><strong>⌂ Início</strong><small>home</small></button><button type="button" data-launch-view="jogo"><strong>🔥 Biblioteca</strong><small>todos os jogos</small></button><button type="button" data-launch-view="filme"><strong>🎞️ Catálogo</strong><small>filmes</small></button><button type="button" data-launch-view="radio"><strong>📻 Áudio</strong><small>rádios online</small></button></div></div></section><section class="launcher-strip-section"><div class="home-row-head"><div><h2>Explorar por categoria</h2><p>Atalhos para navegar pela biblioteca de jogos.</p></div></div><div class="launcher-genre-grid">${genreGrid}</div></section><section class="launcher-strip-section"><div class="home-row-head"><div><h2>Destaques do launcher</h2><p>Jogos em evidência para acesso rápido.</p></div></div><div class="launcher-feature-grid">${spotlight}</div></section>${row('▶ Continue assistindo','Retome rapidamente filmes, séries e animes.',continuing,'Continuar')}${row('♥ Minha Lista','Seus favoritos sempre por perto.',favorites,'Favorito')}${row('🎮 Jogos em destaque','Seleção rápida do launcher.',featuredGames,'Jogar')}${row('🍿 Melhores do catálogo','Conteúdos priorizados pela avaliação IMDb.',rated,'Assistir')}${row('📺 Séries para maratonar','Séries organizadas para abrir mais rápido.',series.slice(0,14),'Assistir')}${row('🍥 Animes','Acesso rápido aos animes do app.',anime.slice(0,14),'Assistir')}`;
    box.hidden=false;
  }

  function go(view,filter){
    if(typeof setView==='function') setView(view||'todos');
    if(filter){ setTimeout(()=>{ const btn=[...document.querySelectorAll('#filters .filter-btn')].find(x=>x.dataset.genre===filter); if(btn){document.querySelectorAll('#filters .filter-btn').forEach(x=>x.classList.remove('active'));btn.classList.add('active');if(typeof applyFilters==='function')applyFilters();document.querySelector('.controls')?.scrollIntoView({behavior:'smooth',block:'start'});}},0); }
    if((view||'todos')==='todos') setTimeout(render,0);
  }

  document.addEventListener('DOMContentLoaded',()=>setTimeout(render,0));
  document.addEventListener('click',e=>{const b=e.target.closest('[data-launch-view]');if(b){e.preventDefault();go(b.dataset.launchView,b.dataset.launchFilter||'');return}const nav=e.target.closest('[data-view],.type-btn');if(nav){const v=nav.dataset.view||nav.dataset.type;if(v==='todos')setTimeout(render,0);}});
  window.addEventListener('pageshow',()=>setTimeout(render,0));
  window.JogaHubLauncher={render};
})();
