/* JOGAHUB — home, busca, favoritos e progresso de leitura */

const TYPES = {
  jogo:  { label: 'Jogos',  action: 'jogar', icon: '🎮', singular: 'jogo' },
  filme: { label: 'Filmes Antigos', action: 'assistir', icon: '🎞️', singular: 'filme' }
};
const TYPE_ORDER = ['todos', 'jogo', 'filme'];
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
const CURRENT_SHELL_CACHE = 'jogahub-1.0.24';
const CURRENT_CONTENT_CACHE = 'jogahub-1.0.24-content';
let deferredInstallPrompt = null;
let activeType = 'todos';

const MEDIA_CACHE = 'jogahub-offline-media-v1';
const MEDIA_REGISTRY_KEY = 'jogahub.offline.media.registry';
function loadMediaRegistry(){try{return JSON.parse(localStorage.getItem(MEDIA_REGISTRY_KEY)||'{}')}catch{return {}}}
function saveMediaRegistry(v){localStorage.setItem(MEDIA_REGISTRY_KEY,JSON.stringify(v))}
function formatBytes(n){n=Number(n)||0;if(!n)return 'tamanho desconhecido';const u=['B','KB','MB','GB'];let i=0;while(n>=1024&&i<u.length-1){n/=1024;i++}return `${n>=10||i===0?n.toFixed(0):n.toFixed(1)} ${u[i]}`}
async function showDownloads(){
  const modal=document.getElementById('downloadsModal'),list=document.getElementById('downloadsList'),storage=document.getElementById('downloadsStorage');if(!modal||!list)return;
  const reg=loadMediaRegistry(),entries=Object.values(reg).sort((a,b)=>(b.savedAt||0)-(a.savedAt||0));
  list.innerHTML=entries.length?entries.map(x=>`<article class="download-item"><img src="${escapeHTML(x.thumb||'assets/icon-512.png')}" alt=""><div class="download-copy"><b>${escapeHTML(x.title||'Vídeo offline')}</b><span>${escapeHTML([x.year,x.genre,formatBytes(x.size)].filter(Boolean).join(' • '))}</span><span class="download-status">✓ disponível offline</span></div><div class="download-actions"><a href="${escapeHTML(x.playerHref||'#')}">▶ assistir</a><button type="button" data-remove-media="${escapeHTML(x.id)}">remover</button></div></article>`).join(''):'<div class="download-empty">Nenhum vídeo salvo ainda.<br>Abra um filme compatível e toque em <b>⬇ Baixar offline</b>.</div>';
  try{const e=await navigator.storage?.estimate?.();storage.textContent=e?.quota?`Armazenamento do navegador: ${formatBytes(e.usage)} usados de aproximadamente ${formatBytes(e.quota)}.`:'Os downloads ficam salvos somente neste aparelho.'}catch{storage.textContent='Os downloads ficam salvos somente neste aparelho.'}
  modal.hidden=false;
}
async function removeMediaDownload(id){const reg=loadMediaRegistry(),x=reg[id];if(!x)return;try{const c=await caches.open(MEDIA_CACHE);if(x.url)await c.delete(x.url)}catch{}delete reg[id];saveMediaRegistry(reg);showDownloads()}


function escapeHTML(value='') {
  return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
}

function isExternalItem(item){
  return !!item?.url && /^https?:\/\//i.test(item.url);
}
function isCatalogExternal(item){
  return item?.type === 'filme' && item?.catalogOnly === true && /^https?:\/\//i.test(item.sourceUrl || '');
}

function itemHref(item){
  if(isCatalogExternal(item)) return item.sourceUrl;
  if(item.type === 'filme' && item.youtubePlaylistId){
    const url = `https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(item.youtubePlaylistId)}`;
    const source = item.sourceUrl || `https://www.youtube.com/playlist?list=${encodeURIComponent(item.youtubePlaylistId)}`;
    return `link-player.html?url=${encodeURIComponent(url)}&external=${encodeURIComponent(source)}&title=${encodeURIComponent(item.title || '')}&type=filme&provider=youtube&playlistId=${encodeURIComponent(item.youtubePlaylistId)}&id=${encodeURIComponent(item.id || '')}`;
  }
  if(item.type === 'filme' && item.youtubeId){
    const start = Number(item.startSeconds)||0;
    const url = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(item.youtubeId)}${start?`?start=${start}`:''}`;
    const source = item.sourceUrl || `https://www.youtube.com/watch?v=${encodeURIComponent(item.youtubeId)}${start?`&t=${start}s`:''}`;
    return `link-player.html?url=${encodeURIComponent(url)}&external=${encodeURIComponent(source)}&title=${encodeURIComponent(item.title || '')}&type=filme&provider=youtube&youtubeId=${encodeURIComponent(item.youtubeId)}&start=${start}&id=${encodeURIComponent(item.id || '')}`;
  }
  if(item.type === 'filme' && item.archiveId){
    const url = `https://archive.org/embed/${encodeURIComponent(item.archiveId)}`;
    const source = item.sourceUrl || `https://archive.org/details/${encodeURIComponent(item.archiveId)}`;
    return `link-player.html?url=${encodeURIComponent(url)}&external=${encodeURIComponent(source)}&title=${encodeURIComponent(item.title || '')}&type=filme&archiveId=${encodeURIComponent(item.archiveId)}&id=${encodeURIComponent(item.id || '')}`;
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
  if(item.type === 'filme' && (item.archiveId || item.youtubePlaylistId || item.youtubeId)) return '';
  return (isCatalogExternal(item) || (isExternalItem(item) && item.embed !== true)) ? ' target="_blank" rel="noopener noreferrer"' : '';
}
function movieActionLabel(item){
  return isCatalogExternal(item) ? 'Onde assistir' : 'Assistir';
}

function installGameHref(item){
  return `install-game.html?url=${encodeURIComponent(item.url || '')}&title=${encodeURIComponent(item.title || 'Jogo')}`;
}

