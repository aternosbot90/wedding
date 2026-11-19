/**
 * Royal Indian Wedding Data & Types
 * Abhishek weds Ishita — Shubh Vivah Patrika
 */

export interface CeremonyEvent {
  time: string;
  title: string;
  hindiTitle: string;
  venue: string;
  description: string;
  attire: string;
}

export interface IndianBookVolume {
  id: string;
  volumeNumber: string;
  title: string;
  hindiTitle?: string;
  subtitle: string;
  spineColor: string;
  accentColor: string;
  coverPattern?: string;
  coverTexture?: string;
  spineTexture?: string;
  targetSpread: number;
}

export type WeddingBookVolume = IndianBookVolume;

export const INDIAN_VOLUMES: IndianBookVolume[] = [
  {
    id: 'patrika',
    volumeNumber: 'HEIRLOOM VOLUME',
    title: 'Shubh Vivah Patrika',
    hindiTitle: '॥ शुभ विवाह पत्रिका ॥',
    subtitle: 'THE SACRED INVITATION',
    spineColor: '#7A1522', // Royal Sindoor Crimson
    accentColor: '#E6C665', // Zari Gold
    coverTexture: '/assets/textures/cover_patrika.jpg',
    spineTexture: '/assets/textures/spine_patrika.jpg',
    targetSpread: 0,
  },
  {
    id: 'kahani',
    volumeNumber: 'VOLUME I',
    title: 'Hamari Prem Kahani',
    hindiTitle: 'हमारी प्रेम कहानी',
    subtitle: 'OUR LOVE STORY & MEMORIES',
    spineColor: '#8A3249', // Romantic Blush Rose Silk
    accentColor: '#F2D0DF',
    coverTexture: '/assets/textures/cover_kahani.jpg',
    spineTexture: '/assets/textures/spine_kahani.jpg',
    targetSpread: 1,
  },
  {
    id: 'haldi',
    volumeNumber: 'VOLUME II',
    title: 'Haldi & Mehndi Ki Rasam',
    hindiTitle: 'हल्दी एवं मेहंदी की रस्म',
    subtitle: 'FLORAL BLESSINGS & DHOL',
    spineColor: '#A36006', // Radiant Saffron Marigold
    accentColor: '#F7DC88',
    coverTexture: '/assets/textures/cover_haldi.jpg',
    spineTexture: '/assets/textures/spine_haldi.jpg',
    targetSpread: 2,
  },
  {
    id: 'sangeet',
    volumeNumber: 'VOLUME III',
    title: 'Sangeet Sandhya',
    hindiTitle: 'संगीत संध्या',
    subtitle: 'A CELEBRATION OF MUSIC',
    spineColor: '#121D3B', // Midnight Sapphire Navy Blue
    accentColor: '#C4D7F5',
    coverTexture: '/assets/textures/cover_sangeet.jpg',
    spineTexture: '/assets/textures/spine_sangeet.jpg',
    targetSpread: 3,
  },
  {
    id: 'phere',
    volumeNumber: 'VOLUME IV',
    title: 'Saat Phere & Shubh Vivah',
    hindiTitle: 'सात फेरे एवं शुभ विवाह',
    subtitle: 'THE SACRED VOWS',
    spineColor: '#8C121E', // Imperial Sindoor Maroon
    accentColor: '#F7D688',
    coverTexture: '/assets/textures/cover_phere.jpg',
    spineTexture: '/assets/textures/spine_phere.jpg',
    targetSpread: 4,
  },
  {
    id: 'poshak',
    volumeNumber: 'VOLUME V',
    title: 'Poshak & Rang (Attire)',
    hindiTitle: 'पोशाक एवं रंग निर्देशिका',
    subtitle: 'ROYAL PALETTE & DRESS CODE',
    spineColor: '#143D28', // Emerald Jade Velvet
    accentColor: '#BEE7CD',
    coverTexture: '/assets/textures/cover_poshak.jpg',
    spineTexture: '/assets/textures/spine_poshak.jpg',
    targetSpread: 5,
  },
  {
    id: 'udaivilas',
    volumeNumber: 'VOLUME VI',
    title: 'The Oberoi Udaivilas',
    hindiTitle: 'उदयविलास एवं यात्रा विवरण',
    subtitle: 'LAKE PICHOLA, UDAIPUR',
    spineColor: '#10404C', // Lake Pichola Royal Teal
    accentColor: '#A6DFE8',
    coverTexture: '/assets/textures/cover_udaivilas.jpg',
    spineTexture: '/assets/textures/spine_udaivilas.jpg',
    targetSpread: 6,
  },
  {
    id: 'rsvp',
    volumeNumber: 'VOLUME VII',
    title: 'Shubh Sandesh & RSVP',
    hindiTitle: 'शुभ संदेश एवं आमंत्रण स्वीकृति',
    subtitle: 'KINDLY CONFIRM ATTENDANCE',
    spineColor: '#751421', // Royal Crimson & Pearl Ivory
    accentColor: '#F0D489',
    coverTexture: '/assets/textures/cover_rsvp.jpg',
    spineTexture: '/assets/textures/spine_rsvp.jpg',
    targetSpread: 7,
  },
];
