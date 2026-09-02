/* ===================================================================
   JOGAHUB — FILMES ANTIGOS

   Esta lista usa o player incorporado do Internet Archive.
   Antes de cadastrar outro filme, confirme na página da obra se o campo
   "Usage" permite a exibição (por exemplo: Public Domain ou CC0).

   Para adicionar um filme, copie um objeto e altere:
   - archiveId: trecho depois de archive.org/details/
   - sourceUrl: página oficial da obra no Internet Archive
   - thumb: capa automática gerada pelo Internet Archive
   =================================================================== */

const FILMES = [
  {
    id: 'filme-pica-pau-ep1',
    type: 'filme',
    title: 'Pica-Pau — Episódio 1',
    year: '',
    genre: 'Desenho',
    accent: 'var(--gold)',
    thumb: 'https://archive.org/services/img/OnovoShowoPicaPau',
    desc: 'Episódio 1 de Pica-Pau, reproduzido pelo player incorporado do Internet Archive.',
    archiveId: 'OnovoShowoPicaPau',
    sourceUrl: 'https://archive.org/details/OnovoShowoPicaPau'
  },
  {
    id: 'filme-nosferatu-1922',
    type: 'filme',
    title: 'Nosferatu',
    year: '1922',
    genre: 'Terror',
    accent: 'var(--purple)',
    thumb: 'https://archive.org/services/img/Nosferatu1922VHS',
    desc: 'Clássico expressionista de F. W. Murnau sobre o misterioso Conde Orlok. Filme mudo com cartelas em inglês.',
    archiveId: 'Nosferatu1922VHS',
    sourceUrl: 'https://archive.org/details/Nosferatu1922VHS'
  },
  {
    id: 'filme-his-girl-friday-1940',
    type: 'filme',
    title: 'Jejum de Amor',
    year: '1940',
    genre: 'Comédia',
    accent: 'var(--pink)',
    thumb: 'https://archive.org/services/img/his_girl_friday',
    desc: 'Comédia acelerada de Howard Hawks com Cary Grant e Rosalind Russell. Áudio original em inglês.',
    archiveId: 'his_girl_friday',
    sourceUrl: 'https://archive.org/details/his_girl_friday'
  },
  {
    id: 'filme-fantasma-opera-1925',
    type: 'filme',
    title: 'O Fantasma da Ópera',
    year: '1925',
    genre: 'Terror',
    accent: 'var(--red)',
    thumb: 'https://archive.org/services/img/ThePhantomoftheOpera',
    desc: 'A adaptação clássica estrelada por Lon Chaney, ambientada nos subterrâneos da Ópera de Paris. Filme mudo.',
    archiveId: 'ThePhantomoftheOpera',
    sourceUrl: 'https://archive.org/details/ThePhantomoftheOpera'
  },
  {
    id: 'filme-a-general-1926',
    type: 'filme',
    title: 'A General',
    year: '1926',
    genre: 'Comédia',
    accent: 'var(--gold)',
    thumb: 'https://archive.org/services/img/The_General_Buster_Keaton',
    desc: 'Aventura e comédia muda de Buster Keaton em uma perseguição ferroviária durante a Guerra Civil Americana.',
    archiveId: 'The_General_Buster_Keaton',
    sourceUrl: 'https://archive.org/details/The_General_Buster_Keaton'
  }
];
