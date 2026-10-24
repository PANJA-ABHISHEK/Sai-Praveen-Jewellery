import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { createStore, defaultStore, getAllStores, normalizeStoreInput } from '@/lib/stores';

async function requireAdmin() {
  return getAdminSession();
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const stores = await getAllStores();
    return NextResponse.json({ stores: stores.length ? stores : [defaultStore] });
  } catch (error) {
    console.error('Error fetching admin stores:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch stores' }, { status: 500 });
  }
}

export async function POST(request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const store = normalizeStoreInput(await request.json());
    if (!store.name || !store.addressLine1 || !store.city || !store.state || !store.pincode || !store.phone) {
      return NextResponse.json({ error: 'Store name, address, city, state, pincode, and phone are required.' }, { status: 400 });
    }
    const created = await createStore(store);
    return NextResponse.json({ success: true, store: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating store:', error);
    return NextResponse.json({ error: error.message || 'Failed to create store' }, { status: 500 });
  }
}
