/* ===================================================================
   JOGAHUB — conteúdos por LINK

   Use este arquivo quando quiser adicionar jogos que
   já estão hospedados em outro lugar. Assim você não precisa enviar
   todos os arquivos para o repositório principal do JogaHub.

   CAMPOS IMPORTANTES:
   - id: identificador único, sem espaços
   - type: 'jogo'
   - title: nome exibido no card
   - genre: gênero exibido no card
   - category: categoria de jogos (arcade, acao, corrida, estrategia,
     survival, cartas, rpg, simulação, plataforma, shoot-em-up, outros)
   - url: link HTTPS onde o conteúdo está hospedado
   - thumb: pode ser caminho local OU URL HTTPS de uma capa
   - embed: true tenta abrir dentro do player do JogaHub; false abre
     diretamente em uma nova aba. Alguns sites bloqueiam iframe.
   - installable: true mostra o botão de instalação do jogo.

   EXEMPLO:
   {
     id: 'meu-jogo-online',
     type: 'jogo',
     title: 'Meu Jogo Online',
     genre: 'arcade',
     category: 'arcade',
     accent: 'var(--fire)',
     thumb: 'https://meusite.com/capa.webp',
     desc: 'Jogo hospedado fora do JogaHub.',
     url: 'https://SEU-USUARIO.github.io/SEU-REPOSITORIO/',
     embed: true
   }
   =================================================================== */

