'use client';

import { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function HeroSlider() {
  // Do not render the old bundled banners while the admin settings are loading.
  // That caused a legacy image to flash on every refresh before being replaced
  // by the current Cloudinary slides.
  const [slides, setSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const preloadedRef = useRef(new Set());

  useEffect(() => {
    let cancelled = false;

    async function loadHomepageMedia() {
      try {
        const response = await fetch('/api/site-settings', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`Unable to load homepage settings (${response.status})`);
        }

        const data = await response.json();
        const nextSlides = Array.isArray(data?.settings?.homepage?.slides)
          ? data.settings.homepage.slides.filter(
              (slide) => slide?.id && (slide?.imageUrl || slide?.mobileImageUrl),
            )
          : [];

        // Preload the first slide images immediately for instant display
        if (nextSlides.length > 0) {
          const first = nextSlides[0];
          const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
          const preloadSrc = isMobile
            ? (first.mobileImageUrl || first.imageUrl)
            : first.imageUrl;

          if (preloadSrc && !preloadedRef.current.has(preloadSrc)) {
            preloadedRef.current.add(preloadSrc);
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = preloadSrc;
            document.head.appendChild(link);
          }
        }

        if (!cancelled) {
          setSlides(nextSlides);
        }
      } catch (error) {
        console.warn('Homepage hero settings could not be loaded:', error);
        if (!cancelled) {
          setSlides([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadHomepageMedia();
    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <section
        className="relative w-full overflow-hidden bg-[#26171B]"
        style={{ aspectRatio: '16 / 9' }}
        aria-label="Loading featured jewellery collections"
        aria-busy="true"
      />
    );
  }

  if (slides.length === 0) {
    return null;
  }

  const hasMultipleSlides = slides.length > 1;

  return (
    <section className="relative overflow-hidden" aria-label="Featured jewellery collections">
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        effect="fade"
        speed={700}
        loop={hasMultipleSlides}
        autoplay={hasMultipleSlides ? {
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
          waitForTransition: false,
        } : false}
        pagination={{
          clickable: true,
          bulletClass: 'hero-bullet',
          bulletActiveClass: 'hero-bullet-active',
        }}
        className="hero-swiper"
        style={{ overflow: 'hidden' }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div
              className="relative w-full overflow-hidden bg-[#26171B]"
              aria-label={slide.alt || 'Sai Praveen Jewellery collection'}
              role="img"
            >
              <picture className="block w-full">
                <source media="(max-width: 767px)" srcSet={slide.mobileImageUrl || slide.imageUrl} />
                <img
                  src={slide.imageUrl}
                  alt={slide.alt || 'Sai Praveen Jewellery collection'}
                  className="block h-auto w-full"
                  style={{ willChange: index === 0 ? 'auto' : 'opacity' }}
                  decoding={index === 0 ? 'sync' : 'async'}
                  draggable="false"
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </picture>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .hero-swiper {
          width: 100%;
          overflow: hidden;
        }
        .hero-swiper .swiper-wrapper {
          will-change: transform;
        }
        .hero-swiper .swiper-slide {
          overflow: hidden;
        }
        .hero-swiper .swiper-pagination {
          bottom: 18px !important;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }
        .hero-bullet {
          display: inline-block;
          width: 22px;
          height: 3px;
          border-radius: 99px;
          background: rgba(255, 249, 239, 0.58);
          margin: 0 !important;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .hero-bullet-active {
          width: 44px;
          background: #d9aa3d;
        }
      `}</style>
    </section>
  );
}
