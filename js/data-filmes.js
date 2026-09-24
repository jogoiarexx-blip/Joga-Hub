/* ===================================================================
   JOGAHUB — CATÁLOGO BASE DE FILMES, DESENHOS E SÉRIES

   Este arquivo do ZIP original estava truncado no meio de um objeto.
   A base abaixo preserva as entradas completas recuperáveis do arquivo e
   mantém o array FILMES_CATALOGO aberto para extensões em arquivos separados,
   como js/data-drive-filmes.js.
   =================================================================== */

const FILMES_CATALOGO = [
  {
    id: 'colecao-series-gratis-mercado-play',
    type: 'filme',
    title: 'Séries Grátis — Mercado Play',
    year: 'Catálogo externo',
    genre: 'Séries grátis',
    mediaType: 'colecao',
    language: 'Português / dublagem varia por título',
    portuguese: true,
    colorContent: true,
    freeLegal: true,
    catalogOnly: true,
    availabilityStatus: 'Catálogo externo — títulos podem mudar',
    accent: 'var(--gold)',
    thumb: 'assets/series-mercado-play.svg',
    desc: 'Atalho para o catálogo externo do Mercado Play. A disponibilidade dos títulos depende da plataforma.',
    sourceUrl: 'https://play.mercadolivre.com.br/filtrar/series',
    sourceLabel: 'Mercado Play — catálogo de séries',
    nostalgiaTags: ['séries', 'streaming', 'mercado play', 'catálogo']
  },
  // Filmes completos dos canais oficiais, incorporados no player interno do JogaHub.
  // Notas verificadas em 24/09/2026; o provedor pode alterar a disponibilidade.
  {"id":"filmelier-van-gogh-2017","type":"filme","title":"Com Amor, Van Gogh","year":"2017","genre":"Animação / Drama","filmGenre":"animacao","mediaType":"filme","language":"Português (dublado)","portuguese":true,"colorContent":true,"freeLegal":true,"playablePick":true,"imdbRating":7.8,"accent":"#b78b35","thumb":"assets/filme-van-gogh.svg","desc":"Uma investigação animada com pinturas a óleo sobre a morte de Vincent van Gogh. Filme completo dublado publicado pelo Filmelier TV.","youtubeId":"YSM3HtL-6pQ","sourceUrl":"https://www.youtube.com/watch?v=YSM3HtL-6pQ","sourceLabel":"Filmelier TV — filme completo","nostalgiaTags":["filme completo","dublado","Filmelier TV"]},
  {"id":"filmelier-doentes-amor-2017","type":"filme","title":"Doentes de Amor","year":"2017","genre":"Comédia / Romance","filmGenre":"comedia","mediaType":"filme","language":"Português (dublado)","portuguese":true,"colorContent":true,"freeLegal":true,"playablePick":true,"imdbRating":7.5,"accent":"#a85b76","thumb":"assets/filme-doentes-amor.svg","desc":"Um casal enfrenta diferenças culturais e um desafio inesperado. Filme completo dublado publicado pelo Filmelier TV.","youtubeId":"wr_ibii-Jqc","sourceUrl":"https://www.youtube.com/watch?v=wr_ibii-Jqc","sourceLabel":"Filmelier TV — filme completo","nostalgiaTags":["filme completo","dublado","Filmelier TV"]},
  {"id":"filmelier-defensor-2021","type":"filme","title":"O Defensor: A História de Bert Trautmann","year":"2021","genre":"Esporte / Drama","filmGenre":"drama","mediaType":"filme","language":"Português (dublado)","portuguese":true,"colorContent":true,"freeLegal":true,"playablePick":true,"imdbRating":7.3,"accent":"#6586a0","thumb":"assets/filme-defensor.svg","desc":"Um ex-soldado reconstrói sua vida como goleiro na Inglaterra. Filme completo dublado publicado pelo Filmelier TV.","youtubeId":"5WyX5fwmutc","sourceUrl":"https://www.youtube.com/watch?v=5WyX5fwmutc","sourceLabel":"Filmelier TV — filme completo","nostalgiaTags":["filme completo","dublado","Filmelier TV"]},
  {"id":"filmelier-ficaremos-bem-2021","type":"filme","title":"Ficaremos Bem","year":"2021","genre":"Drama / Família","filmGenre":"drama","mediaType":"filme","language":"Português (dublado)","portuguese":true,"colorContent":true,"freeLegal":true,"playablePick":true,"imdbRating":7.3,"accent":"#997d92","thumb":"assets/filme-ficaremos-bem.svg","desc":"Uma notícia difícil leva um casal e sua família a reverem a vida juntos. Filme completo dublado publicado pelo Filmelier TV.","youtubeId":"kCxKA60YZ_E","sourceUrl":"https://www.youtube.com/watch?v=kCxKA60YZ_E","sourceLabel":"Filmelier TV — filme completo","nostalgiaTags":["filme completo","dublado","Filmelier TV"]},
  {"id":"filmelier-outra-face-guerra-2019","type":"filme","title":"A Outra Face da Guerra","year":"2019","genre":"Guerra / Drama","filmGenre":"drama","mediaType":"filme","language":"Português (dublado)","portuguese":true,"colorContent":true,"freeLegal":true,"playablePick":true,"imdbRating":7.2,"accent":"#6f7b79","thumb":"assets/filme-outra-face-guerra.svg","desc":"Um jovem letão se alista durante a Primeira Guerra Mundial. Filme completo dublado publicado pelo Filmelier TV.","youtubeId":"Ralnd-VvSsQ","sourceUrl":"https://www.youtube.com/watch?v=Ralnd-VvSsQ","sourceLabel":"Filmelier TV — filme completo","nostalgiaTags":["filme completo","dublado","Filmelier TV"]},
  {"id":"filmelier-segredos-guerra-2022","type":"filme","title":"Segredos de Guerra","year":"2022","genre":"Romance / Drama","filmGenre":"drama","mediaType":"filme","language":"Português (dublado)","portuguese":true,"colorContent":true,"freeLegal":true,"playablePick":true,"imdbRating":7.1,"accent":"#677ba1","thumb":"assets/filme-segredos-guerra.svg","desc":"Um soldado e um piloto vivem um romance durante a Guerra Fria. Filme completo dublado publicado pelo Filmelier TV.","youtubeId":"Tksn__fNp4o","sourceUrl":"https://www.youtube.com/watch?v=Tksn__fNp4o","sourceLabel":"Filmelier TV — filme completo","nostalgiaTags":["filme completo","dublado","Filmelier TV"]}
];

// FILMES é a referência consumida pelo app e pelo player. Como aponta para o
// mesmo array, extensões carregadas depois (ex.: data-drive-filmes.js) entram
// automaticamente no catálogo sem precisar recriar a lista.
const FILMES = FILMES_CATALOGO;
