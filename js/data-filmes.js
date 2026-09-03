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
    thumb: 'assets/serie-csi-miami.svg',
    desc: 'Investigadores forenses de Miami combinam ciência, tecnologia e trabalho policial para solucionar crimes. Disponibilidade gratuita verificada no Mercado Play.',
    sourceUrl: 'https://play.mercadolivre.com.br/filtrar/series', sourceLabel: 'Mercado Play — assistir grátis',
    classicTv: true, nostalgiaTags: ['anos 2000','crime','policial','TV','série grátis']
  },
  {
    id: 'serie-under-the-dome-mercado-play',
    type: 'filme', title: 'Under the Dome', year: '2013', genre: 'Drama / Ficção científica',
    mediaType: 'serie', seriesId: 'under-the-dome-mercado-play', seriesTitle: 'Under the Dome',
    seasonCount: 3, language: 'Português / áudio conforme plataforma', portuguese: true, colorContent: true,
    freeLegal: true, catalogOnly: true, availabilityStatus: '3 temporadas — grátis no Mercado Play', accent: 'var(--purple)',
    thumb: 'assets/serie-under-the-dome.svg',
    desc: 'Uma cidade é isolada do mundo por uma enorme cúpula transparente. As três temporadas aparecem no catálogo gratuito do Mercado Play.',
    sourceUrl: 'https://play.mercadolivre.com.br/assistir/ef16a3cf1aff4c6ab9ab238c3a25bff6', sourceLabel: 'Mercado Play — página oficial',
    nostalgiaTags: ['ficção científica','mistério','série grátis','2010']
  },
  {
    id: 'serie-fbi-mercado-play',
    type: 'filme', title: 'FBI', year: '2018', genre: 'Drama / Ação',
    mediaType: 'serie', seriesId: 'fbi-mercado-play', seriesTitle: 'FBI', seasonCount: 3,
    language: 'Português / áudio conforme plataforma', portuguese: true, colorContent: true, freeLegal: true, catalogOnly: true,
    availabilityStatus: '3 temporadas — grátis no Mercado Play', accent: 'var(--red)', thumb: 'assets/serie-fbi.svg',
    desc: 'Drama policial sobre uma unidade de elite do FBI em Nova York. Três temporadas aparecem gratuitamente no Mercado Play.',
    sourceUrl: 'https://play.mercadolivre.com.br/filtrar/series', sourceLabel: 'Mercado Play — assistir grátis',
    nostalgiaTags: ['ação','policial','investigação','série grátis']
  },
  {
    id: 'serie-fbi-most-wanted-mercado-play',
    type: 'filme', title: 'FBI: Most Wanted', year: '2020', genre: 'Crime / Ação',
    mediaType: 'serie', seriesId: 'fbi-most-wanted-mercado-play', seriesTitle: 'FBI: Most Wanted',
    language: 'Português / áudio conforme plataforma', portuguese: true, colorContent: true, freeLegal: true, catalogOnly: true,
    availabilityStatus: 'Disponível grátis no Mercado Play', accent: 'var(--red)', thumb: 'assets/serie-fbi-most-wanted.svg',
    desc: 'Spin-off de FBI centrado na equipe que persegue criminosos mais procurados. Disponibilidade gratuita verificada no Mercado Play.',
    sourceUrl: 'https://play.mercadolivre.com.br/assistir/fbi-o-mais-procurado/0b0af4ef06de4d18932fb0e0c483208d', sourceLabel: 'Mercado Play — página oficial',
    nostalgiaTags: ['crime','policial','ação','série grátis']
  },
  {
    id: 'serie-the-rookie-mercado-play',
    type: 'filme', title: 'The Rookie', year: '2018', genre: 'Ação / Crime',
    mediaType: 'serie', seriesId: 'the-rookie-mercado-play', seriesTitle: 'The Rookie', seasonCount: 5,
    language: 'Português / áudio conforme plataforma', portuguese: true, colorContent: true, freeLegal: true, catalogOnly: true,
    availabilityStatus: '5 temporadas — grátis no Mercado Play', accent: 'var(--green)', thumb: 'assets/serie-the-rookie.svg',
    desc: 'John Nolan recomeça a vida como o novato mais velho do Departamento de Polícia de Los Angeles. Cinco temporadas aparecem no catálogo gratuito.',
    sourceUrl: 'https://play.mercadolivre.com.br/filtrar/series', sourceLabel: 'Mercado Play — assistir grátis',
    nostalgiaTags: ['policial','ação','crime','série grátis']
  },
  {
    id: 'serie-impuros-mercado-play',
    type: 'filme', title: 'Impuros', year: '2018', genre: 'Drama / Crime',
    mediaType: 'serie', seriesId: 'impuros-mercado-play', seriesTitle: 'Impuros', seasonCount: 2,
    language: 'Português', portuguese: true, colorContent: true, freeLegal: true, catalogOnly: true,
    availabilityStatus: '2 temporadas — grátis no Mercado Play', accent: 'var(--red)', thumb: 'assets/serie-impuros.svg',
    desc: 'Drama criminal ambientado no Rio de Janeiro dos anos 1990. Duas temporadas aparecem gratuitamente no Mercado Play.',
    sourceUrl: 'https://play.mercadolivre.com.br/filtrar/series', sourceLabel: 'Mercado Play — assistir grátis',
    nostalgiaTags: ['brasil','anos 90','crime','drama','série grátis']
  },
  {
    id: 'serie-the-affair-mercado-play',
    type: 'filme', title: 'The Affair', year: '2014', genre: 'Drama',
    mediaType: 'serie', seriesId: 'the-affair-mercado-play', seriesTitle: 'The Affair', seasonCount: 5,
    language: 'Português / áudio conforme plataforma', portuguese: true, colorContent: true, freeLegal: true, catalogOnly: true,
    availabilityStatus: '5 temporadas — grátis no Mercado Play', accent: 'var(--purple)', thumb: 'assets/serie-the-affair.svg',
    desc: 'Drama que acompanha as consequências emocionais de um relacionamento extraconjugal por diferentes perspectivas.',
    sourceUrl: 'https://play.mercadolivre.com.br/assistir/the-affair/5e6ca7f47ee6424a8afb3588bc18d8dd', sourceLabel: 'Mercado Play — página oficial',
    nostalgiaTags: ['drama','série grátis']
  },
  {
    id: 'serie-the-good-wife-mercado-play',
    type: 'filme', title: 'The Good Wife', year: '2009', genre: 'Drama / Crime',
    mediaType: 'serie', seriesId: 'the-good-wife-mercado-play', seriesTitle: 'The Good Wife', seasonCount: 7,
    language: 'Português / áudio conforme plataforma', portuguese: true, colorContent: true, freeLegal: true, catalogOnly: true,
    availabilityStatus: '7 temporadas — grátis no Mercado Play', accent: 'var(--gold)', thumb: 'assets/serie-the-good-wife.svg',
    desc: 'Alicia Florrick retoma sua carreira jurídica após um escândalo público envolvendo o marido. As sete temporadas estão listadas gratuitamente.',
    sourceUrl: 'https://play.mercadolivre.com.br/assistir/the-good-wife/8499f456c92e4e02912099a316b9a908', sourceLabel: 'Mercado Play — página oficial',
    classicTv: true, nostalgiaTags: ['anos 2000','drama jurídico','TV','série grátis']
  },
  {
    id: 'serie-charmed-mercado-play',
    type: 'filme', title: 'Charmed — Jovens Bruxas', year: '1998', genre: 'Drama / Fantasia',
    mediaType: 'serie', seriesId: 'charmed-mercado-play', seriesTitle: 'Charmed — Jovens Bruxas', seasonCount: 8,
    language: 'Português / áudio conforme plataforma', portuguese: true, colorContent: true, freeLegal: true, catalogOnly: true,
    availabilityStatus: '8 temporadas — grátis no Mercado Play', accent: 'var(--purple)', thumb: 'assets/serie-charmed.svg',
    desc: 'As irmãs Halliwell descobrem que são bruxas e usam o Poder das Três para enfrentar ameaças sobrenaturais. O Mercado Play lista as oito temporadas.',
    sourceUrl: 'https://play.mercadolivre.com.br/assistir/charmed-jovens-bruxas-para-sempre-feiticeiras-8-22/02be3abcca7445a38edd10bccaedd45f', sourceLabel: 'Mercado Play — série grátis',
    classicTv: true, nostalgiaTags: ['anos 90','anos 2000','bruxas','fantasia','TV','série antiga','série grátis']
  },
  {
    id: 'serie-avatar-aang-mercado-play',
    type: 'filme', title: 'Avatar: A Lenda de Aang', year: '2005', genre: 'Animação / Aventura',
    mediaType: 'serie', seriesId: 'avatar-aang-mercado-play', seriesTitle: 'Avatar: A Lenda de Aang',
    language: 'Português / áudio conforme plataforma', portuguese: true, colorContent: true, freeLegal: true, catalogOnly: true,
    availabilityStatus: 'Disponível grátis no Mercado Play', accent: 'var(--gold)', thumb: 'assets/serie-avatar-aang.svg',
    desc: 'Aang, o último dobrador de ar, precisa dominar os quatro elementos e restaurar o equilíbrio do mundo. Disponibilidade gratuita verificada.',
    sourceUrl: 'https://play.mercadolivre.com.br/assistir/avatar-a-lenda-de-aang/4e5df720ddb74ef1b5f77ba3cc8c2c65', sourceLabel: 'Mercado Play — página oficial',
    classicTv: true, nostalgiaTags: ['anos 2000','desenho','animação','aventura','série grátis']
  },
  {
    id: 'serie-the-chosen-mercado-play',
    type: 'filme', title: 'The Chosen', year: '2019', genre: 'Drama / História',
    mediaType: 'serie', seriesId: 'the-chosen-mercado-play', seriesTitle: 'The Chosen', seasonCount: 3,
    language: 'Português / áudio conforme plataforma', portuguese: true, colorContent: true, freeLegal: true, catalogOnly: true,
    availabilityStatus: '3 temporadas — grátis no Mercado Play', accent: 'var(--green)', thumb: 'assets/serie-the-chosen.svg',
    desc: 'Drama histórico sobre a vida de Jesus e das pessoas ao seu redor. Três temporadas aparecem no catálogo gratuito do Mercado Play.',
    sourceUrl: 'https://play.mercadolivre.com.br/filtrar/series', sourceLabel: 'Mercado Play — assistir grátis',
    nostalgiaTags: ['drama','história','série grátis']
  },
  {
    id: 'serie-jesus-para-criancas-mercado-play',
    type: 'filme', title: 'Jesus para Crianças', year: '2022', genre: 'Infantil / Religião',
    mediaType: 'serie', seriesId: 'jesus-para-criancas-mercado-play', seriesTitle: 'Jesus para Crianças', seasonCount: 1,
    language: 'Português / áudio conforme plataforma', portuguese: true, colorContent: true, freeLegal: true, catalogOnly: true,
    availabilityStatus: '1 temporada — grátis no Mercado Play', accent: 'var(--green)', thumb: 'assets/serie-jesus-criancas.svg',
    desc: 'Série infantil listada no catálogo gratuito do Mercado Play.',
    sourceUrl: 'https://play.mercadolivre.com.br/filtrar/series', sourceLabel: 'Mercado Play — assistir grátis',
    nostalgiaTags: ['infantil','família','série grátis']
  },

  {
    id: 'serie-o-mundo-perdido-1999',
    type: 'filme',
    title: 'O Mundo Perdido',
    year: '1999',
    genre: 'Aventura / Ficção científica',
    mediaType: 'serie',
    seriesId: 'o-mundo-perdido-1999',
    seriesTitle: 'O Mundo Perdido',
    seasonCount: 3,
    episodeCount: 66,
    episodeDuration: '43–44 min',
    language: 'Português (dublagem brasileira existente)',
    portuguese: true,
    colorContent: true,
    classicTv: true,
    catalogOnly: true,
    availabilityStatus: 'Sem streaming disponível no Brasil no momento',
    accent: 'var(--green)',
    thumb: 'assets/serie-o-mundo-perdido.svg',
    desc: 'Série de aventura de 1999 baseada na obra de Arthur Conan Doyle. O catálogo registra as 3 temporadas e 66 episódios. No momento, a disponibilidade de streaming no Brasil não foi encontrada, então o JogaHub mostra a série e leva para a consulta de disponibilidade em vez de reproduzir uma cópia não oficial.',
    sourceUrl: 'https://br.justwatch.com/br/serie/o-mundo-perdido',
    sourceLabel: 'JustWatch Brasil — consultar disponibilidade',
    nostalgiaTags: ['TV anos 2000', 'Record', 'RedeTV', 'Band', 'dinossauros', 'aventura', 'série antiga', 'mundo perdido']
  },
  {
    id: 'serie-a-feiticeira-1964',
    type: 'filme',
    title: 'A Feiticeira',
    year: '1964',
    genre: 'Comédia / Fantasia',
    mediaType: 'serie',
    seriesId: 'a-feiticeira-1964',
    seriesTitle: 'A Feiticeira',
    seasonCount: 8,
    episodeCount: 254,
    episodeDuration: '25 min',
    language: 'Português / disponibilidade varia por serviço',
    portuguese: true,
    colorContent: true,
    classicTv: true,
    catalogOnly: true,
    availabilityStatus: 'Disponível em serviços legais; reprodução externa',
    accent: 'var(--purple)',
    thumb: 'assets/serie-a-feiticeira.svg',
    desc: 'Clássico de 1964 estrelado por Samantha, uma feiticeira que tenta levar uma vida comum ao lado do marido mortal. O JogaHub cataloga as 8 temporadas e abre a página oficial de disponibilidade, sem reupar episódios.',
    sourceUrl: 'https://tv.apple.com/br/show/a-feiticeira/umc.cmc.5jytt2kp9lxsgb51hmazr5mn5',
    sourceLabel: 'Apple TV — página oficial',
    nostalgiaTags: ['TV clássica', 'anos 60', 'comédia', 'fantasia', 'feiticeira', 'série antiga']
  },


  {
    id: 'serie-alf-o-eteimoso', type: 'filme', title: 'ALF, o ETeimoso', year: '1986', genre: 'Comédia / Ficção científica',
    mediaType: 'serie', seriesId: 'alf-o-eteimoso', seriesTitle: 'ALF, o ETeimoso', seasonCount: 4,
    language: 'Idioma/áudio conforme disponibilidade do Plex', portuguese: true, colorContent: true, catalogOnly: true, freeLegal: true,
    availabilityStatus: 'Assistir grátis — Plex', accent: 'var(--gold)', thumb: 'assets/serie-alf.svg',
    desc: 'A clássica sitcom do alienígena Gordon Shumway (ALF) e a família Tanner. O Plex oferece a série gratuitamente e lista as temporadas e episódios disponíveis.',
    sourceUrl: 'https://watch.plex.tv/pt-BR/show/alf', sourceLabel: 'Plex — assistir grátis',
    classicTv: true, nostalgiaTags: ['ALF','o teimoso','anos 80','TV clássica','comédia','alienígena','dublado']
  },
  {
    id: 'wwe-vault-watch-party', type: 'filme', title: 'WWE Vault — Clássicos 24/7', year: 'Oficial', genre: 'Luta livre / Wrestling',
    mediaType: 'colecao', language: 'Áudio original', portuguese: false, colorContent: true, freeLegal: true,
    accent: 'var(--red)', thumb: 'https://i.ytimg.com/vi/_Ji8vj_Jm9w/hqdefault.jpg',
    desc: 'Watch party oficial do WWE Vault com lutas clássicas completas, lançamentos antigos, raridades e material de arquivo.',
    youtubeId: '_Ji8vj_Jm9w', sourceUrl: 'https://www.youtube.com/watch?v=_Ji8vj_Jm9w', sourceLabel: 'WWE Vault — canal oficial verificado',
    classicTv: true, wrestling: true, nostalgiaTags: ['WWE','wrestling','luta livre','clássicos','anos 80','anos 90','Raw','SmackDown','WrestleMania']
  },
  {
    id: 'wwe-raw-full-matches-marathon', type: 'filme', title: 'WWE Raw — Maratona de Lutas Clássicas', year: 'Oficial', genre: 'Luta livre / Wrestling',
    mediaType: 'colecao', language: 'Áudio original', portuguese: false, colorContent: true, freeLegal: true,
    accent: 'var(--red)', thumb: 'https://i.ytimg.com/vi/oHffZH06xgA/hqdefault.jpg',
    desc: 'Maratona oficial com algumas das melhores lutas completas da história do Monday Night Raw.',
    youtubeId: 'oHffZH06xgA', sourceUrl: 'https://www.youtube.com/watch?v=oHffZH06xgA', sourceLabel: 'WWE — canal oficial verificado',
    classicTv: true, wrestling: true, nostalgiaTags: ['WWE','Raw','luta livre','wrestling','lutas completas','TV antiga']
  },
  {
    id: 'wwe-vault-canal', type: 'filme', title: 'WWE Vault — Arquivo Oficial', year: 'Catálogo atual', genre: 'Luta livre / Wrestling',
    mediaType: 'colecao', language: 'Áudio varia por vídeo', colorContent: true, freeLegal: true, catalogOnly: true,
    availabilityStatus: 'Lutas clássicas completas e eventos no YouTube oficial', accent: 'var(--red)', thumb: 'assets/wwe-vault.svg',
    desc: 'Canal oficial da WWE dedicado a lutas clássicas, eventos completos, raridades e material histórico.',
    sourceUrl: 'https://www.youtube.com/@WWEvault', sourceLabel: 'WWE Vault — YouTube oficial', wrestling: true, classicTv: true,
    nostalgiaTags: ['WWE Vault','wrestling','luta livre','eventos completos','WrestleMania','WCW']
  },
  {
    id: 'bwf-telecatch-oficial', type: 'filme', title: 'BWF Telecatch — Luta Livre Brasileira', year: 'Oficial', genre: 'Luta livre / Telecatch',
    mediaType: 'serie', seriesId: 'bwf-telecatch', seriesTitle: 'BWF Telecatch', language: 'Português (Brasil)', portuguese: true,
    colorContent: true, freeLegal: true, catalogOnly: true, availabilityStatus: 'Episódios e lutas no site oficial BWF', accent: 'var(--gold)', thumb: 'assets/bwf-telecatch.svg',
    desc: 'Telecatch brasileiro da Brazilian Wrestling Federation. O site oficial publica episódios com player e cards das lutas.',
    sourceUrl: 'https://bwf.com.br/category/bwf-telecatch/', sourceLabel: 'BWF — site oficial', wrestling: true, classicTv: true,
    nostalgiaTags: ['telecatch','luta livre brasileira','BWF','wrestling','Brasil']
  },
  {
    id: 'anime-crunchyroll-catalogo', type: 'filme', title: 'Crunchyroll — Animes Dublados', year: 'Catálogo atual', genre: 'Anime',
    mediaType: 'colecao', language: 'Português (dublagem disponível em muitos títulos)', portuguese: true, colorContent: true, catalogOnly: true,
    availabilityStatus: 'Catálogo oficial — disponibilidade varia por título/plano', accent: 'var(--gold)', thumb: 'assets/anime-crunchyroll.svg',
    desc: 'Atalho para o catálogo oficial da Crunchyroll. Muitos títulos oferecem áudio dublado em português e temporadas completas.',
    sourceUrl: 'https://www.crunchyroll.com/pt-br/videos/anime', sourceLabel: 'Crunchyroll — catálogo oficial', anime: true,
    nostalgiaTags: ['anime','dublado','Crunchyroll','Dragon Ball','One Piece','My Hero Academia','Demon Slayer']
  },
  {
    id: 'anime-pluto-tv', type: 'filme', title: 'Pluto TV — Anime Grátis', year: 'Catálogo atual', genre: 'Anime',
    mediaType: 'colecao', language: 'Português / áudio varia por canal e título', portuguese: true, colorContent: true, freeLegal: true, catalogOnly: true,
    availabilityStatus: 'Anime grátis e legal — catálogo rotativo', accent: 'var(--purple)', thumb: 'assets/anime-pluto.svg',
    desc: 'A Pluto TV oferece canais e conteúdo sob demanda de anime gratuitamente e de forma legal. O catálogo muda com frequência.',
    sourceUrl: 'https://pluto.tv/br/', sourceLabel: 'Pluto TV — oficial', anime: true,
    nostalgiaTags: ['anime','grátis','Pluto TV','TV ao vivo','dublado']
  },

  {
    id: 'anime-dragon-ball-z', type: 'filme', title: 'Dragon Ball Z', year: '1989', genre: 'Ação / Anime', mediaType: 'serie',
    seriesId: 'anime-dragon-ball-z', seriesTitle: 'Dragon Ball Z', language: 'Dublagem PT-BR disponível no catálogo', portuguese: true, colorContent: true, catalogOnly: true,
    availabilityStatus: 'Dub / Leg — Crunchyroll', accent: 'var(--gold)', thumb: 'assets/anime-generic.svg',
    desc: 'Anime listado no catálogo oficial da Crunchyroll com opção de dublagem indicada pela plataforma.',
    sourceUrl: 'https://www.crunchyroll.com/pt-br/videos/anime', sourceLabel: 'Crunchyroll — oficial', anime: true,
    nostalgiaTags: ['anime','dublado','português','Crunchyroll','Dragon Ball Z']
  },

  {
    id: 'anime-one-piece', type: 'filme', title: 'One Piece', year: '1999', genre: 'Aventura / Anime', mediaType: 'serie',
    seriesId: 'anime-one-piece', seriesTitle: 'One Piece', language: 'Dublagem PT-BR disponível no catálogo', portuguese: true, colorContent: true, catalogOnly: true,
    availabilityStatus: 'Dub / Leg — Crunchyroll', accent: 'var(--gold)', thumb: 'assets/anime-generic.svg',
    desc: 'Anime listado no catálogo oficial da Crunchyroll com opção de dublagem indicada pela plataforma.',
    sourceUrl: 'https://www.crunchyroll.com/pt-br/videos/anime', sourceLabel: 'Crunchyroll — oficial', anime: true,
    nostalgiaTags: ['anime','dublado','português','Crunchyroll','One Piece']
  },

  {
    id: 'anime-my-hero-academia', type: 'filme', title: 'My Hero Academia', year: '2016', genre: 'Ação / Anime', mediaType: 'serie',
    seriesId: 'anime-my-hero-academia', seriesTitle: 'My Hero Academia', language: 'Dublagem PT-BR disponível no catálogo', portuguese: true, colorContent: true, catalogOnly: true,
    availabilityStatus: 'Dub / Leg — Crunchyroll', accent: 'var(--gold)', thumb: 'assets/anime-generic.svg',
    desc: 'Anime listado no catálogo oficial da Crunchyroll com opção de dublagem indicada pela plataforma.',
    sourceUrl: 'https://www.crunchyroll.com/pt-br/videos/anime', sourceLabel: 'Crunchyroll — oficial', anime: true,
    nostalgiaTags: ['anime','dublado','português','Crunchyroll','My Hero Academia']
  },

  {
    id: 'anime-attack-on-titan', type: 'filme', title: 'Attack on Titan', year: '2013', genre: 'Ação / Anime', mediaType: 'serie',
    seriesId: 'anime-attack-on-titan', seriesTitle: 'Attack on Titan', language: 'Dublagem PT-BR disponível no catálogo', portuguese: true, colorContent: true, catalogOnly: true,
    availabilityStatus: 'Dub / Leg — Crunchyroll', accent: 'var(--gold)', thumb: 'assets/anime-generic.svg',
    desc: 'Anime listado no catálogo oficial da Crunchyroll com opção de dublagem indicada pela plataforma.',
    sourceUrl: 'https://www.crunchyroll.com/pt-br/videos/anime', sourceLabel: 'Crunchyroll — oficial', anime: true,
    nostalgiaTags: ['anime','dublado','português','Crunchyroll','Attack on Titan']
  },

  {
    id: 'anime-jujutsu-kaisen', type: 'filme', title: 'JUJUTSU KAISEN', year: '2020', genre: 'Ação / Anime', mediaType: 'serie',
    seriesId: 'anime-jujutsu-kaisen', seriesTitle: 'JUJUTSU KAISEN', language: 'Dublagem PT-BR disponível no catálogo', portuguese: true, colorContent: true, catalogOnly: true,
    availabilityStatus: 'Dub / Leg — Crunchyroll', accent: 'var(--gold)', thumb: 'assets/anime-generic.svg',
    desc: 'Anime listado no catálogo oficial da Crunchyroll com opção de dublagem indicada pela plataforma.',
    sourceUrl: 'https://www.crunchyroll.com/pt-br/videos/anime', sourceLabel: 'Crunchyroll — oficial', anime: true,
    nostalgiaTags: ['anime','dublado','português','Crunchyroll','JUJUTSU KAISEN']
  },

  {
    id: 'anime-demon-slayer', type: 'filme', title: 'Demon Slayer: Kimetsu no Yaiba', year: '2019', genre: 'Ação / Anime', mediaType: 'serie',
    seriesId: 'anime-demon-slayer', seriesTitle: 'Demon Slayer: Kimetsu no Yaiba', language: 'Dublagem PT-BR disponível no catálogo', portuguese: true, colorContent: true, catalogOnly: true,
    availabilityStatus: 'Dub / Leg — Crunchyroll', accent: 'var(--gold)', thumb: 'assets/anime-generic.svg',
    desc: 'Anime listado no catálogo oficial da Crunchyroll com opção de dublagem indicada pela plataforma.',
    sourceUrl: 'https://www.crunchyroll.com/pt-br/videos/anime', sourceLabel: 'Crunchyroll — oficial', anime: true,
    nostalgiaTags: ['anime','dublado','português','Crunchyroll','Demon Slayer: Kimetsu no Yaiba']
  },

  {
    id: 'anime-black-clover', type: 'filme', title: 'Black Clover', year: '2017', genre: 'Fantasia / Anime', mediaType: 'serie',
    seriesId: 'anime-black-clover', seriesTitle: 'Black Clover', language: 'Dublagem PT-BR disponível no catálogo', portuguese: true, colorContent: true, catalogOnly: true,
    availabilityStatus: 'Dub / Leg — Crunchyroll', accent: 'var(--gold)', thumb: 'assets/anime-generic.svg',
    desc: 'Anime listado no catálogo oficial da Crunchyroll com opção de dublagem indicada pela plataforma.',
    sourceUrl: 'https://www.crunchyroll.com/pt-br/videos/anime', sourceLabel: 'Crunchyroll — oficial', anime: true,
    nostalgiaTags: ['anime','dublado','português','Crunchyroll','Black Clover']
  },

  {
    id: 'anime-dr-stone', type: 'filme', title: 'Dr. STONE', year: '2019', genre: 'Aventura / Anime', mediaType: 'serie',
    seriesId: 'anime-dr-stone', seriesTitle: 'Dr. STONE', language: 'Dublagem PT-BR disponível no catálogo', portuguese: true, colorContent: true, catalogOnly: true,
    availabilityStatus: 'Dub / Leg — Crunchyroll', accent: 'var(--gold)', thumb: 'assets/anime-generic.svg',
    desc: 'Anime listado no catálogo oficial da Crunchyroll com opção de dublagem indicada pela plataforma.',
    sourceUrl: 'https://www.crunchyroll.com/pt-br/videos/anime', sourceLabel: 'Crunchyroll — oficial', anime: true,
    nostalgiaTags: ['anime','dublado','português','Crunchyroll','Dr. STONE']
  },

  {
    id: 'anime-haikyu', type: 'filme', title: 'HAIKYU!!', year: '2014', genre: 'Esportes / Anime', mediaType: 'serie',
    seriesId: 'anime-haikyu', seriesTitle: 'HAIKYU!!', language: 'Dublagem PT-BR disponível no catálogo', portuguese: true, colorContent: true, catalogOnly: true,
    availabilityStatus: 'Dub / Leg — Crunchyroll', accent: 'var(--gold)', thumb: 'assets/anime-generic.svg',
    desc: 'Anime listado no catálogo oficial da Crunchyroll com opção de dublagem indicada pela plataforma.',
    sourceUrl: 'https://www.crunchyroll.com/pt-br/videos/anime', sourceLabel: 'Crunchyroll — oficial', anime: true,
    nostalgiaTags: ['anime','dublado','português','Crunchyroll','HAIKYU!!']
  },

  {
    id: 'anime-solo-leveling', type: 'filme', title: 'Solo Leveling', year: '2024', genre: 'Ação / Anime', mediaType: 'serie',
    seriesId: 'anime-solo-leveling', seriesTitle: 'Solo Leveling', language: 'Dublagem PT-BR disponível no catálogo', portuguese: true, colorContent: true, catalogOnly: true,
    availabilityStatus: 'Dub / Leg — Crunchyroll', accent: 'var(--gold)', thumb: 'assets/anime-generic.svg',
    desc: 'Anime listado no catálogo oficial da Crunchyroll com opção de dublagem indicada pela plataforma.',
    sourceUrl: 'https://www.crunchyroll.com/pt-br/videos/anime', sourceLabel: 'Crunchyroll — oficial', anime: true,
    nostalgiaTags: ['anime','dublado','português','Crunchyroll','Solo Leveling']
  },

  {
    id: 'anime-frieren', type: 'filme', title: 'Frieren e a Jornada para o Além', year: '2023', genre: 'Fantasia / Anime', mediaType: 'serie',
    seriesId: 'anime-frieren', seriesTitle: 'Frieren e a Jornada para o Além', language: 'Dublagem PT-BR disponível no catálogo', portuguese: true, colorContent: true, catalogOnly: true,
    availabilityStatus: 'Dub / Leg — Crunchyroll', accent: 'var(--gold)', thumb: 'assets/anime-generic.svg',
    desc: 'Anime listado no catálogo oficial da Crunchyroll com opção de dublagem indicada pela plataforma.',
    sourceUrl: 'https://www.crunchyroll.com/pt-br/videos/anime', sourceLabel: 'Crunchyroll — oficial', anime: true,
    nostalgiaTags: ['anime','dublado','português','Crunchyroll','Frieren e a Jornada para o Além']
  },

  {
    id: 'anime-diarios-apotecaria', type: 'filme', title: 'Diários de uma Apotecária', year: '2023', genre: 'Drama / Anime', mediaType: 'serie',
    seriesId: 'anime-diarios-apotecaria', seriesTitle: 'Diários de uma Apotecária', language: 'Dublagem PT-BR disponível no catálogo', portuguese: true, colorContent: true, catalogOnly: true,
    availabilityStatus: 'Dub / Leg — Crunchyroll', accent: 'var(--gold)', thumb: 'assets/anime-generic.svg',
    desc: 'Anime listado no catálogo oficial da Crunchyroll com opção de dublagem indicada pela plataforma.',
    sourceUrl: 'https://www.crunchyroll.com/pt-br/videos/anime', sourceLabel: 'Crunchyroll — oficial', anime: true,
    nostalgiaTags: ['anime','dublado','português','Crunchyroll','Diários de uma Apotecária']
  },

  {
    id: 'anime-fire-force', type: 'filme', title: 'Fire Force', year: '2019', genre: 'Ação / Anime', mediaType: 'serie',
    seriesId: 'anime-fire-force', seriesTitle: 'Fire Force', language: 'Dublagem PT-BR disponível no catálogo', portuguese: true, colorContent: true, catalogOnly: true,
    availabilityStatus: 'Dub / Leg — Crunchyroll', accent: 'var(--gold)', thumb: 'assets/anime-generic.svg',
    desc: 'Anime listado no catálogo oficial da Crunchyroll com opção de dublagem indicada pela plataforma.',
    sourceUrl: 'https://www.crunchyroll.com/pt-br/videos/anime', sourceLabel: 'Crunchyroll — oficial', anime: true,
    nostalgiaTags: ['anime','dublado','português','Crunchyroll','Fire Force']
  },

  {
    id: 'anime-blue-lock', type: 'filme', title: 'BLUE LOCK', year: '2022', genre: 'Esportes / Anime', mediaType: 'serie',
    seriesId: 'anime-blue-lock', seriesTitle: 'BLUE LOCK', language: 'Dublagem PT-BR disponível no catálogo', portuguese: true, colorContent: true, catalogOnly: true,
    availabilityStatus: 'Dub / Leg — Crunchyroll', accent: 'var(--gold)', thumb: 'assets/anime-generic.svg',
    desc: 'Anime listado no catálogo oficial da Crunchyroll com opção de dublagem indicada pela plataforma.',
    sourceUrl: 'https://www.crunchyroll.com/pt-br/videos/anime', sourceLabel: 'Crunchyroll — oficial', anime: true,
    nostalgiaTags: ['anime','dublado','português','Crunchyroll','BLUE LOCK']
  },

  {
    id: 'anime-re-zero', type: 'filme', title: 'Re:ZERO -Starting Life in Another World-', year: '2016', genre: 'Fantasia / Anime', mediaType: 'serie',
    seriesId: 'anime-re-zero', seriesTitle: 'Re:ZERO -Starting Life in Another World-', language: 'Dublagem PT-BR disponível no catálogo', portuguese: true, colorContent: true, catalogOnly: true,
    availabilityStatus: 'Dub / Leg — Crunchyroll', accent: 'var(--gold)', thumb: 'assets/anime-generic.svg',
    desc: 'Anime listado no catálogo oficial da Crunchyroll com opção de dublagem indicada pela plataforma.',
    sourceUrl: 'https://www.crunchyroll.com/pt-br/videos/anime', sourceLabel: 'Crunchyroll — oficial', anime: true,
    nostalgiaTags: ['anime','dublado','português','Crunchyroll','Re:ZERO -Starting Life in Another World-']
  },
  {
    id: 'mr-bumpy-ptbr-remaster-4k',
    type: 'filme',
    title: 'Mr. Bumpy — Episódio Dublado e Remasterizado',
    year: '1995 / remaster 2024',
    genre: 'Desenho',
    mediaType: 'serie',
    seriesId: 'mr-bumpy-ptbr',
    seriesTitle: 'Mr. Bumpy',
    season: 1,
    episode: 1,
    language: 'Português (dublado)',
    portuguese: true,
    colorContent: true,
    accent: 'var(--green)',
    thumb: 'https://i.ytimg.com/vi/-8WQKZLFRaQ/hqdefault.jpg',
    desc: 'Episódio preservado com dublagem brasileira da Álamo, disponibilizado em versão remasterizada. A coleção dublada de Mr. Bumpy disponível online é incompleta.',
    youtubeId: '-8WQKZLFRaQ',
    sourceUrl: 'https://www.youtube.com/watch?v=-8WQKZLFRaQ',
    sourceLabel: 'YouTube — preservação de TV',
    classicTv: true,
    nostalgiaTags: ['TV anos 90', 'desenho clássico', 'dublado']
  },
  {
    id: 'mr-bumpy-ptbr-agua-por-favor',
    type: 'filme',
    title: 'Mr. Bumpy — Água, por favor',
    year: '1995',
    genre: 'Desenho',
    mediaType: 'serie',
    seriesId: 'mr-bumpy-ptbr',
    seriesTitle: 'Mr. Bumpy',
    season: 1,
    episode: 2,
    language: 'Português (dublado)',
    portuguese: true,
    colorContent: true,
    accent: 'var(--green)',
    thumb: 'https://i.ytimg.com/vi/zyYoGdNiE00/hqdefault.jpg',
    desc: 'Episódio conhecido como “Água, por favor”, com dublagem brasileira e áudio preservado. Disponibilidade sujeita ao próprio YouTube.',
    youtubeId: 'zyYoGdNiE00',
    sourceUrl: 'https://www.youtube.com/watch?v=zyYoGdNiE00',
    sourceLabel: 'YouTube — arquivo dublado',
    classicTv: true,
    nostalgiaTags: ['TV anos 90', 'desenho clássico', 'dublado']
  },
  {
    id: 'mr-bumpy-ptbr-arquivo-2009',
    type: 'filme',
    title: 'Mr. Bumpy — Episódio Dublado (arquivo raro)',
    year: '1990s / upload 2009',
    genre: 'Desenho',
    mediaType: 'serie',
    seriesId: 'mr-bumpy-ptbr',
    seriesTitle: 'Mr. Bumpy',
    season: 1,
    episode: 3,
    language: 'Português (dublado)',
    portuguese: true,
    colorContent: true,
    accent: 'var(--green)',
    thumb: 'https://i.ytimg.com/vi/1Ug6tdbzkmI/hqdefault.jpg',
    desc: 'Upload antigo preservando a dublagem brasileira de Mr. Bumpy. Mantido como item separado porque a disponibilidade de episódios dublados é rara e incompleta.',
    youtubeId: '1Ug6tdbzkmI',
    sourceUrl: 'https://www.youtube.com/watch?v=1Ug6tdbzkmI',
    sourceLabel: 'YouTube — arquivo dublado',
    classicTv: true,
    nostalgiaTags: ['TV anos 90', 'desenho clássico', 'dublado']
  },
  {
    id: 'colecao-netmovies-classicos-dublados',
    type: 'filme',
    title: 'Clássicos Dublados — NetMovies',
    year: 'Oficial',
    genre: 'Clássicos',
    mediaType: 'colecao',
    language: 'Português (dublado)',
    portuguese: true,
    colorContent: true,
    accent: 'var(--red)',
    thumb: 'assets/netmovies-classicos.svg',
    desc: 'Coleção oficial do canal verificado NetMovies Clássicos. O canal informa que seus filmes são completos, licenciados e dublados, incluindo vários clássicos coloridos em português.',
    youtubePlaylistId: 'UUklg72s4SymWVrriqiUgXhw',
    sourceUrl: 'https://www.youtube.com/@NetMoviesClassicos',
    sourceLabel: 'NetMovies Clássicos — canal oficial',
    classicTv: true,
    nostalgiaTags: ['clássicos da TV', 'sessão da tarde', 'cinema em casa', 'dublado']
  },
  {
    id: 'pica-pau-com-dois-pica-paus',
    type: 'filme', title: 'Pica-Pau — Com Dois Pica-Paus', year: 'Oficial', genre: 'Desenho', mediaType: 'serie',
    seriesId: 'pica-pau-oficial', seriesTitle: 'Pica-Pau', season: 1, episode: 1,
    language: 'Português', portuguese: true, colorContent: true, youtubePt: true, freeLegal: true,
    accent: 'var(--gold)', thumb: 'https://i.ytimg.com/vi/NVY1s7czIK4/hqdefault.jpg',
    desc: 'Episódio completo em português publicado pelo canal verificado Pica-Pau em Português.',
    youtubeId: 'NVY1s7czIK4', sourceUrl: 'https://www.youtube.com/watch?v=NVY1s7czIK4', sourceLabel: 'Pica-Pau em Português — oficial',
    classicTv: true, nostalgiaTags: ['desenho clássico','Pica-Pau','episódio completo','família']
  },
  {
    id: 'pica-pau-tv-a-cabo',
    type: 'filme', title: 'Pica-Pau — TV a Cabo', year: 'Oficial', genre: 'Desenho', mediaType: 'serie',
    seriesId: 'pica-pau-oficial', seriesTitle: 'Pica-Pau', season: 1, episode: 2,
    language: 'Português', portuguese: true, colorContent: true, youtubePt: true, freeLegal: true,
    accent: 'var(--gold)', thumb: 'https://i.ytimg.com/vi/tTht-QGnvC8/hqdefault.jpg',
    desc: 'Episódio completo em português publicado pelo canal verificado Pica-Pau em Português.',
    youtubeId: 'tTht-QGnvC8', sourceUrl: 'https://www.youtube.com/watch?v=tTht-QGnvC8', sourceLabel: 'Pica-Pau em Português — oficial',
    classicTv: true, nostalgiaTags: ['desenho clássico','Pica-Pau','episódio completo','família']
  },
  {
    id: 'pica-pau-a-granja',
    type: 'filme', title: 'Pica-Pau — A Granja do Pica-Pau', year: 'Oficial', genre: 'Desenho', mediaType: 'serie',
    seriesId: 'pica-pau-oficial', seriesTitle: 'Pica-Pau', season: 1, episode: 3,
    language: 'Português', portuguese: true, colorContent: true, youtubePt: true, freeLegal: true,
    accent: 'var(--gold)', thumb: 'https://i.ytimg.com/vi/Ar1sRRY-moQ/hqdefault.jpg',
    desc: 'Episódio completo em português publicado pelo canal verificado Pica-Pau em Português.',
    youtubeId: 'Ar1sRRY-moQ', sourceUrl: 'https://www.youtube.com/watch?v=Ar1sRRY-moQ', sourceLabel: 'Pica-Pau em Português — oficial',
    classicTv: true, nostalgiaTags: ['desenho clássico','Pica-Pau','episódio completo','família']
  },
  {
    id: 'pica-pau-um-encontro-gelado',
    type: 'filme', title: 'Pica-Pau — Um Encontro Gelado', year: 'Oficial', genre: 'Desenho', mediaType: 'serie',
    seriesId: 'pica-pau-oficial', seriesTitle: 'Pica-Pau', season: 1, episode: 4,
    language: 'Português', portuguese: true, colorContent: true, youtubePt: true, freeLegal: true,
    accent: 'var(--gold)', thumb: 'https://i.ytimg.com/vi/x0makBZvuXs/hqdefault.jpg',
    desc: 'Episódio completo em português publicado pelo canal verificado Pica-Pau em Português.',
    youtubeId: 'x0makBZvuXs', sourceUrl: 'https://www.youtube.com/watch?v=x0makBZvuXs', sourceLabel: 'Pica-Pau em Português — oficial',
    classicTv: true, nostalgiaTags: ['desenho clássico','Pica-Pau','episódio completo','família']
  },
  {
    id: 'filme-era-uma-vez-no-oeste-1968',
    type: 'filme',
    title: 'Era uma Vez no Oeste',
    year: '1968',
    genre: 'Faroeste',
    mediaType: 'filme',
    language: 'Português (dublado)',
    portuguese: true,
    colorContent: true,
    classicTv: true,
    nostalgiaTags: ['clássicos da TV', 'faroeste', 'filme antigo', 'dublado'],
    accent: 'var(--gold)',
    thumb: 'https://i.ytimg.com/vi/RUyP_4OJ59o/hqdefault.jpg',
    desc: 'Faroeste clássico de Sergio Leone, disponível completo no canal oficial e verificado NetMovies Clássicos.',
    youtubeId: 'RUyP_4OJ59o',
    sourceUrl: 'https://www.youtube.com/watch?v=RUyP_4OJ59o',
    sourceLabel: 'NetMovies Clássicos — oficial/licenciado'
  },
  {
    id: 'filme-nosferatu-1922',
    type: 'filme',
    title: 'Nosferatu',
    year: '1922',
    genre: 'Terror',
    mediaType: 'filme',
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
    mediaType: 'filme',
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
    mediaType: 'filme',
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
    mediaType: 'filme',
    accent: 'var(--gold)',
    thumb: 'https://archive.org/services/img/The_General_Buster_Keaton',
    desc: 'Aventura e comédia muda de Buster Keaton em uma perseguição ferroviária durante a Guerra Civil Americana.',
    archiveId: 'The_General_Buster_Keaton',
    sourceUrl: 'https://archive.org/details/The_General_Buster_Keaton'
  }
  ,{
    id: 'anime-baki-the-grappler-2001', type: 'filme', title: 'Baki the Grappler', year: '2001', genre: 'Ação / Artes Marciais / Anime', mediaType: 'serie',
    seriesId: 'baki-the-grappler-2001', seriesTitle: 'Baki the Grappler', language: 'Disponibilidade PT-BR não confirmada', portuguese: false, colorContent: true, catalogOnly: true,
    availabilityStatus: 'Indisponível em streaming no Brasil', accent: 'var(--red)', thumb: 'assets/anime-generic.svg', anime: true,
    desc: 'Anime clássico de artes marciais. O catálogo brasileiro consultado lista 3 temporadas, mas atualmente não há oferta oficial de streaming no Brasil.',
    sourceUrl: 'https://br.justwatch.com/br/serie/baki-the-grappler', sourceLabel: 'JustWatch Brasil',
    nostalgiaTags: ['anime clássico','artes marciais','Baki','Grappler Baki','2001']
  },
  {
    id: 'colecao-filmes-acao-gratis', type: 'filme', title: 'Filmes de Ação — Grátis', year: 'Catálogo atual', genre: 'Ação', mediaType: 'colecao',
    language: 'Português conforme título', portuguese: true, colorContent: true, catalogOnly: true, freeLegal: true,
    availabilityStatus: 'Grátis — Mercado Play', accent: 'var(--red)', thumb: 'assets/series-mercado-play.svg',
    desc: 'Atalho para filmes de ação disponíveis legalmente no Mercado Play. O catálogo muda com frequência.',
    sourceUrl: 'https://play.mercadolivre.com.br/filtrar/filmes/acao', sourceLabel: 'Mercado Play — oficial', filmGenre: 'acao',
    nostalgiaTags: ['ação','filmes grátis','Mercado Play']
  },
  {
    id: 'colecao-filmes-comedia-gratis', type: 'filme', title: 'Filmes de Comédia — Grátis', year: 'Catálogo atual', genre: 'Comédia', mediaType: 'colecao',
    language: 'Português conforme título', portuguese: true, colorContent: true, catalogOnly: true, freeLegal: true,
    availabilityStatus: 'Grátis — Mercado Play', accent: 'var(--gold)', thumb: 'assets/series-mercado-play.svg',
    desc: 'Seleção de comédias gratuitas e legais no Mercado Play.',
    sourceUrl: 'https://play.mercadolivre.com.br/filtrar/filmes', sourceLabel: 'Mercado Play — oficial', filmGenre: 'comedia',
    nostalgiaTags: ['comédia','filmes grátis','Mercado Play']
  },
  {
    id: 'colecao-filmes-romance-gratis', type: 'filme', title: 'Filmes de Romance — Grátis', year: 'Catálogo atual', genre: 'Romance', mediaType: 'colecao',
    language: 'Português conforme título', portuguese: true, colorContent: true, catalogOnly: true, freeLegal: true,
    availabilityStatus: 'Grátis — Mercado Play', accent: 'var(--pink)', thumb: 'assets/series-mercado-play.svg',
    desc: 'Seleção de romances gratuitos e legais no Mercado Play.',
    sourceUrl: 'https://play.mercadolivre.com.br/filtrar/filmes', sourceLabel: 'Mercado Play — oficial', filmGenre: 'romance',
    nostalgiaTags: ['romance','filmes grátis','Mercado Play']
  },
  {
    id: 'colecao-filmes-terror-gratis', type: 'filme', title: 'Filmes de Terror — Grátis', year: 'Catálogo atual', genre: 'Terror', mediaType: 'colecao',
    language: 'Português conforme título', portuguese: true, colorContent: true, catalogOnly: true, freeLegal: true,
    availabilityStatus: 'Grátis — Mercado Play', accent: 'var(--purple)', thumb: 'assets/series-mercado-play.svg',
    desc: 'Atalho para terror e suspense disponíveis legalmente no catálogo gratuito do Mercado Play.',
    sourceUrl: 'https://play.mercadolivre.com.br/filtrar/filmes', sourceLabel: 'Mercado Play — oficial', filmGenre: 'terror',
    nostalgiaTags: ['terror','horror','suspense','filmes grátis','Mercado Play']
  },
  {
    id: 'colecao-filmes-ficcao-gratis', type: 'filme', title: 'Ficção Científica — Grátis', year: 'Catálogo atual', genre: 'Ficção científica', mediaType: 'colecao',
    language: 'Português conforme título', portuguese: true, colorContent: true, catalogOnly: true, freeLegal: true,
    availabilityStatus: 'Grátis — Mercado Play', accent: 'var(--blue)', thumb: 'assets/series-mercado-play.svg',
    desc: 'Atalho para ficção científica disponível legalmente no Mercado Play.',
    sourceUrl: 'https://play.mercadolivre.com.br/filtrar/filmes', sourceLabel: 'Mercado Play — oficial', filmGenre: 'ficcao',
    nostalgiaTags: ['ficção científica','sci-fi','filmes grátis','Mercado Play']
  },
  {
    id: 'mercado-duro-de-matar-4', type: 'filme', title: 'Duro de Matar 4.0', year: '2007', genre: 'Ação', mediaType: 'filme',
    portuguese: true, colorContent: true, catalogOnly: true, freeLegal: true, availabilityStatus: 'Assistir grátis — Mercado Play', accent: 'var(--red)', thumb: 'assets/series-mercado-play.svg',
    desc: 'Ação com John McClane. Disponível gratuitamente no catálogo atual do Mercado Play.', sourceUrl: 'https://play.mercadolivre.com.br/filtrar/gratuito', sourceLabel: 'Mercado Play — oficial', filmGenre: 'acao'
  },
  {
    id: 'mercado-homem-aranha-homecoming', type: 'filme', title: 'Homem-Aranha: De Volta ao Lar', year: '2017', genre: 'Ação / Aventura', mediaType: 'filme',
    portuguese: true, colorContent: true, catalogOnly: true, freeLegal: true, availabilityStatus: 'Assistir grátis — Mercado Play', accent: 'var(--red)', thumb: 'assets/series-mercado-play.svg',
    desc: 'Aventura do Homem-Aranha disponível gratuitamente no catálogo atual do Mercado Play.', sourceUrl: 'https://play.mercadolivre.com.br/filtrar/filmes', sourceLabel: 'Mercado Play — oficial', filmGenre: 'acao'
  },
  {
    id: 'mercado-todo-mundo-em-panico', type: 'filme', title: 'Todo Mundo em Pânico', year: '2000', genre: 'Comédia / Terror', mediaType: 'filme',
    portuguese: true, colorContent: true, catalogOnly: true, freeLegal: true, availabilityStatus: 'Assistir grátis — Mercado Play', accent: 'var(--gold)', thumb: 'assets/series-mercado-play.svg',
    desc: 'Comédia que parodia filmes de terror, disponível gratuitamente no Mercado Play.', sourceUrl: 'https://play.mercadolivre.com.br/filtrar/filmes', sourceLabel: 'Mercado Play — oficial', filmGenre: 'comedia'
  },
  {
    id: 'mercado-era-do-gelo', type: 'filme', title: 'A Era do Gelo', year: '2002', genre: 'Comédia / Família', mediaType: 'filme',
    portuguese: true, colorContent: true, catalogOnly: true, freeLegal: true, availabilityStatus: 'Assistir grátis — Mercado Play', accent: 'var(--blue)', thumb: 'assets/series-mercado-play.svg',
    desc: 'Animação e comédia familiar disponível gratuitamente no Mercado Play.', sourceUrl: 'https://play.mercadolivre.com.br/filtrar/gratuito', sourceLabel: 'Mercado Play — oficial', filmGenre: 'comedia'
  },
  {
    id: 'mercado-rio', type: 'filme', title: 'Rio', year: '2011', genre: 'Comédia / Família', mediaType: 'filme',
    portuguese: true, colorContent: true, catalogOnly: true, freeLegal: true, availabilityStatus: 'Assistir grátis — Mercado Play', accent: 'var(--blue)', thumb: 'assets/series-mercado-play.svg',
    desc: 'Animação e aventura ambientada no Rio de Janeiro, disponível gratuitamente no Mercado Play.', sourceUrl: 'https://play.mercadolivre.com.br/filtrar/gratuito', sourceLabel: 'Mercado Play — oficial', filmGenre: 'comedia'
  },
  {
    id: 'mercado-codigo-46', type: 'filme', title: 'Código 46', year: '2003', genre: 'Ficção científica / Romance', mediaType: 'filme',
    portuguese: true, colorContent: true, catalogOnly: true, freeLegal: true, availabilityStatus: 'Assistir grátis — Mercado Play', accent: 'var(--purple)', thumb: 'assets/series-mercado-play.svg',
    desc: 'Romance de ficção científica em um futuro controlado, disponível gratuitamente no Mercado Play.', sourceUrl: 'https://play.mercadolivre.com.br/filtrar/filmes/acao', sourceLabel: 'Mercado Play — oficial', filmGenre: 'ficcao'
  },
  {
    id: 'mercado-dead-space-aftermath', type: 'filme', title: 'Dead Space: Aftermath', year: '2011', genre: 'Ficção científica / Terror', mediaType: 'filme',
    portuguese: true, colorContent: true, catalogOnly: true, freeLegal: true, availabilityStatus: 'Assistir grátis — Mercado Play', accent: 'var(--purple)', thumb: 'assets/series-mercado-play.svg',
    desc: 'Thriller de ficção científica ambientado em 2059, disponível gratuitamente no Mercado Play.', sourceUrl: 'https://play.mercadolivre.com.br/filtrar/filmes/acao', sourceLabel: 'Mercado Play — oficial', filmGenre: 'terror'
  },
  {
    id: 'mercado-beowulf-guerreiro-sombras', type: 'filme', title: 'Beowulf: O Guerreiro das Sombras', year: '1999', genre: 'Ação / Fantasia', mediaType: 'filme',
    portuguese: true, colorContent: true, catalogOnly: true, freeLegal: true, availabilityStatus: 'Assistir grátis — Mercado Play', accent: 'var(--red)', thumb: 'assets/series-mercado-play.svg',
    desc: 'Fantasia de ação com Beowulf enfrentando Grendel, disponível gratuitamente no Mercado Play.', sourceUrl: 'https://play.mercadolivre.com.br/filtrar/filmes/acao', sourceLabel: 'Mercado Play — oficial', filmGenre: 'acao'
  }

