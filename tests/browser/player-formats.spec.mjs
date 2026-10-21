import {test,expect} from '@playwright/test';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

// Vídeos reais curtos gerados localmente: as rotas Drive são simuladas,
// mas o navegador realmente decodifica os bytes MP4/WebM.
let dir='',mp4,webm;
test.beforeAll(()=>{
  dir=mkdtempSync(join(tmpdir(),'jogahub-video-test-'));
  const base=['-hide_banner','-loglevel','error','-f','lavfi','-i','color=c=blue:size=32x32:rate=3','-t','2','-an'];
  const mp4Path=join(dir,'fixture.mp4'),webmPath=join(dir,'fixture.webm');
  try{
    execFileSync('ffmpeg',[...base,'-c:v','libx264','-pix_fmt','yuv420p','-preset','ultrafast','-movflags','+faststart','-y',mp4Path]);
    execFileSync('ffmpeg',[...base,'-c:v','libvpx','-b:v','12k','-deadline','realtime','-cpu-used','8','-y',webmPath]);
  }catch(error){throw new Error('Falha ao gerar MP4/WebM com ffmpeg: '+error.message)}
  mp4=readFileSync(mp4Path);webm=readFileSync(webmPath);
});
test.afterAll(()=>{if(dir)rmSync(dir,{recursive:true,force:true})});

test.beforeEach(async({page})=>{
  await page.route(/^https?:\/\/(?!127\.0\.0\.1:4173)/,route=>route.abort());
});

function playerUrl(name,mime=''){
  const id='e2e-video-real-1';
  return '/link-player.html?'+new URLSearchParams({
    provider:'iframe',type:'filme',id:'drive-auto-'+id,driveFileId:id,
    title:'Vídeo de validação',driveName:name,driveMime:mime,
    url:'https://drive.google.com/file/d/'+id+'/preview',
    external:'https://drive.google.com/file/d/'+id+'/view'
  });
}

function serveDriveFixture(page,body,mime){
  return page.route(/https:\/\/(?:drive\.usercontent\.google\.com\/download|drive\.google\.com\/uc)\?/,async route=>{
    const range=route.request().headers()['range']||'';
    const match=/^bytes=(\d+)-(\d*)$/.exec(range);
    const start=match?Number(match[1]):0;
    const end=match&&match[2]?Math.min(body.length-1,Number(match[2])):body.length-1;
    const chunk=body.subarray(start,end+1);
    if(start>=body.length)return route.fulfill({status:416,headers:{'Content-Range':'bytes */'+body.length}});
    const headers={
      'Content-Type':mime,
      'Accept-Ranges':'bytes',
      'Content-Length':String(chunk.length),
      'Access-Control-Allow-Origin':'*'
    };
    if(match)headers['Content-Range']='bytes '+start+'-'+end+'/'+body.length;
    await route.fulfill({status:match?206:200,headers,body:chunk});
  });
}

for(const entry of [
  {name:'MP4 H.264',file:'video.mp4',mime:'video/mp4',source:()=>mp4},
  {name:'WebM VP8',file:'video.webm',mime:'video/webm',source:()=>webm}
]){
  test('valida vídeo real '+entry.name+' e fallback de codec não suportado'+(entry.mime==='video/webm'?' @crossbrowser':''),async({page})=>{
    await serveDriveFixture(page,entry.source(),entry.mime);
    await page.goto(playerUrl(entry.file,entry.mime),{waitUntil:'domcontentloaded'});
    const codec=entry.mime==='video/mp4'?'video/mp4; codecs="avc1.42E01E"':'video/webm; codecs="vp8"';
    const supported=await page.locator('#video').evaluate((video,mime)=>video.canPlayType(mime),codec);
    if(!supported){
      // Chromium sem decoder patenteado: MP4/H.264 NÃO deve ser reportado como reproduzido.
      await expect(page.locator('#stage')).toHaveClass(/fallback/,{timeout:20000});
      await expect(page.locator('#video')).not.toHaveAttribute('src');
      await expect(page.locator('#frame')).toHaveAttribute('src',/^https:\/\/drive\.google\.com\/file\/d\//);
      return;
    }
    await expect(page.locator('#stage')).toHaveClass(/enhanced/,{timeout:20000});
    const actual=await page.locator('#video').evaluate(video=>({
      readyState:video.readyState,
      duration:video.duration,
      width:video.videoWidth,
      height:video.videoHeight
    }));
    expect(actual.readyState).toBeGreaterThanOrEqual(1);
    expect(actual.duration).toBeGreaterThan(1);
    expect(actual.width).toBe(32);
    expect(actual.height).toBe(32);
    await page.locator('#video').evaluate(async video=>{video.muted=true;await video.play()});
    await expect.poll(async()=>page.locator('#video').evaluate(v=>v.currentTime),{timeout:10000}).toBeGreaterThan(0.2);
  });
}

test('resposta HTTP inválida não é confundida com MP4 reproduzível',async({page})=>{
  await serveDriveFixture(page,Buffer.from('<html><body>Login Google</body></html>'),'text/html');
  await page.goto(playerUrl('video.mp4','video/mp4'),{waitUntil:'domcontentloaded'});
  await expect(page.locator('#stage')).toHaveClass(/fallback/,{timeout:20000});
  await expect(page.locator('#video')).not.toHaveAttribute('src');
  await expect(page.locator('#frame')).toHaveAttribute('src',/^https:\/\/drive\.google\.com\/file\/d\//);
});
