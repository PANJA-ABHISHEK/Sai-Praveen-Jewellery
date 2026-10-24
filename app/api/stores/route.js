import { NextResponse } from 'next/server';
import { defaultStore, getAllStores } from '@/lib/stores';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stores = await getAllStores();
    return NextResponse.json({ stores: stores.length ? stores : [defaultStore] });
  } catch (error) {
    console.error('Error fetching stores:', error);
    return NextResponse.json({ stores: [defaultStore] });
  }
}
