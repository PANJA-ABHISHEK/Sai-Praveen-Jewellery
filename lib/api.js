/**
 * Sri Kankatala Jewellers — Data Access Layer
 * Provides reusable functions to query product data.
 * In Phase 2, these will be replaced with Firestore queries.
 */

import products from '@/data/products';
import { getProductSection, sectionHasCategory } from '@/data/productSections';
import { getCategorySlug } from '@/data/categories';

/**
 * Get all products.
 */
export function getAllProducts() {
  return products;
}

/**
 * Get products filtered by material and section.
 */
export function getProductsByRoute(material, section) {
  return products.filter(
    (p) => p.material === material && getProductSection(p) === section
  );
}

import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { getCentralizedRates, calculateProductPrice } from '@/lib/pricing';

/**
 * Get a single product by its slug (checks static products then Firestore).
 */
export async function getProductBySlug(slug) {
  // Try static first
  const staticFound = products.find((p) => p.slug === slug);
  if (staticFound) return staticFound;

  // Query Firestore
  try {
    const q = query(collection(db, 'products'), where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docSnap = snap.docs[0];
      const p = { id: docSnap.id, ...docSnap.data() };
      if (p.weightGrams && p.makingChargeValue !== undefined) {
        const rates = await getCentralizedRates();
        const dynamicPrice = calculateProductPrice({
          weightGrams: p.weightGrams,
          material: p.material,
          purity: p.purity,
          makingChargeType: p.makingChargeType,
          makingChargeValue: p.makingChargeValue,
          extraAmount: p.extraAmount || 0,
          rates,
        });
        if (dynamicPrice > 0) p.price = dynamicPrice;
      }
      return p;
    }
  } catch (err) {
    console.warn('Firestore getProductBySlug error:', err);
  }

  return null;
}

/**
 * Get featured products, optionally limited.
 */
export function getFeaturedProducts(limit) {
  const featured = products.filter((p) => p.featured && p.stockStatus === 'in_stock');
  return limit ? featured.slice(0, limit) : featured;
}

/**
 * Get related products — same material + category, excluding the current product.
 */
export function getRelatedProducts(product, limit = 4) {
  const productSection = getProductSection(product);

  return products
    .filter(
      (p) =>
        p.id !== product.id &&
        p.material === product.material &&
        getProductSection(p) === productSection &&
        (!sectionHasCategory(productSection) || getCategorySlug(p.category) === getCategorySlug(product.category)) &&
        p.stockStatus === 'in_stock'
    )
    .slice(0, limit);
}

/**
 * Get all unique categories for a given material and audience.
 */
export function getCategories(material, section) {
  const filtered = getProductsByRoute(material, section);
  const cats = [...new Set(filtered.map((p) => p.category).filter(Boolean))];
  return cats.sort();
}

/**
 * Get all unique categories across all products.
 */
export function getAllCategories() {
  return [...new Set(products.map((p) => p.category).filter(Boolean))].sort();
}

/**
 * Get price range for a given material and audience.
 */
export function getPriceRange(material, section) {
  const filtered = getProductsByRoute(material, section);
  if (filtered.length === 0) return { min: 0, max: 0 };
  const prices = filtered.map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

/**
 * Get weight range for a given material and audience.
 */
export function getWeightRange(material, section) {
  const filtered = getProductsByRoute(material, section);
  if (filtered.length === 0) return { min: 0, max: 0 };
  const weights = filtered.map((p) => p.weightGrams);
  return { min: Math.min(...weights), max: Math.max(...weights) };
}

/**
 * Get unique purity options for a given material and audience.
 */
export function getPurityOptions(material, section) {
  const filtered = getProductsByRoute(material, section);
  return [...new Set(filtered.map((p) => p.purity))].sort();
}

/**
 * Filter and sort products.
 */
export function filterAndSortProducts(productList, filters = {}, sortBy = 'featured') {
  let result = [...productList];

  // Category filter
  if (filters.category) {
    if (Array.isArray(filters.category)) {
      if (filters.category.length > 0) {
        result = result.filter((p) => filters.category.includes(p.category));
      }
    } else {
      result = result.filter((p) => p.category === filters.category);
    }
  }

  // Product section filter
  if (filters.section) {
    result = result.filter((p) => getProductSection(p) === filters.section);
  }

  // Price range
  if (filters.minPrice !== undefined && filters.minPrice !== null) {
    result = result.filter((p) => p.price >= filters.minPrice);
  }
  if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
    result = result.filter((p) => p.price <= filters.maxPrice);
  }

  // Weight range
  if (filters.minWeight !== undefined && filters.minWeight !== null) {
    result = result.filter((p) => p.weightGrams >= filters.minWeight);
  }
  if (filters.maxWeight !== undefined && filters.maxWeight !== null) {
    result = result.filter((p) => p.weightGrams <= filters.maxWeight);
  }

  // Purity
  if (filters.purity) {
    result = result.filter((p) => p.purity === filters.purity);
  }

  // Stock availability
  if (filters.inStockOnly) {
    result = result.filter((p) => p.stockStatus === 'in_stock');
  }

  // Search
  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.purity.toLowerCase().includes(q)
    );
  }

  // Sorting
  switch (sortBy) {
    case 'price_asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'name':
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'featured':
    default:
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      break;
  }

  return result;
}
