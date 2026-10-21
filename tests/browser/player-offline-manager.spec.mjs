import {test,expect} from '@playwright/test';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

let temp='',movie;
const archiveId='jogahub-offline-qa-2026',file='filme.webm',itemId='archive-offline-qa';
test.beforeAll(()=>{
  temp=mkdtempSync(join(tmpdir(),'jogahub-offline-'));
  const path=join(temp,file);
  execFileSync('ffmpeg',['-hide_banner','-loglevel','error',
    '-f','lavfi','-i','color=c=blue:size=32x32:rate=3',
    '-f','lavfi','-i','sine=frequency=440:sample_rate=48000',
    '-t','2','-c:v','libvpx','-b:v','12k','-deadline','realtime','-cpu-used','8',
    '-c:a','libopus','-b:a','32k','-y',path]);
  movie=readFileSync(path);
});
test.afterAll(()=>{if(temp)rmSync(temp,{recursive:true,force:true})});

function playerUrl(){
  return '/link-player.html?'+new URLSearchParams({
    id:itemId,provider:'archive',type:'filme',archiveId,
    title:'Filme de teste offline',
    url:'https://archive.org/embed/'+archiveId,
    external:'https://archive.org/details/'+archiveId
  });
}
async function fixtures(page,{partialDownload=false}={}){
  await page.route(/^https?:\/\/(?!127\.0\.0\.1:4173)/,route=>route.abort());
  await page.route('https://archive.org/metadata/'+archiveId,route=>route.fulfill({
    status:200,contentType:'application/json',
    body:JSON.stringify({files:[{name:file,format:'WebM',source:'original',size:String(movie.length)}]})
  }));
  await page.route('https://archive.org/download/'+archiveId+'/'+file,route=>{
    const range=route.request().headers().range;
    if(partialDownload&&!range){
      return route.fulfill({
        status:206,body:movie.subarray(0,1000),headers:{
          'Access-Control-Allow-Origin':'*',
          'Content-Type':'video/webm','Content-Range':'bytes 0-999/'+movie.length
        }
      });
    }
    const m=/^bytes=(\d+)-(\d*)$/.exec(range||'');
    const start=m?Number(m[1]):0;
    const end=m&&m[2]?Math.min(movie.length-1,Number(m[2])):movie.length-1;
    if(start>=movie.length)return route.fulfill({status:416,body:''});
    const bytes=movie.subarray(start,end+1);
    const headers={'Content-Type':'video/webm','Access-Control-Allow-Origin':'*',
      'Accept-Ranges':'bytes','Content-Length':String(bytes.length)};
    if(m)headers['Content-Range']='bytes '+start+'-'+end+'/'+movie.length;
    return route.fulfill({status:m?206:200,body:bytes,headers});
  });
}

test('salva vídeo inteiro no Cache API, mostra ✓ e remove pelo mesmo botão',async({page})=>{
  await fixtures(page);
  await page.goto(playerUrl(),{waitUntil:'domcontentloaded'});
  const btn=page.locator('#downloadBtn');
  await expect(btn).toBeVisible({timeout:12000});
  await expect(page.locator('#stage')).toHaveClass(/enhanced/);
  await btn.click();
  await expect(btn).toContainText('salvo offline',{timeout:15000});
  const saved=await page.evaluate(id=>{
    const registry=JSON.parse(localStorage.getItem('jogahub.offline.media.registry')||'{}');
    return registry[id];
  },itemId);
  expect(saved.size).toBe(movie.length);
  expect(saved.mime).toBe('video/webm');
  const cached=await page.evaluate(async url=>{
    const cache=await caches.open('jogahub-offline-media-v1');
    const response=await cache.match(url);
    return response?.arrayBuffer().then(bytes=>bytes.byteLength)||0;
  },saved.url);
  expect(cached).toBe(movie.length);
  page.once('dialog',dialog=>dialog.accept());
  await btn.click();
  await expect(btn).toContainText('baixar offline');
  const deleted=await page.evaluate(async id=>{
    const r=JSON.parse(localStorage.getItem('jogahub.offline.media.registry')||'{}');
    const cache=await caches.open('jogahub-offline-media-v1');
    return {entry:!!r[id],size:(await cache.keys()).length};
  },itemId);
  expect(deleted.entry).toBe(false);
  expect(deleted.size).toBe(0);
});

test('não registra como salvo quando a origem retorna HTTP 206 incompleto',async({page})=>{
  await fixtures(page,{partialDownload:true});
  await page.goto(playerUrl(),{waitUntil:'domcontentloaded'});
  const btn=page.locator('#downloadBtn');
  await expect(btn).toBeVisible({timeout:12000});
  await btn.click();
  await expect(btn).toContainText('tentar novamente',{timeout:12000});
  const result=await page.evaluate(async id=>{
    const entry=JSON.parse(localStorage.getItem('jogahub.offline.media.registry')||'{}')[id];
    const cache=await caches.open('jogahub-offline-media-v1');
    return {entry:!!entry,count:(await cache.keys()).length};
  },itemId);
  expect(result.entry).toBe(false);
  expect(result.count).toBe(0);
});
