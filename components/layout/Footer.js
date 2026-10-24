'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Mail } from 'lucide-react';
import siteConfig from '@/lib/config';
import SocialLinks from '@/components/common/SocialLinks';
import { STATIC_MEDIA } from '@/data/media';

const footerCollections = [
  { label: 'Gold for Women', href: '/gold/women' },
  { label: 'Gold for Men', href: '/gold/men' },
  { label: 'Silver for Women', href: '/silver/women' },
  { label: 'Silver for Men', href: '/silver/men' },
];

const footerCategories = [
  { label: 'Necklaces', href: '/category/necklaces' },
  { label: 'Bangles', href: '/category/bangles' },
  { label: 'Rings', href: '/category/rings' },
  { label: 'Bracelets', href: '/category/bracelets' },
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
      <div className="section-container py-9 lg:py-10">
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1fr_1.2fr] lg:gap-5">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 mb-3 group">
              <Image
                src={STATIC_MEDIA.logo}
                alt={siteConfig.businessName}
                width={48}
                height={48}
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
            <p className="max-w-xs text-sm leading-6 text-white/70">
              {siteConfig.description}
            </p>
            <SocialLinks className="mt-5" />
          </div>

          {/* Collections */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-skj-gold"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Collections
            </h3>
            <ul className="space-y-1.5">
              {footerCollections.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm leading-6 text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-skj-gold"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Categories
            </h3>
            <ul className="space-y-1.5">
              {footerCategories.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm leading-6 text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-skj-gold"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Explore
            </h3>
            <ul className="mb-5 space-y-1.5">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm leading-6 text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-skj-gold"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Contact
            </h3>
            <address className="not-italic space-y-1 text-sm leading-6 text-white/70">
              <p>{siteConfig.address.line1}</p>
              <p>{siteConfig.address.line2}</p>
              <p>{siteConfig.address.city},</p>
              <p>{siteConfig.address.state} - {siteConfig.address.pincode}</p>
              <p>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="transition-colors hover:text-white"
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
        <div className="section-container flex flex-col items-center justify-between gap-1 py-4 text-xs text-white/50 sm:flex-row">
          <div className="text-center sm:text-left">
          <p>© {currentYear} {siteConfig.businessName}. All rights reserved.</p>
          <p className="mt-1">
            Developed by{' '}
            <a
              href="mailto:panjabhishek57@gmail.com"
              className="inline-flex items-center gap-1 transition-colors hover:text-white"
              title="Email Panja Abhishek"
            >
              Panja Abhishek <Mail className="h-3 w-3" aria-hidden="true" />
            </a>{' '}
            and{' '}
            <a
              href="mailto:bhaskarvanjarapu207@gmail.com"
              className="inline-flex items-center gap-1 transition-colors hover:text-white"
              title="Email Bhaskar Vanjarapu"
            >
              Bhaskar Vanjarapu <Mail className="h-3 w-3" aria-hidden="true" />
            </a>
          </p>
          </div>
          <p>Crafted with care for authentic Indian jewellery lovers.</p>
        </div>
      </div>
    </footer>
  );
}
