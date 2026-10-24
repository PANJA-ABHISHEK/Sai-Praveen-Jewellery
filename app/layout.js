import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/context/CartContext';
import siteConfig from '@/lib/config';
import { STATIC_MEDIA } from '@/data/media';
import BusinessJsonLd from '@/components/seo/BusinessJsonLd';
import { getSiteUrl } from '@/lib/seo';

const siteUrl = getSiteUrl();

export const metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: {
    default: `${siteConfig.businessName} | Jewellery Showroom in Patamata, Vijayawada`,
    template: `%s | ${siteConfig.businessName}`,
  },
  description: siteConfig.description,
  icons: {
    icon: [{ url: '/logo.png', type: 'image/png', sizes: '512x512' }],
    shortcut: '/logo.png',
    apple: [{ url: '/logo.png', type: 'image/png', sizes: '512x512' }],
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
    ...(siteUrl ? { url: siteUrl } : {}),
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.businessName,
    description: siteConfig.description,
    images: [STATIC_MEDIA.logo],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'EABc1_j-nFUJN1qxG5OFNQnGsgxRa8VIb4I7ZVHtJjE',
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
          <BusinessJsonLd />
        </CartProvider>
      </body>
    </html>
  );
}
