import { test, expect } from '@playwright/test';

// Os serviços de terceiros não fazem parte do teste de regressão do JogaHub.
// O app deve funcionar com seu snapshot local mesmo quando esses serviços falham.
test.beforeEach(async ({ page }) => {
  await page.route(/^https?:\/\/(?!127\.0\.0\.1:4173)/, route => route.abort());
});

test('inicializa sem perder a biblioteca de jogos', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#games')).not.toBeEmpty();
  // A faixa legada de tipos fica oculta nos layouts atuais.
  // Use o botão realmente visível na sidebar ou no menu mobile.
  const gamesNav = page.locator('button[data-sidebar-view="jogo"]:visible, button[data-view="jogo"]:visible').first();
  await expect(gamesNav).toBeVisible();
  await gamesNav.click();
  await expect(page.locator('#typeTabs [data-type="jogo"]')).toHaveAttribute('aria-pressed', 'true');
  for (const id of ['asfalto-brutal', 'asas-de-brumaria', 'hulk-smash-city']) {
    await expect(page.locator('#games .card[data-id="' + id + '"]')).toBeVisible();
  }
  await expect(page.locator('#games .card[data-id="asfalto-brutal"] .card-main'))
    .toHaveAttribute('href', 'https://jogoiarexx-blip.github.io/Asfalto-Brutal/');
});

test('busca por nome preserva filtros e aceita acentos', async ({ page }) => {
  await page.goto('/?view=jogo', { waitUntil: 'domcontentloaded' });
  const search = page.locator('#search');
  await search.fill('asas de brumaria');
  await expect(page.locator('#games .card')).toHaveCount(1);
  await expect(page.locator('#games .card[data-id="asas-de-brumaria"]')).toBeVisible();

  await search.fill('asfalto brutal');
  await expect(page.locator('#games .card')).toHaveCount(1);
  await expect(page.locator('#games .card[data-id="asfalto-brutal"]')).toBeVisible();

  await search.fill('jogo-inexistente-qa-223');
  await expect(page.locator('#games .card')).toHaveCount(0);
  await expect(page.locator('#emptyState')).toBeVisible();
  await search.fill('');
  await expect(page.locator('#games .card').first()).toBeVisible();
});

test('favoritos sobrevivem ao recarregamento da página', async ({ page }) => {
  await page.goto('/?view=jogo', { waitUntil: 'domcontentloaded' });
  const target = page.locator('#games .card[data-id="asfalto-brutal"]');
  const favorite = target.locator('button[data-favorite="asfalto-brutal"]');
  await favorite.click();
  await expect(favorite).toHaveAttribute('aria-pressed', 'true');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#games .card[data-id="asfalto-brutal"] button[data-favorite]'))
    .toHaveAttribute('aria-pressed', 'true');
});

test('Profundezas mostra todos os episódios e abre o player interno', async ({ page }) => {
  await page.goto('/?view=serie', { waitUntil: 'domcontentloaded' });
  const snapshotEpisodes = await page.evaluate(() =>
    (window.JOGAHUB_ITEMS || []).filter(item =>
      item.driveFileId && item.mediaType === 'serie' && /profundezas/i.test(item.seriesTitle || '')
    ).length
  );
  expect(snapshotEpisodes).toBeGreaterThanOrEqual(6);

  const card = page.locator('#catalog-drive-series .series-summary')
    .filter({ hasText: /Profundezas/i });
  await expect(card).toHaveCount(1);
  await expect(card.locator('.series-count')).toContainText(String(snapshotEpisodes) + ' ep.');

  const link = card.locator('a.stream-poster');
  await expect(link).toHaveAttribute('href', /link-player\.html\?.*driveFileId=/);
  await link.click();
  await expect(page).toHaveURL(/link-player\.html\?/);
  await expect(page.locator('#seriesBox')).toBeVisible();
  await expect(page.locator('#seriesTitle')).toContainText(/Profundezas/i);
  await expect(page.locator('#episodeList .episode-row')).toHaveCount(snapshotEpisodes);
  await expect(page.locator('#fallback')).toHaveAttribute('href', /^https:\/\/drive\.google\.com\//);
});

test('navegação mantém a área de busca acessível no tamanho da tela', async ({ page }) => {
  await page.goto('/?view=jogo', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#search')).toBeVisible();
  const bounds = await page.locator('#search').boundingBox();
  expect(bounds).not.toBeNull();
  const viewport = page.viewportSize();
  expect(bounds.x).toBeGreaterThanOrEqual(-2);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(viewport.width + 2);
  await expect(page.locator('#typeTabs [data-type="jogo"]')).toHaveAttribute('aria-pressed', 'true');
});

test.describe('PWA e continuidade offline', () => {
  test.use({ serviceWorkers: 'allow' });

  test('reabre o catálogo instalado sem conexão', async ({ page, context }) => {
    await page.goto('/?view=jogo', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#games .card[data-id="asfalto-brutal"]')).toBeVisible();
    await page.waitForFunction(() => Boolean(navigator.serviceWorker?.controller), null, { timeout: 25_000 });
    // Não desligar a rede antes de concluir o pré-cache do núcleo.
    await expect.poll(async () => page.evaluate(async () => {
      const cache = await caches.open('jogahub-1.4.2-shell');
      const url = new URL('/js/app.js?v=153', location.href).href;
      return Boolean(await cache.match(url) && await cache.match(new URL('/js/catalog-core.js?v=1', location.href).href) && await cache.match(new URL('/js/navigation-core.js?v=1', location.href).href));
    }), { timeout: 25_000 }).toBe(true);

    await context.setOffline(true);
    try {
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(page.locator('#games .card[data-id="asfalto-brutal"]')).toBeVisible();
    } finally {
      await context.setOffline(false);
    }
  });
});
