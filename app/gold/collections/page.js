import { Suspense } from 'react';
import CatalogueView from '@/components/catalogue/CatalogueView';

export const metadata = {
  title: 'Gold Collections',
  description: 'Explore gold articles and traditional pieces from Sai Praveen Jewellery.',
};

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
