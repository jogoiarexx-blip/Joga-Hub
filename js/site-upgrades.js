/* JogaHub 1.2.43 — melhorias globais */
(function(){
'use strict';
const KEY='jogahub_drive_sync_url';
function toast(msg){
 let el=document.getElementById('jhGlobalToast');
 if(!el){el=document.createElement('div');el.id='jhGlobalToast';el.style.cssText='position:fixed;left:50%;bottom:24px;transform:translate(-50%,20px);z-index:99999;opacity:0;pointer-events:none;max-width:92vw;padding:11px 15px;border:1px solid rgba(255,255,255,.12);border-radius:12px;background:rgba(8,12,19,.96);color:#eef7ff;font:700 12px system-ui;box-shadow:0 18px 55px rgba(0,0,0,.45);transition:.2s ease';document.body.appendChild(el)}
 el.textContent=msg;el.style.opacity='1';el.style.transform='translate(-50%,0)';clearTimeout(el._t);el._t=setTimeout(function(){el.style.opacity='0';el.style.transform='translate(-50%,20px)'},2800);
}
function refresh(){try{if(typeof renderTypeTabs==='function')renderTypeTabs();if(typeof renderFeatured==='function')renderFeatured();if(typeof renderHomeDashboard==='function')renderHomeDashboard();if(typeof setView==='function')setView(typeof activeType==='string'?activeType:'todos')}catch(e){console.warn('JogaHub refresh',e)}}
function installDrivePanel(){
 const panel=document.querySelector('#settingsModal .settings-panel');if(!panel||document.getElementById('driveSyncPanel'))return;
 const wrap=document.createElement('div');wrap.id='driveSyncPanel';wrap.style.cssText='margin-top:12px;padding:15px;border:1px solid rgba(255,255,255,.09);border-radius:14px;background:rgba(255,255,255,.035)';
 wrap.innerHTML='<div style="display:flex;gap:10px;align-items:flex-start"><div style="font-size:22px">☁️</div><div style="min-width:0;flex:1"><strong style="display:block;font:800 13px system-ui;color:#fff">Acervo único do Google Drive</strong><small style="display:block;margin:5px 0 10px;color:#8997a9;line-height:1.45">Cole a URL <b>/exec</b> do Google Apps Script para importar todos os filmes, séries e subpastas do acervo principal.</small><input id="jhDriveUrl" type="url" placeholder="https://script.google.com/macros/s/.../exec" autocomplete="off" style="width:100%;box-sizing:border-box;padding:10px 11px;border-radius:9px;border:1px solid rgba(255,255,255,.1);background:#0a1018;color:#fff"><div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:9px"><button id="jhDriveSave" type="button" style="padding:9px 11px;border:0;border-radius:9px;background:linear-gradient(135deg,#27c7f5,#765cff);color:#fff;font:800 11px system-ui;cursor:pointer">Sincronizar agora</button><button id="jhDriveClear" type="button" style="padding:9px 11px;border:1px solid rgba(255,255,255,.1);border-radius:9px;background:#141c28;color:#c8d3df;font:700 11px system-ui;cursor:pointer">Limpar cache</button></div><div id="jhDriveStatus" style="margin-top:8px;color:#718095;font:600 10px system-ui"></div></div></div>';
 panel.appendChild(wrap);
 const input=wrap.querySelector('#jhDriveUrl'),status=wrap.querySelector('#jhDriveStatus');input.value=localStorage.getItem(KEY)||'';
 function paint(){status.textContent=input.value?'✓ URL configurada — sincronização automática habilitada.':'Cole a URL /exec para habilitar a sincronização.'}paint();
 wrap.querySelector('#jhDriveSave').onclick=async function(){
  const url=input.value.trim();
  if(!/^https:\/\/script\.google\.com\/macros\/s\/[^\s]+\/exec(?:\?.*)?$/i.test(url)){status.textContent='URL inválida. Use a URL /exec da implantação do Apps Script.';return}
  status.textContent='Sincronizando as pastas…';
  try{if(!window.JOGAHUB_DRIVE_SYNC)throw new Error('sincronizador ausente');await window.JOGAHUB_DRIVE_SYNC.configure(url);const n=Number(window.JOGAHUB_DRIVE_SYNC_COUNT||0);status.textContent=n?'✓ '+n+' novos arquivos importados. Atualizando catálogo…':'✓ conexão realizada, mas nenhum vídeo novo foi encontrado.';refresh();toast(n?'Drive sincronizado: '+n+' novos arquivos.':'Drive conectado, mas nenhum vídeo novo foi encontrado.')}catch(e){status.textContent='Não foi possível sincronizar. Confira a implantação e as permissões do Apps Script.';toast('Falha na sincronização do Google Drive.')}
 };
 wrap.querySelector('#jhDriveClear').onclick=function(){localStorage.removeItem(KEY);window.JOGAHUB_DRIVE_SYNC&&window.JOGAHUB_DRIVE_SYNC.clear();input.value='';paint();toast('Sincronização do Drive desativada.')};
}
function shortcuts(){
 document.addEventListener('keydown',function(e){
  const tag=(e.target&&e.target.tagName||'').toLowerCase(),typing=tag==='input'||tag==='textarea'||(e.target&&e.target.isContentEditable);
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();document.getElementById('search')?.focus();return}
  if(e.key==='/'&&!typing){e.preventDefault();document.getElementById('search')?.focus();return}
  if(e.key==='Escape'){document.querySelectorAll('.settings-modal,.downloads-modal').forEach(function(x){x.hidden=true})}
 });
}
function imageFallbacks(){document.addEventListener('error',function(e){const img=e.target;if(img instanceof HTMLImageElement&&!img.dataset.jhFallback){img.dataset.jhFallback='1';img.src='assets/icon-512.png'}},true)}
function boot(){installDrivePanel();shortcuts();imageFallbacks();window.addEventListener('online',function(){toast('Conexão restaurada.');if(localStorage.getItem(KEY)&&window.JOGAHUB_DRIVE_SYNC)window.JOGAHUB_DRIVE_SYNC.sync()});window.addEventListener('offline',function(){toast('Você está offline. Conteúdo local disponível continua acessível.')});if(localStorage.getItem(KEY)&&window.JOGAHUB_DRIVE_SYNC)setInterval(function(){if(navigator.onLine)window.JOGAHUB_DRIVE_SYNC.sync().then(function(n){if(n){refresh();toast('Novos conteúdos do Drive encontrados: '+n) }})},600000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,0)});else setTimeout(boot,0);
})();
