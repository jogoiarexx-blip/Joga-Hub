/* Painel de diagnóstico do Drive — lê apenas dados locais.
 * O iframe do Drive não confirma playback: estado compatível não é sucesso.
 */
(function(root){
  'use strict';
  const core=root.JOGAHUB_DRIVE_HEALTH;
  if(!core)return;
  const health=core.createStore();
  const $=id=>document.getElementById(id);
  const norm=value=>String(value||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const labels={
    access:'Acesso restrito',missing:'Arquivo não encontrado',limited:'Limite do Drive',
    offline:'Sem conexão',network:'Falha de rede',codec:'Formato incompatível',
    response:'Resposta inválida',timeout:'Carregamento excedido',unknown:'Causa não confirmada'
  };
  let filter='all',term='',limit=40,lastOpener=null;
  function items(){
    const map=new Map();
    for(const item of root.JOGAHUB_ITEMS||[]){
      if(item?.driveFileId&&!map.has(item.driveFileId))map.set(item.driveFileId,item);
    }
    return map;
  }
  function playerUrl(item){
    const id=String(item.driveFileId);
    const raw=item.sourceUrl||'';
    let url='https://drive.google.com/file/d/'+encodeURIComponent(id)+'/view';
    let key=String(item.driveResourceKey||'').trim();
    try{
      const candidate=new URL(raw);
      if(candidate.hostname==='drive.google.com'&&candidate.protocol==='https:'){
        url=candidate.href;
        key=key||candidate.searchParams.get('resourcekey')||'';
      }
    }catch{}
    if(key){
      const external=new URL(url);external.searchParams.set('resourcekey',key);url=external.href;
    }
    const preview='https://drive.google.com/file/d/'+encodeURIComponent(id)+'/preview'+(key?'?resourcekey='+encodeURIComponent(key):'');
    const params=new URLSearchParams({
      url:preview,external:url,id:String(item.id||'drive-auto-'+id),
      driveFileId:id,driveResourceKey:key,driveName:String(item._driveName||''),
      driveMime:String(item.driveMime||''),provider:'iframe',type:'filme',
      title:String(item.title||'Conteúdo Drive'),seriesId:String(item.seriesId||''),
      seriesTitle:String(item.seriesTitle||''),season:String(item.season||''),
      episode:String(item.episode||'')
    });
    return 'link-player.html?'+params;
  }
  const make=(tag,cls,text)=>{
    const el=document.createElement(tag);
    if(cls)el.className=cls;
    if(text!==undefined)el.textContent=String(text);
    return el;
  };
  function description(row){
    if(!row)return {title:'Sem teste',detail:'O player ainda não tentou abrir diretamente este arquivo.'};
    if(row.state==='direct')return {title:'Direto carregado',detail:'O navegador carregou metadados do vídeo; isso não confirma que todo o filme foi assistido.'};
    if(row.state==='compatible')return {title:'Modo Drive',detail:'Arquivo direcionado ao player compatível; a reprodução no iframe não pode ser verificada pelo JogaHub.'};
    return {title:'Falha direta',detail:labels[row.code]||labels.unknown};
  }
  function render(){
    const panel=$('driveHealthModal');
    if(!panel||panel.hidden)return;
    const catalog=items(),records=health.read(),byId=new Map(records.map(x=>[x.fileId,x]));
    const sum=health.summarize([...catalog.values()]);
    $('driveHealthSummary').textContent=sum.total+' arquivos Drive no catálogo · '+sum.failed+' com falha · '+sum.compatible+' em modo compatível · '+sum.direct+' com carga direta · '+sum.untested+' sem teste';
    const candidates=[...catalog.values()].map(item=>({fileId:item.driveFileId,item,record:byId.get(item.driveFileId)||null}));
    const orphans=records.filter(rec=>!catalog.has(rec.fileId)).map(rec=>({fileId:rec.fileId,item:null,record:rec}));
    candidates.push(...orphans);
    const rank=entry=>entry.record?.state==='failed'?0:entry.record?.state==='compatible'?1:entry.record?.state==='direct'?2:3;
    candidates.sort((a,b)=>rank(a)-rank(b) || (b.record?.updatedAt||0)-(a.record?.updatedAt||0) ||
      String(a.item?.title||'').localeCompare(String(b.item?.title||''),'pt-BR',{sensitivity:'base'}));
    const match=(entry)=>{
      const state=entry.record?.state||'untested';
      if(filter==='failed'&&state!=='failed')return false;
      if(filter==='compatible'&&state!=='compatible')return false;
      if(filter==='direct'&&state!=='direct')return false;
      if(filter==='untested'&&state!=='untested')return false;
      return !term||norm([entry.item?.title,entry.item?.seriesTitle,entry.item?._driveName,
        labels[entry.record?.code]||'',description(entry.record).title].join(' ')).includes(term);
    };
    const visible=candidates.filter(match),host=$('driveHealthList');
    host.replaceChildren();
    $('driveHealthResults').textContent=visible.length+' resultado'+(visible.length===1?'':'s');
    for(const entry of visible.slice(0,limit)){
      const status=description(entry.record);
      const article=make('article','drive-health-item');
      article.dataset.fileId=entry.fileId;
      article.dataset.state=entry.record?.state||'untested';
      const copy=make('div','drive-health-copy');
      copy.append(make('strong','drive-health-title',entry.item?.title||'Arquivo fora do catálogo'));
      copy.append(make('span','drive-health-state',status.title+' · '+status.detail));
      if(entry.record?.updatedAt){
        copy.append(make('small','drive-health-date','Última verificação: '+
          new Date(entry.record.updatedAt).toLocaleString('pt-BR')));
      }
      const actions=make('div','drive-health-actions');
      if(entry.item){
        const link=make('a','drive-health-link','Abrir player');
        link.href=playerUrl(entry.item);actions.append(link);
        const retry=make('button','drive-health-retry','Testar direto');
        retry.type='button';retry.dataset.retryDrive=entry.fileId;actions.append(retry);
      }
      if(entry.record){
        const clear=make('button','drive-health-clear','Limpar registro');
        clear.type='button';clear.dataset.clearDrive=entry.fileId;actions.append(clear);
      }
      article.append(copy,actions);host.append(article);
    }
    $('driveHealthMore').hidden=visible.length<=limit;
    if(!visible.length)host.append(make('p','drive-health-empty',
      filter==='failed'?'Nenhuma falha registrada neste aparelho.':'Nenhum arquivo encontrado com os filtros atuais.'));
  }
  function open(){
    const modal=$('driveHealthModal');if(!modal)return;
    lastOpener=document.activeElement;
    modal.hidden=false;limit=40;render();
    $('driveHealthSearch').focus();
  }
  function close(){
    const modal=$('driveHealthModal');if(!modal)return;
    modal.hidden=true;lastOpener?.focus?.();
  }
  function init(){
    const modal=$('driveHealthModal');if(!modal)return;
    document.querySelectorAll('[data-action="drive-health"]').forEach(b=>b.addEventListener('click',open));
    $('closeDriveHealth')?.addEventListener('click',close);
    modal.addEventListener('click',e=>{if(e.target===modal)close()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden){e.stopImmediatePropagation();close()}},true);
    $('driveHealthSearch')?.addEventListener('input',e=>{term=norm(e.target.value.trim());limit=40;render()});
    $('driveHealthFilter')?.addEventListener('change',e=>{filter=e.target.value;limit=40;render()});
    $('driveHealthMore')?.addEventListener('click',()=>{limit+=40;render()});
    $('driveHealthClearAll')?.addEventListener('click',()=>{
      if(root.confirm('Apagar o histórico local de diagnósticos do Drive neste navegador?'))health.clear();
      render();
    });
    $('driveHealthList')?.addEventListener('click',e=>{
      const clear=e.target.closest('[data-clear-drive]'),retry=e.target.closest('[data-retry-drive]');
      if(clear){health.remove(clear.dataset.clearDrive);render();return}
      if(retry){
        const id=retry.dataset.retryDrive,item=items().get(id);if(!item)return;
        try{
          root.localStorage.removeItem('jogahub.drive.fail.'+id);
          root.localStorage.setItem('jogahub.drive.mode.'+(item.seriesId||item.id),'auto');
        }catch{}
        root.location.href=playerUrl(item);
      }
    });
    root.addEventListener('storage',e=>{if(e.key===core.KEY&& !modal.hidden)render()});
    root.addEventListener('jogahub:drive-health',()=>{if(!modal.hidden)render()});
    root.addEventListener('jogahub:drivesync',()=>{if(!modal.hidden)render()});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
  root.JOGAHUB_DRIVE_HEALTH_PANEL=Object.freeze({open,close});
})(window);
