import { Suspense } from 'react';
import CatalogueView from '@/components/catalogue/CatalogueView';
import { withCanonical } from '@/lib/seo';

export const metadata = withCanonical({
  title: 'Silver Coins',
  description: 'Explore silver coins from Sai Praveen Jewellery for gifting and special occasions.',
}, '/silver/coins');

export default function SilverCoinsPage() {
  return (
    <Suspense fallback={<CatalogueLoading />}>
      <CatalogueView material="silver" section="coins" />
    </Suspense>
  );
}

function CatalogueLoading() {
  return <div className="section-container min-h-[60vh] py-20" />;
}
