/* JogaHub TV Catalog 1.3.9
   Agregador de playlists publicas/gratuitas para GitHub Pages.
   Fontes: Free-TV/IPTV e IPTV-org. */
(function(){
'use strict';

const TV_SOURCES = [
  {
    id:'free-tv',
    label:'Free-TV',
    url:'https://raw.githubusercontent.com/Free-TV/IPTV/master/playlist.m3u8',
    project:'https://github.com/Free-TV/IPTV',
    country:'',
    priority:40
  },
  {
    id:'iptv-br',
    label:'IPTV-org Brasil',
    url:'https://iptv-org.github.io/iptv/countries/br.m3u',
    project:'https://github.com/iptv-org/iptv',
    country:'BR',
    priority:50
  },
  {
    id:'iptv-world',
    label:'IPTV-org Mundial',
    url:'https://iptv-org.github.io/iptv/index.category.m3u',
    fallback:'https://iptv-org.github.io/iptv/index.m3u',
    project:'https://github.com/iptv-org/iptv',
    country:'',
    priority:20
  }
];

const TV_CATEGORY_LABELS = {
  animation:'Animação',
  auto:'Automóveis',
  business:'Negócios',
  classic:'Clássicos',
  comedy:'Comédia',
  cooking:'Culinária',
  culture:'Cultura',
  documentary:'Documentários',
  education:'Educação',
  entertainment:'Entretenimento',
  family:'Família',
  general:'Geral',
  kids:'Infantil',
  legislative:'Legislativo',
  lifestyle:'Lifestyle',
  movies:'Filmes',
  music:'Música',
  news:'Notícias',
  outdoor:'Natureza',
  relax:'Relax',
  religious:'Religioso',
  science:'Ciência',
  series:'Séries',
  shop:'Compras',
  sports:'Esportes',
  travel:'Viagens',
  weather:'Tempo',
  undefined:'Outros'
};

const state = {
  loading:false,
  loaded:false,
  channels:[],
  errors:[],
  query:'',
  category:'todos',
  country:'todos',
  source:'todos',
  limit:120,
  hls:null,
  activeChannel:null
};

function esc(v){
  return String(v == null ? '' : v).replace(/[&<>'"]/g,function(ch){
    return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch];
  });
}
function norm(v){
  return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
}
function compactName(v){
  return norm(v)
    .replace(/\([^)]*(?:\d{3,4}p|hd|sd|fhd|uhd|4k)[^)]*\)/g,' ')
    .replace(/\b(?:1080p|720p|576p|480p|360p|hd|sd|fhd|uhd|4k)\b/g,' ')
    .replace(/[^a-z0-9]+/g,' ')
    .trim();
}
function hash(str){
  var h=2166136261;
  str=String(str||'');
  for(var i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619);}
  return (h>>>0).toString(36);
}
function parseAttrs(line){
  var attrs={};
  line.replace(/([\w-]+)="([^"]*)"/g,function(_,k,v){attrs[k.toLowerCase()]=v;return _;});
  return attrs;
}
function cleanTitle(v){
  return String(v||'Canal').replace(/\s+/g,' ').trim();
}
function countryFrom(attrs,source){
  var direct=(attrs['tvg-country']||'').split(/[;,]/)[0].trim().toUpperCase();
  if(direct) return direct;
  var id=String(attrs['tvg-id']||'');
  var m=id.match(/\.([a-z]{2})(?:@|$)/i);
  if(m) return m[1].toUpperCase();
  return source.country||'';
}
function categoryFrom(attrs){
  var raw=String(attrs['group-title']||'').split(/[;,|]/)[0].trim();
  var key=norm(raw).replace(/[^a-z]+/g,'');
  if(!key) return 'Outros';
  var aliases={
    animacao:'animation',animation:'animation',
    automovel:'auto',automoveis:'auto',auto:'auto',
    negocios:'business',business:'business',
    classicos:'classic',classic:'classic',
    comedia:'comedy',comedy:'comedy',
    culinaria:'cooking',cooking:'cooking',
    cultura:'culture',culture:'culture',
    documentario:'documentary',documentarios:'documentary',documentary:'documentary',
    educacao:'education',education:'education',
    entretenimento:'entertainment',entertainment:'entertainment',
    familia:'family',family:'family',
    geral:'general',general:'general',
    infantil:'kids',kids:'kids',
    legislativo:'legislative',legislative:'legislative',
    lifestyle:'lifestyle',
    filmes:'movies',movies:'movies',movie:'movies',
    musica:'music',music:'music',
    noticias:'news',news:'news',
    natureza:'outdoor',outdoor:'outdoor',
    relax:'relax',
    religiao:'religious',religioso:'religious',religious:'religious',
    ciencia:'science',science:'science',
    series:'series',serieschannel:'series',
    compras:'shop',shop:'shop',
    esportes:'sports',sports:'sports',sport:'sports',
    viagens:'travel',travel:'travel',
    tempo:'weather',weather:'weather'
  };
  var mapped=aliases[key]||key;
  return TV_CATEGORY_LABELS[mapped]||raw||'Outros';
}
function parseM3U(text,source){
  var lines=String(text||'').replace(/^\uFEFF/,'').split(/\r?\n/);
  var out=[];
  var info=null;
  for(var i=0;i<lines.length;i++){
    var line=lines[i].trim();
    if(!line) continue;
    if(line.indexOf('#EXTINF:')===0){
      var attrs=parseAttrs(line);
      var comma=line.indexOf(',');
      info={attrs:attrs,title:comma>=0?line.slice(comma+1).trim():'Canal'};
      continue;
    }
    if(line.charAt(0)==='#') continue;
    if(info && /^https?:\/\//i.test(line)){
      if(!/^https:\/\//i.test(line)){info=null;continue;}
      var attrs2=info.attrs||{};
      var tvgId=attrs2['tvg-id']||'';
      var title=cleanTitle(info.title);
      var country=countryFrom(attrs2,source);
      var category=categoryFrom(attrs2);
      var logo=attrs2['tvg-logo']||'';
      var key=tvgId?('id:'+norm(tvgId)):('name:'+compactName(title));
      out.push({
        id:'tv-'+source.id+'-'+hash(key+'|'+line),
        dedupeKey:key,
        tvgId:tvgId,
        name:title,
        category:category,
        country:country,
        logo:/^https:\/\//i.test(logo)?logo:'',
        stream:line,
        source:source.label,
        sourceId:source.id,
        sourcePage:source.project,
        priority:source.priority||0,
        imported:true
      });
      info=null;
    }
  }
  return out;
}
async function fetchText(url){
  var res=await fetch(url,{cache:'no-store',mode:'cors'});
  if(!res.ok) throw new Error('HTTP '+res.status);
  return res.text();
}
async function fetchSource(source){
  try{
    var text=await fetchText(source.url);
    return {source:source,channels:parseM3U(text,source),error:null};
  }catch(err){
    if(source.fallback){
      try{
        var fallbackText=await fetchText(source.fallback);
        return {source:source,channels:parseM3U(fallbackText,source),error:null};
      }catch(err2){
        return {source:source,channels:[],error:String(err2&&err2.message||err2)};
      }
    }
    return {source:source,channels:[],error:String(err&&err.message||err)};
  }
}
function manualChannels(){
  var list=[];
  try{if(typeof LIVE_TV_CHANNELS!=='undefined'&&Array.isArray(LIVE_TV_CHANNELS)) list=LIVE_TV_CHANNELS;}catch(_){}
  return list.map(function(c,index){
    return {
      id:c.id||('manual-'+index),
      dedupeKey:'name:'+compactName(c.name),
      name:c.name||'Canal',
      category:c.category||'TV ao vivo',
      country:'BR',
      logo:c.logo||'',
      embed:c.embed||'',
      site:c.site||'',
      source:c.source||'Fonte oficial',
      sourceId:'oficial',
      sourcePage:c.site||'',
      priority:100,
      imported:false
    };
  });
}
function mergeChannels(groups){
  var best=new Map();
  var all=manualChannels();
  groups.forEach(function(group){all=all.concat(group.channels||[]);});
  all.sort(function(a,b){return (b.priority||0)-(a.priority||0);});
  all.forEach(function(ch){
    var k=ch.dedupeKey||('name:'+compactName(ch.name));
    if(!k||k==='name:') k='url:'+(ch.stream||ch.embed||ch.id);
    if(!best.has(k)) best.set(k,ch);
  });
  var merged=Array.from(best.values());
  merged.sort(function(a,b){
    var br=Number((b.country||'').toUpperCase()==='BR')-Number((a.country||'').toUpperCase()==='BR');
    if(br) return br;
    var pr=(b.priority||0)-(a.priority||0);if(pr)return pr;
    return String(a.name||'').localeCompare(String(b.name||''),'pt-BR');
  });
  return merged;
}
async function loadCatalog(force){
  if(state.loading) return state.channels;
  if(state.loaded&&!force) return state.channels;
  state.loading=true;state.errors=[];
  renderLoadingState();
  try{
    var results=await Promise.all(TV_SOURCES.map(fetchSource));
    state.errors=results.filter(function(x){return x.error;}).map(function(x){return {label:x.source.label,error:x.error};});
    state.channels=mergeChannels(results);
    state.loaded=true;
    window.JOGAHUB_TV_COUNT=state.channels.length;
    try{if(typeof renderTypeTabs==='function')renderTypeTabs();}catch(_){}
    return state.channels;
  }finally{
    state.loading=false;
  }
}
function sourceOptions(){
  var ids=new Map();
  state.channels.forEach(function(c){if(!ids.has(c.sourceId))ids.set(c.sourceId,c.source);});
  return Array.from(ids.entries()).sort(function(a,b){return a[1].localeCompare(b[1],'pt-BR');});
}
function countryOptions(){
  var set=new Set();
  state.channels.forEach(function(c){if(c.country)set.add(c.country.toUpperCase());});
  return Array.from(set).sort();
}
function categoryOptions(){
  var set=new Set();
  state.channels.forEach(function(c){if(c.category)set.add(c.category);});
  return Array.from(set).sort(function(a,b){return a.localeCompare(b,'pt-BR');});
}
function filteredChannels(){
  var q=norm(state.query);
  return state.channels.filter(function(c){
    if(state.category!=='todos'&&c.category!==state.category)return false;
    if(state.country!=='todos'&&(c.country||'').toUpperCase()!==state.country)return false;
    if(state.source!=='todos'&&c.sourceId!==state.source)return false;
    if(q){
      var hay=norm([c.name,c.category,c.country,c.source,c.tvgId].join(' '));
      if(hay.indexOf(q)<0)return false;
    }
    return true;
  });
}
function cardHTML(c){
  var art=c.logo?('<img src="'+esc(c.logo)+'" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.remove()">'):'<span>📺</span>';
  var country=c.country?('<span class="tv-chip">'+esc(c.country)+'</span>'):'';
  return '<article class="tv-channel-card" data-tv-card="'+esc(c.id)+'">'+
    '<button class="tv-channel-main" type="button" data-tv-play="'+esc(c.id)+'" aria-label="Assistir '+esc(c.name)+'">'+
      '<span class="tv-channel-logo">'+art+'</span>'+
      '<span class="tv-channel-copy"><strong>'+esc(c.name)+'</strong><small>'+esc(c.category)+'</small><em>'+country+'<span class="tv-chip source">'+esc(c.source)+'</span></em></span>'+
      '<span class="tv-play-icon">▶</span>'+
    '</button>'+
  '</article>';
}
function renderGrid(){
  var grid=document.getElementById('tvCatalogGrid');
  var meta=document.getElementById('tvCatalogMeta');
  var more=document.getElementById('tvLoadMore');
  if(!grid)return;
  var list=filteredChannels();
  var shown=list.slice(0,state.limit);
  grid.innerHTML=shown.map(cardHTML).join('');
  if(meta){
    var suffix=state.errors.length?(' • '+state.errors.length+' fonte(s) temporariamente indisponível(is)'):'';
    meta.textContent=list.length+' canais encontrados • '+state.channels.length+' no catálogo'+suffix;
  }
  if(more){
    more.hidden=shown.length>=list.length;
    more.textContent='Carregar mais ('+(list.length-shown.length)+')';
  }
}
function renderLoadingState(){
  var meta=document.getElementById('tvCatalogMeta');
  if(meta)meta.textContent='Atualizando as listas de TV...';
}
function controlsHTML(){
  var cats=categoryOptions().map(function(x){return '<option value="'+esc(x)+'">'+esc(x)+'</option>';}).join('');
  var countries=countryOptions().map(function(x){return '<option value="'+esc(x)+'">'+esc(x)+'</option>';}).join('');
  var sources=sourceOptions().map(function(x){return '<option value="'+esc(x[0])+'">'+esc(x[1])+'</option>';}).join('');
  return '<div class="tv-catalog-controls">'+
    '<label class="tv-search"><span>⌕</span><input id="tvCatalogSearch" type="search" autocomplete="off" placeholder="buscar canal, categoria ou país..."></label>'+
    '<select id="tvCategoryFilter" aria-label="Categoria"><option value="todos">Todas as categorias</option>'+cats+'</select>'+
    '<select id="tvCountryFilter" aria-label="País"><option value="todos">Todos os países</option><option value="BR">🇧🇷 Brasil</option>'+countries+'</select>'+
    '<select id="tvSourceFilter" aria-label="Fonte"><option value="todos">Todas as fontes</option>'+sources+'</select>'+
    '<button id="tvRefreshCatalog" class="tv-refresh-btn" type="button">↻ Atualizar</button>'+
  '</div>';
}
function bindControls(){
  var search=document.getElementById('tvCatalogSearch');
  if(search)search.addEventListener('input',function(e){state.query=e.target.value;state.limit=120;renderGrid();});
  var cat=document.getElementById('tvCategoryFilter');
  if(cat)cat.addEventListener('change',function(e){state.category=e.target.value;state.limit=120;renderGrid();});
  var country=document.getElementById('tvCountryFilter');
  if(country)country.addEventListener('change',function(e){state.country=e.target.value;state.limit=120;renderGrid();});
  var source=document.getElementById('tvSourceFilter');
  if(source)source.addEventListener('change',function(e){state.source=e.target.value;state.limit=120;renderGrid();});
  var refresh=document.getElementById('tvRefreshCatalog');
  if(refresh)refresh.addEventListener('click',async function(){
    refresh.disabled=true;refresh.textContent='Atualizando...';
    await loadCatalog(true);
    hydrateCatalogControls();
    renderGrid();
    refresh.disabled=false;refresh.textContent='↻ Atualizar';
  });
  var more=document.getElementById('tvLoadMore');
  if(more)more.addEventListener('click',function(){state.limit+=120;renderGrid();});
  var grid=document.getElementById('tvCatalogGrid');
  if(grid)grid.addEventListener('click',function(e){
    var btn=e.target.closest('[data-tv-play]');
    if(!btn)return;
    var ch=state.channels.find(function(x){return x.id===btn.dataset.tvPlay;});
    if(ch)openChannel(ch);
  });
}
function hydrateCatalogControls(){
  var box=document.getElementById('tvCatalogControlHost');
  if(!box)return;
  box.innerHTML=controlsHTML();
  bindControls();
}
function renderTvCatalog(){
  var grid=document.getElementById('games');
  var meta=document.getElementById('resultsMeta');
  var empty=document.getElementById('emptyState');
  if(!grid)return;
  grid.innerHTML='<section class="live-tv-wrap tv-catalog-wrap">'+
    '<div class="live-tv-hero tv-catalog-hero"><div><span class="eyebrow">TV grátis e pública</span><h2>📡 TV ao Vivo</h2><p>Catálogo unificado com canais gratuitos de fontes públicas, organizado para funcionar no navegador sem carregar centenas de players ao mesmo tempo.</p></div><div class="live-tv-hero-actions"><span class="live-tv-badge">FREE TV</span><span class="tv-live-dot">● AO VIVO</span></div></div>'+
    '<div id="tvCatalogControlHost"></div>'+
    '<div id="tvCatalogMeta" class="tv-catalog-meta">Carregando canais...</div>'+
    '<div id="tvCatalogGrid" class="tv-catalog-grid"><div class="tv-catalog-loading">Carregando listas de TV…</div></div>'+
    '<button id="tvLoadMore" class="tv-load-more" type="button" hidden>Carregar mais</button>'+
    '<p class="live-tv-note">Os canais vêm de listas públicas e gratuitas. A disponibilidade pode mudar por região, direitos de transmissão, CORS ou alterações feitas pela própria emissora. Canais HTTP inseguros são ignorados no GitHub Pages.</p>'+
  '</section>';
  if(meta)meta.textContent='';
  if(empty)empty.style.display='none';
  loadCatalog(false).then(function(){
    hydrateCatalogControls();
    renderGrid();
  }).catch(function(err){
    var m=document.getElementById('tvCatalogMeta');if(m)m.textContent='Não foi possível atualizar as listas agora: '+String(err&&err.message||err);
  });
}
function ensureModal(){
  var existing=document.getElementById('tvPlayerModal');
  if(existing)return existing;
  var wrap=document.createElement('div');
  wrap.id='tvPlayerModal';
  wrap.className='tv-player-modal';
  wrap.hidden=true;
  wrap.innerHTML='<section class="tv-player-shell" role="dialog" aria-modal="true" aria-labelledby="tvPlayerTitle">'+
    '<div class="tv-player-head"><div><span class="eyebrow">TV ao Vivo</span><h2 id="tvPlayerTitle">Canal</h2><p id="tvPlayerMeta"></p></div><button id="tvPlayerClose" type="button" aria-label="Fechar">✕</button></div>'+
    '<div class="tv-player-stage"><video id="tvVideo" controls playsinline preload="metadata"></video><iframe id="tvIframe" title="TV ao vivo" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe><div id="tvPlayerStatus" class="tv-player-status">Preparando transmissão…</div></div>'+
    '<div class="tv-player-actions"><button id="tvRetry" type="button">↻ Tentar novamente</button><a id="tvOpenSource" href="#" target="_blank" rel="noopener">Abrir transmissão ↗</a></div>'+
  '</section>';
  document.body.appendChild(wrap);
  document.getElementById('tvPlayerClose').addEventListener('click',closePlayer);
  wrap.addEventListener('click',function(e){if(e.target===wrap)closePlayer();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!wrap.hidden)closePlayer();});
  document.getElementById('tvRetry').addEventListener('click',function(){if(state.activeChannel)startChannel(state.activeChannel,true);});
  return wrap;
}
function destroyHls(){
  if(state.hls){try{state.hls.destroy();}catch(_){}state.hls=null;}
}
function closePlayer(){
  var modal=document.getElementById('tvPlayerModal');if(!modal)return;
  destroyHls();
  var v=document.getElementById('tvVideo');if(v){try{v.pause();}catch(_){}v.removeAttribute('src');v.load();}
  var f=document.getElementById('tvIframe');if(f)f.src='about:blank';
  modal.hidden=true;document.body.classList.remove('tv-player-open');
}
function loadHlsLibrary(){
  if(window.Hls)return Promise.resolve(window.Hls);
  if(window.__JOGAHUB_HLS_PROMISE)return window.__JOGAHUB_HLS_PROMISE;
  window.__JOGAHUB_HLS_PROMISE=new Promise(function(resolve,reject){
    var s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js';
    s.async=true;
    s.onload=function(){window.Hls?resolve(window.Hls):reject(new Error('HLS indisponível'));};
    s.onerror=function(){reject(new Error('Falha ao carregar o motor HLS'));};
    document.head.appendChild(s);
  });
  return window.__JOGAHUB_HLS_PROMISE;
}
function setStatus(text,error){
  var el=document.getElementById('tvPlayerStatus');if(!el)return;
  el.textContent=text||'';el.classList.toggle('error',!!error);el.hidden=!text;
}
async function playStream(ch){
  var video=document.getElementById('tvVideo');
  var iframe=document.getElementById('tvIframe');
  iframe.style.display='none';video.style.display='block';
  video.poster=ch.logo||'';
  setStatus('Conectando ao sinal ao vivo…',false);
  destroyHls();
  var url=ch.stream;
  var nativeHls=video.canPlayType('application/vnd.apple.mpegurl')||video.canPlayType('application/x-mpegURL');
  if(nativeHls){
    video.src=url;
    video.addEventListener('loadedmetadata',function onMeta(){video.removeEventListener('loadedmetadata',onMeta);setStatus('',false);video.play().catch(function(){});},{once:true});
    video.addEventListener('error',function onErr(){video.removeEventListener('error',onErr);setStatus('O navegador não conseguiu abrir este sinal. Use Abrir transmissão como alternativa.',true);},{once:true});
    video.load();return;
  }
  var looksHls=/\.m3u8(?:$|\?)/i.test(url);
  if(looksHls){
    try{
      var Hls=await loadHlsLibrary();
      if(Hls.isSupported()){
        var hls=new Hls({enableWorker:true,lowLatencyMode:true,maxBufferLength:24,maxMaxBufferLength:48,backBufferLength:30});
        state.hls=hls;
        hls.attachMedia(video);
        hls.on(Hls.Events.MEDIA_ATTACHED,function(){hls.loadSource(url);});
        hls.on(Hls.Events.MANIFEST_PARSED,function(){setStatus('',false);video.play().catch(function(){});});
        hls.on(Hls.Events.ERROR,function(_,data){
          if(!data||!data.fatal)return;
          if(data.type===Hls.ErrorTypes.NETWORK_ERROR){setStatus('Falha de rede no canal. Tentando reconectar…',true);try{hls.startLoad();}catch(_){}}
          else if(data.type===Hls.ErrorTypes.MEDIA_ERROR){setStatus('Recuperando o vídeo…',false);try{hls.recoverMediaError();}catch(_){}}
          else{destroyHls();setStatus('Este sinal bloqueou a reprodução no navegador. Use Abrir transmissão como alternativa.',true);}
        });
        return;
      }
    }catch(err){
      setStatus('Não foi possível iniciar o motor HLS. Tentando reprodução direta…',true);
    }
  }
  video.src=url;video.load();
  try{await video.play();setStatus('',false);}catch(_){setStatus('Este sinal não é compatível com reprodução direta neste navegador.',true);}
}
function startChannel(ch){
  state.activeChannel=ch;
  var title=document.getElementById('tvPlayerTitle');
  var meta=document.getElementById('tvPlayerMeta');
  var link=document.getElementById('tvOpenSource');
  if(title)title.textContent=ch.name;
  if(meta)meta.textContent=[ch.category,ch.country,ch.source].filter(Boolean).join(' • ');
  if(link)link.href=ch.site||ch.stream||ch.sourcePage||'#';
  var video=document.getElementById('tvVideo');
  var iframe=document.getElementById('tvIframe');
  destroyHls();
  if(ch.embed){
    video.style.display='none';iframe.style.display='block';iframe.src=ch.embed;setStatus('',false);
  }else{
    playStream(ch);
  }
}
function openChannel(ch){
  var modal=ensureModal();
  modal.hidden=false;document.body.classList.add('tv-player-open');
  startChannel(ch);
}

window.JOGAHUB_TV={
  sources:TV_SOURCES,
  load:loadCatalog,
  count:function(){return state.channels.length||manualChannels().length;},
  channels:function(){return state.channels.slice();},
  open:openChannel
};
try{renderLiveTv=renderTvCatalog;}catch(_){window.renderLiveTv=renderTvCatalog;}
})();
