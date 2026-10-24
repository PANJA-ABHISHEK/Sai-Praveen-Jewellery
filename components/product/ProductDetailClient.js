'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag, Check, Minus, Plus, Share2, Truck,
  Shield, RefreshCw, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, formatWeight, capitalize } from '@/lib/utils';
import { getProductSection, getProductSectionLabel } from '@/data/productSections';
import { getCategorySlug } from '@/data/categories';
import { getRelatedProducts } from '@/lib/api';
import ProductCard from '@/components/product/ProductCard';
import Toast from '@/components/ui/Toast';
import ProductImageZoom from '@/components/product/ProductImageZoom';

export default function ProductDetailClient({ product }) {
  const { addToCart, isInCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [shareFeedback, setShareFeedback] = useState('');
  const [relatedProducts, setRelatedProducts] = useState(() => getRelatedProducts(product, 4));
  const [relatedLoading, setRelatedLoading] = useState(false);

  const productImages = (Array.isArray(product.images) ? product.images : product.images ? [product.images] : [])
    .filter(Boolean)
    .slice(0, 3);
  const activeImage = productImages[activeImageIndex] || productImages[0] || '';
  const isOutOfStock = product.stockStatus === 'out_of_stock';
  const alreadyInCart = isInCart(product.id);
  const materialLabel = product.material === 'gold' ? 'Gold' : 'Silver';
  const productSection = getProductSection(product);
  const productSectionLabel = getProductSectionLabel(product);
                const catalogueHref = `/${product.material}/${productSection}`;
                const categoryHref = product.category
                  ? `/category/${getCategorySlug(product.category)}`
                  : catalogueHref;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setShowToast(true);
  };

  useEffect(() => {
    if (!shareFeedback) return undefined;
    const timeout = window.setTimeout(() => setShareFeedback(''), 2600);
    return () => window.clearTimeout(timeout);
  }, [shareFeedback]);

  useEffect(() => {
    let cancelled = false;

    async function loadRelatedProducts() {
      setRelatedLoading(true);

      try {
        const params = new URLSearchParams({
          material: product.material,
          section: productSection,
        });
        const response = await fetch(`/api/products?${params.toString()}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Unable to load related products');

        const data = await response.json();
        const categorySlug = getCategorySlug(product.category);
        const matches = (Array.isArray(data.products) ? data.products : [])
          .filter((candidate) => {
            if (candidate.id === product.id || candidate.stockStatus !== 'in_stock') return false;
            if (candidate.material !== product.material) return false;
            if (product.category && getCategorySlug(candidate.category) !== categorySlug) return false;
            return true;
          })
          .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
          .slice(0, 4);

        if (!cancelled) setRelatedProducts(matches);
      } catch {
        if (!cancelled) setRelatedProducts(getRelatedProducts(product, 4));
      } finally {
        if (!cancelled) setRelatedLoading(false);
      }
    }

    loadRelatedProducts();
    return () => { cancelled = true; };
  }, [product.id, product.material, product.category, productSection]);

  const getShareDetails = () => {
    const url = typeof window !== 'undefined'
      ? window.location.href
      : `/product/${product.slug || product.id}`;
    const text = `Take a look at ${product.name} from Sai Praveen Jewellery.`;
    return { url, text };
  };

  const handleShare = async () => {
    const { url, text } = getShareDetails();

    if (typeof navigator.share !== 'function') {
      try {
        await navigator.clipboard.writeText(url);
        setShareFeedback('Product link copied.');
      } catch {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setShareFeedback('Product link copied.');
      }
      return;
    }

    try {
      await navigator.share({ title: product.name, text, url });
      setShareFeedback('Product shared successfully.');
    } catch (error) {
      // Closing the native share sheet is a normal user action.
      if (error?.name === 'AbortError') return;
      setShareFeedback('Sharing was not completed.');
    }
  };

  return (
    <div className="min-h-screen bg-skj-ivory/60">

      {/* Product detail */}
      <div className="section-container py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Product image */}
          <div className="relative">
            <div className="sticky top-28">
              <div className="relative aspect-square overflow-hidden rounded-3xl border border-skj-border/30 bg-gradient-to-br from-skj-ivory to-skj-border/40 shadow-sm">
                {activeImage ? (
                <ProductImageZoom
                  src={activeImage}
                  alt={product.name}
                />
              ) : (
                <div className="text-center">
                  <span className="text-7xl text-skj-gold/20 block mb-2 font-heading">SPJ</span>
                  <p className="text-xs text-skj-muted">Product image placeholder</p>
                </div>
              )}

              {productImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveImageIndex((index) => index === 0 ? productImages.length - 1 : index - 1)}
                    aria-label="Previous product image"
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-skj-charcoal shadow-md transition hover:bg-white"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImageIndex((index) => (index + 1) % productImages.length)}
                    aria-label="Next product image"
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-skj-charcoal shadow-md transition hover:bg-white"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.featured && (
                  <span className="rounded-full bg-skj-olive px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
                    Featured
                  </span>
                )}
                {isOutOfStock && (
                  <span className="rounded-full bg-skj-charcoal px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
                    Sold Out
                  </span>
                )}
              </div>
            </div>

            {productImages.length > 1 && (
              <div className="mt-3 grid grid-cols-3 gap-3">
                {productImages.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`View product image ${index + 1}`}
                    aria-pressed={activeImageIndex === index}
                    className={`relative aspect-square overflow-hidden rounded-2xl border-2 bg-skj-ivory transition ${
                      activeImageIndex === index
                        ? 'border-skj-gold shadow-sm'
                        : 'border-transparent opacity-75 hover:border-skj-border hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 33vw, 16vw"
                    />
                    <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-skj-charcoal shadow-sm">
                      {index + 1}
                    </span>
                  </button>
                ))}
              </div>
            )}
            </div>
          </div>

          {/* Right: Product info */}
          <div>
            {/* Category tag */}
            <div className="flex items-center gap-2 mb-3">
              <Link
                  href={categoryHref}
                className="text-xs font-semibold text-skj-olive uppercase tracking-[0.15em] hover:text-skj-deep-olive transition-colors"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {product.category || productSectionLabel}
              </Link>
              <span className="text-skj-border">·</span>
              <span className="text-xs text-skj-muted uppercase tracking-wider">
                {materialLabel} {product.purity}
              </span>
            </div>

            {/* Product name + sharing */}
            <div className="mb-4 flex items-start justify-between gap-4">
              <h1
                className="min-w-0 flex-1 text-2xl font-semibold leading-tight text-skj-charcoal sm:text-3xl lg:text-4xl"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {product.name}
              </h1>

              <div className="flex shrink-0 flex-col items-end">
                <button
                  type="button"
                  onClick={handleShare}
                  className="group inline-flex items-center gap-2 rounded-full border-2 border-skj-olive/55 bg-white px-3 py-2 text-xs font-semibold text-skj-deep-olive shadow-sm transition hover:border-skj-olive hover:bg-skj-ivory hover:text-skj-olive hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-skj-gold/50 sm:px-4 sm:text-sm"
                >
                  <Share2 size={17} className="transition-transform group-hover:scale-110" />
                  <span>Share</span>
                </button>
                {shareFeedback && (
                  <span role="status" className="mt-0.5 whitespace-nowrap text-[10px] font-medium text-skj-olive">
                    {shareFeedback}
                  </span>
                )}
              </div>
            </div>

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
              <div className="rounded-xl border border-skj-border/50 bg-skj-ivory/60 p-3">
                <p className="text-[10px] text-skj-muted uppercase tracking-wider mb-0.5">Material</p>
                <p className="text-sm font-medium text-skj-charcoal">{capitalize(product.material)}</p>
              </div>
              <div className="rounded-xl border border-skj-border/50 bg-skj-ivory/60 p-3">
                <p className="text-[10px] text-skj-muted uppercase tracking-wider mb-0.5">Purity</p>
                <p className="text-sm font-medium text-skj-charcoal">{product.purity}</p>
              </div>
              <div className="rounded-xl border border-skj-border/50 bg-skj-ivory/60 p-3">
                <p className="text-[10px] text-skj-muted uppercase tracking-wider mb-0.5">Weight</p>
                <p className="text-sm font-medium text-skj-charcoal">{formatWeight(product.weightGrams)}</p>
              </div>
              <div className="rounded-xl border border-skj-border/50 bg-skj-ivory/60 p-3">
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
                <div className="flex items-center overflow-hidden rounded-full border-2 border-skj-olive/40 bg-white shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-skj-deep-olive transition-colors hover:bg-skj-ivory"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center text-sm font-medium text-skj-charcoal">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-skj-deep-olive transition-colors hover:bg-skj-ivory"
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
                      ? 'border-2 border-skj-olive/50 bg-skj-ivory text-skj-deep-olive shadow-sm'
                      : 'bg-skj-olive text-white shadow-lg shadow-skj-olive/25 hover:-translate-y-0.5 hover:bg-skj-deep-olive'
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
              <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-skj-red">
                This product is currently out of stock. Please check back later or contact us for availability.
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-skj-border">
              <div className="flex flex-col items-center rounded-2xl border border-skj-gold/15 bg-white/75 p-3 text-center shadow-sm">
                <Shield size={18} className="mb-1.5 text-skj-olive" />
                <p className="text-[10px] text-skj-muted leading-tight">Hallmark Certified</p>
              </div>
              <div className="flex flex-col items-center rounded-2xl border border-skj-gold/15 bg-white/75 p-3 text-center shadow-sm">
                <Truck size={18} className="mb-1.5 text-skj-olive" />
                <p className="text-[10px] text-skj-muted leading-tight">Secure Packaging</p>
              </div>
              <div className="flex flex-col items-center rounded-2xl border border-skj-gold/15 bg-white/75 p-3 text-center shadow-sm">
                <RefreshCw size={18} className="mb-1.5 text-skj-olive" />
                <p className="text-[10px] text-skj-muted leading-tight">Easy Exchange</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {(relatedLoading || relatedProducts.length > 0) && (
        <section className="section-spacing border-t border-skj-gold/15 bg-skj-ivory" aria-labelledby="related-title">
          <div className="section-container">
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.28em] text-skj-gold">Curated for you</p>
            <h2 id="related-title" className="section-title mt-2">More from this collection</h2>
            <span className="section-divider" aria-hidden="true" />
            <p className="section-subtitle mb-8">
              Similar {product.material === 'gold' ? 'gold' : 'silver'} {product.category ? product.category.toLowerCase() : 'jewellery'} selected to complement your style.
            </p>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
              {relatedLoading && relatedProducts.length === 0
                ? Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="overflow-hidden rounded-3xl border border-skj-border/60 bg-white">
                      <div className="aspect-[4/5] skeleton" />
                      <div className="space-y-3 p-4">
                        <div className="h-3 w-2/5 rounded-full skeleton" />
                        <div className="h-4 w-4/5 rounded-full skeleton" />
                        <div className="h-4 w-1/3 rounded-full skeleton" />
                      </div>
                    </div>
                  ))
                : relatedProducts.map((rp) => (
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
