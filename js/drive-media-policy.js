/* JogaHub — classificação de arquivos do Drive.
 * Mime octet-stream sozinho não é evidência de vídeo.
 */
(function(root){
  'use strict';
  const VIDEO_EXT=/\.(?:mp4|m4v|mkv|webm|mov|avi|wmv|flv|ogv|mpeg|mpg|3gp|ts|m2ts)$/i;
  const SUB_EXT=/\.(?:srt|vtt|ass|ssa|sub|ttml|sbv)$/i;
  const BAD_EXT=/\.(?:website|html?|json|txt|pdf|zip|rar|7z|exe|url|lnk)$/i;
  function isSubtitle(file){
    const name=String(file?.name??file?.nome??'').trim();
    const mime=String(file?.mime||'').toLowerCase().split(';')[0].trim();
    return SUB_EXT.test(name)||mime==='application/x-subrip'||mime==='text/vtt';
  }
  function isVideo(file){
    const name=String(file?.name??file?.nome??'').trim();
    const mime=String(file?.mime||'').toLowerCase().split(';')[0].trim();
    if(!name||isSubtitle(file)||BAD_EXT.test(name))return false;
    if(VIDEO_EXT.test(name))return true;
    // Sem extensão: só aceitar se o tipo MIME confirmar vídeo.
    return !/\.[a-z0-9]{1,8}$/i.test(name)&&mime.startsWith('video/');
  }
  root.JOGAHUB_DRIVE_MEDIA_POLICY=Object.freeze({isVideo,isSubtitle});
})(window);
