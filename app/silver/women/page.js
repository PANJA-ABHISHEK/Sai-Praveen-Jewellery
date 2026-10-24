import { Suspense } from 'react';
import CatalogueView from '@/components/catalogue/CatalogueView';
import { withCanonical } from '@/lib/seo';

export const metadata = withCanonical({
  title: 'Silver Jewellery for Women',
  description:
    'Discover beautiful sterling silver jewellery for women — necklaces, jhumkas, bangles, rings, anklets and more at Sai Praveen Jewellery.',
}, '/silver/women');

export default function SilverWomenPage() {
  return (
    <Suspense fallback={<CatalogueLoading />}>
      <CatalogueView material="silver" section="women" />
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
