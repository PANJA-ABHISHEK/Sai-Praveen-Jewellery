'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Search, SlidersHorizontal, X, ChevronDown,
  LayoutGrid, List,
} from 'lucide-react';
import { getAllProducts, getProductsByRoute, getCategories, getPurityOptions, filterAndSortProducts } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import ProductCard from '@/components/product/ProductCard';
import { getProductSectionLabel, sectionHasCategory } from '@/data/productSections';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A to Z' },
];

export default function CatalogueView({ material, section, audience, categoryName }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeSection = section || audience || '';
  const isGlobalCatalogue = !material && !activeSection;
  const showCategoryFilter = isGlobalCatalogue || sectionHasCategory(activeSection);

  // Read initial filter state from URL
  const initialCategories = searchParams.get('category')
    ? searchParams.get('category').split(',')
    : categoryName
      ? [categoryName]
      : [];
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || 'featured';
  const initialPurity = searchParams.get('purity') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategories, setSelectedCategories] = useState(initialCategories);
  const [selectedPurity, setSelectedPurity] = useState(initialPurity);
  const [sortBy, setSortBy] = useState(initialSort);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [weightRange, setWeightRange] = useState({ min: '', max: '' });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [visibleProductCount, setVisibleProductCount] = useState(9);

  // Initial static fallback products for instant rendering
  const staticProducts = useMemo(
    () => isGlobalCatalogue ? getAllProducts() : getProductsByRoute(material, activeSection),
    [material, activeSection, isGlobalCatalogue]
  );

  const [allProducts, setAllProducts] = useState(staticProducts);

  // Sync with Firestore dynamic catalogue
  useEffect(() => {
    async function fetchDynamicProducts() {
      try {
        const params = new URLSearchParams();
        if (material) params.set('material', material);
        if (activeSection) params.set('section', activeSection);
        const query = params.toString();
        const res = await fetch(`/api/products${query ? `?${query}` : ''}`);
        const data = await res.json();
        if (data.products && Array.isArray(data.products)) {
          setAllProducts(data.products);
        }
      } catch (err) {
        console.warn('Dynamic fetch fallback active:', err);
      }
    }
    fetchDynamicProducts();
  }, [material, activeSection]);

  const categories = useMemo(() => {
    if (!showCategoryFilter) return [];
    const cats = [...new Set(allProducts.map((p) => p.category))];
    return cats.filter(Boolean).sort();
  }, [allProducts, showCategoryFilter]);

  const purityOptions = useMemo(() => {
    return [...new Set(allProducts.map((p) => p.purity))].sort();
  }, [allProducts]);

  // Apply filters and sorting
  const filteredProducts = useMemo(() => {
    const filters = {
      section: activeSection,
      category: selectedCategories.length > 0 ? selectedCategories : undefined,
      purity: selectedPurity || undefined,
      search: searchQuery || undefined,
      inStockOnly,
      minPrice: priceRange.min ? Number(priceRange.min) : undefined,
      maxPrice: priceRange.max ? Number(priceRange.max) : undefined,
      minWeight: weightRange.min ? Number(weightRange.min) : undefined,
      maxWeight: weightRange.max ? Number(weightRange.max) : undefined,
    };
    return filterAndSortProducts(allProducts, filters, sortBy);
  }, [allProducts, activeSection, selectedCategories, selectedPurity, searchQuery, sortBy, inStockOnly, priceRange, weightRange]);

  // Keep the first batch compact on phones and progressively reveal more products.
  useEffect(() => {
    const updateViewport = () => {
      const mobile = window.matchMedia('(max-width: 767px)').matches;
      setIsMobileViewport(mobile);
      setVisibleProductCount((currentCount) => {
        const firstBatchSize = mobile ? 8 : 9;
        return currentCount < firstBatchSize ? firstBatchSize : currentCount;
      });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  // A new search/filter result should always start from its first batch.
  useEffect(() => {
    setVisibleProductCount(isMobileViewport ? 8 : 9);
  }, [
    allProducts,
    activeSection,
    selectedCategories,
    selectedPurity,
    searchQuery,
    sortBy,
    inStockOnly,
    priceRange,
    weightRange,
    isMobileViewport,
  ]);

  const visibleProducts = filteredProducts.slice(0, visibleProductCount);

  // Update URL params when filters change
  const updateURL = useCallback(
    (params) => {
      const newParams = new URLSearchParams();
      if (params.categories && params.categories.length > 0) {
        newParams.set('category', params.categories.join(','));
      }
      if (params.search) newParams.set('search', params.search);
      if (params.sort && params.sort !== 'featured') newParams.set('sort', params.sort);
      if (params.purity) newParams.set('purity', params.purity);
      const qs = newParams.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false });
    },
    [pathname, router]
  );

  // Debounced search URL update
  useEffect(() => {
    const timeout = setTimeout(() => {
      updateURL({
        categories: selectedCategories,
        search: searchQuery,
        sort: sortBy,
        purity: selectedPurity,
      });
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery, selectedCategories, sortBy, selectedPurity, updateURL]);

  // Lock body when mobile filters open
  useEffect(() => {
    document.body.style.overflow = mobileFiltersOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileFiltersOpen]);

  const activeFilterCount = selectedCategories.length + [
    selectedPurity,
    inStockOnly,
    priceRange.min,
    priceRange.max,
    weightRange.min,
    weightRange.max,
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedPurity('');
    setInStockOnly(false);
    setPriceRange({ min: '', max: '' });
    setWeightRange({ min: '', max: '' });
    setSearchQuery('');
    setSortBy('featured');
  };

  const materialLabel = material === 'gold' ? 'Gold' : 'Silver';
  const sectionLabel = activeSection ? getProductSectionLabel(activeSection) : '';
  const pageTitle = isGlobalCatalogue
    ? categoryName ? `${categoryName} Jewellery` : 'All Jewellery'
    : showCategoryFilter
      ? `${materialLabel} Jewellery for ${sectionLabel}`
      : `${materialLabel} ${sectionLabel}`;
  const pageDescription = isGlobalCatalogue
    ? categoryName
      ? `Explore gold and silver ${categoryName.toLowerCase()} designs for women and men.`
      : 'Explore handcrafted gold and silver jewellery for every style and occasion.'
    : showCategoryFilter
      ? `Explore our collection of ${materialLabel.toLowerCase()} jewellery designed for ${sectionLabel.toLowerCase()}.`
      : activeSection === 'coins'
        ? `Explore our ${materialLabel.toLowerCase()} coins, crafted for gifting, collecting, and special occasions.`
        : `Explore our ${materialLabel.toLowerCase()} articles and traditional pieces for your home and celebrations.`;

  // Shared filter panel content
  const FilterContent = () => (
    <div className="max-h-[calc(100vh-140px)] space-y-8 overflow-y-auto rounded-3xl border border-skj-gold/20 bg-white/95 p-5 shadow-[0_14px_35px_rgba(54,24,29,0.08)] custom-scrollbar sm:p-6">
      {/* Categories are only relevant to Women and Men jewellery. */}
      {showCategoryFilter && <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-skj-charcoal mb-4"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          Category
        </h3>
        <div className="space-y-3 max-h-[220px] overflow-y-auto custom-scrollbar pr-3">
          {categories.map((cat) => {
            const count = allProducts.filter(p => p.category === cat).length;
            const isChecked = selectedCategories.includes(cat);
            return (
              <label key={cat} className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {
                      setSelectedCategories(prev =>
                        prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
                      );
                    }}
                    className="w-4 h-4 rounded border-skj-border/80 text-skj-olive focus:ring-skj-olive accent-skj-olive cursor-pointer"
                  />
                  <span className={`text-sm transition-colors ${isChecked ? 'text-skj-olive font-semibold' : 'text-skj-charcoal group-hover:text-skj-olive'}`}>
                    {cat}
                  </span>
                </div>
                <span className="text-xs font-medium text-skj-muted/60">{count}</span>
              </label>
            );
          })}
        </div>
      </div>}

      {/* Purity */}
      {purityOptions.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-skj-charcoal mb-3"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            Purity
          </h3>
          <div className="flex flex-wrap gap-2">
            {purityOptions.map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPurity(p === selectedPurity ? '' : p)}
                className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                  selectedPurity === p
                    ? 'border-skj-olive bg-skj-olive text-white'
                    : 'border-skj-border text-skj-charcoal hover:border-skj-olive hover:bg-skj-ivory'
                } rounded-full`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-skj-charcoal mb-3"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          Price Range (₹)
        </h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
            className="w-full rounded-xl border border-skj-border bg-white px-3 py-2 text-sm focus:border-skj-gold focus:outline-none focus:ring-2 focus:ring-skj-gold/15"
            min="0"
          />
          <span className="text-skj-muted self-center text-sm">–</span>
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
            className="w-full rounded-xl border border-skj-border bg-white px-3 py-2 text-sm focus:border-skj-gold focus:outline-none focus:ring-2 focus:ring-skj-gold/15"
            min="0"
          />
        </div>
      </div>

      {/* Weight Range */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-skj-charcoal mb-3"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          Weight (grams)
        </h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={weightRange.min}
            onChange={(e) => setWeightRange((prev) => ({ ...prev, min: e.target.value }))}
            className="w-full rounded-xl border border-skj-border bg-white px-3 py-2 text-sm focus:border-skj-gold focus:outline-none focus:ring-2 focus:ring-skj-gold/15"
            min="0"
          />
          <span className="text-skj-muted self-center text-sm">–</span>
          <input
            type="number"
            placeholder="Max"
            value={weightRange.max}
            onChange={(e) => setWeightRange((prev) => ({ ...prev, max: e.target.value }))}
            className="w-full rounded-xl border border-skj-border bg-white px-3 py-2 text-sm focus:border-skj-gold focus:outline-none focus:ring-2 focus:ring-skj-gold/15"
            min="0"
          />
        </div>
      </div>

      {/* Stock filter */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 accent-skj-olive"
          />
          <span className="text-sm text-skj-charcoal">In stock only</span>
        </label>
      </div>

      {/* Clear all */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearAllFilters}
          className="w-full rounded-full border border-skj-red/20 py-2 text-sm font-medium text-skj-red transition-colors hover:bg-red-50"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-skj-ivory/60">

      {/* Page header */}
      <div className="border-b border-skj-gold/15 bg-gradient-to-b from-skj-ivory to-white/80">
        <div className="section-container py-6 sm:py-8">
          <h1
            className="text-2xl sm:text-3xl font-semibold text-skj-charcoal mb-1"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {pageTitle}
          </h1>
          <p className="text-sm text-skj-muted">
            {pageDescription}
          </p>
        </div>
      </div>

      <div className="section-container py-7 lg:py-8">
        {/* Toolbar: Search, Sort, Mobile filter toggle */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-skj-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-2xl border border-skj-border bg-white/95 py-3 pl-10 pr-4 text-sm shadow-sm transition-all focus:border-skj-gold focus:outline-none focus:ring-2 focus:ring-skj-gold/15"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-skj-muted hover:text-skj-charcoal"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-2xl border border-skj-border bg-white/95 px-4 py-3 pr-10 text-sm shadow-sm focus:border-skj-gold focus:outline-none focus:ring-2 focus:ring-skj-gold/15 sm:w-[200px]"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-skj-muted pointer-events-none" />
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center justify-center gap-2 rounded-2xl border border-skj-border bg-white/80 px-4 py-3 text-sm font-medium transition-colors hover:border-skj-olive hover:bg-white lg:hidden"
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 bg-skj-olive text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedCategories.map(cat => (
              <span key={cat} className="inline-flex items-center gap-1 rounded-full bg-skj-olive/10 px-3 py-1 text-xs font-medium text-skj-olive">
                {cat}
                <button onClick={() => setSelectedCategories(prev => prev.filter(c => c !== cat))} aria-label={`Remove ${cat} filter`}>
                  <X size={12} />
                </button>
              </span>
            ))}
            {selectedPurity && (
              <span className="inline-flex items-center gap-1 rounded-full bg-skj-olive/10 px-3 py-1 text-xs font-medium text-skj-olive">
                {selectedPurity}
                <button onClick={() => setSelectedPurity('')} aria-label={`Remove ${selectedPurity} filter`}>
                  <X size={12} />
                </button>
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1 rounded-full bg-skj-olive/10 px-3 py-1 text-xs font-medium text-skj-olive">
                In Stock
                <button onClick={() => setInStockOnly(false)} aria-label="Remove in-stock filter">
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Product count */}
        <p className="mb-4 text-xs font-medium uppercase tracking-wider text-skj-muted">
          Showing {Math.min(visibleProductCount, filteredProducts.length)} of {filteredProducts.length}{' '}
          {filteredProducts.length === 1 ? 'product' : 'products'}
        </p>

        {/* Main content: Sidebar + Product grid */}
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-[240px] flex-shrink-0">
            <div className="sticky top-28">
              <h2
                className="text-sm font-semibold text-skj-charcoal mb-4 uppercase tracking-wider"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                Filters
              </h2>
              <FilterContent />
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                  {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                {visibleProductCount < filteredProducts.length && (
                  <div className="mt-8 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setVisibleProductCount((count) => count + (isMobileViewport ? 8 : 9))}
                      className="btn-secondary min-w-[170px] justify-center"
                    >
                      Load more products
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Empty state */
              <div className="text-center py-20 px-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-skj-ivory flex items-center justify-center rounded-2xl border border-skj-border/60">
                  <Search size={24} className="text-skj-muted" />
                </div>
                <h3
                  className="text-lg font-semibold text-skj-charcoal mb-2"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {allProducts.length === 0 ? 'Collection Coming Soon' : 'No products found'}
                </h3>
                <p className="text-sm text-skj-muted mb-4 max-w-sm mx-auto">
                  {allProducts.length === 0
                    ? 'Our handcrafted pieces will appear here as soon as they are added to inventory.'
                    : 'Try adjusting your filters or search query to find what you are looking for.'}
                </p>
                {allProducts.length > 0 && (
                  <button onClick={clearAllFilters} className="btn-secondary text-sm">
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFiltersOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-skj-ivory animate-slideUp">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-skj-border bg-white/95 px-5 py-3 backdrop-blur">
              <h2 className="text-sm font-semibold text-skj-charcoal uppercase tracking-wider"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Filters
              </h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 text-skj-charcoal"
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5">
              <FilterContent />
            </div>
            <div className="sticky bottom-0 border-t border-skj-border bg-white/95 p-4 backdrop-blur">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="btn-primary w-full justify-center"
              >
                Show {filteredProducts.length} Products
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        /* Custom scrollbar for filter card */
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E5E7EB;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #5F5F01;
        }
      `}</style>
    </div>
  );
}
