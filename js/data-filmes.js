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
  }
];

// FILMES é a referência consumida pelo app e pelo player. Como aponta para o
// mesmo array, extensões carregadas depois (ex.: data-drive-filmes.js) entram
// automaticamente no catálogo sem precisar recriar a lista.
const FILMES = FILMES_CATALOGO;
