import {test,expect} from '@playwright/test';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

let dir='',movie;
const fileId='qa-drive-reconnect-video-01';
test.beforeAll(()=>{
  dir=mkdtempSync(join(tmpdir(),'jogahub-reconnect-'));
  const file=join(dir,'reconnect.webm');
  execFileSync('ffmpeg',['-hide_banner','-loglevel','error',
    '-f','lavfi','-i','color=c=blue:size=32x32:rate=3',
    '-f','lavfi','-i','sine=frequency=440:sample_rate=48000',
    '-t','3','-c:v','libvpx','-b:v','12k','-deadline','realtime','-cpu-used','8',
    '-c:a','libopus','-b:a','36k','-y',file]);
  movie=readFileSync(file);
});
test.afterAll(()=>{if(dir)rmSync(dir,{recursive:true,force:true})});
function playerUrl(){
  return '/link-player.html?'+new URLSearchParams({
    id:'drive-auto-'+fileId,driveFileId:fileId,
    provider:'iframe',type:'filme',title:'Rede QA',
    driveName:'reconnect.webm',driveMime:'video/webm',
    url:'https://drive.google.com/file/d/'+fileId+'/preview',
    external:'https://drive.google.com/file/d/'+fileId+'/view'
  });
}
test.beforeEach(async({page})=>{
  await page.addInitScript(()=>{
    window.__qaOnline=true;
    Object.defineProperty(navigator,'onLine',{configurable:true,get:()=>window.__qaOnline});
  });
  await page.route(/^https?:\/\/(?!127\.0\.0\.1:4173)/,route=>route.abort());
});
async function mediaRoute(page){
  let attempts=0;
  await page.route(/https:\/\/(?:drive\.usercontent\.google\.com\/download|drive\.google\.com\/uc)\?/,route=>{
    attempts++;
    const range=route.request().headers().range||'';
    const m=/^bytes=(\d+)-(\d*)$/.exec(range);
    const start=m?Number(m[1]):0;
    const end=m&&m[2]?Math.min(movie.length-1,Number(m[2])):movie.length-1;
    const chunk=movie.subarray(start,end+1);
    const headers={'Content-Type':'video/webm','Content-Length':String(chunk.length),
      'Access-Control-Allow-Origin':'*','Accept-Ranges':'bytes'};
    if(m)headers['Content-Range']='bytes '+start+'-'+end+'/'+movie.length;
    return route.fulfill({status:m?206:200,headers,body:chunk});
  });
  return ()=>attempts;
}
async function changeNetwork(page,isOnline){
  await page.evaluate(online=>{
    window.__qaOnline=online;
    window.dispatchEvent(new Event(online?'online':'offline'));
  },isOnline);
}

test('início offline evita requisições e retenta uma vez após reconectar @crossbrowser',async({page})=>{
  const attempts=await mediaRoute(page);
  await page.addInitScript(()=>{window.__qaOnline=false});
  await page.goto(playerUrl(),{waitUntil:'domcontentloaded'});
  await expect(page.locator('#stage')).toHaveClass(/fallback/,{timeout:12000});
  await expect(page.locator('#driveDiagnostic')).toHaveAttribute('data-reason','offline');
  expect(attempts()).toBe(0);
  await changeNetwork(page,true);
  await expect(page.locator('#stage')).toHaveClass(/enhanced/,{timeout:18000});
  await expect(page.locator('#driveDiagnostic')).toBeHidden();
  expect(attempts()).toBeGreaterThan(0);
});

test('queda durante vídeo direto mantém ponto e recupera quando internet volta @crossbrowser',async({page})=>{
  const attempts=await mediaRoute(page);
  await page.goto(playerUrl(),{waitUntil:'domcontentloaded'});
  await expect(page.locator('#stage')).toHaveClass(/enhanced/,{timeout:18000});
  await page.locator('#video').evaluate(v=>{v.currentTime=.8;v.pause()});
  await expect.poll(()=>page.locator('#video').evaluate(v=>v.currentTime)).toBeGreaterThan(.6);
  await changeNetwork(page,false);
  const before=attempts();
  await page.evaluate(()=>document.getElementById('retryPlaybackBtn').click());
  await expect(page.locator('#stage')).toHaveClass(/enhanced/);
  await expect(page.locator('#recoveryText')).toContainText('conexão');
  expect(attempts()).toBe(before);
  await changeNetwork(page,true);
  await expect(page.locator('#stage')).not.toHaveClass(/recovering/,{timeout:18000});
  await expect.poll(()=>attempts(),{timeout:18000}).toBeGreaterThan(before);
  await expect.poll(()=>page.locator('#video').evaluate(v=>v.currentTime),{timeout:18000}).toBeGreaterThan(.6);
  await expect(page.locator('#stage')).toHaveClass(/enhanced/);
});

test('seleção manual do modo Drive não é revertida ao reconectar',async({page})=>{
  const attempts=await mediaRoute(page);
  await page.goto(playerUrl(),{waitUntil:'domcontentloaded'});
  await expect(page.locator('#stage')).toHaveClass(/enhanced/,{timeout:18000});
  await page.locator('#driveModeBtn').click();
  await expect(page.locator('#stage')).toHaveClass(/fallback/);
  const prev=attempts();
  await changeNetwork(page,false);
  await changeNetwork(page,true);
  await page.waitForTimeout(1500);
  await expect(page.locator('#stage')).toHaveClass(/fallback/);
  expect(attempts()).toBe(prev);
});
