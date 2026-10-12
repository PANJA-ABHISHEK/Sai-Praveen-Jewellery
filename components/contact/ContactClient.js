'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    category: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const waNumber = '919505608181';
    let text = `❖ *Enquiry — Sai Praveen Jewellery*\n\n`;
    text += `*Customer Details*\n`;
    text += `Name: ${formData.name}\n`;
    text += `Phone: ${formData.phone}\n`;
    if (formData.email) text += `Email: ${formData.email}\n`;
    if (formData.category) text += `Interested In: ${formData.category}\n`;
    text += `\n*Message:*\n${formData.message}`;

    const waUrl = `https://api.whatsapp.com/send?phone=${waNumber}&text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
    
    // Just clear the form, no success screen replacement needed
    setFormData({ name: '', phone: '', email: '', category: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="bg-[#FAF9F5] flex flex-col min-h-[calc(100vh-80px)]">

      {/* Main Content */}
      <section className="flex-grow py-8 lg:py-12 flex justify-center">
        <div className="section-container max-w-6xl w-full">
          <div className="flex flex-col lg:flex-row bg-white rounded-[2rem] shadow-2xl shadow-black/5 overflow-hidden border border-skj-border/40">
            
            {/* Left: Contact Info */}
            <div className="lg:w-2/5 bg-[#D2C5AF] text-skj-charcoal p-8 sm:p-10 lg:p-14 relative overflow-hidden flex flex-col justify-between">
              {/* Decorative background circle */}
              <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-white/30 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10">
                <h2 className="text-3xl lg:text-4xl font-semibold mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Get in Touch</h2>
                <p className="text-skj-charcoal/80 text-sm mb-12 leading-relaxed">Whether you're looking for bridal jewellery or need assistance with our collections, our family is here to help.</p>
                
                <div className="space-y-8">
                  <div className="flex gap-5 items-start">
                    <div className="mt-1 w-12 h-12 rounded-full bg-white/40 flex items-center justify-center text-skj-deep-olive shrink-0 border border-white/40 backdrop-blur-sm">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-skj-charcoal mb-1.5 tracking-widest uppercase" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>Visit Our Store</h3>
                      <p className="text-sm text-skj-charcoal/80 leading-relaxed">
                        Shop No. 20, MGM Complex, Market Road,<br />
                        Maruthi Nagar, Ravulapalem,<br />
                        Andhra Pradesh – 533238
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-5 items-start">
                    <div className="mt-1 w-12 h-12 rounded-full bg-white/40 flex items-center justify-center text-skj-deep-olive shrink-0 border border-white/40 backdrop-blur-sm">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-skj-charcoal mb-1.5 tracking-widest uppercase" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>Call Us</h3>
                      <p className="text-sm text-skj-charcoal/80 leading-relaxed">
                        <a href="tel:+919505608181" className="hover:text-black transition-colors">+91 95056 08181</a>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-5 items-start">
                    <div className="mt-1 w-12 h-12 rounded-full bg-white/40 flex items-center justify-center text-skj-deep-olive shrink-0 border border-white/40 backdrop-blur-sm">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-skj-charcoal mb-1.5 tracking-widest uppercase" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>Store Hours</h3>
                      <p className="text-sm text-skj-charcoal/80 leading-relaxed">
                        Mon - Sat: 10:00 AM - 8:30 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-12 relative z-10">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => window.open('https://wa.me/919505608181', '_blank')} className="group flex-1 bg-white hover:bg-skj-deep-olive text-skj-charcoal hover:text-white font-semibold text-xs uppercase tracking-wider py-4 px-4 rounded-xl text-center transition-all duration-300 shadow-lg shadow-black/5 flex items-center justify-center gap-2">
                    WhatsApp Us <Send size={14} />
                  </button>
                  <a href="https://www.google.com/maps/search/?api=1&query=Sai+Praveen+Jewellers+Ravulapalem+Andhra+Pradesh" target="_blank" rel="noopener noreferrer" className="flex-1 bg-transparent hover:bg-white/40 border border-white/60 text-skj-charcoal font-semibold text-xs uppercase tracking-wider py-4 px-4 rounded-xl text-center transition-all duration-300 backdrop-blur-sm">
                    Directions
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:w-3/5 p-8 sm:p-10 lg:p-14 bg-white">
              <h2 className="text-2xl lg:text-3xl font-semibold text-skj-charcoal mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Send an Enquiry</h2>
              <p className="text-sm text-skj-muted mb-8">Fill out the form below and we will get back to you shortly.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-xs font-bold text-skj-charcoal mb-2 uppercase tracking-wider">Full Name *</label>
                    <input
                      type="text" id="name" name="name" required value={formData.name} onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-skj-ivory/30 border border-skj-border/80 focus:outline-none focus:border-skj-olive focus:ring-1 focus:ring-skj-olive/30 rounded-xl text-sm transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-xs font-bold text-skj-charcoal mb-2 uppercase tracking-wider">Phone Number *</label>
                    <input
                      type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-skj-ivory/30 border border-skj-border/80 focus:outline-none focus:border-skj-olive focus:ring-1 focus:ring-skj-olive/30 rounded-xl text-sm transition-all"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-skj-charcoal mb-2 uppercase tracking-wider">Email (Optional)</label>
                    <input
                      type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-skj-ivory/30 border border-skj-border/80 focus:outline-none focus:border-skj-olive focus:ring-1 focus:ring-skj-olive/30 rounded-xl text-sm transition-all"
                      placeholder="Your email address"
                    />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-xs font-bold text-skj-charcoal mb-2 uppercase tracking-wider">Interested In</label>
                    <select
                      id="category" name="category" value={formData.category} onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-skj-ivory/30 border border-skj-border/80 focus:outline-none focus:border-skj-olive focus:ring-1 focus:ring-skj-olive/30 rounded-xl text-sm transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select a category</option>
                      <option value="Bridal Jewellery">Bridal Jewellery</option>
                      <option value="Gold Necklaces">Gold Necklaces</option>
                      <option value="Silver Collections">Silver Collections</option>
                      <option value="Men's Jewellery">Men's Jewellery</option>
                      <option value="Other">Other Enquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-bold text-skj-charcoal mb-2 uppercase tracking-wider">Message *</label>
                  <textarea
                    id="message" name="message" required rows="4" value={formData.message} onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-skj-ivory/30 border border-skj-border/80 focus:outline-none focus:border-skj-olive focus:ring-1 focus:ring-skj-olive/30 rounded-xl text-sm transition-all resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit" disabled={isSubmitting}
                    className="w-full sm:w-auto bg-skj-olive hover:bg-skj-deep-olive text-white font-semibold text-xs uppercase tracking-wider py-4 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-skj-olive/20 flex items-center justify-center gap-2"
                  >
                    Submit Enquiry
                  </button>
                  <p className="text-[10px] text-skj-muted leading-relaxed mt-4 max-w-md">
                    By submitting this form, you agree to our privacy policy and consent to being contacted by Sai Praveen Jewellery.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
