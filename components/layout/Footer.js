'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import siteConfig from '@/lib/config';

const footerCollections = [
  { label: 'Gold for Women', href: '/gold/women' },
  { label: 'Gold for Men', href: '/gold/men' },
  { label: 'Silver for Women', href: '/silver/women' },
  { label: 'Silver for Men', href: '/silver/men' },
];

const footerCategories = [
  { label: 'Necklaces', href: '/gold/women?category=Necklaces' },
  { label: 'Harams', href: '/gold/women?category=Harams' },
  { label: 'Bangles', href: '/gold/women?category=Bangles' },
  { label: 'Earrings', href: '/gold/women?category=Earrings' },
  { label: 'Rings', href: '/gold/women?category=Rings' },
  { label: 'Bracelets', href: '/gold/men?category=Bracelets' },
];

const footerLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms-of-service' },
];

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-skj-deep-olive text-white/90" role="contentinfo">
      {/* Main footer content */}
      <div className="section-container py-8 lg:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3.5 mb-4 group">
              <Image
                src="/logo.png"
                alt={siteConfig.businessName}
                width={56}
                height={56}
                className="rounded-full shadow-md brightness-105 group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="font-heading font-bold text-white text-base lg:text-lg tracking-wider leading-tight">
                  SAI PRAVEEN
                </span>
                <span className="text-[9px] tracking-[0.25em] text-skj-gold font-semibold uppercase -mt-0.5">
                  JEWELLERY
                </span>
              </div>
            </Link>
            <p className="text-sm text-white/70 leading-relaxed mb-4 max-w-xs">
              {siteConfig.description}
            </p>
          </div>

          {/* Collections */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-skj-gold mb-4"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Collections
            </h3>
            <ul className="space-y-2.5">
              {footerCollections.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-skj-gold mb-4"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Categories
            </h3>
            <ul className="space-y-2.5">
              {footerCategories.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links & contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-skj-gold mb-4"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Quick Links
            </h3>
            <ul className="space-y-2.5 mb-6">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-sm font-semibold uppercase tracking-wider text-skj-gold mb-3"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Contact
            </h3>
            <address className="not-italic text-sm text-white/70 space-y-1.5">
              <p>{siteConfig.address.line1}</p>
              <p>{siteConfig.address.city}, {siteConfig.address.state}</p>
              <p>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="hover:text-white transition-colors"
                >
                  {siteConfig.phone}
                </a>
              </p>
            </address>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="section-container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <p>© {currentYear} {siteConfig.businessName}. All rights reserved.</p>
          <p>Crafted with care for authentic Indian jewellery lovers.</p>
        </div>
      </div>
    </footer>
  );
}
