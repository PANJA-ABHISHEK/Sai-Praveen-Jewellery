import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAdminSession } from '@/lib/admin-auth';
import { normalizeProductSection, sectionHasCategory } from '@/data/productSections';

function isCloudinaryImageUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' && parsed.hostname === 'res.cloudinary.com';
  } catch {
    return false;
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product: { id: docSnap.id, ...docSnap.data() } });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const updates = await request.json();

    if (updates.section !== undefined || updates.audience !== undefined || updates.category !== undefined) {
      const productSection = normalizeProductSection(
        updates.section || updates.audience,
        'women'
      );
      const hasCategory = sectionHasCategory(productSection);
      const cleanCategory = hasCategory ? String(updates.category || '').trim() : '';

      if (hasCategory && !cleanCategory) {
        return NextResponse.json(
          { error: 'A category is required for Women and Men products.' },
          { status: 400 }
        );
      }

      updates.section = productSection;
      updates.audience = productSection === 'women' || productSection === 'men'
        ? productSection
        : 'all';
      updates.category = cleanCategory;
    }

    // Sanitize numeric fields if present
    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.weightGrams !== undefined) updates.weightGrams = Number(updates.weightGrams);
    if (updates.makingChargeValue !== undefined) updates.makingChargeValue = Number(updates.makingChargeValue);
    if (updates.extraAmount !== undefined) updates.extraAmount = Number(updates.extraAmount);
    if (updates.images !== undefined) {
      if (!Array.isArray(updates.images) || updates.images.length > 3) {
        return NextResponse.json(
          { error: 'A product can have a maximum of 3 images.' },
          { status: 400 }
        );
      }
      updates.images = updates.images.filter((image) => typeof image === 'string' && image.trim());
      if (updates.images.some((image) => !isCloudinaryImageUrl(image))) {
        return NextResponse.json(
          { error: 'Product images must be uploaded through Cloudinary before saving.' },
          { status: 400 }
        );
      }
    }

    updates.updatedAt = new Date().toISOString();

    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, updates);

    return NextResponse.json({ success: true, message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete product' }, { status: 500 });
  }
}
