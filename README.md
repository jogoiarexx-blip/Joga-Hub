# JogaHub 1.0.17

Prateleira de jogos como conteúdo principal e uma aba separada de filmes antigos em domínio público, hospedada como site estático (GitHub Pages).

## Filmes antigos

O catálogo fica em `js/data-filmes.js` e a explicação completa está em `COMO-ADICIONAR-FILMES.md`. Os vídeos não ficam armazenados neste projeto: o player incorpora a reprodução fornecida pelo Internet Archive.

## Como adicionar um item novo (jogo, livro ou app)

Tudo mora num único array `ITEMS`, em `js/app.js`. Cada item tem um campo
`type`, que é o que muda o ícone, o rótulo da aba e o texto do botão
("jogar" / "ler" / "abrir").

1. Se o item roda no próprio site (um jogo, por exemplo), duplique a pasta
   `jogos/exemplo` e renomeie (ex: `jogos/meu-jogo`), e coloque o conteúdo
   dentro (o `index.html` daquela pasta é a porta de entrada). Livros e apps
   não precisam de pasta própria — o `path` pode apontar direto pra um link
   externo (loja, PDF, site do projeto etc).

2. Abra `js/app.js` e adicione um objeto no array `ITEMS`, copiando o formato
   dos outros:

```js
{
  id: 'meu-item',
  type: 'jogo',          // 'jogo', 'livro' ou 'app'
  title: 'Meu Item',
  genre: 'ação',          // aparece como tag e também vira filtro (dentro da aba do type)
  accent: 'var(--teal)',  // cor do cartucho: var(--red), var(--purple), var(--teal), var(--amber), var(--gold), var(--steel), var(--fire), ou um hex novo
  thumb: 'assets/thumbs/meu-item.jpg', // opcional: screenshot ou capa
  desc: 'Descrição curta, uma frase.',
  path: 'jogos/meu-item/index.html'    // pode ser um caminho local ou um link https:// externo
}
```

Não precisa mexer no HTML — as abas, os filtros e o grid são gerados
automaticamente a partir desse array.

## Tipos disponíveis

Definidos no objeto `TYPES`, no topo de `js/app.js`:

- `livro` — ícone 📖, botão "ler"
- `jogo` — ícone 🎮, botão "jogar"
- `app` — ícone 📱, botão "abrir"

As abas de tipo (Todos / Livros / Jogos / Apps) aparecem sozinhas conforme
os tipos presentes no array `ITEMS` — se você ainda não tem nenhum livro
cadastrado, a aba "livros" simplesmente não aparece.

A ordem das abas, e também a ordem dos cards quando a aba "Todos" está
selecionada, segue sempre o array `TYPE_ORDER` (logo abaixo de `TYPES`) —
por padrão `['livro', 'jogo', 'app']`, pra livros aparecerem primeiro,
não importa em que ordem eles foram cadastrados em `ITEMS`. Pra mudar
essa prioridade, é só reordenar esse array.

O filtro de gênero (os botões abaixo da busca) muda de acordo com a aba
selecionada: dentro de "livros" mostra gêneros literários, dentro de
"jogos" mostra gêneros de jogo, e assim por diante — cada item usa seu
próprio campo `genre` livremente.

## Banner / vitrine

Também em `js/app.js`, no objeto `BANNER` no topo: troque `image`, `link` e
`label`. Imagem ideal: ~1200x300px.

## Cores disponíveis

Definidas em `css/style.css` no `:root`: `--red`, `--purple`, `--teal`,
`--amber`, `--gold`, `--steel`, `--fire`.
Pode usar uma dessas no campo `accent` ou passar um hex direto.


## Organização física dos jogos — v13
Os jogos agora ficam em `jogos/<categoria>/<jogo>/`. Categorias: arcade, shoot-em-up, plataforma, survival, cartas, simulacao, corrida, rpg e outros.


