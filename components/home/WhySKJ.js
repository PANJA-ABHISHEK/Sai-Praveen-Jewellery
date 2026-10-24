'use client';

import { Shield, Gem, Heart, Award } from 'lucide-react';

const values = [
  {
    icon: Gem,
    title: 'Authentic Craftsmanship',
    description: 'Every piece is handcrafted by skilled artisans using time-honoured techniques passed down through generations.',
  },
  {
    icon: Shield,
    title: 'Certified Purity',
    description: 'Our gold and silver jewellery comes with hallmark certification, ensuring the purity you deserve.',
  },
  {
    icon: Heart,
    title: 'Customer First',
    description: 'We believe in building lasting relationships with our customers through trust, transparency and exceptional service.',
  },
  {
    icon: Award,
    title: 'Timeless Designs',
    description: 'From classic temple jewellery to contemporary pieces, our collections cater to every taste and occasion.',
  },
];

export default function WhySKJ() {
  return (
    <section className="section-spacing bg-white" aria-labelledby="why-skj-title">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Editorial content */}
            <div data-aos="fade-right" className="pr-0 text-center lg:pr-8 lg:text-left">
            <p
              className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-skj-gold sm:text-xs"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Our Heritage
            </p>
            <h2
              id="why-skj-title"
              className="mb-6 text-3xl font-semibold leading-[1.15] text-skj-charcoal sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Why Sai Praveen
              <br />
              Jewellery?
            </h2>
            <div className="mx-auto mb-10 max-w-2xl space-y-5 text-sm leading-relaxed text-skj-muted sm:text-base lg:mx-0">
              <p>
                At Sai Praveen Jewellery, we bring together the rich tradition of Indian
                jewellery-making with a commitment to quality and customer satisfaction that
                defines everything we do.
              </p>
              <p>
                Our curated collections feature handcrafted gold and silver jewellery
                designed for life&apos;s most precious moments — from bridal trousseau to
                everyday elegance. Each piece reflects our dedication to authentic
                craftsmanship and timeless beauty.
              </p>
            </div>

            {/* Quick stats with premium styling */}
            <div className="flex flex-wrap justify-center gap-8 border-t border-skj-border/50 pt-6 sm:gap-12 lg:justify-start">
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-semibold text-skj-olive mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  22K
                </p>
                <p className="text-[10px] sm:text-xs font-medium text-skj-charcoal uppercase tracking-[0.15em]">Gold Purity</p>
              </div>
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-semibold text-skj-olive mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  925
                </p>
                <p className="text-[10px] sm:text-xs font-medium text-skj-charcoal uppercase tracking-[0.15em]">Sterling Silver</p>
              </div>
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-semibold text-skj-olive mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  100%
                </p>
                <p className="text-[10px] sm:text-xs font-medium text-skj-charcoal uppercase tracking-[0.15em]">Hallmarked</p>
              </div>
            </div>
          </div>

          {/* Right: Value propositions */}
          <div className="grid gap-x-6 gap-y-10 text-center sm:grid-cols-2 lg:gap-y-12 lg:text-left" data-aos="fade-left">
            {values.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group relative bg-transparent"
                  data-aos="fade-up"
                  data-aos-delay={index * 80}
                >
                  <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-skj-gold/40 text-skj-olive transition-all duration-500 group-hover:border-skj-olive group-hover:bg-skj-olive group-hover:text-white lg:mx-0">
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <h3
                    className="mb-3 text-lg font-medium text-skj-charcoal sm:text-xl"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm text-skj-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