function loadFavorites(){
  try { return new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')); }
  catch { return new Set(); }
}
function saveFavorites(set){ localStorage.setItem(FAVORITES_KEY, JSON.stringify([...set])); }
function itemDecade(item){
  const y=Number(item.year); if(!y) return '';
  if(y<1980) return '70-';
  if(y<1990) return '80';
  if(y<2000) return '90';
  if(y<2010) return '2000';
  return '2010+';
}
function homeTile(item, label=''){
  const p=movieProgress(item), state=item.type==='filme'?movieWatchState(item):null;
  const meta=item.type==='filme'?(item.seriesTitle||item.title):item.title;
  return `<a class="home-tile" href="${escapeHTML(itemHref(item))}"${itemLinkAttrs(item)}>
    <div class="home-tile-art">${item.thumb?`<img src="${escapeHTML(item.thumb)}" alt="${escapeHTML(meta)}" loading="lazy">`:`<span>${item.type==='filme'?'🎬':'🎮'}</span>`}<i>${item.type==='filme'?(isCatalogExternal(item)?'↗':'▶'):'🎮'}</i>${p?`<b style="width:${Math.round(p.time/p.duration*100)}%"></b>`:''}</div>
    <small>${escapeHTML(label|| (item.type==='filme'?'Assistir':'Jogar'))}</small><strong>${escapeHTML(meta)}</strong>${state?`<em>${escapeHTML(state.label)}</em>`:''}
  </a>`;
}
function renderHomeDashboard(){
  const box=document.getElementById('homeDashboard'); if(!box) return;
  if(activeType!=='todos'){box.hidden=true;box.innerHTML='';return;}
  const games=ITEMS.filter(i=>i.type==='jogo'); const movies=ITEMS.filter(i=>i.type==='filme');
  const continuing=movies.filter(movieProgress).slice(0,8);
  const recentMovies=[...movies].sort((a,b)=>(Number(b.year)||0)-(Number(a.year)||0)).slice(0,10);
  const tv=movies.filter(i=>i.classicTv).slice(0,10);
  const favorites=ITEMS.filter(i=>loadFavorites().has(i.id)).slice(0,10);
  const row=(title,sub,items,label)=>items.length?`<section class="home-row"><div class="home-row-head"><div><h2>${title}</h2><p>${sub}</p></div></div><div class="home-track">${items.map(i=>homeTile(i,label)).join('')}</div></section>`:'';
  box.innerHTML=`<div class="home-welcome"><div><span class="eyebrow">JogaHub v1.0.24</span><h2>Continue de onde parou</h2><p>Jogos, filmes, séries e desenhos reunidos em uma home mais rápida.</p></div><div class="home-stats"><span><b>${games.length}</b> jogos</span><span><b>${movies.length}</b> vídeos</span></div></div>
    ${row('▶ Continue assistindo','Seu progresso salvo aparece aqui.',continuing,'Continuar')}
    ${row('📺 Nostalgia da TV','Clássicos, desenhos e séries que marcaram época.',tv,'Clássico da TV')}
    ${row('🆕 Descobrir agora','Alguns destaques do catálogo para abrir direto.',recentMovies,'Assistir')}
    ${row('♥ Minha Lista','Seus favoritos em acesso rápido.',favorites,'Favorito')}
    ${row('🎮 Continue jogando','Acesso rápido aos jogos do JogaHub.',games.slice(0,10),'Jogar')}`;
  box.hidden=false;
}
function renderFeatured(){
  const games=ITEMS.filter(i=>i.type==='jogo'), movies=ITEMS.filter(i=>i.type==='filme');
  const item=activeType==='filme'?(movies.find(movieProgress)||movies[0]):activeType==='jogo'?games[0]:(movies.find(movieProgress)||games[0]||movies[0]);
  const tag=document.getElementById('featuredTag'),title=document.getElementById('featuredTitle'),desc=document.getElementById('featuredDesc'),action=document.getElementById('featuredAction'),link=document.getElementById('featuredLink');
  if(activeType==='filme'){tag.textContent='filmes & séries';title.textContent=item?.seriesTitle||item?.title||'Filmes & TV';desc.textContent=item?.desc||'Clássicos, desenhos e séries reunidos em uma experiência de streaming.';action.textContent=item?'assistir agora →':'explorar catálogo →';}
  else if(activeType==='jogo'){tag.textContent='jogos';title.textContent='JogaHub Games';desc.textContent=`${games.length} jogos organizados por gênero, favoritos e acesso rápido.`;action.textContent=item?`jogar ${item.title} →`:'explorar jogos →';}
  else{tag.textContent='sua central de entretenimento';title.textContent='JogaHub';desc.textContent=`Jogos, filmes, séries e desenhos em um só lugar. ${games.length} jogos e ${movies.length} conteúdos para assistir.`;action.textContent=item?.type==='filme'?'continuar assistindo →':'começar agora →';}
  if(item){link.href=itemHref(item);if(isCatalogExternal(item)||(isExternalItem(item)&&item.embed!==true)){link.target='_blank';link.rel='noopener noreferrer'}else{link.removeAttribute('target');link.removeAttribute('rel')}}else link.href='#games';
  document.getElementById('featuredImg').hidden=true;
}
function movieProgress(item){
  if(item.type !== 'filme') return null;
  try {
    const key = item.archiveId || item.id;
    const p = JSON.parse(localStorage.getItem(`jogahub.movie.progress.${key}`) || 'null');
    if(!p || !p.duration || p.time < 20 || p.finished || p.time >= p.duration - 20) return null;
    return p;
  } catch { return null; }
}
function formatMovieProgress(p){
  const pct = Math.max(0, Math.min(100, (p.time / p.duration) * 100));
  return `<div class="movie-progress"><span style="width:${pct.toFixed(1)}%"></span></div><small class="movie-progress-label">▶ continuar assistindo · ${Math.round(pct)}%</small>`;
}
function movieWatchState(item){
  try{
    const key=item.archiveId || item.id;
    const p=JSON.parse(localStorage.getItem(`jogahub.movie.progress.${key}`)||'null');
    if(p?.finished) return {label:'✓ assistido', finished:true, pct:100};
    if(p?.duration && p.time>20) return {label:`▶ ${Math.round(p.time/p.duration*100)}%`, finished:false, pct:Math.round(p.time/p.duration*100)};
  }catch{}
  return null;
}
function cardHTML(item){
  const meta = TYPES[item.type] || TYPES.jogo;
  const favorites = loadFavorites();
  const isFav = favorites.has(item.id);
  const thumb = item.thumb
    ? `<div class="card-thumb"><img src="${escapeHTML(item.thumb)}" alt="Capa de ${escapeHTML(item.title)}" loading="lazy"></div>`
    : `<div class="card-thumb card-thumb-placeholder"><span>${meta.icon}</span></div>`;
  const onlineBadge = (isExternalItem(item) || item.archiveId || item.youtubePlaylistId || item.youtubeId) ? `<span class="online-badge">🌐 online</span>` : '';
  const yearBadge = item.year ? `<span class="year-badge">${escapeHTML(item.year)}</span>` : '';
  const progress = movieProgress(item);
  const progressHTML = progress ? formatMovieProgress(progress) : '';
  return `
    <article class="card" style="--accent:${item.accent}" data-id="${escapeHTML(item.id)}">
      <button class="favorite-btn${isFav?' active':''}" type="button" data-favorite="${escapeHTML(item.id)}" aria-label="${isFav?'Remover dos':'Adicionar aos'} favoritos" aria-pressed="${isFav}">♥</button>
      <a class="card-main" href="${escapeHTML(itemHref(item))}"${itemLinkAttrs(item)}>
        ${thumb}
        <div class="card-tags"><span class="tag"><span class="tag-icon">${meta.icon}</span>${escapeHTML(item.genre)}</span>${yearBadge}${onlineBadge}</div>
        <h2>${escapeHTML(item.title)}</h2>
        <p>${escapeHTML(item.desc)}</p>
        ${progressHTML}
        <span class="play">▶ ${(isExternalItem(item) || item.archiveId || item.youtubePlaylistId || item.youtubeId) ? meta.action + ' online' : meta.action}</span>
      </a>
      <div class="card-extra-actions">
        ${isExternalItem(item) && item.installable === true ? `<a class="install-game-btn" href="${escapeHTML(installGameHref(item))}" aria-label="Instalar ${escapeHTML(item.title)}">📲 instalar jogo</a>` : ''}
        ${OFFLINE_ASSETS[item.id] ? `<button class="download-btn${localStorage.getItem(OFFLINE_KEY+item.id)==='1'?' downloaded':''}" type="button" data-download="${escapeHTML(item.id)}">${localStorage.getItem(OFFLINE_KEY+item.id)==='1'?'✓ offline':'⬇ baixar'}</button>` : ''}
      </div>
    </article>`;
}
function movieKindLabel(item){
  if(item.mediaType === 'serie') return item.episode ? `S${item.season || 1}:E${item.episode}` : (item.seasonCount ? `Série • ${item.seasonCount} temporadas` : 'Série');
  if(item.mediaType === 'colecao') return 'Coleção';
  return 'Filme';
}
function movieCardHTML(item, compact=false){
  const favorites = loadFavorites();
  const isFav = favorites.has(item.id);
  const p = movieProgress(item);
  const state = movieWatchState(item);
  const pct = p ? Math.max(0, Math.min(100, (p.time/p.duration)*100)) : 0;
  return `<article class="stream-card${compact?' compact':''}" style="--accent:${item.accent || 'var(--gold)'}" data-id="${escapeHTML(item.id)}">
    <a class="stream-poster" href="${escapeHTML(itemHref(item))}"${itemLinkAttrs(item)} aria-label="${isCatalogExternal(item)?'Onde assistir':'Assistir'} ${escapeHTML(item.title)}">
      <img src="${escapeHTML(item.thumb || '')}" alt="Capa de ${escapeHTML(item.title)}" loading="lazy">
      <span class="stream-play">${isCatalogExternal(item)?'↗':'▶'}</span>
      ${state?`<span class="stream-state${state.finished?' watched':''}">${state.label}</span>`:''}
      ${p?`<span class="stream-progress"><i style="width:${pct.toFixed(1)}%"></i></span>`:''}
    </a>
    <div class="stream-card-copy">
      <div class="stream-card-title"><b>${escapeHTML(item.seriesTitle || item.title)}</b><button class="favorite-btn stream-fav${isFav?' active':''}" type="button" data-favorite="${escapeHTML(item.id)}" aria-label="${isFav?'Remover da':'Adicionar à'} Minha Lista" aria-pressed="${isFav}">♥</button></div>
      <span>${escapeHTML(movieKindLabel(item))}${item.year ? ` • ${escapeHTML(item.year)}` : ''} • ${escapeHTML(item.genre || '')}</span>
      ${item.seriesTitle && item.title !== item.seriesTitle ? `<small>${escapeHTML(item.title)}</small>` : ''}
    </div>
  </article>`;
}
function seriesCardHTML(group){
  const first=group.items[0];
  const catalogOnly=group.items.length===1 && first.catalogOnly;
  const seasons=catalogOnly ? Number(first.seasonCount||0) : [...new Set(group.items.map(i=>i.season||1))].length;
  const episodes=catalogOnly ? Number(first.episodeCount||0) : group.items.length;
  const next=catalogOnly ? first : (group.items.find(i=>!movieWatchState(i)?.finished) || first);
  const watched=catalogOnly ? 0 : group.items.filter(i=>movieWatchState(i)?.finished).length;
  const availability=first.availabilityStatus ? `<small class="series-availability">${escapeHTML(first.availabilityStatus)}</small>` : '';
  return `<article class="stream-card series-summary${catalogOnly?' catalog-only':''}" style="--accent:${first.accent || 'var(--gold)'}">
    <a class="stream-poster" href="${escapeHTML(itemHref(next))}"${itemLinkAttrs(next)} aria-label="${catalogOnly?'Onde assistir':'Abrir'} ${escapeHTML(group.title)}">
      <img src="${escapeHTML(first.thumb || '')}" alt="Capa de ${escapeHTML(group.title)}" loading="lazy"><span class="stream-play">${catalogOnly?'↗':'▶'}</span>
      <span class="series-count">${episodes ? `${episodes} ep.` : 'Série'}</span>
      ${catalogOnly?'<span class="catalog-badge">CATÁLOGO</span>':''}
    </a>
    <div class="stream-card-copy"><div class="stream-card-title"><b>${escapeHTML(group.title)}</b></div><span>${seasons||1} ${(seasons||1)===1?'temporada':'temporadas'}${episodes?` • ${episodes} episódios`:''}</span>${availability}<small>${catalogOnly?'↗ Onde assistir':(watched?`${watched}/${episodes} assistidos`:'Começar série')}</small></div>
  </article>`;
}
function mediaIdentity(item){
  if(item.youtubeId) return `yt:${item.youtubeId}`;
  if(item.youtubePlaylistId) return `ytp:${item.youtubePlaylistId}`;
  if(item.archiveId) return `ia:${item.archiveId}`;
  if(item.directVideoUrl || item.videoUrl || item.localVideoUrl) return `vid:${item.directVideoUrl || item.videoUrl || item.localVideoUrl}`;
  const base=normalize(item.seriesTitle || item.title || item.id).replace(/\b(19|20)\d{2}\b/g,'').replace(/\s+/g,' ').trim();
  return item.mediaType==='serie' ? `series:${base}:s${item.season||1}:e${item.episode||0}` : `${item.mediaType||'item'}:${base}`;
}
function uniqueMedia(list){
  const seen=new Set();
  return list.filter(item=>{const key=mediaIdentity(item);if(seen.has(key))return false;seen.add(key);return true;});
}
function renderMovieHub(list){
  const grid=document.getElementById('games');
  const favorites=loadFavorites();
  const visibleIds=new Set(list.map(i=>i.id));
  const pool=uniqueMedia(ITEMS.filter(i=>i.type==='filme' && visibleIds.has(i.id)));
  const activeGenre=document.querySelector('.filter-btn.active')?.dataset.genre || 'todos';
  const featured=(pool.find(movieProgress) || pool.find(i=>i.jackieChan) || pool[0] || null);
  if(!featured){grid.innerHTML='';return;}

  const heroP=movieProgress(featured); const heroPct=heroP?Math.round(heroP.time/heroP.duration*100):0;
  const used=new Set();
  const take=(items,max=18)=>{
    const out=[];
    for(const item of uniqueMedia(items)){
      const key=mediaIdentity(item);
      if(used.has(key)) continue;
      used.add(key); out.push(item);
      if(out.length>=max) break;
    }
    return out;
  };
  const section=(title,subtitle,items)=> items.length ? `<section class="stream-row"><div class="stream-row-head"><div><h2>${title}</h2>${subtitle?`<p>${subtitle}</p>`:''}</div><span>${items.length}</span></div><div class="stream-track">${items.map(i=>movieCardHTML(i)).join('')}</div></section>` : '';

  let rows='';
  if(activeGenre!=='todos'){
    const results=take(pool,80);
    rows+=section('Resultados',`${results.length} conteúdos sem repetir o mesmo vídeo.`,results);
  }else{
    const continuing=take(pool.filter(movieProgress),14);
    const favs=take(pool.filter(i=>favorites.has(i.id)),14);
    const jackie=take(pool.filter(i=>i.jackieChan),24);
    const classicTv=take(pool.filter(i=>i.classicTv),20);

    rows+=section('Continuar assistindo','Retome exatamente de onde você parou.',continuing);
    rows+=section('Minha Lista','Seus favoritos, sem repetir o que já está acima.',favs);
    rows+=section('🥋 Jackie Chan','Filmes anteriores a 2000 e As Aventuras de Jackie Chan encontrados em fontes reproduzíveis.',jackie);
    rows+=section('📺 Nostalgia da TV','Desenhos, séries e clássicos que ainda não apareceram nas seções anteriores.',classicTv);

    // Séries: um cartão por série. Episódios continuam acessíveis dentro da página/player.
    const remainingSeries=pool.filter(i=>i.mediaType==='serie' && !used.has(mediaIdentity(i)));
    const groups=[]; const groupMap=new Map();
    for(const item of remainingSeries){
      const key=item.seriesId || normalize(item.seriesTitle || item.title);
      if(!groupMap.has(key)){const g={id:key,title:item.seriesTitle||item.title,items:[]};groupMap.set(key,g);groups.push(g);}
      groupMap.get(key).items.push(item);
    }
    if(groups.length){
      groups.forEach(g=>g.items.forEach(i=>used.add(mediaIdentity(i))));
      rows+=`<section class="stream-row"><div class="stream-row-head"><div><h2>Desenhos e séries</h2><p>Uma capa por série; os episódios ficam agrupados no player.</p></div><span>${groups.length}</span></div><div class="stream-track">${groups.map(g=>{g.items.sort((a,b)=>(a.season||1)-(b.season||1)||(a.episode||0)-(b.episode||0));return seriesCardHTML(g)}).join('')}</div></section>`;
    }

    rows+=section('Filmes', 'Longas que ainda não apareceram em nenhuma outra fileira.', take(pool.filter(i=>i.mediaType!=='serie' && i.mediaType!=='colecao'),30));
    rows+=section('Coleções', 'Coleções e playlists reproduzíveis dentro do JogaHub.', take(pool.filter(i=>i.mediaType==='colecao'),20));
    rows+=section('Descobrir mais', 'Conteúdo restante do catálogo, sem duplicações nesta tela.', take(pool,40));
  }

  grid.innerHTML=`<div class="movie-hub">
    <section class="stream-hero" style="--hero-image:url('${escapeHTML(featured.thumb || '')}')">
      <div class="stream-hero-art"></div><div class="stream-hero-shade"></div>
      <div class="stream-hero-copy"><span class="stream-eyebrow">${featured.jackieChan?'🥋 JACKIE CHAN':featured.mediaType==='serie'?'📺 SÉRIE / DESENHO':'🎬 FILME'}</span>
        <h1>${escapeHTML(featured.seriesTitle || featured.title)}</h1>
        <p>${escapeHTML(featured.desc || '')}</p>
        <div class="stream-hero-meta"><span>${escapeHTML(featured.genre||'')}</span>${featured.year?`<span>${escapeHTML(featured.year)}</span>`:''}<span>${escapeHTML(movieKindLabel(featured))}</span></div>
        <div class="stream-hero-actions"><a class="stream-primary" href="${escapeHTML(itemHref(featured))}"${itemLinkAttrs(featured)}>▶ ${heroP?'Continuar '+heroPct+'%':'Assistir agora'}</a><button type="button" class="stream-secondary" data-favorite="${escapeHTML(featured.id)}">♥ Minha Lista</button></div>
      </div>
    </section>
    ${rows}
  </div>`;
}

function renderItems(list){
  const grid = document.getElementById('games');
  if(activeType === 'filme'){
    renderMovieHub(list);
    const empty=document.getElementById('emptyState'),meta=document.getElementById('resultsMeta');
    empty.style.display=list.length?'none':'block';
    meta.textContent=list.length?`${list.length} ${list.length===1?'conteúdo encontrado':'conteúdos encontrados'}`:'';
    return;
  }
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
  const tabsEl=document.getElementById('typeTabs');if(!tabsEl)return;
  const tabs=[['todos','⌂ Início',ITEMS.length],['jogo','🎮 Jogos',ITEMS.filter(i=>i.type==='jogo').length],['filme','🎬 Filmes & TV',ITEMS.filter(i=>i.type==='filme').length],['tv','📺 TV ao Vivo',(typeof LIVE_TV_CHANNELS!=='undefined'?LIVE_TV_CHANNELS.length:0)]];
  tabsEl.innerHTML=tabs.map(([type,label,count])=>`<button class="type-btn${type===activeType?' active':''}" data-type="${type}" type="button" aria-pressed="${type===activeType}">${label} <span>${count}</span></button>`).join('');
}

function getYouTubeApiKey(){
  return localStorage.getItem('jogahub_youtube_api_key') || '';
}
function saveYouTubeApiKey(key){
  const clean=(key||'').trim();
  if(clean) localStorage.setItem('jogahub_youtube_api_key', clean);
  else localStorage.removeItem('jogahub_youtube_api_key');
  return clean;
}
async function youtubeApi(path, params={}){
  const key=getYouTubeApiKey();
  if(!key) throw new Error('API_KEY_MISSING');
  const u=new URL(`https://www.googleapis.com/youtube/v3/${path}`);
  Object.entries({...params,key}).forEach(([k,v])=>u.searchParams.set(k,v));
  const r=await fetch(u.toString(), {cache:'no-store'});
  if(!r.ok){
    let detail=''; try{ const j=await r.json(); detail=j?.error?.message||''; }catch(_){}
    throw new Error(`YouTube API ${r.status}${detail?': '+detail:''}`);
  }
  return r.json();
}
async function resolveYouTubeChannelId(seedVideoId){
  const cacheKey=`jogahub_yt_channel_${seedVideoId}`;
  const cached=localStorage.getItem(cacheKey); if(cached) return cached;
  const j=await youtubeApi('videos',{part:'snippet',id:seedVideoId});
  const id=j?.items?.[0]?.snippet?.channelId;
  if(!id) throw new Error('Canal não encontrado a partir do vídeo de referência.');
  localStorage.setItem(cacheKey,id); return id;
}
async function detectYouTubeLive(channel){
  if(!channel?.youtubeLive?.autoDetect) return null;
  const channelId=await resolveYouTubeChannelId(channel.youtubeLive.seedVideoId);
  const j=await youtubeApi('search',{
    part:'snippet', channelId, eventType:'live', type:'video', videoEmbeddable:'true', maxResults:'1'
  });
  const it=j?.items?.[0];
  if(!it?.id?.videoId) return {live:false,channelId};
  return {live:true,channelId,videoId:it.id.videoId,title:it.snippet?.title||channel.name};
}
function liveTvCardHTML(c, state){
  const isDynamic=!!c.youtubeLive?.autoDetect;
  const live=state?.live===true;
  const checking=state?.checking===true;
  const error=state?.error;
  const embed=live?`https://www.youtube.com/embed/${state.videoId}?autoplay=0&rel=0`:c.embed;
  let status='SINAL OFICIAL';
  let cls='official';
  if(isDynamic){
    if(checking){status='VERIFICANDO...';cls='checking';}
    else if(live){status='● AO VIVO';cls='live';}
    else if(error==='API_KEY_MISSING'){status='CONFIGURE A API';cls='setup';}
    else if(error){status='ERRO NA VERIFICAÇÃO';cls='error';}
    else {status='FORA DO AR';cls='offline';}
  } else if(/24h|ao vivo|sinal/i.test(c.category+' '+c.source)){ status='● AO VIVO'; cls='live'; }
  const subtitle=live&&state.title?state.title:c.category;
  return `<article class="live-tv-card" data-tv-id="${escapeHTML(c.id)}">
    <div class="live-tv-player"><iframe src="${escapeHTML(embed)}" title="${escapeHTML(c.name)}" loading="lazy" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>
    <div class="live-tv-info"><div class="live-tv-copy"><div class="live-tv-title-row"><h3>${escapeHTML(c.name)}</h3><span class="channel-status ${cls}">${escapeHTML(status)}</span></div><p>${escapeHTML(subtitle)}</p><p class="live-tv-source">✓ ${escapeHTML(c.source)}</p></div><a class="live-tv-open" href="${escapeHTML(c.site)}" target="_blank" rel="noopener">fonte ↗</a></div>
  </article>`;
}
async function refreshDynamicLives(force=false){
  const key=getYouTubeApiKey();
  const channels=(typeof LIVE_TV_CHANNELS!=='undefined'?LIVE_TV_CHANNELS:[]).filter(c=>c.youtubeLive?.autoDetect);
  if(!channels.length) return;
  const last=Number(localStorage.getItem('jogahub_live_last_check')||0);
  if(!force && Date.now()-last < 5*60*1000) return;
  localStorage.setItem('jogahub_live_last_check',String(Date.now()));
  for(const c of channels){
    window.JOGAHUB_LIVE_STATE=window.JOGAHUB_LIVE_STATE||{};
    window.JOGAHUB_LIVE_STATE[c.id]={checking:true};
    if(activeType==='tv') paintLiveTvCards();
    try{ window.JOGAHUB_LIVE_STATE[c.id]=await detectYouTubeLive(c); }
    catch(e){ window.JOGAHUB_LIVE_STATE[c.id]={live:false,error:String(e.message||e)}; }
    if(activeType==='tv') paintLiveTvCards();
  }
  const stamp=document.getElementById('liveLastCheck');
  if(stamp) stamp.textContent='Última verificação: '+new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
}
function paintLiveTvCards(){
  const el=document.getElementById('liveTvGrid'); if(!el)return;
  const channels=(typeof LIVE_TV_CHANNELS!=='undefined'?LIVE_TV_CHANNELS:[]);
  el.innerHTML=channels.map(c=>liveTvCardHTML(c,(window.JOGAHUB_LIVE_STATE||{})[c.id])).join('');
}
function bindLiveTvControls(){
  const form=document.getElementById('youtubeApiForm');
  if(form) form.addEventListener('submit',e=>{
    e.preventDefault(); const input=document.getElementById('youtubeApiKey');
    const key=saveYouTubeApiKey(input?.value||'');
    const msg=document.getElementById('youtubeApiMsg');
    if(msg) msg.textContent=key?'Chave salva neste aparelho. Verificando as lives...':'Chave removida.';
    refreshDynamicLives(true);
  });
  const clear=document.getElementById('clearYoutubeApi');
  if(clear) clear.addEventListener('click',()=>{saveYouTubeApiKey(''); const input=document.getElementById('youtubeApiKey');if(input)input.value=''; if(window.JOGAHUB_LIVE_STATE)window.JOGAHUB_LIVE_STATE={}; paintLiveTvCards();});
  const refresh=document.getElementById('refreshLives');
  if(refresh) refresh.addEventListener('click',()=>refreshDynamicLives(true));
}
function renderLiveTv(){
  const grid=document.getElementById('games');
  const meta=document.getElementById('resultsMeta');
  const empty=document.getElementById('emptyState');
  const channels=(typeof LIVE_TV_CHANNELS!=='undefined'?LIVE_TV_CHANNELS:[]);
  const hasKey=!!getYouTubeApiKey();
  grid.innerHTML=`<section class="live-tv-wrap">
    <div class="live-tv-hero"><div><span class="eyebrow">Sinal oficial</span><h2>📺 TV ao Vivo</h2><p>O JogaHub verifica automaticamente ge tv e CazéTV no YouTube e troca o player quando encontra uma transmissão ativa.</p></div><div class="live-tv-hero-actions"><span class="live-tv-badge">AUTO LIVE</span><button id="refreshLives" class="live-tv-refresh" type="button">↻ Atualizar</button></div></div>
    <div class="youtube-api-box ${hasKey?'configured':''}"><div><strong>🔑 Detecção automática do YouTube</strong><p>${hasKey?'API configurada neste aparelho. A verificação ocorre ao abrir e a cada 30 minutos.':'Cole aqui uma chave da YouTube Data API v3 restrita ao seu domínio GitHub Pages.'}</p><small id="liveLastCheck"></small></div><form id="youtubeApiForm"><input id="youtubeApiKey" type="password" autocomplete="off" placeholder="AIza..." value="${hasKey?'••••••••••••••••':''}" aria-label="Chave da YouTube Data API"><button type="submit">Salvar e testar</button><button id="clearYoutubeApi" type="button" class="secondary">Remover</button></form><p id="youtubeApiMsg" class="api-msg"></p></div>
    <div id="liveTvGrid" class="live-tv-grid"></div>
    <p class="live-tv-note">Sem chave, os canais continuam mostrando o conteúdo oficial de reserva. Com a API configurada, ge tv e CazéTV recebem selo <strong>● AO VIVO</strong> e o player troca para a live atual. A chave fica salva apenas no navegador deste aparelho.</p>
  </section>`;
  paintLiveTvCards(); bindLiveTvControls(); refreshDynamicLives(false);
  if(meta) meta.textContent=`${channels.length} canais disponíveis na aba TV`;
  if(empty) empty.style.display='none';
}

// Revalida as transmissões dinâmicas a cada 30 minutos enquanto o site estiver aberto.
setInterval(()=>{ if(getYouTubeApiKey()) refreshDynamicLives(true); },30*60*1000);

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
  if(activeType === 'tv'){ document.getElementById('filters').innerHTML=''; return; }
  if(activeType === 'filme'){
    const options=[['todos','🍿 Início'],['jackie','🥋 Jackie Chan'],['youtube-pt','▶️ YouTube PT'],['archive-pt','🏛️ Archive PT'],['gratis','🆓 Séries grátis'],['doramas','🌸 Doramas'],['infantil','🧸 Infantil'],['animes','🍥 Animes'],['luta','🤼 Luta livre'],['acao','💥 Ação'],['comedia','😂 Comédia'],['romance','❤️ Romance'],['terror','👻 Terror'],['ficcao','🚀 Ficção científica'],['classicos-tv','📺 Nostalgia TV'],['dec70','🕺 Até 70'],['dec80','📼 Anos 80'],['dec90','📺 Anos 90'],['dec2000','💿 Anos 2000'],['portugues','🇧🇷 Português'],['coloridos','🌈 Coloridos PT-BR'],['series','📺 Séries/Desenhos'],['filmes','🎬 Filmes'],['colecoes','📚 Coleções'],['favoritos','♥ Minha Lista'],['continuar','▶ Continuar']];
    document.getElementById('filters').innerHTML=options.map((o,i)=>`<button class="filter-btn${i===0?' active':''}" data-genre="${o[0]}" type="button">${o[1]}</button>`).join('');
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
  if(activeType==='tv'){
    renderLiveTv();
    const movieNotice=document.getElementById('movieNotice'); if(movieNotice) movieNotice.hidden=true;
    const filters=document.getElementById('filters'); if(filters) filters.innerHTML='';
    const search=document.getElementById('search'); if(search){search.value='';search.placeholder='TV ao vivo — canais oficiais incorporados';search.disabled=true;}
    document.getElementById('homeDashboard')?.setAttribute('hidden','');
    return;
  }
  const searchInput=document.getElementById('search'); if(searchInput) searchInput.disabled=false;
  const term = normalize(document.getElementById('search').value.trim());
  const activeBtn = document.querySelector('.filter-btn.active');
  const genre = activeBtn ? activeBtn.dataset.genre : 'todos';
  const filtered = ITEMS.filter(i => {
    const searchable = normalize([i.title, i.desc, i.genre, i.category, i.type, i.language, i.sourceLabel, ...(i.nostalgiaTags||[]), TYPES[i.type]?.label, GAME_CATEGORIES[i.category]?.label].join(' '));
    const movieFilter = activeType !== 'filme' || genre === 'todos'
      || (genre === 'jackie' && i.jackieChan === true)
      || (genre === 'youtube-pt' && i.youtubePt === true)
      || (genre === 'archive-pt' && i.archiveLicensed === true)
      || (genre === 'gratis' && i.freeLegal)
      || (genre === 'classicos-tv' && i.classicTv)
      || (genre === 'doramas' && i.dorama)
      || (genre === 'infantil' && i.kids)
      || (genre === 'animes' && i.anime)
      || (genre === 'luta' && i.wrestling)
      || (genre === 'acao' && (i.filmGenre === 'acao' || normalize(i.genre||'').includes('acao')))
      || (genre === 'comedia' && (i.filmGenre === 'comedia' || normalize(i.genre||'').includes('comedia')))
      || (genre === 'romance' && (i.filmGenre === 'romance' || normalize(i.genre||'').includes('romance')))
      || (genre === 'terror' && (i.filmGenre === 'terror' || normalize(i.genre||'').includes('terror')))
      || (genre === 'ficcao' && (i.filmGenre === 'ficcao' || normalize(i.genre||'').includes('ficcao')))
      || (genre === 'dec70' && itemDecade(i) === '70-')
      || (genre === 'dec80' && itemDecade(i) === '80')
      || (genre === 'dec90' && itemDecade(i) === '90')
      || (genre === 'dec2000' && itemDecade(i) === '2000')
      || (genre === 'portugues' && (i.portuguese || /portugu/i.test(i.language || '')))
      || (genre === 'coloridos' && i.colorContent && (i.portuguese || /portugu/i.test(i.language || '')))
      || (genre === 'series' && i.mediaType === 'serie')
      || (genre === 'filmes' && i.mediaType !== 'serie' && i.mediaType !== 'colecao')
      || (genre === 'colecoes' && i.mediaType === 'colecao')
      || (genre === 'favoritos' && loadFavorites().has(i.id))
      || (genre === 'continuar' && !!movieProgress(i));
    return (activeType === 'todos' || i.type === activeType)
      && (activeType === 'filme' ? movieFilter : (genre === 'todos' || (activeType === 'jogo' ? (i.category || 'outros') === genre : i.genre === genre)))
      && (!term || searchable.includes(term));
  });
  renderItems(sortByTypeOrder(filtered));
  const movieNotice = document.getElementById('movieNotice');
  if(movieNotice) movieNotice.hidden = activeType !== 'filme';
  const search = document.getElementById('search');
  if(search) search.placeholder = activeType === 'todos' ? 'buscar jogos, filmes, séries e desenhos...' : activeType === 'filme'
    ? 'buscar filme, série, episódio ou gênero...'
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

function syncNavigation(){
  
  const header=document.querySelector('.site-header');
  const syncHeader=()=>header?.classList.toggle('scrolled',window.scrollY>24);
  window.addEventListener('scroll',syncHeader,{passive:true});syncHeader();
  document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===activeType));
  document.querySelectorAll('.type-btn').forEach(b=>{const on=b.dataset.type===activeType;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});
}
function setView(view){activeType=view||'todos';renderTypeTabs();renderGenreFilters();if(activeType!=='tv'){renderFeatured();renderHomeDashboard();}else{const b=document.getElementById('banner');if(b)b.hidden=true;const h=document.getElementById('homeDashboard');if(h)h.hidden=true;}syncNavigation();applyFilters();if(activeType!=='tv'){const b=document.getElementById('banner');if(b)b.hidden=false;}window.scrollTo({top:0,behavior:'smooth'});}
function showFavorites(){const fav=loadFavorites();activeType='todos';renderFeatured();syncNavigation();const list=ITEMS.filter(i=>fav.has(i.id));renderItems(list);document.getElementById('resultsMeta').textContent=list.length?`${list.length} itens na Minha Lista`:'Sua lista ainda está vazia.';}
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


