import { STATIC_MEDIA } from '@/data/media';

export const ANNOUNCEMENT_BACKGROUND_COLORS = [
  { id: 'wine', label: 'Jewellery Wine', value: '#5B1F2A', text: '#FFF9EF' },
  { id: 'charcoal', label: 'Soft Obsidian', value: '#24191B', text: '#FFF9EF' },
  { id: 'cinnamon', label: 'Burnished Terracotta', value: '#995B3F', text: '#FFF9EF' },
  { id: 'gold', label: 'Antique Gold', value: '#C99A2E', text: '#211719' },
  { id: 'burgundy', label: 'Deep Burgundy', value: '#781F35', text: '#FFF9EF' },
  { id: 'cream', label: 'Champagne Cream', value: '#F5EBDD', text: '#4A2A19' },
];

export const ANNOUNCEMENT_TEXT_COLORS = [
  { id: 'white', label: 'White', value: '#FFFFFF' },
  { id: 'charcoal', label: 'Deep Charcoal', value: '#171717' },
  { id: 'brown', label: 'Warm Brown', value: '#4A2A19' },
];

export const DEFAULT_SITE_SETTINGS = {
  announcement: {
    enabled: true,
    message: 'Timeless Tradition. Trusted Craftsmanship.',
    backgroundColor: 'wine',
    textColor: 'white',
  },
  homepage: {
    slides: [
      { id: 'hero-bridal-gold', imageUrl: STATIC_MEDIA.hero.bridalGold, mobileImageUrl: STATIC_MEDIA.hero.bridalGold, alt: 'Sai Praveen Jewellery collection' },
      { id: 'hero-sterling-silver', imageUrl: STATIC_MEDIA.hero.sterlingSilver, mobileImageUrl: STATIC_MEDIA.hero.sterlingSilver, alt: 'Sai Praveen Jewellery collection' },
      { id: 'hero-temple-jewellery', imageUrl: STATIC_MEDIA.hero.templeJewellery, mobileImageUrl: STATIC_MEDIA.hero.templeJewellery, alt: 'Sai Praveen Jewellery collection' },
      { id: 'hero-mens-collection', imageUrl: STATIC_MEDIA.hero.mensCollection, mobileImageUrl: STATIC_MEDIA.hero.mensCollection, alt: 'Sai Praveen Jewellery collection' },
    ],
    videoUrl: '',
    videoEnabled: false,
  },
};

const LEGACY_ANNOUNCEMENT_COLORS = {
  deepOlive: 'wine',
};

export function getAnnouncementBackground(id) {
  const normalizedId = LEGACY_ANNOUNCEMENT_COLORS[id] || id;
  return ANNOUNCEMENT_BACKGROUND_COLORS.find((color) => color.id === normalizedId)
    || ANNOUNCEMENT_BACKGROUND_COLORS[0];
}

export function getAnnouncementTextColor(id) {
  return ANNOUNCEMENT_TEXT_COLORS.find((color) => color.id === id)
    || ANNOUNCEMENT_TEXT_COLORS[0];
}

export function mergeSiteSettings(settings = {}) {
  const announcement = {
    ...DEFAULT_SITE_SETTINGS.announcement,
    ...(settings.announcement || {}),
  };
  const announcementBackground = getAnnouncementBackground(announcement.backgroundColor);

  const homepage = {
    ...DEFAULT_SITE_SETTINGS.homepage,
    ...(settings.homepage || {}),
  };

  return {
    ...DEFAULT_SITE_SETTINGS,
    ...settings,
    announcement: {
      ...announcement,
      backgroundColor: announcementBackground.id,
    },
    homepage: {
      ...homepage,
      slides: homepage.slides.map((slide) => ({
        ...slide,
        mobileImageUrl: slide.mobileImageUrl || slide.imageUrl,
      })),
    },
  };
}
