import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/context/CartContext';
import siteConfig from '@/lib/config';
import { STATIC_MEDIA } from '@/data/media';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: `${siteConfig.businessName} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.businessName}`,
  },
  description: siteConfig.description,
  icons: {
    icon: STATIC_MEDIA.logo,
    apple: STATIC_MEDIA.logo,
  },
  keywords: [
    'jewellery',
    'gold jewellery',
    'silver jewellery',
    'Indian jewellery',
    'Sai Praveen Jewellery',
    'SPJ',
    'Vijayawada jewellery',
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
    images: [{ url: STATIC_MEDIA.logo, width: 512, height: 512, alt: siteConfig.businessName }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
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
