import { Suspense } from 'react';
import CatalogueView from '@/components/catalogue/CatalogueView';
import { withCanonical } from '@/lib/seo';

export const metadata = withCanonical({
  title: 'Silver Collections',
  description: 'Explore silver articles and traditional pieces from Sai Praveen Jewellery.',
}, '/silver/collections');

export default function SilverCollectionsPage() {
  return (
    <Suspense fallback={<CatalogueLoading />}>
      <CatalogueView material="silver" section="collections" />
    </Suspense>
  );
}

function CatalogueLoading() {
  return <div className="section-container min-h-[60vh] py-20" />;
}
