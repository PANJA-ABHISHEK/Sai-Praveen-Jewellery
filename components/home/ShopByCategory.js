'use client';

import Link from 'next/link';
import Image from 'next/image';
import categories from '@/data/categories';
import { STATIC_MEDIA } from '@/data/media';

// Select featured categories for homepage display
const featuredCategories = categories.filter((c) =>
  ['Necklaces', 'Harams', 'Jhumkas', 'Bangles', 'Rings', 'Bracelets', 'Mangalsutras', 'Earrings'].includes(c.name)
);

// Image URLs per category
const categoryImages = {
  Necklaces: STATIC_MEDIA.categories.necklaces,
  Harams: STATIC_MEDIA.categories.harams,
  Earrings: STATIC_MEDIA.categories.earrings,
  Jhumkas: STATIC_MEDIA.categories.jhumkas,
  Rings: STATIC_MEDIA.categories.rings,
  Bangles: STATIC_MEDIA.categories.bangles,
  Bracelets: STATIC_MEDIA.categories.bracelets,
  Mangalsutras: STATIC_MEDIA.categories.mangalsutras,
};

export default function ShopByCategory() {
  return (
    <section className="section-spacing !pb-8 lg:!pb-8 bg-skj-ivory" aria-labelledby="categories-title">
      <div className="section-container">
        {/* Section header */}
        <div data-aos="fade-up">
          <h2 id="categories-title" className="section-title">
            Shop by Category
          </h2>
          <span className="section-divider" aria-hidden="true" />
          <p className="section-subtitle">
            Explore our curated collections of handcrafted gold and silver jewellery
          </p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredCategories.map((cat, index) => {
            const href = `/category/${cat.slug}`;

            return (
              <Link
                key={cat.slug}
                href={href}
                className="group relative block"
                data-aos="fade-up"
                data-aos-delay={index * 60}
              >
                <div className="relative aspect-square overflow-hidden rounded-full bg-gradient-to-br from-skj-ivory to-skj-border/60 shadow-lg hover:shadow-2xl ring-4 ring-white transition-all duration-300">
                  {/* Category Image */}
                  {categoryImages[cat.name] && (
                    <Image
                      src={categoryImages[cat.name]}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-skj-deep-olive/0 group-hover:bg-skj-deep-olive/40 transition-all duration-500" />
                </div>

                {/* Category name */}
                <div className="mt-3 text-center">
                  <h3
                    className="text-sm font-medium text-skj-charcoal group-hover:text-skj-olive transition-colors"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                  >
                    {cat.name}
                  </h3>
                  <p className="text-xs text-skj-muted mt-0.5 hidden sm:block">
                    {cat.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View all link */}
        <div className="mt-6 text-center" data-aos="fade-up">
          <Link href="/gold/women" className="btn-secondary">
            View All Collections
          </Link>
        </div>
      </div>
    </section>
  );
}
