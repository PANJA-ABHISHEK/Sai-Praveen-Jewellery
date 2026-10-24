'use client';

import { Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    id: 1,
    author: 'arifa sultana',
    initial: 'A',
    color: 'bg-sky-600',
    text: 'Very good collection of gold jewelry. The staff were polite and helpful. The designs are beautiful, and the prices are reasonable. The shopping experience was smooth and pleasant. Highly recommended!',
  },
  {
    id: 2,
    author: 'Durga',
    initial: 'D',
    color: 'bg-orange-600',
    text: 'Gold and silver earrings, necklace chains, rings, elephant silver pooja items — timeless designs with a touch of traditional and modern style.',
  },
  {
    id: 3,
    author: 'jyothsna P',
    initial: 'J',
    color: 'bg-emerald-700',
    text: 'The service in this shop is very satisfying. We purchase every gold item here, and every model is unique. We are very satisfied and impressed.',
  },
  {
    id: 4,
    author: 'sujana atluri',
    initial: 'S',
    color: 'bg-blue-600',
    text: 'Exceptional customer service, a wide variety of high-quality jewelry, and a positive shopping experience. The staff are friendly and helpful. Best jewellery shop in Vijayawada.',
  },
  {
    id: 5,
    author: 'Mallika Shaik',
    initial: 'M',
    color: 'bg-rose-600',
    text: "I'm always purchasing from Praveen Jewellers. There is good staff, and I'm satisfied compared with other jewellery shops. My mom, relatives, and I all purchase gold here.",
  },
  {
    id: 6,
    author: 'Avularamana AvulRamana',
    initial: 'A',
    color: 'bg-teal-700',
    text: 'Your shop is very lucky, Rajasekhar garu. You speak very well and explain everything clearly. Many thanks!',
  },
  {
    id: 7,
    author: 'VR Next',
    initial: 'V',
    color: 'bg-lime-700',
    text: 'No compromise in quality and designs too.',
  },
];

export default function Testimonials() {
  return (
    <section className="section-spacing bg-skj-ivory overflow-hidden relative" aria-labelledby="testimonials-title">
      <div className="section-container relative z-10">
        {/* Section header */}
        <div data-aos="fade-up" className="mb-8 text-center sm:mb-12">
          <h2 id="testimonials-title" className="section-title">
            Words From Our Family
          </h2>
          <span className="section-divider mx-auto" aria-hidden="true" />
          <p className="section-subtitle mx-auto">
            Real experiences from customers who trust us with their most precious moments.
          </p>
        </div>

        {/* Swiper Carousel */}
        <div data-aos="fade-up" data-aos-delay="100" className="-mx-4 px-4 pb-10 sm:mx-0 sm:px-0">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            pagination={{ 
              clickable: true,
              bulletClass: 'swiper-pagination-bullet !bg-skj-olive/40 !opacity-100 !w-2 !h-2 transition-all duration-300',
              bulletActiveClass: '!bg-skj-gold !w-6 !rounded-full',
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="w-full !pb-10"
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.id} className="!h-auto">
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-skj-border/60 h-full flex flex-col relative group transition-all duration-500 hover:shadow-xl hover:border-skj-gold/40">
                  
                  {/* Google Review Header */}
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-semibold text-base sm:text-lg shrink-0 ${t.color}`}>
                      {t.initial}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-skj-charcoal leading-tight mb-1 line-clamp-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                        {t.author}
                      </h3>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="flex text-[#FABB05]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-[1px]" fill="currentColor" />
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* Google G Logo icon (SVG) */}
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 absolute top-6 right-6 sm:top-8 sm:right-8 opacity-20 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  </div>

                  {/* Review Text */}
                  <p className="text-xs sm:text-sm text-skj-charcoal leading-relaxed flex-grow">
                    "{t.text}"
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      
      {/* CSS adjustments for pagination dots specifically for this component */}
      <style jsx global>{`
        .swiper-pagination-bullet {
          margin: 0 4px !important;
        }
      `}</style>
    </section>
  );
}
