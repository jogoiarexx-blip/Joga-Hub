# Testes reais do JogaHub (navegador)

O núcleo de mídia já tem testes de lógica em tools/test-drive-core.mjs.
Esta suíte complementar executa Chrome/Chromium em um servidor local de
verdade (não interpreta o HTML apenas como string).

## Cobertura
- Navegação pela biblioteca e os três jogos externos adicionados ao catálogo.
- Busca sem acento, mudança e limpeza de filtros.
- Favoritos persistidos após recarregar a página.
- Série Profundezas, contagem dos episódios e abertura do player JogaHub.
- Visibilidade da busca em 1366x768 e 390x844.
- Service worker/PWA: pré-cache e reabertura offline sem perder o catálogo.

Os testes de player conferem apenas a NAVEGAÇÃO e a montagem dos episódios.
Eles não fingem reproduzir vídeos do Google Drive e não garantem codecs,
credenciais, permissões ou disponibilidade dos provedores externos.

## Rodar no Windows, Linux ou macOS
É necessário Node.js 22+.

1. npm install
2. npx playwright install chromium
3. npm run test:browser

Para observar a execução: npm run test:browser:headed
Para executar um único projeto: npm run test:browser -- --project=mobile-390x844

O servidor de testes é iniciado automaticamente em 127.0.0.1:4173.
Não são modificados os jogos nem os vídeos reais. As requisições externas
são intencionalmente bloqueadas para evitar falsos negativos causados por
conexão, CORS ou Google Drive indisponível.

## Relatórios
O GitHub Actions executa a mesma suíte em desktop e mobile.
Em falhas, envia as capturas de tela, traces e relatório do Playwright
como artefatos do workflow. Para investigar um teste local:
npx playwright show-report
