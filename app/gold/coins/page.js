import { Suspense } from 'react';
import CatalogueView from '@/components/catalogue/CatalogueView';

export const metadata = {
  title: 'Gold Coins',
  description: 'Explore gold coins from Sai Praveen Jewellery for gifting, collecting, and special occasions.',
};

export default function GoldCoinsPage() {
  return (
    <Suspense fallback={<CatalogueLoading />}>
      <CatalogueView material="gold" section="coins" />
    </Suspense>
  );
}

function CatalogueLoading() {
  return <div className="section-container min-h-[60vh] py-20" />;
}