const LINK_ITEMS = [
  {
    id: 'trilha-da-floresta',
    type: 'jogo',
    title: 'Trilha da Floresta',
    genre: 'Plataforma / Aventura',
    category: 'plataforma',
    accent: 'var(--brand-green)',
    thumb: 'assets/thumb-trilha-da-floresta.webp',
    hero: 'assets/hero-trilha-da-floresta.webp',
    desc: 'Trilha da Floresta — aventura de plataforma 2.5D em uma floresta cheia de desafios, exploração e segredos.',
    url: 'https://jogoiarexx-blip.github.io/Trilha-da-floresta/',
    installable: true,
    embed: false
  },
  {
    id: 'pixel-frontier',
    type: 'jogo',
    title: 'Pixel Frontier',
    genre: 'Ação / Run & Gun',
    category: 'acao',
    accent: 'var(--brand-orange)',
    thumb: 'assets/thumb-pixel-frontier.webp',
    hero: 'assets/hero-pixel-frontier.webp',
    desc: 'Pixel Frontier — ação arcade em estilo run & gun, com fases intensas, combate rápido e visual retrô.',
    url: 'https://jogoiarexx-blip.github.io/pixel-frontier/',
    installable: true,
    embed: false
  },
  {
    id: 'kart-racer',
    type: 'jogo',
    title: 'Kart Racer',
    genre: 'Corrida / Arcade',
    category: 'corrida',
    accent: 'var(--brand-cyan)',
    thumb: 'assets/thumb-kart-racer.webp',
    hero: 'assets/hero-kart-racer.webp',
    desc: 'Kart Racer — corrida arcade em pseudo-3D Mode 7 com cinco pistas, drift, turbo, itens e diferentes níveis gráficos.',
    url: 'https://jogoiarexx-blip.github.io/Kart-racer/',
    installable: true,
    embed: false
  },
  {
    id: 'bomber-blast',
    type: 'jogo',
    title: 'Bomber Blast',
    genre: 'Arcade / Ação',
    category: 'arcade',
    accent: 'var(--brand-cyan)',
    thumb: 'assets/thumb-bomber-blast.webp',
    hero: 'assets/hero-bomber-blast.webp',
    desc: 'Bomber Blast — labirinto arcade com 20 fases, quatro mundos, inimigos com comportamentos próprios, power-ups clássicos, chefes e modo Battle.',
    url: 'https://jogoiarexx-blip.github.io/Bomber-Blast/',
    installable: true,
    embed: false
  },
  {
    id: 'rampage',
    type: 'jogo',
    title: 'Rampage',
    genre: 'Ação / Arcade',
    category: 'acao',
    accent: 'var(--brand-orange)',
    thumb: 'assets/thumb-rampage.webp',
    hero: 'assets/hero-rampage.webp',
    desc: 'Rampage: Monster Destruction — destrua a cidade, enfrente inimigos, evolua o monstro e cause o máximo de destruição.',
    url: 'https://jogoiarexx-blip.github.io/Rampage/',
    installable: true,
    embed: false
  },
  {
    id: 'as-aventuras-de-joao-e-crist',
    type: 'jogo',
    title: 'As Aventuras de João e Crist',
    genre: 'Ação / Aventura',
    category: 'acao',
    accent: 'var(--brand-orange)',
    thumb: 'assets/thumb-joao-crist.webp',
    hero: 'assets/hero-joao-crist.webp',
    desc: 'As Aventuras de João e Crist — jogo hospedado externamente no GitHub Pages.',
    url: 'https://jogoiarexx-blip.github.io/As-aventuras-de-Jo-o-e-Crist/',
    installable: true,
    embed: false
  },
  {
    id: 'zeco-lendas-da-ilha',
    type: 'jogo',
    title: 'Zeco — Lendas da Ilha',
    genre: 'Plataforma / Aventura',
    category: 'plataforma',
    accent: 'var(--brand-blue)',
    thumb: 'assets/thumb-zeco-lendas-da-ilha.webp',
    hero: 'assets/hero-zeco-lendas-da-ilha.webp',
    desc: 'Zeco — Lendas da Ilha, hospedado externamente no GitHub Pages.',
    url: 'https://jogoiarexx-blip.github.io/Zeco-Lendas-da-Ilha/',
    installable: true,
    embed: false
  },
  {
    id: 'crash-fan-game',
    type: 'jogo',
    title: 'Crash Bandicoot Fan Game',
    genre: 'Plataforma / Aventura',
    category: 'plataforma',
    accent: 'var(--brand-orange)',
    thumb: 'assets/thumb-crash-fan-game.webp',
    hero: 'assets/hero-crash-fan-game.webp',
    desc: 'Crash Bandicoot Fan Game — jogo hospedado externamente no GitHub Pages.',
    url: 'https://jogoiarexx-blip.github.io/Crash-Fan-game/',
    installable: true,
    embed: false
  },
  {
    id: 'ruptura',
    type: 'jogo',
    title: 'Ruptura',
    genre: 'RPG / Ação',
    category: 'rpg',
    accent: 'var(--brand-purple)',
    thumb: 'assets/thumb-ruptura.webp',
    hero: 'assets/hero-ruptura.webp',
    desc: 'Ruptura — jogo hospedado externamente no GitHub Pages.',
    url: 'https://jogoiarexx-blip.github.io/Ruptura/',
    embed: false
  },
  {
    id: 'forbidden-duel-memories',
    type: 'jogo',
    title: 'Forbidden Duel Memories',
    genre: 'Cartas / Estratégia',
    category: 'cartas',
    accent: 'var(--brand-purple)',
    thumb: 'assets/thumb-forbidden-duel-memories.webp',
    hero: 'assets/hero-forbidden-duel-memories.webp',
    desc: 'Forbidden Duel Memories — Ancient Card Battle. Monte seu deck, faça fusões, enfrente duelistas e entre em batalhas de cartas com temática egípcia.',
    url: 'https://jogoiarexx-blip.github.io/Forbiden-memories/',
    installable: true,
    embed: false
  },
  {
    id: 'noite-amaldicoada',
    type: 'jogo',
    title: 'Noite Amaldiçoada',
    genre: 'Survival / Roguelite',
    category: 'survival',
    accent: 'var(--brand-purple)',
    thumb: 'assets/thumb-noite-amaldicoada.webp',
    hero: 'assets/hero-noite-amaldicoada.webp',
    desc: 'Noite Amaldiçoada — roguelite de sobrevivência no Castelo das Seis Noites. Sobreviva às seis noites, evolua suas armas, encontre Fragmentos Eternos e destrua os senhores da maldição.',
    url: 'https://jogoiarexx-blip.github.io/noite-amaldi-oada/',
    installable: true,
    embed: false
  },
  {
    id: 'navinha-arcade',
    type: 'jogo',
    title: 'Navinha Arcade',
    genre: "Shoot 'em up / Arcade",
    category: 'shoot-em-up',
    accent: 'var(--brand-cyan)',
    thumb: 'assets/thumb-navinha-arcade.webp',
    hero: 'assets/hero-navinha-arcade.webp',
    desc: 'Navinha Arcade — ação espacial com 10 fases, chefes multiestágio, resgates, estrelas e power-ups especiais.',
    url: 'https://jogoiarexx-blip.github.io/navinha-arcade/',
    installable: true,
    embed: false
  },
  {
    id: 'snes-nova',
    type: 'emulador',
    title: 'SNES Nova',
    genre: 'Super Nintendo / Emulação',
    category: 'emulador',
    accent: 'var(--brand-blue)',
    desc: 'SNES Nova v0.6.0 — emulador moderno de Super Nintendo com seleção inteligente entre Snes9x e bsnes, biblioteca integrada, save/load state, gamepad e perfis gráficos.',
    url: 'https://jogoiarexx-blip.github.io/Snes-Nova/',
    installable: true,
    embed: false
  },
  {
    id: 'neo-nes',
    type: 'emulador',
    title: 'Neo NES',
    genre: 'Nintendo NES / Emulação',
    category: 'emulador',
    accent: 'var(--brand-cyan)',
    thumb: 'assets/thumb-neo-nes.webp',
    desc: 'Neo NES — emulador online de Nintendo Entertainment System criado para rodar direto no navegador pelo GitHub Pages.',
    url: 'https://jogoiarexx-blip.github.io/Neo-nes/',
    installable: true,
    embed: false
  }
];
