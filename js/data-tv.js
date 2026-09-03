const LIVE_TV_CHANNELS = [
  {
    id: 'tv-cultura',
    name: 'TV Cultura',
    category: 'TV aberta / Cultura e educação',
    embed: 'https://culturaplay.tvcultura.com.br/channels/14/embed',
    source: 'Cultura Play — transmissão oficial',
    site: 'https://culturaplay.tvcultura.com.br/channels/14-01-tv-cultura-ao-vivo'
  },
  {
    id: 'sbt-ao-vivo',
    name: 'SBT',
    category: 'TV aberta / Entretenimento',
    embed: 'https://www.youtube.com/embed/Y-M5QKKCmdA?autoplay=0&rel=0',
    source: 'SBT — transmissão oficial',
    site: 'https://www.sbt.com.br/ao-vivo?video=Y-M5QKKCmdA'
  },
  {
    id: 'record-news',
    name: 'Record News',
    category: 'Notícias / sinal oficial 24h',
    embed: 'https://www.youtube.com/embed/saz29dZJR04?autoplay=0&rel=0',
    source: 'Record News — canal oficial',
    site: 'https://www.youtube.com/watch?v=saz29dZJR04'
  }

  ,{
    id: 'getv-oficial',
    name: 'ge tv',
    category: 'Esportes / eventos e transmissões',
    embed: 'https://www.youtube.com/embed/WUeYit6Yxpk?autoplay=0&rel=0',
    youtubeLive: { seedVideoId: 'WUeYit6Yxpk', autoDetect: true },
    source: 'ge tv — canal oficial verificado',
    site: 'https://www.youtube.com/@getv'
  },
  {
    id: 'cazetv-oficial',
    name: 'CazéTV',
    category: 'Esportes / eventos e transmissões',
    embed: 'https://www.youtube.com/embed/LdRzppe58RY?autoplay=0&rel=0',
    youtubeLive: { seedVideoId: 'LdRzppe58RY', autoDetect: true },
    source: 'CazéTV — canal oficial verificado',
    site: 'https://www.youtube.com/@CazeTV'
  }
];
