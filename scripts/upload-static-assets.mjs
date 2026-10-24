import fs from 'node:fs';
import path from 'node:path';
import { v2 as cloudinary } from 'cloudinary';

const projectRoot = process.cwd();

for (const line of fs.readFileSync(path.join(projectRoot, '.env.local'), 'utf8').split(/\r?\n/)) {
  const match = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
  if (match && !process.env[match[1].trim()]) {
    process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
}

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const assets = [
  ['logo', 'public/logo.png', 'site/branding/spj-logo'],
  ['categoryNecklaces', 'public/new_necklace_image.png', 'site/categories/necklaces'],
  ['categoryHarams', 'public/new_haram_image.png', 'site/categories/harams'],
  ['categoryEarrings', 'public/new_earrings_image.png', 'site/categories/earrings'],
  ['categoryJhumkas', 'public/new_jumkas_image.png', 'site/categories/jhumkas'],
  ['categoryBangles', 'public/new_bangles_image.png', 'site/categories/bangles'],
  ['categoryRings', 'public/new_ring_image.png', 'site/categories/rings'],
  ['categoryBracelets', 'public/new_bracelet_image.png', 'site/categories/bracelets'],
  ['categoryMangalsutras', 'public/new_Mangalsutra_image.png', 'site/categories/mangalsutras'],
  ['fallbackNecklaces', 'public/images/categories/Necklaces.png', 'site/categories/fallback-necklaces'],
  ['heroBridalGold', 'public/images/hero/hero_bridal_gold_1791637796095.jpg', 'site/hero/bridal-gold'],
  ['heroSterlingSilver', 'public/images/hero/hero_sterling_silver_1791637808752.jpg', 'site/hero/sterling-silver'],
  ['heroTempleJewellery', 'public/images/hero/hero_temple_jewellery_1791637822451.jpg', 'site/hero/temple-jewellery'],
  ['heroMensCollection', 'public/images/hero/hero_mens_collection_1791637835648.jpg', 'site/hero/mens-collection'],
  ['schemesDesktop', 'public/schemepage-background.png', 'site/schemes/desktop-background'],
  ['schemesMobile', 'public/schemepage-background-mobile.png', 'site/schemes/mobile-background'],
  ['shopStoryPoster', 'public/images/skjshop.jpg', 'site/video/shop-story-poster'],
];

const uploaded = [];

for (const [key, relativeFile, publicId] of assets) {
  const filePath = path.join(projectRoot, relativeFile);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing static asset: ${relativeFile}`);
  }

  const result = await cloudinary.uploader.upload(filePath, {
    public_id: publicId,
    resource_type: 'image',
    overwrite: true,
    invalidate: true,
  });

  uploaded.push({ key, file: relativeFile, publicId: result.public_id, secureUrl: result.secure_url });
  console.log(`${key}: ${result.secure_url}`);
}

console.log(`Uploaded ${uploaded.length} static assets to Cloudinary.`);
