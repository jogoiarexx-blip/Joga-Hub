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
  // Seleção de filmes recentes: links oficiais, sem hospedar arquivos das plataformas.
  // Notas IMDb verificadas em 24/09/2026; disponibilidade e notas podem mudar.
  {id:'stream-coda-2021',type:'filme',title:'CODA: No Ritmo do Coração',year:'2021',genre:'Drama / Música',filmGenre:'drama',mediaType:'filme',language:'Áudio e legendas em português (Brasil)',portuguese:true,colorContent:true,catalogOnly:true,streamingPick:true,imdbRating:8.0,accent:'#287da7',thumb:'assets/filme-coda.svg',desc:'Uma jovem ouvinte de uma família surda descobre a própria voz. Assista na Apple TV mediante assinatura.',sourceUrl:'https://tv.apple.com/br/movie/coda/umc.cmc.3hqkbis4othcpslua41ljnjqu',sourceLabel:'Apple TV',availabilityStatus:'Apple TV — assinatura',nostalgiaTags:['recente','premiado','música','Apple TV']},
  {id:'stream-sociedade-neve-2024',type:'filme',title:'A Sociedade da Neve',year:'2024',genre:'Drama / Sobrevivência',filmGenre:'drama',mediaType:'filme',language:'Áudio e legendas em português',portuguese:true,colorContent:true,catalogOnly:true,streamingPick:true,imdbRating:7.8,accent:'#5490a4',thumb:'assets/filme-sociedade-neve.svg',desc:'Sobreviventes de um acidente aéreo enfrentam os Andes. Assista na Netflix mediante assinatura.',sourceUrl:'https://www.netflix.com/br/title/81268316',sourceLabel:'Netflix',availabilityStatus:'Netflix — assinatura',nostalgiaTags:['recente','sobrevivência','Netflix']},
  {id:'stream-nada-novo-front-2022',type:'filme',title:'Nada de Novo no Front',year:'2022',genre:'Guerra / Drama',filmGenre:'drama',mediaType:'filme',language:'Áudio e legendas em português',portuguese:true,colorContent:true,catalogOnly:true,streamingPick:true,imdbRating:7.8,accent:'#756d5b',thumb:'assets/filme-nada-novo-front.svg',desc:'Um jovem soldado conhece a realidade brutal da Primeira Guerra. Assista na Netflix mediante assinatura.',sourceUrl:'https://www.netflix.com/br/title/81260280',sourceLabel:'Netflix',availabilityStatus:'Netflix — assinatura',nostalgiaTags:['recente','premiado','guerra','Netflix']},
  {id:'stream-pinoquio-del-toro-2022',type:'filme',title:'Pinóquio por Guillermo del Toro',year:'2022',genre:'Animação / Fantasia',filmGenre:'animacao',mediaType:'filme',language:'Áudio e legendas em português',portuguese:true,colorContent:true,catalogOnly:true,streamingPick:true,imdbRating:7.6,accent:'#ad7042',thumb:'assets/filme-pinoquio.svg',desc:'Uma releitura em animação stop motion do boneco de madeira. Assista na Netflix mediante assinatura.',sourceUrl:'https://www.netflix.com/br/title/80218455',sourceLabel:'Netflix',availabilityStatus:'Netflix — assinatura',nostalgiaTags:['recente','animação','premiado','Netflix']},
  {id:'stream-nimona-2023',type:'filme',title:'Nimona',year:'2023',genre:'Animação / Aventura',filmGenre:'animacao',mediaType:'filme',language:'Áudio e legendas em português',portuguese:true,colorContent:true,catalogOnly:true,streamingPick:true,imdbRating:7.5,accent:'#ad4c8e',thumb:'assets/filme-nimona.svg',desc:'Um cavaleiro acusado injustamente ganha a ajuda de uma adolescente mutante. Assista na Netflix mediante assinatura.',sourceUrl:'https://www.netflix.com/br/title/81444554',sourceLabel:'Netflix',availabilityStatus:'Netflix — assinatura',nostalgiaTags:['recente','animação','Netflix']},
  {id:'stream-assassinos-lua-2023',type:'filme',title:'Assassinos da Lua das Flores',year:'2023',genre:'Policial / Drama',filmGenre:'drama',mediaType:'filme',language:'Áudio e legendas em português (Brasil)',portuguese:true,colorContent:true,catalogOnly:true,streamingPick:true,imdbRating:7.5,accent:'#8b5945',thumb:'assets/filme-assassinos-lua.svg',desc:'Uma investigação dos assassinatos de integrantes da nação Osage. Assista na Apple TV mediante assinatura.',sourceUrl:'https://tv.apple.com/br/movie/assassinos-da-lua-das-flores/umc.cmc.5x1fg9vferlfeutzpq6rra1zf',sourceLabel:'Apple TV',availabilityStatus:'Apple TV — assinatura',nostalgiaTags:['recente','policial','Apple TV']},
  {id:'stream-glass-onion-2022',type:'filme',title:'Glass Onion: Um Mistério Knives Out',year:'2022',genre:'Mistério / Comédia',filmGenre:'comedia',mediaType:'filme',language:'Áudio e legendas em português',portuguese:true,colorContent:true,catalogOnly:true,streamingPick:true,imdbRating:7.1,accent:'#9b784d',thumb:'assets/filme-glass-onion.svg',desc:'O detetive Benoit Blanc investiga um novo mistério em uma ilha. Assista na Netflix mediante assinatura.',sourceUrl:'https://www.netflix.com/br/title/81458416',sourceLabel:'Netflix',availabilityStatus:'Netflix — assinatura',nostalgiaTags:['recente','mistério','Netflix']}
];

// FILMES é a referência consumida pelo app e pelo player. Como aponta para o
// mesmo array, extensões carregadas depois (ex.: data-drive-filmes.js) entram
// automaticamente no catálogo sem precisar recriar a lista.
const FILMES = FILMES_CATALOGO;
