import { test, expect } from '@playwright/test';

test.beforeEach(async ({page})=>{
  await page.route(/^https?:\/\/(?!127\.0\.0\.1:4173)/,route=>route.abort());
});

function playerUrl({id='drive-auto-qa-1',name='Episodio.mkv',series='qa-series',episode=2}={}){
  const fileId='qa-file-123';
  const url='https://drive.google.com/file/d/'+fileId+'/preview';
  return '/link-player.html?'+new URLSearchParams({
    id,driveFileId:fileId,provider:'iframe',type:'filme',
    title:'Teste Player QA',driveName:name,seriesId:series,
    seriesTitle:'Série QA',season:'1',episode:String(episode),
    url,external:'https://drive.google.com/file/d/'+fileId+'/view'
  }).toString();
}

test('arquivo MKV inicia no modo compatível sem tentar reproduzir como MP4',async({page})=>{
  await page.goto(playerUrl(),{waitUntil:'domcontentloaded'});
  await expect(page.locator('#stage')).toHaveClass(/fallback/);
  await expect(page.locator('#frame')).toHaveAttribute('src',/^https:\/\/drive\.google\.com\/file\/d\//);
  await expect(page.locator('#video')).not.toHaveAttribute('src');
  const result=await page.evaluate(()=>({
    progress:JSON.parse(localStorage.getItem('jogahub.movie.progress.drive-auto-qa-1')||'null'),
    resume:JSON.parse(localStorage.getItem('jogahub.drive.resume.qa-series')||'null')
  }));
  expect(result.progress?.episodeOnly).toBe(true);
  expect(result.resume?.episode).toBe(2);
});

test('modo compatível preserva ponto exato salvo do episódio',async({page})=>{
  await page.addInitScript(()=>{
    localStorage.setItem('jogahub.movie.progress.drive-auto-qa-2',
      JSON.stringify({time:146,duration:1600,updatedAt:123,provider:'enhanced',finished:false}));
  });
  await page.goto(playerUrl({id:'drive-auto-qa-2',name:'Episodio.MKV',episode:4}),{waitUntil:'domcontentloaded'});
  await expect(page.locator('#stage')).toHaveClass(/fallback/);
  const progress=await page.evaluate(()=>JSON.parse(localStorage.getItem('jogahub.movie.progress.drive-auto-qa-2')||'null'));
  expect(progress?.time).toBe(146);
  expect(progress?.duration).toBe(1600);
  expect(progress?.episodeOnly).not.toBe(true);
  await expect(page.locator('#continueText')).toContainText(/2min 26s/);
});

test('preferência por compatibilidade abre MP4 no iframe sem tocar vídeo direto',async({page})=>{
  await page.addInitScript(()=>{
    localStorage.setItem('jogahub.drive.mode.qa-series','compat');
  });
  await page.goto(playerUrl({id:'drive-auto-qa-3',name:'Episodio.mp4'}),{waitUntil:'domcontentloaded'});
  await expect(page.locator('#stage')).toHaveClass(/fallback/);
  await expect(page.locator('#frame')).toHaveAttribute('src',/^https:\/\/drive\.google\.com\/file\/d\//);
  await expect(page.locator('#video')).not.toHaveAttribute('src');
  await expect(page.locator('#driveModeBtn')).toBeVisible();
  await expect(page.locator('#fallback')).toHaveAttribute('href',/^https:\/\/drive\.google\.com\//);
});