,
  {
    id:'colecao-netmovies-youtube-oficial', type:'filme', title:'NetMovies — Filmes completos dublados', year:'Catálogo atual', genre:'Ação / Comédia / Romance / Terror / Ficção científica', mediaType:'colecao',
    language:'Português (dublado)', portuguese:true, colorContent:true, catalogOnly:true, freeLegal:true,
    availabilityStatus:'Grátis — YouTube oficial/licenciado', accent:'var(--red)', thumb:'assets/netmovies-oficial.svg',
    desc:'Canal verificado da NetMovies com filmes completos, licenciados e dublados. O catálogo recebe atualizações frequentes.',
    sourceUrl:'https://www.youtube.com/@netmovies', sourceLabel:'YouTube — NetMovies oficial', filmGenre:'acao',
    nostalgiaTags:['NetMovies','YouTube oficial','filmes completos','dublado','ação','comédia','romance','terror','ficção científica']
  },
  {
    id:'colecao-netmovies-comedia-oficial', type:'filme', title:'NetMovies Comédia — Filmes completos', year:'Catálogo atual', genre:'Comédia', mediaType:'colecao',
    language:'Português (dublado)', portuguese:true, colorContent:true, catalogOnly:true, freeLegal:true,
    availabilityStatus:'Grátis — YouTube oficial/licenciado', accent:'var(--gold)', thumb:'assets/netmovies-comedia.svg',
    desc:'Canal oficial da NetMovies dedicado a filmes completos de comédia, dublados e gratuitos.',
    sourceUrl:'https://www.youtube.com/@NetMoviesComedia', sourceLabel:'YouTube — NetMovies Comédia', filmGenre:'comedia',
    nostalgiaTags:['NetMovies','YouTube oficial','comédia','filme dublado','grátis']
  },
  {
    id:'colecao-plex-gratis', type:'filme', title:'Plex — Filmes e séries grátis', year:'Catálogo atual', genre:'Ação / Comédia / Terror / Romance / Ficção científica', mediaType:'colecao',
    language:'Áudio e legendas variam por título', portuguese:false, colorContent:true, catalogOnly:true, freeLegal:true,
    availabilityStatus:'Grátis com anúncios — Plex', accent:'var(--gold)', thumb:'assets/plex-gratis.svg',
    desc:'Catálogo gratuito do Plex, com milhares de filmes e séries e categorias separadas por gênero.',
    sourceUrl:'https://watch.plex.tv/pt-BR/on-demand', sourceLabel:'Plex — catálogo gratuito',
    nostalgiaTags:['Plex','filmes grátis','séries grátis','ação','comédia','terror','romance','ficção científica']
  },
  {
    id:'plex-marte-ataca-1996', type:'filme', title:'Marte Ataca!', year:'1996', genre:'Comédia / Ficção científica', mediaType:'filme',
    language:'Áudio conforme disponibilidade do Plex', portuguese:false, colorContent:true, catalogOnly:true, freeLegal:true,
    availabilityStatus:'Assistir grátis — Plex', accent:'var(--green)', thumb:'assets/plex-gratis.svg',
    desc:'Comédia de ficção científica de Tim Burton. Disponibilidade gratuita confirmada no Plex.',
    sourceUrl:'https://watch.plex.tv/pt-BR/movie/mars-attacks', sourceLabel:'Plex — assistir grátis', filmGenre:'ficcao',
    nostalgiaTags:['anos 90','ficção científica','comédia','TV','Plex']
  },
  {
    id:'plex-halloween-1978', type:'filme', title:'Halloween — A Noite do Terror', year:'1978', genre:'Terror / Thriller', mediaType:'filme',
    language:'Áudio conforme disponibilidade do Plex', portuguese:false, colorContent:true, catalogOnly:true, freeLegal:true,
    availabilityStatus:'Assistir grátis — Plex', accent:'var(--red)', thumb:'assets/plex-gratis.svg',
    desc:'O clássico de John Carpenter com Michael Myers. Disponibilidade gratuita confirmada no Plex.',
    sourceUrl:'https://watch.plex.tv/pt-BR/movie/halloween', sourceLabel:'Plex — assistir grátis', filmGenre:'terror',
    nostalgiaTags:['anos 70','terror clássico','Halloween','Plex']
  },
  {
    id:'plex-dracula-morto-feliz-1995', type:'filme', title:'Drácula: Morto, mas Feliz', year:'1995', genre:'Comédia / Terror', mediaType:'filme',
    language:'Áudio conforme disponibilidade do Plex', portuguese:false, colorContent:true, catalogOnly:true, freeLegal:true,
    availabilityStatus:'Assistir grátis — Plex', accent:'var(--purple)', thumb:'assets/plex-gratis.svg',
    desc:'Paródia de Drácula dirigida por Mel Brooks e estrelada por Leslie Nielsen. Gratuito no Plex.',
    sourceUrl:'https://watch.plex.tv/pt-BR/movie/dracula-dead-and-loving-it', sourceLabel:'Plex — assistir grátis', filmGenre:'comedia',
    nostalgiaTags:['anos 90','comédia','terror','Leslie Nielsen','Plex']
  },
  {
    id:'colecao-pluto-tv-on-demand', type:'filme', title:'Pluto TV — Filmes e séries grátis', year:'Catálogo atual', genre:'Filmes / Séries / Anime', mediaType:'colecao',
    language:'Áudio conforme título/canal', portuguese:true, colorContent:true, catalogOnly:true, freeLegal:true,
    availabilityStatus:'Grátis com anúncios — Pluto TV', accent:'var(--blue)', thumb:'assets/pluto-tv.svg',
    desc:'Catálogo sob demanda gratuito da Pluto TV Brasil, além de canais ao vivo e anime.',
    sourceUrl:'https://pluto.tv/br/on-demand', sourceLabel:'Pluto TV Brasil — oficial',
    nostalgiaTags:['Pluto TV','filmes grátis','séries grátis','anime grátis','TV ao vivo']
  },
  {
    id:'colecao-internet-archive-classicos', type:'filme', title:'Internet Archive — Clássicos e domínio público', year:'Arquivo histórico', genre:'Clássicos / Cinema histórico', mediaType:'colecao',
    language:'Idioma varia por item', portuguese:false, colorContent:false, catalogOnly:true, freeLegal:true,
    availabilityStatus:'Arquivo público — verificar direitos de cada item', accent:'var(--blue)', thumb:'assets/archive-classicos.svg',
    desc:'Atalho para o Internet Archive. O JogaHub só deve incorporar ou baixar itens cuja página indique disponibilidade e direitos compatíveis.',
    sourceUrl:'https://archive.org/details/feature_films', sourceLabel:'Internet Archive — Feature Films',
    nostalgiaTags:['Internet Archive','domínio público','filmes clássicos','arquivo histórico']
  }

