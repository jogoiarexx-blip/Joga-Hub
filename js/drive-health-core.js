/* Histórico local e limitado de diagnósticos do Google Drive.
 * Não armazena títulos, URLs, chaves de recurso ou dados de conta.
 * "Compatível" significa modo alternativo, NÃO reprodução confirmada.
 */
(function(root){
  'use strict';
  const KEY='jogahub.drive.health.v1';
  const VALID_ISSUES=new Set(['access','missing','limited','offline','network','codec','response','timeout','unknown']);
  const STATES=new Set(['failed','direct','compatible']);
  const MAX=120, AGE=45*24*60*60*1000;
  const validId=id=>typeof id==='string'&&/^[A-Za-z0-9_-]{1,200}$/.test(id);
  function createStore(storage=root.localStorage,now=()=>Date.now()){
    function read(){
      let raw=[];
      try{const parsed=JSON.parse(storage?.getItem(KEY)||'[]');raw=Array.isArray(parsed)?parsed:[]}catch{}
      const current=now();
      const unique=new Set();
      return raw.filter(item=>{
        if(!item||!validId(item.fileId)||!STATES.has(item.state)||
           !Number.isFinite(item.updatedAt)||item.updatedAt>current||
           current-item.updatedAt>AGE||unique.has(item.fileId))return false;
        unique.add(item.fileId);
        return true;
      }).sort((a,b)=>b.updatedAt-a.updatedAt).slice(0,MAX)
        .map(item=>({fileId:item.fileId,state:item.state,
          code:VALID_ISSUES.has(item.code)?item.code:'',
          status:Number.isInteger(item.status)&&item.status>=100&&item.status<=599?item.status:0,
          updatedAt:item.updatedAt,failures:Math.min(999,Math.max(0,Number(item.failures)||0))}));
    }
    function write(rows){
      try{storage?.setItem(KEY,JSON.stringify(rows.slice(0,MAX)))}catch{}
      try{root.dispatchEvent?.(new Event('jogahub:drive-health'))}catch{}
    }
    function record(fileId,state,code='',status=0){
      if(!validId(fileId)||!STATES.has(state))return false;
      const rows=read(),prev=rows.find(x=>x.fileId===fileId);
      const clean=rows.filter(x=>x.fileId!==fileId);
      const next={fileId,state,code:VALID_ISSUES.has(code)?code:'',
        status:Number.isInteger(status)&&status>=100&&status<=599?status:0,
        updatedAt:now(),failures:state==='failed'?Math.min(999,(prev?.failures||0)+1):prev?.failures||0};
      write([next,...clean]);
      return true;
    }
    function remove(fileId){
      if(!validId(fileId))return false;
      write(read().filter(x=>x.fileId!==fileId));return true;
    }
    function clear(){write([])}
    function summarize(items=[]){
      const ids=new Set(items.filter(x=>x?.driveFileId&&validId(x.driveFileId)).map(x=>x.driveFileId));
      const rows=read().filter(x=>ids.has(x.fileId));
      return {total:ids.size,failed:rows.filter(x=>x.state==='failed').length,
        direct:rows.filter(x=>x.state==='direct').length,
        compatible:rows.filter(x=>x.state==='compatible').length,
        untested:Math.max(0,ids.size-rows.length)};
    }
    return Object.freeze({read,recordFailure:(id,issue,status=0)=>record(id,'failed',issue,status),
      recordSuccess:id=>record(id,'direct'),recordCompatible:(id,issue='codec')=>record(id,'compatible',issue),
      remove,clear,summarize});
  }
  root.JOGAHUB_DRIVE_HEALTH=Object.freeze({KEY,createStore});
})(window);
