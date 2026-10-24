import HomePageClient from '@/components/home/HomePageClient';
import { withCanonical } from '@/lib/seo';

export const metadata = withCanonical(
  {
    title: 'Jewellery Showroom in Patamata, Vijayawada',
    description:
      'Explore Sai Praveen Jewellery in Patamata, Vijayawada. Discover gold and silver jewellery collections, view our showroom, find directions and contact us for enquiries.',
  },
  '/'
);

export default function HomePage() {
  return <HomePageClient />;
}
