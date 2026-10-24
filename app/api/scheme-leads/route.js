import { NextResponse } from 'next/server';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request) {
  try {
    const body = await request.json();
    const customerName = String(body?.customerName || '').trim();
    const phone = String(body?.phone || '').trim();
    const schemeId = String(body?.schemeId || '').trim();
    const schemeName = String(body?.schemeName || '').trim();

    if (!customerName || !phone || !schemeId || !schemeName) {
      return NextResponse.json({ error: 'Name, phone number, and scheme are required' }, { status: 400 });
    }

    await addDoc(collection(db, 'schemeLeads'), {
      customerName,
      phone,
      city: String(body?.city || '').trim(),
      preferredAmount: String(body?.preferredAmount || '').trim(),
      message: String(body?.message || '').trim(),
      schemeId,
      schemeName,
      status: 'new',
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving scheme enquiry:', error);
    return NextResponse.json({ error: 'Could not save enquiry' }, { status: 500 });
  }
}
