import {test,expect} from '@playwright/test';

const fileId='drive-diagnostic-e2e';
function url(name='Teste diagnóstico.mp4'){
  const preview='https://drive.google.com/file/d/'+fileId+'/preview';
  return '/link-player.html?'+new URLSearchParams({
    id:'drive-auto-'+fileId,driveFileId:fileId,provider:'iframe',type:'filme',
    driveName:name,title:'Diagnóstico QA',url:preview,
    external:'https://drive.google.com/file/d/'+fileId+'/view'
  });
}
const route1=/https:\/\/drive\.usercontent\.google\.com\/download\?/;
const route2=/https:\/\/drive\.google\.com\/uc\?/;

test.beforeEach(async({page})=>{
  await page.route(/^https?:\/\/(?!127\.0\.0\.1:4173)/,route=>route.abort());
});

test('HTTP 403 identificado evita segunda rota e informa como conferir acesso',async({page})=>{
  let first=0,second=0,probes=0;
  await page.route(route1,async route=>{
    first++;
    if(route.request().method()==='HEAD')probes++;
    await route.fulfill({status:403,headers:{'Access-Control-Allow-Origin':'*','Content-Type':'text/html'},body:'Acesso não autorizado'});
  });
  await page.route(route2,async route=>{
    second++;
    await route.fulfill({status:403,headers:{'Access-Control-Allow-Origin':'*','Content-Type':'text/html'},body:'Acesso não autorizado'});
  });
  await page.goto(url(),{waitUntil:'domcontentloaded'});
  const diagnostic=page.locator('#driveDiagnostic');
  await expect(diagnostic).toBeVisible({timeout:15000});
  await expect(diagnostic).toHaveAttribute('data-reason','access');
  await expect(page.locator('#driveDiagnosticTitle')).toContainText('restrito');
  await expect(page.locator('#driveDiagnosticAction')).toContainText('Drive');
  await expect(page.locator('#stage')).toHaveClass(/fallback/);
  expect(first).toBeGreaterThanOrEqual(1);
  expect(probes).toBeGreaterThanOrEqual(1);
  expect(second).toBe(0);
});

test('Drive devolvendo HTML é identificado sem culpar codec ou permissões',async({page})=>{
  for(const pattern of [route1,route2]){
    await page.route(pattern,route=>route.fulfill({
      status:200,headers:{'Access-Control-Allow-Origin':'*','Content-Type':'text/html'},
      body:'<!doctype html><title>Login Drive</title>'
    }));
  }
  await page.goto(url(),{waitUntil:'domcontentloaded'});
  await expect(page.locator('#driveDiagnostic')).toHaveAttribute('data-reason','response',{timeout:15000});
  await expect(page.locator('#driveDiagnosticTitle')).toContainText('página');
  await expect(page.locator('#frame')).toHaveAttribute('src',/^https:\/\/drive\.google\.com\/file\/d\//);
});

test('falha de acesso recente usa cache e não repete solicitações',async({page})=>{
  await page.addInitScript(id=>{
    localStorage.setItem('jogahub.drive.fail.'+id,JSON.stringify({
      updatedAt:Date.now(),code:'access',status:403
    }));
  },fileId);
  let attempts=0;
  await page.route(route1,async route=>{attempts++;await route.abort()});
  await page.route(route2,async route=>{attempts++;await route.abort()});
  await page.goto(url(),{waitUntil:'domcontentloaded'});
  await expect(page.locator('#driveDiagnostic')).toHaveAttribute('data-reason','access');
  await expect(page.locator('#stage')).toHaveClass(/fallback/);
  expect(attempts).toBe(0);
});

test('MKV reconhecido avisa codec sem fingir permissão negada',async({page})=>{
  let attempts=0;
  await page.route(route1,async route=>{attempts++;await route.abort()});
  await page.route(route2,async route=>{attempts++;await route.abort()});
  await page.goto(url('Série.MKV'),{waitUntil:'domcontentloaded'});
  await expect(page.locator('#driveDiagnostic')).toHaveAttribute('data-reason','codec');
  await expect(page.locator('#stage')).toHaveClass(/fallback/);
  expect(attempts).toBe(0);
});
