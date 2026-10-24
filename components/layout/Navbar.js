'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, Menu, X, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import {
  DEFAULT_SITE_SETTINGS,
  getAnnouncementBackground,
  getAnnouncementTextColor,
} from '@/data/siteSettings';
import { STATIC_MEDIA } from '@/data/media';

const navLinks = [
  { label: 'Home', href: '/' },
  {
    label: 'Gold',
    children: [
      { label: 'Women', href: '/gold/women' },
      { label: 'Men', href: '/gold/men' },
      { label: 'Coins', href: '/gold/coins' },
      { label: 'Collections', href: '/gold/collections' },
    ],
  },
  {
    label: 'Silver',
    children: [
      { label: 'Women', href: '/silver/women' },
      { label: 'Men', href: '/silver/men' },
      { label: 'Coins', href: '/silver/coins' },
      { label: 'Collections', href: '/silver/collections' },
    ],
  },
  { label: 'Schemes', href: '/schemes' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { getCartCount, isHydrated } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [announcement, setAnnouncement] = useState(DEFAULT_SITE_SETTINGS.announcement);
  const [ratesOpen, setRatesOpen] = useState(false);
  const [rates, setRates] = useState(null);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [ratesError, setRatesError] = useState('');
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const announcementViewportRef = useRef(null);
  const announcementMessageRef = useRef(null);
  const [announcementOverflow, setAnnouncementOverflow] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Scroll detection for compact header
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Load the announcement configured by the admin.
  useEffect(() => {
    if (pathname?.startsWith('/admin')) return undefined;

    let cancelled = false;
    fetch('/api/site-settings', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled && data?.settings?.announcement) {
          setAnnouncement(data.settings.announcement);
        }
      })
      .catch(() => {
        // Keep the default announcement if settings are unavailable.
      });

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  // Keep short announcements centered; animate only when the message cannot fit.
  useEffect(() => {
    if (pathname?.startsWith('/admin') || !announcement.enabled) {
      setAnnouncementOverflow(false);
      return undefined;
    }

    const viewport = announcementViewportRef.current;
    const message = announcementMessageRef.current;
    if (!(viewport instanceof Element) || !(message instanceof Element)) {
      setAnnouncementOverflow(false);
      return undefined;
    }

    const measureAnnouncement = () => {
      setAnnouncementOverflow(message.offsetWidth > viewport.clientWidth);
    };

    measureAnnouncement();
    window.addEventListener('resize', measureAnnouncement);
    const observer = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(measureAnnouncement)
      : null;
    if (observer) {
      observer.observe(viewport);
      observer.observe(message);
    }

    return () => {
      window.removeEventListener('resize', measureAnnouncement);
      observer?.disconnect();
    };
  }, [pathname, announcement.enabled, announcement.message]);

  // Close desktop dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      // Ignore clicks inside the mobile drawer completely
      if (mobileMenuRef.current && mobileMenuRef.current.contains(e.target)) {
        return;
      }
      // If clicking outside the desktop nav, close the dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const cartCount = isHydrated ? getCartCount() : 0;
  const announcementBackground = getAnnouncementBackground(announcement.backgroundColor);
  const announcementText = getAnnouncementTextColor(announcement.textColor);

  const openRates = async () => {
    setRatesOpen(true);
    if (rates || ratesLoading) return;

    setRatesLoading(true);
    setRatesError('');
    try {
      const response = await fetch('/api/gold-rates', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load today\'s rates');
      setRates(data.rates || null);
    } catch (error) {
      setRatesError(error.message || 'Unable to load today\'s rates');
    } finally {
      setRatesLoading(false);
    }
  };

  const isActive = (href) => pathname === href;
  const isParentActive = (children) =>
    children?.some((c) => pathname === c.href);

  // Hide storefront navbar on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm'
            : 'bg-white'
        }`}
      >
        {/* Admin-controlled announcement bar */}
        {announcement.enabled && (
          <div
            className="overflow-hidden"
            style={{
              backgroundColor: announcementBackground.value,
              color: announcementText.value,
            }}
          >
            <div
              ref={announcementViewportRef}
              className="section-container flex h-[30px] items-center overflow-hidden px-4 py-1.5 text-center text-xs tracking-wide sm:text-[13px]"
              aria-live="polite"
            >
              <div
                className={`flex min-w-max items-center whitespace-nowrap ${announcementOverflow ? 'announcement-marquee gap-8' : 'mx-auto'}`}
                style={announcementOverflow ? { '--announcement-gap-offset': '1rem' } : undefined}
              >
                <span ref={announcementMessageRef}>{announcement.message}</span>
                {announcementOverflow && (
                  <span aria-hidden="true">{announcement.message}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main navigation bar */}
        <nav
          ref={dropdownRef}
          className="section-container"
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="flex items-center justify-between py-2 transition-all duration-300">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 flex-shrink-0 relative group"
              aria-label="Sai Praveen Jewellery — Home"
            >
              <Image
                src={STATIC_MEDIA.logo}
                alt="Sai Praveen Jewellery Logo"
                width={48}
                height={48}
                className="h-10 w-10 rounded-full object-contain shadow-sm transition-all duration-300 lg:h-12 lg:w-12"
                priority
              />
              <div className="flex flex-col">
                <span className="font-heading font-bold text-skj-charcoal text-base lg:text-lg tracking-wider leading-tight group-hover:text-skj-olive transition-colors">
                  SAI PRAVEEN
                </span>
                <span className="text-[9px] lg:text-[10px] tracking-[0.26em] text-skj-gold font-semibold uppercase -mt-0.5">
                  JEWELLERY
                </span>
              </div>
            </Link>

            {/* Desktop navigation links */}
            <ul className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) =>
                link.children ? (
                  <li key={link.label} className="relative">
                    <button
                      onClick={() =>
                        setOpenDropdown(openDropdown === link.label ? null : link.label)
                      }
                      className={`flex items-center gap-1 px-4 py-2 text-sm font-medium tracking-wide transition-colors ${
                        isParentActive(link.children)
                          ? 'text-skj-olive'
                          : 'text-skj-charcoal hover:text-skj-olive'
                      }`}
                      aria-expanded={openDropdown === link.label}
                      aria-haspopup="true"
                    >
                      {link.label}
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          openDropdown === link.label ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Dropdown */}
                    {openDropdown === link.label && (
                      <div className="absolute left-0 top-full mt-3 min-w-[190px] overflow-hidden rounded-2xl border border-skj-gold/35 border-t-2 border-t-skj-gold bg-white/95 p-1.5 shadow-[0_18px_45px_rgba(33,23,25,0.16)] backdrop-blur-md animate-fadeIn">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`block rounded-xl px-4 py-2.5 text-sm transition-all ${
                              isActive(child.href)
                                ? 'bg-skj-ivory font-medium text-skj-olive'
                                : 'text-skj-charcoal hover:bg-[#FFF8E8] hover:pl-5 hover:text-skj-olive'
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                ) : (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={`px-4 py-2 text-sm font-medium tracking-wide transition-colors ${
                        isActive(link.href)
                          ? 'text-skj-olive'
                          : 'text-skj-charcoal hover:text-skj-olive'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              )}
            </ul>

            {/* Right actions: Cart, Mobile menu */}
            <div className="flex items-center gap-2 lg:gap-3">
              {/* Today's gold and silver rates */}
              <button
                type="button"
                onClick={openRates}
                className="hidden sm:inline-flex items-center gap-2 rounded-full border border-skj-gold bg-skj-ivory px-3 py-2 text-xs lg:text-sm font-medium text-skj-charcoal shadow-sm hover:bg-[#fff8df] transition-colors"
                aria-haspopup="dialog"
                aria-expanded={ratesOpen}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
                <span>Today&apos;s Rates</span>
              </button>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 text-skj-charcoal hover:text-skj-olive transition-colors"
                aria-label={`Shopping cart, ${cartCount} items`}
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-skj-red text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-skj-charcoal hover:text-skj-olive transition-colors"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <aside
            ref={mobileMenuRef}
            className="absolute top-0 right-0 h-full w-[300px] max-w-[85vw] bg-white shadow-2xl overflow-y-auto animate-slideInRight"
            role="dialog"
            aria-label="Mobile navigation menu"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-skj-border">
              <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
                <Image
                  src={STATIC_MEDIA.logo}
                  alt="Sai Praveen Jewellery"
                  width={40}
                  height={40}
                  className="rounded-full shadow-sm"
                />
                <div className="flex flex-col">
                  <span className="font-heading font-bold text-skj-charcoal text-sm leading-tight">
                    SAI PRAVEEN
                  </span>
                  <span className="text-[9px] tracking-widest text-skj-gold font-semibold uppercase">
                    JEWELLERY
                  </span>
                </div>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 text-skj-charcoal"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Menu links */}
            <nav className="py-4" aria-label="Mobile navigation">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label} className="border-b border-skj-border/50">
                    <button
                      onClick={() =>
                        setOpenDropdown(openDropdown === link.label ? null : link.label)
                      }
                      className={`flex items-center justify-between w-full px-5 py-3.5 text-sm font-medium ${
                        isParentActive(link.children)
                          ? 'text-skj-olive'
                          : 'text-skj-charcoal'
                      }`}
                      aria-expanded={openDropdown === link.label}
                    >
                      {link.label}
                      <ChevronRight
                        size={16}
                        className={`transition-transform duration-200 ${
                          openDropdown === link.label ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                    {openDropdown === link.label && (
                      <div className="bg-skj-ivory/60 py-1">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`block px-8 py-3 text-sm ${
                              isActive(child.href)
                                ? 'text-skj-olive font-medium'
                                : 'text-skj-charcoal hover:text-skj-olive'
                            }`}
                            onClick={() => {
                              setMobileOpen(false);
                            }}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`block px-5 py-3.5 text-sm font-medium border-b border-skj-border/50 ${
                      isActive(link.href)
                        ? 'text-skj-olive'
                        : 'text-skj-charcoal hover:text-skj-olive'
                    }`}
                    onClick={() => {
                      setMobileOpen(false);
                    }}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* Mobile drawer footer */}
            <div className="px-5 py-4 mt-4 border-t border-skj-border">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  openRates();
                }}
                className="w-full mb-3 inline-flex items-center justify-center gap-2 rounded-full border border-skj-gold bg-skj-ivory px-3 py-2.5 text-sm font-medium text-skj-charcoal"
              >
                Today&apos;s Gold &amp; Silver Rates
              </button>
              <Link
                href="/cart"
                className="btn-primary w-full justify-center"
                onClick={() => {
                  setMobileOpen(false);
                }}
              >
                <ShoppingBag size={16} />
                View Cart {cartCount > 0 && `(${cartCount})`}
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* Spacer to prevent content from being hidden behind the fixed header */}
      <div
        className={announcement.enabled ? 'h-[86px] lg:h-[94px]' : 'h-[56px] lg:h-[64px]'}
        aria-hidden="true"
      />

      {/* Today's rates dialog */}
      {ratesOpen && (
        <div
          className="fixed inset-0 z-[70]"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setRatesOpen(false);
          }}
        >
          <section
            className="absolute top-[72px] right-3 w-[calc(100vw-1.5rem)] max-w-[360px] rounded-2xl border border-skj-border/70 bg-white p-4 shadow-2xl sm:top-[104px] sm:right-6 sm:p-5 lg:right-[max(1rem,calc((100vw-1280px)/2))]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="todays-rates-title"
          >
            <div className="flex items-center justify-between border-b border-skj-border/50 pb-4">
              <h2 id="todays-rates-title" className="flex items-center gap-2 font-heading text-base font-semibold text-skj-charcoal">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
                Today&apos;s Rates
              </h2>
              <button
                type="button"
                onClick={() => setRatesOpen(false)}
                className="rounded-full p-1.5 text-skj-muted hover:bg-skj-ivory hover:text-skj-charcoal"
                aria-label="Close today's rates"
              >
                <X size={20} />
              </button>
            </div>

            {ratesLoading ? (
              <div className="flex items-center justify-center gap-2 py-12 text-sm text-skj-muted">
                <Loader2 size={18} className="animate-spin text-skj-olive" />
                Loading latest rates...
              </div>
            ) : ratesError ? (
              <p className="py-10 text-center text-sm text-skj-red">{ratesError}</p>
            ) : rates ? (
              <>
                <div className="space-y-2.5 py-4">
                  <RateRow label="Gold (22K / 1g)" value={rates.gold22k} tone="gold" />
                  <RateRow label="Gold (24K / 1g)" value={rates.gold24k} tone="gold" />
                  <RateRow label="Silver (1g)" value={rates.silver925} tone="silver" />
                </div>
                <p className="border-t border-skj-border/50 pt-4 text-center text-xs text-skj-muted">
                  Last updated: {formatRateDate(rates.updatedAt)}
                </p>
              </>
            ) : (
              <p className="py-10 text-center text-sm text-skj-muted">
                Today&apos;s rates have not been added yet.
              </p>
            )}
          </section>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

function RateRow({ label, value, tone }) {
  const formatted = Number(value) > 0
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)
    : 'Not set';

  return (
    <div className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 ${
      tone === 'gold'
        ? 'border-[#F3D478] bg-[#fffdf3]'
        : 'border-slate-200 bg-slate-50'
    }`}>
      <span className="text-xs sm:text-sm font-medium text-skj-charcoal">{label}</span>
      <span className={`text-base font-bold ${tone === 'gold' ? 'text-amber-700' : 'text-slate-800'}`}>
        {formatted}
      </span>
    </div>
  );
}

function formatRateDate(value) {
  if (!value) return 'Not available';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not available';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}
