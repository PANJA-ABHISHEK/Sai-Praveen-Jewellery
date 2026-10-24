import { STATIC_MEDIA } from '@/data/media';

/**
 * Sri Kankatala Jewellers — Category Data
 * Categories for the Shop by Category section and catalogue filters.
 */

const categories = [
  {
    name: 'Necklaces',
    slug: 'necklaces',
    image: STATIC_MEDIA.categories.necklaces,
    description: 'Exquisite necklaces for every occasion',
  },
  {
    name: 'Harams',
    slug: 'harams',
    image: STATIC_MEDIA.categories.harams,
    description: 'Grand long necklaces for bridal wear',
  },
  {
    name: 'Earrings',
    slug: 'earrings',
    image: STATIC_MEDIA.categories.earrings,
    description: 'From studs to chandbalis',
  },
  {
    name: 'Jhumkas',
    slug: 'jhumkas',
    image: STATIC_MEDIA.categories.jhumkas,
    description: 'Traditional South Indian jhumka earrings',
  },
  {
    name: 'Bangles',
    slug: 'bangles',
    image: STATIC_MEDIA.categories.bangles,
    description: 'Stunning bangles and kadas',
  },
  {
    name: 'Rings',
    slug: 'rings',
    image: STATIC_MEDIA.categories.rings,
    description: 'Statement rings for men and women',
  },
  {
    name: 'Bracelets',
    slug: 'bracelets',
    image: STATIC_MEDIA.categories.bracelets,
    description: 'Elegant bracelets and chain links',
  },
  {
    name: 'Pendants',
    slug: 'pendants',
    image: STATIC_MEDIA.categories.pendants,
    description: 'Beautiful pendants in varied designs',
  },
  {
    name: 'Mangalsutras',
    slug: 'mangalsutras',
    image: STATIC_MEDIA.categories.mangalsutras,
    description: 'Sacred mangalsutras crafted with care',
  },
  {
    name: 'Anklets',
    slug: 'anklets',
    image: STATIC_MEDIA.categories.anklets,
    description: 'Graceful anklets with traditional charm',
  },
  {
    name: 'Nose Pins',
    slug: 'nose-pins',
    image: STATIC_MEDIA.categories.nosePins,
    description: 'Delicate nose pins and nose rings',
  },
  {
    name: 'Papidi',
    slug: 'papidi',
    image: STATIC_MEDIA.categories.papidi,
    description: 'Traditional bridal papidi billa',
  },
  {
    name: 'Watches',
    slug: 'watches',
    image: STATIC_MEDIA.categories.watches,
    description: 'Premium gold and silver watches',
  },
];

export function getCategoryBySlug(slug) {
  return categories.find((category) => category.slug === slug);
}

export function getCategorySlug(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default categories;
