'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ChevronRight,
  Coins,
  LogOut,
  Menu,
  Package,
  Settings as SettingsIcon,
  Sparkles,
  Store,
  X,
} from 'lucide-react';
import { STATIC_MEDIA } from '@/data/media';

const navigationGroups = [
  {
    label: '',
    items: [
      { label: 'Products', href: '/admin', icon: Package, exact: true },
      { label: 'Gold & Silver Prices', href: '/admin/prices', icon: Coins },
      { label: 'Jewellery Schemes', href: '/admin/schemes', icon: Sparkles },
      { label: 'Stores', href: '/admin/stores', icon: Store },
      { label: 'Settings', href: '/admin/settings', icon: SettingsIcon },
    ],
  },
];

function isItemActive(item, pathname) {
  if (item.external) return false;
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function Brand({ onNavigate, showLabel = false }) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      title="Visit website"
      className="flex min-h-[104px] min-w-0 items-center gap-3 px-4 py-5 xl:px-5"
    >
      <img
        src={STATIC_MEDIA.logo}
        alt="Sai Praveen Jewellery"
        className="h-11 w-11 shrink-0 rounded-full object-contain"
      />
      <span className={`${showLabel ? 'block' : 'hidden xl:block'} min-w-0`}>
        <span className="block truncate font-serif text-[17px] font-bold leading-tight text-[#14213D]">
          Sai Praveen Jewellery
        </span>
        <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C99624]">
          Admin Portal
        </span>
      </span>
    </Link>
  );
}

function MobileBrand() {
  return (
    <Link href="/" title="Visit website" className="flex min-w-0 items-center gap-2.5">
      <img
        src={STATIC_MEDIA.logo}
        alt="Sai Praveen Jewellery"
        className="h-9 w-9 shrink-0 rounded-full object-contain"
      />
      <span className="min-w-0">
        <span className="block truncate font-serif text-sm font-bold leading-tight text-[#14213D]">
          Sai Praveen Jewellery
        </span>
        <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#C99624]">
          Admin Portal
        </span>
      </span>
    </Link>
  );
}

function Navigation({ onNavigate, pathname, showLabels = false }) {
  return (
    <nav className="flex-1 overflow-y-auto px-3 pb-5 pt-2 xl:px-4">
      {navigationGroups.map((group) => (
        <div key={group.label} className="mb-5 last:mb-0">
          {group.label && (
            <p className={`${showLabels ? 'block' : 'hidden xl:block'} mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400`}>
              {group.label}
            </p>
          )}
          <div className="space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item, pathname);

              return (
                <Link
                  key={`${group.label}-${item.label}`}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noreferrer' : undefined}
                  onClick={onNavigate}
                  title={item.label}
                  aria-current={active ? 'page' : undefined}
                  className={`group flex items-center ${showLabels ? 'justify-start' : 'justify-center xl:justify-start'} gap-3 rounded-xl px-3 py-3 text-sm font-medium transition xl:px-3.5 ${
                    active
                      ? 'bg-[#FFF7E6] text-[#A96F00] shadow-sm ring-1 ring-[#F1D18A]'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-[#14213D]'
                  }`}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.8} />
                  <span className={`${showLabels ? 'block' : 'hidden xl:block'} truncate`}>{item.label}</span>
                  {active && <ChevronRight className={`${showLabels ? 'ml-auto block' : 'ml-auto hidden h-4 w-4 xl:block'} h-4 w-4`} />}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function AdminAccount({ showLabel = false }) {
  return (
    <div className={`${showLabel ? 'flex' : 'hidden xl:flex'} mb-2 items-center gap-3 rounded-xl border border-[#E9E1D2] bg-[#FFFDF8] p-3`}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EFE8DA] text-sm font-bold text-[#7D5A20]">
        A
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-900">Admin</p>
        <p className="truncate text-xs text-slate-400">Administrator</p>
      </div>
    </div>
  );
}

export default function AdminShell({
  children,
  pageTitle = 'Admin Dashboard',
  pageDescription,
  actions,
  backHref,
  backLabel = 'Back to Products',
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    setMobileOpen(false);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } finally {
      router.replace('/admin/login');
    }
  };

  const closeMobileMenu = () => setMobileOpen(false);

  const sidebarContent = (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <div className="border-b border-slate-100">
        <Brand onNavigate={closeMobileMenu} />
      </div>

      <Navigation onNavigate={closeMobileMenu} pathname={pathname} />

      <div className="border-t border-slate-100 p-3 xl:p-4">
        <AdminAccount />
        <button
          type="button"
          onClick={handleLogout}
          title="Sign out"
          className="flex w-full items-center justify-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600 xl:justify-start xl:px-3.5"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" strokeWidth={1.8} />
          <span className="hidden xl:block">Sign out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-gray-900">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-20 border-r border-slate-200 bg-white lg:flex xl:w-64">
        {sidebarContent}
      </aside>

      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          aria-label="Close navigation"
          onClick={closeMobileMenu}
          className={`absolute inset-0 bg-slate-950/40 transition-opacity ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <aside
          aria-label="Admin navigation"
          className={`relative flex h-full w-[min(84vw,300px)] flex-col border-r border-slate-200 bg-white shadow-2xl transition-transform duration-200 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-100">
            <Brand onNavigate={closeMobileMenu} showLabel />
            <button
              type="button"
              aria-label="Close navigation"
              onClick={closeMobileMenu}
              className="mr-3 rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <Navigation onNavigate={closeMobileMenu} pathname={pathname} showLabels />
          <div className="border-t border-slate-100 p-3">
            <AdminAccount showLabel />
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-[18px] w-[18px]" strokeWidth={1.8} />
              Sign out
            </button>
          </div>
        </aside>
      </div>

      <div className="min-h-screen lg:pl-20 xl:pl-64">
        <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur lg:hidden">
          <div className="flex min-h-[68px] items-center justify-between gap-3 px-3 sm:px-5">
            <div className="min-w-0 flex-1">
              <MobileBrand />
            </div>

            <button
              type="button"
              aria-label="Open navigation"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
              className="shrink-0 rounded-xl border border-slate-200 p-2.5 text-slate-700 transition hover:bg-slate-50"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        <main className="lg:pl-5">
          <div className="border-b border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10 lg:py-5">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  {backHref && (
                    <Link
                      href={backHref}
                      aria-label={backLabel}
                      title={backLabel}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#E8DDC8] bg-[#FFFDF8] text-slate-700 shadow-xs transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Link>
                  )}
                  <div className="min-w-0">
                    <h1 className="truncate font-serif text-2xl font-bold leading-tight text-[#14213D] sm:text-3xl lg:text-4xl">
                      {pageTitle}
                    </h1>
                    {pageDescription && (
                      <p className="mt-1 max-w-2xl truncate text-sm text-slate-500 sm:text-base">
                        {pageDescription}
                      </p>
                    )}
                  </div>
                </div>

                {actions && (
                  <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto lg:shrink-0 lg:items-center lg:justify-end">
                    {actions}
                  </div>
                )}
              </div>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
