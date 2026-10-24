import { NextResponse } from 'next/server';
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getAdminSession } from '@/lib/admin-auth';
import { normalizeSchemeInput } from '@/lib/schemes';

export async function PUT(request, { params }) {
  try {
    if (!(await getAdminSession())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const schemeRef = doc(db, 'schemes', id);
    const snapshot = await getDoc(schemeRef);
    if (!snapshot.exists()) {
      return NextResponse.json({ error: 'Scheme not found' }, { status: 404 });
    }

    const scheme = normalizeSchemeInput(await request.json(), { id, ...snapshot.data() });
    if (!scheme.name || !scheme.description) {
      return NextResponse.json({ error: 'Scheme name and description are required' }, { status: 400 });
    }
    await updateDoc(schemeRef, scheme);
    return NextResponse.json({ success: true, scheme: { id, ...scheme } });
  } catch (error) {
    console.error('Error updating scheme:', error);
    return NextResponse.json({ error: error.message || 'Failed to update scheme' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!(await getAdminSession())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await deleteDoc(doc(db, 'schemes', id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting scheme:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete scheme' }, { status: 500 });
  }
}
