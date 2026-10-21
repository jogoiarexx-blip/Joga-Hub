import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  testMatch: '**/*.spec.mjs',
  timeout: 45_000,
  expect: { timeout: 10_000 },
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [['line'], ['html', { open: 'never' }]]
    : 'list',
  outputDir: 'test-results',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    browserName: 'chromium',
    serviceWorkers: 'block',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop-1366x768', use: { viewport: { width: 1366, height: 768 } } },
    {
      name: 'mobile-390x844',
      use: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
    },
    // Suites curtas dedicadas a motores de navegador diferentes.
    // A regressão completa continua nos dois projetos Chromium anteriores.
    { name: 'firefox-desktop', grep: /@crossbrowser/, use: { browserName: 'firefox', viewport: { width: 1366, height: 768 } } },
    { name: 'webkit-desktop', grep: /@crossbrowser/, use: { browserName: 'webkit', viewport: { width: 1366, height: 768 } } },
    { name: 'webkit-mobile', grep: /@crossbrowser/, use: { browserName: 'webkit', viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } },
  ],
  webServer: {
    command: 'node tools/serve-static.mjs',
    url: 'http://127.0.0.1:4173/',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
