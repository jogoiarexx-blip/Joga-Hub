/* Legendas externas do Drive: associação conservadora e conversão SRT->WebVTT.
 * Não contorna CORS ou permissões; só integra arquivos já acessíveis.
 */
(function(root){
 'use strict';
 function normalize(f){return {id:String(f?.id||''),name:String(f?.name||f?.nome||''),path:String(f?.path||f?.caminho||''),mime:String(f?.mime||''),resourceKey:String(f?.resourceKey||f?.resourcekey||'')}}
 function parent(f){return normalize(f).path.replace(/\/+$/,'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
 function base(f){return normalize(f).name.replace(/\.(mp4|m4v|webm|mkv|avi|mov|ogv|srt|vtt)$/i,'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim()}
 function episode(f){let m=normalize(f).name.match(/(?:^|[^\da-z])s(\d{1,2})e(\d{1,3})(?:[^\da-z]|$)/i);return m?Number(m[1])+':'+Number(m[2]):''}
 function match(video,subtitle){
   if(!video?.id||!subtitle?.id||video.id===subtitle.id||parent(video)!==parent(subtitle))return false;
   const exact=base(video)&&base(video)===base(subtitle);
   if(exact)return true;
   const a=episode(video),b=episode(subtitle);
   return !!a&&a===b;
 }
 function attach(videos,subtitles){
   const tracks=(subtitles||[]).map(normalize).filter(f=>f.id&&/\.(srt|vtt)$/i.test(f.name));
   const used=new Set();
   const result=new Map();
   for(const raw of videos||[]){
     const f=normalize(raw);if(!f.id)continue;
     const matching=tracks.filter(track=>match(f,track)&&!used.has(track.id));
     const exact=matching.filter(t=>base(f)===base(t));
     const selected=exact.length?exact:matching.length===1?matching:[];
     if(selected.length){
       result.set(f.id,selected.slice(0,4).map(t=>({id:t.id,name:t.name,path:t.path,
         format:/\.vtt$/i.test(t.name)?'vtt':'srt',resourceKey:t.resourceKey})));
       selected.forEach(t=>used.add(t.id));
     }
   }
   return result;
 }
 function externalUrl(file){
   const id=String(file?.id||'');
   if(!/^[a-z0-9_-]{8,200}$/i.test(id))return '';
   const key=String(file?.resourceKey||'').trim();
   return 'https://drive.google.com/file/d/'+encodeURIComponent(id)+'/view'+(key?'?resourcekey='+encodeURIComponent(key):'');
 }
 function downloadUrl(file){
   const id=String(file?.id||'');
   if(!/^[a-z0-9_-]{8,200}$/i.test(id))return '';
   const key=String(file?.resourceKey||'').trim();
   return 'https://drive.usercontent.google.com/download?id='+encodeURIComponent(id)+'&export=download'+
     (key?'&resourcekey='+encodeURIComponent(key):'');
 }
 function toVtt(srt){
   let text=String(srt||'').replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n').trim();
   if(text.startsWith('WEBVTT'))return text+'\n';
   // O formato SRT deve ter cue com intervalo temporal. Não transformar HTML/login em VTT.
   if(!/(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/.test(text))return '';
   // Escapar markup injetado, preservando apenas texto visível.
   text=text.replace(/<[^>]*>/g,'');
   text=text.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}),(\d{3})/g,'$1.$2 --> $3.$4');
   return 'WEBVTT\n\n'+text+'\n';
 }
 root.JOGAHUB_DRIVE_SUBTITLE_CORE=Object.freeze({attach,match,externalUrl,downloadUrl,toVtt});
})(window);
