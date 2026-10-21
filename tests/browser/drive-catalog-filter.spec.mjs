import {test,expect} from '@playwright/test';

test.beforeEach(async({page})=>{
  await page.route(/^https?:\/\/(?!127\.0\.0\.1:4173)/,route=>route.abort());
});

test('catálogo publicado contém somente arquivos de vídeo @crossbrowser',async({page})=>{
  await page.goto('/?view=filme',{waitUntil:'domcontentloaded'});
  const report=await page.evaluate(()=>{
    const media=window.JOGAHUB_DRIVE_MEDIA_POLICY;
    const snapshot=window.JOGAHUB_DRIVE_SNAPSHOT||[];
    const videos=(window.JOGAHUB_ITEMS||[]).filter(i=>i.driveFileId);
    return {
      policyReady:!!media,
      entries:snapshot.length,
      invalidSnapshot:snapshot.filter(f=>!media.isVideo(f)).map(f=>f.name),
      invalidCatalog:videos.filter(i=>!media.isVideo({name:i._driveName,mime:i.driveMime})).map(i=>i._driveName)
    };
  });
  expect(report.policyReady).toBe(true);
  expect(report.entries).toBeGreaterThan(50);
  expect(report.invalidSnapshot).toEqual([]);
  expect(report.invalidCatalog).toEqual([]);
});

test('cache antigo com legendas não as exibe e mantém recurso da URL @crossbrowser',async({page})=>{
  const fixture=[
    {id:'qa-video-catalog-1',name:'Aventura S01E01.mp4',mime:'video/mp4',
     path:'filmes e serie/Series/Aventura S01',
     url:'https://drive.google.com/file/d/qa-video-catalog-1/view?resourcekey=chave-fixture'},
    {id:'qa-subtitle-catalog-1',name:'Aventura S01E01.srt',mime:'application/octet-stream',
     path:'filmes e serie/Series/Aventura S01'},
    {id:'qa-link-catalog-1',name:'site.website',mime:'application/octet-stream',
     path:'filmes e serie'}
  ];
  await page.route(/\/js\/drive-snapshot\.js\?/,route=>route.fulfill({
    status:200,contentType:'application/javascript',
    body:'window.JOGAHUB_DRIVE_SNAPSHOT = '+JSON.stringify(fixture)+';'
  }));
  await page.goto('/?view=serie',{waitUntil:'domcontentloaded'});
  const info=await page.evaluate(()=>{
    const items=window.FILMES_CATALOGO.filter(i=>String(i.id||'').startsWith('drive-auto-'));
    return {
      ids:items.map(i=>i.driveFileId),
      key:items.find(i=>i.driveFileId==='qa-video-catalog-1')?.driveResourceKey,
      cache:JSON.parse(localStorage.getItem('jogahub_drive_catalog_cache_v6_compact')||'[]')
    };
  });
  expect(info.ids).toContain('qa-video-catalog-1');
  expect(info.ids).not.toContain('qa-subtitle-catalog-1');
  expect(info.ids).not.toContain('qa-link-catalog-1');
  expect(info.key).toBe('chave-fixture');
  // O snapshot de origem não é sobrescrito por uma URL de streaming.
  expect(info.cache.every(row=>!row.url&&!row.player)).toBe(true);
});