,
  {
    id:'serie-franklin-bash-plex', type:'filme', title:'Franklin & Bash', year:'2011', genre:'Comédia / Drama / Crime',
    mediaType:'serie', seriesId:'franklin-bash-plex', seriesTitle:'Franklin & Bash', seasonCount:4, episodeCount:40,
    language:'Áudio conforme disponibilidade do Plex', portuguese:false, colorContent:true, catalogOnly:true, freeLegal:true,
    availabilityStatus:'4 temporadas — assistir grátis no Plex', accent:'var(--gold)', thumb:'assets/plex-series.svg',
    desc:'Dois advogados pouco convencionais são contratados por um grande escritório. O Plex lista as 4 temporadas e 40 episódios para assistir gratuitamente.',
    sourceUrl:'https://watch.plex.tv/pt-BR/show/franklin-and-bash', sourceLabel:'Plex — assistir grátis', classicTv:false,
    nostalgiaTags:['Plex','série grátis','comédia','drama','crime','anos 2010']
  },
  {
    id:'serie-hannibal-plex', type:'filme', title:'Hannibal', year:'2013', genre:'Drama / Crime / Terror',
    mediaType:'serie', seriesId:'hannibal-plex', seriesTitle:'Hannibal', seasonCount:3, episodeCount:39,
    language:'Áudio conforme disponibilidade do Plex', portuguese:false, colorContent:true, catalogOnly:true, freeLegal:true,
    availabilityStatus:'3 temporadas — disponibilidade gratuita no Plex pode variar', accent:'var(--red)', thumb:'assets/plex-series.svg',
    desc:'Will Graham trabalha com o psiquiatra Hannibal Lecter em investigações do FBI. O Plex lista 3 temporadas e 39 episódios; a disponibilidade gratuita pode variar por janela de licenciamento.',
    sourceUrl:'https://watch.plex.tv/pt-BR/show/hannibal', sourceLabel:'Plex — consultar/assistir',
    nostalgiaTags:['Plex','crime','terror','suspense','série']
  },
  {
    id:'colecao-plex-series-gratis', type:'filme', title:'Plex — Séries grátis', year:'Catálogo atual', genre:'Séries / TV', mediaType:'colecao',
    language:'Áudio e legendas variam por título', portuguese:false, colorContent:true, catalogOnly:true, freeLegal:true,
    availabilityStatus:'Catálogo gratuito com anúncios — muda ao longo do tempo', accent:'var(--gold)', thumb:'assets/plex-series.svg',
    desc:'Atalho para o catálogo gratuito do Plex, que reúne séries completas e canais ao vivo sem assinatura. O catálogo gira conforme licenças e região.',
    sourceUrl:'https://watch.plex.tv/pt-BR/on-demand', sourceLabel:'Plex — catálogo gratuito',
    nostalgiaTags:['Plex','séries grátis','TV grátis','catálogo legal']
  },
  {
    id:'anime-spy-family-crunchyroll', type:'filme', title:'SPY x FAMILY', year:'2022', genre:'Anime / Ação / Comédia', mediaType:'serie',
    seriesId:'spy-family-crunchyroll', seriesTitle:'SPY x FAMILY', anime:true, language:'Português (Brasil) disponível', portuguese:true, colorContent:true,
    catalogOnly:true, availabilityStatus:'Crunchyroll — áudio PT-BR disponível', accent:'var(--pink)', thumb:'assets/crunchyroll-anime.svg',
    desc:'Twilight precisa formar uma família falsa para cumprir uma missão. A Crunchyroll lista áudio em Português (Brasil).',
    sourceUrl:'https://www.crunchyroll.com/pt-br/series/G4PH0WXVJ/spy-x-family', sourceLabel:'Crunchyroll — página oficial',
    nostalgiaTags:['anime','dublado','Crunchyroll','comédia','ação']
  },
  {
    id:'anime-solo-leveling-crunchyroll', type:'filme', title:'Solo Leveling', year:'2024', genre:'Anime / Ação / Fantasia', mediaType:'serie',
    seriesId:'solo-leveling-crunchyroll', seriesTitle:'Solo Leveling', anime:true, language:'Português (Brasil) disponível', portuguese:true, colorContent:true,
    catalogOnly:true, availabilityStatus:'Crunchyroll — áudio PT-BR disponível', accent:'var(--purple)', thumb:'assets/crunchyroll-anime.svg',
    desc:'Sung Jinwoo ganha a capacidade de evoluir sem limites após sobreviver a uma masmorra mortal. Áudio PT-BR confirmado na Crunchyroll.',
    sourceUrl:'https://www.crunchyroll.com/pt-br/series/GDKHZEJ0K/solo-leveling', sourceLabel:'Crunchyroll — página oficial',
    nostalgiaTags:['anime','dublado','Crunchyroll','ação','fantasia']
  },
  {
    id:'anime-haikyu-crunchyroll', type:'filme', title:'HAIKYU!!', year:'2014', genre:'Anime / Esportes / Comédia', mediaType:'serie',
    seriesId:'haikyu-crunchyroll', seriesTitle:'HAIKYU!!', anime:true, language:'Português (Brasil) disponível', portuguese:true, colorContent:true,
    catalogOnly:true, availabilityStatus:'Crunchyroll — áudio PT-BR disponível', accent:'var(--gold)', thumb:'assets/crunchyroll-anime.svg',
    desc:'Hinata e Kageyama buscam levar o Karasuno ao topo do vôlei colegial. Áudio em Português (Brasil) confirmado.',
    sourceUrl:'https://www.crunchyroll.com/pt-br/series/GY8VM8MWY/haikyu', sourceLabel:'Crunchyroll — página oficial',
    nostalgiaTags:['anime','dublado','Crunchyroll','esportes','vôlei']
  },
  {
    id:'anime-fire-force-crunchyroll', type:'filme', title:'Fire Force', year:'2019', genre:'Anime / Ação / Ficção científica', mediaType:'serie',
    seriesId:'fire-force-crunchyroll', seriesTitle:'Fire Force', anime:true, language:'Português (Brasil) listado', portuguese:true, colorContent:true,
    catalogOnly:true, availabilityStatus:'Crunchyroll — disponibilidade pode variar', accent:'var(--red)', thumb:'assets/crunchyroll-anime.svg',
    desc:'Brigadas especiais enfrentam casos de combustão humana espontânea. A Crunchyroll lista áudio PT-BR, mas a disponibilidade de vídeo pode variar.',
    sourceUrl:'https://www.crunchyroll.com/pt-br/series/GYQWNXPZY/fire-force', sourceLabel:'Crunchyroll — página oficial',
    nostalgiaTags:['anime','dublado','Crunchyroll','ação','ficção científica']
  },
  {
    id:'anime-naruto-crunchyroll', type:'filme', title:'Naruto (Dublado)', year:'2002', genre:'Anime / Ação / Aventura', mediaType:'serie',
    seriesId:'naruto-crunchyroll', seriesTitle:'Naruto', anime:true, language:'Página brasileira com versão dublada/listada', portuguese:true, colorContent:true,
    catalogOnly:true, availabilityStatus:'Crunchyroll — versão dublada/listada', accent:'var(--orange)', thumb:'assets/crunchyroll-anime.svg',
    desc:'Naruto Uzumaki sonha em se tornar Hokage. O título aparece na Crunchyroll brasileira como Naruto (Dublado); idiomas disponíveis podem variar por episódio/região.',
    sourceUrl:'https://www.crunchyroll.com/pt-br/series/GY9PJ5KWR/naruto', sourceLabel:'Crunchyroll — página oficial',
    nostalgiaTags:['anime','Naruto','dublado','Crunchyroll','anos 2000']
  },
  {
    id:'anime-dragon-ball-z-crunchyroll', type:'filme', title:'Dragon Ball Z', year:'1989', genre:'Anime / Ação / Aventura', mediaType:'serie',
    seriesId:'dragon-ball-z-crunchyroll', seriesTitle:'Dragon Ball Z', anime:true, language:'Legendas PT-BR; áudio varia por região', portuguese:true, colorContent:true,
    catalogOnly:true, availabilityStatus:'Crunchyroll — consultar áudio/região', accent:'var(--orange)', thumb:'assets/crunchyroll-anime.svg',
    desc:'Goku e os Guerreiros Z enfrentam ameaças cada vez maiores. A página brasileira da Crunchyroll está disponível; áudio pode variar conforme região.',
    sourceUrl:'https://www.crunchyroll.com/pt-br/series/G9VHN9PPW/dragon-ball-z', sourceLabel:'Crunchyroll — página oficial',
    nostalgiaTags:['anime','Dragon Ball Z','Crunchyroll','anos 90','ação']
  },
  {
    id:'colecao-crunchyroll-dublados-atual', type:'filme', title:'Crunchyroll — Animes dublados', year:'Catálogo atual', genre:'Anime', mediaType:'colecao',
    anime:true, language:'Dublagens variam por título/região', portuguese:true, colorContent:true, catalogOnly:true,
    availabilityStatus:'Catálogo oficial — filtre por Dublado', accent:'var(--orange)', thumb:'assets/crunchyroll-anime.svg',
    desc:'Atalho para o catálogo oficial da Crunchyroll. Use o filtro de idioma Dublado e confira o áudio de cada série; a disponibilidade muda por região.',
    sourceUrl:'https://www.crunchyroll.com/pt-br/videos/anime', sourceLabel:'Crunchyroll — catálogo oficial',
    nostalgiaTags:['anime','dublado','Crunchyroll','catálogo oficial']
  },
  {
    id:'colecao-pluto-series-anime', type:'filme', title:'Pluto TV — Séries e Anime grátis', year:'Catálogo atual', genre:'Séries / Anime / TV', mediaType:'colecao',
    anime:true, language:'Áudio conforme canal/título', portuguese:true, colorContent:true, catalogOnly:true, freeLegal:true,
    availabilityStatus:'Grátis com anúncios — catálogo muda', accent:'var(--blue)', thumb:'assets/pluto-series.svg',
    desc:'Atalho para a área sob demanda da Pluto TV Brasil, com séries, animações e canais temáticos gratuitos. O catálogo é dinâmico.',
    sourceUrl:'https://pluto.tv/br/on-demand', sourceLabel:'Pluto TV Brasil — oficial',
    nostalgiaTags:['Pluto TV','séries grátis','anime grátis','TV grátis']
  },
  {
    id:'anime-yu-yu-hakusho-oficial', type:'filme', title:'Yu Yu Hakusho', year:'1992', genre:'Anime / Ação / Sobrenatural', mediaType:'serie',
    seriesId:'yu-yu-hakusho-oficial', seriesTitle:'Yu Yu Hakusho', anime:true, seasonCount:4, episodeCount:112,
    language:'Idiomas variam por região/plano', portuguese:false, colorContent:true, catalogOnly:true,
    availabilityStatus:'Disponível legalmente no Brasil — Crunchyroll', accent:'var(--purple)', thumb:'assets/yu-yu-hakusho.svg',
    desc:'Clássico de Yusuke Urameshi com 112 episódios. O JogaHub aponta para a fonte oficial disponível no Brasil; uploads não autorizados do Archive não são incorporados.',
    sourceUrl:'https://www.crunchyroll.com/pt-br/series/GR9PKENW6/yu-yu-hakusho', sourceLabel:'Crunchyroll — página oficial',
    classicTv:true, nostalgiaTags:['anime','Yu Yu Hakusho','anos 90','TV Manchete','sobrenatural','clássico']
  },
  {
    id:'anime-sakura-cardcaptor-oficial', type:'filme', title:'Sakura Card Captors', year:'1998', genre:'Anime / Aventura / Fantasia', mediaType:'serie',
    seriesId:'sakura-cardcaptor-oficial', seriesTitle:'Sakura Card Captors', anime:true,
    language:'Áudio/legendas conforme serviço', portuguese:true, colorContent:true, catalogOnly:true,
    availabilityStatus:'Disponível legalmente no Brasil — KoiPlay/Amazon Channel', accent:'var(--pink)', thumb:'assets/sakura-cardcaptors.svg',
    desc:'Sakura Kinomoto liberta as Cartas Clow e precisa recuperá-las. A série clássica está disponível legalmente no Brasil via KoiPlay Amazon Channel.',
    sourceUrl:'https://br.justwatch.com/br/serie/sakura-card-captor', sourceLabel:'JustWatch Brasil — onde assistir',
    classicTv:true, nostalgiaTags:['anime','Sakura','Cardcaptor Sakura','Globo','Cartoon Network','anos 2000','nostalgia']
  },
  {
    id:'anime-phantom-quest-corp', type:'filme', title:'Phantom Quest Corp.', year:'1994', genre:'Anime / Sobrenatural / Comédia', mediaType:'serie',
    seriesId:'phantom-quest-corp', seriesTitle:'Phantom Quest Corp.', anime:true, seasonCount:1, episodeCount:4,
    language:'Disponibilidade legal atual não localizada no Brasil', portuguese:false, colorContent:true, catalogOnly:true,
    availabilityStatus:'Catálogo — sem streaming legal confirmado no Brasil', accent:'var(--purple)', thumb:'assets/phantom-quest-corp.svg',
    desc:'OVA sobrenatural da Madhouse. O item encontrado no Internet Archive não apresenta autorização clara de distribuição; por isso fica catalogado sem incorporar esse upload.',
    sourceUrl:'https://www.justwatch.com/br', sourceLabel:'Consultar disponibilidade legal',
    nostalgiaTags:['anime','Madhouse','OVA','anos 90','sobrenatural']
  },
  {
    id:'anime-shinzo-mushrambo', type:'filme', title:'Shinzo (Mushrambo)', year:'2000', genre:'Anime / Aventura / Ficção científica', mediaType:'serie',
    seriesId:'shinzo-mushrambo', seriesTitle:'Shinzo', anime:true, seasonCount:1, episodeCount:32,
    language:'Dublagem brasileira existente', portuguese:true, colorContent:true, catalogOnly:true,
    availabilityStatus:'Indisponível em streaming legal no Brasil no momento', accent:'var(--orange)', thumb:'assets/shinzo.svg',
    desc:'Anime da Toei exibido no Brasil pela Fox Kids e Globo. O Plex cataloga 32 episódios, mas atualmente não indica uma fonte de reprodução no Brasil.',
    sourceUrl:'https://watch.plex.tv/pt-BR/show/shinzo', sourceLabel:'Plex — catálogo / disponibilidade',
    classicTv:true, nostalgiaTags:['anime','Shinzo','Mushrambo','Fox Kids','Globo','anos 2000','dublado']
  },
  {
    id:'serie-mumias-vivas-oldflix', type:'filme', title:'Múmias Vivas', year:'1997', genre:'Animação / Ação / Fantasia', mediaType:'serie',
    seriesId:'mumias-vivas-oldflix', seriesTitle:'Múmias Vivas', seasonCount:1, episodeCount:42,
    language:'Português / disponibilidade conforme Oldflix', portuguese:true, colorContent:true, catalogOnly:true,
    availabilityStatus:'1 temporada / 42 episódios — Oldflix', accent:'var(--gold)', thumb:'assets/mumias-vivas.svg',
    desc:'Também conhecida como Mummies Alive! / O Regresso das Múmias. A série de 1997 tem 42 episódios e aparece legalmente no catálogo do Oldflix no Brasil.',
    sourceUrl:'https://br.justwatch.com/br/serie/o-regresso-das-mumias', sourceLabel:'JustWatch Brasil — Oldflix',
    classicTv:true, nostalgiaTags:['Múmias Vivas','Mummies Alive','anos 90','desenho','dublado','Oldflix']
  }
