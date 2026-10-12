import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/context/CartContext';
import siteConfig from '@/lib/config';

export const metadata = {
  title: {
    default: `${siteConfig.businessName} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.businessName}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  keywords: [
    'jewellery',
    'gold jewellery',
    'silver jewellery',
    'Indian jewellery',
    'Sai Praveen Jewellery',
    'SPJ',
    'Ravulapalem jewellery',
    'necklaces',
    'bangles',
    'earrings',
    'wedding jewellery',
  ],
  openGraph: {
    title: siteConfig.businessName,
    description: siteConfig.description,
    type: 'website',
    locale: 'en_IN',
    siteName: siteConfig.businessName,
    images: [{ url: '/logo.png', width: 800, height: 800, alt: siteConfig.businessName }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