## v15 — Apps em pastas próprias
Os apps Termo Premium, NutriCalc Pro, Iron Training, FORGE V12 e Invest+ agora ficam em uma pasta própria com `index.html`. Também foram corrigidos os caminhos de Casa Check, Desafios do Amor e XP Life.


## Mudança da versão 1.0
Os jogos locais foram removidos. Novos jogos devem ser publicados separadamente (ex.: GitHub Pages) e adicionados em `js/data-links.js`.


## v1.5.1 — filmes clássicos dublados
- Integração da coleção oficial NetMovies Clássicos.
- Novos filtros: Português, Coloridos PT-BR e Coleções.
- Linha especial para conteúdos coloridos em português.

## v1.5.2 — Mr. Bumpy em português
- Adicionados os episódios/arquivos dublados de Mr. Bumpy encontrados e ainda disponíveis para reprodução incorporada.
- Mr. Bumpy aparece como série própria e os itens encontrados são agrupados no player.
- Catálogo deixa claro que a preservação dublada online é incompleta e pode mudar conforme a disponibilidade das fontes.


## v1.0.1 — player e streaming
- Novo player com modo cinema, mini player flutuante e tela cheia.
- Próximo episódio automático com contagem regressiva quando a fonte permite controle do player.
- Retomada e histórico aprimorados para Internet Archive e vídeos individuais do YouTube.
- Preferências de velocidade e volume persistentes.
- Séries agrupadas no catálogo e painel com temporadas/episódios no player.
- Estados “assistido” e porcentagem vista nos cards/episódios.
- Melhorias de layout e controles para celular.


## v1.0.5 — Clássicos da TV
- Novo filtro **📺 Clássicos da TV**.
- Linha dedicada na área de streaming.
- Busca reconhece termos nostálgicos como TV anos 90, Sessão da Tarde e Cinema em Casa.
- Adicionado **Era uma Vez no Oeste (1968)** via NetMovies Clássicos oficial/licenciado.
- Mr. Bumpy, Pica-Pau e a coleção NetMovies agora também aparecem na área de Clássicos da TV.
- Títulos sem fonte oficial incorporável não são cadastrados como reprodução para evitar links quebrados ou cópias não autorizadas.


## v1.0.5 — Séries clássicas de catálogo
- Adicionadas **O Mundo Perdido (1999)** e **A Feiticeira (1964)**.
- Séries sem player incorporável aparecem com **Onde assistir**, sem usar uploads não oficiais.
- O Mundo Perdido: 3 temporadas / 66 episódios catalogados.
- A Feiticeira: 8 temporadas / 254 episódios catalogados.


## Downloads offline (v1.0.5)
Conteúdos do Internet Archive que oferecem arquivo de vídeo direto podem ser salvos no navegador para reprodução offline. Vídeos do YouTube e páginas externas não são capturados nem baixados pelo JogaHub. Os downloads ficam somente no dispositivo/navegador onde foram feitos e podem ser removidos pela área **Downloads**.


## v1.0.7 — Séries grátis legais

- Novo filtro **🆓 Séries grátis**.
- Catálogo oficial do Mercado Play integrado como atalho dinâmico.
- Séries verificadas como gratuitas adicionadas ao catálogo: CSI: Miami, Under the Dome, FBI, FBI: Most Wanted, The Rookie, Impuros, The Affair, The Good Wife, Charmed — Jovens Bruxas, Avatar: A Lenda de Aang, The Chosen e Jesus para Crianças.
- Conteúdo externo gratuito abre na fonte oficial; o JogaHub não copia nem baixa episódios de serviços que não autorizam isso.
- A disponibilidade pode mudar conforme o catálogo das plataformas.


## v1.0.7 — ALF, Luta Livre e Animes
Adiciona ALF (catálogo oficial PT-BR), WWE Vault/Raw com vídeos oficiais incorporados, BWF Telecatch e uma área de animes com atalhos oficiais para Crunchyroll e Pluto TV.

## v1.0.8 — Baki + gêneros de filmes
- Baki the Grappler (2001) adicionado como catálogo enquanto não há streaming oficial no Brasil.
- Novos filtros: Ação, Comédia, Romance, Terror e Ficção científica.
- Coleções gratuitas legais do Mercado Play e seleção de títulos atuais adicionadas.


