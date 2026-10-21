import {test,expect} from '@playwright/test';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

// Vídeos reais curtos gerados localmente: as rotas Drive são simuladas,
// mas o navegador realmente decodifica os bytes MP4/WebM.
let dir='',mp4,webm,audioCodecs={};
test.beforeAll(()=>{
  dir=mkdtempSync(join(tmpdir(),'jogahub-video-test-'));
  const base=['-hide_banner','-loglevel','error','-f','lavfi','-i','color=c=blue:size=32x32:rate=3','-f','lavfi','-i','sine=frequency=440:sample_rate=48000','-t','2'];
  const mp4Path=join(dir,'fixture.mp4'),webmPath=join(dir,'fixture.webm');
  try{
    execFileSync('ffmpeg',[...base,'-c:v','libx264','-pix_fmt','yuv420p','-c:a','aac','-b:a','48k','-preset','ultrafast','-movflags','+faststart','-y',mp4Path]);
    execFileSync('ffmpeg',[...base,'-c:v','libvpx','-b:v','12k','-c:a','libopus','-b:a','48k','-deadline','realtime','-cpu-used','8','-y',webmPath]);
  }catch(error){throw new Error('Falha ao gerar MP4/WebM com ffmpeg: '+error.message)}
  mp4=readFileSync(mp4Path);webm=readFileSync(webmPath);
  for(const [label,file] of [['mp4',mp4Path],['webm',webmPath]]){
    audioCodecs[label]=execFileSync('ffprobe',[
      '-v','error','-select_streams','a:0',
      '-show_entries','stream=codec_name','-of','default=noprint_wrappers=1:nokey=1',file
    ],{encoding:'utf8'}).trim();
  }
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

test('arquivos MP4/WebM de teste possuem vídeo e áudio codificados',()=>{
  for(const data of [mp4,webm]){
    // Arquivos gerados contêm container e trilha de áudio; reprodução
    // automatizada não equivale a verificar som num alto-falante real.
    expect(data.byteLength).toBeGreaterThan(1000);
  }
  expect(audioCodecs.mp4).toBe('aac');
  expect(audioCodecs.webm).toBe('opus');
});

test('resposta HTTP inválida não é confundida com MP4 reproduzível',async({page})=>{
  await serveDriveFixture(page,Buffer.from('<html><body>Login Google</body></html>'),'text/html');
  await page.goto(playerUrl('video.mp4','video/mp4'),{waitUntil:'domcontentloaded'});
  await expect(page.locator('#stage')).toHaveClass(/fallback/,{timeout:20000});
  await expect(page.locator('#video')).not.toHaveAttribute('src');
  await expect(page.locator('#frame')).toHaveAttribute('src',/^https:\/\/drive\.google\.com\/file\/d\//);
});


test('conexão 2G evita pré-carregamento agressivo sem impedir abrir WebM @crossbrowser',async({page})=>{
  await page.addInitScript(()=>{
    const conn={effectiveType:'2g',saveData:true,downlink:0.4};
    Object.defineProperty(navigator,'connection',{configurable:true,value:conn});
    Object.defineProperty(navigator,'deviceMemory',{configurable:true,value:1});
  });
  await serveDriveFixture(page,webm,'video/webm');
  await page.goto(playerUrl('video.webm','video/webm'),{waitUntil:'domcontentloaded'});
  await expect(page.locator('#stage')).toHaveClass(/enhanced/,{timeout:20000});
  expect(await page.locator('#video').getAttribute('preload')).toBe('metadata');
  const state=await page.evaluate(()=>{
    const p=window.JOGAHUB_PLAYER_DRIVE_CORE.connectionPolicy({
      effectiveType:navigator.connection.effectiveType,
      saveData:navigator.connection.saveData,
      downlink:navigator.connection.downlink,
      deviceMemory:navigator.deviceMemory
    });
    return {timeout:p.timeout,warmNext:p.warmNext};
  });
  expect(state).toEqual({timeout:16000,warmNext:false});
});

test('recuperação recarrega o vídeo e preserva o ponto de reprodução',async({page})=>{
  await serveDriveFixture(page,webm,'video/webm');
  await page.goto(playerUrl('video.webm','video/webm'),{waitUntil:'domcontentloaded'});
  await expect(page.locator('#stage')).toHaveClass(/enhanced/,{timeout:20000});
  await page.locator('#video').evaluate(video=>{video.currentTime=.9});
  await expect.poll(()=>page.locator('#video').evaluate(video=>video.currentTime)).toBeGreaterThan(.6);
  await page.locator('#retryPlaybackBtn').evaluate(button=>button.click());
  await expect(page.locator('#stage')).not.toHaveClass(/recovering/,{timeout:12000});
  await expect.poll(()=>page.locator('#video').evaluate(video=>video.currentTime),{timeout:12000}).toBeGreaterThan(.6);
  const progress=await page.evaluate(()=>JSON.parse(localStorage.getItem('jogahub.movie.progress.drive-auto-e2e-video-real-1')||'null'));
  expect(progress?.time).toBeGreaterThan(.6);
});

test('trocar para iframe durante a recuperação cancela carga antiga sem perder posição @crossbrowser',async({page})=>{
  await serveDriveFixture(page,webm,'video/webm');
  await page.goto(playerUrl('video.webm','video/webm'),{waitUntil:'domcontentloaded'});
  await expect(page.locator('#stage')).toHaveClass(/enhanced/,{timeout:20000});
  await page.locator('#video').evaluate(video=>{video.currentTime=.9});
  await expect.poll(()=>page.locator('#video').evaluate(video=>video.currentTime)).toBeGreaterThan(.6);
  await page.evaluate(()=>{
    document.getElementById('retryPlaybackBtn').click();
    document.getElementById('driveModeBtn').click();
  });
  await expect(page.locator('#stage')).toHaveClass(/fallback/);
  await expect(page.locator('#video')).not.toHaveAttribute('src');
  await expect(page.locator('#frame')).toHaveAttribute('src',/^https:\/\/drive\.google\.com\/file\/d\//);
  await page.waitForTimeout(250);
  await expect(page.locator('#stage')).toHaveClass(/fallback/);
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('jogahub.movie.progress.drive-auto-e2e-video-real-1')||'null'));
  expect(saved?.time).toBeGreaterThan(.6);
});


test('slider avança só ao confirmar, com diagnóstico de busca e áudio @crossbrowser',async({page})=>{
  await serveDriveFixture(page,webm,'video/webm');
  await page.goto(playerUrl('video.webm','video/webm'),{waitUntil:'domcontentloaded'});
  await expect(page.locator('#stage')).toHaveClass(/enhanced/,{timeout:20000});
  const before=await page.locator('#video').evaluate(v=>v.currentTime);
  await page.locator('#seekBar').evaluate(el=>{
    el.value='700';
    el.dispatchEvent(new Event('input',{bubbles:true}));
  });
  const afterInput=await page.locator('#video').evaluate(v=>v.currentTime);
  expect(Math.abs(afterInput-before)).toBeLessThan(.2);
  await page.locator('#seekBar').evaluate(el=>{
    el.dispatchEvent(new Event('change',{bubbles:true}));
  });
  await expect.poll(()=>page.locator('#video').evaluate(v=>v.currentTime),{timeout:10000}).toBeGreaterThan(.85);
  await page.locator('#statsBtn').click();
  await expect(page.locator('#statsGrid')).toContainText('Áudio (evidência)');
  await expect(page.locator('#statsGrid')).toContainText('Decodificação');
  await expect(page.locator('#statsGrid')).toContainText('Última busca');
  await expect(page.locator('#statsGrid')).toContainText('Avanço confirmado',{timeout:10000});
});
