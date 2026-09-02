# JogaHub 1.2.4 — jogos somente por link

Os jogos não ficam mais dentro deste projeto. Publique cada jogo separadamente e adicione somente a URL HTTPS aqui.

## GitHub Pages funciona?
Sim. O link correto é o endereço publicado pelo GitHub Pages, por exemplo:

`https://seu-usuario.github.io/nome-do-jogo/`

Não use o link normal do arquivo no repositório (`github.com/.../index.html`), porque ele mostra o código/arquivo e não hospeda o jogo como página web.

## Onde cadastrar
Edite `js/data-links.js` e adicione:

```js
{
  id: 'meu-jogo',
  type: 'jogo',
  title: 'Meu Jogo',
  genre: 'arcade',
  category: 'arcade',
  accent: 'var(--fire)',
  thumb: 'https://seu-site.com/capa.webp',
  desc: 'Descrição curta do jogo.',
  url: 'https://seu-usuario.github.io/meu-jogo/',
  embed: false
}
```

`embed: false` é a opção mais compatível: abre o jogo em nova aba. Use `embed: true` somente quando quiser tentar abrir dentro do JogaHub; alguns hosts podem bloquear iframe.