,
  {
    id:'serie-corrida-maluca-archive-catalogo', type:'filme', title:'Corrida Maluca', year:'1968', genre:'Animação / Comédia / Corrida', mediaType:'serie',
    seriesId:'corrida-maluca', seriesTitle:'Corrida Maluca', seasonCount:1,
    language:'Dublagem em português no item informado pelo usuário', portuguese:true, colorContent:true, catalogOnly:true,
    availabilityStatus:'Fonte externa — Internet Archive', accent:'var(--orange)', thumb:'assets/corrida-maluca.svg',
    desc:'Clássico da Hanna-Barbera com Dick Vigarista, Muttley e competidores em corridas malucas. O item indicado abre no player do Internet Archive, mas o JogaHub o mantém como fonte externa por não haver autorização clara de redistribuição no upload.',
    sourceUrl:'https://archive.org/details/corrida.-maluca', sourceLabel:'Internet Archive — fonte externa',
    classicTv:true, nostalgiaTags:['Corrida Maluca','Wacky Races','Hanna-Barbera','anos 60','desenho clássico','dublado','nostalgia']
  }

,
  // ==================================================================
  // v1.0.15 — YOUTUBE PT-BR + DORAMAS OFICIAIS: somente vídeos/players incorporáveis
  // Fontes oficiais/licenciadas validadas em setembro/2026.
  // ==================================================================
  {
    id:'yt-netmovies-congelado', type:'filme', title:'Congelado', year:'Filme completo', genre:'Ação / Suspense', mediaType:'filme',
    language:'Português (dublado)', portuguese:true, colorContent:true, youtubePt:true, filmGenre:'acao', freeLegal:true,
    youtubeId:'NaCgFZviCuU', thumb:'https://i.ytimg.com/vi/NaCgFZviCuU/hqdefault.jpg', accent:'var(--blue)',
    desc:'Filme completo dublado disponibilizado pelo canal verificado NetMovies.',
    sourceUrl:'https://www.youtube.com/watch?v=NaCgFZviCuU', sourceLabel:'NetMovies — YouTube oficial', nostalgiaTags:['YouTube','dublado','filme completo','NetMovies','ação']
  },
  {
    id:'yt-netmovies-aprisionados', type:'filme', title:'Aprisionados', year:'Filme completo', genre:'Terror', mediaType:'filme',
    language:'Português (dublado)', portuguese:true, colorContent:true, youtubePt:true, filmGenre:'terror', freeLegal:true,
    youtubeId:'nEpCfMLsHVo', thumb:'https://i.ytimg.com/vi/nEpCfMLsHVo/hqdefault.jpg', accent:'var(--red)',
    desc:'Filme completo de terror dublado disponibilizado pelo canal verificado NetMovies.',
    sourceUrl:'https://www.youtube.com/watch?v=nEpCfMLsHVo', sourceLabel:'NetMovies — YouTube oficial', nostalgiaTags:['YouTube','dublado','filme completo','NetMovies','terror']
  },
  {
    id:'yt-netmovies-o-massacre', type:'filme', title:'O Massacre', year:'Filme completo', genre:'Terror', mediaType:'filme',
    language:'Português (dublado)', portuguese:true, colorContent:true, youtubePt:true, filmGenre:'terror', freeLegal:true,
    youtubeId:'bHWHQQbeCsA', thumb:'https://i.ytimg.com/vi/bHWHQQbeCsA/hqdefault.jpg', accent:'var(--red)',
    desc:'Filme completo de terror dublado disponibilizado pelo canal verificado NetMovies.',
    sourceUrl:'https://www.youtube.com/watch?v=bHWHQQbeCsA', sourceLabel:'NetMovies — YouTube oficial', nostalgiaTags:['YouTube','dublado','filme completo','NetMovies','terror']
  },
  {
    id:'yt-netmovies-encontro-inesperado', type:'filme', title:'Encontro Inesperado', year:'Filme completo', genre:'Romance', mediaType:'filme',
    language:'Português (dublado)', portuguese:true, colorContent:true, youtubePt:true, filmGenre:'romance', freeLegal:true,
    youtubeId:'FA2Xso8SL4g', thumb:'https://i.ytimg.com/vi/FA2Xso8SL4g/hqdefault.jpg', accent:'var(--pink)',
    desc:'Filme completo de romance dublado publicado pelo canal NetMovies Romance.',
    sourceUrl:'https://www.youtube.com/watch?v=FA2Xso8SL4g', sourceLabel:'NetMovies Romance — YouTube', nostalgiaTags:['YouTube','dublado','filme completo','NetMovies','romance']
  },
  {
    id:'yt-netmovies-a-contaminacao', type:'filme', title:'A Contaminação', year:'Filme completo', genre:'Ficção científica / Suspense', mediaType:'filme',
    language:'Português (dublado)', portuguese:true, colorContent:true, youtubePt:true, filmGenre:'ficcao', freeLegal:true,
    youtubeId:'UsXYF4gTfIM', thumb:'https://i.ytimg.com/vi/UsXYF4gTfIM/hqdefault.jpg', accent:'var(--purple)',
    desc:'Filme completo de ficção científica dublado disponibilizado pelo canal verificado NetMovies.',
    sourceUrl:'https://www.youtube.com/watch?v=UsXYF4gTfIM', sourceLabel:'NetMovies — YouTube oficial', nostalgiaTags:['YouTube','dublado','filme completo','NetMovies','ficção científica']
  },
  {
    id:'yt-netmovies-festas-parentes', type:'filme', title:'Sobrevivendo às Festas com os Parentes', year:'Filme completo', genre:'Comédia', mediaType:'filme',
    language:'Português (dublado)', portuguese:true, colorContent:true, youtubePt:true, filmGenre:'comedia', freeLegal:true,
    youtubeId:'1KDJkXNeVG8', thumb:'https://i.ytimg.com/vi/1KDJkXNeVG8/hqdefault.jpg', accent:'var(--gold)',
    desc:'Comédia completa dublada disponibilizada pelo canal verificado NetMovies.',
    sourceUrl:'https://www.youtube.com/watch?v=1KDJkXNeVG8', sourceLabel:'NetMovies — YouTube oficial', nostalgiaTags:['YouTube','dublado','filme completo','NetMovies','comédia']
  },
  {
    id:'yt-yugioh-duel-monsters-ptbr', type:'filme', title:'Yu-Gi-Oh! Duel Monsters — PT-BR', year:'2000', genre:'Anime / Ação / Aventura', mediaType:'serie',
    seriesId:'yugioh-duel-monsters-ptbr', seriesTitle:'Yu-Gi-Oh! Duel Monsters', anime:true, language:'Português (Brasil)', portuguese:true, colorContent:true, youtubePt:true, freeLegal:true,
    youtubePlaylistId:'PLhIid9p4AHHWvcPC5ls3zghn7_wmHHWFd', youtubePreviewId:'Q2gOVS4WLeo', thumb:'assets/youtube-yugioh.svg', accent:'var(--gold)',
    desc:'Playlist em português brasileiro vinculada ao canal oficial verificado de Yu-Gi-Oh!, com episódios completos do anime.',
    sourceUrl:'https://www.youtube.com/playlist?list=PLhIid9p4AHHWvcPC5ls3zghn7_wmHHWFd', sourceLabel:'Yu-Gi-Oh! Português Brasileiro Oficial',
    classicTv:true, nostalgiaTags:['YouTube','anime','dublado','Yu-Gi-Oh','anos 2000','episódios completos']
  },
  {
    id:'yt-yugioh-gx-ep1-ptbr', type:'filme', title:'Yu-Gi-Oh! GX — O Próximo Rei dos Jogos', year:'Episódio 1', genre:'Anime / Ação', mediaType:'serie',
    seriesId:'yugioh-gx-ptbr', seriesTitle:'Yu-Gi-Oh! GX', season:1, episode:1, anime:true, language:'Português (Brasil)', portuguese:true, colorContent:true, youtubePt:true, freeLegal:true,
    youtubeId:'1vnyaulvWzQ', thumb:'https://i.ytimg.com/vi/1vnyaulvWzQ/hqdefault.jpg', accent:'var(--gold)',
    desc:'Primeiro episódio de Yu-Gi-Oh! GX em português do Brasil no canal oficial.',
    sourceUrl:'https://www.youtube.com/watch?v=1vnyaulvWzQ', sourceLabel:'Yu-Gi-Oh! Português Brasileiro Oficial',
    nostalgiaTags:['YouTube','anime','dublado','Yu-Gi-Oh GX','anos 2000','episódio completo']
  },
  {
    id:'yt-beyblade-x-ep1', type:'filme', title:'Beyblade X — Episódio 1: X', year:'2024', genre:'Anime / Ação / Esportes', mediaType:'serie',
    seriesId:'beyblade-x-ptbr', seriesTitle:'Beyblade X', season:1, episode:1, anime:true, language:'Português (Brasil)', portuguese:true, colorContent:true, youtubePt:true, freeLegal:true,
    youtubeId:'HntI77JSiwQ', thumb:'https://i.ytimg.com/vi/HntI77JSiwQ/hqdefault.jpg', accent:'var(--red)',
    desc:'Episódio completo publicado pelo canal oficial BEYBLADE Português Brasil.',
    sourceUrl:'https://www.youtube.com/watch?v=HntI77JSiwQ', sourceLabel:'BEYBLADE Português Brasil — Canal Oficial',
    nostalgiaTags:['YouTube','anime','dublado','Beyblade','episódio completo']
  },
  {
    id:'yt-heman-semente-do-mal', type:'filme', title:'He-Man — A Semente do Mal', year:'Episódio completo', genre:'Animação / Aventura / Fantasia', mediaType:'serie',
    seriesId:'heman-ptbr-youtube', seriesTitle:'He-Man e os Mestres do Universo', season:1, language:'Português (dublado)', portuguese:true, colorContent:true, youtubePt:true, freeLegal:true,
    youtubeId:'RmN8u3_tamU', thumb:'https://i.ytimg.com/vi/RmN8u3_tamU/hqdefault.jpg', accent:'var(--orange)',
    desc:'Episódio completo dublado publicado pelo canal verificado He-Man em Português.',
    sourceUrl:'https://www.youtube.com/watch?v=RmN8u3_tamU', sourceLabel:'He-Man em Português — canal verificado',
    classicTv:true, nostalgiaTags:['YouTube','dublado','He-Man','anos 80','desenho clássico','episódio completo']
  },
  {
    id:'yt-heman-jacob-widgets', type:'filme', title:'He-Man — Jacob e os Widgets', year:'Episódio completo', genre:'Animação / Aventura / Fantasia', mediaType:'serie',
    seriesId:'heman-ptbr-youtube', seriesTitle:'He-Man e os Mestres do Universo', season:1, language:'Português (dublado)', portuguese:true, colorContent:true, youtubePt:true, freeLegal:true,
    youtubeId:'jZ-qcfkVWEc', thumb:'https://i.ytimg.com/vi/jZ-qcfkVWEc/hqdefault.jpg', accent:'var(--orange)',
    desc:'Episódio completo dublado publicado pelo canal verificado He-Man em Português.',
    sourceUrl:'https://www.youtube.com/watch?v=jZ-qcfkVWEc', sourceLabel:'He-Man em Português — canal verificado',
    classicTv:true, nostalgiaTags:['YouTube','dublado','He-Man','anos 80','desenho clássico','episódio completo']
  },
  {
    id:'yt-heman-compilacao-1h', type:'filme', title:'He-Man — Compilação de 1 Hora', year:'Compilação', genre:'Animação / Aventura', mediaType:'serie',
    seriesId:'heman-ptbr-youtube', seriesTitle:'He-Man e os Mestres do Universo', language:'Português (dublado)', portuguese:true, colorContent:true, youtubePt:true, freeLegal:true,
    youtubeId:'Vic_zLZaxxY', thumb:'https://i.ytimg.com/vi/Vic_zLZaxxY/hqdefault.jpg', accent:'var(--orange)',
    desc:'Compilação dublada de He-Man publicada pelo canal verificado He-Man em Português.',
    sourceUrl:'https://www.youtube.com/watch?v=Vic_zLZaxxY', sourceLabel:'He-Man em Português — canal verificado',
    classicTv:true, nostalgiaTags:['YouTube','dublado','He-Man','anos 80','compilação']
  },
  {
    id:'yt-shera-rei-unicornio', type:'filme', title:'She-Ra — O Rei Unicórnio', year:'Episódio completo', genre:'Animação / Aventura / Fantasia', mediaType:'serie',
    seriesId:'shera-ptbr-youtube', seriesTitle:'She-Ra: A Princesa do Poder', season:1, language:'Português (dublado)', portuguese:true, colorContent:true, youtubePt:true, freeLegal:true,
    youtubeId:'AB1rdNuJr1M', thumb:'https://i.ytimg.com/vi/AB1rdNuJr1M/hqdefault.jpg', accent:'var(--pink)',
    desc:'Episódio completo em português publicado pelo canal verificado She-Ra: A Princesa do Poder.',
    sourceUrl:'https://www.youtube.com/watch?v=AB1rdNuJr1M', sourceLabel:'She-Ra: A Princesa do Poder — canal verificado',
    classicTv:true, nostalgiaTags:['YouTube','dublado','She-Ra','anos 80','desenho clássico','episódio completo']
  },
  {
    id:'yt-panteracorrosa-disque-p', type:'filme', title:'A Pantera Cor-de-Rosa — Disque P para Pantera', year:'Episódio completo', genre:'Animação / Comédia', mediaType:'serie',
    seriesId:'pantera-cor-de-rosa-ptbr', seriesTitle:'A Pantera Cor-de-Rosa', language:'Português (dublado)', portuguese:true, colorContent:true, youtubePt:true,
    youtubeId:'ADxuv3Pn5Aw', thumb:'https://i.ytimg.com/vi/ADxuv3Pn5Aw/hqdefault.jpg', accent:'var(--pink)',
    desc:'Episódio completo dublado em português disponibilizado no canal A Pantera Cor de Rosa em Português.',
    sourceUrl:'https://www.youtube.com/watch?v=ADxuv3Pn5Aw', sourceLabel:'A Pantera Cor de Rosa em Português — YouTube',
    classicTv:true, nostalgiaTags:['YouTube','dublado','Pantera Cor-de-Rosa','desenho clássico','episódio completo']
  },
  {
    id:'yt-panteracorrosa-toureiro', type:'filme', title:'A Pantera Cor-de-Rosa — O Toureiro Cor-de-Rosa', year:'Episódio completo', genre:'Animação / Comédia', mediaType:'serie',
    seriesId:'pantera-cor-de-rosa-ptbr', seriesTitle:'A Pantera Cor-de-Rosa', language:'Português (dublado)', portuguese:true, colorContent:true, youtubePt:true,
    youtubeId:'0LjU3-mPMrM', thumb:'https://i.ytimg.com/vi/0LjU3-mPMrM/hqdefault.jpg', accent:'var(--pink)',
    desc:'Episódio completo dublado em português disponibilizado no canal A Pantera Cor de Rosa em Português.',
    sourceUrl:'https://www.youtube.com/watch?v=0LjU3-mPMrM', sourceLabel:'A Pantera Cor de Rosa em Português — YouTube',
    classicTv:true, nostalgiaTags:['YouTube','dublado','Pantera Cor-de-Rosa','desenho clássico','episódio completo']
  }

  ,
  {
    id:'yt-dorama-if-we-were-a-season', type:'filme', title:'If We Were a Season', year:'2017', genre:'Dorama / Romance / Escolar', mediaType:'filme',
    dorama:true, language:'Coreano • legendas em inglês', portuguese:false, colorContent:true, youtubePt:false, freeLegal:true,
    youtubeId:'vZ7EMIH0oHw', thumb:'https://i.ytimg.com/vi/vZ7EMIH0oHw/hqdefault.jpg', accent:'var(--pink)',
    desc:'Especial romântico completo da KBS sobre dois amigos de infância cuja relação muda com a chegada de um novo aluno. Publicação oficial do KBS WORLD TV.',
    sourceUrl:'https://www.youtube.com/watch?v=vZ7EMIH0oHw', sourceLabel:'KBS WORLD TV — canal oficial verificado',
    nostalgiaTags:['dorama','k-drama','romance','escolar','YouTube oficial','episódio completo']
  },
  {
    id:'yt-dorama-my-happy-home', type:'filme', title:'My Happy Home', year:'2017', genre:'Dorama / Ficção científica / Romance', mediaType:'filme',
    dorama:true, language:'Coreano • legendas em inglês', portuguese:false, colorContent:true, youtubePt:false, freeLegal:true,
    youtubeId:'mF_sBcqdEYI', thumb:'https://i.ytimg.com/vi/mF_sBcqdEYI/hqdefault.jpg', accent:'var(--purple)',
    desc:'Drama especial completo sobre uma cientista e seu marido ciborgue. Disponibilizado gratuitamente pelo canal oficial KBS WORLD TV.',
    sourceUrl:'https://www.youtube.com/watch?v=mF_sBcqdEYI', sourceLabel:'KBS WORLD TV — canal oficial verificado',
    nostalgiaTags:['dorama','k-drama','ficção científica','romance','YouTube oficial','episódio completo']
  },
  {
    id:'yt-dorama-tuna-dolphin', type:'filme', title:'The Tuna and the Dolphin', year:'2018', genre:'Dorama / Comédia romântica', mediaType:'filme',
    dorama:true, language:'Coreano • legendas em inglês', portuguese:false, colorContent:true, youtubePt:false, freeLegal:true,
    youtubeId:'65WYszK8A78', thumb:'https://i.ytimg.com/vi/65WYszK8A78/hqdefault.jpg', accent:'var(--blue)',
    desc:'Comédia romântica curta do KBS Drama Special, completa no canal oficial KBS WORLD TV.',
    sourceUrl:'https://www.youtube.com/watch?v=65WYszK8A78', sourceLabel:'KBS WORLD TV — canal oficial verificado',
    nostalgiaTags:['dorama','k-drama','comédia romântica','YouTube oficial','episódio completo']
  }
  ,
  {
    id:'yt-peppa-casa-subterranea', type:'filme', title:'Peppa Pig — A Casa Subterrânea', year:'2025', genre:'Animação / Infantil', mediaType:'serie',
    seriesId:'peppa-pig-ptbr', seriesTitle:'Peppa Pig', kids:true, language:'Português (Brasil)', portuguese:true, colorContent:true, youtubePt:true, freeLegal:true,
    youtubeId:'RYEiy9fbTmk', thumb:'https://i.ytimg.com/vi/RYEiy9fbTmk/hqdefault.jpg', accent:'var(--pink)',
    desc:'Episódios completos de Peppa Pig publicados pelo canal oficial em Português Brasil.',
    sourceUrl:'https://www.youtube.com/watch?v=RYEiy9fbTmk', sourceLabel:'Peppa Pig em Português Brasil — canal oficial',
    nostalgiaTags:['YouTube','infantil','dublado','Peppa Pig','episódios completos']
  },
  {
    id:'yt-netmovies-horror-entre-nos', type:'filme', title:'O Horror Entre Nós', year:'Filme completo', genre:'Terror', mediaType:'filme',
    language:'Português (dublado)', portuguese:true, colorContent:true, youtubePt:true, filmGenre:'terror', freeLegal:true,
    youtubeId:'H6xio03z7_w', thumb:'https://i.ytimg.com/vi/H6xio03z7_w/hqdefault.jpg', accent:'var(--red)',
    desc:'Filme de terror completo e dublado publicado pelo canal verificado NetMovies.',
    sourceUrl:'https://www.youtube.com/watch?v=H6xio03z7_w', sourceLabel:'NetMovies — YouTube oficial',
    nostalgiaTags:['YouTube','dublado','filme completo','NetMovies','terror']
  }

  ,
  {
    id:'archive-yu-yu-hakusho-720p', type:'filme', title:'Yu Yu Hakusho — Arquivo PT-BR', year:'1992', genre:'Anime / Ação', mediaType:'serie',
    seriesId:'yu-yu-hakusho-archive', seriesTitle:'Yu Yu Hakusho', anime:true, language:'Português (dublado)', portuguese:true, colorContent:true, archivePt:true, rightsUnclear:true,
    archiveId:'yu-yu-hakusho-720p', thumb:'https://archive.org/services/img/yu-yu-hakusho-720p', accent:'var(--gold)',
    desc:'Coleção pública encontrada no Internet Archive com episódios de Yu Yu Hakusho em português. Direitos do upload não estão claramente indicados nos metadados.',
    sourceUrl:'https://archive.org/details/yu-yu-hakusho-720p', sourceLabel:'Internet Archive — publicação pública; direitos não verificados',
    classicTv:true, nostalgiaTags:['Archive','Yu Yu Hakusho','anime','dublado','anos 90']
  },
  {
    id:'archive-sakura-cardcaptors-globo', type:'filme', title:'Sakura Card Captors — Globo', year:'1998', genre:'Anime / Fantasia', mediaType:'serie',
    seriesId:'sakura-cardcaptors-archive', seriesTitle:'Sakura Card Captors', anime:true, language:'Português (dublado)', portuguese:true, colorContent:true, archivePt:true, rightsUnclear:true,
    archiveId:'sakura-cardcaptors-globo', thumb:'https://archive.org/services/img/sakura-cardcaptors-globo', accent:'var(--pink)',
    desc:'Arquivo público do Internet Archive identificado como Sakura Card Captors em versão exibida no Brasil. Direitos do upload não estão claramente indicados.',
    sourceUrl:'https://archive.org/details/sakura-cardcaptors-globo', sourceLabel:'Internet Archive — publicação pública; direitos não verificados',
    classicTv:true, nostalgiaTags:['Archive','Sakura','anime','dublado','Globo','anos 2000']
  },
  {
    id:'archive-phantom-quest-corp', type:'filme', title:'Phantom Quest Corp. — Arquivo PT', year:'1994', genre:'Anime / Sobrenatural / Comédia', mediaType:'serie',
    seriesId:'phantom-quest-corp-archive', seriesTitle:'Phantom Quest Corp.', anime:true, language:'Português / conforme arquivo', portuguese:true, colorContent:true, archivePt:true, rightsUnclear:true,
    archiveId:'phantom-carism-corp-madhouse', thumb:'https://archive.org/services/img/phantom-carism-corp-madhouse', accent:'var(--purple)',
    desc:'OVA/anime preservado em publicação pública do Internet Archive. Direitos do upload não estão claramente indicados.',
    sourceUrl:'https://archive.org/details/phantom-carism-corp-madhouse', sourceLabel:'Internet Archive — publicação pública; direitos não verificados',
    nostalgiaTags:['Archive','Phantom Quest Corp','anime','OVA','anos 90']
  },
  {
    id:'archive-corrida-maluca', type:'filme', title:'Corrida Maluca — Arquivo em Português', year:'1968', genre:'Animação / Comédia', mediaType:'serie',
    seriesId:'corrida-maluca-archive', seriesTitle:'Corrida Maluca', language:'Português / conforme arquivo', portuguese:true, colorContent:true, archivePt:true, rightsUnclear:true,
    archiveId:'corrida.-maluca', thumb:'https://archive.org/services/img/corrida.-maluca', accent:'var(--gold)',
    desc:'Publicação pública de Corrida Maluca no Internet Archive. Direitos do upload não estão claramente indicados.',
    sourceUrl:'https://archive.org/details/corrida.-maluca', sourceLabel:'Internet Archive — publicação pública; direitos não verificados',
    classicTv:true, nostalgiaTags:['Archive','Corrida Maluca','desenho clássico','anos 60','dublado']
  },
  {
    id:'yt-pokemon-horizontes-t1e2', type:'filme', title:'Pokémon Horizontes — T1E2', year:'Episódio completo', genre:'Anime / Aventura', mediaType:'serie',
    seriesId:'pokemon-horizontes-oficial', seriesTitle:'Pokémon: Horizontes', season:1, episode:2, anime:true, language:'Português', portuguese:true, colorContent:true, youtubePt:true, freeLegal:true,
    youtubeId:'R--INUiUisY', thumb:'https://i.ytimg.com/vi/R--INUiUisY/hqdefault.jpg', accent:'var(--gold)',
    desc:'Episódio completo publicado pelo Canal Oficial da Pokémon em Português.', sourceUrl:'https://www.youtube.com/watch?v=R--INUiUisY', sourceLabel:'Pokémon Oficial em Português — YouTube',
    nostalgiaTags:['Pokémon','anime','YouTube','episódio completo','português']
  },
  {
    id:'yt-pokemon-horizontes-t2e1', type:'filme', title:'Pokémon Horizontes: A Busca por Laqua — T2E1', year:'Episódio completo', genre:'Anime / Aventura', mediaType:'serie',
    seriesId:'pokemon-horizontes-oficial', seriesTitle:'Pokémon: Horizontes', season:2, episode:1, anime:true, language:'Português', portuguese:true, colorContent:true, youtubePt:true, freeLegal:true,
    youtubeId:'dcy4Ku-mEwQ', thumb:'https://i.ytimg.com/vi/dcy4Ku-mEwQ/hqdefault.jpg', accent:'var(--gold)',
    desc:'Episódio completo publicado pelo Canal Oficial da Pokémon em Português.', sourceUrl:'https://www.youtube.com/watch?v=dcy4Ku-mEwQ', sourceLabel:'Pokémon Oficial em Português — YouTube',
    nostalgiaTags:['Pokémon','anime','YouTube','episódio completo','português']
  },
  {
    id:'yt-pokemon-horizontes-t2e2', type:'filme', title:'Pokémon Horizontes: A Busca por Laqua — T2E2', year:'Episódio completo', genre:'Anime / Aventura', mediaType:'serie',
    seriesId:'pokemon-horizontes-oficial', seriesTitle:'Pokémon: Horizontes', season:2, episode:2, anime:true, language:'Português', portuguese:true, colorContent:true, youtubePt:true, freeLegal:true,
    youtubeId:'hhc_eoDXBcY', thumb:'https://i.ytimg.com/vi/hhc_eoDXBcY/hqdefault.jpg', accent:'var(--gold)',
    desc:'Episódio completo publicado pelo Canal Oficial da Pokémon em Português.', sourceUrl:'https://www.youtube.com/watch?v=hhc_eoDXBcY', sourceLabel:'Pokémon Oficial em Português — YouTube',
    nostalgiaTags:['Pokémon','anime','YouTube','episódio completo','português']
  },
  {
    id:'yt-pokemon-geracoes-ep1', type:'filme', title:'Pokémon Gerações — Episódio 1: A Aventura', year:'2017', genre:'Anime / Aventura', mediaType:'serie',
    seriesId:'pokemon-geracoes-oficial', seriesTitle:'Pokémon Gerações', season:1, episode:1, anime:true, language:'Português do Brasil', portuguese:true, colorContent:true, youtubePt:true, freeLegal:true,
    youtubeId:'Hxe1BfAdHWI', thumb:'https://i.ytimg.com/vi/Hxe1BfAdHWI/hqdefault.jpg', accent:'var(--red)',
    desc:'Curta completo em português do Brasil publicado pelo canal oficial Pokémon.', sourceUrl:'https://www.youtube.com/watch?v=Hxe1BfAdHWI', sourceLabel:'Pokémon Oficial em Português — YouTube',
    nostalgiaTags:['Pokémon','anime','YouTube','português']
  },
  {
    id:'yt-pokemon-evolucoes-ep8', type:'filme', title:'Pokémon Evoluções — Episódio 8: A Descoberta', year:'2021', genre:'Anime / Aventura', mediaType:'serie',
    seriesId:'pokemon-evolucoes-oficial', seriesTitle:'Pokémon Evoluções', season:1, episode:8, anime:true, language:'Português', portuguese:true, colorContent:true, youtubePt:true, freeLegal:true,
    youtubeId:'zkorI6jNaEo', thumb:'https://i.ytimg.com/vi/zkorI6jNaEo/hqdefault.jpg', accent:'var(--purple)',
    desc:'Episódio completo publicado pelo canal oficial Pokémon em português.', sourceUrl:'https://www.youtube.com/watch?v=zkorI6jNaEo', sourceLabel:'Pokémon Oficial em Português — YouTube',
    nostalgiaTags:['Pokémon','anime','YouTube','português']
  },
  {
    id:'yt-heman-tio-gorpo', type:'filme', title:'He-Man — O Tio Favorito do Gorpo', year:'Episódio completo', genre:'Animação / Aventura / Fantasia', mediaType:'serie',
    seriesId:'heman-ptbr-youtube', seriesTitle:'He-Man e os Mestres do Universo', language:'Português (dublado)', portuguese:true, colorContent:true, youtubePt:true, freeLegal:true,
    youtubeId:'VRD7yAayNGo', thumb:'https://i.ytimg.com/vi/VRD7yAayNGo/hqdefault.jpg', accent:'var(--orange)',
    desc:'Episódio completo dublado publicado pelo canal verificado He-Man em Português.', sourceUrl:'https://www.youtube.com/watch?v=VRD7yAayNGo', sourceLabel:'He-Man em Português — YouTube verificado',
    classicTv:true, nostalgiaTags:['He-Man','anos 80','desenho clássico','dublado']
  },
  {
    id:'yt-shera-maior-magias', type:'filme', title:'She-Ra — A Maior das Magias', year:'Episódio completo', genre:'Animação / Aventura / Fantasia', mediaType:'serie',
    seriesId:'shera-ptbr-youtube', seriesTitle:'She-Ra: A Princesa do Poder', language:'Português (dublado)', portuguese:true, colorContent:true, youtubePt:true, freeLegal:true,
    youtubeId:'kCA1o4s5tqk', thumb:'https://i.ytimg.com/vi/kCA1o4s5tqk/hqdefault.jpg', accent:'var(--pink)',
    desc:'Episódio completo dublado publicado pelo canal verificado She-Ra: A Princesa do Poder.', sourceUrl:'https://www.youtube.com/watch?v=kCA1o4s5tqk', sourceLabel:'She-Ra em Português — YouTube verificado',
    classicTv:true, nostalgiaTags:['She-Ra','anos 80','desenho clássico','dublado']
  },
  {
    id:'yt-monica-toy-t4-completa', type:'filme', title:'Mônica Toy — 4ª Temporada Completa', year:'2016', genre:'Animação / Comédia', mediaType:'serie',
    seriesId:'monica-toy-oficial', seriesTitle:'Mônica Toy', season:4, kids:true, language:'Português (Brasil)', portuguese:true, colorContent:true, youtubePt:true, freeLegal:true,
    youtubeId:'jxM-cJiZsF8', thumb:'https://i.ytimg.com/vi/jxM-cJiZsF8/hqdefault.jpg', accent:'var(--red)',
    desc:'4ª temporada completa com 26 episódios e especial, publicada pelo canal oficial Turma da Mônica.', sourceUrl:'https://www.youtube.com/watch?v=jxM-cJiZsF8', sourceLabel:'Turma da Mônica — canal oficial verificado',
    classicTv:true, nostalgiaTags:['Turma da Mônica','Mônica Toy','Brasil','infantil','temporada completa']
  },
  {
    id:'yt-turma-monica-cine-gibi-1', type:'filme', title:'Cine Gibi 1 — O Filme', year:'2004', genre:'Animação / Comédia / Família', mediaType:'filme',
    kids:true, language:'Português (Brasil)', portuguese:true, colorContent:true, youtubePt:true, freeLegal:true,
    youtubeId:'7m-oXqZ1s3I', thumb:'https://i.ytimg.com/vi/7m-oXqZ1s3I/hqdefault.jpg', accent:'var(--red)',
    desc:'Filme completo da Turma da Mônica publicado pelo canal oficial da Mauricio de Sousa Produções.', sourceUrl:'https://www.youtube.com/watch?v=7m-oXqZ1s3I', sourceLabel:'Turma da Mônica — canal oficial verificado',
    classicTv:true, nostalgiaTags:['Turma da Mônica','Cine Gibi','filme completo','Brasil','infantil']
  },
  {
    id:'yt-netmovies-tnt', type:'filme', title:'TNT', year:'Filme completo', genre:'Ação', mediaType:'filme',
    language:'Português (dublado)', portuguese:true, colorContent:true, youtubePt:true, filmGenre:'acao', freeLegal:true,
    youtubeId:'fx55hBuG8_A', thumb:'https://i.ytimg.com/vi/fx55hBuG8_A/hqdefault.jpg', accent:'var(--red)',
    desc:'Filme de ação completo dublado publicado pelo canal verificado NetMovies.', sourceUrl:'https://www.youtube.com/watch?v=fx55hBuG8_A', sourceLabel:'NetMovies — YouTube oficial',
    nostalgiaTags:['NetMovies','ação','filme completo','dublado']
  },
  {
    id:'yt-netmovies-primeiras-historias-amor', type:'filme', title:'As Primeiras Histórias de Amor', year:'2018', genre:'Romance', mediaType:'filme',
    language:'Português (dublado)', portuguese:true, colorContent:true, youtubePt:true, filmGenre:'romance', freeLegal:true,
    youtubeId:'DGbui7iuT6c', thumb:'https://i.ytimg.com/vi/DGbui7iuT6c/hqdefault.jpg', accent:'var(--pink)',
    desc:'Filme completo de romance dublado e gratuito publicado pelo canal verificado NetMovies.', sourceUrl:'https://www.youtube.com/watch?v=DGbui7iuT6c', sourceLabel:'NetMovies — YouTube oficial',
    nostalgiaTags:['NetMovies','romance','filme completo','dublado']
  },
  {
    id:'yt-drama-sera-isso-amor-ep1', type:'filme', title:'Será Isso Amor — Episódio 1', year:'2026', genre:'Drama / Romance / Comédia romântica', mediaType:'serie',
    seriesId:'sera-isso-amor-youtube', seriesTitle:'Será Isso Amor', season:1, episode:1, dorama:true, language:'Português (dublado)', portuguese:true, colorContent:true, youtubePt:true, rightsUnclear:true,
    youtubeId:'A4mzSjSl3ks', thumb:'https://i.ytimg.com/vi/A4mzSjSl3ks/hqdefault.jpg', accent:'var(--pink)',
    desc:'Episódio completo em versão estendida e dublagem em português, publicado publicamente no canal DramaBox em Português. Direitos/licenciamento do canal não foram confirmados de forma independente.',
    sourceUrl:'https://www.youtube.com/watch?v=A4mzSjSl3ks', sourceLabel:'DramaBox em Português — publicação pública; direitos não verificados',
    nostalgiaTags:['drama','série turca','dublado','romance','YouTube']
  },
  {
    id:'yt-drama-amor-sem-limites-final', type:'filme', title:'Amor Sem Limites — 8ª Temporada / Final', year:'2026', genre:'Drama / Romance / Ação', mediaType:'serie',
    seriesId:'amor-sem-limites-youtube', seriesTitle:'Amor Sem Limites', season:8, dorama:true, language:'Português (dublado)', portuguese:true, colorContent:true, youtubePt:true, rightsUnclear:true,
    youtubeId:'wTwga8RRSLI', thumb:'https://i.ytimg.com/vi/wTwga8RRSLI/hqdefault.jpg', accent:'var(--red)',
    desc:'Compilação pública com episódios da 8ª temporada em dublagem portuguesa, publicada no canal DramaBox em Português. Direitos/licenciamento do canal não foram confirmados de forma independente.',
    sourceUrl:'https://www.youtube.com/watch?v=wTwga8RRSLI', sourceLabel:'DramaBox em Português — publicação pública; direitos não verificados',
    nostalgiaTags:['drama','série turca','dublado','romance','YouTube']
  },

  {
    id:'pica-pau-archive-ep1', type:'filme', title:'Pica-Pau — Episódio do Internet Archive', year:'Archive', genre:'Desenho / Comédia', mediaType:'serie',
    seriesId:'pica-pau-archive', seriesTitle:'Pica-Pau — Internet Archive', season:1, episode:1, language:'Português', portuguese:true, colorContent:true, rightsUnclear:true,
    archiveId:'OnovoShowoPicaPau', thumb:'https://archive.org/services/img/OnovoShowoPicaPau', accent:'var(--red)',
    desc:'Episódio de Pica-Pau em português publicado no Internet Archive. O item está público no Archive; a autorização/licenciamento não está claramente indicada nos metadados.',
    sourceUrl:'https://archive.org/details/OnovoShowoPicaPau', sourceLabel:'Internet Archive — publicação pública; direitos não verificados',
    classicTv:true, nostalgiaTags:['Pica-Pau','Internet Archive','desenho clássico','português']
  },


  // Jackie Chan — filmes completos publicados no YouTube e desenho clássico.
  // O catálogo também faz descoberta dinâmica no Internet Archive e, se configurada,
  // na YouTube Data API para ampliar os títulos anteriores a 2000.
  {
    id:'yt-jackie-adventures-t1e1', type:'filme', title:'A Mão Negra', year:'2000', genre:'Desenho / Ação / Comédia', mediaType:'serie',
    seriesId:'jackie-chan-adventures-youtube', seriesTitle:'As Aventuras de Jackie Chan', season:1, episode:1,
    language:'Português (dublado)', portuguese:true, colorContent:true, classicTv:true, kids:true, jackieChan:true, rightsUnclear:true,
    youtubeId:'pkp_rRmUYEg', thumb:'https://i.ytimg.com/vi/pkp_rRmUYEg/hqdefault.jpg', accent:'var(--gold)',
    desc:'Episódio público em português de As Aventuras de Jackie Chan. A publicação está disponível no YouTube; os direitos do upload não foram confirmados de forma independente.',
    sourceUrl:'https://www.youtube.com/watch?v=pkp_rRmUYEg', sourceLabel:'YouTube — publicação pública; direitos não verificados',
    nostalgiaTags:['Jackie Chan','desenho','anos 2000','dublado','TV']
  },
  {
    id:'yt-jackie-drunken-master-1978', type:'filme', title:'Drunken Master', year:'1978', genre:'Ação / Artes marciais / Comédia', mediaType:'filme',
    language:'Áudio conforme publicação', colorContent:true, jackieChan:true, filmGenre:'acao', freeLegal:true,
    youtubeId:'hCCpjX5v5gY', thumb:'https://i.ytimg.com/vi/hCCpjX5v5gY/hqdefault.jpg', accent:'var(--gold)',
    desc:'Longa completo de Jackie Chan (1978) disponibilizado publicamente pelo canal verificado Sony Pictures Entertainment India.',
    sourceUrl:'https://www.youtube.com/watch?v=hCCpjX5v5gY', sourceLabel:'Sony Pictures Entertainment India — YouTube verificado', nostalgiaTags:['Jackie Chan','kung fu','1978']
  },
  {
    id:'yt-jackie-winners-sinners-1983', type:'filme', title:'Winners and Sinners', year:'1983', genre:'Ação / Comédia / Artes marciais', mediaType:'filme',
    language:'Áudio conforme publicação', colorContent:true, jackieChan:true, filmGenre:'acao', freeLegal:true,
    youtubeId:'y57iuGqeSjk', thumb:'https://i.ytimg.com/vi/y57iuGqeSjk/hqdefault.jpg', accent:'var(--gold)',
    desc:'Filme completo de 1983 com Jackie Chan, publicado pelo canal verificado Shout! Studios.',
    sourceUrl:'https://www.youtube.com/watch?v=y57iuGqeSjk', sourceLabel:'Shout! Studios — YouTube verificado', nostalgiaTags:['Jackie Chan','1983','comédia','ação']
  },
  {
    id:'yt-jackie-wheels-meals-1984', type:'filme', title:'Wheels on Meals', year:'1984', genre:'Ação / Comédia / Artes marciais', mediaType:'filme',
    language:'Áudio conforme publicação', colorContent:true, jackieChan:true, filmGenre:'acao', freeLegal:true,
    youtubeId:'nPdH4s_GIvQ', thumb:'https://i.ytimg.com/vi/nPdH4s_GIvQ/hqdefault.jpg', accent:'var(--gold)',
    desc:'Filme completo de 1984 com Jackie Chan, Sammo Hung e Yuen Biao, publicado gratuitamente no YouTube.',
    sourceUrl:'https://www.youtube.com/watch?v=nPdH4s_GIvQ', sourceLabel:'YouTube — publicação pública', nostalgiaTags:['Jackie Chan','1984','Sammo Hung','ação']
  },
  {
    id:'yt-jackie-protector-1985', type:'filme', title:'The Protector', year:'1985', genre:'Ação / Policial / Artes marciais', mediaType:'filme',
    language:'Áudio conforme publicação', colorContent:true, jackieChan:true, filmGenre:'acao', freeLegal:true,
    youtubeId:'d4zAkiajuZc', thumb:'https://i.ytimg.com/vi/d4zAkiajuZc/hqdefault.jpg', accent:'var(--gold)',
    desc:'Filme completo de 1985 estrelado por Jackie Chan, publicado pelo canal verificado Shout! Studios.',
    sourceUrl:'https://www.youtube.com/watch?v=d4zAkiajuZc', sourceLabel:'Shout! Studios — YouTube verificado', nostalgiaTags:['Jackie Chan','1985','policial']
  },
  {
    id:'yt-jackie-city-hunter-1993', type:'filme', title:'City Hunter', year:'1993', genre:'Ação / Comédia / Artes marciais', mediaType:'filme',
    language:'Áudio conforme publicação', colorContent:true, jackieChan:true, filmGenre:'acao', freeLegal:true,
    youtubeId:'8SxjZ5_92zE', thumb:'https://i.ytimg.com/vi/8SxjZ5_92zE/hqdefault.jpg', accent:'var(--gold)',
    desc:'Filme completo de 1993 estrelado por Jackie Chan, publicado pelo canal verificado Shout! Studios.',
    sourceUrl:'https://www.youtube.com/watch?v=8SxjZ5_92zE', sourceLabel:'Shout! Studios — YouTube verificado', nostalgiaTags:['Jackie Chan','1993','City Hunter']
  },
  {
    id:'yt-jackie-crime-story-1993', type:'filme', title:'Crime Story', year:'1993', genre:'Ação / Policial / Drama', mediaType:'filme',
    language:'Áudio conforme publicação', colorContent:true, jackieChan:true, filmGenre:'acao', freeLegal:true,
    youtubeId:'TpEL8DTI_Hs', thumb:'https://i.ytimg.com/vi/TpEL8DTI_Hs/hqdefault.jpg', accent:'var(--gold)',
    desc:'Filme completo de 1993 estrelado por Jackie Chan, publicado pelo canal verificado Shout! Studios.',
    sourceUrl:'https://www.youtube.com/watch?v=TpEL8DTI_Hs', sourceLabel:'Shout! Studios — YouTube verificado', nostalgiaTags:['Jackie Chan','1993','policial','drama']
  },

];

// v1.0.23 — Regra do catálogo: mostrar somente o que toca dentro do JogaHub.
// O app também busca automaticamente itens PT/dublados publicados no Internet Archive. Itens sem licença clara podem aparecer; apenas sinais explícitos de upload não autorizado são filtrados.
// Entradas que servem apenas como “Onde assistir” continuam fora da interface principal.
const FILMES = FILMES_CATALOGO.filter((item) => {
  return Boolean(
    item.archiveId ||
    item.youtubeId ||
    item.youtubePlaylistId ||
    item.videoUrl ||
    item.directVideoUrl ||
    item.localVideoUrl
  );
});