const ARCHIVE_OPEN_DUBBED_ROWS = 800;
function archiveText(value){
  if(Array.isArray(value)) return value.join(' ');
  return String(value ?? '');
}
function archiveHasOpenLicense(doc){
  const license = archiveText(doc.licenseurl).toLowerCase();
  const rights = archiveText(doc.rights).toLowerCase();
  return license.includes('creativecommons.org') || /public domain|dom[ií]nio p[uú]blico|creative commons/.test(rights);
}
function archiveExplicitlyUnauthorized(doc){
  const hay = normalize([doc.title, doc.description, doc.subject, doc.rights].map(archiveText).join(' '));
  return /pirat|unauthori[sz]ed|sem autorizacao|nao autorizado|copyright infringement|camrip|telesync|leak(ed)?|vazad[oa]/.test(hay);
}
function archiveLooksPortugueseDubbed(doc){
  const hay = normalize([doc.title, doc.description, doc.subject, doc.language].map(archiveText).join(' '));
  return /dublad|portugues|pt-br|audio pt|audio portugues/.test(hay);
}
async function loadArchiveOpenDubbed(){
  const query = 'mediatype:(movies) AND (title:(dublado OR portugues OR \"pt-br\" OR anime OR desenho OR serie OR filme OR luta OR wrestling) OR description:(dublado OR portugues OR \"pt-br\" OR anime OR desenho OR serie OR filme OR luta OR wrestling) OR subject:(dublado OR portugues OR \"pt-br\" OR anime OR desenho OR serie OR filme OR luta OR wrestling))';
  const params = new URLSearchParams();
  params.set('q', query);
  ['identifier','title','description','year','date','language','subject','licenseurl','rights','creator'].forEach(f=>params.append('fl[]',f));
  params.set('rows', String(ARCHIVE_OPEN_DUBBED_ROWS));
  params.set('page','1');
  params.set('output','json');
  params.set('sort[]','downloads desc');
  try{
    const res = await fetch(`https://archive.org/advancedsearch.php?${params.toString()}`, {mode:'cors', cache:'no-store'});
    if(!res.ok) throw new Error(`Archive HTTP ${res.status}`);
    const data = await res.json();
    const docs = data?.response?.docs || [];
    const existing = new Set(ITEMS.map(i=>i.archiveId || i.id));
    const additions = docs.filter(d=>d.identifier && !archiveExplicitlyUnauthorized(d) && archiveLooksPortugueseDubbed(d) && !existing.has(d.identifier)).map((d,idx)=>({
      id:`archive-public-${d.identifier}`,
      type:'filme',
      title:archiveText(d.title).trim() || d.identifier,
      year:String(d.year || archiveText(d.date).slice(0,4) || 'Archive'),
      genre:'Internet Archive / Português',
      mediaType:'filme',
      language:'Português / dublado conforme metadados do item',
      portuguese:true,
      freeLegal:true,
      archiveLicensed:archiveHasOpenLicense(d),
      rightsUnclear:!archiveHasOpenLicense(d),
      colorContent:true,
      accent:'var(--gold)',
      thumb:`https://archive.org/services/img/${encodeURIComponent(d.identifier)}`,
      desc:(archiveText(d.description).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,360) || 'Conteúdo público em português encontrado automaticamente no Internet Archive. A autorização pode não estar claramente indicada nos metadados.'),
      archiveId:d.identifier,
      sourceUrl:`https://archive.org/details/${encodeURIComponent(d.identifier)}`,
      sourceLabel: archiveHasOpenLicense(d) ? 'Internet Archive — licença aberta/domínio público' : 'Internet Archive — publicação pública; direitos não verificados',
      nostalgiaTags:['Internet Archive','português','dublado','arquivo público']
    }));
    if(additions.length){
      ITEMS.push(...additions);
      renderTypeTabs(); renderGenreFilters(); renderFeatured(); renderHomeDashboard(); applyFilters();
    }
    document.documentElement.dataset.archivePt = additions.length ? String(additions.length) : '0';
  }catch(err){
    console.warn('Archive PT:', err);
    document.documentElement.dataset.archivePt = 'erro';
  }
}

