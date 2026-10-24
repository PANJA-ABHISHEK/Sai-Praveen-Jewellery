'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { CheckCircle2, Loader2, MessageCircle, X } from 'lucide-react';
import { SCHEME_WHATSAPP_NUMBER } from '@/data/schemes';
import { STATIC_MEDIA } from '@/data/media';

function formatAmount(amount) {
  if (!Number(amount)) return 'As decided with the showroom';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function SchemesClient() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function loadSchemes() {
      try {
        const response = await fetch('/api/schemes');
        const data = await response.json();
        if (Array.isArray(data.schemes)) setSchemes(data.schemes);
      } catch (error) {
        console.error('Could not load schemes:', error);
      } finally {
        setLoading(false);
      }
    }
    loadSchemes();
  }, []);

  return (
    <main className="min-h-screen bg-skj-ivory/40">
      <section className="relative isolate overflow-hidden px-4 py-9 text-center text-white sm:py-12 lg:py-14">
        <div className="absolute inset-0 -z-20 hidden md:block">
          <Image src={STATIC_MEDIA.schemes.desktop} alt="" fill priority sizes="100vw" className="object-cover object-center" />
        </div>
        <div className="absolute inset-0 -z-20 md:hidden">
          <Image src={STATIC_MEDIA.schemes.mobile} alt="" fill priority sizes="100vw" className="object-cover object-center" />
        </div>
        <div className="absolute inset-0 -z-10 bg-[#35141E]/25" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-5 py-4 sm:px-10 sm:py-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-skj-gold">
            Plan today. Wear it tomorrow.
          </p>
          <h1 className="font-heading text-4xl font-semibold drop-shadow-[0_3px_10px_rgba(0,0,0,0.45)] sm:text-5xl lg:text-6xl">Jewellery Schemes</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)] sm:text-base">
            Save comfortably and plan your next jewellery purchase with a scheme from Sai Praveen Jewellery.
          </p>
        </div>
      </section>

      <section className="section-container py-10 sm:py-14">
        {loading ? (
          <div className="flex justify-center py-20 text-skj-muted">
            <Loader2 className="animate-spin" />
          </div>
        ) : schemes.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-skj-border bg-white p-10 text-center">
            <h2 className="font-heading text-2xl text-skj-charcoal">Schemes coming soon</h2>
            <p className="mt-2 text-sm text-skj-muted">Please contact our showroom for current offers.</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${schemes.length === 1 ? 'mx-auto max-w-2xl' : 'lg:grid-cols-2'}`}>
            {schemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} onInterest={() => setSelectedScheme(scheme)} />
            ))}
          </div>
        )}
      </section>

      {selectedScheme && (
        <InterestModal
          scheme={selectedScheme}
          submitted={submitted}
          onClose={() => {
            setSelectedScheme(null);
            setSubmitted(false);
          }}
          onSubmitted={() => setSubmitted(true)}
        />
      )}
    </main>
  );
}

function SchemeCard({ scheme, onInterest }) {
  return (
    <article className="rounded-3xl border border-skj-gold/20 bg-white/95 p-6 shadow-[0_14px_35px_rgba(54,24,29,0.08)] sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-skj-olive">
            {scheme.schemeType === 'single' ? 'Single Payment' : 'Monthly Scheme'}
          </span>
          <h2 className="mt-2 font-heading text-2xl font-semibold text-skj-charcoal">{scheme.name}</h2>
          <p className="mt-2 text-sm text-skj-muted">{scheme.description}</p>
        </div>
        {scheme.featured && (
          <span className="rounded-full bg-skj-ivory px-3 py-1 text-[11px] font-semibold text-skj-olive">
            Popular
          </span>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-skj-border/70 bg-skj-ivory/50 p-4">
          <p className="text-xs text-skj-muted">Starts from</p>
          <p className="mt-1 text-lg font-bold text-skj-charcoal">{formatAmount(scheme.minAmount)}</p>
        </div>
        <div className="rounded-xl border border-skj-border/70 bg-skj-ivory/50 p-4">
          <p className="text-xs text-skj-muted">Duration</p>
          <p className="mt-1 text-lg font-bold text-skj-charcoal">
            {scheme.schemeType === 'single' ? 'One-time' : `${scheme.durationMonths || '-'} months`}
          </p>
        </div>
      </div>

      {scheme.benefits?.length > 0 && (
        <ul className="mt-6 space-y-3">
          {scheme.benefits.map((benefit, index) => (
            <li key={`${benefit}-${index}`} className="flex items-start gap-2 text-sm text-skj-charcoal">
              <CheckCircle2 size={17} className="mt-0.5 flex-shrink-0 text-skj-olive" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      )}

      {(scheme.bonusText || scheme.redemptionText) && (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-950">
          {scheme.bonusText && <p><strong>Benefit:</strong> {scheme.bonusText}</p>}
          {scheme.redemptionText && <p className={scheme.bonusText ? 'mt-2' : ''}><strong>How to use:</strong> {scheme.redemptionText}</p>}
        </div>
      )}

      {scheme.terms?.length > 0 && (
        <details className="mt-5 rounded-xl border border-skj-border/70 bg-skj-ivory/40 px-4 py-3">
          <summary className="cursor-pointer text-sm font-semibold text-skj-charcoal">View terms and conditions</summary>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-xs leading-5 text-skj-muted">
            {scheme.terms.map((term, index) => <li key={`${term}-${index}`}>{term}</li>)}
          </ul>
        </details>
      )}

      <button type="button" onClick={onInterest} className="btn-primary mt-7 w-full justify-center">
        I&apos;m Interested
        <MessageCircle size={16} />
      </button>
    </article>
  );
}

function InterestModal({ scheme, submitted, onClose, onSubmitted }) {
  const [form, setForm] = useState({ customerName: '', phone: '', city: '', preferredAmount: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const updateField = (field, value) => setForm((previous) => ({ ...previous, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!/^(?:\+91|91)?[6-9]\d{9}$/.test(form.phone.replace(/[\s-]/g, ''))) {
      setError('Please enter a valid Indian mobile number.');
      return;
    }

    setSubmitting(true);
    const message = [
      'Hello Sai Praveen Jewellery,',
      '',
      `I am interested in the "${scheme.name}" scheme.`,
      '',
      `Name: ${form.customerName.trim()}`,
      `Phone: ${form.phone.trim()}`,
      `City: ${form.city.trim() || 'Not provided'}`,
      `Preferred amount: ${form.preferredAmount.trim() || 'Please advise'}`,
      `Message: ${form.message.trim() || 'Please share the complete details.'}`,
    ].join('\n');

    // Open WhatsApp immediately so browser popup protection does not block it.
    window.open(`https://wa.me/${SCHEME_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');

    // Store the lead in the background; WhatsApp does not depend on Firebase speed.
    fetch('/api/scheme-leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, customerName: form.customerName.trim(), schemeId: scheme.id, schemeName: scheme.name }),
    }).catch((saveError) => console.warn('Scheme enquiry could not be saved:', saveError));

    onSubmitted();
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="hide-scrollbar max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-skj-gold/25 bg-white p-6 shadow-2xl sm:p-8" role="dialog" aria-modal="true" aria-labelledby="scheme-interest-title">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-skj-olive">Scheme enquiry</p>
            <h2 id="scheme-interest-title" className="mt-1 font-heading text-2xl font-semibold text-skj-charcoal">{scheme.name}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-1 text-skj-muted hover:bg-skj-ivory" aria-label="Close form">
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="py-10 text-center">
            <CheckCircle2 className="mx-auto text-emerald-600" size={42} />
            <h3 className="mt-4 font-heading text-xl font-semibold text-skj-charcoal">Enquiry prepared</h3>
            <p className="mt-2 text-sm text-skj-muted">WhatsApp has been opened with your scheme enquiry.</p>
            <button type="button" onClick={onClose} className="btn-primary mt-6">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && <p className="rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>}
            <Field label="Your name" value={form.customerName} onChange={(value) => updateField('customerName', value)} required />
            <Field label="Mobile number" type="tel" value={form.phone} onChange={(value) => updateField('phone', value)} required />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="City" value={form.city} onChange={(value) => updateField('city', value)} />
              <Field label="Preferred amount" placeholder="e.g. ₹1,000" value={form.preferredAmount} onChange={(value) => updateField('preferredAmount', value)} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-skj-charcoal">Message</label>
              <textarea value={form.message} onChange={(event) => updateField('message', event.target.value)} rows={3} placeholder="Anything you would like to ask?" className="w-full resize-none rounded-2xl border border-skj-border bg-skj-ivory/30 px-4 py-3 text-sm focus:border-skj-gold focus:outline-none focus:ring-2 focus:ring-skj-gold/15" />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full justify-center disabled:opacity-60">
              {submitting ? <Loader2 size={17} className="animate-spin" /> : <MessageCircle size={17} />}
              {submitting ? 'Opening WhatsApp...' : 'Send Enquiry on WhatsApp'}
            </button>
            <p className="text-center text-[11px] text-skj-muted">Your details will be shared with Sai Praveen Jewellery for this enquiry.</p>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', placeholder, required = false }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-skj-charcoal">{label}{required ? ' *' : ''}</label>
    <input type={type} value={value} required={required} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-skj-border bg-skj-ivory/30 px-4 py-3 text-sm focus:border-skj-gold focus:outline-none focus:ring-2 focus:ring-skj-gold/15" />
    </div>
  );
}
