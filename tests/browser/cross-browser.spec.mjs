import { test, expect } from '@playwright/test';

test.beforeEach(async({page})=>{
  await page.route(/^https?:\/\/(?!127\.0\.0\.1:4173)/,route=>route.abort());
});

test('catálogo e busca com acentos funcionam no motor @crossbrowser',async({page})=>{
  await page.goto('/?view=jogo',{waitUntil:'domcontentloaded'});
  await expect(page.locator('#games .card[data-id="asfalto-brutal"]')).toBeVisible();
  await page.locator('#search').fill('brumaria');
  await expect(page.locator('#games .card[data-id="asas-de-brumaria"]')).toBeVisible();
  await expect(page.locator('#games .card[data-id="asfalto-brutal"]')).toHaveCount(0);
});

function playerUrl(name='Video.mkv'){
  const id='crossbrowser-drive-video-1';
  return '/link-player.html?'+new URLSearchParams({
    id:'drive-auto-'+id,driveFileId:id,provider:'iframe',type:'filme',
    driveName:name,title:'Vídeo de compatibilidade',
    url:'https://drive.google.com/file/d/'+id+'/preview',
    external:'https://drive.google.com/file/d/'+id+'/view'
  });
}

test('MKK/AVI usa iframe sem tentativa de MP4 direto @crossbrowser',async({page})=>{
  let mediaRequests=0;
  await page.route(/https:\/\/(?:drive\.usercontent\.google\.com\/download|drive\.google\.com\/uc)\?/,route=>{
    mediaRequests++;return route.abort();
  });
  await page.goto(playerUrl('Episodio.MKV'),{waitUntil:'domcontentloaded'});
  await expect(page.locator('#stage')).toHaveClass(/fallback/);
  await expect(page.locator('#driveDiagnostic')).toHaveAttribute('data-reason','codec');
  await expect(page.locator('#video')).not.toHaveAttribute('src');
  await expect(page.locator('#frame')).toHaveAttribute('src',/^https:\/\/drive\.google\.com\/file\/d\//);
  expect(mediaRequests).toBe(0);
});

test('restrição de acesso 403 é diagnosticada sem repetir rotas @crossbrowser',async({page})=>{
  const route1=/https:\/\/drive\.usercontent\.google\.com\/download\?/;
  const route2=/https:\/\/drive\.google\.com\/uc\?/;
  let first=0, second=0;
  await page.route(route1,route=>{
    first++;
    return route.fulfill({
      status:403,
      headers:{'Access-Control-Allow-Origin':'*','Content-Type':'text/html'},
      body:'Acesso negado'
    });
  });
  await page.route(route2,route=>{second++;return route.abort()});
  await page.goto(playerUrl('Video.mp4'),{waitUntil:'domcontentloaded'});
  await expect(page.locator('#driveDiagnostic')).toHaveAttribute('data-reason','access',{timeout:18000});
  await expect(page.locator('#stage')).toHaveClass(/fallback/);
  expect(first).toBeGreaterThan(0);
  expect(second).toBe(0);
});

test('player preserva vídeo inline e controles conforme capacidades do navegador @crossbrowser',async({page})=>{
  await page.goto(playerUrl('Filme.MKV'),{waitUntil:'domcontentloaded'});
  await expect(page.locator('#stage')).toBeVisible();
  // Em telas pequenas PiP fica na seção Mais opções; abra-a antes de
  // conferir a capacidade real do navegador, não a visibilidade do menu.
  if(await page.locator('#morePlayerControls').isVisible())await page.locator('#morePlayerControls').click();
  const state=await page.evaluate(()=>{
    const video=document.getElementById('video');
    const stage=document.getElementById('stage');
    const browser=window.JOGAHUB_PLAYER_BROWSER_CORE;
    const pip=document.getElementById('pipBtn');
    const rect=stage.getBoundingClientRect();
    return {
      inline:video.hasAttribute('playsinline')&&video.hasAttribute('webkit-playsinline'),
      pipSupported:browser.pictureInPictureAvailable(document,video),
      pipHidden:getComputedStyle(pip).display==='none',
      fullscreenAvailable:browser.fullscreenAvailable(stage,video),
      fullscreenDisabled:document.getElementById('fullBtn').disabled,
      width:rect.width, left:rect.left,right:rect.right, viewport:window.innerWidth
    };
  });
  expect(state.inline).toBe(true);
  expect(state.pipHidden).toBe(!state.pipSupported);
  expect(state.fullscreenDisabled).toBe(!state.fullscreenAvailable);
  expect(state.width).toBeGreaterThan(120);
  expect(state.left).toBeGreaterThanOrEqual(-2);
  expect(state.right).toBeLessThanOrEqual(state.viewport+2);
});
