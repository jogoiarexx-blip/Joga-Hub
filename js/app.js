/* JOGAHUB — home, busca, favoritos e progresso de leitura */

const TYPES = {
  jogo:  { label: 'Jogos',  action: 'jogar', icon: '🎮', singular: 'jogo' },
  filme: { label: 'Filmes Antigos', action: 'assistir', icon: '🎞️', singular: 'filme' }
};
const TYPE_ORDER = ['jogo', 'filme'];
const GAME_CATEGORIES = {
  arcade: {label:'Arcade', icon:'🕹️', order:1},
  acao: {label:'Ação', icon:'💥', order:2},
  corrida: {label:'Corrida', icon:'🏁', order:3},
  estrategia: {label:'Estratégia', icon:'🛡️', order:4},
  survival: {label:'Survival', icon:'☣️', order:5},
  cartas: {label:'Cartas', icon:'🃏', order:6},
  rpg: {label:'RPG & Aventura', icon:'⚔️', order:7},
  plataforma: {label:'Plataforma', icon:'🧗', order:8},
  'shoot-em-up': {label:'Shoot ’em up', icon:'🚀', order:9},
  'simulação': {label:'Simulação', icon:'🔧', order:10},
  outros: {label:'Outros', icon:'🎮', order:99}
};
const ITEMS = [
  ...JOGOS,
  ...(typeof LINK_ITEMS !== 'undefined' ? LINK_ITEMS : []),
  ...(typeof FILMES !== 'undefined' ? FILMES : [])
].filter(item => item.id !== 'exemplo');
const FAVORITES_KEY = 'jogahub.favorites';
const OFFLINE_KEY = 'jogahub.offline.';
const CURRENT_SHELL_CACHE = 'jogahub-1.3.0';
const CURRENT_CONTENT_CACHE = 'jogahub-1.3.0-content';
let deferredInstallPrompt = null;
let activeType = 'todos';

function escapeHTML(value='') {
  return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
}

function isExternalItem(item){
  return !!item?.url && /^https?:\/\//i.test(item.url);
}
function itemHref(item){
  if(item.type === 'filme' && item.archiveId){
    const url = `https://archive.org/embed/${encodeURIComponent(item.archiveId)}`;
    const source = item.sourceUrl || `https://archive.org/details/${encodeURIComponent(item.archiveId)}`;
    return `link-player.html?url=${encodeURIComponent(url)}&external=${encodeURIComponent(source)}&title=${encodeURIComponent(item.title || '')}&type=filme`;
  }
  if(isExternalItem(item)){
    if(item.embed === true){
      return `link-player.html?url=${encodeURIComponent(item.url)}&title=${encodeURIComponent(item.title || '')}`;
    }
    return item.url;
  }
  return item.path || '#';
}
function itemLinkAttrs(item){
  if(item.type === 'filme' && item.archiveId) return '';
  return isExternalItem(item) && item.embed !== true ? ' target="_blank" rel="noopener noreferrer"' : '';
}
function installGameHref(item){
  return `install-game.html?url=${encodeURIComponent(item.url || '')}&title=${encodeURIComponent(item.title || 'Jogo')}`;
}

