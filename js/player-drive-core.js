/* JogaHub Player — regras isoladas para Drive, fallback e retomada.
 * Não faz requisições: as tentativas de mídia continuam no player HTML.
 */
(function(root) {
  'use strict';
  const COMPATIBLE_NAME = /\.(?:mkv|avi|wmv|flv|mov)(?:$|[?#])/i;
  const COMPATIBLE_MIME = /matroska|x-msvideo|quicktime|x-ms-wmv|x-flv/i;

  function needsCompatiblePlayer(name='', mime='') {
    return COMPATIBLE_NAME.test(String(name || '')) || COMPATIBLE_MIME.test(String(mime || ''));
  }

  function makeSession() {
    let revision = 0;
    let mode = 'idle';
    let recovering = false;

    function beginDirect() {
      revision += 1;
      mode = 'loading';
      recovering = false;
      return revision;
    }
    function isCurrent(rev) {
      return revision === rev && mode !== 'compatible';
    }
    function confirmDirect(rev) {
      if (!isCurrent(rev)) return false;
      mode = 'direct';
      return true;
    }
    function switchToCompatible() {
      revision += 1;
      mode = 'compatible';
      recovering = false;
      return revision;
    }
    function failDirect(rev) {
      if (!isCurrent(rev)) return false;
      mode = 'failed';
      return true;
    }
    function beginRecovery() {
      if (mode !== 'direct' || recovering) return null;
      recovering = true;
      return revision;
    }
    function endRecovery(rev) {
      if (revision !== rev) return false;
      recovering = false;
      return mode === 'direct';
    }
    return Object.freeze({
      beginDirect,isCurrent,confirmDirect,switchToCompatible,failDirect,
      beginRecovery,endRecovery,getMode:() => mode
    });
  }

  function hasExactProgress(value) {
    return !!value && !value.episodeOnly &&
      Number.isFinite(Number(value.time)) && Number(value.time) >= 0 &&
      Number.isFinite(Number(value.duration)) && Number(value.duration) > 0;
  }
  function episodeProgress(previous,episode) {
    // Nunca substitua um tempo válido por uma marca imprecisa do iframe.
    if (hasExactProgress(previous)) return previous;
    return {
      episodeOnly:true,
      updatedAt:Date.now(),
      provider:'drive',
      seriesId:episode?.seriesId||'',
      season:episode?.season||1,
      episode:episode?.episode||0
    };
  }

  function shouldTrackStall({paused=false,ended=false,seeking=false,readyState=0,buffer=0}={}) {
    return !paused && !ended && !seeking && readyState > 0 && buffer < 3;
  }

  root.JOGAHUB_PLAYER_DRIVE_CORE=Object.freeze({
    needsCompatiblePlayer,makeSession,hasExactProgress,episodeProgress,shouldTrackStall
  });
})(window);
