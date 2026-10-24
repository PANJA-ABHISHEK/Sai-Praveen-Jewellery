'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Edit3, Loader2, Plus, Sparkles, Trash2, X } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';

const emptyForm = {
  name: '',
  description: '',
  schemeType: 'monthly',
  minAmount: '1000',
  durationMonths: '12',
  bonusText: '',
  redemptionText: '',
  benefitsText: '',
  termsText: '',
  status: 'draft',
  featured: false,
  displayOrder: '1',
};

export default function AdminSchemesPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [schemes, setSchemes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const authResponse = await fetch('/api/admin/check');
        if (!authResponse.ok) {
          router.replace('/admin/login');
          return;
        }
        setCheckingAuth(false);
        const response = await fetch('/api/admin/schemes');
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Could not load schemes');
        setSchemes(data.schemes || []);
      } catch (loadError) {
        setError(loadError.message || 'Could not load schemes');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  const updateForm = (field, value) => setForm((previous) => ({ ...previous, [field]: value }));

  const startNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setSuccess('');
  };

  const startEdit = (scheme) => {
    setEditingId(scheme.id);
    setForm({
      name: scheme.name || '',
      description: scheme.description || '',
      schemeType: scheme.schemeType || 'monthly',
      minAmount: String(scheme.minAmount || ''),
      durationMonths: String(scheme.durationMonths || ''),
      bonusText: scheme.bonusText || '',
      redemptionText: scheme.redemptionText || '',
      benefitsText: (scheme.benefits || []).join('\n'),
      termsText: (scheme.terms || []).join('\n'),
      status: scheme.status || 'draft',
      featured: Boolean(scheme.featured),
      displayOrder: String(scheme.displayOrder || 1),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    const payload = {
      ...form,
      benefits: form.benefitsText.split('\n').map((item) => item.trim()).filter(Boolean),
      terms: form.termsText.split('\n').map((item) => item.trim()).filter(Boolean),
      minAmount: Number(form.minAmount) || 0,
      durationMonths: Number(form.durationMonths) || 0,
      displayOrder: Number(form.displayOrder) || 0,
    };

    try {
      const response = await fetch(editingId ? `/api/admin/schemes/${editingId}` : '/api/admin/schemes', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not save scheme');

      if (editingId) {
        setSchemes((previous) => previous.map((scheme) => scheme.id === editingId ? data.scheme : scheme));
      } else {
        setSchemes((previous) => [...previous, data.scheme]);
      }
      startNew();
      setSuccess(editingId ? 'Scheme updated successfully.' : 'Scheme added successfully.');
    } catch (saveError) {
      setError(saveError.message || 'Could not save scheme');
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (scheme) => {
    const nextStatus = scheme.status === 'published' ? 'paused' : 'published';
    try {
      const response = await fetch(`/api/admin/schemes/${scheme.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...scheme, status: nextStatus }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not update scheme status');
      setSchemes((previous) => previous.map((item) => item.id === scheme.id ? data.scheme : item));
    } catch (statusError) {
      setError(statusError.message || 'Could not update scheme status');
    }
  };

  const removeScheme = async () => {
    if (!deleteTarget) return;

    const scheme = deleteTarget;
    setDeletingId(scheme.id);
    setError('');
    try {
      const response = await fetch(`/api/admin/schemes/${scheme.id}`, { method: 'DELETE' });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Could not delete scheme');
      }
      setSchemes((previous) => previous.filter((item) => item.id !== scheme.id));
      if (editingId === scheme.id) startNew();
      setSuccess(`“${scheme.name}” was removed from your saved schemes.`);
    } catch (deleteError) {
      setError(deleteError.message || 'Could not delete scheme');
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
    }
  };

  if (checkingAuth) {
    return <div className="flex min-h-screen items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-[#C8102E]" /></div>;
  }

  return (
    <AdminShell
      pageTitle="Jewellery Schemes"
      pageDescription="Create and publish customer savings plans."
    >
      <main className="mx-auto max-w-7xl space-y-6 px-4 pb-20 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        <p className="max-w-2xl text-sm text-gray-500">Add scheme details once. Customers will see published schemes on the website and can send an enquiry on WhatsApp.</p>
        {(error || success) && (
          <div className={`rounded-xl border p-3 text-sm ${error ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
            {error || success}
            <button type="button" onClick={() => { setError(''); setSuccess(''); }} className="float-right"><X size={16} /></button>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-[#E5E1D8] bg-white p-5 shadow-xs sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <h2 className="font-serif text-xl font-bold">{editingId ? 'Edit Scheme' : 'Add New Scheme'}</h2>
                <p className="mt-1 text-xs text-gray-500">Keep the information short and clear for customers.</p>
              </div>
              {editingId && <button type="button" onClick={startNew} className="text-xs font-semibold text-gray-500 hover:text-gray-900">Cancel edit</button>}
            </div>

            <div className="space-y-4">
              <AdminField label="Scheme name" required value={form.name} onChange={(value) => updateForm('name', value)} placeholder="e.g. Easy Gold Payment - Monthly" />
              <AdminField label="Short description" required value={form.description} onChange={(value) => updateForm('description', value)} placeholder="Flexible monthly savings for everyone" />

              <div className="grid gap-4 sm:grid-cols-2">
                <AdminSelect label="Scheme type" value={form.schemeType} onChange={(value) => updateForm('schemeType', value)} options={[['monthly', 'Monthly installment'], ['single', 'Single payment']]} />
                <AdminSelect label="Status" value={form.status} onChange={(value) => updateForm('status', value)} options={[['draft', 'Draft'], ['published', 'Published'], ['paused', 'Paused'], ['archived', 'Archived']]} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <AdminField label="Starts from (₹)" type="number" min="0" value={form.minAmount} onChange={(value) => updateForm('minAmount', value)} />
                <AdminField label="Number of months" type="number" min="0" value={form.durationMonths} onChange={(value) => updateForm('durationMonths', value)} />
              </div>

              <AdminField label="Bonus / main benefit" value={form.bonusText} onChange={(value) => updateForm('bonusText', value)} placeholder="e.g. One additional installment benefit" />
              <AdminField label="Redemption information" value={form.redemptionText} onChange={(value) => updateForm('redemptionText', value)} placeholder="e.g. Jewellery purchase in the 13th month" />

              <AdminTextarea label="Benefits (one per line)" value={form.benefitsText} onChange={(value) => updateForm('benefitsText', value)} placeholder={'Monthly installments starting from ₹1,000\nPurchase jewellery after completion'} />
              <AdminTextarea label="Terms and conditions (one per line)" value={form.termsText} onChange={(value) => updateForm('termsText', value)} placeholder={'Pay every month on time\nCash payout is not available'} />

              <div className="grid gap-4 sm:grid-cols-2">
                <AdminField label="Display order" type="number" min="0" value={form.displayOrder} onChange={(value) => updateForm('displayOrder', value)} />
                <label className="flex items-center gap-2 self-end pb-3 text-sm text-gray-700">
                  <input type="checkbox" checked={form.featured} onChange={(event) => updateForm('featured', event.target.checked)} className="h-4 w-4 accent-[#C8102E]" />
                  Show as popular
                </label>
              </div>

              <button type="submit" disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C8102E] px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#A00D24] disabled:opacity-60">
                {saving ? <Loader2 size={17} className="animate-spin" /> : <Check size={17} />}
                {saving ? 'Saving...' : editingId ? 'Update Scheme' : 'Save Scheme'}
              </button>
            </div>
          </form>

          <section className="rounded-2xl border border-[#E5E1D8] bg-white p-5 shadow-xs sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <h2 className="font-serif text-xl font-bold">Saved Schemes</h2>
                <p className="mt-1 text-xs text-gray-500">Only published schemes are visible on the website.</p>
              </div>
              <button type="button" onClick={startNew} className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"><Plus size={14} /> New</button>
            </div>

            {loading ? <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[#C8102E]" /></div> : (
              <div className="space-y-3">
                {schemes.map((scheme) => (
                  <div key={scheme.id} className="rounded-xl border border-gray-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{scheme.name}</h3>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${scheme.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>{scheme.status}</span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">{scheme.description}</p>
                        <p className="mt-2 text-xs font-medium text-[#8B6508]">Starts from ₹{Number(scheme.minAmount || 0).toLocaleString('en-IN')} {scheme.schemeType === 'monthly' && `· ${scheme.durationMonths || '-'} months`}</p>
                      </div>
                      {scheme.featured && <Sparkles size={17} className="flex-shrink-0 text-[#B38728]" />}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                      <button type="button" onClick={() => startEdit(scheme)} className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"><Edit3 size={13} /> Edit</button>
                      <button type="button" onClick={() => updateStatus(scheme)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">{scheme.status === 'published' ? 'Pause' : 'Publish'}</button>
                      <button type="button" onClick={() => { setError(''); setDeleteTarget(scheme); }} className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"><Trash2 size={13} /> Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {deleteTarget && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <button
              type="button"
              aria-label="Close delete confirmation"
              onClick={() => deletingId === null && setDeleteTarget(null)}
              className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-scheme-title"
              className="relative w-full max-w-md rounded-3xl border border-[#E9E1D2] bg-white p-6 shadow-2xl sm:p-7"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Trash2 size={21} />
              </div>
              <h2 id="delete-scheme-title" className="mt-5 font-serif text-2xl font-bold text-[#14213D]">
                Remove this scheme?
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                You are about to remove <span className="font-semibold text-slate-900">“{deleteTarget.name}”</span> from your saved schemes.
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                It will no longer be available on the customer website. You can cancel and keep it safely.
              </p>

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={deletingId !== null}
                  onClick={() => setDeleteTarget(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                >
                  Keep Scheme
                </button>
                <button
                  type="button"
                  disabled={deletingId !== null}
                  onClick={removeScheme}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-wait disabled:opacity-60"
                >
                  {deletingId !== null && <Loader2 size={16} className="animate-spin" />}
                  {deletingId !== null ? 'Removing...' : 'Remove Scheme'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </AdminShell>
  );
}

function AdminField({ label, value, onChange, type = 'text', placeholder, required = false, min }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-gray-600">{label}{required ? ' *' : ''}</span>
      <input type={type} min={min} required={required} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-gray-200 bg-[#FAF9F6] px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#C8102E] focus:bg-white focus:outline-none" />
    </label>
  );
}

function AdminSelect({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-gray-600">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-gray-200 bg-[#FAF9F6] px-3.5 py-2.5 text-sm text-gray-900 focus:border-[#C8102E] focus:bg-white focus:outline-none">
        {options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}
      </select>
    </label>
  );
}

function AdminTextarea({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-gray-600">{label}</span>
      <textarea rows={3} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-gray-200 bg-[#FAF9F6] px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#C8102E] focus:bg-white focus:outline-none" />
    </label>
  );
}
