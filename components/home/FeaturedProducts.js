'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.products && Array.isArray(data.products)) {
          const featured = data.products.filter((p) => p.featured && p.stockStatus === 'in_stock');
          setProducts(featured.slice(0, 8));
        }
      } catch (err) {
        console.warn('Featured fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="section-spacing !pt-8 lg:!pt-8 bg-skj-ivory" aria-labelledby="featured-title">
      <div className="section-container">
        {/* Section header */}
        <div data-aos="fade-up">
          <h2 id="featured-title" className="section-title">
            Featured Collection
          </h2>
          <span className="section-divider" aria-hidden="true" />
          <p className="section-subtitle">
            Handpicked pieces from our finest gold and silver collections
          </p>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map((product, index) => (
              <div key={product.id} className="h-full" data-aos="fade-up" data-aos-delay={index * 50}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* View all */}
        <div className="mt-8 text-center" data-aos="fade-up">
          <Link href="/gold/women" className="btn-primary">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