async function loadArchivePicaPau(){
  const query = 'mediatype:(movies) AND ((title:("pica pau" OR "pica-pau" OR "woody woodpecker") OR description:("pica pau" OR "pica-pau" OR "woody woodpecker") OR subject:("pica pau" OR "pica-pau" OR "woody woodpecker")) AND (title:(dublado OR portugues OR "pt-br") OR description:(dublado OR portugues OR "pt-br") OR subject:(dublado OR portugues OR "pt-br") OR language:(Portuguese OR por)))';
  const params = new URLSearchParams();
  params.set('q', query);
  ['identifier','title','description','year','date','language','subject','licenseurl','rights','creator'].forEach(f=>params.append('fl[]',f));
  params.set('rows','200');
  params.set('page','1');
  params.set('output','json');
  params.set('sort[]','downloads desc');
  try{
    const res=await fetch(`https://archive.org/advancedsearch.php?${params.toString()}`,{mode:'cors',cache:'no-store'});
    if(!res.ok) throw new Error(`Archive Pica-Pau HTTP ${res.status}`);
    const data=await res.json();
    const docs=data?.response?.docs||[];
    const existing=new Set(ITEMS.map(i=>i.archiveId||i.id));
    const additions=docs.filter(d=>d.identifier && !archiveExplicitlyUnauthorized(d) && !existing.has(d.identifier)).map((d,idx)=>({
      id:`pica-pau-archive-${d.identifier}`, type:'filme', title:archiveText(d.title).trim()||`Pica-Pau — Archive ${idx+1}`,
      year:String(d.year||archiveText(d.date).slice(0,4)||'Archive'), genre:'Desenho / Comédia', mediaType:'serie',
      seriesId:'pica-pau-archive', seriesTitle:'Pica-Pau — Internet Archive', season:1, episode:idx+2,
      language:'Português / dublado conforme metadados', portuguese:true, colorContent:true, rightsUnclear:!archiveHasOpenLicense(d), archiveLicensed:archiveHasOpenLicense(d),
      accent:'var(--red)', thumb:`https://archive.org/services/img/${encodeURIComponent(d.identifier)}`,
      desc:(archiveText(d.description).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,360)||'Item de Pica-Pau encontrado publicamente no Internet Archive.'),
      archiveId:d.identifier, sourceUrl:`https://archive.org/details/${encodeURIComponent(d.identifier)}`,
      sourceLabel:archiveHasOpenLicense(d)?'Internet Archive — licença aberta/domínio público':'Internet Archive — publicação pública; direitos não verificados',
      classicTv:true, nostalgiaTags:['Pica-Pau','Internet Archive','desenho clássico','português']
    }));
    if(additions.length){ ITEMS.push(...additions); renderTypeTabs(); renderGenreFilters(); renderFeatured(); renderHomeDashboard(); applyFilters(); }
    document.documentElement.dataset.archivePicaPau=String(additions.length);
  }catch(err){ console.warn('Archive Pica-Pau:',err); document.documentElement.dataset.archivePicaPau='erro'; }
}


