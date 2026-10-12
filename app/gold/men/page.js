import { Suspense } from 'react';
import CatalogueView from '@/components/catalogue/CatalogueView';

export const metadata = {
  title: 'Gold Jewellery for Men',
  description:
    'Explore premium gold jewellery for men — rings, bracelets, chains, pendants and watches at Sai Praveen Jewellery.',
};

export default function GoldMenPage() {
  return (
    <Suspense fallback={<CatalogueLoading />}>
      <CatalogueView material="gold" audience="men" />
    </Suspense>
  );
}

function CatalogueLoading() {
  return (
    <div className="section-container py-20">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] skeleton" />
        ))}
      </div>
    </div>
  );
}
