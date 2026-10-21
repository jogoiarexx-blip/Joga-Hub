/* JogaHub Drive route planner.
 * Persist only the route ID, never a full download URL or resourcekey.
 * A previously saved URL is migrated to a safe route ID on first read.
 */
(function(root){
  'use strict';
  const MAX_AGE_MS=30*24*60*60*1000;
  const ROUTES=Object.freeze(['usercontent','uc']);
  function isValidFileId(id){
    return /^[A-Za-z0-9_-]{8,200}$/.test(String(id||''));
  }
  function routeFromUrl(value){
    if(typeof value!=='string')return null;
    try{
      const url=new URL(value);
      if(url.protocol!=='https:')return null;
      if(url.hostname==='drive.usercontent.google.com'&&url.pathname==='/download')return 'usercontent';
      if(url.hostname==='drive.google.com'&&url.pathname==='/uc')return 'uc';
    }catch{}
    return null;
  }
  function routeId(value){
    return ROUTES.includes(value)?value:routeFromUrl(value);
  }
  function normalizePreference(raw,now=Date.now()){
    if(!raw||typeof raw!=='object')return null;
    const updatedAt=Number(raw.updatedAt);
    if(!Number.isFinite(updatedAt)||updatedAt<=0||now<updatedAt||now-updatedAt>MAX_AGE_MS)return null;
    const route=routeId(raw.route||raw.url);
    if(!route)return null;
    return {route,updatedAt,elapsed:Math.max(0,Math.min(120000,Number(raw.elapsed)||0))};
  }
  function readPreference(storage,key,now=Date.now()){
    let raw=null;
    try{raw=storage?.getItem?.(key)}catch{return null}
    if(!raw)return null;
    let decoded=null;
    try{decoded=JSON.parse(raw)}catch{}
    const pref=normalizePreference(decoded,now);
    // Erase legacy entries even when invalid or stale to avoid retaining
    // access parameters or old signed URLs in browser storage.
    if(!pref||decoded?.url||decoded?.route!==pref.route){
      try{
        if(pref)storage?.setItem?.(key,JSON.stringify(pref));
        else storage?.removeItem?.(key);
      }catch{}
    }
    return pref;
  }
  function savePreference(storage,key,route,elapsed=0,now=Date.now()){
    const name=routeId(route);
    if(!name)return false;
    try{
      storage?.setItem?.(key,JSON.stringify({route:name,updatedAt:now,
        elapsed:Math.max(0,Math.min(120000,Math.round(Number(elapsed)||0)))}));
      return true;
    }catch{return false}
  }
  function candidates(fileId,resourceKey='',preference=null){
    if(!isValidFileId(fileId))return [];
    const id=encodeURIComponent(String(fileId));
    const key=resourceKey?'&resourcekey='+encodeURIComponent(String(resourceKey)):'';
    const opts={
      usercontent:'https://drive.usercontent.google.com/download?id='+id+'&export=download&confirm=t'+key,
      uc:'https://drive.google.com/uc?export=download&id='+id+key
    };
    const preferred=routeId(preference?.route);
    const order=preferred?[preferred,...ROUTES.filter(r=>r!==preferred)]:ROUTES;
    return order.map(route=>({route,url:opts[route]}));
  }
  root.JOGAHUB_PLAYER_DRIVE_ROUTES=Object.freeze({
    candidates,readPreference,savePreference,normalizePreference,routeId,isValidFileId
  });
})(window);
