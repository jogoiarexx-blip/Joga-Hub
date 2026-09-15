/* JogaHub 1.2.31 — detector de layout PC / tablet / celular */
(() => {
  const root=document.documentElement;
  let current='';
  function mode(w){return w<=767?'mobile':w<=1199?'tablet':'desktop'}
  function apply(){const b=document.body;if(!b)return;const next=mode(window.innerWidth||document.documentElement.clientWidth||1280);if(next===current)return;current=next;b.classList.remove('layout-mobile','layout-tablet','layout-desktop');b.classList.add(`layout-${next}`);b.dataset.layout=next;root.dataset.layout=next;window.dispatchEvent(new CustomEvent('jogahub:layoutchange',{detail:{layout:next,width:window.innerWidth}}));}
  let raf=0;const schedule=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(apply)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  window.addEventListener('resize',schedule,{passive:true});
  window.addEventListener('orientationchange',()=>setTimeout(apply,120),{passive:true});
  window.JogaHubResponsive={apply,get layout(){return current}};
})();