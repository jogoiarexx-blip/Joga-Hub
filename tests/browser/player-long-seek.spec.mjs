import {test,expect} from '@playwright/test';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

let tmp='',movie=null;
const id='qa-long-seek-webm-01';
test.beforeAll(()=>{
  tmp=mkdtempSync(join(tmpdir(),'jogahub-long-'));
  const file=join(tmp,'timeline.webm');
  // Linha do tempo de 65 segundos em arquivo pequeno; verifica seek real do
  // navegador, mas NÃO simula latência ou tamanho de um filme de 4 GiB.
  execFileSync('ffmpeg',['-hide_banner','-loglevel','error',
    '-f','lavfi','-i','color=c=blue:size=48x48:rate=2',
    '-f','lavfi','-i','sine=frequency=440:sample_rate=48000',
    '-t','65','-c:v','libvpx','-b:v','14k','-deadline','realtime','-cpu-used','8',
    '-c:a','libopus','-b:a','24k','-y',file]);
  movie=readFileSync(file);
});
test.afterAll(()=>{if(tmp)rmSync(tmp,{recursive:true,force:true})});
test.beforeEach(async({page})=>{
  await page.route(/^https?:\/\/(?!127\.0\.0\.1:4173)/,route=>route.abort());
});
async function mediaRoutes(page){
  const requests=[];
  await page.route(/https:\/\/(?:drive\.usercontent\.google\.com\/download|drive\.google\.com\/uc)\?/,async route=>{
    const range=route.request().headers().range||'';
    requests.push({method:route.request().method(),range});
    const match=/^bytes=(\d+)-(\d*)$/.exec(range);
    const start=match?Number(match[1]):0;
    const end=match&&match[2]?Math.min(movie.length-1,Number(match[2])):movie.length-1;
    if(start>=movie.length){
      await route.fulfill({status:416,headers:{'Content-Range':'bytes */'+movie.length,'Access-Control-Allow-Origin':'*'}});
      return;
    }
    const chunk=movie.subarray(start,end+1);
    const headers={'Content-Type':'video/webm','Content-Length':String(chunk.length),
      'Accept-Ranges':'bytes','Access-Control-Allow-Origin':'*'};
    if(match)headers['Content-Range']='bytes '+start+'-'+end+'/'+movie.length;
    await route.fulfill({status:match?206:200,headers,body:chunk});
  });
  return requests;
}
function href(){
  return '/link-player.html?'+new URLSearchParams({
    id:'drive-auto-'+id,provider:'iframe',type:'filme',title:'Teste linha longa',
    driveFileId:id,driveName:'linha-longa.webm',driveMime:'video/webm',
    url:'https://drive.google.com/file/d/'+id+'/preview',
    external:'https://drive.google.com/file/d/'+id+'/view'
  });
}
async function jump(page,time){
  await page.locator('#seekBar').evaluate((element,value)=>{
    const video=document.getElementById('video');
    element.value=String(Math.round(value/video.duration*1000));
    element.dispatchEvent(new Event('input',{bubbles:true}));
    element.dispatchEvent(new Event('change',{bubbles:true}));
  },time);
  await expect.poll(()=>page.locator('#video').evaluate(v=>v.currentTime),
    {timeout:15000}).toBeGreaterThan(time-1.6);
}
test('busca para 32s, 55s e volta 11s sem travamento @crossbrowser',async({page})=>{
  const req=await mediaRoutes(page);
  await page.goto(href(),{waitUntil:'domcontentloaded'});
  await expect(page.locator('#stage')).toHaveClass(/enhanced/,{timeout:20000});
  const duration=await page.locator('#video').evaluate(v=>v.duration);
  expect(duration).toBeGreaterThan(60);
  await jump(page,32);
  await expect.poll(()=>page.locator('#video').evaluate(v=>v.seeking)).toBe(false);
  await jump(page,55);
  await jump(page,11);
  await page.locator('#statsBtn').click();
  await expect(page.locator('#statsGrid')).toContainText('Última busca');
  await expect(page.locator('#statsGrid')).toContainText('Avanço confirmado',{timeout:15000});
  expect(req.length).toBeGreaterThan(0);
  expect(req.every(r=>r.method==='GET'||r.method==='HEAD')).toBe(true);
  await expect(page.locator('#stage')).toHaveClass(/enhanced/);
});
test('retoma aos 33s após recarregar sem voltar ao começo',async({page})=>{
  await mediaRoutes(page);
  await page.goto(href(),{waitUntil:'domcontentloaded'});
  await expect(page.locator('#stage')).toHaveClass(/enhanced/,{timeout:20000});
  await jump(page,33);
  await expect.poll(()=>page.locator('#video').evaluate(v=>v.seeking)).toBe(false);
  await page.locator('#video').evaluate(v=>v.pause());
  await expect.poll(()=>page.evaluate(id=>JSON.parse(localStorage.getItem('jogahub.movie.progress.drive-auto-'+id)||'null')?.time||0,id),
    {timeout:8000}).toBeGreaterThan(30);
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('#stage')).toHaveClass(/enhanced/,{timeout:20000});
  await expect.poll(()=>page.locator('#video').evaluate(v=>v.currentTime),{timeout:15000}).toBeGreaterThan(30);
});
test('selecionar posição atual não causa falso timeout ou nova requisição',async({page})=>{
  await mediaRoutes(page);
  await page.goto(href(),{waitUntil:'domcontentloaded'});
  await expect(page.locator('#stage')).toHaveClass(/enhanced/,{timeout:20000});
  await page.locator('#seekBar').evaluate(el=>{
    const v=document.getElementById('video');
    el.value=String(Math.round(v.currentTime/v.duration*1000));
    el.dispatchEvent(new Event('change',{bubbles:true}));
  });
  await page.locator('#statsBtn').click();
  await expect(page.locator('#statsGrid')).toContainText('Posição já selecionada');
  await expect(page.locator('#seekHealthNotice')).toBeHidden();
});
