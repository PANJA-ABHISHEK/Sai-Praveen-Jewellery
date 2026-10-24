import { NextResponse } from 'next/server';
import { db, withFirestoreTimeout } from '@/lib/firebase';
import { collection, getDocs, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { getAdminSession } from '@/lib/admin-auth';
import { getCentralizedRates, calculateProductPrice } from '@/lib/pricing';
import { addCustomCategory } from '@/lib/categories';
import {
  getProductSection,
  normalizeProductSection,
  sectionHasCategory,
} from '@/data/productSections';
import { STATIC_MEDIA } from '@/data/media';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

function isCloudinaryImageUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' && parsed.hostname === 'res.cloudinary.com';
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    const snapshot = await withFirestoreTimeout(() => getDocs(q));

    const rates = await getCentralizedRates();
    const products = snapshot.docs.map((doc) => {
      const data = doc.data();
      let price = data.price;
      if (data.weightGrams && data.makingChargeValue !== undefined) {
        const dynamicPrice = calculateProductPrice({
          weightGrams: data.weightGrams,
          material: data.material,
          purity: data.purity,
          makingChargeType: data.makingChargeType,
          makingChargeValue: data.makingChargeValue,
          extraAmount: data.extraAmount || 0,
          rates,
        });
        if (dynamicPrice > 0) price = dynamicPrice;
      }
      return {
        id: doc.id,
        ...data,
        section: getProductSection(data),
        price,
      };
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products from Firestore:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      material,
      section,
      audience,
      category,
      weightGrams,
      purity,
      price,
      makingChargeType = 'percentage',
      makingChargeValue = 0,
      extraAmount = 0,
      images,
      stockStatus = 'in_stock',
      featured = false,
    } = body;

    const productSection = normalizeProductSection(section || audience, 'women');
    const hasCategory = sectionHasCategory(productSection);
    const cleanCategory = hasCategory ? String(category || '').trim() : '';

    if (!name || !material || !weightGrams || (hasCategory && !cleanCategory)) {
      return NextResponse.json(
        { error: hasCategory
          ? 'Name, material, section, category, and weight are required'
          : 'Name, material, section, and weight are required' },
        { status: 400 }
      );
    }

    if (Array.isArray(images) && images.length > 3) {
      return NextResponse.json(
        { error: 'A product can have a maximum of 3 images.' },
        { status: 400 }
      );
    }

    const productImages = Array.isArray(images)
      ? images.filter((image) => typeof image === 'string' && image.trim())
      : [];

    if (Array.isArray(images) && productImages.length !== images.length) {
      return NextResponse.json(
        { error: 'Please provide up to 3 valid product images.' },
        { status: 400 }
      );
    }

    if (productImages.some((image) => !isCloudinaryImageUrl(image))) {
      return NextResponse.json(
        { error: 'Product images must be uploaded through Cloudinary before saving.' },
        { status: 400 }
      );
    }

    // Auto-calculate final product price from centralized rates if not explicitly passed
    let finalPrice = Number(price) || 0;
    const rates = await getCentralizedRates();
    const calculatedPrice = calculateProductPrice({
      weightGrams: Number(weightGrams) || 0,
      material,
      purity,
      makingChargeType,
      makingChargeValue,
      extraAmount: Number(extraAmount) || 0,
      rates,
    });

    if (!finalPrice || finalPrice <= 0) {
      finalPrice = calculatedPrice;
    }

    // Generate unique slug
    const baseSlug = slugify(name);
    const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const newProduct = {
      name: name.trim(),
      slug: uniqueSlug,
      description: description ? description.trim() : '',
      material: material.toLowerCase(),
      section: productSection,
      audience: productSection === 'women' || productSection === 'men' ? productSection : 'all',
      category: cleanCategory,
      weightGrams: Number(weightGrams) || 0,
      purity: purity || (material.toLowerCase() === 'gold' ? '22K' : '92.5 Sterling'),
      makingChargeType: makingChargeType === 'milligrams' ? 'milligrams' : 'percentage',
      makingChargeValue: Number(makingChargeValue) || 0,
      extraAmount: Number(extraAmount) || 0,
      price: finalPrice,
      images: productImages.length > 0 ? productImages : [STATIC_MEDIA.fallbackNecklaces],
      stockStatus: stockStatus || 'in_stock',
      featured: Boolean(featured),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, 'products'), newProduct);

    // Register category in persistent categories storage if new
    try {
      if (newProduct.category && newProduct.category.toLowerCase() !== 'other') {
        await addCustomCategory(newProduct.category);
      }
    } catch (catErr) {
      console.warn('Auto-register category note:', catErr.message);
    }

    return NextResponse.json({
      success: true,
      id: docRef.id,
      product: { id: docRef.id, ...newProduct },
    });
  } catch (error) {
    console.error('Error adding product to Firestore:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add product' },
      { status: 500 }
    );
  }
}