async function loadArchiveJackieChan(){
  // Filmes do Jackie anteriores a 2000 + desenho, públicos no Internet Archive.
  const query='mediatype:(movies) AND ((title:("jackie chan" OR "jackie chan adventures" OR "as aventuras de jackie chan") OR description:("jackie chan" OR "jackie chan adventures" OR "as aventuras de jackie chan") OR subject:("jackie chan" OR "jackie chan adventures" OR "as aventuras de jackie chan")))';
  const params=new URLSearchParams();
  params.set('q',query);
  ['identifier','title','description','year','date','language','subject','licenseurl','rights','creator'].forEach(f=>params.append('fl[]',f));
  params.set('rows','300'); params.set('page','1'); params.set('output','json'); params.set('sort[]','downloads desc');
  try{
    const res=await fetch(`https://archive.org/advancedsearch.php?${params.toString()}`,{mode:'cors',cache:'no-store'});
    if(!res.ok) throw new Error(`Archive Jackie HTTP ${res.status}`);
    const docs=(await res.json())?.response?.docs||[];
    const existing=new Set(ITEMS.map(i=>i.archiveId||i.id));
    let ep=2;
    const additions=[];
    for(const d of docs){
      if(!d.identifier || existing.has(d.identifier) || archiveExplicitlyUnauthorized(d)) continue;
      const blob=normalize([archiveText(d.title),archiveText(d.description),archiveText(d.subject)].join(' '));
      const isCartoon=blob.includes('jackie chan adventures') || blob.includes('as aventuras de jackie chan');
      const year=Number(d.year || archiveText(d.date).slice(0,4) || 0);
      if(!isCartoon && (!year || year>=2000)) continue;
      additions.push({
        id:`jackie-archive-${d.identifier}`, type:'filme', title:archiveText(d.title).trim()||d.identifier,
        year:String(year||'Archive'), genre:isCartoon?'Desenho / Ação / Comédia':'Ação / Artes marciais', mediaType:isCartoon?'serie':'filme',
        ...(isCartoon?{seriesId:'jackie-chan-adventures-archive',seriesTitle:'As Aventuras de Jackie Chan — Archive',season:1,episode:ep++}:{}),
        language:'Áudio conforme item do Archive', portuguese:archiveLooksPortugueseDubbed(d), colorContent:true, jackieChan:true,
        classicTv:isCartoon, filmGenre:isCartoon?undefined:'acao', rightsUnclear:!archiveHasOpenLicense(d), archiveLicensed:archiveHasOpenLicense(d),
        thumb:`https://archive.org/services/img/${encodeURIComponent(d.identifier)}`, accent:'var(--gold)',
        desc:(archiveText(d.description).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,360)||'Conteúdo de Jackie Chan encontrado publicamente no Internet Archive.'),
        archiveId:d.identifier, sourceUrl:`https://archive.org/details/${encodeURIComponent(d.identifier)}`,
        sourceLabel:archiveHasOpenLicense(d)?'Internet Archive — licença aberta/domínio público':'Internet Archive — publicação pública; direitos não verificados',
        nostalgiaTags:['Jackie Chan','Internet Archive',isCartoon?'desenho':'filme anterior a 2000']
      });
      existing.add(d.identifier);
    }
    if(additions.length){ITEMS.push(...additions);renderTypeTabs();renderGenreFilters();renderFeatured();renderHomeDashboard();applyFilters();}
    document.documentElement.dataset.archiveJackie=String(additions.length);
  }catch(err){console.warn('Archive Jackie Chan:',err);document.documentElement.dataset.archiveJackie='erro';}
}

