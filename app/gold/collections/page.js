import { Suspense } from 'react';
import CatalogueView from '@/components/catalogue/CatalogueView';
import { withCanonical } from '@/lib/seo';

export const metadata = withCanonical({
  title: 'Gold Collections',
  description: 'Explore gold articles and traditional pieces from Sai Praveen Jewellery.',
}, '/gold/collections');

export default function GoldCollectionsPage() {
  return (
    <Suspense fallback={<CatalogueLoading />}>
      <CatalogueView material="gold" section="collections" />
    </Suspense>
  );
}

function CatalogueLoading() {
  return <div className="section-container min-h-[60vh] py-20" />;
}
