import CartClient from '@/components/cart/CartClient';

export const metadata = {
  title: 'Shopping Cart',
  description: 'Review your selected jewellery items and submit your order enquiry via WhatsApp.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartPage() {
  return <CartClient />;
}