function loadFavorites(){
  try { return new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')); }
  catch { return new Set(); }
}
function saveFavorites(set){ localStorage.setItem(FAVORITES_KEY, JSON.stringify([...set])); }
function renderFeatured(){
  const onlineGames = ITEMS.filter(item => item.type === 'jogo' && isExternalItem(item));
  const item = onlineGames[0] || ITEMS[0] || null;
  const totalGames = ITEMS.filter(item => item.type === 'jogo').length;
  const featuredTag = document.getElementById('featuredTag');
  if(featuredTag) featuredTag.textContent = onlineGames.length ? 'jogo em destaque' : 'central gamer';
  document.getElementById('featuredTitle').textContent = 'JogaHub';
  document.getElementById('featuredDesc').textContent = `Uma home 100% focada em games para abrir e organizar seus jogos por links. ${totalGames} ${totalGames === 1 ? 'jogo disponível' : 'jogos disponíveis'} no catálogo.`;
  document.getElementById('featuredAction').textContent = item ? `jogar ${item.title} →` : 'explorar jogos →';
  const link = document.getElementById('featuredLink');
  if(item){
    link.href = itemHref(item);
    if(isExternalItem(item) && item.embed !== true){ link.target='_blank'; link.rel='noopener noreferrer'; }
    else { link.removeAttribute('target'); link.removeAttribute('rel'); }
  } else {
    link.href = '#games';
    link.removeAttribute('target');
    link.removeAttribute('rel');
  }
  const img = document.getElementById('featuredImg');
  img.hidden = true;
}
function cardHTML(item){
  const meta = TYPES[item.type] || TYPES.jogo;
  const favorites = loadFavorites();
  const isFav = favorites.has(item.id);
  const thumb = item.thumb
    ? `<div class="card-thumb"><img src="${escapeHTML(item.thumb)}" alt="Capa de ${escapeHTML(item.title)}" loading="lazy"></div>`
    : `<div class="card-thumb card-thumb-placeholder"><span>${meta.icon}</span></div>`;
  const onlineBadge = (isExternalItem(item) || item.archiveId) ? `<span class="online-badge">🌐 online</span>` : '';
  const yearBadge = item.year ? `<span class="year-badge">${escapeHTML(item.year)}</span>` : '';
  const progressHTML = '';
  return `
    <article class="card" style="--accent:${item.accent}" data-id="${escapeHTML(item.id)}">
      <button class="favorite-btn${isFav?' active':''}" type="button" data-favorite="${escapeHTML(item.id)}" aria-label="${isFav?'Remover dos':'Adicionar aos'} favoritos" aria-pressed="${isFav}">♥</button>
      <a class="card-main" href="${escapeHTML(itemHref(item))}"${itemLinkAttrs(item)}>
        ${thumb}
        <div class="card-tags"><span class="tag"><span class="tag-icon">${meta.icon}</span>${escapeHTML(item.genre)}</span>${yearBadge}${onlineBadge}</div>
        <h2>${escapeHTML(item.title)}</h2>
        <p>${escapeHTML(item.desc)}</p>
        
        <span class="play">▶ ${(isExternalItem(item) || item.archiveId) ? meta.action + ' online' : meta.action}</span>
      </a>
      <div class="card-extra-actions">
        ${isExternalItem(item) && item.installable === true ? `<a class="install-game-btn" href="${escapeHTML(installGameHref(item))}" aria-label="Instalar ${escapeHTML(item.title)}">📲 instalar jogo</a>` : ''}
        ${OFFLINE_ASSETS[item.id] ? `<button class="download-btn${localStorage.getItem(OFFLINE_KEY+item.id)==='1'?' downloaded':''}" type="button" data-download="${escapeHTML(item.id)}">${localStorage.getItem(OFFLINE_KEY+item.id)==='1'?'✓ offline':'⬇ baixar'}</button>` : ''}
      </div>
    </article>`;
}
function renderItems(list){
  const grid = document.getElementById('games');
  const empty = document.getElementById('emptyState');
  const meta = document.getElementById('resultsMeta');
  if(activeType === 'jogo'){
    const groups = new Map();
    list.forEach(item => {
      const key = item.category || 'outros';
      if(!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    });
    const ordered = [...groups.entries()].sort((a,b) => (GAME_CATEGORIES[a[0]]?.order||99)-(GAME_CATEGORIES[b[0]]?.order||99));
    grid.innerHTML = ordered.map(([key,items]) => {
      const c = GAME_CATEGORIES[key] || GAME_CATEGORIES.outros;
      return `<section class="game-category" data-category="${escapeHTML(key)}">
        <div class="game-category-head"><div><span class="game-category-icon">${c.icon}</span><h2>${escapeHTML(c.label)}</h2></div><span>${items.length} ${items.length===1?'jogo':'jogos'}</span></div>
        <div class="game-category-grid">${items.map(cardHTML).join('')}</div>
      </section>`;
    }).join('');
  } else {
    grid.innerHTML = `<div class="main-grid">${list.map(cardHTML).join('')}</div>`;
  }
  empty.style.display = list.length ? 'none' : 'block';
  const typeMeta = TYPES[activeType] || TYPES.jogo;
  meta.textContent = list.length ? `${list.length} ${list.length === 1 ? typeMeta.singular + ' encontrado' : typeMeta.label.toLowerCase() + ' encontrados'}` : '';
}
function renderTypeTabs(){
  const tabsEl = document.getElementById('typeTabs');
  if(!tabsEl) return;
  tabsEl.innerHTML = TYPE_ORDER.filter(type => ITEMS.some(item => item.type === type)).map(type => {
    const meta = TYPES[type];
    const count = ITEMS.filter(item => item.type === type).length;
    return `<button class="type-btn${type === activeType ? ' active' : ''}" data-type="${escapeHTML(type)}" type="button" aria-pressed="${type === activeType}">${meta.icon} ${escapeHTML(meta.label)} <span>${count}</span></button>`;
  }).join('');
}
function renderGenreFilters(){
  const pool = activeType === 'todos' ? ITEMS : ITEMS.filter(i => i.type === activeType);
  if(activeType === 'jogo'){
    const categories = [...new Set(pool.map(i => i.category || 'outros'))]
      .sort((a,b)=>(GAME_CATEGORIES[a]?.order||99)-(GAME_CATEGORIES[b]?.order||99));
    document.getElementById('filters').innerHTML = ['todos', ...categories].map((g,i) => {
      const c = g === 'todos' ? {label:'Todos os jogos',icon:'🎮'} : (GAME_CATEGORIES[g] || GAME_CATEGORIES.outros);
      return `<button class="filter-btn${i===0?' active':''}" data-genre="${escapeHTML(g)}" type="button">${c.icon} ${escapeHTML(c.label)}</button>`;
    }).join('');
    return;
  }
  const genres = ['todos', ...new Set(pool.map(i => i.genre))];
  document.getElementById('filters').innerHTML = genres.map((g,i) =>
    `<button class="filter-btn${i===0?' active':''}" data-genre="${escapeHTML(g)}" type="button">${escapeHTML(g)}</button>`
  ).join('');
}
function sortByTypeOrder(list){
  const favorites = loadFavorites();
  return [...list].sort((a,b) => {
    const favDiff = Number(favorites.has(b.id)) - Number(favorites.has(a.id));
    if(favDiff) return favDiff;
    return TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type);
  });
}
function normalize(text=''){
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
}
function applyFilters(){
  const term = normalize(document.getElementById('search').value.trim());
  const activeBtn = document.querySelector('.filter-btn.active');
  const genre = activeBtn ? activeBtn.dataset.genre : 'todos';
  const filtered = ITEMS.filter(i => {
    const searchable = normalize([i.title, i.desc, i.genre, i.category, i.type, TYPES[i.type]?.label, GAME_CATEGORIES[i.category]?.label].join(' '));
    return (activeType === 'todos' || i.type === activeType)
      && (genre === 'todos' || (activeType === 'jogo' ? (i.category || 'outros') === genre : i.genre === genre))
      && (!term || searchable.includes(term));
  });
  renderItems(sortByTypeOrder(filtered));
  const movieNotice = document.getElementById('movieNotice');
  if(movieNotice) movieNotice.hidden = activeType !== 'filme';
  const search = document.getElementById('search');
  if(search) search.placeholder = activeType === 'filme'
    ? 'buscar filme por título, ano ou gênero...'
    : 'buscar jogo por título, gênero ou descrição...';
  const empty = document.getElementById('emptyState');
  if(empty) empty.textContent = activeType === 'filme'
    ? 'nenhum filme encontrado com esse filtro.'
    : 'nenhum jogo encontrado com esse filtro.';
}
function toggleFavorite(id, button){
  const favorites = loadFavorites();
  favorites.has(id) ? favorites.delete(id) : favorites.add(id);
  saveFavorites(favorites);
  const isFav = favorites.has(id);
  button.classList.toggle('active', isFav);
  button.setAttribute('aria-pressed', String(isFav));
  button.setAttribute('aria-label', `${isFav?'Remover dos':'Adicionar aos'} favoritos`);
  applyFilters();
}

function downloadOffline(id, btn){
  if(!('serviceWorker' in navigator) || !OFFLINE_ASSETS[id]){
    alert('O download offline precisa ser usado pelo site publicado em HTTPS.');
    return;
  }
  const downloaded = localStorage.getItem(OFFLINE_KEY + id) === '1';
  navigator.serviceWorker.ready.then(reg => {
    const sw = reg.active || navigator.serviceWorker.controller;
    if(!sw) return;
    btn.disabled = true;
    btn.textContent = downloaded ? 'removendo...' : 'baixando...';
    sw.postMessage({type: downloaded ? 'REMOVE' : 'DOWNLOAD', id, urls: OFFLINE_ASSETS[id]});
  });
}

if('serviceWorker' in navigator){
  window.addEventListener('load', async () => {
    try {
      // limpa caches da versão que causou o problema no GitHub Pages
      const names = await caches.keys();
      await Promise.all(names.filter(n => (n.startsWith('nexora-') || n.startsWith('linkora-') || n.startsWith('jogahub-')) && n !== CURRENT_SHELL_CACHE && n !== CURRENT_CONTENT_CACHE).map(n => caches.delete(n)));
      await navigator.serviceWorker.register('./sw.js', {updateViaCache:'none'});
    } catch(err){ console.warn('PWA:', err); }
  });
}
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredInstallPrompt = e;
  const b = document.getElementById('installApp');
  if(b) b.hidden = false;
});
window.addEventListener('appinstalled', () => {
  const b = document.getElementById('installApp');
  if(b) b.hidden = true;
  deferredInstallPrompt = null;
});

