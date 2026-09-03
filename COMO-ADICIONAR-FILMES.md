# Como adicionar filmes antigos ao JogaHub

Edite o arquivo `js/data-filmes.js`. Os filmes aparecem automaticamente na aba **Filmes Antigos**.

Use somente obras cuja licença permita a exibição. No Internet Archive, abra a página do filme e confira o campo **Usage**. Dê preferência a itens marcados como **Public Domain** ou **CC0**.

Exemplo, para uma página com endereço `https://archive.org/details/IDENTIFICADOR`:

```js
{
  id: 'filme-identificador-ano',
  type: 'filme',
  title: 'Nome do Filme',
  year: '1925',
  genre: 'Comédia',
  accent: 'var(--gold)',
  thumb: 'https://archive.org/services/img/IDENTIFICADOR',
  desc: 'Descrição curta e informação sobre idioma ou legendas.',
  archiveId: 'IDENTIFICADOR',
  sourceUrl: 'https://archive.org/details/IDENTIFICADOR'
}
```

O `archiveId` é exatamente o trecho que aparece depois de `/details/`. Não coloque links de arquivos particulares ou filmes sem autorização.


## Player aprimorado (v1.3.2)

Filmes com `archiveId` tentam automaticamente usar o arquivo de vídeo do Internet Archive no player próprio do JogaHub. Isso habilita retomar de onde parou, avançar/voltar 10 segundos, velocidade, tela cheia, Picture-in-Picture e atalhos. Se o item não disponibilizar um arquivo de vídeo direto compatível, o sistema volta automaticamente para o player incorporado do Internet Archive.

A ordem dos itens em `js/data-filmes.js` também define a navegação **anterior/próximo** e a lista exibida abaixo do player.

## Organização em séries, temporadas e episódios (JogaHub 1.4.0)

Para um filme avulso, use:

```js
mediaType: 'filme'
```

Para desenho ou série episódica, além dos campos normais, use:

```js
mediaType: 'serie',
seriesId: 'nome-unico-da-serie',
seriesTitle: 'Nome da Série',
season: 1,
episode: 1
```

Episódios com o mesmo `seriesId` e `season` são agrupados automaticamente no player. A aba Filmes Antigos também separa Séries/Desenhos, Filmes, Minha Lista e conteúdos em andamento.
