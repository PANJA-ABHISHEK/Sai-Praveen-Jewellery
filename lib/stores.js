import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db, withFirestoreTimeout } from '@/lib/firebase';
import siteConfig from '@/lib/config';

const STORES_COLLECTION = 'stores';

export const defaultStore = {
  id: 'default',
  name: siteConfig.businessName,
  shortName: 'Patamata',
  addressLine1: siteConfig.address.line1,
  addressLine2: siteConfig.address.line2,
  city: siteConfig.address.city,
  state: siteConfig.address.state,
  pincode: siteConfig.address.pincode,
  country: siteConfig.address.country,
  phone: siteConfig.phone,
  whatsappNumber: siteConfig.whatsappNumber,
  email: siteConfig.email,
  hoursWeekdays: '10:00 AM – 8:30 PM',
  hoursSunday: '10:00 AM – 8:30 PM',
  mapUrl: '',
  active: true,
  displayOrder: 0,
  isDefault: true,
};

const text = (value, fallback = '') => String(value ?? fallback).trim();

export function normalizeStoreInput(input = {}) {
  return {
    name: text(input.name),
    shortName: text(input.shortName),
    addressLine1: text(input.addressLine1),
    addressLine2: text(input.addressLine2),
    city: text(input.city),
    state: text(input.state),
    pincode: text(input.pincode),
    country: text(input.country, 'India'),
    phone: text(input.phone),
    whatsappNumber: text(input.whatsappNumber).replace(/\D/g, ''),
    email: text(input.email),
    hoursWeekdays: text(input.hoursWeekdays, '10:00 AM – 8:30 PM'),
    hoursSunday: text(input.hoursSunday, '10:00 AM – 8:30 PM'),
    mapUrl: text(input.mapUrl),
    active: input.active !== false,
    displayOrder: Number.isFinite(Number(input.displayOrder)) ? Number(input.displayOrder) : 0,
  };
}

export async function getAllStores() {
  const snapshot = await withFirestoreTimeout(() => getDocs(collection(db, STORES_COLLECTION)));
  return snapshot.docs
    .map((storeDoc) => ({ id: storeDoc.id, ...storeDoc.data() }))
    .sort((first, second) => (Number(first.displayOrder) || 0) - (Number(second.displayOrder) || 0));
}

export async function createStore(input) {
  const store = normalizeStoreInput(input);
  const now = new Date().toISOString();
  const created = { ...store, createdAt: now, updatedAt: now };
  const reference = await withFirestoreTimeout(() => addDoc(collection(db, STORES_COLLECTION), created));
  return { id: reference.id, ...created };
}

export async function updateStore(id, input) {
  const store = normalizeStoreInput(input);
  const updated = { ...store, updatedAt: new Date().toISOString() };
  await withFirestoreTimeout(() => updateDoc(doc(db, STORES_COLLECTION, id), updated));
  return { id, ...updated };
}

export async function removeStore(id) {
  await withFirestoreTimeout(() => deleteDoc(doc(db, STORES_COLLECTION, id)));
}

export function getStoreAddress(store) {
  return [store.addressLine1, store.addressLine2, store.city, store.state, store.pincode, store.country]
    .filter(Boolean)
    .join(', ');
}
