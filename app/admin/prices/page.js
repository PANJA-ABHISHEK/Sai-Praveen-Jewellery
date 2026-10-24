'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import RatesManager from '@/components/admin/RatesManager';

export default function AdminPricesPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/admin/check');
        if (!response.ok) {
          router.replace('/admin/login');
          return;
        }
        setCheckingAuth(false);
      } catch {
        router.replace('/admin/login');
      }
    }

    checkAuth();
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#C8102E]" />
      </div>
    );
  }

  return (
    <AdminShell
      pageTitle="Gold & Silver Prices"
      pageDescription="Update daily metal rates used by the store."
      backHref="/admin"
      backLabel="Back to Products"
    >
      <RatesManager />
    </AdminShell>
  );
}
