# JogaHub 1.2.46

Central de jogos, filmes, séries, animes, TV e rádios para GitHub Pages.

## Acervo único do Google Drive

O catálogo de filmes e séries usa somente esta pasta raiz:

- **Filmes e Séries** — `1FpJ__h7dTKpD-VOTl3WUIgpBBUc4vhut`

O arquivo `tools/google-drive-sync.gs` percorre a raiz e todas as subpastas. As outras pastas do Drive que existiam nas versões anteriores foram removidas do catálogo, do sincronizador e do código do Apps Script.

A leitura automática já está configurada nesta versão com a implantação `/exec` criada para o acervo. Para manter o modo mais compatível entre navegadores, o arquivo `tools/google-drive-sync.gs` desta versão também oferece JSONP como fallback. Se você substituir o código do Apps Script, atualize a implantação existente e mantenha o mesmo URL `/exec`; se criar uma implantação nova, cole a nova URL em **Configurações → Acervo único do Google Drive**.

O navegador guarda o catálogo sincronizado localmente e usa `drive-snapshot.js` como fallback. Quando uma versão antiga é aberta, os caches antigos do Drive são descartados automaticamente.

## Organização recomendada

```text
Filmes e Séries/
├── Filmes/
│   └── Nome do Filme (2026).mp4
└── Séries/
    └── Nome da Série/
        └── Temporada 1/
            ├── S01E01 - Título.mp4
            └── S01E02 - Título.mp4
```

O sincronizador reconhece formatos como `S01E02`, `T01E02`, `1x02`, `Episódio 2` e pastas chamadas `Temporada 1` ou `Season 1`.

## Otimizações desta versão

- imagens de conteúdo locais em WebP;
- PNG mantido somente onde PWA, Android, iOS ou favicon exigem compatibilidade;
- pré-cache inicial reduzido de aproximadamente 8,6 MB para os arquivos essenciais;
- capas, banners e fontes armazenados sob demanda;
- cache antigo de múltiplos Drives invalidado;
- um único Drive permitido no front-end e no Apps Script;
- agrupamento de séries corrigido para respeitar a pasta real da série;
- versão e caches unificados em `1.2.46`.

## Execução local

O projeto é estático. Abra com um servidor HTTP local ou publique a pasta no GitHub Pages. Abrir diretamente por `file://` pode impedir Service Worker, cache offline e algumas requisições.

## Arquivos principais

- `index.html` — interface principal.
- `js/app.js` — catálogo, busca, favoritos e navegação.
- `js/data-drive-filmes.js` — raiz única do acervo.
- `js/drive-sync.js` — importação e cache do catálogo.
- `tools/google-drive-sync.gs` — leitura recursiva no Google Drive.
- `link-player.html` — reprodução de filmes e episódios.
- `sw.js` — instalação PWA e cache offline.

Use somente mídias que você tenha autorização para armazenar e reproduzir.

## Google Drive automático — 1.2.46

- O JogaHub usa o Web App do Google Apps Script como índice do acervo, sem Drive API e sem API key.
- A pasta principal e todas as subpastas são percorridas recursivamente.
- O sincronizador aceita tanto o formato antigo (`ok/files`) quanto o novo (`sucesso/itens`).
- O catálogo é atualizado automaticamente e remove itens que saíram do Drive.
- Há cache local e `drive-snapshot.js` como fallback para abrir rápido/offline.
- O player também carrega o catálogo do Drive, permitindo navegar por temporadas e episódios.
- Se `fetch()` for bloqueado pelo navegador, o sincronizador tenta JSONP; para isso, use o `tools/google-drive-sync.gs` desta versão.
