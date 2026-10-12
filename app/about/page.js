import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'About Sai Praveen Jewellery | Ravulapalem',
  description:
    'Discover Sai Praveen Jewellery in Ravulapalem, Andhra Pradesh. Explore our jewellery collections and learn more about our brand.',
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">

      {/* Hero section */}
      <section className="bg-skj-ivory text-skj-charcoal relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-skj-olive/5 hidden lg:block" />
        <div className="section-container relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center pt-8 pb-12 lg:pt-12 lg:pb-20">
            <div className="max-w-xl order-2 lg:order-1">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-skj-olive mb-4 block" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Sai Praveen Jewellery
              </span>
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight mb-6"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Jewellery That Celebrates Tradition
              </h1>
              <div className="space-y-4 mb-8 border-l-2 border-skj-olive/30 pl-4">
                <p className="text-base text-skj-muted leading-relaxed">
                  Discover the timeless beauty of Indian jewellery, bringing elegance to your celebrations, traditions and treasured moments.
                </p>
                <p className="text-base text-skj-muted leading-relaxed">
                  Located in the heart of Ravulapalem, Andhra Pradesh, Sai Praveen Jewellery has been a trusted destination for families seeking authentic craftsmanship and pure gold designs. We invite you to explore collections that complement your individual style while honouring cultural heritage.
                </p>
              </div>
              <Link href="/gold/women" className="btn-primary rounded-full px-8 py-3.5">
                Explore Our Collection
              </Link>
            </div>
            {/* Hero Image */}
            <div className="relative w-full h-[350px] lg:h-[420px] max-w-sm lg:max-w-md mx-auto lg:ml-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-white order-1 lg:order-2">
              <Image
                src="/images/skjshop1.png"
                alt="Sai Praveen Jewellery Store"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-spacing bg-white">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <p
              className="text-xs font-semibold uppercase tracking-[0.2em] text-skj-olive mb-4"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Our Story
            </p>
            <p className="text-lg sm:text-xl text-skj-charcoal leading-relaxed font-medium" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              “At Sai Praveen Jewellery, jewellery represents more than beauty — it reflects tradition, personal style and the special moments that bring families together. Located in Ravulapalem, Andhra Pradesh, we invite customers to discover jewellery that complements their celebrations, cultural traditions and individual style.”
            </p>
            <div className="w-16 h-0.5 bg-gradient-to-r from-skj-olive to-skj-gold mx-auto mt-8" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* Tradition & Meaning */}
      <section className="section-spacing bg-[#D2C5AF] text-skj-charcoal">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-skj-charcoal/10">
              <Image
                src="/images/hero/hero_temple_jewellery_1791637822451.jpg"
                alt="Traditional temple jewellery highlighting Indian heritage"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.2em] text-skj-deep-olive mb-4"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                Tradition & Meaning
              </p>
              <h2
                className="text-3xl sm:text-4xl font-semibold mb-6 leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Honouring Life's <br className="hidden sm:block" /> Greatest Milestones
              </h2>
              <div className="space-y-4 text-sm text-skj-charcoal/80 leading-relaxed">
                <p>
                  Indian jewellery is steeped in significance. It is not merely an accessory, but a symbol of love, heritage, and prosperity passed down through generations.
                </p>
                <p>
                  From the heavy temple necklaces that adorn brides on their wedding day, to the delicate silver anklets given to a newborn, every piece tells a story. At Sai Praveen Jewellery, we take pride in being a part of these cherished family traditions, offering pieces that become modern heirlooms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Discover Our Collections */}
      <section className="section-spacing bg-skj-ivory">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="section-title">Discover Our Collections</h2>
            <span className="section-divider" aria-hidden="true" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/gold/women?category=Necklaces" className="group block relative aspect-[5/4] overflow-hidden rounded-2xl bg-skj-deep-olive">
              <Image
                src="/images/hero/hero_bridal_gold_1791637796095.jpg"
                alt="Gold Necklaces"
                fill
                className="object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white text-xl font-semibold mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Bridal Necklaces</h3>
                <span className="text-skj-gold text-xs font-medium uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore <ArrowRight size={14} />
                </span>
              </div>
            </Link>
            
            <Link href="/silver/men" className="group block relative aspect-[5/4] overflow-hidden rounded-2xl bg-skj-deep-olive">
              <Image
                src="/images/hero/hero_mens_collection_1791637835648.jpg"
                alt="Men's Silver Collection"
                fill
                className="object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white text-xl font-semibold mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Men's Silver</h3>
                <span className="text-skj-gold text-xs font-medium uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore <ArrowRight size={14} />
                </span>
              </div>
            </Link>

            <Link href="/silver/women" className="group block relative aspect-[5/4] overflow-hidden rounded-2xl bg-skj-deep-olive sm:hidden lg:block">
              <Image
                src="/images/hero/hero_sterling_silver_1791637808752.jpg"
                alt="Sterling Silver Masterpieces"
                fill
                className="object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white text-xl font-semibold mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Sterling Silver</h3>
                <span className="text-skj-gold text-xs font-medium uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Visit Our Store */}
      <section className="section-spacing bg-white">
        <div className="section-container">
          <div className="text-center mb-8">
            <h2 className="section-title">Visit Our Store</h2>
            <span className="section-divider" aria-hidden="true" />
          </div>
          <div className="relative w-full max-w-5xl mx-auto h-[300px] sm:h-[400px] rounded-3xl overflow-hidden shadow-sm border border-skj-border/60">
            {/* Embedded Google Map */}
            <iframe
              src="https://maps.google.com/maps?q=Sai+Praveen+Jewellery+Ravulapalem&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 grayscale-[15%] contrast-110"
              title="Sai Praveen Jewellery Location Map"
            ></iframe>
            
          </div>
        </div>
      </section>
    </div>
  );
}
