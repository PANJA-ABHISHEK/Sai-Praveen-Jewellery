'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  History,
  Loader2,
  Save,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const EMPTY_RATES = {
  gold22k: '',
  gold24k: '',
  gold18k: '',
  silver925: '',
  silverPremium: '',
  silverArticles: '',
};

const GOLD_FIELDS = [
  { key: 'gold22k', label: '22K Gold' },
  { key: 'gold24k', label: '24K Gold' },
  { key: 'gold18k', label: '18K Gold' },
];

const SILVER_FIELDS = [
  { key: 'silver925', label: '92.5% Silver' },
  { key: 'silverPremium', label: 'Premium Silver' },
  { key: 'silverArticles', label: 'Traditional Silver' },
];

function formatUpdatedAt(value) {
  if (!value) return 'Not updated yet';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not updated yet';

  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function RateSection({ title, tone, fields, values, onChange }) {
  const isGold = tone === 'gold';

  return (
    <section className={`rounded-2xl border p-4 sm:p-5 ${isGold ? 'border-amber-200/70 bg-amber-50/30' : 'border-slate-200 bg-slate-50/70'}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${isGold ? 'bg-amber-500' : 'bg-slate-500'}`} />
          <h2 className="font-serif text-base font-bold text-slate-900 sm:text-lg">{title}</h2>
        </div>
        <span className="text-[11px] font-medium text-slate-500">Per gram</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {fields.map((field) => (
          <label key={field.key} className="block">
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-slate-600">
              {field.label}
            </span>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-2.5 text-xs font-semibold text-slate-400">₹</span>
              <input
                type="number"
                min="1"
                step="1"
                required
                value={values[field.key]}
                onChange={(event) => onChange(field.key, event.target.value)}
                placeholder="0"
                className={`w-full rounded-xl border bg-white py-2.5 pl-7 pr-8 text-sm font-semibold text-slate-900 outline-none transition focus:ring-2 ${isGold ? 'border-amber-200 focus:border-amber-500 focus:ring-amber-200' : 'border-slate-200 focus:border-slate-500 focus:ring-slate-200'}`}
              />
              <span className="pointer-events-none absolute right-3 top-2.5 text-[11px] text-slate-400">/g</span>
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}

export default function RatesManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadedRates, setLoadedRates] = useState(null);
  const [values, setValues] = useState(EMPTY_RATES);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [changes, setChanges] = useState([]);

  const allFields = useMemo(() => [...GOLD_FIELDS, ...SILVER_FIELDS], []);

  const loadRates = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/gold-rates');
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Could not load daily rates');

      const rates = data.rates || {};
      setLoadedRates(rates);
      setValues({
        gold22k: rates.gold22k === undefined ? '' : String(rates.gold22k),
        gold24k: rates.gold24k === undefined ? '' : String(rates.gold24k),
        gold18k: rates.gold18k === undefined ? '' : String(rates.gold18k),
        silver925: rates.silver925 === undefined ? '' : String(rates.silver925),
        silverPremium: rates.silverPremium === undefined ? '' : String(rates.silverPremium),
        silverArticles: rates.silverArticles === undefined ? '' : String(rates.silverArticles),
      });
    } catch (loadError) {
      setError(loadError.message || 'Could not load daily rates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRates();
  }, []);

  const handleChange = (key, value) => {
    setValues((previous) => ({ ...previous, [key]: value }));
    setError('');
    setSuccess('');
  };

  const handleReviewChanges = (event) => {
    event.preventDefault();
    setError('');

    for (const field of allFields) {
      const numericValue = Number(values[field.key]);
      if (!Number.isFinite(numericValue) || numericValue <= 0) {
        setError(`Please enter a valid rate for ${field.label}.`);
        return;
      }
    }

    const nextChanges = allFields
      .map((field) => {
        const oldValue = loadedRates?.[field.key] === undefined ? null : Number(loadedRates[field.key]);
        const newValue = Number(values[field.key]);
        return {
          ...field,
          oldValue,
          newValue,
          difference: oldValue === null ? null : newValue - oldValue,
        };
      })
      .filter((change) => change.oldValue !== change.newValue);

    if (nextChanges.length === 0) {
      setError('No rate changes detected. Modify at least one rate before saving.');
      return;
    }

    setChanges(nextChanges);
    setConfirmationOpen(true);
  };

  const handleConfirmSave = async () => {
    setSaving(true);
    setError('');

    try {
      const response = await fetch('/api/gold-rates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gold22k: Number(values.gold22k),
          gold24k: Number(values.gold24k),
          gold18k: Number(values.gold18k),
          silver925: Number(values.silver925),
          silverPremium: Number(values.silverPremium),
          silverArticles: Number(values.silverArticles),
        }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Could not update daily rates');

      setConfirmationOpen(false);
      setSuccess('Daily rates updated successfully. Product prices were refreshed.');
      await loadRates();
    } catch (saveError) {
      setError(saveError.message || 'Could not update daily rates');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 pb-20 pt-6 sm:px-6 lg:px-8 lg:pt-8">
      {success && (
        <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <form onSubmit={handleReviewChanges} className="rounded-2xl border border-[#E5E1D8] bg-white p-5 shadow-xs sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#14213D]">Today&apos;s Rates</h2>
              <p className="mt-1 text-xs text-slate-500">All values are in Indian rupees per gram.</p>
            </div>
            {loading && <Loader2 className="h-5 w-5 animate-spin text-amber-700" />}
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center text-sm text-slate-500">
              Loading current rates...
            </div>
          ) : (
            <div className="space-y-4">
              <RateSection title="Gold Prices" tone="gold" fields={GOLD_FIELDS} values={values} onChange={handleChange} />
              <RateSection title="Silver Prices" tone="silver" fields={SILVER_FIELDS} values={values} onChange={handleChange} />

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <History className="h-4 w-4" />
                  Last updated: {formatUpdatedAt(loadedRates?.updatedAt)}
                </div>
                <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-[#C8102E] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-[#C8102E]/20 transition hover:bg-[#A00D24]">
                  <Save className="h-4 w-4" />
                  Review &amp; Save Rates
                </button>
              </div>
            </div>
          )}
        </form>

        <aside className="h-fit rounded-2xl border border-[#E5E1D8] bg-[#FFF9EA] p-5 shadow-xs sm:p-6">
          <h2 className="font-serif text-lg font-bold text-[#14213D]">How pricing works</h2>
          <div className="mt-4 space-y-4 text-sm text-slate-600">
            <p>1. Enter the latest market rate for each metal type.</p>
            <p>2. Review the changes before confirming.</p>
            <p>3. Confirm to refresh matching catalogue prices.</p>
          </div>
          <div className="mt-5 rounded-xl border border-amber-200 bg-white/70 p-3 text-xs leading-relaxed text-amber-900">
            Update these values whenever your shop changes its daily rate. Customers will see the latest published prices on the website.
          </div>
        </aside>
      </div>

      {confirmationOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-100 bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-slate-900">Confirm rate changes</h2>
                <p className="mt-1 text-xs text-slate-500">These changes will refresh matching catalogue prices.</p>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
              <div className="grid grid-cols-3 bg-slate-50 px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                <span>Rate</span><span className="text-center">Current</span><span className="text-right">New</span>
              </div>
              <div className="divide-y divide-slate-100">
                {changes.map((change) => (
                  <div key={change.key} className="grid grid-cols-3 items-center px-3 py-2.5 text-xs">
                    <span className="font-medium text-slate-800">{change.label}</span>
                    <span className="text-center text-slate-500">{change.oldValue === null ? 'Not set' : `${formatPrice(change.oldValue)}/g`}</span>
                    <span className="text-right font-bold text-slate-900">{formatPrice(change.newValue)}/g</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <button type="button" disabled={saving} onClick={() => setConfirmationOpen(false)} className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50">
                Go Back &amp; Edit
              </button>
              <button type="button" disabled={saving} onClick={handleConfirmSave} className="inline-flex items-center gap-2 rounded-xl bg-[#C8102E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#A00D24] disabled:opacity-60">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Confirm &amp; Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
