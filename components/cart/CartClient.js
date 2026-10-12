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
      <div className="section-container py-20">
        <div className="grid grid-cols-1 gap-4 max-w-3xl mx-auto">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 skeleton" />
          ))}
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
      <div className="bg-white min-h-screen">

        <div className="section-container py-20 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-skj-ivory flex items-center justify-center">
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
    <div className="bg-white min-h-screen">

      <div className="section-container py-8 lg:py-12">
        <h1
          className="text-2xl sm:text-3xl font-semibold text-skj-charcoal mb-8"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Shopping Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 border border-skj-border/60 bg-white"
              >
                {/* Item image */}
                <Link href={`/product/${item.slug}`} className="flex-shrink-0">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-skj-ivory to-skj-border/40 flex items-center justify-center overflow-hidden">
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
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-skj-border">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-skj-charcoal hover:bg-skj-ivory transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 text-skj-charcoal hover:bg-skj-ivory transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-skj-olive" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 text-skj-muted hover:text-skj-red transition-colors"
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
              className="inline-flex items-center gap-1.5 text-sm text-skj-olive hover:text-skj-deep-olive transition-colors mt-2"
            >
              <ArrowLeft size={14} />
              Continue Shopping
            </Link>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white border border-skj-border p-6 shadow-sm">
              <h2
                className="text-xl font-bold text-skj-charcoal mb-6"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Order Summary
              </h2>

              <div className="space-y-4 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-skj-muted">Subtotal ({cart.length} items)</span>
                  <span className="font-semibold text-skj-charcoal">{formatPrice(subtotal)}</span>
                </div>
              </div>

              <div className="border-t border-skj-border pt-4 mb-4">
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
                  className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-semibold py-3 px-4 rounded-md flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <MessageCircle size={18} />
                  Order on WhatsApp
                </button>
              </div>

              {/* Info note */}
              <div className="mt-6 p-4 bg-skj-ivory border border-skj-border/50 rounded-sm">
                <p className="text-xs text-skj-muted leading-relaxed flex items-start gap-2">
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5 text-skj-charcoal/60" />
                  This is an enquiry, not a payment. Stock availability and final pricing will be confirmed by Sai Praveen Jewellery upon receiving your message.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-skj-charcoal mb-1">Complete Your Order</h2>
              <p className="text-sm text-skj-muted mb-6">Enter your details to send the order via WhatsApp</p>

              <div className="space-y-5">
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
                    className={`w-full px-4 py-3 rounded-xl text-sm border bg-white focus:outline-none transition-colors ${
                      formErrors.name ? 'border-skj-red' : 'border-skj-border focus:border-skj-olive'
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
                    className={`w-full px-4 py-3 rounded-xl text-sm border bg-white focus:outline-none transition-colors ${
                      formErrors.phone ? 'border-skj-red' : 'border-skj-border focus:border-skj-olive'
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
                    className={`w-full px-4 py-3 rounded-xl text-sm border bg-white focus:outline-none transition-colors resize-none ${
                      formErrors.address ? 'border-skj-red' : 'border-skj-border focus:border-skj-olive'
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
                    className={`w-full px-4 py-3 rounded-xl text-sm border bg-white focus:outline-none transition-colors ${
                      formErrors.pincode ? 'border-skj-red' : 'border-skj-border focus:border-skj-olive'
                    }`}
                  />
                  {formErrors.pincode && (
                    <p className="text-[11px] text-skj-red mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {formErrors.pincode}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => {
                    setShowCheckout(false);
                    setFormErrors({});
                  }}
                  className="flex-1 py-3.5 rounded-xl text-sm font-bold text-[#E53E3E] border border-[#E53E3E] hover:bg-red-50 transition-colors"
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
                  className="flex-1 py-3.5 rounded-xl text-sm font-bold text-white bg-[#25D366] hover:bg-[#1DA851] flex items-center justify-center gap-2 transition-colors shadow-md shadow-green-500/20"
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
