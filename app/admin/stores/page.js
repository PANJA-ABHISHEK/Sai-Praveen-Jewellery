'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Clock3, Edit3, Loader2, MapPin, Phone, Plus, Store, Trash2, X } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';

const emptyStore = {
  name: '',
  shortName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: 'Andhra Pradesh',
  pincode: '',
  country: 'India',
  phone: '',
  whatsappNumber: '',
  email: '',
  hoursWeekdays: '10:00 AM – 8:30 PM',
  hoursSunday: '10:00 AM – 8:30 PM',
  mapUrl: '',
  active: true,
  displayOrder: '0',
};

export default function AdminStoresPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [stores, setStores] = useState([]);
  const [form, setForm] = useState(emptyStore);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function loadStores() {
      try {
        const authResponse = await fetch('/api/admin/check');
        if (!authResponse.ok) {
          router.replace('/admin/login');
          return;
        }
        setCheckingAuth(false);
        const response = await fetch('/api/admin/stores');
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Could not load stores');
        setStores(data.stores || []);
      } catch (loadError) {
        setError(loadError.message || 'Could not load stores');
      } finally {
        setLoading(false);
      }
    }
    loadStores();
  }, [router]);

  const updateForm = (field, value) => setForm((previous) => ({ ...previous, [field]: value }));

  const startNew = ({ clearMessages = true } = {}) => {
    setEditingId(null);
    setForm(emptyStore);
    if (clearMessages) {
      setError('');
      setSuccess('');
    }
  };

  const startEdit = (store) => {
    setEditingId(store.id);
    setForm({
      ...emptyStore,
      ...store,
      displayOrder: String(store.displayOrder ?? 0),
      active: store.active !== false,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    const payload = { ...form, displayOrder: Number(form.displayOrder) || 0 };

    try {
      const response = await fetch(editingId ? `/api/admin/stores/${editingId}` : '/api/admin/stores', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not save store');

      setStores((previous) => editingId
        ? previous.map((store) => store.id === editingId ? data.store : store)
        : [...previous.filter((store) => !store.isDefault), data.store].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
      setSuccess(editingId ? 'Store updated successfully.' : 'Store added successfully.');
      startNew({ clearMessages: false });
    } catch (saveError) {
      setError(saveError.message || 'Could not save store');
    } finally {
      setSaving(false);
    }
  };

  const removeStore = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    setError('');
    try {
      const response = await fetch(`/api/admin/stores/${deleteTarget.id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not delete store');
      setStores((previous) => data.fallback ? [data.fallback] : previous.filter((store) => store.id !== deleteTarget.id));
      if (editingId === deleteTarget.id) startNew();
      setSuccess('Store removed. The website fallback address remains available until another store is added.');
    } catch (deleteError) {
      setError(deleteError.message || 'Could not delete store');
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
    }
  };

  if (checkingAuth) return <div className="flex min-h-screen items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-[#C8102E]" /></div>;

  return (
    <AdminShell pageTitle="Stores" pageDescription="Manage every showroom that appears on the contact page." actions={<button type="button" onClick={startNew} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5B1F2A] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#42151F]"><Plus size={16} /> Add store</button>}>
      <main className="mx-auto max-w-7xl space-y-6 px-4 pb-20 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        <div className="rounded-2xl border border-[#EBDDBD] bg-[#FFF9EA] p-4 text-sm leading-6 text-[#684F1A]">
          Add each branch once. Active stores appear automatically on the public Contact page in a responsive card layout, ordered by the display number below.
        </div>

        {(error || success) && <div className={`rounded-xl border p-3 text-sm ${error ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>{error || success}<button type="button" onClick={() => { setError(''); setSuccess(''); }} className="float-right"><X size={16} /></button></div>}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <form onSubmit={handleSubmit} className="rounded-3xl border border-[#E5E1D8] bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div><div className="flex items-center gap-2"><Store size={18} className="text-[#A8741D]" /><h2 className="font-serif text-xl font-bold text-[#211719]">{editingId ? 'Edit store' : 'Add a store'}</h2></div><p className="mt-1 text-xs leading-5 text-slate-500">Keep the customer-facing details accurate and easy to scan.</p></div>
              {editingId && <button type="button" onClick={startNew} className="text-xs font-semibold text-slate-500 hover:text-slate-900">Cancel edit</button>}
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-[1fr_0.55fr]"><Field label="Store name" value={form.name} onChange={(value) => updateForm('name', value)} placeholder="Sai Praveen Jewellery" required /><Field label="Short label" value={form.shortName} onChange={(value) => updateForm('shortName', value)} placeholder="Patamata" /></div>
              <Field label="Address line 1" value={form.addressLine1} onChange={(value) => updateForm('addressLine1', value)} placeholder="Door number, building or complex" required />
              <Field label="Address line 2" value={form.addressLine2} onChange={(value) => updateForm('addressLine2', value)} placeholder="Road, neighbourhood or landmark" />
              <div className="grid gap-4 sm:grid-cols-[1fr_1fr_0.65fr]"><Field label="City" value={form.city} onChange={(value) => updateForm('city', value)} placeholder="Vijayawada" required /><Field label="State" value={form.state} onChange={(value) => updateForm('state', value)} placeholder="Andhra Pradesh" required /><Field label="Pincode" value={form.pincode} onChange={(value) => updateForm('pincode', value)} placeholder="520010" required /></div>
              <div className="grid gap-4 sm:grid-cols-2"><Field label="Phone" value={form.phone} onChange={(value) => updateForm('phone', value)} placeholder="+91 79936 12666" required /><Field label="WhatsApp number" value={form.whatsappNumber} onChange={(value) => updateForm('whatsappNumber', value)} placeholder="919642273707" /></div>
              <div className="grid gap-4 sm:grid-cols-2"><Field label="Email" type="email" value={form.email} onChange={(value) => updateForm('email', value)} placeholder="store@example.com" /><Field label="Display order" type="number" value={form.displayOrder} onChange={(value) => updateForm('displayOrder', value)} placeholder="1" /></div>
              <div className="grid gap-4 sm:grid-cols-2"><Field label="Monday–Saturday hours" value={form.hoursWeekdays} onChange={(value) => updateForm('hoursWeekdays', value)} placeholder="10:00 AM – 8:30 PM" /><Field label="Sunday hours" value={form.hoursSunday} onChange={(value) => updateForm('hoursSunday', value)} placeholder="10:00 AM – 8:30 PM" /></div>
              <Field label="Google Maps link (optional)" value={form.mapUrl} onChange={(value) => updateForm('mapUrl', value)} placeholder="Paste the store's Google Maps URL" />
              <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-[#FCFCFB] px-3.5 py-3 text-sm text-slate-700"><input type="checkbox" checked={form.active} onChange={(event) => updateForm('active', event.target.checked)} className="h-4 w-4 accent-[#5B1F2A]" /> Show this store on the website</label>
              <button type="submit" disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5B1F2A] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#42151F] disabled:cursor-wait disabled:opacity-60">{saving ? <Loader2 size={17} className="animate-spin" /> : <Check size={17} />}{saving ? 'Saving store...' : editingId ? 'Update store' : 'Save store'}</button>
            </div>
          </form>

          <section className="rounded-3xl border border-[#E5E1D8] bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3 border-b border-gray-100 pb-4"><div><h2 className="font-serif text-xl font-bold text-[#211719]">Saved stores</h2><p className="mt-1 text-xs text-gray-500">Inactive stores stay saved but are hidden from customers.</p></div><span className="rounded-full bg-[#F8EEDB] px-3 py-1.5 text-xs font-bold text-[#7B5A21]">{stores.length} {stores.length === 1 ? 'store' : 'stores'}</span></div>
            {loading ? <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[#C8102E]" /></div> : stores.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 bg-[#FCFCFB] px-5 py-12 text-center"><Store className="mx-auto h-9 w-9 text-slate-300" /><h3 className="mt-3 font-semibold text-slate-800">No stores added yet</h3><p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-500">The current website address will remain visible as a fallback until you add your first managed store.</p></div> : <div className="space-y-3">{stores.map((store) => <article key={store.id} className={`rounded-2xl border p-4 transition ${store.active === false ? 'border-slate-200 bg-slate-50 opacity-70' : 'border-[#E8E0D3] bg-[#FFFDF9]'}`}><div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-[#211719]">{store.name}</h3>{store.shortName && <span className="rounded-full bg-[#F8EEDB] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#7B5A21]">{store.shortName}</span>}<span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${store.active === false ? 'bg-slate-200 text-slate-600' : 'bg-emerald-50 text-emerald-700'}`}>{store.active === false ? 'Hidden' : 'Live'}</span></div><p className="mt-2 flex items-start gap-2 text-sm leading-6 text-slate-600"><MapPin size={15} className="mt-1 shrink-0 text-[#A8741D]" />{store.addressLine1}, {store.addressLine2 && `${store.addressLine2}, `}{store.city}, {store.state} {store.pincode}</p><p className="mt-1 flex items-center gap-2 text-xs text-slate-500"><Phone size={13} />{store.phone}<span className="mx-1">·</span><Clock3 size={13} />{store.hoursWeekdays}</p></div><span className="rounded-full border border-slate-200 px-2 py-1 text-[10px] font-bold text-slate-500">#{Number(store.displayOrder || 0) + 1}</span></div><div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3"><button type="button" onClick={() => startEdit(store)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-white"><Edit3 size={13} /> Edit</button><button type="button" onClick={() => setDeleteTarget(store)} className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"><Trash2 size={13} /> Delete</button></div></article>)}</div>}
          </section>
        </div>

        {deleteTarget && <div className="fixed inset-0 z-[70] flex items-center justify-center p-4"><button type="button" aria-label="Close delete confirmation" onClick={() => deletingId === null && setDeleteTarget(null)} className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm" /><div role="dialog" aria-modal="true" className="relative w-full max-w-md rounded-3xl border border-[#E9E1D2] bg-white p-6 shadow-2xl"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600"><Trash2 size={21} /></div><h2 className="mt-5 font-serif text-2xl font-bold text-[#14213D]">Delete this store?</h2><p className="mt-2 text-sm leading-6 text-slate-600">Remove <strong>{deleteTarget.name}</strong> from the managed store list?</p><div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" onClick={() => setDeleteTarget(null)} disabled={deletingId !== null} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Keep store</button><button type="button" onClick={removeStore} disabled={deletingId !== null} className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">{deletingId !== null && <Loader2 size={16} className="animate-spin" />}Delete store</button></div></div></div>}
      </main>
    </AdminShell>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text', required = false }) {
  return <label className="block"><span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-gray-600">{label}{required ? ' *' : ''}</span><input type={type} required={required} value={value || ''} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-gray-200 bg-[#FAF9F6] px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#C8102E] focus:bg-white focus:outline-none" /></label>;
}