## v1.0.8 — busca multi-fonte
Catálogo ampliado com Mercado Play, Plex, Pluto TV, NetMovies/YouTube oficial e Internet Archive. Baki the Grappler clássico permanece apenas como catálogo enquanto não houver fonte oficial completa em PT-BR.


## v1.0.17 — YouTube PT-BR oficial/licenciado

- Novo filtro **▶️ YouTube PT**.
- Adicionados filmes completos dublados de canais NetMovies.
- Adicionados Yu-Gi-Oh! Duel Monsters e GX em português por fonte oficial.
- Adicionado Beyblade X em português pelo canal oficial.
- Adicionados episódios/compilações de He-Man e She-Ra em português.
- Adicionados episódios dublados de A Pantera Cor-de-Rosa.
- Mantida a regra: o catálogo principal só mostra itens reproduzíveis dentro do JogaHub.

## v1.0.13 — séries e animes multifonte
Busca ampliada em Plex, Pluto TV, Crunchyroll e demais fontes oficiais. ALF atualizado para a oferta gratuita do Plex; novas séries grátis e animes com páginas oficiais adicionados.


## v1.0.13 — clássicos encontrados pelo usuário

- Yu Yu Hakusho: catálogo oficial via Crunchyroll.
- Sakura Card Captors: catálogo legal atual via KoiPlay/Amazon Channel.
- Phantom Quest Corp.: catálogo sem incorporar upload não autorizado do Archive.
- Shinzo (Mushrambo): 32 episódios catalogados; sem streaming legal no Brasil no momento.
- Múmias Vivas: 42 episódios, disponibilidade legal via Oldflix.

Os links do Internet Archive enviados pelo usuário foram verificados, mas não são incorporados quando a autorização de distribuição da obra protegida não está clara.


## v1.0.13 — Corrida Maluca

- Adicionada Corrida Maluca ao catálogo de Desenhos / Nostalgia da TV.
- Fonte externa informada pelo usuário: Internet Archive.
- Download offline não é habilitado para esse item por não haver autorização clara de redistribuição no upload.


## v1.0.13 — catálogo somente reproduzível

- O catálogo principal agora exibe somente conteúdos que podem abrir no player do próprio JogaHub.
- Itens apenas de catálogo/“Onde assistir” são ocultados automaticamente.
- A regra é global: novos itens externos sem player interno também não aparecem.


## v1.0.13 — Archive PT automático
- Novo filtro **🏛️ Archive PT**.
- Busca automática no Internet Archive por vídeos em português/dublados.
- Só importa automaticamente itens cujos metadados indiquem **Creative Commons, domínio público ou outra marcação aberta equivalente**.
- Os itens importados usam o player interno do JogaHub (`archiveId`).
- A busca é atualizada ao abrir o site; a disponibilidade do Archive pode variar.
- O catálogo principal continua escondendo páginas que servem apenas como “Onde assistir”.


## v1.0.17 — Doramas oficiais no player
- Nova categoria 🌸 Doramas.
- Adicionados K-dramas completos do canal oficial KBS WORLD TV: If We Were a Season, My Happy Home e The Tuna and the Dolphin.
- Os títulos são reproduzidos dentro do JogaHub via player oficial do YouTube.
- Eles estão em coreano com legendas em inglês; não são marcados como dublados em português.
- KOCOWA/Viki continuam fora do catálogo principal quando não permitem reprodução incorporada no JogaHub.


## v1.0.17 — Catálogo multifonte ampliado
- Regra do Archive ampliada: publicação pública entra quando não há indicação explícita de upload não autorizado.
- Novos conteúdos internos: Pokémon, He-Man, She-Ra, Turma da Mônica, NetMovies, dramas turcos e arquivos PT do Internet Archive.
- O catálogo principal continua exibindo somente itens que possuem player interno (Archive, YouTube ou vídeo direto).
