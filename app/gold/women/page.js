import { Suspense } from 'react';
import CatalogueView from '@/components/catalogue/CatalogueView';
import { withCanonical } from '@/lib/seo';

export const metadata = withCanonical({
  title: 'Gold Jewellery for Women',
  description:
    'Browse our exquisite collection of gold jewellery for women — necklaces, harams, earrings, jhumkas, bangles, rings, pendants and more at Sai Praveen Jewellery.',
}, '/gold/women');

export default function GoldWomenPage() {
  return (
    <Suspense fallback={<CatalogueLoading />}>
      <CatalogueView material="gold" section="women" />
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
