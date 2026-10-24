import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { getAdminSession } from '@/lib/admin-auth';
import { db, withFirestoreTimeout } from '@/lib/firebase';
import { createStore, defaultStore, getAllStores, normalizeStoreInput, removeStore, updateStore } from '@/lib/stores';

async function requireAdmin() {
  return getAdminSession();
}

export async function GET(request, { params }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await params;
    const snapshot = await withFirestoreTimeout(() => getDoc(doc(db, 'stores', id)));
    if (!snapshot.exists()) return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    return NextResponse.json({ store: { id: snapshot.id, ...snapshot.data() } });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to fetch store' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await params;
    const store = normalizeStoreInput(await request.json());
    if (!store.name || !store.addressLine1 || !store.city || !store.state || !store.pincode || !store.phone) {
      return NextResponse.json({ error: 'Store name, address, city, state, pincode, and phone are required.' }, { status: 400 });
    }
    if (id === 'default' && (await getAllStores()).length === 0) {
      return NextResponse.json({ success: true, store: await createStore(store) });
    }
    return NextResponse.json({ success: true, store: await updateStore(id, store) });
  } catch (error) {
    console.error('Error updating store:', error);
    return NextResponse.json({ error: error.message || 'Failed to update store' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await params;
    if (id === 'default') {
      return NextResponse.json({ error: 'The fallback showroom cannot be deleted. Add a managed store first.' }, { status: 400 });
    }
    await removeStore(id);
    const stores = await getAllStores();
    return NextResponse.json({ success: true, fallback: stores.length === 0 ? defaultStore : null });
  } catch (error) {
    console.error('Error deleting store:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete store' }, { status: 500 });
  }
}
