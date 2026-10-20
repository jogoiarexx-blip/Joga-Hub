/* JogaHub — núcleo isolado de catálogo, indexação e deduplicação.
 * Script clássico carregado ANTES de app.js para preservar compatibilidade
 * com o launcher, o Drive e os demais scripts sem bundler.
 */
(function (root) {
  'use strict';

  const types = Object.freeze({
    jogo:      { label: 'Jogos', action: 'jogar', icon: '🎮', singular: 'jogo' },
    filme:     { label: 'Filmes', action: 'assistir', icon: '🎬', singular: 'filme' },
    serie:     { label: 'Séries', action: 'assistir', icon: '📺', singular: 'série' },
    anime:     { label: 'Animes', action: 'assistir', icon: '🍥', singular: 'anime' },
    emulador:  { label: 'Emuladores', action: 'abrir', icon: '🕹️', singular: 'emulador' },
    radio:     { label: 'Rádios', action: 'ouvir', icon: '📻', singular: 'rádio' }
  });

  const typeOrder = Object.freeze(['todos', 'jogo', 'filme', 'serie', 'anime', 'emulador', 'radio']);

  const gameCategories = Object.freeze({
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
  });

  function normalize(value = '') {
    return String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function mediaKey(item) {
    if (item?.archiveId) return 'archive:' + item.archiveId;
    if (item?.youtubeId) return 'youtube:' + item.youtubeId;
    return '';
  }

  function createState({ onChange, requestFrame } = {}) {
    const runtimeItems = [];
    const searchCache = new Map();
    const schedule = requestFrame || (callback => requestAnimationFrame(callback));
    let refreshScheduled = false;

    function searchIndex(item) {
      const key = String(item?.id || '');
      if (key && searchCache.has(key)) return searchCache.get(key);
      const tags = Array.isArray(item?.nostalgiaTags) ? item.nostalgiaTags : [];
      const value = normalize([
        item?.title, item?.seriesTitle, item?.desc, item?.genre, item?.filmGenre,
        item?.category, item?.type, item?.language, item?.sourceLabel,
        item?.sourceCollection, item?._driveName, item?._drivePath,
        ...tags, types[item?.type]?.label, gameCategories[item?.category]?.label
      ].filter(Boolean).join(' '));
      if (key) searchCache.set(key, value);
      return value;
    }

    function rebuild(baseItems = []) {
      searchCache.clear();
      const seen = new Set();
      const merged = [...baseItems, ...runtimeItems];
      return merged.filter(item => {
        const id = item?.id;
        if (!id || id === 'exemplo' || seen.has(id)) return false;
        seen.add(id);
        return true;
      });
    }

    function scheduleRefresh() {
      if (refreshScheduled) return;
      refreshScheduled = true;
      schedule(() => {
        refreshScheduled = false;
        if (typeof onChange === 'function') onChange();
      });
    }

    function registerRuntimeItems(additions, currentItems = []) {
      const seenIds = new Set([...currentItems, ...runtimeItems].map(item => item.id));
      const seenMedia = new Set([...currentItems, ...runtimeItems].map(mediaKey).filter(Boolean));
      let changed = false;
      for (const item of additions || []) {
        const key = mediaKey(item);
        if (!item?.id || seenIds.has(item.id) || (key && seenMedia.has(key))) continue;
        runtimeItems.push(item);
        seenIds.add(item.id);
        if (key) seenMedia.add(key);
        changed = true;
      }
      if (changed) scheduleRefresh();
      return changed;
    }

    return Object.freeze({
      searchIndex,
      rebuild,
      registerRuntimeItems
    });
  }

  root.JOGAHUB_CATALOG_CORE = Object.freeze({
    types,
    typeOrder,
    gameCategories,
    normalize,
    createState
  });
})(window);
