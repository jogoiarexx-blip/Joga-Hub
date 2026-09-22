/* ===================================================================
   JOGAHUB — ACERVO ÚNICO DO GOOGLE DRIVE
   Versão 1.2.46 — 2026-09-22.

   Todo o catálogo de filmes e séries vem desta pasta raiz. O
   sincronizador percorre recursivamente todas as subpastas.
   =================================================================== */
(function(){
  'use strict';
  if (typeof FILMES_CATALOGO === 'undefined') return;

  const ROOT_ID = '1FpJ__h7dTKpD-VOTl3WUIgpBBUc4vhut';
  const ROOT_URL = 'https://drive.google.com/drive/folders/' + ROOT_ID;

  // Implantação do Apps Script criada para este acervo. Pode ser trocada em
  // Configurações; o valor salvo no navegador tem prioridade sobre este.
  const SYNC_URL = 'https://script.google.com/macros/s/AKfycbxXQk9M6_VLSyspyNfTvXqGioOhmIE1vRMw6bZtV5GBx8hlrYx3Qnqr7tXmFsfKQeC1TQ/exec';

  window.JOGAHUB_DRIVE_ROOT = Object.freeze({
    id: ROOT_ID,
    name: 'Filmes e Séries',
    url: ROOT_URL
  });
  window.JOGAHUB_DRIVE_SYNC_URL = SYNC_URL;

  FILMES_CATALOGO.push({
    id:'acervo-unico-filmes-series',
    type:'filme',
    title:'Acervo de Filmes e Séries',
    year:'Acervo atualizado',
    genre:'Filmes / Séries',
    mediaType:'colecao',
    language:'Conforme cada arquivo',
    portuguese:true,
    colorContent:true,
    catalogOnly:true,
    accent:'var(--brand-blue)',
    driveFolderId:ROOT_ID,
    driveFolderUrl:ROOT_URL,
    sourceUrl:ROOT_URL,
    sourceLabel:'Google Drive — acervo principal',
    thumb:'assets/banner-cat-filmes.webp',
    desc:'Pasta principal do acervo. Filmes, séries, temporadas e episódios das subpastas são importados automaticamente pelo sincronizador.',
    nostalgiaTags:['filmes','séries','Google Drive','acervo']
  });
})();
