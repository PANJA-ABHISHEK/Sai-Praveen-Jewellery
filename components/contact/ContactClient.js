'use client';

import { useEffect, useState } from 'react';
import { Clock3, ExternalLink, Loader2, Mail, MapPin, Phone, Send, Store, Users } from 'lucide-react';
import siteConfig from '@/lib/config';
import SocialLinks from '@/components/common/SocialLinks';

const fallbackStore = {
  id: 'default',
  name: siteConfig.businessName,
  shortName: 'Patamata',
  addressLine1: siteConfig.address.line1,
  addressLine2: siteConfig.address.line2,
  city: siteConfig.address.city,
  state: siteConfig.address.state,
  pincode: siteConfig.address.pincode,
  country: siteConfig.address.country,
  phone: siteConfig.phone,
  whatsappNumber: siteConfig.whatsappNumber,
  email: siteConfig.email,
  hoursWeekdays: '10:00 AM – 8:30 PM',
  hoursSunday: '10:00 AM – 8:30 PM',
  active: true,
  displayOrder: 0,
};

const blankForm = { name: '', phone: '', email: '', category: '', message: '' };

function storeAddress(store) {
  return [store.addressLine1, store.addressLine2, store.city, `${store.state} - ${store.pincode}`].filter(Boolean);
}

