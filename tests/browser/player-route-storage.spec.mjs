import {test,expect} from '@playwright/test';

const id='qa-route-migration-123';
const key='jogahub.drive.route.'+id;
function playerUrl(resourceKey='fresh-2026'){
  return '/link-player.html?'+new URLSearchParams({
    id:'drive-auto-'+id,driveFileId:id,provider:'iframe',type:'filme',
    title:'Teste rota segura',driveName:'filme.mp4',
    driveResourceKey:resourceKey,
    url:'https://drive.google.com/file/d/'+id+'/preview',
    external:'https://drive.google.com/file/d/'+id+'/view'
  });
}
test.beforeEach(async({page})=>{
  await page.route(/^https?:\/\/(?!127\.0\.0\.1:4173)/,route=>route.abort());
});

test('migra URL legada para rota curta sem gravar resourcekey anterior @crossbrowser',async({page})=>{
  await page.addInitScript(({key,id})=>{
    localStorage.setItem(key,JSON.stringify({
      url:'https://drive.google.com/uc?export=download&id='+id+'&resourcekey=old-secret-123',
      updatedAt:Date.now(),elapsed:500
    }));
  },{key,id});
  let primary=0,secondary=0,actualKey='';
  await page.route(/https:\/\/drive\.google\.com\/uc\?/,route=>{
    primary++;actualKey=new URL(route.request().url()).searchParams.get('resourcekey');
    return route.fulfill({status:403,headers:{'Access-Control-Allow-Origin':'*','Content-Type':'text/html'},body:'Permissão'});
  });
  await page.route(/https:\/\/drive\.usercontent\.google\.com\/download\?/,route=>{
    secondary++;return route.abort();
  });
  await page.goto(playerUrl(),{waitUntil:'domcontentloaded'});
  await expect(page.locator('#stage')).toHaveClass(/fallback/,{timeout:18000});
  await expect(page.locator('#driveDiagnostic')).toHaveAttribute('data-reason','access');
  expect(primary).toBeGreaterThan(0);
  expect(secondary).toBe(0);
  expect(actualKey).toBe('fresh-2026');
  const saved=await page.evaluate(k=>localStorage.getItem(k),key);
  const decoded=JSON.parse(saved);
  expect(decoded.route).toBe('uc');
  expect(saved).not.toContain('old-secret-123');
  expect(saved).not.toContain('resourcekey');
  expect(saved).not.toContain('https://');
});

test('CSS modular mantém layout estável e player funcional em celular @crossbrowser',async({page})=>{
  await page.goto(playerUrl(''),{waitUntil:'domcontentloaded'});
  await expect(page.locator('#stage')).toBeVisible();
  await expect(page.locator('#stage')).toHaveClass(/fallback/,{timeout:18000});
  const state=await page.evaluate(()=>{
    const stage=document.getElementById('stage');
    const box=stage.getBoundingClientRect();
    return {
      planner:!!window.JOGAHUB_PLAYER_DRIVE_ROUTES,
      style:getComputedStyle(stage).display,
      width:box.width,
      viewport:window.innerWidth,
      x:box.x
    };
  });
  expect(state.planner).toBe(true);
  expect(state.style).toBe('grid');
  expect(state.width).toBeGreaterThan(200);
  expect(state.width).toBeLessThanOrEqual(state.viewport+2);
  expect(state.x).toBeGreaterThanOrEqual(-2);
});
