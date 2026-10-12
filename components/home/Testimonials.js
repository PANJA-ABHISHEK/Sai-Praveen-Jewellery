'use client';

import { Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    id: 1,
    author: 'Pushpa Sree',
    initial: 'P',
    color: 'bg-blue-600',
    time: 'a year ago',
    text: 'Sai Praveen Jewellery creates stunning, high-quality pieces that truly stand out. Their craftsmanship is impeccable, and the staff is friendly and attentive. Every piece I bought exceeded my expectations in beauty and value. Highly recommend for anyone seeking elegant and worthy jewellery that lasts a lifetime.',
  },
  {
    id: 2,
    author: 'Dr Veerendra',
    initial: 'D',
    color: 'bg-indigo-700',
    time: '2 weeks ago',
    text: 'Sai Praveen Jewellery is the good looking premium gold jewellery store in Ravulapalem! Hope every customer visits the store and gives jewellery orders at market best prices on making charges. I bought good collections for my family and friends.',
  },
  {
    id: 3,
    author: 'subrahmanyam munagala',
    initial: 'S',
    color: 'bg-green-700',
    time: '4 years ago',
    text: 'This store has been my go to for all my jewellery needs. Lots of varieties to choose from. Friendly and welcoming staff. Good quality and prompt delivery.',
  },
  {
    id: 4,
    author: 'Gurrala Atchuth Mohan Naidu',
    initial: 'G',
    color: 'bg-blue-500',
    time: '4 years ago',
    text: 'Best Jewellery collection Available nd 100% Quality Trusted Shop Pls Visit 🙏 ...',
  },
  {
    id: 5,
    author: 'Ifa Naina',
    initial: 'I',
    color: 'bg-green-600',
    time: '3 years ago',
    text: 'Very good collection in Ravulapalem! If you want gorgeous designs and pure hallmark quality, you should definitely go for Sai Praveen Jewellery.',
  },
];

export default function Testimonials() {
  return (
    <section className="section-spacing bg-skj-ivory overflow-hidden relative" aria-labelledby="testimonials-title">
      <div className="section-container relative z-10">
        {/* Section header */}
        <div data-aos="fade-up" className="text-center mb-12 sm:mb-16">
          <h2 id="testimonials-title" className="section-title">
            Words From Our Family
          </h2>
          <span className="section-divider mx-auto" aria-hidden="true" />
          <p className="section-subtitle mx-auto">
            Real experiences from customers who trust us with their most precious moments.
          </p>
        </div>

        {/* Swiper Carousel */}
        <div data-aos="fade-up" data-aos-delay="100" className="pb-16 -mx-4 px-4 sm:mx-0 sm:px-0">
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
            className="w-full !pb-14"
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
                      <h3 className="text-sm font-bold text-skj-charcoal leading-tight mb-1 line-clamp-1" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                        {t.author}
                      </h3>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="flex text-[#FABB05]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-[1px]" fill="currentColor" />
                          ))}
                        </div>
                        <span className="text-[10px] sm:text-xs text-skj-muted whitespace-nowrap">{t.time}</span>
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
