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
