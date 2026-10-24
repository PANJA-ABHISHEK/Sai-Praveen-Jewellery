import { NextResponse } from 'next/server';
import { db, withFirestoreTimeout } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { getCentralizedRates, calculateProductPrice } from '@/lib/pricing';
import { getProductSection } from '@/data/productSections';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const material = searchParams.get('material');
    const section = searchParams.get('section') || searchParams.get('audience');

    let products = [];
    try {
      const productsRef = collection(db, 'products');
      const q = query(productsRef, orderBy('createdAt', 'desc'));
      const snapshot = await withFirestoreTimeout(() => getDocs(q));

      if (!snapshot.empty) {
        const rates = await getCentralizedRates();
        products = snapshot.docs.map((doc) => {
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
      }
    } catch (fsErr) {
      console.warn('Firestore fetch failed:', fsErr.message);
    }

    if (material) {
      products = products.filter((p) => p.material === material);
    }
    if (section) {
      products = products.filter((p) => getProductSection(p) === section);
    }

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error in /api/products:', error);
    return NextResponse.json({ products: [] });
  }
}
