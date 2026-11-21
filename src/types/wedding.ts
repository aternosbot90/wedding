/**
 * Indian Wedding Data & Types
 * Abhishek weds Ishita — Shubh Vivah Patrika
 * Invitation from Shri Vedprakash (Bakhtawarpur, Delhi)
 */

export interface CeremonyEvent {
  time: string;
  title: string;
  hindiTitle: string;
  venue: string;
  description: string;
  attire?: string;
  mapUrl?: string;
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

export const HOST_DETAILS = {
  hostName: 'Shri Vedprakash',
  hostHindi: 'श्री वेदप्रकाश एवं समस्त परिवार',
  residenceAddress: '44/24, Gali No. 3, Bheem Colony, Bakhtawarpur, Delhi - 110036',
  residenceAddressHindi: '४४/२४, गली नं ३, भीम कॉलोनी, बख्तावरपुर, दिल्ली - ११०-०३६',
  residenceMapUrl: 'https://maps.google.com/?q=Bheem+Colony+Bakhtawarpur+Delhi+110036',
  coupleGroom: 'Abhishek',
  coupleBride: 'Ishita',
  coupleHindi: 'अभिषेक संग इशिता',
  monogram: 'अ & इ',
  contactNumbers: ['9971006431', '9212029424', '9873185576', '9560364705'],
  events: [
    {
      id: 'ring_ceremony',
      date: '5th December 2026',
      dateHindi: '५ दिसम्बर २०२६',
      title: 'Ring Ceremony & Preeti Bhoj',
      hindiTitle: 'मुद्रिका संस्कार एवं प्रीतिभोज',
      timingCeremony: '11:00 AM',
      timingCeremonyTitle: 'Ring Ceremony (मुद्रिका संस्कार)',
      timingLunch: '01:00 PM',
      timingLunchTitle: 'Preeti Bhoj / Lunch (प्रीतिभोज)',
      venue: 'Mannat Vatika Farm',
      venueHindi: 'मन्नत वाटिका फार्म',
      city: 'Delhi',
      mapUrl: 'https://maps.app.goo.gl/mrv1ZjPQXxpvmBDL6',
    },
    {
      id: 'barat_wedding',
      date: '12th December 2026',
      dateHindi: '१२ दिसम्बर २०२६',
      title: 'Barat & Shubh Vivah',
      hindiTitle: 'बारात प्रस्थान एवं शुभ विवाह',
      timingSehraBandi: '10:00 AM',
      timingSehraBandiTitle: 'Sehra Bandi (सेहरा बंदी - निवास स्थान)',
      timingBarat: '11:00 AM',
      timingBaratTitle: 'Departure of Barat (बारात प्रस्थान)',
      venue: 'Green Lounge North Banquet',
      venueHindi: 'ग्रीन लाउंज नॉर्थ बैंक्वेट',
      city: 'Delhi',
      mapUrl: 'https://maps.app.goo.gl/rCGKCJWhjcMhXcaC8',
    },
  ],
};

export const INDIAN_VOLUMES: IndianBookVolume[] = [
  {
    id: 'patrika',
    volumeNumber: 'HEIRLOOM VOLUME',
    title: 'Shubh Vivah Patrika',
    hindiTitle: '॥ शुभ विवाह पत्रिका ॥',
    subtitle: 'INVITATION FROM SHRI VEDPRAKASH',
    spineColor: '#7A1522', // Royal Sindoor Crimson
    accentColor: '#E6C665', // Zari Gold
    coverTexture: '/assets/textures/cover_patrika.jpg',
    spineTexture: '/assets/textures/spine_patrika.jpg',
    targetSpread: 0,
  },
  {
    id: 'ring',
    volumeNumber: 'CEREMONY I',
    title: 'Ring Ceremony',
    hindiTitle: 'मुद्रिका संस्कार (सगाई)',
    subtitle: '5 DEC • MANNAT VATIKA FARM',
    spineColor: '#A36006', // Auspicious Marigold Gold
    accentColor: '#F7DC88',
    coverTexture: '/assets/textures/cover_haldi.jpg',
    spineTexture: '/assets/textures/spine_haldi.jpg',
    targetSpread: 1,
  },
  {
    id: 'barat',
    volumeNumber: 'CEREMONY II',
    title: 'Barat & Shubh Vivah',
    hindiTitle: 'बारात एवं शुभ विवाह',
    subtitle: '12 DEC • GREEN LOUNGE BANQUET',
    spineColor: '#8C121E', // Imperial Crimson Maroon
    accentColor: '#F7D688',
    coverTexture: '/assets/textures/cover_phere.jpg',
    spineTexture: '/assets/textures/spine_phere.jpg',
    targetSpread: 2,
  },
  {
    id: 'venues',
    volumeNumber: 'VOLUME III',
    title: 'Venues & Google Maps',
    hindiTitle: 'स्थान निर्देशिका एवं मानचित्र',
    subtitle: 'MANNAT VATIKA & GREEN LOUNGE',
    spineColor: '#10404C', // Deep Heritage Teal
    accentColor: '#A6DFE8',
    coverTexture: '/assets/textures/cover_patrika.jpg',
    spineTexture: '/assets/textures/cover_patrika.jpg',
    targetSpread: 3,
  },
  {
    id: 'blessings',
    volumeNumber: 'VOLUME IV',
    title: 'Shubh Sandesh & Blessings',
    hindiTitle: 'शुभकामनाएँ एवं शुभाशीष',
    subtitle: 'WARM WISHES & BLESSINGS',
    spineColor: '#751421', // Royal Velvet Maroon
    accentColor: '#F0D489',
    coverTexture: '/assets/textures/cover_patrika.jpg',
    spineTexture: '/assets/textures/cover_patrika.jpg',
    targetSpread: 4,
  },
];
