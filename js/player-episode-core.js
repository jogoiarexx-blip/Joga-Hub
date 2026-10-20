/* JogaHub — regras testáveis de sequência e reprodução de episódios.
 * Não depende de DOM, armazenamento nem de uma API de streaming.
 */
(function(root){
  'use strict';

  function episodeOrder(items){
    return [...(items||[])].sort((a,b)=>
      (Number(a?.season)||1)-(Number(b?.season)||1) ||
      (Number(a?.episode)||0)-(Number(b?.episode)||0) ||
      String(a?.title||'').localeCompare(String(b?.title||''),'pt-BR',{numeric:true,sensitivity:'base'})
    );
  }

  function findEpisodeIndex(sequence,current){
    if(!current)return -1;
    const id=String(current.id||'');
    let index=id?sequence.findIndex(item=>String(item.id||'')===id):-1;
    // Se o id mudou após nova sincronização, identifica por arquivo único.
    if(index<0&&current.driveFileId){
      const matches=sequence.map((item,i)=>item.driveFileId===current.driveFileId?i:-1).filter(i=>i>=0);
      if(matches.length===1)index=matches[0];
    }
    if(index<0&&current.youtubeId){
      const matches=sequence.map((item,i)=>item.youtubeId===current.youtubeId?i:-1).filter(i=>i>=0);
      if(matches.length===1)index=matches[0];
    }
    return index;
  }

  function episodeNeighbors(sequence,current){
    const index=findEpisodeIndex(sequence,current);
    if(index<0)return {found:false,index:-1,previous:null,next:null};
    return {
      found:true,index,
      previous:index>0?sequence[index-1]:null,
      next:index<sequence.length-1?sequence[index+1]:null
    };
  }

  function mayAutoAdvance({autoplayNext=false,suppressed=false,nextItem=null,currentItem=null,archivePlaylist=false,playlistId=''}={}){
    return !!autoplayNext&&!suppressed&&!!nextItem&&!playlistId&&
      (!!archivePlaylist || currentItem?.mediaType==='serie');
  }

  root.JOGAHUB_PLAYER_EPISODE_CORE=Object.freeze({
    episodeOrder,findEpisodeIndex,episodeNeighbors,mayAutoAdvance
  });
})(window);
