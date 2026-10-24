import { db, withFirestoreTimeout } from '@/lib/firebase';
import { collection, doc, getDocs, setDoc, addDoc } from 'firebase/firestore';
import { DEFAULT_SCHEMES } from '@/data/schemes';

function sortSchemes(schemes) {
  return [...schemes].sort((a, b) => {
    const orderDifference = (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0);
    if (orderDifference !== 0) return orderDifference;
    return String(a.name || '').localeCompare(String(b.name || ''));
  });
}

export async function getAllSchemes() {
  const snapshot = await withFirestoreTimeout(() => getDocs(collection(db, 'schemes')));
  return sortSchemes(snapshot.docs.map((schemeDoc) => ({ id: schemeDoc.id, ...schemeDoc.data() })));
}

export async function getPublishedSchemes() {
  try {
    const schemes = await getAllSchemes();
    const published = schemes.filter((scheme) => scheme.status === 'published');
    return published.length > 0 ? published : DEFAULT_SCHEMES;
  } catch (error) {
    console.warn('Could not fetch schemes from Firestore:', error.message);
    return DEFAULT_SCHEMES;
  }
}

export async function seedDefaultScheme() {
  const defaultScheme = DEFAULT_SCHEMES[0];
  const schemeRef = doc(db, 'schemes', defaultScheme.id);
  await withFirestoreTimeout(() => setDoc(schemeRef, defaultScheme, { merge: true }));
  return defaultScheme;
}

export function normalizeSchemeInput(input = {}, existing = {}) {
  const benefits = Array.isArray(input.benefits)
    ? input.benefits.filter(Boolean).map((item) => String(item).trim()).filter(Boolean)
    : existing.benefits || [];
  const terms = Array.isArray(input.terms)
    ? input.terms.filter(Boolean).map((item) => String(item).trim()).filter(Boolean)
    : existing.terms || [];

  return {
    name: String(input.name ?? existing.name ?? '').trim(),
    description: String(input.description ?? existing.description ?? '').trim(),
    schemeType: input.schemeType === 'single' ? 'single' : 'monthly',
    minAmount: Math.max(0, Number(input.minAmount ?? existing.minAmount) || 0),
    durationMonths: Math.max(0, Number(input.durationMonths ?? existing.durationMonths) || 0),
    bonusText: String(input.bonusText ?? existing.bonusText ?? '').trim(),
    redemptionText: String(input.redemptionText ?? existing.redemptionText ?? '').trim(),
    benefits,
    terms,
    status: ['draft', 'published', 'paused', 'archived'].includes(input.status)
      ? input.status
      : existing.status || 'draft',
    featured: Boolean(input.featured ?? existing.featured),
    displayOrder: Math.max(0, Number(input.displayOrder ?? existing.displayOrder) || 0),
    updatedAt: new Date().toISOString(),
    createdAt: existing.createdAt || new Date().toISOString(),
  };
}

export async function createScheme(input) {
  const scheme = normalizeSchemeInput(input);
  const docRef = await addDoc(collection(db, 'schemes'), scheme);
  return { id: docRef.id, ...scheme };
}
