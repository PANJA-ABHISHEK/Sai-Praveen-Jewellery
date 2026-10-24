'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Minus, Plus, Trash2, ShoppingBag, ArrowLeft,
  MessageCircle, User, Phone, MapPin, AlertCircle,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, formatWeight, generateWhatsAppURL, buildOrderMessage, isValidPhone } from '@/lib/utils';
import siteConfig from '@/lib/config';

export default function CartClient() {
  const { cart, isHydrated, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [formErrors, setFormErrors] = useState({});

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-skj-ivory/60 py-12 sm:py-16">
        <div className="section-container">
        <div className="grid grid-cols-1 gap-4 max-w-3xl mx-auto">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl border border-skj-border/60 bg-white skeleton" />
          ))}
        </div>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();

  const validateForm = () => {
    const errors = {};
    if (!customerName.trim()) errors.name = 'Name is required';
    if (!customerPhone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!isValidPhone(customerPhone)) {
      errors.phone = 'Enter a valid Indian phone number';
    }
    if (!deliveryAddress.trim()) errors.address = 'Delivery Address is required';
    if (!pinCode.trim()) errors.pincode = 'PIN Code is required';
    else if (!/^\d{6}$/.test(pinCode.trim())) errors.pincode = 'Enter a valid 6-digit PIN code';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleWhatsAppOrder = () => {
    if (!validateForm()) return;

    const message = buildOrderMessage(cart, {
      name: customerName.trim(),
      phone: customerPhone.trim(),
      deliveryAddress: deliveryAddress.trim(),
      pinCode: pinCode.trim(),
    });

    const url = generateWhatsAppURL(siteConfig.whatsappNumber, message);
    window.open(url, '_blank');
  };

  // Empty cart
  if (cart.length === 0) {
    return (
      <div className="bg-skj-ivory/70 min-h-screen">

        <div className="section-container py-20 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl border border-skj-gold/25 bg-white shadow-sm flex items-center justify-center">
            <ShoppingBag size={32} className="text-skj-muted" />
          </div>
          <h1
            className="text-2xl font-semibold text-skj-charcoal mb-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Your cart is empty
          </h1>
          <p className="text-sm text-skj-muted mb-6 max-w-md mx-auto">
            Explore our beautiful collections of gold and silver jewellery and add your favourite pieces to the cart.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/gold/women" className="btn-primary">
              Explore Gold
            </Link>
            <Link href="/silver/women" className="btn-secondary">
              Explore Silver
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-skj-ivory/70 min-h-screen">

      <div className="section-container py-8 lg:py-10">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.28em] text-skj-gold">Your selection</p>
            <h1
              className="text-2xl sm:text-3xl font-semibold text-skj-charcoal"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Shopping Cart
            </h1>
            <p className="mt-1.5 text-sm text-skj-muted">Review your pieces before sending an enquiry.</p>
          </div>
          <span className="w-fit rounded-full border border-skj-gold/30 bg-white px-3.5 py-1.5 text-xs font-semibold text-skj-olive shadow-sm">
            {cart.length} {cart.length === 1 ? 'piece' : 'pieces'}
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-2xl border border-skj-border/70 bg-white/95 p-4 shadow-[0_8px_24px_rgba(54,24,29,0.06)] transition-shadow hover:shadow-[0_12px_30px_rgba(54,24,29,0.1)] sm:p-5"
              >
                {/* Item image */}
                <Link href={`/product/${item.slug}`} className="flex-shrink-0">
                  <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-skj-ivory to-skj-border/40 ring-1 ring-skj-gold/20 sm:h-24 sm:w-24">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <span className="text-skj-gold/30 font-heading text-xl">SPJ</span>
                    )}
                  </div>
                </Link>

                {/* Item details */}
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.slug}`}>
                    <h3 className="text-sm font-medium text-skj-charcoal hover:text-skj-olive transition-colors line-clamp-1"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-skj-muted mt-0.5">
                    {item.material === 'gold' ? 'Gold' : 'Silver'} {item.purity} · {formatWeight(item.weightGrams)}
                  </p>
                  <p className="text-sm font-semibold text-skj-charcoal mt-1.5"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                    {formatPrice(item.price)}
                  </p>

                  {/* Quantity controls */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center overflow-hidden rounded-xl border border-skj-border/80 bg-skj-ivory/40">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 text-skj-charcoal transition-colors hover:bg-white"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-xs font-semibold text-skj-charcoal">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 text-skj-charcoal transition-colors hover:bg-white"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="ml-auto flex items-center gap-2.5">
                      <span className="text-sm font-semibold text-skj-olive" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="rounded-lg p-2 text-skj-muted transition-colors hover:bg-red-50 hover:text-skj-red"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue shopping */}
            <Link
              href="/gold/women"
              className="mt-1 inline-flex items-center gap-2 rounded-full border border-skj-gold/25 bg-white px-4 py-2 text-sm text-skj-olive shadow-sm transition-colors hover:border-skj-gold hover:text-skj-deep-olive"
            >
              <ArrowLeft size={14} />
              Continue Shopping
            </Link>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 rounded-3xl border border-skj-gold/25 bg-white/95 p-5 shadow-[0_18px_50px_rgba(54,24,29,0.1)] sm:p-6">
              <h2
                className="mb-6 text-xl font-bold text-skj-charcoal"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Order Summary
              </h2>

              <div className="mb-4 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-skj-muted">Subtotal ({cart.length} items)</span>
                  <span className="font-semibold text-skj-charcoal">{formatPrice(subtotal)}</span>
                </div>
              </div>

              <div className="mb-4 border-t border-skj-border/70 pt-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-base font-bold text-skj-charcoal">Estimated Total</span>
                  <span className="text-xl font-bold text-skj-charcoal" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <p className="text-[11px] text-skj-muted mb-6">
                  Final pricing will be confirmed by Sai Praveen Jewellery.
                </p>

                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full rounded-2xl bg-[#25D366] px-4 py-3.5 font-semibold text-white shadow-md shadow-green-500/15 transition-all hover:-translate-y-0.5 hover:bg-[#1DA851] hover:shadow-lg"
                >
                  <span className="flex items-center justify-center gap-2">
                    <MessageCircle size={18} />
                    Order on WhatsApp
                  </span>
                </button>
              </div>

              {/* Info note */}
              <div className="mt-6 rounded-2xl border border-skj-gold/20 bg-skj-ivory/80 p-4">
                <p className="text-xs text-skj-muted leading-relaxed flex items-start gap-2">
                  <AlertCircle size={14} className="mt-0.5 flex-shrink-0 text-skj-gold" />
                  This is an enquiry, not a payment. Stock availability and final pricing will be confirmed by Sai Praveen Jewellery upon receiving your message.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-2 backdrop-blur-sm sm:p-4">
          <div className="max-h-[calc(100dvh-16px)] w-full max-w-md overflow-hidden rounded-[1.75rem] border border-skj-gold/25 bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="px-5 pb-4 pt-6 sm:px-8 sm:pb-5 sm:pt-7">
              <h2 className="text-2xl font-bold text-skj-charcoal">Complete Your Order</h2>
              <p className="mt-1 text-sm text-skj-muted">Enter your details to send the order via WhatsApp</p>
            </div>

            <div className="px-5 pb-5 sm:px-8 sm:pb-7">

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-skj-charcoal mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your full name"
                    className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-skj-gold/15 ${
                      formErrors.name ? 'border-skj-red' : 'border-skj-border focus:border-skj-gold'
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-[11px] text-skj-red mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {formErrors.name}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-skj-charcoal mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-skj-gold/15 ${
                      formErrors.phone ? 'border-skj-red' : 'border-skj-border focus:border-skj-gold'
                    }`}
                  />
                  {formErrors.phone && (
                    <p className="text-[11px] text-skj-red mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {formErrors.phone}
                    </p>
                  )}
                </div>

                {/* Delivery Address */}
                <div>
                  <label className="block text-sm font-semibold text-skj-charcoal mb-1.5">
                    Delivery Address *
                  </label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your full delivery address"
                    rows="3"
                    className={`w-full resize-none rounded-2xl border bg-white px-4 py-3 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-skj-gold/15 ${
                      formErrors.address ? 'border-skj-red' : 'border-skj-border focus:border-skj-gold'
                    }`}
                  />
                  {formErrors.address && (
                    <p className="text-[11px] text-skj-red mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {formErrors.address}
                    </p>
                  )}
                </div>

                {/* PIN Code */}
                <div>
                  <label className="block text-sm font-semibold text-skj-charcoal mb-1.5">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="Enter your 6-digit PIN code"
                    maxLength={6}
                    className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-skj-gold/15 ${
                      formErrors.pincode ? 'border-skj-red' : 'border-skj-border focus:border-skj-gold'
                    }`}
                  />
                  {formErrors.pincode && (
                    <p className="text-[11px] text-skj-red mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {formErrors.pincode}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setShowCheckout(false);
                    setFormErrors({});
                  }}
                  className="inline-flex flex-1 items-center justify-center rounded-2xl border border-[#E53E3E]/70 py-3.5 text-sm font-bold text-[#E53E3E] transition-colors hover:bg-red-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleWhatsAppOrder();
                    // Optional: Close modal after successful valid click
                    if(Object.keys(formErrors).length === 0 && customerName && customerPhone && deliveryAddress && pinCode && /^\d{6}$/.test(pinCode.trim())) {
                      setShowCheckout(false);
                    }
                  }}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-3.5 text-sm font-bold text-white shadow-md shadow-green-500/20 transition-all hover:-translate-y-0.5 hover:bg-[#1DA851]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                  Send Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
