const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'g3ycdrt0';

export function cloudinaryImage(publicId, transformation = 'f_auto,q_auto') {
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformation}/${publicId}`;
}

const categoryTransform = 'f_auto,q_auto,w_900,h_900,c_fill,g_auto';

export const STATIC_MEDIA = {
  logo: cloudinaryImage('site/branding/spj-logo', 'f_auto,q_auto,w_512,h_512,c_fit'),
  fallbackNecklaces: cloudinaryImage('site/categories/fallback-necklaces', categoryTransform),
  categories: {
    necklaces: cloudinaryImage('site/categories/necklaces', categoryTransform),
    harams: cloudinaryImage('site/categories/harams', categoryTransform),
    earrings: cloudinaryImage('site/categories/earrings', categoryTransform),
    jhumkas: cloudinaryImage('site/categories/jhumkas', categoryTransform),
    bangles: cloudinaryImage('site/categories/bangles', categoryTransform),
    rings: cloudinaryImage('site/categories/rings', categoryTransform),
    bracelets: cloudinaryImage('site/categories/bracelets', categoryTransform),
    mangalsutras: cloudinaryImage('site/categories/mangalsutras', categoryTransform),
    // These legacy categories do not have source files in this checkout. Reuse
    // the closest available optimized category assets instead of producing 404s.
    pendants: cloudinaryImage('site/categories/rings', categoryTransform),
    anklets: cloudinaryImage('site/categories/bracelets', categoryTransform),
    nosePins: cloudinaryImage('site/categories/earrings', categoryTransform),
    papidi: cloudinaryImage('site/categories/mangalsutras', categoryTransform),
    watches: cloudinaryImage('site/categories/rings', categoryTransform),
  },
  hero: {
    bridalGold: cloudinaryImage('site/hero/bridal-gold'),
    sterlingSilver: cloudinaryImage('site/hero/sterling-silver'),
    templeJewellery: cloudinaryImage('site/hero/temple-jewellery'),
    mensCollection: cloudinaryImage('site/hero/mens-collection'),
  },
  schemes: {
    desktop: cloudinaryImage('site/schemes/desktop-background', 'f_auto,q_auto,w_2400'),
    mobile: cloudinaryImage('site/schemes/mobile-background', 'f_auto,q_auto,w_1400'),
  },
  shopStoryPoster: cloudinaryImage('site/video/shop-story-poster', 'f_auto,q_auto,w_1280'),
};
