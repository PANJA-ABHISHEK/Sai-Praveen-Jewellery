'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag, Check, Minus, Plus, Heart, Share2, Truck,
  Shield, RefreshCw,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, formatWeight, capitalize } from '@/lib/utils';
import { getRelatedProducts } from '@/lib/api';
import ProductCard from '@/components/product/ProductCard';
import Toast from '@/components/ui/Toast';

export default function ProductDetailClient({ product }) {
  const { addToCart, isInCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);

  const relatedProducts = getRelatedProducts(product, 4);
  const isOutOfStock = product.stockStatus === 'out_of_stock';
  const alreadyInCart = isInCart(product.id);
  const materialLabel = product.material === 'gold' ? 'Gold' : 'Silver';
  const audienceLabel = product.audience === 'men' ? 'Men' : 'Women';
  const catalogueHref = `/${product.material}/${product.audience}`;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setShowToast(true);
  };

  return (
    <div className="bg-white min-h-screen">

      {/* Product detail */}
      <div className="section-container py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Product image */}
            <div className="relative">
              <div className="relative aspect-square bg-gradient-to-br from-skj-ivory to-skj-border/40 flex items-center justify-center sticky top-28 rounded-3xl overflow-hidden shadow-sm border border-skj-border/30">
                {/* Product image */}
              {product.images && product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="text-center">
                  <span className="text-7xl text-skj-gold/20 block mb-2 font-heading">SPJ</span>
                  <p className="text-xs text-skj-muted">Product image placeholder</p>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.featured && (
                  <span className="px-3 py-1.5 bg-skj-olive text-white text-xs font-semibold uppercase tracking-wider">
                    Featured
                  </span>
                )}
                {isOutOfStock && (
                  <span className="px-3 py-1.5 bg-skj-charcoal text-white text-xs font-semibold uppercase tracking-wider">
                    Sold Out
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Product info */}
          <div>
            {/* Category tag */}
            <div className="flex items-center gap-2 mb-3">
              <Link
                href={`${catalogueHref}?category=${encodeURIComponent(product.category)}`}
                className="text-xs font-semibold text-skj-olive uppercase tracking-[0.15em] hover:text-skj-deep-olive transition-colors"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {product.category}
              </Link>
              <span className="text-skj-border">·</span>
              <span className="text-xs text-skj-muted uppercase tracking-wider">
                {materialLabel} {product.purity}
              </span>
            </div>

            {/* Product name */}
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-skj-charcoal mb-4 leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {product.name}
            </h1>

            {/* Price */}
            <p className="text-2xl font-bold text-skj-charcoal mb-1" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {formatPrice(product.price)}
            </p>
            <p className="text-xs text-skj-muted mb-6">
              Indicative price. Final pricing confirmed by the store.
            </p>

            {/* Divider */}
            <div className="w-full h-px bg-skj-border mb-6" aria-hidden="true" />

            {/* Description */}
            <p className="text-sm text-skj-muted leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Product attributes */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-skj-ivory/60 border border-skj-border/50">
                <p className="text-[10px] text-skj-muted uppercase tracking-wider mb-0.5">Material</p>
                <p className="text-sm font-medium text-skj-charcoal">{capitalize(product.material)}</p>
              </div>
              <div className="p-3 bg-skj-ivory/60 border border-skj-border/50">
                <p className="text-[10px] text-skj-muted uppercase tracking-wider mb-0.5">Purity</p>
                <p className="text-sm font-medium text-skj-charcoal">{product.purity}</p>
              </div>
              <div className="p-3 bg-skj-ivory/60 border border-skj-border/50">
                <p className="text-[10px] text-skj-muted uppercase tracking-wider mb-0.5">Weight</p>
                <p className="text-sm font-medium text-skj-charcoal">{formatWeight(product.weightGrams)}</p>
              </div>
              <div className="p-3 bg-skj-ivory/60 border border-skj-border/50">
                <p className="text-[10px] text-skj-muted uppercase tracking-wider mb-0.5">Availability</p>
                <p className={`text-sm font-medium ${isOutOfStock ? 'text-skj-red' : 'text-skj-olive'}`}>
                  {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                </p>
              </div>
            </div>

            {/* Quantity + Add to Cart */}
            {!isOutOfStock && (
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                {/* Quantity selector */}
                <div className="flex items-center border border-skj-border rounded-full overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-skj-charcoal hover:bg-skj-ivory transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center text-sm font-medium text-skj-charcoal">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-skj-charcoal hover:bg-skj-ivory transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 text-sm font-semibold uppercase tracking-wider transition-all duration-300 rounded-full ${
                    alreadyInCart
                      ? 'bg-skj-olive/10 text-skj-olive border border-skj-olive/30'
                      : 'bg-skj-olive text-white hover:bg-skj-deep-olive'
                  }`}
                >
                  {alreadyInCart ? (
                    <>
                      <Check size={16} />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            )}

            {isOutOfStock && (
              <div className="p-4 bg-red-50 border border-red-100 text-sm text-skj-red mb-6">
                This product is currently out of stock. Please check back later or contact us for availability.
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-skj-border">
              <div className="flex flex-col items-center text-center p-3">
                <Shield size={18} className="text-skj-olive mb-1.5" />
                <p className="text-[10px] text-skj-muted leading-tight">Hallmark Certified</p>
              </div>
              <div className="flex flex-col items-center text-center p-3">
                <Truck size={18} className="text-skj-olive mb-1.5" />
                <p className="text-[10px] text-skj-muted leading-tight">Secure Packaging</p>
              </div>
              <div className="flex flex-col items-center text-center p-3">
                <RefreshCw size={18} className="text-skj-olive mb-1.5" />
                <p className="text-[10px] text-skj-muted leading-tight">Easy Exchange</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="section-spacing bg-skj-ivory" aria-labelledby="related-title">
          <div className="section-container">
            <h2
              id="related-title"
              className="section-title"
            >
              You May Also Like
            </h2>
            <span className="section-divider" aria-hidden="true" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mt-8">
              {relatedProducts.map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        </section>
      )}

      {showToast && (
        <Toast
          message={`${product.name} added to cart`}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