async function loadYouTubeJackieChanDiscoveries(){
  // Usa a mesma chave opcional já configurada para lives. Uma única busca economiza cota.
  if(!getYouTubeApiKey()) return;
  try{
    const data=await youtubeApi('search',{part:'snippet',q:'Jackie Chan full movie',type:'video',videoEmbeddable:'true',maxResults:'25',safeSearch:'moderate'});
    const known=[
      ['mr nice guy','Mr. Nice Guy',1997],['rumble in the bronx','Rumble in the Bronx',1995],['police story 3','Police Story 3',1992],['supercop','Supercop',1992],
      ['police story 2','Police Story 2',1988],['police story','Police Story',1985],['project a 2','Project A 2',1987],['project a','Project A',1983],
      ['dragons forever','Dragons Forever',1988],['miracles','Miracles',1989],['armour of god 2','Armour of God II',1991],['armour of god','Armour of God',1986],
      ['who am i','Who Am I?',1998],['gorgeous','Gorgeous',1999],['twin dragons','Twin Dragons',1992],['first strike','First Strike',1996]
    ];
    const existingIds=new Set(ITEMS.map(i=>i.youtubeId).filter(Boolean));
    const additions=[];
    for(const r of data.items||[]){
      const vid=r.id?.videoId;if(!vid||existingIds.has(vid))continue;
      const title=normalize(r.snippet?.title||'');
      const match=known.find(([needle])=>title.includes(needle));
      if(!match)continue;
      additions.push({id:`jackie-youtube-auto-${vid}`,type:'filme',title:match[1],year:String(match[2]),genre:'Ação / Artes marciais',mediaType:'filme',jackieChan:true,filmGenre:'acao',colorContent:true,rightsUnclear:true,
        youtubeId:vid,thumb:r.snippet?.thumbnails?.high?.url||`https://i.ytimg.com/vi/${vid}/hqdefault.jpg`,accent:'var(--gold)',
        desc:`Filme de Jackie Chan anterior a 2000 encontrado publicamente no YouTube (${r.snippet?.channelTitle||'canal público'}).`,
        sourceUrl:`https://www.youtube.com/watch?v=${vid}`,sourceLabel:`YouTube — ${r.snippet?.channelTitle||'publicação pública'}; direitos não verificados`,nostalgiaTags:['Jackie Chan','YouTube','filme anterior a 2000']});
      existingIds.add(vid);
    }
    if(additions.length){ITEMS.push(...additions);renderTypeTabs();renderGenreFilters();renderFeatured();renderHomeDashboard();applyFilters();}
    document.documentElement.dataset.youtubeJackie=String(additions.length);
  }catch(err){console.warn('YouTube Jackie Chan:',err);}
}

