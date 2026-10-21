import {test,expect} from '@playwright/test';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

let dir='',webm;
test.beforeAll(()=>{
  dir=mkdtempSync(join(tmpdir(),'jogahub-subtitle-'));
  const file=join(dir,'sample.webm');
  execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-f','lavfi','-i','color=c=blue:size=32x32:rate=3','-f','lavfi','-i','sine=frequency=440:sample_rate=48000',
    '-t','2','-c:v','libvpx','-b:v','15k','-c:a','libopus','-b:a','48k','-deadline','realtime','-cpu-used','8','-y',file]);
  webm=readFileSync(file);
});
test.afterAll(()=>{if(dir)rmSync(dir,{recursive:true,force:true})});

const videoId='qa-subtitle-video-123',subtitleId='qa-subtitle-srt-456';
const path='filmes e serie/Series/QA S01';
const video={id:videoId,name:'QA S01E01.webm',mime:'video/webm',path,
  url:'https://drive.google.com/file/d/'+videoId+'/view',
  player:'https://drive.google.com/file/d/'+videoId+'/preview'};
const subtitle={id:subtitleId,name:'QA S01E01.srt',mime:'application/octet-stream',path};
const srt='1\r\n00:00:00,100 --> 00:00:01,200\r\nLegenda teste JogaHub!\r\n';

function href(name='QA S01E01.webm'){
  return '/link-player.html?'+new URLSearchParams({
    id:'drive-auto-'+videoId,driveFileId:videoId,provider:'iframe',type:'filme',
    title:'QA S01E01',driveName:name,driveMime:name.endsWith('.mkv')?'video/matroska':'video/webm',
    url:video.player,external:video.url
  });
}
test.beforeEach(async({page})=>{
  await page.route(/^https?:\/\/(?!127\.0\.0\.1:4173)/,route=>route.abort());
  await page.route(/\/js\/drive-snapshot\.js\?/,route=>route.fulfill({
    status:200,contentType:'application/javascript',
    body:'window.JOGAHUB_DRIVE_SNAPSHOT = '+JSON.stringify([video])+';'
  }));
  await page.route(/\/js\/drive-subtitles\.js\?/,route=>route.fulfill({
    status:200,contentType:'application/javascript',
    body:'window.JOGAHUB_DRIVE_SUBTITLES = '+JSON.stringify([subtitle])+';'
  }));
  await page.route(/https:\/\/drive\.usercontent\.google\.com\/download\?/,route=>{
    const id=new URL(route.request().url()).searchParams.get('id');
    if(id===videoId)return route.fulfill({
      status:200,body:webm,
      headers:{'Content-Type':'video/webm','Access-Control-Allow-Origin':'*','Accept-Ranges':'bytes'}
    });
    return route.abort();
  });
});

test('SRT do episódio vira faixa WebVTT selecionável após carregar WebM @crossbrowser',async({page})=>{
  let requested=0;
  await page.route(/https:\/\/drive\.usercontent\.google\.com\/download\?/,route=>{
    const id=new URL(route.request().url()).searchParams.get('id');
    if(id!==subtitleId)return route.fallback();
    requested++;
    return route.fulfill({status:200,body:srt,headers:{'Content-Type':'text/plain','Access-Control-Allow-Origin':'*'}});
  });
  await page.goto(href(),{waitUntil:'domcontentloaded'});
  await expect(page.locator('#stage')).toHaveClass(/enhanced/,{timeout:16000});
  await expect(page.locator('track[data-drive-subtitle]')).toHaveCount(1,{timeout:12000});
  await expect(page.locator('#subtitleTrack')).toHaveCount(1);
  await expect(page.locator('#subtitleTrack option')).toHaveCount(2);
  await page.locator('#subtitleTrack').selectOption('0',{force:true});
  await expect.poll(()=>page.locator('#video').evaluate(v=>v.textTracks[0]?.mode),{timeout:8000}).toBe('showing');
  await expect(page.locator('#driveSubtitleText')).toContainText('seletor CC');
  expect(requested).toBeGreaterThanOrEqual(1);
});

test('se CORS negar SRT, vídeo continua e link original é informado',async({page})=>{
  await page.route(/https:\/\/drive\.usercontent\.google\.com\/download\?/,route=>{
    const id=new URL(route.request().url()).searchParams.get('id');
    if(id!==subtitleId)return route.fallback();
    return route.abort('blockedbyclient');
  });
  await page.goto(href(),{waitUntil:'domcontentloaded'});
  await expect(page.locator('#stage')).toHaveClass(/enhanced/,{timeout:16000});
  await expect(page.locator('#driveSubtitleText')).toContainText('Não foi possível carregar',{timeout:12000});
  await expect(page.locator('#driveSubtitleLink')).toHaveAttribute('href',new RegExp(subtitleId));
  await expect(page.locator('#video')).toHaveAttribute('src',/^https:\/\/drive\.usercontent\.google\.com\//);
});

test('em MKV, o iframe controla legendas mas link SRT permanece disponível @crossbrowser',async({page})=>{
  await page.route(/\/js\/drive-snapshot\.js\?/,route=>route.fulfill({
    status:200,contentType:'application/javascript',
    body:'window.JOGAHUB_DRIVE_SNAPSHOT = '+JSON.stringify([{...video,name:'QA S01E01.mkv',mime:'video/matroska'}])+';'
  }));
  await page.goto(href('QA S01E01.mkv'),{waitUntil:'domcontentloaded'});
  await expect(page.locator('#stage')).toHaveClass(/fallback/);
  await expect(page.locator('#driveSubtitleText')).toContainText('iframe controla');
  await expect(page.locator('#driveSubtitleLink')).toHaveAttribute('href',new RegExp(subtitleId));
});
