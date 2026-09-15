/* JogaHub 1.2.33 — jogos adicionais */
(() => {
  if (typeof LINK_ITEMS === 'undefined') return;

  const extras = [
    {
      id: 'arcana-survivors',
      type: 'jogo',
      title: 'Arcana Survivors',
      genre: 'Survival / Roguelite / Co-op',
      category: 'survival',
      accent: 'var(--brand-purple)',
      thumb: 'https://raw.githubusercontent.com/MrPowerUp82/wizard-coop/main/public/assets/phases.png',
      hero: 'https://raw.githubusercontent.com/MrPowerUp82/wizard-coop/main/public/assets/phases.png',
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
      thumb: 'https://raw.githubusercontent.com/jogoiarexx-blip/Rexx-Eclipse-protocol/main/assets/images/zone-zero/agents-walk.png',
      hero: 'https://raw.githubusercontent.com/jogoiarexx-blip/Rexx-Eclipse-protocol/main/assets/images/zone-zero/agents-walk.png',
      desc: 'REXX: Eclipse Protocol — survivor bullet heaven com missões de 30 minutos, 6 agentes, 15 armas, 15 evoluções, 5 regiões, chefes, progressão permanente, conquistas, bestiário e radar.',
      url: 'https://jogoiarexx-blip.github.io/Rexx-Eclipse-protocol/',
      installable: true,
      embed: false
    }
  ];

  for (const item of extras.reverse()) {
    if (!LINK_ITEMS.some(existing => existing.id === item.id)) LINK_ITEMS.unshift(item);
  }
})();
