# JogaHub 1.2.43

Central de jogos, filmes, séries, animes, TV e rádios para GitHub Pages.

## Acervo único do Google Drive

O catálogo de filmes e séries usa somente esta pasta raiz:

- **Filmes e Séries** — `1FpJ__h7dTKpD-VOTl3WUIgpBBUc4vhut`

O arquivo `tools/google-drive-sync.gs` percorre a raiz e todas as subpastas. As outras pastas do Drive que existiam nas versões anteriores foram removidas do catálogo, do sincronizador e do código do Apps Script.

Para ativar a leitura automática:

1. Abra um projeto no Google Apps Script.
2. Cole o conteúdo de `tools/google-drive-sync.gs`.
3. Implante como **Aplicativo da Web**, executando como você e permitindo acesso a qualquer pessoa com o link.
4. No JogaHub, abra **Configurações → Acervo único do Google Drive**.
5. Cole a URL terminada em `/exec` e clique em **Sincronizar agora**.

O navegador guarda a URL e o catálogo sincronizado localmente. Quando uma versão antiga é aberta, o cache de múltiplos Drives é apagado automaticamente.

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
- versão e caches unificados em `1.2.43`.

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
