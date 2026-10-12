'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#C4B28C] flex items-center justify-center p-4 sm:p-6 relative">
      {/* Luxury dark beige ambient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#D1C19D] via-[#C4B28C] to-[#B3A077] pointer-events-none" />

      {/* Main Login Card - increased size */}
      <div className="w-full max-w-[460px] bg-white rounded-3xl shadow-2xl shadow-stone-900/15 border border-[#BFA77B]/40 relative z-10 overflow-hidden text-center">
        <div className="pt-10 pb-9 px-8 sm:px-11">
          {/* Brand Logo Emblem */}
          <div className="flex justify-center mb-3.5">
            <div
              style={{ width: '70px', height: '70px', minWidth: '70px', minHeight: '70px' }}
              className="rounded-full overflow-hidden flex items-center justify-center bg-white shadow-xs border border-stone-200 flex-shrink-0"
            >
              <img
                src="/logo.png"
                alt="Sai Praveen Jewellery"
                style={{ width: '70px', height: '70px', maxWidth: '70px', maxHeight: '70px', objectFit: 'contain' }}
                className="block rounded-full"
              />
            </div>
          </div>

          {/* Title & Subtitle */}
          <h1
            className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1915] tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Store Admin
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1.5 font-sans">
            Please sign in to manage the store.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-4.5 text-left">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#E3DDD1] rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]/25 focus:border-[#8B0000] focus:bg-white transition-all placeholder:text-stone-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#E3DDD1] rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]/25 focus:border-[#8B0000] focus:bg-white transition-all placeholder:text-stone-400"
              />
            </div>

            <div className="pt-2.5">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#23211E] hover:bg-[#121110] active:scale-[0.99] text-white font-medium rounded-xl text-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 shadow-sm"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Card Footer Strip */}
        <div className="bg-[#FAF7F0] py-3.5 text-center text-xs text-stone-500 font-medium border-t border-[#EAE3D4]">
          Sri Kankatala Jewellers Admin Portal
        </div>
      </div>
    </div>
  );
}