function directionsFor(store) {
  if (store.mapUrl) return store.mapUrl;
  const query = [store.name, store.addressLine1, store.addressLine2, store.city, store.state, store.pincode].filter(Boolean).join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function whatsappFor(store) {
  return String(store.whatsappNumber || siteConfig.whatsappNumber).replace(/\D/g, '');
}

export default function ContactClient() {
  const [stores, setStores] = useState([]);
  const [storesLoading, setStoresLoading] = useState(true);
  const [formData, setFormData] = useState(blankForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch('/api/stores')
      .then((response) => response.json())
      .then((data) => {
        if (mounted) setStores((data.stores || [fallbackStore]).filter((store) => store.active !== false));
      })
      .catch(() => {
        if (mounted) setStores([fallbackStore]);
      })
      .finally(() => mounted && setStoresLoading(false));
    return () => { mounted = false; };
  }, []);

  const handleChange = (event) => setFormData((previous) => ({ ...previous, [event.target.name]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const text = [
      '✦ *Enquiry — Sai Praveen Jewellery*',
      '',
      '*Customer details*',
      `Name: ${formData.name}`,
      `Phone: ${formData.phone}`,
      formData.email && `Email: ${formData.email}`,
      formData.category && `Interested in: ${formData.category}`,
      '',
      '*Message*',
      formData.message,
    ].filter((line) => line !== false && line !== undefined).join('\n');
    const waUrl = `https://api.whatsapp.com/send?phone=${siteConfig.whatsappNumber}&text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setFormData(blankForm);
    window.setTimeout(() => setIsSubmitting(false), 500);
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-skj-ivory/70">
      <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-skj-olive"><span className="h-px w-8 bg-skj-gold" /><span>Visit us</span><span className="h-px w-8 bg-skj-gold" /></p>
            <h1 className="font-heading text-4xl font-semibold leading-tight text-skj-charcoal sm:text-5xl">{stores.length === 1 ? 'Visit our showroom.' : 'Find a Sai Praveen showroom near you.'}</h1>
            <p className="mt-4 text-sm leading-7 text-skj-muted sm:text-base">{stores.length === 1 ? 'Our Patamata showroom is ready to welcome you with thoughtful designs and personal guidance.' : 'Choose a showroom below to see its address, hours and direct contact options.'}</p>
          </div>

          {storesLoading ? <div className="flex justify-center py-14"><Loader2 className="animate-spin text-skj-olive" /></div> : <div className={`mx-auto mt-10 grid w-full gap-5 ${stores.length === 1 ? 'max-w-xl' : stores.length === 2 ? 'max-w-5xl sm:grid-cols-2' : 'sm:grid-cols-2 xl:grid-cols-3'}`}>{stores.map((store, index) => <StoreCard key={store.id || `${store.name}-${index}`} store={store} index={index} />)}</div>}

          <div className="mt-10 grid overflow-hidden rounded-[2rem] border border-skj-gold/20 bg-white shadow-[0_20px_60px_rgba(54,24,29,0.1)] lg:grid-cols-[0.78fr_1.22fr]">
            <div className="relative overflow-hidden bg-skj-deep-olive p-7 text-white sm:p-10 lg:p-12">
              <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-skj-gold/10 blur-3xl" aria-hidden="true" />
              <div className="relative">
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-skj-gold/35 bg-white/10 text-skj-gold"><Users size={22} /></span>
                <h2 className="font-heading text-3xl font-semibold sm:text-4xl">Need help choosing?</h2>
                <p className="mt-4 max-w-sm text-sm leading-7 text-white/70">Tell us what you are looking for. Our team will guide you towards a design that feels right for the occasion.</p>
                <div className="mt-8 space-y-4 text-sm text-white/80"><a href={`tel:${siteConfig.phone}`} className="flex items-center gap-3 transition hover:text-white"><Phone size={17} className="text-skj-gold" /> {siteConfig.phone}</a><a href={`mailto:${siteConfig.email}`} className="flex items-center gap-3 transition hover:text-white"><Mail size={17} className="text-skj-gold" /> {siteConfig.email}</a></div>
                <a href={`https://wa.me/${siteConfig.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="mt-9 inline-flex items-center gap-2 rounded-full bg-skj-gold px-5 py-3 text-xs font-bold uppercase tracking-wider text-skj-charcoal transition hover:bg-white">Chat on WhatsApp <Send size={14} /></a>
                <div className="mt-7">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">Follow us</p>
                  <SocialLinks className="mt-3" />
                </div>
              </div>
            </div>

            <div className="p-7 sm:p-10 lg:p-12">
              <h2 className="font-heading text-3xl font-semibold text-skj-charcoal">Send an enquiry</h2>
              <p className="mt-2 text-sm text-skj-muted">Your message will open directly in WhatsApp for a quick reply.</p>
              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2"><Field id="name" label="Full name" value={formData.name} onChange={handleChange} placeholder="Your name" required /><Field id="phone" label="Phone number" value={formData.phone} onChange={handleChange} placeholder="Your phone number" required /></div>
                <div className="grid gap-5 sm:grid-cols-2"><Field id="email" label="Email (optional)" type="email" value={formData.email} onChange={handleChange} placeholder="Your email address" /><label className="block"><span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-skj-charcoal">Interested in</span><select id="category" name="category" value={formData.category} onChange={handleChange} className="h-11 w-full rounded-xl border border-skj-border/80 bg-skj-ivory/30 px-3.5 text-sm text-skj-charcoal outline-none focus:border-skj-gold focus:ring-2 focus:ring-skj-gold/15"><option value="">Select a category</option><option>Bridal Jewellery</option><option>Gold Necklaces</option><option>Silver Collections</option><option>Men&apos;s Jewellery</option><option>Other Enquiry</option></select></label></div>
                <label className="block"><span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-skj-charcoal">Message</span><textarea id="message" name="message" required rows={4} value={formData.message} onChange={handleChange} placeholder="How can we help you?" className="w-full resize-none rounded-xl border border-skj-border/80 bg-skj-ivory/30 px-3.5 py-3 text-sm outline-none focus:border-skj-gold focus:ring-2 focus:ring-skj-gold/15" /></label>
                <button type="submit" disabled={isSubmitting} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-skj-olive px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-skj-olive/20 transition hover:bg-skj-deep-olive disabled:opacity-60 sm:w-auto">{isSubmitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}{isSubmitting ? 'Opening WhatsApp...' : 'Send on WhatsApp'}</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function StoreCard({ store, index }) {
  const address = storeAddress(store);
  const whatsapp = whatsappFor(store);
  return <article className="group relative flex min-h-[330px] flex-col overflow-hidden rounded-2xl border border-skj-border/70 bg-white p-5 shadow-[0_10px_30px_rgba(54,24,29,0.05)] transition duration-300 hover:-translate-y-1 hover:border-skj-gold/60 hover:shadow-[0_18px_40px_rgba(54,24,29,0.12)] sm:p-6">
    <div className="flex items-start justify-between gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-skj-ivory text-skj-olive"><Store size={21} /></span><span className="rounded-full border border-skj-gold/30 bg-skj-ivory px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-skj-olive">{String(index + 1).padStart(2, '0')} · {store.shortName || 'Showroom'}</span></div>
    <h2 className="mt-5 font-heading text-2xl font-semibold text-skj-charcoal">{store.name}</h2>
    <div className="mt-4 space-y-3 text-sm leading-6 text-skj-muted"><p className="flex items-start gap-3"><MapPin size={17} className="mt-1 shrink-0 text-skj-olive" /><span>{address.map((line, lineIndex) => <span key={`${line}-${lineIndex}`} className="block">{line}</span>)}</span></p><p className="flex items-start gap-3"><Clock3 size={17} className="mt-1 shrink-0 text-skj-olive" /><span>Mon – Sat: {store.hoursWeekdays || '10:00 AM – 8:30 PM'}<br />Sunday: {store.hoursSunday || '10:00 AM – 8:30 PM'}</span></p><a href={`tel:${store.phone}`} className="flex items-center gap-3 transition hover:text-skj-olive"><Phone size={17} className="shrink-0 text-skj-olive" />{store.phone}</a></div>
    <div className="mt-auto flex flex-col gap-2 pt-6 sm:flex-row"><a href={directionsFor(store)} target="_blank" rel="noopener noreferrer" className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-skj-border px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-skj-charcoal transition hover:border-skj-gold hover:bg-skj-ivory">Directions <ExternalLink size={14} /></a><a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-skj-deep-olive px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-skj-olive">WhatsApp <Send size={14} /></a></div>
  </article>;
}

function Field({ id, label, value, onChange, placeholder, type = 'text', required = false }) {
  return <label className="block"><span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-skj-charcoal">{label}{required ? ' *' : ''}</span><input id={id} name={id} type={type} required={required} value={value} onChange={onChange} placeholder={placeholder} className="h-11 w-full rounded-xl border border-skj-border/80 bg-skj-ivory/30 px-3.5 text-sm outline-none transition focus:border-skj-gold focus:ring-2 focus:ring-skj-gold/15" /></label>;
}
