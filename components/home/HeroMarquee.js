'use client';

export default function HeroMarquee() {
  const features = [
    '100% HALLMARK CERTIFIED',
    'HANDCRAFTED DESIGNS',
    'PURE 22K GOLD',
    '925 STERLING SILVER',
    'TRUSTED BY 1000+ FAMILIES',
    'EXPERT CRAFTSMANSHIP',
  ];

  return (
    <div className="relative z-20 w-full">
      <div className="h-3 bg-[#FCF8F1] sm:h-4" aria-hidden="true" />
      <div className="h-px bg-gradient-to-r from-transparent via-[#D9AA3D]/60 to-transparent" aria-hidden="true" />

      {/* Compact brand statement bar */}
      <div className="w-full overflow-hidden border-y border-[#D9AA3D]/35 bg-gradient-to-r from-[#35141E] via-[#5B1F2A] to-[#35141E] py-2.5 text-[#FFF9EF] shadow-[0_10px_24px_rgba(91,31,42,0.12)] sm:py-3">
        <div className="flex whitespace-nowrap animate-marquee items-center">
          {/* Duplicate features array to create a seamless loop */}
          {[...features, ...features, ...features].map((feature, index) => (
            <div key={index} className="flex items-center flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-skj-gold mx-6" aria-hidden="true"></span>
              <span 
                className="text-xs sm:text-sm font-semibold tracking-widest uppercase"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .animate-marquee {
  animation: marquee 12s linear infinite;
        }
        @media (min-width: 640px) {
          .animate-marquee {
            animation-duration: 18s;
          }
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.3333%);
          }
        }
      `}</style>
    </div>
  );
}
