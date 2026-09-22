/* ===================================================================
   JOGAHUB — ACERVOS DO GOOGLE DRIVE
   Atualizado em 2026-09-21.

   Os IDs abaixo vêm das pastas compartilhadas informadas pelo usuário.
   Filmes usam o player do JogaHub + fallback para o preview do Drive.
   Séries usam seriesId/season/episode para agrupar e navegar episódios.
   =================================================================== */
(function(){
  if (typeof FILMES_CATALOGO === 'undefined') return;

  const ROOT_FILMES_SERIES = 'https://drive.google.com/drive/folders/1FpJ__h7dTKpD-VOTl3WUIgpBBUc4vhut';
  const ROOT_DC = 'https://drive.google.com/drive/folders/1F2_t5aERWvGfOL_4VxWMgEDiwoBbZRc1';
  const ROOT_CAVALEIRO = 'https://drive.google.com/drive/folders/1NCDe9l_-S_XAd8LYIxoarKqdkHJu8sse';
  const ROOT_NOVO_1 = 'https://drive.google.com/drive/folders/1QmY3xIAk4AWVgRzcaTzAuKPdVrL9k6H_';
  const ROOT_NOVO_2 = 'https://drive.google.com/drive/folders/1XiSyDV7cLNMaLDjbCdeR-VCP_KWK9C3W';

  const BREAKING_BAD_FOLDER_ID = '1FpJ__h7dTKpD-VOTl3WUIgpBBUc4vhut';
  const BREAKING_BAD_FOLDER_URL = 'https://drive.google.com/drive/folders/' + BREAKING_BAD_FOLDER_ID;

  // Coleção raiz para o acervo de Breaking Bad. Os episódios reais continuam
  // sendo importados pelo sincronizador quando o endpoint do Apps Script estiver configurado.
  FILMES_CATALOGO.push({
    id:'breaking-bad-drive', type:'filme', title:'Breaking Bad', year:'Acervo Google Drive',
    genre:'Série • Google Drive', mediaType:'serie', language:'Conforme o arquivo',
    portuguese:true, colorContent:true, catalogOnly:true, accent:'var(--brand-blue)',
    thumb:'assets/banner-cat-series.webp', seriesId:'breaking-bad', seriesTitle:'Breaking Bad',
    driveFolderId:BREAKING_BAD_FOLDER_ID, driveFolderUrl:BREAKING_BAD_FOLDER_URL,
    sourceUrl:BREAKING_BAD_FOLDER_URL, sourceLabel:'Google Drive — Breaking Bad',
    desc:'Breaking Bad — temporadas disponíveis no acervo do Google Drive. Os episódios são agrupados automaticamente quando a sincronização do Drive estiver conectada.',
    nostalgiaTags:['Breaking Bad','série','Google Drive','temporadas']
  });

  const driveItem = ({id,title,fileId,year='',genre='Filme • Google Drive',language='Conforme o arquivo',mediaType='filme',seriesId='',seriesTitle='',season=0,episode=0,size=0,mime='video/mp4',sourceRoot=ROOT_FILMES_SERIES,desc='',portuguese=true,thumb=''}) => ({
    id,
    type:'filme',
    title,
    year,
    genre,
    mediaType,
    language,
    portuguese,
    colorContent:true,
    accent:'var(--brand-blue)',
    thumb: thumb || (mediaType === 'serie' ? 'assets/banner-cat-series.webp' : (sourceRoot === ROOT_DC ? 'assets/archive-classicos.svg' : 'assets/banner-cat-filmes.webp')),
    ...(seriesId ? {seriesId,seriesTitle,season,episode} : {}),
    driveFileId:fileId,
    driveFileSize:Number(size)||0,
    driveMime:mime,
    ...(mime === 'video/matroska' ? {drivePlaybackMode:'compat'} : {}),
    sourceUrl:`https://drive.google.com/file/d/${fileId}/view?usp=sharing`,
    sourceLabel:'Google Drive',
    sourceCollection:sourceRoot,
    url:`https://drive.google.com/file/d/${fileId}/view?usp=sharing`,
    embed:false,
    desc:desc || 'Conteúdo do acervo compartilhado no Google Drive, integrado ao player do JogaHub.',
    nostalgiaTags:['Google Drive', mediaType === 'serie' ? 'série' : 'filme']
  });

  FILMES_CATALOGO.push(
    {
      id:'colecao-drive-1qmy3x-2026',
      type:'filme',
      title:'Acervo Drive — Nova Pasta 1',
      year:'Acervo compartilhado',
      genre:'Filmes / Séries / Animações',
      mediaType:'colecao',
      language:'Conforme cada arquivo',
      portuguese:true,
      colorContent:true,
      catalogOnly:true,
      accent:'var(--brand-blue)',
      driveFolderId:'1QmY3xIAk4AWVgRzcaTzAuKPdVrL9k6H_',
      driveFolderUrl:ROOT_NOVO_1,
      sourceUrl:ROOT_NOVO_1,
      sourceLabel:'Google Drive — novo acervo',
      thumb:'assets/banner-cat-filmes.webp',
      desc:'Nova pasta do Google Drive adicionada ao catálogo do JogaHub.',
      nostalgiaTags:['filmes','séries','animações','Google Drive']
    },
    {
      id:'colecao-drive-1xisydv-2026',
      type:'filme',
      title:'Acervo Drive — Nova Pasta 2',
      year:'Acervo compartilhado',
      genre:'Filmes / Séries / Animações',
      mediaType:'colecao',
      language:'Conforme cada arquivo',
      portuguese:true,
      colorContent:true,
      catalogOnly:true,
      accent:'var(--brand-blue)',
      driveFolderId:'1XiSyDV7cLNMaLDjbCdeR-VCP_KWK9C3W',
      driveFolderUrl:ROOT_NOVO_2,
      sourceUrl:ROOT_NOVO_2,
      sourceLabel:'Google Drive — novo acervo',
      thumb:'assets/banner-cat-filmes.webp',
      desc:'Nova pasta do Google Drive adicionada ao catálogo do JogaHub.',
      nostalgiaTags:['filmes','séries','animações','Google Drive']
    },

        {
      id:'colecao-drive-filmes-series-2026',
      type:'filme',
      title:'Acervo Drive — Filmes e Séries',
      year:'Acervo atualizado',
      genre:'Filmes / Séries',
      mediaType:'colecao',
      language:'Conforme cada arquivo',
      portuguese:true,
      colorContent:true,
      catalogOnly:true,
      accent:'var(--brand-blue)',
      driveFolderId:'1FpJ__h7dTKpD-VOTl3WUIgpBBUc4vhut',
      driveFolderUrl:ROOT_FILMES_SERIES,
      sourceUrl:ROOT_FILMES_SERIES,
      sourceLabel:'Google Drive — acervo de filmes e séries',
      thumb:'assets/banner-cat-filmes.webp',
      desc:'Pasta principal do novo acervo de filmes e séries integrado ao JogaHub.',
      nostalgiaTags:['filmes','séries','Google Drive','acervo']
    },

    driveItem({
      id:'drive-resident-evil-2026',
      title:'Resident Evil (2026)',
      fileId:'1R0hcqxHOvkuWLKiYDsQMtV4d3WWERYCh',
      year:'2026',
      genre:'Filme • Google Drive',
      language:'Inglês',
      portuguese:false,
      size:2795409849,
      mime:'video/matroska',
      desc:'Arquivo MKV do acervo do Google Drive. O JogaHub usa o modo compatibilidade do Drive para ampliar a chance de reprodução no navegador.'
    }),
    driveItem({
      id:'drive-tubarao-de-guerra-2025',
      title:'Tubarão de Guerra',
      fileId:'1n5o1h9ySLJ9hSzy_8Qrk_53vF94bZGbt',
      year:'2025',
      genre:'Filme • Google Drive',
      language:'Dual 2.0',
      size:1816132698
    }),

    driveItem({id:'drive-cavaleiro-sete-reinos-s01e01',title:'Episódio 1',fileId:'1QhKqAI1ogD3tXatee3AXvQ1X_i6QwohR',genre:'Série • Google Drive',language:'Dual 5.1',mediaType:'serie',seriesId:'o-cavaleiro-dos-sete-reinos-drive',seriesTitle:'O Cavaleiro dos Sete Reinos',season:1,episode:1,size:353036562,sourceRoot:ROOT_CAVALEIRO,thumb:'assets/banner-cat-series.webp'}),
    driveItem({id:'drive-cavaleiro-sete-reinos-s01e02',title:'Episódio 2',fileId:'1G1KEE6RPFXemZXlHwKV4krA99Eyf__h6',genre:'Série • Google Drive',language:'Dual 5.1',mediaType:'serie',seriesId:'o-cavaleiro-dos-sete-reinos-drive',seriesTitle:'O Cavaleiro dos Sete Reinos',season:1,episode:2,size:298408116,sourceRoot:ROOT_CAVALEIRO,thumb:'assets/banner-cat-series.webp'}),
    driveItem({id:'drive-cavaleiro-sete-reinos-s01e03',title:'Episódio 3',fileId:'1V6XZr45YQH0LNjiNM5xUHLNq3WE-jEpc',genre:'Série • Google Drive',language:'Dual 5.1',mediaType:'serie',seriesId:'o-cavaleiro-dos-sete-reinos-drive',seriesTitle:'O Cavaleiro dos Sete Reinos',season:1,episode:3,size:280071848,sourceRoot:ROOT_CAVALEIRO,thumb:'assets/banner-cat-series.webp'}),
    driveItem({id:'drive-cavaleiro-sete-reinos-s01e04',title:'Episódio 4',fileId:'1qsLSx3OnGgaf8jucdCB99GB7lrn-UZRf',genre:'Série • Google Drive',language:'Dual 5.1',mediaType:'serie',seriesId:'o-cavaleiro-dos-sete-reinos-drive',seriesTitle:'O Cavaleiro dos Sete Reinos',season:1,episode:4,size:181115907,sourceRoot:ROOT_CAVALEIRO,thumb:'assets/banner-cat-series.webp'}),

    driveItem({id:'drive-dc-batman-longo-dia-bruxas',title:'Batman — O Longo Dia das Bruxas',fileId:'1tR-BMvrbocydMGRShVO6N7cxBFmLk-eC',genre:'Animação / Super-heróis',language:'Português',size:449750759,sourceRoot:ROOT_DC}),
    driveItem({id:'drive-dc-exterminador-cavaleiros-dragoes',title:'Exterminador — Cavaleiros e Dragões',fileId:'1bSTWMFrqTshsl9hqhRpncJQjHrLJosHs',genre:'Animação / Super-heróis',language:'Dublado',size:459447648,sourceRoot:ROOT_DC}),
    driveItem({id:'drive-dc-lanterna-verde-cavaleiros-esmeralda',title:'Lanterna Verde — Cavaleiros Esmeralda',fileId:'1gl2EKWMSg5LTkCLaWg6VzlbEEddZ48bT',genre:'Animação / Super-heróis',language:'Dublado',size:298340691,sourceRoot:ROOT_DC}),
    driveItem({id:'drive-dc-superman-batman-apocalipse',title:'Superman/Batman — Apocalipse',fileId:'1KciO6FM5_BSJs959nio1fBxXFR_Ij1eU',genre:'Animação / Super-heróis',language:'Dublado',size:265320558,sourceRoot:ROOT_DC}),
    driveItem({id:'drive-dc-grandes-astros-superman',title:'Grandes Astros — Superman',fileId:'1JYG2V6zNekkebdJh1jTKPQ2mVuXlRo9I',genre:'Animação / Super-heróis',language:'Dublado',size:228206458,sourceRoot:ROOT_DC}),
    driveItem({id:'drive-dc-superman-shazam-adao-negro',title:'Superman/Shazam! — O Retorno do Adão Negro',fileId:'1F231MqirsJW2mopQCx5cy81cc4OFR_Ye',year:'2020',genre:'Animação / Super-heróis',language:'Dublado',size:209803736,sourceRoot:ROOT_DC}),
    driveItem({id:'drive-dc-superman-foice-martelo',title:'Superman — Entre a Foice e o Martelo',fileId:'1KmxNhWVZXx1bft1GQpSqq3NUWuX44i_D',genre:'Animação / Super-heróis',language:'Dublado',size:443515253,sourceRoot:ROOT_DC}),
    driveItem({id:'drive-dc-batman-vs-dracula',title:'Batman vs. Drácula',fileId:'1KiUnvtK7QDEMadM-jUGepRwka2XxX7pp',genre:'Animação / Super-heróis',language:'Dublado',size:440678203,sourceRoot:ROOT_DC}),
    driveItem({id:'drive-dc-lanterna-verde-primeiro-voo',title:'Lanterna Verde — Primeiro Voo',fileId:'1Kkp82wzcjjtfxlYN6OE8w2a9KgrOPTy_',genre:'Animação / Super-heróis',language:'Dublado',size:408258069,sourceRoot:ROOT_DC}),
    driveItem({id:'drive-dc-superman-sem-limites',title:'Superman — Sem Limites',fileId:'1KwVtBPz9k9GeeZFDbpxJG3uoP01oO_M8',genre:'Animação / Super-heróis',language:'Dublado',size:395546966,sourceRoot:ROOT_DC}),
    driveItem({id:'drive-dc-superman-homem-amanha',title:'Superman — O Homem do Amanhã',fileId:'1JRo1i4fOROE43i6OPVgLW2p3gtIfzpkx',genre:'Animação / Super-heróis',language:'Dublado',size:454327491,sourceRoot:ROOT_DC}),
    driveItem({id:'drive-dc-liga-justica-deuses-monstros',title:'Liga da Justiça — Deuses e Monstros',fileId:'1JRIYlNjw7L-I1YvFyoJJG2sGV-qTP_dW',genre:'Animação / Super-heróis',language:'Dublado',size:397665170,sourceRoot:ROOT_DC}),
    driveItem({id:'drive-dc-superman-contra-elite',title:'Superman Contra a Elite',fileId:'1jWtPYDcizZ0nLC_cQOFW3AmHBCcz9MAI',genre:'Animação / Super-heróis',language:'Dublado',size:391037008,sourceRoot:ROOT_DC}),
    driveItem({id:'drive-dc-liga-sombria-apokolips',title:'Liga da Justiça Sombria — Guerra de Apokolips',fileId:'1OOVd-ZsC6cGQdHbLtzj4mUCr3AozZ_B3',genre:'Animação / Super-heróis',language:'Dublado',size:197176513,sourceRoot:ROOT_DC}),
    driveItem({id:'drive-dc-mulher-maravilha-linhagem',title:'Mulher-Maravilha — Linhagem de Sangue',fileId:'1PP1zM6eLfwD0LopynOxRV12SV2xYbJhu',genre:'Animação / Super-heróis',language:'Dublado',size:436405390,sourceRoot:ROOT_DC}),
    driveItem({id:'drive-dc-batman-silencio',title:'Batman — Silêncio',fileId:'12-i52Lu4_pwbGVZvutFS97lXRRXvF1Z4',genre:'Animação / Super-heróis',language:'Dublado',size:431638224,sourceRoot:ROOT_DC}),
    driveItem({id:'drive-dc-reino-superman',title:'O Reino do Superman',fileId:'1alX6JssVGcI6Yyst34nxm9cQ8wB-y5Uj',genre:'Animação / Super-heróis',language:'Português',size:458733720,sourceRoot:ROOT_DC}),
    driveItem({id:'drive-dc-constantine-cidade-demonios',title:'Constantine — Cidade de Demônios',fileId:'1Htww6b-89_fXLxzvUPZNl8jtWZIYcqDK',genre:'Animação / Super-heróis',language:'Dublado',size:277433037,sourceRoot:ROOT_DC}),
    driveItem({id:'drive-dc-morte-superman-2018',title:'A Morte do Superman',fileId:'1HR5wMCQEnM3RKdN7hW2URtGWnVy77w2p',year:'2018',genre:'Animação / Super-heróis',language:'Dublado',size:425669081,sourceRoot:ROOT_DC}),
    driveItem({id:'drive-dc-esquadrao-suicida',title:'Esquadrão Suicida',fileId:'1QNTUtA0SkZuDUp-NWecfZIGr6dR21c2R',genre:'Animação / Super-heróis',language:'Português',size:240259292,sourceRoot:ROOT_DC}),
    driveItem({id:'drive-dc-jovens-titas-contrato-judas',title:'Jovens Titãs — O Contrato de Judas',fileId:'1DySm_kWbmuQBb2IuAa16PFUghXwU5CxJ',genre:'Animação / Super-heróis',language:'Dublado',size:442903817,sourceRoot:ROOT_DC}),
    driveItem({id:'drive-dc-liga-justica-sombria',title:'Liga da Justiça Sombria',fileId:'1eytcyy1J-RfNGuOkoUFk6YM4QbFpCT0t',genre:'Animação / Super-heróis',language:'Dublado',size:399035623,sourceRoot:ROOT_DC}),
    driveItem({id:'drive-dc-liga-vs-novos-titas',title:'Liga da Justiça vs. Novos Titãs',fileId:'1KmhBusTnJoVs-f-bbaTqVEuwNBYd6i21',genre:'Animação / Super-heróis',language:'Dublado',size:416505804,sourceRoot:ROOT_DC}),
    driveItem({id:'drive-dc-batman-sangue-ruim',title:'Batman — Sangue Ruim',fileId:'1Um4y1-MAkN-oGwtHxMaxlWVVOlst8jUh',genre:'Animação / Super-heróis',language:'Português',size:382458973,sourceRoot:ROOT_DC}),
    driveItem({id:'drive-dc-batman-vs-robin',title:'Batman vs. Robin',fileId:'1abFXTgpwmyNNyHJwm3H6P0Q7blqKzQK2',genre:'Animação / Super-heróis',language:'Dublado',size:421121282,sourceRoot:ROOT_DC}),
    driveItem({id:'drive-dc-trono-atlantida',title:'Liga da Justiça — O Trono de Atlântida',fileId:'1G4kMbjyr9bqN_BTk7wWXj3qZPWvKOb-F',genre:'Animação / Super-heróis',language:'Dublado',size:380338610,sourceRoot:ROOT_DC}),
    driveItem({id:'drive-dc-filho-batman',title:'O Filho do Batman',fileId:'1ixqI5qhzxMNYmuC652GqLL_oSVNcrW2Y',genre:'Animação / Super-heróis',language:'Dublado',size:390094989,sourceRoot:ROOT_DC}),
    driveItem({id:'drive-dc-liga-justica-guerra',title:'Liga da Justiça — Guerra',fileId:'1FC06U7m2gPu6aM1R0jI8_BdFAANyQOFO',genre:'Animação / Super-heróis',language:'Dublado',size:416226238,sourceRoot:ROOT_DC}),
    driveItem({id:'drive-dc-ponto-ignicao',title:'Liga da Justiça — Ponto de Ignição',fileId:'1ZV5UMvMxaTyAlzz-HkmS4fLmh3LfDSKw',genre:'Animação / Super-heróis',language:'Dublado',size:313040784,sourceRoot:ROOT_DC})
  );
})();
