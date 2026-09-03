/* ===================================================================
   JOGAHUB — CATÁLOGO DE FILMES, DESENHOS E SÉRIES CLÁSSICAS

   Conteúdos online podem usar o Internet Archive ou players oficiais
   incorporáveis, como YouTube. Antes de cadastrar outro título, confirme
   se a fonte permite incorporação/exibição.

   Para séries/desenhos use também:
   mediaType: 'serie', seriesId, seriesTitle, season e episode.
   Para longa-metragem use mediaType: 'filme'.
   =================================================================== */

const FILMES = [

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
    id: 'serie-pica-pau-oficial',
    type: 'filme',
    title: 'Pica-Pau — Episódios Completos',
    year: 'Oficial',
    genre: 'Desenho',
    mediaType: 'serie',
    seriesId: 'pica-pau-oficial',
    seriesTitle: 'Pica-Pau',
    season: 0,
    accent: 'var(--gold)',
    thumb: 'https://i.ytimg.com/vi/kI6Sonj01QE/hqdefault.jpg',
    desc: 'Coleção oficial em português do canal Pica-Pau em Português. A playlist é carregada diretamente do YouTube e acompanha os episódios publicados pelo canal.',
    youtubePlaylistId: 'PLnKM4dFgKAoaEcokWCSbk9qYkLHM_dbR_',
    youtubePreviewId: 'kI6Sonj01QE',
    sourceUrl: 'https://www.youtube.com/playlist?list=PLnKM4dFgKAoaEcokWCSbk9qYkLHM_dbR_',
    sourceLabel: 'YouTube oficial',
    classicTv: true,
    nostalgiaTags: ['desenho clássico', 'TV', 'família']
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


];
