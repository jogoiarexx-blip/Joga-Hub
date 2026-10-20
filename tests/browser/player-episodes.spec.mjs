import {test,expect} from '@playwright/test';

test.beforeEach(async({page})=>{
  await page.route(/^https?:\/\/(?!127\.0\.0\.1:4173)/,route=>route.abort());
});

test('série Profundezas apresenta próximo episódio e permite cancelar autoplay',async({page})=>{
  await page.goto('/?view=serie',{waitUntil:'domcontentloaded'});
  const link=page.locator('#catalog-drive-series .series-summary')
    .filter({hasText:/Profundezas/i}).locator('a.stream-poster');
  await expect(link).toBeVisible();
  await link.click();
  await expect(page).toHaveURL(/link-player\.html/);
  await expect(page.locator('#seriesTitle')).toContainText(/Profundezas/i);
  await expect(page.locator('#nextBtn')).toBeEnabled();
  const originalUrl=page.url();
  await page.locator('#video').evaluate(video=>video.dispatchEvent(new Event('ended')));
  await expect(page.locator('#nextOverlay')).toHaveClass(/show/);
  await expect(page.locator('#nextCount')).toContainText('8s');
  expect(page.url()).toBe(originalUrl);
  await page.locator('#cancelNext').click();
  await expect(page.locator('#nextOverlay')).not.toHaveClass(/show/);
  await page.waitForTimeout(1100);
  expect(page.url()).toBe(originalUrl);
  await page.locator('#video').evaluate(video=>video.dispatchEvent(new Event('ended')));
  await expect(page.locator('#nextOverlay')).not.toHaveClass(/show/);
});

test('próximo episódio de Profundezas mantém série e muda arquivo',async({page})=>{
  await page.goto('/?view=serie',{waitUntil:'domcontentloaded'});
  await page.locator('#catalog-drive-series .series-summary').filter({hasText:/Profundezas/i})
    .locator('a.stream-poster').click();
  await expect(page.locator('#nextBtn')).toBeEnabled();
  const before=new URL(page.url()).searchParams;
  await page.locator('#nextBtn').click();
  await expect(page).toHaveURL(/link-player\.html.*driveFileId=/);
  const after=new URL(page.url()).searchParams;
  expect(after.get('driveFileId')).not.toBe(before.get('driveFileId'));
  expect(after.get('seriesId')).toBe(before.get('seriesId'));
  await expect(page.locator('#seriesTitle')).toContainText(/Profundezas/i);
  await expect(page.locator('#prevBtn')).toBeEnabled();
  await page.locator('#prevBtn').click();
  await expect(page).toHaveURL(new RegExp('driveFileId='+encodeURIComponent(before.get('driveFileId'))));
});

test('catálogo desatualizado não oferece episódio errado para ID desconhecido',async({page})=>{
  const params=new URLSearchParams({
    id:'drive-auto-fora-do-snapshot',driveFileId:'id-drive-ausente',
    provider:'iframe',type:'filme',title:'Episódio antigo',
    seriesId:'serie-inexistente-no-catalogo',seriesTitle:'Série antiga',season:'1',episode:'9',
    driveName:'episodio.mkv',
    url:'https://drive.google.com/file/d/id-drive-ausente/preview',
    external:'https://drive.google.com/file/d/id-drive-ausente/view'
  });
  await page.goto('/link-player.html?'+params,{waitUntil:'domcontentloaded'});
  await expect(page.locator('#nextBtn')).toBeDisabled();
  await expect(page.locator('#prevBtn')).toBeDisabled();
  await page.locator('#video').evaluate(video=>video.dispatchEvent(new Event('ended')));
  await expect(page.locator('#nextOverlay')).not.toHaveClass(/show/);
});
