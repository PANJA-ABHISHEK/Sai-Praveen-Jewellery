import SchemesClient from '@/components/schemes/SchemesClient';
import { withCanonical } from '@/lib/seo';

export const metadata = withCanonical({
  title: 'Jewellery Schemes',
  description: 'Explore jewellery savings schemes from Sai Praveen Jewellery in Vijayawada and plan your next jewellery purchase.',
}, '/schemes');

export default function SchemesPage() {
  return <SchemesClient />;
}
