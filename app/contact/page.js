import ContactClient from '@/components/contact/ContactClient';
import { withCanonical } from '@/lib/seo';

export const metadata = withCanonical({
  title: 'Contact Sai Praveen Jewellery | Vijayawada',
  description: 'Find Sai Praveen Jewellery at Municipal Complex, M G Road, Patamata, Vijayawada. View our store location and contact us for jewellery enquiries.',
}, '/contact');

export default function ContactPage() {
  return <ContactClient />;
}
