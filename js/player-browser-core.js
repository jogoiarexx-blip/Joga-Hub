/* Compatibilidade do player entre Chromium, Firefox e Safari/WebKit.
 * Decisões de capacidades feitas em tempo de execução, não por user-agent.
 */
(function(root){
  'use strict';
  function fullscreenAvailable(target,video){
    return !!(target?.requestFullscreen||target?.webkitRequestFullscreen||
      video?.webkitEnterFullscreen||video?.webkitEnterFullScreen);
  }
  async function requestFullscreen(target,video){
    try{
      const request=target?.requestFullscreen||target?.webkitRequestFullscreen;
      if(typeof request==='function'){
        await request.call(target);
        return 'document';
      }
      const legacy=video?.webkitEnterFullscreen||video?.webkitEnterFullScreen;
      if(typeof legacy==='function'){
        legacy.call(video);
        return 'video';
      }
    }catch(error){return 'unavailable'}
    return 'unavailable';
  }
  function pictureInPictureAvailable(doc,video){
    return !!((doc?.pictureInPictureEnabled&&typeof video?.requestPictureInPicture==='function')||
      (typeof video?.webkitSetPresentationMode==='function'&&
       (typeof video.webkitSupportsPresentationMode!=='function'||
        video.webkitSupportsPresentationMode('picture-in-picture'))));
  }
  async function togglePictureInPicture(doc,video){
    if(!pictureInPictureAvailable(doc,video))return false;
    try{
      if(doc?.pictureInPictureEnabled&&video?.requestPictureInPicture){
        if(doc.pictureInPictureElement)await doc.exitPictureInPicture();
        else await video.requestPictureInPicture();
        return true;
      }
      const isPip=video.webkitPresentationMode==='picture-in-picture';
      video.webkitSetPresentationMode(isPip?'inline':'picture-in-picture');
      return true;
    }catch{return false}
  }
  function canPlayVideo(video,type){
    try{return !!video?.canPlayType?.(type)}catch{return false}
  }
  root.JOGAHUB_PLAYER_BROWSER_CORE=Object.freeze({
    fullscreenAvailable,requestFullscreen,pictureInPictureAvailable,
    togglePictureInPicture,canPlayVideo
  });
})(window);
