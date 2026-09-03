# JogaHub 1.0.2

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


## v1.0.2 — Clássicos da TV
- Novo filtro **📺 Clássicos da TV**.
- Linha dedicada na área de streaming.
- Busca reconhece termos nostálgicos como TV anos 90, Sessão da Tarde e Cinema em Casa.
- Adicionado **Era uma Vez no Oeste (1968)** via NetMovies Clássicos oficial/licenciado.
- Mr. Bumpy, Pica-Pau e a coleção NetMovies agora também aparecem na área de Clássicos da TV.
- Títulos sem fonte oficial incorporável não são cadastrados como reprodução para evitar links quebrados ou cópias não autorizadas.
