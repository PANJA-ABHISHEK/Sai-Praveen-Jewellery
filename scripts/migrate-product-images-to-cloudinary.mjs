import fs from 'node:fs';
import path from 'node:path';
import { v2 as cloudinary } from 'cloudinary';
import { initializeApp, getApps } from 'firebase/app';
import { collection, getDocs, getFirestore, updateDoc, doc } from 'firebase/firestore';

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

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

function isCloudinaryUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'res.cloudinary.com';
  } catch {
    return false;
  }
}

function localPathFromImageUrl(imageUrl) {
  if (!imageUrl?.startsWith('/')) return null;
  return path.join(projectRoot, 'public', imageUrl.slice(1).replaceAll('/', path.sep));
}

const snapshot = await getDocs(collection(db, 'products'));
const products = snapshot.docs.map((productDoc) => ({ id: productDoc.id, ...productDoc.data() }));
const migrations = [];

for (const product of products) {
  for (const [index, image] of (product.images || []).entries()) {
    if (isCloudinaryUrl(image)) continue;

    const filePath = localPathFromImageUrl(image);
    if (!filePath || !fs.existsSync(filePath)) {
      throw new Error(`Cannot migrate ${product.name}: missing local image ${image}`);
    }

    migrations.push({ product, index, image, filePath });
  }
}

console.log(`Found ${migrations.length} local product images across ${products.length} products.`);

for (const migration of migrations) {
  const publicId = `skj_jewellery/products/${migration.product.id}/${migration.index + 1}`;
  const result = await cloudinary.uploader.upload(migration.filePath, {
    public_id: publicId,
    resource_type: 'image',
    overwrite: true,
    invalidate: true,
  });

  migration.cloudinaryUrl = cloudinary.url(result.public_id, {
    secure: true,
    resource_type: 'image',
    transformation: [{ fetch_format: 'auto', quality: 'auto' }],
  });
  console.log(`${migration.product.name}: ${migration.image} -> ${migration.cloudinaryUrl}`);
}

for (const product of products) {
  const productMigrations = migrations.filter((migration) => migration.product.id === product.id);
  if (productMigrations.length === 0) continue;

  const images = [...product.images];
  for (const migration of productMigrations) images[migration.index] = migration.cloudinaryUrl;
  await updateDoc(doc(db, 'products', product.id), {
    images,
    updatedAt: new Date().toISOString(),
  });
  console.log(`Updated Firestore product ${product.id}.`);
}

console.log(`Migrated ${migrations.length} product images to Cloudinary.`);
process.exit(0);
