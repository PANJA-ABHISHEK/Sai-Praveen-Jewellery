import { db, withFirestoreTimeout } from './firebase';
import { doc, getDoc, setDoc, collection, getDocs, writeBatch } from 'firebase/firestore';

/**
 * Sri Kankatala Jewellers — Centralized Pricing Engine
 * Handles daily market gold/silver rates and product price calculations.
 */

export const DEFAULT_RATES = {
  gold24k: 7400, // ₹ per gram (24K Pure Gold)
  gold22k: 6800, // ₹ per gram (22K 916 BIS Hallmark)
  gold18k: 5550, // ₹ per gram (18K Designer Gold)
  silver925: 95, // ₹ per gram (92.5% Sterling Silver)
  silverPremium: 110, // ₹ per gram (Premium Gold Coated Silver)
  silverPure: 100, // ₹ per gram (99.9 Pure Silver)
  silverArticles: 90, // ₹ per gram (Traditional Silver)
  updatedAt: new Date().toISOString(),
};

/**
 * Resolve rate per gram based on material and purity.
 * Returns 0 if rate is not set (never uses hardcoded fallback prices).
 */
export function getRatePerGram(material, purity, rates) {
  if (!rates || typeof rates !== 'object') return 0;
  const mat = (material || 'gold').toLowerCase();
  const pur = (purity || '').toUpperCase();

  if (mat === 'silver') {
    if (pur.includes('PREMIUM') || pur.includes('COATED')) {
      return Number(rates.silverPremium) || 0;
    }
    if (pur.includes('92.5') || pur.includes('STERLING')) {
      return Number(rates.silver925) || 0;
    }
    if (pur.includes('TRADITIONAL') || pur.includes('ARTICLE')) {
      return Number(rates.silverArticles) || 0;
    }
    if (pur.includes('99.9') || pur.includes('PURE')) {
      return Number(rates.silverPure) || 0;
    }
    return Number(rates.silver925) || 0;
  }

  // Gold
  if (pur.includes('24K')) return Number(rates.gold24k) || 0;
  if (pur.includes('18K')) return Number(rates.gold18k) || 0;
  if (pur.includes('22K')) return Number(rates.gold22k) || 0;
  return Number(rates.gold22k) || 0;
}

/**
 * Calculate total product price:
 * Base Metal Value = weightGrams * ratePerGram
 * Making Charges:
 *  - Percentage (%): Base Metal Value * (makingChargeValue / 100)
 *  - Milligrams (mg/g): (weightGrams * (makingChargeValue / 1000)) * ratePerGram
 * Extra Amount: Added as fixed ₹
 *
 * If ratePerGram is 0 or missing, returns 0 (never uses hardcoded fallback prices).
 */
export function calculateProductPrice({
  weightGrams = 0,
  material = 'gold',
  purity = '22K',
  makingChargeType = 'percentage',
  makingChargeValue = 0,
  extraAmount = 0,
  rates = null,
}) {
  const weight = Number(weightGrams) || 0;
  if (weight <= 0) return 0;

  const ratePerGram = getRatePerGram(material, purity, rates);
  if (!ratePerGram || ratePerGram <= 0) return 0;

  const baseMetalValue = weight * ratePerGram;

  let makingChargeAmount = 0;
  const mcVal = Number(makingChargeValue) || 0;

  if (makingChargeType === 'milligrams') {
    // e.g. 150 mg per gram wastage/making
    const extraWeightGrams = weight * (mcVal / 1000);
    makingChargeAmount = extraWeightGrams * ratePerGram;
  } else {
    // e.g. 12% making charge
    const pct = mcVal > 0 ? mcVal / 100 : 0;
    makingChargeAmount = baseMetalValue * pct;
  }

  const extra = Number(extraAmount) || 0;
  return Math.round(baseMetalValue + makingChargeAmount + extra);
}

/**
 * Fetch centralized rates from Firestore settings/goldRates document.
 * Returns null if rates are not saved (never uses hardcoded fallback prices).
 */
export async function getCentralizedRates() {
  try {
    const docRef = doc(db, 'settings', 'goldRates');
    const snap = await withFirestoreTimeout(() => getDoc(docRef));
    if (snap.exists()) {
      return snap.data();
    }
  } catch (err) {
    console.warn('Could not fetch centralized gold rates from Firestore:', err.message);
  }
  return null;
}

/**
 * Save centralized rates to Firestore settings/goldRates document.
 * Never silently overwrites: preserves existing data and merges only valid new rates.
 * Records server timestamp (updatedAt) and admin UID (updatedBy).
 */
export async function saveCentralizedRates(rates, adminUid = 'admin') {
  const docRef = doc(db, 'settings', 'goldRates');
  const existingSnap = await getDoc(docRef);
  const existingData = existingSnap.exists() ? existingSnap.data() : {};

  // Clean and sanitize rates: only positive numbers
  const sanitizedRates = {};
  const rateKeys = ['gold22k', 'gold24k', 'gold18k', 'silver925', 'silverPremium', 'silverArticles', 'silverPure'];
  rateKeys.forEach((key) => {
    if (rates[key] !== undefined && rates[key] !== null && rates[key] !== '') {
      const num = Number(rates[key]);
      if (!isNaN(num) && num > 0) {
        sanitizedRates[key] = num;
      }
    }
  });

  const payload = {
    ...existingData,
    ...sanitizedRates,
    updatedAt: new Date().toISOString(),
    updatedBy: adminUid || 'admin',
  };
  await setDoc(docRef, payload, { merge: true });

  // Batch update all applicable products in Firestore so stored prices stay synchronized
  try {
    const productsRef = collection(db, 'products');
    const snap = await getDocs(productsRef);
    if (!snap.empty) {
      const batch = writeBatch(db);
      let count = 0;
      snap.forEach((productDoc) => {
        const p = productDoc.data();
        if (p.weightGrams && p.makingChargeValue !== undefined) {
          const newPrice = calculateProductPrice({
            weightGrams: p.weightGrams,
            material: p.material,
            purity: p.purity,
            makingChargeType: p.makingChargeType,
            makingChargeValue: p.makingChargeValue,
            extraAmount: p.extraAmount || 0,
            rates: payload,
          });
          if (newPrice > 0) {
            batch.update(productDoc.ref, {
              price: newPrice,
              updatedAt: new Date().toISOString(),
            });
            count++;
          }
        }
      });
      if (count > 0) {
        await batch.commit();
      }
    }
  } catch (syncErr) {
    console.warn('Batch product price sync note:', syncErr.message);
  }

  return payload;
}
