import {test,expect} from '@playwright/test';

test.beforeEach(async({page})=>{
  await page.route(/^https?:\/\/(?!127\.0\.0\.1:4173)/,route=>route.abort());
});

async function openPanel(page){
  await page.goto('/?view=filme',{waitUntil:'domcontentloaded'});
  const button=page.locator('button[data-action="drive-health"]:visible').first();
  await expect(button).toBeVisible();
  await button.click();
  await expect(page.locator('#driveHealthModal')).toBeVisible();
}

test('painel acessível lista episódios sem diagnosticar falsamente itens nunca testados',async({page})=>{
  await openPanel(page);
  await expect(page.locator('#driveHealthSummary')).toContainText(/arquivos Drive no catálogo/);
  await page.locator('#driveHealthFilter').selectOption('untested');
  await page.locator('#driveHealthSearch').fill('Profundezas');
  await expect(page.locator('#driveHealthList .drive-health-item').first()).toBeVisible();
  await expect(page.locator('#driveHealthList .drive-health-item').first()).toHaveAttribute('data-state','untested');
  await page.locator('#closeDriveHealth').click();
  await expect(page.locator('#driveHealthModal')).toBeHidden();
});

test('falha por arquivo fica visível no painel e pode ser filtrada e limpa',async({page})=>{
  await page.goto('/?view=filme',{waitUntil:'domcontentloaded'});
  const file=await page.evaluate(()=>{
    return window.JOGAHUB_ITEMS.find(i=>i.driveFileId&&i.mediaType==='serie'&&/Profundezas/i.test(i.seriesTitle||''));
  });
  expect(file?.driveFileId).toBeTruthy();
  await page.evaluate(fileId=>{
    window.JOGAHUB_DRIVE_HEALTH.createStore().recordFailure(fileId,'access',403);
  },file.driveFileId);
  await page.locator('button[data-action="drive-health"]:visible').first().click();
  await page.locator('#driveHealthFilter').selectOption('failed');
  await page.locator('#driveHealthSearch').fill('Profundezas');
  const row=page.locator('#driveHealthList .drive-health-item').filter({hasText:/Acesso restrito/});
  await expect(row).toHaveCount(1);
  await expect(row).toHaveAttribute('data-state','failed');
  await row.locator('[data-clear-drive]').click();
  await expect(page.locator('#driveHealthList .drive-health-item')).toHaveCount(0);
  await expect(page.locator('#driveHealthSummary')).toContainText('0 com falha');
});

test('distingue modo Drive de uma reprodução comprovada',async({page})=>{
  await page.goto('/?view=serie',{waitUntil:'domcontentloaded'});
  const file=await page.evaluate(()=>window.JOGAHUB_ITEMS.find(i=>i.driveFileId&&i.mediaType==='serie'));
  await page.evaluate(id=>window.JOGAHUB_DRIVE_HEALTH.createStore().recordCompatible(id,'codec'),file.driveFileId);
  await page.locator('button[data-action="drive-health"]:visible').first().click();
  await page.locator('#driveHealthFilter').selectOption('compatible');
  const row=page.locator('#driveHealthList .drive-health-item').filter({hasText:file.title});
  await expect(row).toHaveAttribute('data-state','compatible');
  await expect(row).toContainText(/não pode ser verificada/);
  await expect(page.locator('#driveHealthSummary')).toContainText('1 em modo compatível');
});

test('link do painel preserva resourcekey sem gravá-la no histórico',async({page})=>{
  await page.goto('/?view=serie',{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>{
    window.JOGAHUB_ITEMS.push({
      id:'drive-auto-qa-health-file',driveFileId:'qa-health-file',title:'Teste Chave Privada',
      mediaType:'serie',seriesId:'qa-privada',seriesTitle:'QA',season:1,episode:1,
      _driveName:'teste.mp4',driveResourceKey:'recurso-privado-qa'
    });
    window.JOGAHUB_DRIVE_HEALTH.createStore().recordFailure('qa-health-file','response',200);
  });
  await page.locator('button[data-action="drive-health"]:visible').first().click();
  await page.locator('#driveHealthSearch').fill('Teste Chave Privada');
  const row=page.locator('#driveHealthList .drive-health-item').filter({hasText:'Teste Chave Privada'});
  const href=await row.locator('.drive-health-link').getAttribute('href');
  const url=new URL(href,'http://127.0.0.1:4173/');
  expect(url.searchParams.get('driveResourceKey')).toBe('recurso-privado-qa');
  expect(JSON.parse(await page.evaluate(()=>localStorage.getItem('jogahub.drive.health.v1')))[0]).toMatchObject({
    fileId:'qa-health-file',state:'failed',code:'response'
  });
  expect(await page.evaluate(()=>localStorage.getItem('jogahub.drive.health.v1'))).not.toContain('recurso-privado-qa');
});

test('limpeza total mantém progresso do episódio e configurações do Drive',async({page})=>{
  await page.goto('/?view=serie',{waitUntil:'domcontentloaded'});
  const item=await page.evaluate(()=>window.JOGAHUB_ITEMS.find(i=>i.driveFileId&&i.mediaType==='serie'));
  await page.evaluate(item=>{
    localStorage.setItem('jogahub.movie.progress.'+item.id,JSON.stringify({time:125,duration:900}));
    localStorage.setItem('jogahub.drive.mode.'+item.seriesId,'compat');
    window.JOGAHUB_DRIVE_HEALTH.createStore().recordFailure(item.driveFileId,'timeout');
  },{id:item.id,seriesId:item.seriesId,driveFileId:item.driveFileId});
  await page.locator('button[data-action="drive-health"]:visible').first().click();
  page.once('dialog',dialog=>dialog.accept());
  await page.locator('#driveHealthClearAll').click();
  const check=await page.evaluate(item=>({
    health:window.JOGAHUB_DRIVE_HEALTH.createStore().read(),
    progress:localStorage.getItem('jogahub.movie.progress.'+item.id),
    mode:localStorage.getItem('jogahub.drive.mode.'+item.seriesId)
  }),{id:item.id,seriesId:item.seriesId});
  expect(check.health).toHaveLength(0);
  expect(JSON.parse(check.progress).time).toBe(125);
  expect(check.mode).toBe('compat');
});
