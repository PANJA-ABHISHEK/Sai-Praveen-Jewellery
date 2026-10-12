'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const slides = [
  {
    id: 1,
    bg: 'linear-gradient(to right, rgba(41, 40, 33, 0.8), rgba(41, 40, 33, 0.2)), url("/images/hero/hero_bridal_gold_1791637796095.jpg")',
    tagline: 'Timeless Elegance',
    headline: 'Bridal Gold\nCollections',
    description: 'Discover exquisite handcrafted gold jewellery for the most special day of your life.',
    cta: { label: 'Explore Gold', href: '/gold/women' },
    ctaSecondary: { label: 'View All', href: '/gold/men' },
    accent: '#C9A34A',
    dark: true,
  },
  {
    id: 2,
    bg: 'linear-gradient(to right, rgba(41, 40, 33, 0.9), rgba(41, 40, 33, 0.3)), url("/images/hero/hero_sterling_silver_1791637808752.jpg")',
    tagline: 'Pure Craftsmanship',
    headline: 'Sterling Silver\nMasterpieces',
    description: 'Handpicked 925 sterling silver jewellery that blends tradition with contemporary design.',
    cta: { label: 'Discover Silver', href: '/silver/women' },
    ctaSecondary: { label: 'Silver for Men', href: '/silver/men' },
    accent: '#C9A34A',
    dark: true,
  },
  {
    id: 3,
    bg: 'linear-gradient(to right, rgba(41, 40, 33, 0.8), rgba(41, 40, 33, 0.2)), url("/images/hero/hero_temple_jewellery_1791637822451.jpg")',
    tagline: 'Heritage & Tradition',
    headline: 'Temple\nJewellery',
    description: 'Sacred designs inspired by South Indian temple architecture, crafted in 22K gold.',
    cta: { label: 'Shop Necklaces', href: '/gold/women?category=Necklaces' },
    ctaSecondary: null,
    accent: '#C9A34A',
    dark: true,
  },
  {
    id: 4,
    bg: 'linear-gradient(to right, rgba(41, 40, 33, 0.9), rgba(41, 40, 33, 0.3)), url("/images/hero/hero_mens_collection_1791637835648.jpg")',
    tagline: 'For the Modern Man',
    headline: 'Men\'s\nCollection',
    description: 'Bold rings, bracelets, chains and watches crafted for the distinguished gentleman.',
    cta: { label: 'Gold for Men', href: '/gold/men' },
    ctaSecondary: { label: 'Silver for Men', href: '/silver/men' },
    accent: '#C9A34A',
    dark: true,
  },
];

export default function HeroSlider() {
  const swiperRef = useRef(null);
  const contentRefs = useRef([]);

  const animateSlideContent = (index) => {
    const el = contentRefs.current[index];
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const children = el.children;
    gsap.fromTo(
      children,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out',
      }
    );
  };

  useEffect(() => {
    // Animate first slide on mount
    const timeout = setTimeout(() => animateSlideContent(0), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="relative" aria-label="Featured collections">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        speed={800}
        loop
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          bulletClass: 'hero-bullet',
          bulletActiveClass: 'hero-bullet-active',
        }}
        onSwiper={(swiper) => { swiperRef.current = swiper; }}
        onSlideChangeTransitionStart={(swiper) => {
          animateSlideContent(swiper.realIndex);
        }}
        className="hero-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div
              className="relative flex items-center min-h-[480px] sm:min-h-[540px] md:min-h-[580px] lg:min-h-[660px] text-white"
              style={{ backgroundImage: slide.bg, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
            >
              {/* Decorative pattern overlay */}
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
                aria-hidden="true"
              />

              {/* Content */}
              <div className="section-container relative z-10 py-10 -translate-y-8 md:-translate-y-12">
                <div
                  ref={(el) => (contentRefs.current[index] = el)}
                  className="max-w-xl lg:max-w-2xl"
                >
                  {/* Tagline */}
                  <p
                    className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] mb-3"
                    style={{ color: slide.accent, fontFamily: 'Inter, system-ui, sans-serif' }}
                  >
                    {slide.tagline}
                  </p>

                  {/* Headline */}
                  <h2
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-4 whitespace-pre-line text-white"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {slide.headline}
                  </h2>

                  {/* Description */}
                  <p
                    className="text-sm sm:text-base leading-relaxed mb-6 max-w-md text-white/80"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                  >
                    {slide.description}
                  </p>

                  {/* CTAs */}
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={slide.cta.href}
                      className="px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-all duration-300 bg-skj-gold text-skj-charcoal hover:bg-skj-gold/90 rounded-full"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                    >
                      {slide.cta.label}
                    </Link>
                    {slide.ctaSecondary && (
                      <Link
                        href={slide.ctaSecondary.href}
                        className="px-6 py-3 text-sm font-semibold uppercase tracking-wider border transition-all duration-300 border-white/40 text-white hover:bg-white/10 rounded-full"
                        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                      >
                        {slide.ctaSecondary.label}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom navigation buttons */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center bg-white/80 hover:bg-white text-skj-charcoal shadow-sm transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => swiperRef.current?.slideNext()}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center bg-white/80 hover:bg-white text-skj-charcoal shadow-sm transition-all"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      <style jsx global>{`
        .hero-swiper {
          width: 100%;
        }
        .hero-swiper .swiper-pagination {
          bottom: 72px !important;
        }
        .hero-bullet {
          display: inline-block;
          width: 28px;
          height: 3px;
          background: rgba(255, 255, 255, 0.4);
          margin: 0 4px !important;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .hero-bullet-active {
          background: #C59B27;
          width: 40px;
        }
      `}</style>
    </section>
  );
}
