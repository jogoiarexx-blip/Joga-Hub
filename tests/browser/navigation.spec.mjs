import { test, expect } from '@playwright/test';

// Testa a navegação real, sem depender de serviços externos de streaming.
test.beforeEach(async ({ page }) => {
  await page.route(/^https?:\/\/(?!127\.0\.0\.1:4173)/, route => route.abort());
});

test('categoria Corrida mostra Asfalto Brutal e limpa o filtro',async({page})=>{
  await page.goto('/?view=jogo',{waitUntil:'domcontentloaded'});
  const filters=page.locator('#filters');
  await expect(filters.locator('[data-genre="corrida"]')).toBeVisible();
  await filters.locator('[data-genre="corrida"]').click();
  await expect(page.locator('#games .card[data-id="asfalto-brutal"]')).toBeVisible();
  await expect(page.locator('#games .card[data-id="hulk-smash-city"]')).toHaveCount(0);
  await filters.locator('[data-genre="todos"]').click();
  await expect(page.locator('#games .card[data-id="hulk-smash-city"]')).toBeVisible();
});

test('filtro Breaking Bad não esconde Profundezas ao limpar',async({page})=>{
  await page.goto('/?view=serie',{waitUntil:'domcontentloaded'});
  const filters=page.locator('#filters');
  await expect(filters.locator('[data-genre="breaking-bad"]')).toBeVisible();
  await filters.locator('[data-genre="breaking-bad"]').click();
  await expect(page.locator('#games .stream-card').first()).toBeVisible();
  await expect(page.locator('#games .stream-card').first()).toContainText(/Breaking Bad/i);
  await filters.locator('[data-genre="todos"]').click();
  await expect(page.locator('#catalog-drive-series .series-summary').filter({hasText:/Profundezas/i})).toHaveCount(1);
});

test('trocar abas preserva histórico e restaura busca por URL',async({page})=>{
  await page.goto('/?view=jogo&q=asfalto',{waitUntil:'domcontentloaded'});
  await expect(page.locator('#search')).toHaveValue('asfalto');
  await expect(page.locator('#games .card[data-id="asfalto-brutal"]')).toBeVisible();
  await page.locator('button[data-sidebar-view="serie"]:visible, button[data-view="serie"]:visible').first().click();
  await expect(page).toHaveURL(/view=serie/);
  await page.goBack({waitUntil:'domcontentloaded'});
  await expect(page.locator('#search')).toHaveValue('asfalto');
  await expect(page.locator('#games .card[data-id="asfalto-brutal"]')).toBeVisible();
});
