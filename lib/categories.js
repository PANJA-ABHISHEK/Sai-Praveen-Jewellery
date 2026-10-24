import { db, withFirestoreTimeout } from './firebase';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';

export const DEFAULT_CATEGORIES = [
  'Necklaces',
  'Chokers',
  'Harams',
  'Kasumala / Temple Jewellery',
  'Earrings',
  'Jhumkas',
  'Chandbalis',
  'Studs',
  'Bangles',
  'Kadas',
  'Bracelets',
  'Rings',
  'Pendants',
  'Mangalsutras / Nallapusalu',
  'Anklets (Payal / Pattilu)',
  'Nose Pins / Mukkupudaka',
  'Maang Tikka / Papidi Billa',
  'Vaddanam (Waist Belts)',
  'Vanki (Armlets / Bajuband)',
  'Chains',
  'Watches',
];

/**
 * Fetch all categories:
 * Merges DEFAULT_CATEGORIES + persistent custom categories saved in Firestore (settings/categories)
 * + any categories currently used in existing products.
 * Returns a sorted unique array of category strings.
 */
export async function getAllCategories() {
  const set = new Set(DEFAULT_CATEGORIES);

  try {
    // 1. Fetch saved custom categories from settings/categories
    const catDoc = await withFirestoreTimeout(() => getDoc(doc(db, 'settings', 'categories')));
    if (catDoc.exists()) {
      const data = catDoc.data();
      if (Array.isArray(data.customCategories)) {
        data.customCategories.forEach((c) => {
          if (c && typeof c === 'string' && c.trim() && c.toLowerCase() !== 'other' && c.toLowerCase() !== 'others') {
            set.add(c.trim());
          }
        });
      }
    }

    // 2. Also include any categories existing on products
    const productsSnap = await withFirestoreTimeout(() => getDocs(collection(db, 'products')));
    productsSnap.forEach((d) => {
      const p = d.data();
      if (p.category && typeof p.category === 'string' && p.category.trim() && p.category.toLowerCase() !== 'other' && p.category.toLowerCase() !== 'others') {
        set.add(p.category.trim());
      }
    });
  } catch (err) {
    console.warn('Error reading categories from Firestore:', err);
  }

  return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
}

/**
 * Save a new category to Firestore settings/categories
 */
export async function addCustomCategory(newCategoryName) {
  const trimmed = (newCategoryName || '').trim();
  if (!trimmed || trimmed.toLowerCase() === 'other' || trimmed.toLowerCase() === 'others') {
    throw new Error('Please enter a valid category name');
  }

  const catDocRef = doc(db, 'settings', 'categories');
  const catDoc = await getDoc(catDocRef);
  let customCategories = [];

  if (catDoc.exists()) {
    const data = catDoc.data();
    if (Array.isArray(data.customCategories)) {
      customCategories = [...data.customCategories];
    }
  }

  // Check if already present (case-insensitive)
  const exists = customCategories.some((c) => c.toLowerCase() === trimmed.toLowerCase());
  if (!exists) {
    customCategories.push(trimmed);
    await setDoc(
      catDocRef,
      {
        customCategories,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  }

  return getAllCategories();
}
