/* JogaHub 1.2.32 — Arcana Survivors */
(() => {
  if (typeof LINK_ITEMS === 'undefined') return;
  if (LINK_ITEMS.some(item => item.id === 'arcana-survivors')) return;

  LINK_ITEMS.unshift({
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
  });
})();
