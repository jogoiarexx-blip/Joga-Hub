/* JogaHub — jogos adicionais */
(() => {
  if (typeof LINK_ITEMS === 'undefined') return;

  const extras = [
    {
      id: 'termo-premium',
      type: 'jogo',
      title: 'Termo Premium',
      genre: 'Palavras / Estratégia',
      category: 'estrategia',
      accent: 'var(--brand-green)',
      thumb: 'assets/cover-termo-premium.webp',
      hero: 'assets/cover-termo-premium.webp',
      desc: 'Termo Premium — desafio de palavras com modos Jornada, Clássico e Diário, progressão, classes, poderes e desafios.',
      url: 'https://jogoiarexx-blip.github.io/Termo-Premium/',
      installable: true,
      embed: false
    },
    {
      id: 'arcana-survivors',
      type: 'jogo',
      title: 'Arcana Survivors',
      genre: 'Survival / Roguelite / Co-op',
      category: 'survival',
      accent: 'var(--brand-purple)',
      thumb: 'assets/cover-arcana-survivors.webp',
      hero: 'assets/cover-arcana-survivors.webp',
      desc: 'Arcana Survivors — survival roguelite cooperativo para 1 a 4 jogadores, com três reinos, chefes, poderes, evoluções e multiplayer por WebSocket.',
      url: 'https://mrpowerup82.github.io/wizard-coop/?server=wss://vps65228.publiccloud.com.br/ws',
      installable: false,
      embed: false
    },
    {
      id: 'rexx-eclipse-protocol',
      type: 'jogo',
      title: 'REXX: Eclipse Protocol',
      genre: 'Survival / Bullet Heaven',
      category: 'survival',
      accent: 'var(--brand-cyan)',
      thumb: 'assets/cover-rexx-eclipse-protocol.webp',
      hero: 'assets/cover-rexx-eclipse-protocol.webp',
      desc: 'REXX: Eclipse Protocol — survivor bullet heaven com missões de 30 minutos, 6 agentes, 15 armas, 15 evoluções, 5 regiões, chefes, progressão permanente, conquistas, bestiário e radar.',
      url: 'https://jogoiarexx-blip.github.io/Rexx-Eclipse-protocol/',
      installable: true,
      embed: false
    },
    {
      id: 'iron-barricade',
      type: 'jogo',
      title: 'Iron Barricade',
      genre: 'Defesa / Estratégia',
      category: 'estrategia',
      accent: 'var(--brand-orange)',
      thumb: 'https://raw.githubusercontent.com/jogoiarexx-blip/Iron-Barricade/main/assets/images/ui/iron-barricade-title-screen.webp',
      hero: 'https://raw.githubusercontent.com/jogoiarexx-blip/Iron-Barricade/main/assets/images/ui/iron-barricade-title-screen.webp',
      desc: 'Iron Barricade — defesa estratégica em HTML5 com campanha por linhas, máquinas improvisadas, invasores Riftborn, objetivos especiais, progressão por estrelas e chefes.',
      url: 'https://jogoiarexx-blip.github.io/Iron-Barricade/',
      installable: true,
      embed: false
    },
    {
      id: 'dragon-fury',
      type: 'jogo',
      title: 'Dragon Fury',
      genre: "Shoot 'em up / Ação",
      category: 'shoot-em-up',
      accent: 'var(--brand-red)',
      thumb: 'https://raw.githubusercontent.com/jogoiarexx-blip/Dragon-Fury/main/assets/bosses/ancient-dragon-boss.webp',
      hero: 'https://raw.githubusercontent.com/jogoiarexx-blip/Dragon-Fury/main/assets/bosses/ancient-dragon-boss.webp',
      desc: 'Dragon Fury — shooter de ação com cinco fases, chefes únicos, upgrades, conquistas, ranks, progressão de campanha, controles touch e opções de qualidade gráfica.',
      url: 'https://jogoiarexx-blip.github.io/Dragon-Fury/',
      installable: true,
      embed: false
    }
  ];

  for (const item of extras.reverse()) {
    if (!LINK_ITEMS.some(existing => existing.id === item.id)) LINK_ITEMS.unshift(item);
  }
})();
