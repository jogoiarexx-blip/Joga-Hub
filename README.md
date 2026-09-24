## Versão 1.3.7 — filmes completos no player

- Removidos os sete atalhos de assinatura adicionados por engano na versão anterior.
- Seis longas dublados com notas 7,1–7,8 e publicações oficiais do Filmelier TV no YouTube entram na fileira **Filmes completos para assistir aqui**.
- Ao tocar na capa, o vídeo abre no player interno do JogaHub, com a integração existente do YouTube. O vídeo permanece hospedado pelo canal; a incorporação depende da permissão e disponibilidade definidas pelo YouTube.
- Capas tipográficas locais em SVG sem depender de terceiros; notas conferidas em 24/09/2026.

## Versão 1.3.5 — player offline e sincronização

- Botão de download e leitura offline do player corrigidos com as funções e chaves usadas no catálogo.
- Vídeos salvos são reproduzidos por streaming local, com suporte a solicitações de trechos, sem carregar o filme inteiro na memória.
- O player usa a versão atual do sincronizador do Drive.
- Respostas parciais da varredura do Drive preservam os arquivos já exibidos.
- Vídeos MKV e AVI do Drive abrem diretamente no modo compatível, sem aguardar tentativas de reprodução não suportadas pelo navegador.

## Versão 1.3.4 — carregamento e catálogo

- Busca externa de filmes e séries começa quando o usuário abre uma área de mídia; a página inicial evita essas quatro consultas.
- Itens recebidos de duas fontes de busca com o mesmo arquivo do Internet Archive aparecem uma única vez.
- Atualizações simultâneas do catálogo compartilham um redesenho por quadro.
- O cache do player identifica a página pelo caminho; episódios com parâmetros diferentes abrem offline sem guardar cópias do mesmo HTML.

## Versão 1.3.3 — desempenho e funcionamento

- Busca com pequeno atraso para evitar redesenhar o catálogo em cada tecla.
- Sincronização do Drive sem redesenhos e consultas duplicadas; falhas de atualização são indicadas no painel.
- Instalação offline com quatro downloads simultâneos; páginas essenciais disponíveis sem rede.
- Arquivos baixados explicitamente são consultados no cache offline, preservando downloads anteriores.
- Navegação offline não substitui páginas internas ausentes pela página inicial.

# JogaHub 1.3.2

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

- busca usa índice normalizado em memória, reduzindo trabalho a cada tecla em catálogos grandes;
- cache do Google Drive ficou mais compacto e evita sincronização redundante durante 10 minutos;
- snapshot empacotado e cache local são comparados para priorizar a fonte mais recente;
- navegação do PWA usa fallback temporizado e arquivos versionados são atendidos pelo cache imediatamente;
- nova seção **Adicionados recentemente** para o conteúdo do Drive;
- aba e busca refletidas na URL, permitindo voltar, avançar e compartilhar a tela atual;
- indicador de conexão, quantidade de vídeos e horário da última sincronização;
- botão para limpar busca e botão de retorno ao topo;
- imagens com decodificação assíncrona e carregamento progressivo;
- listas fora da tela deixam de consumir renderização desnecessária;
- navegação de teclado, foco visível, salto para o conteúdo e respeito à redução de movimento;
- aviso quando uma nova versão do PWA estiver pronta;
- imagens de conteúdo locais em WebP;
- PNG mantido somente onde PWA, Android, iOS ou favicon exigem compatibilidade;
- pré-cache inicial reduzido de aproximadamente 8,6 MB para os arquivos essenciais;
- capas, banners e fontes armazenados sob demanda;
- cache antigo de múltiplos Drives invalidado;
- um único Drive permitido no front-end e no Apps Script;
- fallback offline atualizado com os 77 vídeos encontrados no acervo em 23/09/2026;
- agrupamento de séries corrigido para ignorar pastas genéricas como “Series” e respeitar a pasta real da série;
- episódios repetidos são ocultados por série, temporada e número do episódio;
- sincronizações simultâneas são consolidadas e têm limite de tempo;
- novos itens aparecem na tela imediatamente, sem precisar recarregar a página;
- itens descobertos no Archive e YouTube não somem após atualizar o Drive;
- listeners de rolagem e leituras repetidas de favoritos foram reduzidos;
- versão e caches unificados em `1.3.2`.

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

## Google Drive automático — 1.3.2

- O JogaHub usa o Web App do Google Apps Script como índice do acervo, sem Drive API e sem API key.
- A pasta principal e todas as subpastas são percorridas recursivamente.
- O sincronizador aceita tanto o formato antigo (`ok/files`) quanto o novo (`sucesso/itens`).
- O catálogo é atualizado automaticamente e remove itens que saíram do Drive.
- Há cache local e `drive-snapshot.js` como fallback para abrir rápido/offline.
- O player também carrega o catálogo do Drive, permitindo navegar por temporadas e episódios.
- Se `fetch()` for bloqueado pelo navegador, o sincronizador tenta JSONP; para isso, use o `tools/google-drive-sync.gs` desta versão.