if('serviceWorker' in navigator){
  window.addEventListener('load', async () => {
    try {
      // limpa caches da versão que causou o problema no GitHub Pages
      const names = await caches.keys();
      await Promise.all(names.filter(n => (n.startsWith('nexora-') || n.startsWith('linkora-') || n.startsWith('jogahub-')) && n !== CURRENT_SHELL_CACHE && n !== CURRENT_CONTENT_CACHE && n !== MEDIA_CACHE).map(n => caches.delete(n)));
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
  activeType = 'todos';
  renderFeatured();
  renderHomeDashboard();
  const continueSection = document.getElementById('continueSection');
  if(continueSection) continueSection.hidden = true;
  renderTypeTabs();
  renderGenreFilters();
  applyFilters();
  loadArchiveOpenDubbed();
  loadArchivePicaPau();
  loadArchiveJackieChan();
  loadYouTubeJackieChanDiscoveries();
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
  document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
  document.querySelectorAll('[data-action="search"]').forEach(b=>b.addEventListener('click',()=>{document.getElementById('search')?.focus();document.querySelector('.controls')?.scrollIntoView({behavior:'smooth',block:'center'});}));
  document.querySelectorAll('[data-action="favorites"]').forEach(b=>b.addEventListener('click',showFavorites));
  document.querySelectorAll('[data-action="downloads"]').forEach(b=>b.addEventListener('click',showDownloads));
  document.getElementById('closeDownloads')?.addEventListener('click',()=>document.getElementById('downloadsModal').hidden=true);
  document.getElementById('downloadsModal')?.addEventListener('click',e=>{if(e.target.id==='downloadsModal')e.currentTarget.hidden=true;const b=e.target.closest('[data-remove-media]');if(b)removeMediaDownload(b.dataset.removeMedia)});
  syncNavigation();
  document.getElementById('search').addEventListener('input', applyFilters);
  document.getElementById('typeTabs').addEventListener('click', e => {
    const btn=e.target.closest('.type-btn'); if(!btn) return;
    activeType=btn.dataset.type;
    document.querySelectorAll('.type-btn').forEach(b=>{const on=b===btn;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});
    renderGenreFilters(); renderFeatured(); renderHomeDashboard(); syncNavigation(); applyFilters();
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
