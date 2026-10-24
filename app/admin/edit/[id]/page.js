'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2, AlertCircle,
  Loader2, Check, FolderPlus, X
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import {
  DEFAULT_RATES,
  getRatePerGram,
  calculateProductPrice,
} from '@/lib/pricing';
import { DEFAULT_CATEGORIES } from '@/lib/categories';
import { PRODUCT_SECTIONS, sectionHasCategory } from '@/data/productSections';
import AdminShell from '@/components/admin/AdminShell';
import ProductImagePicker from '@/components/admin/ProductImagePicker';

const EMPTY_IMAGE_SLOTS = ['', '', ''];

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  // Submit State: 'idle' | 'submitting' | 'success'
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [error, setError] = useState('');

  // Dynamic Categories State
  const [categoriesList, setCategoriesList] = useState(DEFAULT_CATEGORIES);
  const [newCategoryModalOpen, setNewCategoryModalOpen] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [newCategoryError, setNewCategoryError] = useState('');
  const [savingCategory, setSavingCategory] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [material, setMaterial] = useState('gold');
  const [section, setSection] = useState('women');
  const [category, setCategory] = useState('Necklaces');
  const [customCategory, setCustomCategory] = useState('');
  const [purity, setPurity] = useState('22K');
  const [weightGrams, setWeightGrams] = useState('');
  const [makingChargeType, setMakingChargeType] = useState('percentage'); // 'percentage' | 'milligrams'
  const [makingChargeValue, setMakingChargeValue] = useState('');
  const [extraAmount, setExtraAmount] = useState('0');
  const [stockStatus, setStockStatus] = useState('in_stock');
  const [featured, setFeatured] = useState(false);
  const [centralizedRates, setCentralizedRates] = useState(null);

  // Image Upload State
  const [imagePreviews, setImagePreviews] = useState(EMPTY_IMAGE_SLOTS);
  const [cloudinaryUrls, setCloudinaryUrls] = useState(EMPTY_IMAGE_SLOTS);
  const [uploadingImages, setUploadingImages] = useState([false, false, false]);

  // 1. Fetch Existing Product Data & Prefetch Dashboard
  useEffect(() => {
    router.prefetch('/admin');
    async function loadProduct() {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        const data = await res.json();
        if (!res.ok || !data.product) {
          throw new Error(data.error || 'Product not found');
        }

        const p = data.product;
        setName(p.name || '');
        setDescription(p.description || '');
        setMaterial(p.material || 'gold');
        setSection(p.section || p.audience || 'women');

        if (p.category) {
          setCategory(p.category);
          setCategoriesList((prev) => Array.from(new Set([...prev, p.category])).sort());
        }

        setPurity(p.purity || '22K');
        setWeightGrams(p.weightGrams?.toString() || '');
        setMakingChargeType(p.makingChargeType || 'percentage');
        setMakingChargeValue(p.makingChargeValue !== undefined ? p.makingChargeValue.toString() : '');
        setExtraAmount(p.extraAmount !== undefined ? p.extraAmount.toString() : '0');
        setStockStatus(p.stockStatus || 'in_stock');
        setFeatured(Boolean(p.featured));

        const existingImages = (Array.isArray(p.images) ? p.images : p.images ? [p.images] : [])
          .filter(Boolean)
          .slice(0, 3);
        setCloudinaryUrls([...existingImages, ...EMPTY_IMAGE_SLOTS].slice(0, 3));
        setImagePreviews([...existingImages, ...EMPTY_IMAGE_SLOTS].slice(0, 3));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    async function loadRates() {
      try {
        const res = await fetch('/api/gold-rates');
        const data = await res.json();
        if (data?.rates) {
          setCentralizedRates(data.rates);
        }
      } catch (err) {
        console.warn('Could not load centralized rates:', err);
      }
    }

    async function loadDynamicCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data?.categories && Array.isArray(data.categories)) {
          setCategoriesList((prev) => Array.from(new Set([...prev, ...data.categories])).sort());
        }
      } catch (err) {
        console.warn('Could not load dynamic categories:', err);
      }
    }

    if (id) {
      loadDynamicCategories();
      loadProduct();
      loadRates();
    }
  }, [id, router]);

  // Category selection handler (prompts modal on 'Other')
  const handleCategoryChange = (e) => {
    const val = e.target.value;
    if (val === 'Other' || val === 'Others') {
      setNewCategoryInput('');
      setNewCategoryError('');
      setNewCategoryModalOpen(true);
    } else {
      setCategory(val);
      setCustomCategory('');
    }
  };

  const handleSectionChange = (e) => {
    const nextSection = e.target.value;
    setSection(nextSection);
    setCustomCategory('');

    if (sectionHasCategory(nextSection)) {
      setCategory((currentCategory) => currentCategory || categoriesList[0] || 'Necklaces');
    } else {
      setCategory('');
    }
  };

  // Save new custom category to Firestore and select it
  const handleSaveNewCategory = async (e) => {
    if (e) e.preventDefault();
    const trimmed = newCategoryInput.trim();
    if (!trimmed) {
      setNewCategoryError('Please enter a category name.');
      return;
    }
    if (trimmed.toLowerCase() === 'other' || trimmed.toLowerCase() === 'others') {
      setNewCategoryError('Please enter a specific category name (e.g. Brooches).');
      return;
    }

    setSavingCategory(true);
    setNewCategoryError('');
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save new category');
      }

      if (data.categories) {
        setCategoriesList(data.categories);
      } else {
        setCategoriesList((prev) => Array.from(new Set([...prev, trimmed])).sort());
      }

      setCategory(trimmed);
      setCustomCategory('');
      setNewCategoryModalOpen(false);
      setNewCategoryInput('');
    } catch (err) {
      setNewCategoryError(err.message || 'Error saving category');
    } finally {
      setSavingCategory(false);
    }
  };

  const handleCancelNewCategory = () => {
    setNewCategoryModalOpen(false);
    setNewCategoryInput('');
    setNewCategoryError('');
    if (!categoriesList.includes(category)) {
      setCategory(categoriesList[0] || 'Necklaces');
    }
  };

  // Current rate per gram based on material & purity
  const currentRatePerGram = useMemo(() => {
    return getRatePerGram(material, purity, centralizedRates);
  }, [material, purity, centralizedRates]);

  // Real-time auto-calculated price using centralized rates, making charges & extra amount
  const calculatedPrice = useMemo(() => {
    return calculateProductPrice({
      weightGrams: parseFloat(weightGrams) || 0,
      material,
      purity,
      makingChargeType,
      makingChargeValue: parseFloat(makingChargeValue) || 0,
      extraAmount: parseFloat(extraAmount) || 0,
      rates: centralizedRates,
    });
  }, [weightGrams, material, purity, makingChargeType, makingChargeValue, extraAmount, centralizedRates]);

  const hasCategory = sectionHasCategory(section);

  // Automatic upload to Cloudinary upon selecting a new product photo
  const handleFileChange = async (index, e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setImagePreviews((previous) => previous.map((value, slot) => slot === index ? localPreview : value));
    setCloudinaryUrls((previous) => previous.map((value, slot) => slot === index ? '' : value));
    setUploadingImages((previous) => previous.map((value, slot) => slot === index ? true : value));
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Image upload failed');
      }

      setCloudinaryUrls((previous) => previous.map((value, slot) => slot === index ? data.url : value));
    } catch (err) {
      console.error('Image upload failed:', err);
      URL.revokeObjectURL(localPreview);
      setImagePreviews((previous) => previous.map((value, slot) => slot === index ? '' : value));
      setCloudinaryUrls((previous) => previous.map((value, slot) => slot === index ? '' : value));
      setError(`Image Upload Error: ${err.message}`);
    } finally {
      setUploadingImages((previous) => previous.map((value, slot) => slot === index ? false : value));
    }
  };

  const handleRemoveImage = (index) => {
    const preview = imagePreviews[index];
    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);

    setImagePreviews((previous) => {
      const next = previous.filter((_, slot) => slot !== index);
      return [...next, ''].slice(0, 3);
    });
    setCloudinaryUrls((previous) => {
      const next = previous.filter((_, slot) => slot !== index);
      return [...next, ''].slice(0, 3);
    });
    setUploadingImages((previous) => {
      const next = previous.filter((_, slot) => slot !== index);
      return [...next, false].slice(0, 3);
    });
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitStatus !== 'idle') return;
    setError('');

    if (!weightGrams || parseFloat(weightGrams) <= 0) {
      setError('Please enter a valid product weight in grams.');
      return;
    }

    if (!makingChargeValue || parseFloat(makingChargeValue) < 0) {
      setError(
        `Please enter the making charge ${
          makingChargeType === 'percentage' ? 'percentage' : 'in milligrams per gram'
        }.`
      );
      return;
    }

    if (!currentRatePerGram || currentRatePerGram <= 0) {
      setError(
        `Centralized daily rate for ${purity} ${material} is not set. Please update rates via "Gold/Silver Prices" on the dashboard before updating.`
      );
      return;
    }

    if (uploadingImages.some(Boolean)) {
      setError('Please wait for all selected photos to finish uploading.');
      return;
    }

    const productImages = cloudinaryUrls.filter(Boolean);
    if (!productImages[0]) {
      setError('Please keep at least one product photo.');
      return;
    }

    setSubmitStatus('submitting');

    try {
      const finalCategory = hasCategory
        ? (category === 'Other' ? (customCategory.trim() || 'Other') : category)
        : '';

      // Automatically register new category to persistent Firestore storage if not present
      if (hasCategory && finalCategory && finalCategory !== 'Other' && !categoriesList.includes(finalCategory)) {
        try {
          await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: finalCategory }),
          });
        } catch (catErr) {
          console.warn('Auto-save category note:', catErr.message);
        }
      }

      const payload = {
        name: name.trim(),
        description: description.trim(),
        material,
        section,
        audience: section === 'women' || section === 'men' ? section : 'all',
        category: finalCategory,
        purity,
        weightGrams: parseFloat(weightGrams) || 0,
        makingChargeType,
        makingChargeValue: parseFloat(makingChargeValue) || 0,
        extraAmount: parseFloat(extraAmount) || 0,
        price: calculatedPrice,
        stockStatus,
        featured,
        images: productImages,
      };

      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update product');
      }

      setSubmitStatus('success');

      setTimeout(() => {
        router.push('/admin');
      }, 1500);
    } catch (err) {
      setError(err.message);
      setSubmitStatus('idle');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C8102E] animate-spin" />
      </div>
    );
  }

  return (
    <AdminShell
      pageTitle="Edit Product"
      pageDescription="Update product details, section, pricing, and store availability."
      backHref="/admin"
      backLabel="Back to Products"
    >
      <div className="min-h-[calc(100vh-68px)] bg-[#F8F9FA] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-8">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-start gap-3 animate-modal-card">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:bg-white transition-all"
              />
            </div>

            {/* Material & Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                  Material *
                </label>
                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:bg-white transition-all cursor-pointer"
                >
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                  Section *
                </label>
                <select
                  value={section}
                  onChange={handleSectionChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:bg-white transition-all cursor-pointer"
                >
                  {PRODUCT_SECTIONS.map((item) => (
                    <option key={item.id} value={item.id}>{item.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category & Purity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {hasCategory && <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Category *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setNewCategoryInput('');
                      setNewCategoryError('');
                      setNewCategoryModalOpen(true);
                    }}
                    className="text-xs font-semibold text-[#8B0000] hover:text-[#5B0000] inline-flex items-center gap-1 cursor-pointer transition-colors"
                    title="Add a new permanent category"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>+ Add New Category</span>
                  </button>
                </div>
                <select
                  value={category}
                  onChange={handleCategoryChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:bg-white transition-all cursor-pointer"
                >
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="Other">Other (Add Custom Category...)</option>
                </select>

                {category === 'Other' && (
                  <div className="mt-2.5">
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="Type custom category name..."
                      required
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                    />
                  </div>
                )}
              </div>}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                  {material === 'gold' ? 'Carats / Gold Purity *' : 'Silver Purity *'}
                </label>
                {material === 'gold' ? (
                  <select
                    value={purity}
                    onChange={(e) => setPurity(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="22K">22K</option>
                    <option value="24K">24K</option>
                    <option value="18K">18K</option>
                  </select>
                ) : (
                  <select
                    value={purity}
                    onChange={(e) => setPurity(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="92.5%">92.5%</option>
                    <option value="Premium (Gold Coated)">Premium (Gold Coated)</option>
                    <option value="Traditional Silver">Traditional Silver</option>
                  </select>
                )}
              </div>
            </div>

            {/* Weight & Making Charge Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                  Weight (in Grams) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={weightGrams}
                    onChange={(e) => setWeightGrams(e.target.value)}
                    required
                    className="w-full pl-4 pr-16 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:bg-white transition-all"
                  />
                  <span className="absolute right-3.5 top-3.5 text-xs font-semibold text-gray-400 pointer-events-none">
                    grams
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                  Making Charge Type *
                </label>
                <select
                  value={makingChargeType}
                  onChange={(e) => setMakingChargeType(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:bg-white transition-all cursor-pointer"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="milligrams">Milligrams (mg per gram)</option>
                </select>
              </div>
            </div>

            {/* Making Charge Value & Extra Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                  {makingChargeType === 'percentage'
                    ? 'Making Charge Percentage (%) *'
                    : 'Making Charge (mg per gram) *'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step={makingChargeType === 'percentage' ? '0.1' : '1'}
                    min="0"
                    value={makingChargeValue}
                    onChange={(e) => setMakingChargeValue(e.target.value)}
                    placeholder={
                      makingChargeType === 'percentage'
                        ? 'e.g. 12%'
                        : 'e.g. 150 mg, 200 mg, or 500 mg'
                    }
                    required
                    className="w-full pl-4 pr-14 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:bg-white transition-all"
                  />
                  <span className="absolute right-3.5 top-3.5 text-xs font-semibold text-gray-400 pointer-events-none">
                    {makingChargeType === 'percentage' ? '%' : 'mg/g'}
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  {makingChargeType === 'percentage'
                    ? 'Calculated as percentage on gold metal value'
                    : 'Wastage / making in milligrams per 1 gram of jewellery'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                  Extra Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-sm font-semibold text-gray-400 pointer-events-none">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={extraAmount}
                    onChange={(e) => setExtraAmount(e.target.value)}
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:bg-white transition-all"
                  />
                </div>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Additional fixed charges (e.g. stones, gemstones, hallmark). Default is ₹0.
                </span>
              </div>
            </div>

            {/* Live Auto-Calculated Price Summary */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                Auto-Calculated Total Price (Live)
              </label>
              {currentRatePerGram <= 0 ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center justify-between gap-3">
                  <div>
                    <span className="font-semibold block text-sm">Rate Not Configured</span>
                    <span className="text-[11px] text-amber-800">
                      No daily market rate found for {material === 'gold' ? `${purity} Gold` : `${purity} Silver`}. Please update rates using &ldquo;Gold/Silver Prices&rdquo; on the dashboard.
                    </span>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-amber-200 text-amber-900 whitespace-nowrap">
                    Rate Required
                  </span>
                </div>
              ) : (
                <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 font-serif">
                      {calculatedPrice > 0 ? formatPrice(calculatedPrice) : '₹0'}
                    </div>
                    <div className="text-xs text-amber-900 font-medium mt-1">
                      {material === 'gold' ? 'Gold' : 'Silver'} Value + Making Charges + Extra Amount ({formatPrice(parseFloat(extraAmount) || 0)})
                    </div>
                    <div className="text-[11px] text-amber-800/80 mt-0.5">
                      Rate: {formatPrice(currentRatePerGram)}/g ({material === 'gold' ? `${purity} Gold` : `${purity} Silver`})
                    </div>
                  </div>
                  <span className="self-start sm:self-center text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-200/80 text-amber-900 border border-amber-300">
                    Auto-Priced
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:bg-white transition-all"
              />
            </div>

            {/* Product Photos */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                Product Photos *
              </label>
              <ProductImagePicker
                previews={imagePreviews}
                urls={cloudinaryUrls}
                uploading={uploadingImages}
                onSelect={handleFileChange}
                onRemove={handleRemoveImage}
              />
            </div>

            {/* Featured Collection Toggle */}
            <div className="pt-2">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-gray-900 block">Featured Collection</span>
                  <span className="text-xs text-gray-500">Show on homepage showcase</span>
                </div>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-5 h-5 text-[#8B0000] accent-[#8B0000] rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-4">
              <Link
                href="/admin"
                className={`px-5 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors ${
                  submitStatus !== 'idle' ? 'pointer-events-none opacity-40' : ''
                }`}
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={submitStatus !== 'idle' || uploadingImages.some(Boolean)}
                className={`min-w-[190px] h-[48px] px-7 py-3 text-white text-sm font-semibold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2.5 ${
                  submitStatus === 'success'
                    ? 'bg-emerald-600 shadow-emerald-600/30 scale-[1.02] cursor-default'
                    : submitStatus === 'submitting'
                    ? 'bg-[#B00E28] shadow-[#B00E28]/25 cursor-wait'
                    : 'bg-[#C8102E] hover:bg-[#A00D24] active:scale-[0.98] shadow-[#C8102E]/25 cursor-pointer'
                }`}
              >
                {submitStatus === 'submitting' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white/90" />
                    <span>Saving Changes...</span>
                  </>
                ) : submitStatus === 'success' ? (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Updated!</span>
                  </>
                ) : (
                  <span>Update Product</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Luxury Success Transition Modal Overlay */}
      {submitStatus === 'success' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-modal-backdrop px-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 max-w-sm w-full mx-auto text-center animate-modal-card">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
              <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
            </div>
            <h3 className="font-serif text-xl font-bold text-gray-900 mb-1.5">
              Changes Saved!
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-6 px-1 line-clamp-2">
              &ldquo;{name || 'Product'}&rdquo; has been updated successfully.
            </p>

            {/* Smooth Progress Indicator */}
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden mb-2.5">
              <div className="bg-[#C8102E] h-full rounded-full animate-modal-progress" />
            </div>
            <span className="text-[11px] font-medium text-gray-400">
              Returning to dashboard...
            </span>
          </div>
        </div>
      )}
      {/* Modal: Add New Custom Category */}
      {newCategoryModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-modal-backdrop">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full p-6 text-left animate-modal-card">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-800 flex items-center justify-center flex-shrink-0">
                  <FolderPlus className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-gray-900 leading-tight">
                    Add New Category
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Saved to filters and visible for all future products
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCancelNewCategory}
                disabled={savingCategory}
                className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {newCategoryError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl mb-4 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>{newCategoryError}</span>
              </div>
            )}

            <form onSubmit={handleSaveNewCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={newCategoryInput}
                  onChange={(e) => setNewCategoryInput(e.target.value)}
                  placeholder="e.g. Brooches, Toe Rings, Waist Chains"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:bg-white transition-all"
                />
                <span className="text-[11px] text-gray-400 mt-1.5 block">
                  This category will be permanently added to your catalogue filters and product dropdown.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={savingCategory}
                  onClick={handleCancelNewCategory}
                  className="px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCategory}
                  style={{ color: '#ffffff' }}
                  className="px-5 py-2.5 bg-[#C8102E] hover:bg-[#A00D24] !text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-[#C8102E]/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {savingCategory ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin !text-white" />
                      <span className="!text-white">Saving Category...</span>
                    </>
                  ) : (
                    <>
                      <FolderPlus className="w-4 h-4 !text-white" />
                      <span className="!text-white">Save & Select Category</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </AdminShell>
  );
}