document.addEventListener('DOMContentLoaded', () => {
  activeType = 'jogo';
  renderFeatured();
  const continueSection = document.getElementById('continueSection');
  if(continueSection) continueSection.hidden = true;
  renderTypeTabs();
  renderGenreFilters();
  applyFilters();
  const installBtn = document.getElementById('installApp');
  installBtn?.addEventListener('click', async () => {
    if(!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    installBtn.hidden = true;
  });
  navigator.serviceWorker?.addEventListener('message', e => {
    const d = e.data || {};
    const btn = document.querySelector(`[data-download="${d.id}"]`);
    if(d.type === 'PROGRESS' && btn) btn.textContent = `${Math.round(d.done/d.total*100)}%`;
    if(d.type === 'DOWNLOADED'){
      localStorage.setItem(OFFLINE_KEY+d.id,'1');
      if(btn){ btn.disabled=false; btn.classList.add('downloaded'); btn.textContent='✓ offline'; }
    }
    if(d.type === 'REMOVED'){
      localStorage.removeItem(OFFLINE_KEY+d.id);
      if(btn){ btn.disabled=false; btn.classList.remove('downloaded'); btn.textContent='⬇ baixar'; }
    }
    if(d.type === 'DOWNLOAD_ERROR'){
      if(btn){ btn.disabled=false; btn.textContent='tentar de novo'; }
      alert('Não foi possível concluir o download. Verifique a internet e tente novamente.');
    }
  });
  document.getElementById('search').addEventListener('input', applyFilters);
  document.getElementById('typeTabs').addEventListener('click', e => {
    const btn=e.target.closest('.type-btn'); if(!btn) return;
    activeType=btn.dataset.type;
    document.querySelectorAll('.type-btn').forEach(b=>{const on=b===btn;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});
    renderGenreFilters(); applyFilters();
  });
  document.getElementById('filters').addEventListener('click', e => {
    const btn=e.target.closest('.filter-btn'); if(!btn) return;
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); applyFilters();
  });
  document.getElementById('games').addEventListener('click', e => {
    const dl = e.target.closest('[data-download]');
    if(dl){ e.preventDefault(); e.stopPropagation(); downloadOffline(dl.dataset.download, dl); return; }
    const btn=e.target.closest('[data-favorite]'); if(!btn) return;
    e.preventDefault(); e.stopPropagation(); toggleFavorite(btn.dataset.favorite, btn);
  });
  window.addEventListener('pageshow', applyFilters);
});
