'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Play } from 'lucide-react';
import { DEFAULT_SITE_SETTINGS, mergeSiteSettings } from '@/data/siteSettings';
import { STATIC_MEDIA } from '@/data/media';

export default function ShopStoryVideo() {
  const [homepage, setHomepage] = useState({
    ...DEFAULT_SITE_SETTINGS.homepage,
    videoUrl: '',
    videoEnabled: false,
  });
  const videoRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function loadHomepageMedia() {
      try {
        const response = await fetch('/api/site-settings', { cache: 'no-store' });
        const data = await response.json();
        if (!cancelled) setHomepage(mergeSiteSettings(data.settings).homepage);
      } catch (error) {
        console.warn('Homepage video settings fallback active:', error);
      }
    }

    loadHomepageMedia();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!homepage.videoEnabled || !homepage.videoUrl) return null;

  const handleStoryCta = () => {
    videoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    videoRef.current?.play().catch(() => {
      // Playback can still require a direct control tap in some browsers.
    });
  };

  return (
    <section className="relative overflow-hidden bg-[#F7EFE5] py-10 sm:py-14 lg:py-20" aria-labelledby="shop-story-title">
      <div className="pointer-events-none absolute -left-32 top-16 h-72 w-72 rounded-full bg-[#D9AA3D]/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#6D2132]/10 blur-3xl" aria-hidden="true" />

      <div className="section-container relative">
        <div className="grid items-center gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <div className="text-center lg:text-left" data-aos="fade-right">
            <div className="mb-5 flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#A8741D] lg:justify-start">
              <span className="h-px w-10 bg-[#C99A2E]" aria-hidden="true" />
              The SPJ story
              <span className="h-px w-10 bg-[#C99A2E] sm:hidden" aria-hidden="true" />
            </div>
            <h2 id="shop-story-title" className="mx-auto max-w-md text-4xl font-semibold leading-[1.08] text-[#211719] sm:text-5xl lg:mx-0 lg:text-6xl">
              Jewellery with a story worth wearing.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-base leading-8 text-[#6E605D] sm:text-lg lg:mx-0">
              Step inside Sai Praveen Jewellery and discover the care, craft, and tradition behind every memorable piece.
            </p>
            <button
              type="button"
              onClick={handleStoryCta}
              className="mx-auto mt-7 inline-flex items-center gap-3 rounded-full border border-[#D9AA3D]/50 bg-white/70 px-4 py-2.5 text-sm font-medium text-[#5B1F2A] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#D9AA3D]/60 focus:ring-offset-2 lg:mx-0 lg:mt-8"
              aria-label="Watch the Sai Praveen Jewellery shop video"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5B1F2A] text-[#FFF9EF]">
                <Play size={14} fill="currentColor" />
              </span>
              A closer look at our house
              <ArrowUpRight size={16} className="text-[#A8741D]" />
            </button>
          </div>

          <div className="relative" data-aos="fade-left">
            <div className="absolute -inset-3 rounded-[2rem] border border-[#D9AA3D]/35" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[1.6rem] bg-[#211719] shadow-[0_24px_70px_rgba(55,20,25,0.18)]">
              <video
                ref={videoRef}
                className="aspect-video w-full bg-[#211719] object-contain"
                src={homepage.videoUrl}
                poster={STATIC_MEDIA.shopStoryPoster}
                autoPlay
                muted
                loop
                playsInline
                controls
                preload="metadata"
                aria-label="A video about Sai Praveen Jewellery"
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/20" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
