'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Check, Eye } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, formatWeight } from '@/lib/utils';
import { getProductSectionLabel } from '@/data/productSections';
import Toast from '@/components/ui/Toast';

export default function ProductCard({ product }) {
  const { addToCart, isInCart } = useCart();
  const [showToast, setShowToast] = useState(false);

  const isOutOfStock = product.stockStatus === 'out_of_stock';
  const alreadyInCart = isInCart(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product);
    setShowToast(true);
  };

  return (
    <>
      <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-skj-border/40 bg-white shadow-sm transition-all duration-300 hover:border-skj-olive/40 hover:shadow-xl">
        {/* Image container */}
        <Link href={`/product/${product.slug}`} className="block shrink-0">
          <div className="relative aspect-[4/5] overflow-hidden bg-skj-ivory">
            {/* Product image */}
            {product.images && product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              />
            ) : (
              <div className="absolute inset-0 product-image-placeholder">
                <span className="text-skj-gold/40 font-heading text-4xl select-none">SPJ</span>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              {product.featured && (
                <span className="px-3 py-1 rounded-full bg-skj-olive text-white text-[10px] font-bold uppercase tracking-widest shadow-sm">
                  Featured
                </span>
              )}
              {isOutOfStock && (
                <span className="px-3 py-1 rounded-full bg-skj-charcoal/80 text-white text-[10px] font-bold uppercase tracking-widest shadow-sm">
                  Sold Out
                </span>
              )}
            </div>

            {/* Quick view overlay */}
            <div className="absolute inset-0 bg-skj-charcoal/0 group-hover:bg-skj-charcoal/10 transition-all duration-300 flex items-center justify-center">
              <span className="flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-wider text-skj-charcoal opacity-0 shadow-md transition-opacity duration-300 group-hover:opacity-100 sm:px-5 sm:py-2.5 sm:text-xs">
                <Eye size={14} />
                View Details
              </span>
            </div>
          </div>
        </Link>

        {/* Product info */}
        <div className="flex flex-1 flex-col p-3 sm:p-4">
          {/* Category & Material */}
          <div className="mb-1.5 flex min-h-[2.25rem] items-start gap-1.5 sm:gap-2">
            <span className="text-[11px] font-medium text-skj-olive uppercase tracking-wider">
              {product.category || getProductSectionLabel(product)}
            </span>
            <span className="text-skj-border">·</span>
            <span className="text-[11px] text-skj-muted uppercase tracking-wider">
              {product.material} {product.purity}
            </span>
          </div>

          {/* Name */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="mb-2 min-h-[2.5rem] text-sm font-medium leading-snug text-skj-charcoal line-clamp-2 transition-colors group-hover:text-skj-olive"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {product.name}
            </h3>
          </Link>

          {/* Weight */}
          <p className="mb-2 min-h-[1.25rem] text-xs text-skj-muted">
            Wt: {formatWeight(product.weightGrams)}
          </p>

          {/* Price & Add to Cart */}
          <div className="mt-auto grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
            <p className="min-w-0 truncate text-sm font-semibold text-skj-charcoal sm:text-base" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {formatPrice(product.price)}
            </p>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-2 text-[10px] font-bold shadow-sm transition-all duration-300 hover:shadow-md sm:gap-1.5 sm:px-4 sm:text-xs ${
                isOutOfStock
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-skj-olive text-white hover:bg-skj-deep-olive hover:-translate-y-0.5'
              }`}
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingBag size={12} />
              Add
            </button>
          </div>
        </div>
      </article>

      {showToast && (
        <Toast
          message={`${product.name} added to cart`}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}
