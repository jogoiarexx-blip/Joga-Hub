/* ===================================================================
   JOGAHUB — CATÁLOGO DE FILMES, DESENHOS E SÉRIES CLÁSSICAS

   Conteúdos online podem usar o Internet Archive ou players oficiais
   incorporáveis, como YouTube. Antes de cadastrar outro título, confirme
   se a fonte permite incorporação/exibição.

   Para séries/desenhos use também:
   mediaType: 'serie', seriesId, seriesTitle, season e episode.
   Para longa-metragem use mediaType: 'filme'.
   =================================================================== */

const FILMES_CATALOGO = [

  {
    id: 'catalogo-google-drive',
    type: 'filme',
    title: 'Filmes, Séries e Animações — Google Drive',
    year: 'Catálogo do Drive',
    genre: 'Filmes / Séries / Animações',
    mediaType: 'colecao',
    language: 'Conforme cada arquivo',
    portuguese: true,
    colorContent: true,
    catalogOnly: true,
    accent: 'var(--brand-blue)',
    driveFolderId: '1F2_t5aERWvGfOL_4VxWMgEDiwoBbZRc1',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1F2_t5aERWvGfOL_4VxWMgEDiwoBbZRc1',
    sourceUrl: 'https://drive.google.com/drive/folders/1F2_t5aERWvGfOL_4VxWMgEDiwoBbZRc1',
    sourceLabel: 'Google Drive — pasta de filmes, séries e animações',
    desc: 'Catálogo do Google Drive informado para o JogaHub. A pasta é a fonte central para filmes, séries, animações e demais vídeos disponibilizados nela.',
    nostalgiaTags: ['filmes','séries','animações','Google Drive','catálogo']
  },

  {
    id: 'colecao-series-gratis-mercado-play',
    type: 'filme',
    title: 'Séries Grátis — Mercado Play',
    year: 'Catálogo atual',
    genre: 'Séries grátis',
    mediaType: 'colecao',
    language: 'Português / dublagem varia por título',
    portuguese: true,
    colorContent: true,
    freeLegal: true,
    catalogOnly: true,
    availabilityStatus: 'Catálogo oficial gratuito — títulos podem mudar',
    accent: 'var(--gold)',
    thumb: 'assets/series-mercado-play.svg',
    desc: 'Atalho para o catálogo oficial de séries do Mercado Play. A plataforma informa que oferece séries e filmes grátis; o catálogo muda ao longo do tempo.',
    sourceUrl: 'https://play.mercadolivre.com.br/filtrar/series',
    sourceLabel: 'Mercado Play — catálogo oficial de séries grátis',
    nostalgiaTags: ['séries grátis', 'streaming grátis', 'mercado play', 'catálogo legal']
  },
  {
    id: 'serie-csi-miami-mercado-play',
    type: 'filme', title: 'CSI: Miami', year: '2002', genre: 'Crime / Ação',
    mediaType: 'serie', seriesId: 'csi-miami-mercado-play', seriesTitle: 'CSI: Miami',
    seasonCount: 7, language: 'Português / áudio conforme plataforma', portuguese: true, colorContent: true,
    freeLegal: true, catalogOnly: true, availabilityStatus: 'Assistir grátis no Mercado Play', accent: 'var(--gold)',